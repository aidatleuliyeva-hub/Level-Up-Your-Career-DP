// F:\gopro\levelup-backend\internal\tasks\repository.go
package tasks

import (
	"context"
	"time"

	"github.com/jmoiron/sqlx"
)

type Job struct {
	ID        int64     `db:"id" json:"id"`
	JobType   string    `db:"job_type" json:"job_type"`
	Payload   []byte    `db:"payload" json:"payload"`
	Status    string    `db:"status" json:"status"`
	Error     *string   `db:"error_message" json:"error_message,omitempty"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}

type Repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(ctx context.Context, jobType JobType, payload []byte) (int64, error) {
	var id int64
	query := `
		INSERT INTO background_jobs (job_type, payload)
		VALUES ($1, $2)
		RETURNING id
	`
	if err := r.db.QueryRowContext(ctx, query, string(jobType), payload).Scan(&id); err != nil {
		return 0, err
	}
	return id, nil
}

func (r *Repository) Get(ctx context.Context, id int64) (*Job, error) {
	var j Job
	if err := r.db.GetContext(ctx, &j, `SELECT * FROM background_jobs WHERE id = $1`, id); err != nil {
		return nil, err
	}
	return &j, nil
}

func (r *Repository) MarkProcessing(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE background_jobs SET status = 'processing', updated_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

func (r *Repository) MarkDone(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE background_jobs SET status = 'done', updated_at = NOW() WHERE id = $1`,
		id,
	)
	return err
}

func (r *Repository) MarkFailed(ctx context.Context, id int64, msg string) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE background_jobs SET status = 'failed', error_message = $2, updated_at = NOW() WHERE id = $1`,
		id, msg,
	)
	return err
}

// последние N задач для /jobs
func (r *Repository) ListLastN(ctx context.Context, limit int) ([]Job, error) {
	var jobs []Job
	const q = `
		SELECT id, job_type, payload, status, error_message, created_at, updated_at
		FROM background_jobs
		ORDER BY created_at DESC
		LIMIT $1
	`
	if err := r.db.SelectContext(ctx, &jobs, q, limit); err != nil {
		return nil, err
	}
	return jobs, nil
}
