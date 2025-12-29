# Test Cases — Level Up Your Career (Distributed Backend Platform)

This document lists manual test cases that validate the main system flows (API + Redis queue + Worker + PostgreSQL).
They can be executed either using the frontend UI or by sending HTTP requests (e.g., curl/Postman).

## Assumptions / Preconditions
- PostgreSQL is running and migrations are applied.
- Redis is running and reachable by backend.
- API service is running.
- Worker service is running (for asynchronous test cases).

---

## TC-01 — Health Check (API + DB connectivity)
**Goal:** Verify the API is up and the DB connection is healthy.  
**Steps:**
1. Send `GET /health`
**Expected result:**
- HTTP `200 OK`
- Body contains `{"status":"ok"}`

---

## TC-02 — Health Check when DB is unavailable
**Goal:** Verify the system reports DB problems correctly.  
**Steps:**
1. Stop PostgreSQL
2. Send `GET /health`
**Expected result:**
- HTTP `503 Service Unavailable`
- Body contains `{"status":"db_unavailable"}`

---

## TC-03 — User Registration (Auth)
**Goal:** Create a new user account.  
**Steps:**
1. Send `POST /auth/register` with a JSON body containing:
   - email, password, fullName, role
**Expected result:**
- HTTP `201` (or `200` depending on implementation)
- User is created in DB
- Response contains user data (without raw password)

---

## TC-04 — User Login (JWT)
**Goal:** Authenticate and receive a JWT.  
**Steps:**
1. Send `POST /auth/login` with email + password
**Expected result:**
- HTTP `200 OK`
- Response contains a JWT access token

---

## TC-05 — Protected Route without token
**Goal:** Verify protected endpoints require authentication.  
**Steps:**
1. Call a protected endpoint (e.g., `GET /me`) **without** `Authorization` header
**Expected result:**
- HTTP `401 Unauthorized` (or `403 Forbidden`)
- Clear error message in JSON

---

## TC-06 — Protected Route with token (Get current user)
**Goal:** Verify JWT works and user context is returned.  
**Steps:**
1. Login (TC-04) and take the token
2. Send `GET /me` with header `Authorization: Bearer <token>`
**Expected result:**
- HTTP `200 OK`
- Response contains the authenticated user profile

---

## TC-07 — Create a job/task that is queued (API → Redis)
**Goal:** Verify API enqueues a background job to Redis.  
**Steps:**
1. Send a request that creates a background job (e.g., “create microtask/job” endpoint)
2. Observe Redis queue key (if Redis CLI is available)
**Expected result:**
- API responds successfully (e.g., `201`)
- A job ID is pushed to the Redis queue key
- Job status is stored/updated in PostgreSQL

---

## TC-08 — Worker processes queued job (Redis → Worker → DB)
**Goal:** Verify Worker consumes the job and updates DB.  
**Steps:**
1. Run TC-07 while Worker is running
2. Wait briefly and then query the job status in DB or via API endpoint
**Expected result:**
- Worker pops the job from Redis
- Job status changes (e.g., `pending` → `done` / `processed`)
- DB contains the processed result

---

## TC-09 — Negative input validation
**Goal:** Verify backend rejects invalid payloads.  
**Steps:**
1. Send malformed JSON (missing required fields) to a create endpoint
**Expected result:**
- HTTP `400 Bad Request`
- Error message explains what is wrong

---

# Automated Unit Tests (Go)
In addition to these manual test cases, the backend contains basic automated unit tests for configuration handling:
- `internal/config/config_test.go`

Run them with:
```bash
cd levelup-backend
go test ./...
```
## Notes
These test cases focus on validating system behavior and service interaction
rather than exhaustive UI testing.