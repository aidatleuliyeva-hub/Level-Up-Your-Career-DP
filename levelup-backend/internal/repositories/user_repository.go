// F:\gopro\levelup-backend\internal\repositories\user_repository.go
package repositories

import (
	"context"

	"levelup-backend/internal/models"

	"github.com/jmoiron/sqlx"
)

type UserRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
	query := `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at, updated_at
    `
	return r.db.QueryRowContext(ctx, query,
		user.Email,
		user.PasswordHash,
		user.FullName,
		user.Role,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var u models.User

	query := `
        SELECT id, email, password_hash, full_name, role, created_at, updated_at
        FROM users
        WHERE email = $1 AND deleted_at IS NULL
    `

	if err := r.db.GetContext(ctx, &u, query, email); err != nil {
		return nil, err
	}

	return &u, nil
}
