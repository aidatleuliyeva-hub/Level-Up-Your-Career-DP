-- F:\gopro\levelup-backend\migrations\003_create_challenge_attempts.sql
CREATE TABLE IF NOT EXISTS challenge_attempts (
    id BIGSERIAL PRIMARY KEY,
    challenge_id BIGINT NOT NULL REFERENCES challenges(id),
    student_user_id BIGINT NOT NULL REFERENCES users(id),

    status TEXT NOT NULL DEFAULT 'started',  -- started / submitted / reviewed

    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,

    grade INTEGER,
    feedback TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(challenge_id, student_user_id) -- студент не может начать два раза
);

CREATE INDEX IF NOT EXISTS idx_attempts_student ON challenge_attempts(student_user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_challenge ON challenge_attempts(challenge_id);
