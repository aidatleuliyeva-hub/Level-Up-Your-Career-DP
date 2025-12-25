// F:\gopro\levelup-backend\internal\http\handlers\challenges.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	httpmw "levelup-backend/internal/http/middleware"
	"levelup-backend/internal/models"
	"levelup-backend/internal/services"
	"levelup-backend/internal/tasks"

	"github.com/go-chi/chi/v5"
)

type ChallengeHandler struct {
	svc   *services.ChallengeService
	tasks *tasks.Service
}

func NewChallengeHandler(svc *services.ChallengeService, tasksSvc *tasks.Service) *ChallengeHandler {
	return &ChallengeHandler{svc: svc, tasks: tasksSvc}
}

func (h *ChallengeHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
	Post(pattern string, handlerFn http.HandlerFunc)
}) {
	// список челленджей
	mux.Get("/challenges", h.ListPublished)
	// детальный просмотр челленджа
	mux.Get("/challenges/{id}", h.GetOne)
	// создание челленджа
	mux.Post("/challenges", h.Create)
	// студент начинает челлендж
	mux.Post("/challenges/{id}/start", h.StartAttempt)
	// студент отправляет решение
	mux.Post("/challenges/{id}/submit", h.SubmitAttempt)
	// преподаватель/компания смотрят все сабмиты по челленджу
	mux.Get("/challenges/{id}/submissions", h.ListSubmissionsForChallenge)
	// преподаватель/компания ревьюят конкретный сабмит
	mux.Post("/submissions/{attempt_id}/review", h.ReviewSubmission)
	// "мои челленджи" для студента
	mux.Get("/me/challenges", h.ListMyChallenges)
}

// === DTO ===

type createChallengeRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	ChallengeType string   `json:"challenge_type"` // academic / company
	Difficulty    string   `json:"difficulty"`
	RewardCredits *int     `json:"reward_credits"`
	RewardAmount  *float64 `json:"reward_amount"`
}

