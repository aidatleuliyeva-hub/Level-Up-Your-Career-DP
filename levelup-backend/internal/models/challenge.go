// F:\gopro\levelup-backend\internal\models\challenge.go
package models

import "time"

type ChallengeStatus string
type ChallengeType string

const (
	ChallengeStatusDraft     ChallengeStatus = "draft"
	ChallengeStatusPublished ChallengeStatus = "published"
	ChallengeStatusArchived  ChallengeStatus = "archived"

	ChallengeTypeAcademic ChallengeType = "academic"
	ChallengeTypeCompany  ChallengeType = "company"
)

type Challenge struct {
	ID              int64           `db:"id"`
	Title           string          `db:"title"`
	Description     string          `db:"description"`
	ChallengeType   ChallengeType   `db:"challenge_type"`
	Difficulty      string          `db:"difficulty"`
	RewardCredits   *int            `db:"reward_credits"`
	RewardAmount    *float64        `db:"reward_amount"`
	Status          ChallengeStatus `db:"status"`
	CreatedByUserID int64           `db:"created_by_user_id"`
	CreatedAt       time.Time       `db:"created_at"`
	UpdatedAt       time.Time       `db:"updated_at"`
}
