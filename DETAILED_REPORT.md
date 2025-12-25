# Detailed Report — Level Up Your Career

## 1. Goal
The goal of this project is to design and implement a distributed backend system that demonstrates:
- service separation (API vs background processing),
- asynchronous communication using a queue,
- persistence and state management through a relational database.

## 2. Problem and Motivation
In modern web platforms, not all operations should be processed synchronously in the request/response cycle.
Heavy or long-running operations are typically moved to background workers to improve responsiveness and scalability.

## 3. System Design
### 3.1 Key Design Decisions
- **API + Worker split:** isolates user-facing latency from heavy processing.
- **Redis-based queue:** simple and efficient mechanism for asynchronous job dispatch.
- **PostgreSQL as source of truth:** ensures data integrity and supports querying/reporting.

### 3.2 Data and Communication
- HTTP/JSON for frontend-to-API communication.
- Redis queue for API-to-Worker asynchronous jobs.
- PostgreSQL for persistent storage and job state.

## 4. Implementation Summary
Implemented modules:
- HTTP routing and handlers (REST API)
- Service layer (business logic)
- Repository layer (DB access)
- Task queue abstractions (enqueue/dequeue)
- Worker process for background jobs
- Configuration loader via environment variables

## 5. Testing and Validation
### 5.1 Manual Test Cases
Manual functional test cases are documented in `TEST_CASES.md`, covering:
- health checks,
- authentication,
- protected endpoints,
- queue + worker processing,
- invalid input handling.

### 5.2 Automated Tests
Basic automated unit tests are included for configuration handling:
- `internal/config/config_test.go`

They validate:
- environment variable defaults,
- overrides,
- integer parsing behavior.

## 6. Results
The project provides a working distributed backend where:
- the API handles user requests,
- background jobs are queued and processed asynchronously,
- system state is stored reliably in PostgreSQL.

## 7. Limitations and Future Work
- Add more unit tests for handlers/services (with mocks).
- Add integration tests with a test database and Redis.
- Add containerization (Docker Compose) for easier deployment.
- Improve observability: structured logs, metrics, tracing.

## 8. Conclusion
The implemented system successfully demonstrates distributed-system techniques in a modern web architecture and satisfies the core educational objectives of the course.
