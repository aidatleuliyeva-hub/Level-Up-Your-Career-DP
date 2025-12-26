# Build, Run & Deploy Instructions

## 1. Prerequisites
Install:
- Go (>= 1.20 recommended)
- Node.js ≥ v24.11.1 + npm ≥ 11.6.2
- PostgreSQL ≥ 13
- Redis ≥ 6

Clone the repository:
```bash
git clone <repository_url>

## 2. Configure environment 
Set environment variables (optional — defaults exist in code):
- `PORT` (default: 8080)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSLMODE`
- `REDIS_ADDR` (default: localhost:6379)
- `REDIS_DB` (default: 0)
- `JWT_SECRET`

## 3. Database setup

1. Start PostgreSQL (make sure PostgreSQL is running)
2. Create database (example):
   - `createdb levelup`

### 3.1 Apply database migrations (required)
The backend does NOT create database tables automatically.
You must apply SQL migrations before starting the server.

Migrations are located in: `levelup-backend/migrations/`

Apply them in order using `psql`.

The following command applies all migration files in the correct order:

```bash
cd levelup-backend

for file in migrations/*.sql; do
  psql -h localhost -U <db_user> -d <db_name> -f "$file"
done


After this step, all required tables (including `users`) will be created.

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
If npm start does not work on your machine, try one of the following alternatives:
npx react-scripts start
./node_modules/.bin/react-scripts start

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

### Common issues

- **pq: relation "users" does not exist**
  - Database migrations were not applied.
  - Apply SQL files from `migrations/` before starting the backend.

- **react-scripts: command not found**
  - Run:
  ```bash
  npm install
  npx react-scripts start
