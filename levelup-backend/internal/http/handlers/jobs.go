// F:\gopro\levelup-backend\internal\http\handlers\jobs.go
package handlers

import (
	"net/http"
	"strconv"

	"levelup-backend/internal/tasks"
)

type JobsHandler struct {
	repo *tasks.Repository
}

func NewJobsHandler(repo *tasks.Repository) *JobsHandler {
	return &JobsHandler{repo: repo}
}

func (h *JobsHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
}) {
	mux.Get("/jobs", h.List)
}

func (h *JobsHandler) List(w http.ResponseWriter, r *http.Request) {
	limit := 50
	if lStr := r.URL.Query().Get("limit"); lStr != "" {
		if l, err := strconv.Atoi(lStr); err == nil && l > 0 && l <= 200 {
			limit = l
		}
	}

	jobs, err := h.repo.ListLastN(r.Context(), limit)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to load jobs"})
		return
	}

	// 👇 вот это добавляем, чтобы не было null
	if jobs == nil {
		jobs = []tasks.Job{}
	}

	writeJSON(w, http.StatusOK, jobs)
}
