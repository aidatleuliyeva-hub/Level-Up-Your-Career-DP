// F:\gopro\levelup-backend\internal\http\handlers\microtasks.go
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

type MicrotaskHandler struct {
	svc   *services.MicrotaskService
	tasks *tasks.Service
}

func NewMicrotaskHandler(svc *services.MicrotaskService, tasksSvc *tasks.Service) *MicrotaskHandler {
	return &MicrotaskHandler{svc: svc, tasks: tasksSvc}
}

func (h *MicrotaskHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
	Post(pattern string, handlerFn http.HandlerFunc)
}) {
	// список открытых микрозадач
	mux.Get("/microtasks", h.ListOpen)
	// создание микрозадачи (company / teacher / admin)
	mux.Post("/microtasks", h.Create)
	// студент откликается
	mux.Post("/microtasks/{id}/apply", h.Apply)
	// "мои микрозадачи" студента
	mux.Get("/me/microtasks", h.ListStudentMicrotasks)
	// микрозадачи, созданные текущим пользователем (teacher/company/admin)
	mux.Get("/me/microtasks/created", h.ListCreatedByMe)
	// отклики по микрозадаче (для company/teacher/admin)
	mux.Get("/microtasks/{id}/applications", h.ListApplicationsForMicrotask)
	// смена статуса отклика
	mux.Post("/microtask-applications/{id}/status", h.UpdateApplicationStatus)
	// смена статуса микрозадачи
	mux.Post("/microtasks/{id}/status", h.UpdateMicrotaskStatus)
	// студент сдаёт результат по отклику
	mux.Post("/microtask-applications/{id}/submit-result", h.SubmitResult)
}

