-- F:\gopro\levelup-backend\migrations\005_create_microtasks.sql
-- Таблица микрозадач
CREATE TABLE IF NOT EXISTS microtasks (
  id               BIGSERIAL PRIMARY KEY,
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  difficulty       TEXT,
  reward_credits   INT,
  reward_amount    NUMERIC(10,2),
  status           TEXT        NOT NULL DEFAULT 'open', -- open / closed / archived
  company_user_id  BIGINT,                              -- кто создал (company / teacher / admin)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Внешний ключ на users, если таблица users уже есть
ALTER TABLE microtasks
  ADD CONSTRAINT fk_microtasks_company_user
  FOREIGN KEY (company_user_id) REFERENCES users(id)
  ON DELETE SET NULL;

-- Таблица откликов студентов на микрозадачи
CREATE TABLE IF NOT EXISTS microtask_applications (
  id                BIGSERIAL PRIMARY KEY,
  microtask_id      BIGINT      NOT NULL,
  student_user_id   BIGINT      NOT NULL,
  application_text  TEXT,
  result_text       TEXT,
  result_link       TEXT,
  status            TEXT        NOT NULL DEFAULT 'applied', -- applied / accepted / rejected / completed
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_microtask_applications_microtask
    FOREIGN KEY (microtask_id) REFERENCES microtasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_microtask_applications_student
    FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Один студент не может откликнуться дважды на одну и ту же микрозадачу
CREATE UNIQUE INDEX IF NOT EXISTS idx_microtask_applications_unique
  ON microtask_applications(microtask_id, student_user_id);
