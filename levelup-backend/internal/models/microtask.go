// F:\gopro\levelup-backend\internal\models\microtask.go
package models

import "time"

type MicrotaskStatus string

const (
	MicrotaskStatusOpen     MicrotaskStatus = "open"
	MicrotaskStatusClosed   MicrotaskStatus = "closed"
	MicrotaskStatusArchived MicrotaskStatus = "archived"
)

type Microtask struct {
	ID            int64           `db:"id"`
	Title         string          `db:"title"`
	Description   string          `db:"description"`
	Difficulty    string          `db:"difficulty"`
	RewardCredits *int            `db:"reward_credits"`
	RewardAmount  *float64        `db:"reward_amount"`
	Status        MicrotaskStatus `db:"status"`
	CompanyUserID *int64          `db:"company_user_id"`
	CreatedAt     time.Time       `db:"created_at"`
	UpdatedAt     time.Time       `db:"updated_at"`
}

type MicrotaskApplicationStatus string

const (
	MicrotaskApplicationApplied   MicrotaskApplicationStatus = "applied"
	MicrotaskApplicationAccepted  MicrotaskApplicationStatus = "accepted"
	MicrotaskApplicationRejected  MicrotaskApplicationStatus = "rejected"
	MicrotaskApplicationCompleted MicrotaskApplicationStatus = "completed"
)

type MicrotaskApplication struct {
	ApplicationID   int64  `db:"application_id" json:"application_id"`
	MicrotaskID     int64  `db:"microtask_id" json:"microtask_id"`
	StudentUserID   int64  `db:"student_user_id" json:"student_user_id"`
	StudentFullName string `db:"student_full_name" json:"student_full_name"`
	StudentEmail    string `db:"student_email" json:"student_email"`
	Status          string `db:"status" json:"status"`

	// эти могут быть NULL → делаем указатели
	ApplicationText *string `db:"application_text" json:"application_text,omitempty"`
	ResultText      *string `db:"result_text" json:"result_text,omitempty"`
	ResultLink      *string `db:"result_link" json:"result_link,omitempty"`

	CreatedAt string `db:"created_at" json:"created_at"`
}
