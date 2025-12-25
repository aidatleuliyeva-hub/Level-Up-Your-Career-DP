# Level Up Your Career — Documentation

## 1. Overview
**Level Up Your Career** is a distributed educational-platform backend designed to demonstrate modern distributed-system concepts:
- separation into independent services (API + Worker),
- asynchronous task processing via a queue,
- persistent storage with a relational database.

## 2. Architecture
Components:
- **Frontend (React):** UI that calls the backend via HTTP.
- **API Service (Go):** REST API; validates requests; reads/writes PostgreSQL; enqueues background jobs to Redis.
- **Redis Queue:** asynchronous job queue between API and Worker.
- **Worker Service (Go):** consumes queued jobs and performs heavier processing; updates results in PostgreSQL.
- **PostgreSQL:** primary persistent storage.

High-level flow:
```
Frontend -> API (Go) -> PostgreSQL
                 |
                 v
            Redis Queue -> Worker (Go) -> PostgreSQL
```

## 3. Technology Stack
- Go (backend services)
- React (frontend)
- PostgreSQL (database)
- Redis (queue)
- SQL migrations (schema management)

## 4. Repository Structure
- `levelup-backend/` — Go backend (API + Worker)
  - `cmd/server/` — API entry point
  - `cmd/worker/` — Worker entry point
  - `internal/` — application logic (handlers, services, repositories, tasks, config)
  - `migrations/` — DB migrations
- `levelup-frontend/` — React frontend

## 5. Testing
- Manual test cases are listed in `TEST_CASES.md`.
- Automated unit tests (basic) exist in `levelup-backend/internal/config/config_test.go`.
