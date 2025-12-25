// F:\gopro\levelup-backend\internal\models\user.go
package models

import "time"

type UserRole string

const (
	UserRoleStudent UserRole = "student"
	UserRoleTeacher UserRole = "teacher"
	UserRoleCompany UserRole = "company"
	UserRoleAdmin   UserRole = "admin"
)

type User struct {
	ID           int64     `db:"id"`
	Email        string    `db:"email"`
	PasswordHash string    `db:"password_hash"`
	FullName     string    `db:"full_name"`
	Role         UserRole  `db:"role"`
	CreatedAt    time.Time `db:"created_at"`
	UpdatedAt    time.Time `db:"updated_at"`
}
