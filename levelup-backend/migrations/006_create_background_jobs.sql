-- F:\gopro\levelup-backend\migrations\006_create_background_jobs.sql
CREATE TABLE IF NOT EXISTS background_jobs (
    id            BIGSERIAL PRIMARY KEY,
    job_type      TEXT      NOT NULL,              -- например: "notify_student", "recalculate_progress"
    payload       JSONB     NOT NULL,              -- любые данные
    status        TEXT      NOT NULL DEFAULT 'pending', -- pending / processing / done / failed
    error_message TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
