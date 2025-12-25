// F:\gopro\levelup-backend\cmd\server\main.go
package main

import (
	"log"
	"net/http"

	"levelup-backend/internal/config"
	"levelup-backend/internal/database"
	httpapi "levelup-backend/internal/http"
)

func main() {
	cfg := config.Load()

	db, err := database.NewPostgresDB(cfg.DB)
	if err != nil {
		log.Fatalf("failed to init db: %v", err)
	}
	defer db.Close()

	r := httpapi.NewRouter(db, cfg)

	log.Printf("Server starting on port %s\n", cfg.AppPort)
	if err := http.ListenAndServe(":"+cfg.AppPort, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
