// F:\gopro\levelup-backend\internal\repositories\challenge_repository.go
package repositories

import (
	"context"
	"errors"
	"time"

	"levelup-backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type ChallengeRepository struct {
	db *sqlx.DB
}

func NewChallengeRepository(db *sqlx.DB) *ChallengeRepository {
	return &ChallengeRepository{db: db}
}

func (r *ChallengeRepository) Create(ctx context.Context, ch *models.Challenge) error {
	query := `
		INSERT INTO challenges
			(title, description, challenge_type, difficulty, reward_credits, reward_amount, status, created_by_user_id)
		VALUES
			($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`

	return r.db.QueryRowContext(
		ctx,
		query,
		ch.Title,
		ch.Description,
		ch.ChallengeType,
		ch.Difficulty,
		ch.RewardCredits,
		ch.RewardAmount,
		ch.Status,
		ch.CreatedByUserID,
	).Scan(&ch.ID, &ch.CreatedAt, &ch.UpdatedAt)
}

// Список только опубликованных челленджей (для студентов и т.п.)
func (r *ChallengeRepository) ListPublished(ctx context.Context) ([]models.Challenge, error) {
	var result []models.Challenge

	query := `
		SELECT
			id, title, description, challenge_type, difficulty,
			reward_credits, reward_amount, status, created_by_user_id,
			created_at, updated_at
		FROM challenges
		WHERE status = 'published' AND deleted_at IS NULL
		ORDER BY created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *ChallengeRepository) GetByID(ctx context.Context, id int64) (*models.Challenge, error) {
	var ch models.Challenge

	query := `
		SELECT
			id, title, description, challenge_type, difficulty,
			reward_credits, reward_amount, status, created_by_user_id,
			created_at, updated_at
		FROM challenges
		WHERE id = $1 AND deleted_at IS NULL
	`

	if err := r.db.GetContext(ctx, &ch, query, id); err != nil {
		return nil, err
	}

	return &ch, nil
}

// студент начинает участие в челлендже
func (r *ChallengeRepository) StartAttempt(ctx context.Context, challengeID int64, studentID int64) error {
	query := `
		INSERT INTO challenge_attempts (challenge_id, student_user_id)
		VALUES ($1, $2)
		ON CONFLICT (challenge_id, student_user_id) DO NOTHING
	`
	_, err := r.db.ExecContext(ctx, query, challengeID, studentID)
	return err
}

// Строка для "моих челленджей" студента
type StudentChallenge struct {
	AttemptID     int64                `db:"attempt_id"`
	ChallengeID   int64                `db:"challenge_id"`
	Title         string               `db:"title"`
	Description   string               `db:"description"`
	ChallengeType models.ChallengeType `db:"challenge_type"`
	Difficulty    string               `db:"difficulty"`
	RewardCredits *int                 `db:"reward_credits"`
	RewardAmount  *float64             `db:"reward_amount"`
	AttemptStatus string               `db:"attempt_status"` // started / submitted / reviewed
	Grade         *int                 `db:"grade"`
	Feedback      *string              `db:"feedback"` // ← НОВОЕ
	CreatedAt     time.Time            `db:"created_at"`
}

// Список челленджей для конкретного студента
func (r *ChallengeRepository) ListStudentChallenges(ctx context.Context, studentID int64) ([]StudentChallenge, error) {
	var result []StudentChallenge

	query := `
		SELECT
			ca.id            AS attempt_id,
			c.id             AS challenge_id,
			c.title,
			c.description,
			c.challenge_type,
			c.difficulty,
			c.reward_credits,
			c.reward_amount,
			ca.status        AS attempt_status,
			ca.grade,
			ca.feedback,                 -- ← НОВОЕ
			ca.created_at
		FROM challenge_attempts ca
		JOIN challenges c ON c.id = ca.challenge_id
		WHERE ca.student_user_id = $1
		ORDER BY ca.created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query, studentID); err != nil {
		return nil, err
	}

	return result, nil
}

// Сабмит студента по челленджу (для преподавателя/компании)
type ChallengeSubmission struct {
	AttemptID       int64      `db:"attempt_id"`
	ChallengeID     int64      `db:"challenge_id"`
	StudentID       int64      `db:"student_user_id"`
	StudentEmail    string     `db:"student_email"`
	StudentFullName string     `db:"student_full_name"`
	Status          string     `db:"status"` // started / submitted / reviewed
	SubmissionText  *string    `db:"submission_text"`
	SubmissionLink  *string    `db:"submission_link"`
	Grade           *int       `db:"grade"`
	Feedback        *string    `db:"feedback"`
	SubmittedAt     *time.Time `db:"submitted_at"`
	CreatedAt       time.Time  `db:"created_at"`
}

// Все сабмиты по конкретному челленджу
func (r *ChallengeRepository) ListSubmissionsForChallenge(ctx context.Context, challengeID int64) ([]ChallengeSubmission, error) {
	var result []ChallengeSubmission

	query := `
		SELECT
			ca.id              AS attempt_id,
			ca.challenge_id    AS challenge_id,
			ca.student_user_id AS student_user_id,
			u.email            AS student_email,
			u.full_name        AS student_full_name,
			ca.status          AS status,
			ca.submission_text,
			ca.submission_link,
			ca.grade,
			ca.feedback,
			ca.submitted_at,
			ca.created_at
		FROM challenge_attempts ca
		JOIN users u ON u.id = ca.student_user_id
		WHERE ca.challenge_id = $1
		  AND ca.status IN ('submitted','reviewed')
		ORDER BY ca.submitted_at DESC NULLS LAST, ca.created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query, challengeID); err != nil {
		return nil, err
	}

	return result, nil
}

// Обновление оценки/фидбэка по попытке
func (r *ChallengeRepository) ReviewSubmission(
	ctx context.Context,
	attemptID int64,
	grade *int,
	feedback string,
) error {
	query := `
		UPDATE challenge_attempts
		SET
			grade       = $2,
			feedback    = $3,
			status      = 'reviewed',
			reviewed_at = NOW(),
			updated_at  = NOW()
		WHERE id = $1
	`

	res, err := r.db.ExecContext(ctx, query, attemptID, grade, feedback)
	if err != nil {
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return errors.New("submission not found")
	}

	return nil
}

// Студент отправляет решение по челленджу
func (r *ChallengeRepository) SubmitAttempt(
	ctx context.Context,
	challengeID int64,
	studentID int64,
	submissionText string,
	submissionLink string,
) error {
	query := `
		UPDATE challenge_attempts
		SET
			submission_text = $3,
			submission_link = $4,
			status = 'submitted',
			submitted_at = NOW(),
			updated_at = NOW()
		WHERE challenge_id = $1
		  AND student_user_id = $2
	`

	result, err := r.db.ExecContext(ctx, query, challengeID, studentID, submissionText, submissionLink)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		// студент ещё не нажимал "Начать участие"
		return errors.New("attempt not found, start challenge first")
	}

	return nil
}