type microtaskResponse struct {
	ID            int64    `json:"id"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Difficulty    string   `json:"difficulty"`
	RewardCredits *int     `json:"reward_credits"`
	RewardAmount  *float64 `json:"reward_amount"`
	Status        string   `json:"status"`
}

type createMicrotaskRequest struct {
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Difficulty    string   `json:"difficulty"`
	RewardCredits *int     `json:"reward_credits"`
	RewardAmount  *float64 `json:"reward_amount"`
}

type applyMicrotaskRequest struct {
	ApplicationText string `json:"application_text"`
}

type studentMicrotaskResponse struct {
	ApplicationID     int64    `json:"application_id"`
	MicrotaskID       int64    `json:"microtask_id"`
	Title             string   `json:"title"`
	Description       string   `json:"description"`
	Difficulty        string   `json:"difficulty"`
	RewardCredits     *int     `json:"reward_credits"`
	RewardAmount      *float64 `json:"reward_amount"`
	ApplicationStatus string   `json:"application_status"`

	ApplicationText *string `json:"application_text,omitempty"`
	ResultText      *string `json:"result_text,omitempty"`
	ResultLink      *string `json:"result_link,omitempty"`
}

type microtaskApplicationResponse struct {
	ApplicationID   int64   `json:"application_id"`
	MicrotaskID     int64   `json:"microtask_id"`
	StudentUserID   int64   `json:"student_user_id"`
	StudentFullName string  `json:"student_full_name"`
	StudentEmail    string  `json:"student_email"`
	Status          string  `json:"status"`
	ApplicationText *string `json:"application_text,omitempty"`
	ResultText      *string `json:"result_text,omitempty"`
	ResultLink      *string `json:"result_link,omitempty"`
	CreatedAt       string  `json:"created_at"`
}

type updateApplicationStatusRequest struct {
	Status string `json:"status"` // applied / accepted / rejected / completed
}

type updateMicrotaskStatusRequest struct {
	Status string `json:"status"` // open / closed / archived
}

type submitResultRequest struct {
	ResultText string `json:"result_text"`
	ResultLink string `json:"result_link"`
}

// GET /microtasks
func (h *MicrotaskHandler) ListOpen(w http.ResponseWriter, r *http.Request) {
	items, err := h.svc.ListOpen(r.Context())
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load microtasks"})
		return
	}

	res := make([]microtaskResponse, 0, len(items))
	for _, it := range items {
		res = append(res, microtaskResponse{
			ID:            it.ID,
			Title:         it.Title,
			Description:   it.Description,
			Difficulty:    it.Difficulty,
			RewardCredits: it.RewardCredits,
			RewardAmount:  it.RewardAmount,
			Status:        string(it.Status),
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// POST /microtasks
func (h *MicrotaskHandler) Create(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	var req createMicrotaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	in := services.CreateMicrotaskInput{
		Title:       req.Title,
		Description: req.Description,
		Difficulty:  req.Difficulty,
		CreatorID:   userCtx.ID,
		CreatorRole: userCtx.Role,
	}

	if req.RewardCredits != nil {
		in.RewardCredits = req.RewardCredits
	}
	if req.RewardAmount != nil {
		in.RewardAmount = req.RewardAmount
	}

	mt, err := h.svc.Create(r.Context(), in)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusCreated, microtaskResponse{
		ID:            mt.ID,
		Title:         mt.Title,
		Description:   mt.Description,
		Difficulty:    mt.Difficulty,
		RewardCredits: mt.RewardCredits,
		RewardAmount:  mt.RewardAmount,
		Status:        string(mt.Status),
	})
}

// POST /microtasks/{id}/apply
func (h *MicrotaskHandler) Apply(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "id")
	mtID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	var req applyMicrotaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	in := services.ApplyMicrotaskInput{
		MicrotaskID:     mtID,
		StudentID:       userCtx.ID,
		StudentRole:     userCtx.Role,
		ApplicationText: req.ApplicationText,
	}

	if err := h.svc.Apply(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "applied",
	})
}

// GET /me/microtasks
func (h *MicrotaskHandler) ListStudentMicrotasks(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	if userCtx.Role != models.UserRoleStudent {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only student can see their microtasks"})
		return
	}

	items, err := h.svc.ListStudentMicrotasks(r.Context(), userCtx.ID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load student microtasks"})
		return
	}

	res := make([]studentMicrotaskResponse, 0, len(items))
	for _, it := range items {
		res = append(res, studentMicrotaskResponse{
			ApplicationID:     it.ApplicationID,
			MicrotaskID:       it.MicrotaskID,
			Title:             it.Title,
			Description:       it.Description,
			Difficulty:        it.Difficulty,
			RewardCredits:     it.RewardCredits,
			RewardAmount:      it.RewardAmount,
			ApplicationStatus: it.ApplicationStatus,
			ApplicationText:   it.ApplicationText,
			ResultText:        it.ResultText,
			ResultLink:        it.ResultLink,
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// GET /me/microtasks/created
func (h *MicrotaskHandler) ListCreatedByMe(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	if userCtx.Role != models.UserRoleTeacher &&
		userCtx.Role != models.UserRoleCompany &&
		userCtx.Role != models.UserRoleAdmin {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only teacher/company/admin can see their microtasks"})
		return
	}

	items, err := h.svc.ListCreatedByUser(r.Context(), userCtx.ID, userCtx.Role)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load created microtasks"})
		return
	}

	res := make([]microtaskResponse, 0, len(items))
	for _, it := range items {
		res = append(res, microtaskResponse{
			ID:            it.ID,
			Title:         it.Title,
			Description:   it.Description,
			Difficulty:    it.Difficulty,
			RewardCredits: it.RewardCredits,
			RewardAmount:  it.RewardAmount,
			Status:        string(it.Status),
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// GET /microtasks/{id}/applications
func (h *MicrotaskHandler) ListApplicationsForMicrotask(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	// только teacher / company / admin
	if userCtx.Role != models.UserRoleTeacher &&
		userCtx.Role != models.UserRoleCompany &&
		userCtx.Role != models.UserRoleAdmin {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only teacher/company/admin can see applications"})
		return
	}

	idStr := chi.URLParam(r, "id")
	mtID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	items, err := h.svc.ListApplicationsForMicrotask(r.Context(), mtID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load applications"})
		return
	}

	res := make([]microtaskApplicationResponse, 0, len(items))
	for _, it := range items {
		res = append(res, microtaskApplicationResponse{
			ApplicationID:   it.ApplicationID,
			MicrotaskID:     it.MicrotaskID,
			StudentUserID:   it.StudentUserID,
			StudentFullName: it.StudentFullName,
			StudentEmail:    it.StudentEmail,
			Status:          it.Status,
			ApplicationText: it.ApplicationText,
			ResultText:      it.ResultText,
			ResultLink:      it.ResultLink,
			CreatedAt:       it.CreatedAt,
		})
	}

	writeJSON(w, http.StatusOK, res)
}

// POST /microtask-applications/{id}/status
func (h *MicrotaskHandler) UpdateApplicationStatus(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "id")
	appID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	var req updateApplicationStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	status := models.MicrotaskApplicationStatus(req.Status)

	in := services.UpdateApplicationStatusInput{
		ApplicationID: appID,
		ReviewerRole:  userCtx.Role,
		NewStatus:     status,
	}

	if err := h.svc.UpdateApplicationStatus(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	// фоновая задача: уведомить студента о смене статуса
	_, _ = h.tasks.EnqueueJob(r.Context(), tasks.JobTypeNotifyStudent, map[string]any{
		"type":           "microtask_application_status_changed",
		"application_id": appID,
		"new_status":     status,
	})

	writeJSON(w, http.StatusOK, map[string]string{
		"status": string(status),
	})

}

// POST /microtasks/{id}/status
func (h *MicrotaskHandler) UpdateMicrotaskStatus(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	idStr := chi.URLParam(r, "id")
	mtID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	var req updateMicrotaskStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	status := models.MicrotaskStatus(req.Status)

	in := services.UpdateMicrotaskStatusInput{
		MicrotaskID: mtID,
		ActorID:     userCtx.ID,
		ActorRole:   userCtx.Role,
		NewStatus:   status,
	}

	if err := h.svc.UpdateMicrotaskStatus(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{
		"status": string(status),
	})
}

// POST /microtask-applications/{id}/submit-result
func (h *MicrotaskHandler) SubmitResult(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmw.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "unauthorized"})
		return
	}

	if userCtx.Role != models.UserRoleStudent {
		writeJSON(w, http.StatusForbidden, apiError{Error: "only student can submit result"})
		return
	}

	idStr := chi.URLParam(r, "id")
	appID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid id"})
		return
	}

	var req submitResultRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	in := services.SubmitMicrotaskResultInput{
		ApplicationID: appID,
		StudentID:     userCtx.ID,
		ResultText:    req.ResultText,
		ResultLink:    req.ResultLink,
	}

	if err := h.svc.SubmitResult(r.Context(), in); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		return
	}

	// фоновая задача: уведомить создателя микрозадачи, что студент сдал результат
	_, _ = h.tasks.EnqueueJob(r.Context(), tasks.JobTypeNotifyTeacher, map[string]any{
		"type":           "microtask_result_submitted",
		"application_id": appID,
		"student_id":     userCtx.ID,
	})

	writeJSON(w, http.StatusOK, map[string]string{
		"status": "result_submitted",
	})
}
