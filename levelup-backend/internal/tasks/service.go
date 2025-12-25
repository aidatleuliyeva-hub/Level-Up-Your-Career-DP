// F:\gopro\levelup-backend\internal\tasks\service.go
package tasks

import (
	"context"
	"encoding/json"
)

type Service struct {
	repo  *Repository
	queue *Queue
}

func NewService(repo *Repository, queue *Queue) *Service {
	return &Service{repo: repo, queue: queue}
}

// публичный метод для хендлеров/сервисов
func (s *Service) EnqueueJob(ctx context.Context, jobType JobType, payload any) (int64, error) {
	raw, err := json.Marshal(payload)
	if err != nil {
		return 0, err
	}

	id, err := s.repo.Create(ctx, jobType, raw)
	if err != nil {
		return 0, err
	}

	if err := s.queue.Enqueue(ctx, id); err != nil {
		return 0, err
	}

	return id, nil
}
