// F:\gopro\levelup-backend\internal\http\router.go
package http

import (
	"time"

	"levelup-backend/internal/config"
	"levelup-backend/internal/http/handlers"
	httpmiddleware "levelup-backend/internal/http/middleware"
	"levelup-backend/internal/repositories"
	"levelup-backend/internal/services"
	"levelup-backend/internal/tasks"

	"github.com/go-chi/chi/v5"
	mw "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

func NewRouter(db *sqlx.DB, cfg config.Config) *chi.Mux {
	r := chi.NewRouter()

	// CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Общие middleware
	r.Use(mw.RequestID)
	r.Use(mw.RealIP)
	r.Use(mw.Logger)
	r.Use(mw.Recoverer)
	r.Use(mw.Timeout(60 * time.Second))

	// Redis клиент — теперь из cfg
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.Redis.Addr,
		DB:   cfg.Redis.DB,
	})

	// tasks infrastructure
	tasksRepo := tasks.NewRepository(db)
	tasksQueue := tasks.NewQueue(rdb, "background:jobs")
	tasksService := tasks.NewService(tasksRepo, tasksQueue)

	// Репозитории
	userRepo := repositories.NewUserRepository(db)
	challengeRepo := repositories.NewChallengeRepository(db)
	microtaskRepo := repositories.NewMicrotaskRepository(db)

	// Сервисы
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)
	challengeService := services.NewChallengeService(challengeRepo)
	microtaskService := services.NewMicrotaskService(microtaskRepo)

	// Handlers
	authHandler := handlers.NewAuthHandler(authService)
	healthHandler := handlers.NewHealthHandler(db)
	challengeHandler := handlers.NewChallengeHandler(challengeService, tasksService)
	microtaskHandler := handlers.NewMicrotaskHandler(microtaskService, tasksService)
	systemHandler := handlers.NewSystemHandler(db, rdb) // 🔴 новый
	jobsHandler := handlers.NewJobsHandler(tasksRepo)   // 🔴 новый

	// Публичные эндпоинты
	healthHandler.RegisterRoutes(r)
	authHandler.RegisterRoutes(r)
	systemHandler.RegisterRoutes(r) // /system/status
	jobsHandler.RegisterRoutes(r)   // /jobs

	// Защищённые эндпоинты
	jwtMw := httpmiddleware.NewJWTMiddleware(authService)

	r.Group(func(pr chi.Router) {
		pr.Use(jwtMw.WithAuth)

		meHandler := handlers.NewMeHandler()
		meHandler.RegisterRoutes(pr)

		challengeHandler.RegisterRoutes(pr)
		microtaskHandler.RegisterRoutes(pr)
	})

	return r
}
