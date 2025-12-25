// F:\gopro\levelup-backend\internal\services\microtask_service.go
package services

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"levelup-backend/internal/models"
	"levelup-backend/internal/repositories"
)

type MicrotaskService struct {
	repo *repositories.MicrotaskRepository
}

func NewMicrotaskService(repo *repositories.MicrotaskRepository) *MicrotaskService {
	return &MicrotaskService{repo: repo}
}

type CreateMicrotaskInput struct {
	Title         string
	Description   string
	Difficulty    string
	RewardCredits *int
	RewardAmount  *float64
	CreatorID     int64
	CreatorRole   models.UserRole
}

func (s *MicrotaskService) Create(ctx context.Context, in CreateMicrotaskInput) (*models.Microtask, error) {
	// кто может создавать: company / teacher / admin
	if in.CreatorRole != models.UserRoleCompany &&
		in.CreatorRole != models.UserRoleTeacher &&
		in.CreatorRole != models.UserRoleAdmin {
		return nil, errors.New("only company/teacher/admin can create microtasks")
	}

	if strings.TrimSpace(in.Title) == "" {
		return nil, errors.New("title is required")
	}
	if strings.TrimSpace(in.Description) == "" {
		return nil, errors.New("description is required")
	}

	mt := &models.Microtask{
		Title:       in.Title,
		Description: in.Description,
		Difficulty:  in.Difficulty,
		Status:      models.MicrotaskStatusOpen,
	}

	if in.RewardCredits != nil {
		mt.RewardCredits = in.RewardCredits
	}
	if in.RewardAmount != nil {
		mt.RewardAmount = in.RewardAmount
	}

	mt.CompanyUserID = &in.CreatorID

	if err := s.repo.Create(ctx, mt); err != nil {
		return nil, err
	}

	return mt, nil
}

func (s *MicrotaskService) ListOpen(ctx context.Context) ([]models.Microtask, error) {
	return s.repo.ListOpen(ctx)
}

func (s *MicrotaskService) ListCreatedByUser(
	ctx context.Context,
	userID int64,
	role models.UserRole,
) ([]models.Microtask, error) {
	if role != models.UserRoleTeacher &&
		role != models.UserRoleCompany &&
		role != models.UserRoleAdmin {
		return nil, errors.New("only teacher/company/admin can see their microtasks")
	}

	return s.repo.ListByCreator(ctx, userID)
}

type ApplyMicrotaskInput struct {
	MicrotaskID     int64
	StudentID       int64
	StudentRole     models.UserRole
	ApplicationText string
}

func (s *MicrotaskService) Apply(ctx context.Context, in ApplyMicrotaskInput) error {
	if in.StudentRole != models.UserRoleStudent {
		return errors.New("only students can apply for microtasks")
	}

	text := strings.TrimSpace(in.ApplicationText)
	if text == "" {
		return errors.New("application_text is required")
	}

	return s.repo.CreateApplication(ctx, in.MicrotaskID, in.StudentID, text)
}

func (s *MicrotaskService) ListStudentMicrotasks(ctx context.Context, studentID int64) ([]repositories.StudentMicrotask, error) {
	return s.repo.ListStudentMicrotasks(ctx, studentID)
}

func (s *MicrotaskService) ListApplicationsForMicrotask(
	ctx context.Context,
	microtaskID int64,
) ([]repositories.MicrotaskApplicationWithStudent, error) {
	return s.repo.ListApplicationsForMicrotask(ctx, microtaskID)
}

type UpdateApplicationStatusInput struct {
	ApplicationID int64
	ReviewerRole  models.UserRole
	NewStatus     models.MicrotaskApplicationStatus
}

