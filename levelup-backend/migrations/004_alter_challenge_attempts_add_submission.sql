-- F:\gopro\levelup-backend\migrations\004_alter_challenge_attempts_add_submission.sql
ALTER TABLE challenge_attempts
  ADD COLUMN IF NOT EXISTS submission_text TEXT,
  ADD COLUMN IF NOT EXISTS submission_link TEXT;
