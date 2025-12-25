// F:\gopro\levelup-backend\internal\services\challenge_service.go
package services

import (
	"context"
	"errors"
	"strings"

	"levelup-backend/internal/models"
	"levelup-backend/internal/repositories"
)

var (
	ErrChallengeForbidden = errors.New("forbidden")
)

type ChallengeService struct {
	repo *repositories.ChallengeRepository
}

func NewChallengeService(repo *repositories.ChallengeRepository) *ChallengeService {
	return &ChallengeService{repo: repo}
}

type CreateChallengeInput struct {
	Title         string
	Description   string
	ChallengeType models.ChallengeType
	Difficulty    string
	RewardCredits *int
	RewardAmount  *float64
	CreatedByID   int64
	UserRole      models.UserRole
}

type SubmitAttemptInput struct {
	ChallengeID    int64
	StudentID      int64
	UserRole       models.UserRole
	SubmissionText string
	SubmissionLink string
}

// Кто может создавать челленджи: teacher, company, admin
func canCreateChallenges(role models.UserRole) bool {
	switch role {
	case models.UserRoleTeacher, models.UserRoleCompany, models.UserRoleAdmin:
		return true
	default:
		return false
	}
}

func (s *ChallengeService) CreateChallenge(ctx context.Context, in CreateChallengeInput) (*models.Challenge, error) {
	if !canCreateChallenges(in.UserRole) {
		return nil, ErrChallengeForbidden
	}

	in.Title = strings.TrimSpace(in.Title)
	in.Description = strings.TrimSpace(in.Description)
	in.Difficulty = strings.TrimSpace(in.Difficulty)

	if in.Title == "" || in.Description == "" {
		return nil, errors.New("title and description are required")
	}

	if in.ChallengeType == "" {
		in.ChallengeType = models.ChallengeTypeAcademic
	}

	ch := &models.Challenge{
		Title:           in.Title,
		Description:     in.Description,
		ChallengeType:   in.ChallengeType,
		Difficulty:      in.Difficulty,
		RewardCredits:   in.RewardCredits,
		RewardAmount:    in.RewardAmount,
		Status:          models.ChallengeStatusPublished, // сразу публикация для прототипа
		CreatedByUserID: in.CreatedByID,
	}

	if err := s.repo.Create(ctx, ch); err != nil {
		return nil, err
	}

	return ch, nil
}

func (s *ChallengeService) ListPublished(ctx context.Context) ([]models.Challenge, error) {
	return s.repo.ListPublished(ctx)
}

func (s *ChallengeService) GetChallenge(ctx context.Context, id int64) (*models.Challenge, error) {
	return s.repo.GetByID(ctx, id)
}

// кто может создавать челленджи у тебя уже есть — ту же логику можно использовать для StartAttempt
func (s *ChallengeService) StartAttempt(ctx context.Context, challengeID, studentID int64, role models.UserRole) error {
	if role != models.UserRoleStudent {
		return errors.New("only students can start challenges")
	}
	return s.repo.StartAttempt(ctx, challengeID, studentID)
}

// Список челленджей студента (по его id)
func (s *ChallengeService) ListStudentChallenges(ctx context.Context, studentID int64) ([]repositories.StudentChallenge, error) {
	return s.repo.ListStudentChallenges(ctx, studentID)
}

// Сабмиты по челленджу (для преподавателя/компании/admin)
func (s *ChallengeService) ListSubmissionsForChallenge(ctx context.Context, challengeID int64) ([]repositories.ChallengeSubmission, error) {
	return s.repo.ListSubmissionsForChallenge(ctx, challengeID)
}

type ReviewSubmissionInput struct {
	AttemptID int64
	Reviewer  models.UserRole
	Grade     *int
	Feedback  string
}

func (s *ChallengeService) ReviewSubmission(ctx context.Context, in ReviewSubmissionInput) error {
	if in.Reviewer != models.UserRoleTeacher &&
		in.Reviewer != models.UserRoleCompany &&
		in.Reviewer != models.UserRoleAdmin {
		return errors.New("only teacher/company/admin can review submissions")
	}

	// базовая валидация оценки
	if in.Grade != nil {
		if *in.Grade < 0 || *in.Grade > 100 {
			return errors.New("grade must be between 0 and 100")
		}
	}

	return s.repo.ReviewSubmission(ctx, in.AttemptID, in.Grade, in.Feedback)
}

func (s *ChallengeService) SubmitAttempt(ctx context.Context, in SubmitAttemptInput) error {
	if in.UserRole != models.UserRoleStudent {
		return errors.New("only students can submit challenges")
	}

	if strings.TrimSpace(in.SubmissionText) == "" && strings.TrimSpace(in.SubmissionLink) == "" {
		return errors.New("submission_text or submission_link is required")
	}

	return s.repo.SubmitAttempt(ctx, in.ChallengeID, in.StudentID, in.SubmissionText, in.SubmissionLink)
}
