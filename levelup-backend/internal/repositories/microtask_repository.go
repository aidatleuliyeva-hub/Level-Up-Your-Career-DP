// F:\gopro\levelup-backend\internal\repositories\microtask_repository.go
package repositories

import (
	"context"
	"database/sql"

	"levelup-backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type MicrotaskRepository struct {
	db *sqlx.DB
}

func NewMicrotaskRepository(db *sqlx.DB) *MicrotaskRepository {
	return &MicrotaskRepository{db: db}
}

// Создать микрозадачу (для роли company/teacher/admin)
func (r *MicrotaskRepository) Create(ctx context.Context, mt *models.Microtask) error {
	query := `
		INSERT INTO microtasks (
			title,
			description,
			difficulty,
			reward_credits,
			reward_amount,
			status,
			company_user_id
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7)
		RETURNING
			id,
			created_at,
			updated_at
	`

	return r.db.QueryRowContext(
		ctx,
		query,
		mt.Title,
		mt.Description,
		mt.Difficulty,
		mt.RewardCredits,
		mt.RewardAmount,
		mt.Status,
		mt.CompanyUserID,
	).Scan(&mt.ID, &mt.CreatedAt, &mt.UpdatedAt)
}

// Список открытых микрозадач (для студентов и всех)
func (r *MicrotaskRepository) ListOpen(ctx context.Context) ([]models.Microtask, error) {
	var result []models.Microtask

	query := `
		SELECT
			id,
			title,
			description,
			difficulty,
			reward_credits,
			reward_amount,
			status,
			company_user_id,
			created_at,
			updated_at
		FROM microtasks
		WHERE status = 'open'
		ORDER BY created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query); err != nil {
		return nil, err
	}

	return result, nil
}

// Студент откликается на микрозадачу
func (r *MicrotaskRepository) CreateApplication(
	ctx context.Context,
	microtaskID int64,
	studentID int64,
	applicationText string,
) error {
	query := `
		INSERT INTO microtask_applications (
			microtask_id,
			student_user_id,
			application_text,
			status
		)
		VALUES ($1,$2,$3,'applied')
		ON CONFLICT (microtask_id, student_user_id)
		DO UPDATE SET
			application_text = EXCLUDED.application_text,
			status = 'applied',
			updated_at = NOW()
	`

	_, err := r.db.ExecContext(ctx, query, microtaskID, studentID, applicationText)
	return err
}

// "Мои микрозадачи" для студента (его отклики)
type StudentMicrotask struct {
	ApplicationID     int64    `db:"application_id"`
	MicrotaskID       int64    `db:"microtask_id"`
	Title             string   `db:"title"`
	Description       string   `db:"description"`
	Difficulty        string   `db:"difficulty"`
	RewardCredits     *int     `db:"reward_credits"`
	RewardAmount      *float64 `db:"reward_amount"`
	ApplicationStatus string   `db:"application_status"`

	ApplicationText *string `db:"application_text"`
	ResultText      *string `db:"result_text"`
	ResultLink      *string `db:"result_link"`
}

func (r *MicrotaskRepository) ListStudentMicrotasks(ctx context.Context, studentID int64) ([]StudentMicrotask, error) {
	var result []StudentMicrotask

	query := `
		SELECT
			ma.id          AS application_id,
			mt.id          AS microtask_id,
			mt.title,
			mt.description,
			mt.difficulty,
			mt.reward_credits,
			mt.reward_amount,
			ma.status      AS application_status,
			ma.application_text,
			ma.result_text,
			ma.result_link
		FROM microtask_applications ma
		JOIN microtasks mt ON mt.id = ma.microtask_id
		WHERE ma.student_user_id = $1
		ORDER BY ma.created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query, studentID); err != nil {
		return nil, err
	}

	return result, nil
}

type MicrotaskApplicationWithStudent struct {
	ApplicationID   int64   `db:"application_id"`
	MicrotaskID     int64   `db:"microtask_id"`
	StudentUserID   int64   `db:"student_user_id"`
	StudentFullName string  `db:"student_full_name"`
	StudentEmail    string  `db:"student_email"`
	Status          string  `db:"status"`
	ApplicationText *string `db:"application_text"`
	ResultText      *string `db:"result_text"`
	ResultLink      *string `db:"result_link"`
	CreatedAt       string  `db:"created_at"`
}

