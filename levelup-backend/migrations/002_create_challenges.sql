-- F:\gopro\levelup-backend\migrations\002_create_challenges.sql
CREATE TABLE IF NOT EXISTS challenges (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    challenge_type TEXT NOT NULL, -- academic / company
    difficulty TEXT,              -- easy / medium / hard (пока просто текст)
    reward_credits INTEGER,       -- сколько академ. кредитов
    reward_amount NUMERIC(10,2),  -- деньги за выполнение (если есть)
    status TEXT NOT NULL DEFAULT 'draft', -- draft / published / archived
    created_by_user_id BIGINT NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(challenge_type);
