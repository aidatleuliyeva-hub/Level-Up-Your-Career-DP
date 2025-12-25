// F:\gopro\levelup-backend\internal\tasks\queue.go
package tasks

import (
	"context"
	"strconv"

	"github.com/redis/go-redis/v9"
)

type Queue struct {
	rdb      *redis.Client
	queueKey string
}

func NewQueue(rdb *redis.Client, queueKey string) *Queue {
	return &Queue{rdb: rdb, queueKey: queueKey}
}

func (q *Queue) Enqueue(ctx context.Context, jobID int64) error {
	return q.rdb.LPush(ctx, q.queueKey, strconv.FormatInt(jobID, 10)).Err()
}

func (q *Queue) DequeueBlocking(ctx context.Context) (int64, error) {
	res, err := q.rdb.BRPop(ctx, 0, q.queueKey).Result()
	if err != nil {
		return 0, err
	}
	if len(res) != 2 {
		return 0, nil
	}
	idStr := res[1]
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return 0, err
	}
	return id, nil
}
