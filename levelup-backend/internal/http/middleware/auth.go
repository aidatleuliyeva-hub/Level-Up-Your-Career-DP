// F:\gopro\levelup-backend\internal\http\middleware\auth.go
package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"levelup-backend/internal/models"
	"levelup-backend/internal/services"
)

type contextKey string

const userContextKey contextKey = "user"

type UserContext struct {
	ID    int64           `json:"id"`
	Email string          `json:"email"`
	Role  models.UserRole `json:"role"`
}

type JWTMiddleware struct {
	auth *services.AuthService
}

func NewJWTMiddleware(auth *services.AuthService) *JWTMiddleware {
	return &JWTMiddleware{auth: auth}
}

// WithAuth — миддлвар, который проверяет JWT и кладёт данные юзера в контекст
func (m *JWTMiddleware) WithAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			writeJSONError(w, http.StatusUnauthorized, "missing or invalid Authorization header")
			return
		}

		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := m.auth.ParseToken(strings.TrimSpace(tokenStr))
		if err != nil {
			writeJSONError(w, http.StatusUnauthorized, "invalid or expired token")
			return
		}

		// Email мы храним в subject (sub)
		userCtx := &UserContext{
			ID:    claims.UserID,
			Email: claims.Subject,
			Role:  claims.Role,
		}

		ctx := context.WithValue(r.Context(), userContextKey, userCtx)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext достает данные юзера из контекста
func GetUserFromContext(ctx context.Context) (*UserContext, bool) {
	val := ctx.Value(userContextKey)
	if val == nil {
		return nil, false
	}
	u, ok := val.(*UserContext)
	return u, ok
}

func writeJSONError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(map[string]string{
		"error": msg,
	})
}
