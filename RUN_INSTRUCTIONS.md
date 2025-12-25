# Build, Run & Deploy Instructions

## 1. Prerequisites
Install:
- Go (>= 1.20 recommended)
- Node.js + npm
- PostgreSQL
- Redis

## 2. Configure environment (example)
Set environment variables (optional — defaults exist in code):
- `PORT` (default: 8080)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`
- `REDIS_ADDR` (default: localhost:6379)
- `REDIS_DB` (default: 0)
- `JWT_SECRET`

## 3. Database setup
1. Start PostgreSQL
2. Create database (example):
   - `createdb levelup`
3. Apply migrations (choose one approach):
   - Use your preferred migration tool, or
   - Apply SQL scripts from `levelup-backend/migrations/` in order.

## 4. Run Redis
Start Redis locally (default port 6379).

## 5. Run Backend (API)
```bash
cd levelup-backend
go mod tidy
go run ./cmd/server
```

## 6. Run Worker
In a second terminal:
```bash
cd levelup-backend
go run ./cmd/worker
```

## 7. Run Frontend
```bash
cd levelup-frontend
npm install
npm start
```

## 8. Run tests
```bash
cd levelup-backend
go test ./...
```

## 9. Deployment (simple approach)
Deploy as 4 independent services:
- API service
- Worker service
- PostgreSQL
- Redis

You can deploy using:
- separate processes on one machine (local demo),
- separate VMs/servers,
- or containers (Docker) if desired.
