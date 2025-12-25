// F:\gopro\levelup-backend\internal\http\handlers\system.go
package handlers

import (
	"net/http"

	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

type SystemHandler struct {
	DB  *sqlx.DB
	RDB *redis.Client
}

func NewSystemHandler(db *sqlx.DB, rdb *redis.Client) *SystemHandler {
	return &SystemHandler{DB: db, RDB: rdb}
}

func (h *SystemHandler) RegisterRoutes(mux interface {
	Get(pattern string, handlerFn http.HandlerFunc)
}) {
	mux.Get("/system/status", h.Status)
}

type systemStatusResponse struct {
	DBStatus     string `json:"db_status"`
	RedisStatus  string `json:"redis_status"`
	QueueSize    int64  `json:"queue_size"`
	QueueKey     string `json:"queue_key"`
	ServiceLabel string `json:"service_label"`
}

func (h *SystemHandler) Status(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	dbStatus := "ok"
	if err := h.DB.PingContext(ctx); err != nil {
		dbStatus = "error"
	}

	redisStatus := "ok"
	queueSize := int64(0)
	const queueKey = "background:jobs"

	if err := h.RDB.Ping(ctx).Err(); err != nil {
		redisStatus = "error"
	} else {
		if n, err := h.RDB.LLen(ctx, queueKey).Result(); err == nil {
			queueSize = n
		} else {
			redisStatus = "error"
		}
	}

	resp := systemStatusResponse{
		DBStatus:     dbStatus,
		RedisStatus:  redisStatus,
		QueueSize:    queueSize,
		QueueKey:     queueKey,
		ServiceLabel: "levelup-distributed-tasks",
	}

	writeJSON(w, http.StatusOK, resp)
}
