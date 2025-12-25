// F:\gopro\levelup-backend\internal\http\handlers\auth.go
package handlers

import (
	"encoding/json"
	"net/http"

	"levelup-backend/internal/models"
	"levelup-backend/internal/services"
)

type AuthHandler struct {
	auth *services.AuthService
}

func NewAuthHandler(auth *services.AuthService) *AuthHandler {
	return &AuthHandler{auth: auth}
}

func (h *AuthHandler) RegisterRoutes(mux interface {
	Post(pattern string, handlerFn http.HandlerFunc)
}) {
	mux.Post("/auth/register", h.Register)
	mux.Post("/auth/login", h.Login)
}

type registerRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
	Role     string `json:"role"` // необязательное поле, дефолт student
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type userResponse struct {
	ID       int64  `json:"id"`
	Email    string `json:"email"`
	FullName string `json:"full_name"`
	Role     string `json:"role"`
}

type loginResponse struct {
	User  userResponse `json:"user"`
	Token string       `json:"token"`
}

type apiError struct {
	Error string `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req registerRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	// ВСЕГДА студент
	role := models.UserRoleStudent

	user, err := h.auth.Register(
		r.Context(),
		services.RegisterInput{
			Email:    req.Email,
			Password: req.Password,
			FullName: req.FullName,
			Role:     role,
		},
	)
	if err != nil {
		switch err {
		case services.ErrEmailAlreadyExists:
			writeJSON(w, http.StatusConflict, apiError{Error: "email already in use"})
		default:
			writeJSON(w, http.StatusBadRequest, apiError{Error: err.Error()})
		}
		return
	}

	resp := userResponse{
		ID:       user.ID,
		Email:    user.Email,
		FullName: user.FullName,
		Role:     string(user.Role),
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req loginRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, apiError{Error: "invalid JSON"})
		return
	}

	user, err := h.auth.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		if err == services.ErrInvalidCredentials {
			writeJSON(w, http.StatusUnauthorized, apiError{Error: "invalid email or password"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "internal error"})
		return
	}

	token, err := h.auth.GenerateToken(user)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, apiError{Error: "failed to generate token"})
		return
	}

	resp := loginResponse{
		User: userResponse{
			ID:       user.ID,
			Email:    user.Email,
			FullName: user.FullName,
			Role:     string(user.Role),
		},
		Token: token,
	}

	writeJSON(w, http.StatusOK, resp)
}
