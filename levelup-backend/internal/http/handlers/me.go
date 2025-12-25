// F:\gopro\levelup-backend\internal\http\handlers\me.go
package handlers

import (
	"net/http"

	httpmiddleware "levelup-backend/internal/http/middleware"
)

type MeHandler struct{}

func NewMeHandler() *MeHandler {
	return &MeHandler{}
}

func (h *MeHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
}) {
	mux.Get("/me", h.Me)
}

func (h *MeHandler) Me(w http.ResponseWriter, r *http.Request) {
	userCtx, ok := httpmiddleware.GetUserFromContext(r.Context())
	if !ok {
		writeJSON(w, http.StatusUnauthorized, apiError{Error: "no user in context"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"id":    userCtx.ID,
		"email": userCtx.Email,
		"role":  userCtx.Role,
	})
}