func (s *MicrotaskService) UpdateApplicationStatus(
	ctx context.Context,
	in UpdateApplicationStatusInput,
) error {
	// кто может менять статусы: teacher / company / admin
	if in.ReviewerRole != models.UserRoleTeacher &&
		in.ReviewerRole != models.UserRoleCompany &&
		in.ReviewerRole != models.UserRoleAdmin {
		return errors.New("only teacher/company/admin can update microtask applications")
	}

	// допустимые значения целевого статуса
	switch in.NewStatus {
	case models.MicrotaskApplicationApplied,
		models.MicrotaskApplicationAccepted,
		models.MicrotaskApplicationRejected,
		models.MicrotaskApplicationCompleted:
		// ok
	default:
		return errors.New("invalid status")
	}

	// смотрим текущий статус заявки
	app, err := s.repo.GetApplicationByID(ctx, in.ApplicationID)
	if err != nil {
		return err
	}

	cur := app.Status
	newSt := string(in.NewStatus)

	// не даём ревьюерам возвращать в applied
	if newSt == string(models.MicrotaskApplicationApplied) {
		return errors.New("cannot set status back to applied")
	}

	// проверяем допустимые переходы
	switch cur {
	case string(models.MicrotaskApplicationApplied):
		// из applied → accepted / rejected
		if newSt != string(models.MicrotaskApplicationAccepted) &&
			newSt != string(models.MicrotaskApplicationRejected) {
			return fmt.Errorf("invalid transition from %s to %s", cur, newSt)
		}
	case string(models.MicrotaskApplicationAccepted):
		// из accepted → completed или (опционально) rejected
		if newSt != string(models.MicrotaskApplicationCompleted) &&
			newSt != string(models.MicrotaskApplicationRejected) {
			return fmt.Errorf("invalid transition from %s to %s", cur, newSt)
		}
	case string(models.MicrotaskApplicationRejected),
		string(models.MicrotaskApplicationCompleted):
		// из rejected/completed ничего менять нельзя
		return fmt.Errorf("cannot change status when current status=%s", cur)
	default:
		return fmt.Errorf("unknown current status=%s", cur)
	}

	return s.repo.UpdateApplicationStatus(ctx, in.ApplicationID, newSt)
}

type SubmitMicrotaskResultInput struct {
	ApplicationID int64
	StudentID     int64
	ResultText    string
	ResultLink    string
}

func (s *MicrotaskService) SubmitResult(
	ctx context.Context,
	in SubmitMicrotaskResultInput,
) error {
	app, err := s.repo.GetApplicationByID(ctx, in.ApplicationID)
	if err != nil {
		return err
	}

	// принадлежит ли эта заявка студенту
	if app.StudentUserID != in.StudentID {
		return fmt.Errorf("forbidden: not your application")
	}

	// можно сдавать результат только если accepted
	if app.Status != string(models.MicrotaskApplicationAccepted) {
		return fmt.Errorf("cannot submit result when status=%s", app.Status)
	}

	return s.repo.UpdateApplicationResult(
		ctx,
		in.ApplicationID,
		in.StudentID,
		in.ResultText,
		in.ResultLink,
	)
}

type UpdateMicrotaskStatusInput struct {
	MicrotaskID int64
	ActorID     int64
	ActorRole   models.UserRole
	NewStatus   models.MicrotaskStatus
}

func (s *MicrotaskService) UpdateMicrotaskStatus(
	ctx context.Context,
	in UpdateMicrotaskStatusInput,
) error {
	// кто вообще может менять статус микрозадачи
	if in.ActorRole != models.UserRoleTeacher &&
		in.ActorRole != models.UserRoleCompany &&
		in.ActorRole != models.UserRoleAdmin {
		return errors.New("only teacher/company/admin can update microtask status")
	}

	// допустимые статусы
	switch in.NewStatus {
	case models.MicrotaskStatusOpen,
		models.MicrotaskStatusClosed,
		models.MicrotaskStatusArchived:
		// ok
	default:
		return errors.New("invalid microtask status")
	}

	// достаём микрозадачу
	mt, err := s.repo.GetByID(ctx, in.MicrotaskID)
	if err != nil {
		return err
	}

	// менять может только создатель или админ
	if in.ActorRole != models.UserRoleAdmin {
		if mt.CompanyUserID == nil || *mt.CompanyUserID != in.ActorID {
			return fmt.Errorf("forbidden: only creator or admin can change microtask status")
		}
	}

	// можно из любого статуса в любой из трёх — если хочешь,
	// потом ужесточим (например, запрещать возвращать из archived в open)
	return s.repo.UpdateStatus(ctx, in.MicrotaskID, string(in.NewStatus))
}