func (r *MicrotaskRepository) ListApplicationsForMicrotask(
	ctx context.Context,
	microtaskID int64,
) ([]MicrotaskApplicationWithStudent, error) {
	var result []MicrotaskApplicationWithStudent

	query := `
		SELECT
			ma.id               AS application_id,
			ma.microtask_id     AS microtask_id,
			ma.student_user_id  AS student_user_id,
			u.full_name         AS student_full_name,
			u.email             AS student_email,
			ma.status           AS status,
			ma.application_text AS application_text,
			ma.result_text      AS result_text,
			ma.result_link      AS result_link,
			ma.created_at       AS created_at
		FROM microtask_applications ma
		JOIN users u ON u.id = ma.student_user_id
		WHERE ma.microtask_id = $1
		ORDER BY ma.created_at DESC
	`

	if err := r.db.SelectContext(ctx, &result, query, microtaskID); err != nil {
		return nil, err
	}

	return result, nil
}

func (r *MicrotaskRepository) UpdateApplicationStatus(
	ctx context.Context,
	applicationID int64,
	newStatus string,
) error {
	query := `
		UPDATE microtask_applications
		SET status = $2,
		    updated_at = NOW()
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query, applicationID, newStatus)
	return err
}

func (r *MicrotaskRepository) GetApplicationByID(
	ctx context.Context,
	applicationID int64,
) (models.MicrotaskApplication, error) {
	const q = `
        SELECT
            ma.id              AS application_id,
            ma.microtask_id    AS microtask_id,
            ma.student_user_id AS student_user_id,
            u.full_name        AS student_full_name,
            u.email            AS student_email,
            ma.status          AS status,
            ma.application_text,
            ma.result_text,
            ma.result_link,
            ma.created_at::text AS created_at
        FROM microtask_applications ma
        JOIN users u ON u.id = ma.student_user_id
        WHERE ma.id = $1
    `

	var app models.MicrotaskApplication
	err := r.db.GetContext(ctx, &app, q, applicationID)
	if err != nil {
		return models.MicrotaskApplication{}, err
	}
	return app, nil
}

func (r *MicrotaskRepository) UpdateApplicationResult(
	ctx context.Context,
	applicationID int64,
	studentID int64,
	resultText string,
	resultLink string,
) error {
	const q = `
        UPDATE microtask_applications
        SET result_text = $1,
            result_link = $2,
            updated_at  = now()
        WHERE id = $3 AND student_user_id = $4
    `
	res, err := r.db.ExecContext(ctx, q,
		resultText,
		resultLink,
		applicationID,
		studentID,
	)
	if err != nil {
		return err
	}

	n, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return sql.ErrNoRows
	}
	return nil
}

// Получить одну микрозадачу по id
func (r *MicrotaskRepository) GetByID(ctx context.Context, id int64) (models.Microtask, error) {
	const q = `
		SELECT
			id,
			title,
			description,
			difficulty,
			reward_credits,
			reward_amount,
			status,
			company_user_id,
			created_at,
			updated_at
		FROM microtasks
		WHERE id = $1
	`

	var mt models.Microtask
	if err := r.db.GetContext(ctx, &mt, q, id); err != nil {
		return models.Microtask{}, err
	}
	return mt, nil
}

// Список микрозадач, созданных конкретным пользователем (teacher/company/admin)
func (r *MicrotaskRepository) ListByCreator(ctx context.Context, creatorID int64) ([]models.Microtask, error) {
	const q = `
		SELECT
			id,
			title,
			description,
			difficulty,
			reward_credits,
			reward_amount,
			status,
			company_user_id,
			created_at,
			updated_at
		FROM microtasks
		WHERE company_user_id = $1
		ORDER BY created_at DESC
	`

	var res []models.Microtask
	if err := r.db.SelectContext(ctx, &res, q, creatorID); err != nil {
		return nil, err
	}
	return res, nil
}

// Обновить статус микрозадачи
func (r *MicrotaskRepository) UpdateStatus(ctx context.Context, id int64, newStatus string) error {
	const q = `
		UPDATE microtasks
		SET status = $2,
		    updated_at = NOW()
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, q, id, newStatus)
	return err
}
