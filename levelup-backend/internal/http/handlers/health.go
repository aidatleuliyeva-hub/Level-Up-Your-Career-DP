// F:\gopro\levelup-backend\internal\http\handlers\health.go
package handlers

import (
	"net/http"

	"github.com/jmoiron/sqlx"
)

type HealthHandler struct {
	DB *sqlx.DB
}

func NewHealthHandler(db *sqlx.DB) *HealthHandler {
	return &HealthHandler{DB: db}
}

func (h *HealthHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
}) {
	mux.Get("/health", h.Health)
}

func (h *HealthHandler) Health(w http.ResponseWriter, r *http.Request) {
	// Можно проверить базу
	if err := h.DB.Ping(); err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		_, _ = w.Write([]byte(`{"status":"db_unavailable"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}
