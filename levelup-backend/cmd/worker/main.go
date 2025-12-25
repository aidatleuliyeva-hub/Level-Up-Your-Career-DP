// F:\gopro\levelup-backend\cmd\worker\main.go
package main

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"levelup-backend/internal/config"
	"levelup-backend/internal/database"
	"levelup-backend/internal/tasks"

	"github.com/redis/go-redis/v9"
)

func main() {
	cfg := config.Load()

	db, err := database.NewPostgresDB(cfg.DB)
	if err != nil {
		log.Fatalf("failed to init db: %v", err)
	}
	defer db.Close()

	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.Redis.Addr, // 👈 берём из конфига
		DB:   cfg.Redis.DB,
	})

	repo := tasks.NewRepository(db)
	queue := tasks.NewQueue(rdb, "background:jobs")

	ctx := context.Background()

	log.Println("worker started")

	for {
		jobID, err := queue.DequeueBlocking(ctx)
		if err != nil {
			log.Printf("failed to dequeue: %v", err)
			continue
		}
		if jobID == 0 {
			continue
		}

		job, err := repo.Get(ctx, jobID)
		if err != nil {
			log.Printf("failed to get job %d: %v", jobID, err)
			_ = repo.MarkFailed(ctx, jobID, "load error")
			continue
		}

		if err := repo.MarkProcessing(ctx, job.ID); err != nil {
			log.Printf("failed to mark processing: %v", err)
		}

		log.Printf("processing job %d type=%s", job.ID, job.JobType)

		if err := processJob(ctx, repo, job); err != nil {
			log.Printf("job %d failed: %v", job.ID, err)
			_ = repo.MarkFailed(ctx, job.ID, err.Error())
			continue
		}

		if err := repo.MarkDone(ctx, job.ID); err != nil {
			log.Printf("failed to mark done: %v", err)
		}
	}
}

// processJob — чисто демонстрация работы воркера
func processJob(ctx context.Context, repo *tasks.Repository, job *tasks.Job) error {
	// чтобы gopls не орал на unused params (на будущее тут можно будет дергать БД)
	_ = ctx
	_ = repo
	switch tasks.JobType(job.JobType) {
	case tasks.JobTypeNotifyStudent:
		var p struct {
			Type          string `json:"type"`
			AttemptID     int64  `json:"attempt_id,omitempty"`
			StudentID     int64  `json:"student_id,omitempty"`
			ApplicationID int64  `json:"application_id,omitempty"`
		}
		if err := json.Unmarshal(job.Payload, &p); err != nil {
			return err
		}
		log.Printf("[worker] notify_student payload=%+v", p)
		time.Sleep(2 * time.Second)

	case tasks.JobTypeNotifyTeacher:
		var p struct {
			Type          string `json:"type"`
			ApplicationID int64  `json:"application_id,omitempty"`
			StudentID     int64  `json:"student_id,omitempty"`
		}
		if err := json.Unmarshal(job.Payload, &p); err != nil {
			return err
		}
		log.Printf("[worker] notify_teacher payload=%+v", p)
		time.Sleep(2 * time.Second)

	default:
		log.Printf("[worker] unknown job type=%s", job.JobType)
		time.Sleep(1 * time.Second)
	}

	return nil
}