type challengeResponse struct {
	ID            int64    `json:"id"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	ChallengeType string   `json:"challenge_type"`
	Difficulty    string   `json:"difficulty"`
	RewardCredits *int     `json:"reward_credits"`
	RewardAmount  *float64 `json:"reward_amount"`
	Status        string   `json:"status"`
}

type myChallengeResponse struct {
	AttemptID     int64    `json:"attempt_id"`
	ChallengeID   int64    `json:"challenge_id"`
	Title         string   `json:"title"`
	ChallengeType string   `json:"challenge_type"`
	Difficulty    string   `json:"difficulty"`
	RewardCredits *int     `json:"reward_credits"`
	RewardAmount  *float64 `json:"reward_amount"`
	AttemptStatus string   `json:"attempt_status"`
	Grade         *int     `json:"grade"`
	Feedback      *string  `json:"feedback"`
}

type submitAttemptRequest struct {
	SubmissionText string `json:"submission_text"`
	SubmissionLink string `json:"submission_link"`
}

type submissionResponse struct {
	AttemptID       int64   `json:"attempt_id"`
	ChallengeID     int64   `json:"challenge_id"`
	StudentID       int64   `json:"student_id"`
	StudentEmail    string  `json:"student_email"`
	StudentFullName string  `json:"student_full_name"`
	Status          string  `json:"status"`
	SubmissionText  *string `json:"submission_text"`
	SubmissionLink  *string `json:"submission_link"`
	Grade           *int    `json:"grade"`
	Feedback        *string `json:"feedback"`
}

type reviewSubmissionRequest struct {
	Grade    *int   `json:"grade"`
	Feedback string `json:"feedback"`
}

// === handlers ===

func (h *ChallengeHandler) Create(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	var req createChallengeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	chType := models.ChallengeType(req.ChallengeType)
	if chType == "" {
		chType = models.ChallengeTypeAcademic
	}

	ch, err := h.svc.CreateChallenge(r.Context(), services.CreateChallengeInput{
		Title:         req.Title,
		Description:   req.Description,
		ChallengeType: chType,
		Difficulty:    req.Difficulty,
		RewardCredits: req.RewardCredits,
		RewardAmount:  req.RewardAmount,
		CreatedByID:   userCtx.ID,
		UserRole:      userCtx.Role,
	})
	if err != nil {
		switch err {
		case services.ErrChallengeForbidden:
			writeJSON(w, http.StatusForbidden, apiError{Error: "only teacher/company/admin can create challenges"})
		default:
			writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		}
		return
	}

	resp := challengeResponse{
		ID:            ch.ID,
		Title:         ch.Title,
		Description:   ch.Description,
		ChallengeType: string(ch.ChallengeType),
		Difficulty:    ch.Difficulty,
		RewardCredits: ch.RewardCredits,
		RewardAmount:  ch.RewardAmount,
		Status:        string(ch.Status),
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (h *ChallengeHandler) ListPublished(w http.ResponseWriter, r *http.Request) {
	challenges, err := h.svc.ListPublished(r.Context())
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load challenges"})
		return
	}

	resps := make([]challengeResponse, 0, len(challenges))
	for _, ch := range challenges {
		chCopy := challengeResponse{
			ID:            ch.ID,
			Title:         ch.Title,
			Description:   ch.Description,
			ChallengeType: string(ch.ChallengeType),
			Difficulty:    ch.Difficulty,
			RewardCredits: ch.RewardCredits,
			RewardAmount:  ch.RewardAmount,
			Status:        string(ch.Status),
		}
		resps = append(resps, chCopy)
	}

	writeJSON(w, http.StatusOK, resps)
}

// GET /challenges/{id}
func (h *ChallengeHandler) GetOne(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	ch, err := h.svc.GetChallenge(r.Context(), id)
	if err != nil {
		writeJSON(w, http.StatusNotFound, apiError{Error: "challenge not found"})
		return
	}

	resp := challengeResponse{
		ID:            ch.ID,
		Title:         ch.Title,
		Description:   ch.Description,
		ChallengeType: string(ch.ChallengeType),
		Difficulty:    ch.Difficulty,
		RewardCredits: ch.RewardCredits,
		RewardAmount:  ch.RewardAmount,
		Status:        string(ch.Status),
	}

	writeJSON(w, http.StatusOK, resp)
}

// POST /challenges/{id}/start
func (h *ChallengeHandler) StartAttempt(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	if err := h.svc.StartAttempt(r.Context(), id, userCtx.ID, userCtx.Role); err != nil {
		writeJSON(w, http.StatusForbidden, apiError{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "started"})
}

// GET /me/challenges
func (h *ChallengeHandler) ListMyChallenges(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	// Только студенту есть смысл показывать "Мои челленджи"
	if userCtx.Role != models.UserRoleStudent {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only students can have personal challenges list"})
		return
	}

	items, err := h.svc.ListStudentChallenges(r.Context(), userCtx.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load my challenges"})
		return
	}

	res := make([]myChallengeResponse, 0, len(items))
	for _, it := range items {
		res = append(res, myChallengeResponse{
			AttemptID:     it.AttemptID,
			ChallengeID:   it.ChallengeID,
			Title:         it.Title,
			ChallengeType: string(it.ChallengeType),
			Difficulty:    it.Difficulty,
			RewardCredits: it.RewardCredits,
			RewardAmount:  it.RewardAmount,
			AttemptStatus: it.AttemptStatus,
			Grade:         it.Grade,
			Feedback:      it.Feedback, // ← НОВОЕ
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// POST /challenges/{id}/submit
func (h *ChallengeHandler) SubmitAttempt(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "id")
	chID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	var req submitAttemptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	in := services.SubmitAttemptInput{
		ChallengeID:    chID,
		StudentID:      userCtx.ID,
		UserRole:       userCtx.Role,
		SubmissionText: req.SubmissionText,
		SubmissionLink: req.SubmissionLink,
	}

	if err := h.svc.SubmitAttempt(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "submitted",
	})
}

// GET /challenges/{id}/submissions
func (h *ChallengeHandler) ListSubmissionsForChallenge(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	// только teacher/company/admin
	if userCtx.Role != models.UserRoleTeacher &&
		userCtx.Role != models.UserRoleCompany &&
		userCtx.Role != models.UserRoleAdmin {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only teacher/company/admin can see submissions"})
		return
	}

	idStr := chi.URLParam(r, "id")
	chID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	items, err := h.svc.ListSubmissionsForChallenge(r.Context(), chID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load submissions"})
		return
	}

	res := make([]submissionResponse, 0, len(items))
	for _, it := range items {
		res = append(res, submissionResponse{
			AttemptID:       it.AttemptID,
			ChallengeID:     it.ChallengeID,
			StudentID:       it.StudentID,
			StudentEmail:    it.StudentEmail,
			StudentFullName: it.StudentFullName,
			Status:          it.Status,
			SubmissionText:  it.SubmissionText,
			SubmissionLink:  it.SubmissionLink,
			Grade:           it.Grade,
			Feedback:        it.Feedback,
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// POST /submissions/{attempt_id}/review
func (h *ChallengeHandler) ReviewSubmission(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "attempt_id")
	attemptID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid attempt_id"})
		return
	}

	var req reviewSubmissionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	in := services.ReviewSubmissionInput{
		AttemptID: attemptID,
		Reviewer:  userCtx.Role,
		Grade:     req.Grade,
		Feedback:  req.Feedback,
	}

	if err := h.svc.ReviewSubmission(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	// фоновая задача: уведомить студента о том, что его работу проверили
	_, _ = h.tasks.EnqueueJob(r.Context(), tasks.JobTypeNotifyStudent, map[string]any{
		"type":          "challenge_reviewed",
		"attempt_id":    attemptID,
		"reviewer_role": userCtx.Role,
		// сюда можно докинуть что угодно, если нужно
	})

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "reviewed",
	})
}
