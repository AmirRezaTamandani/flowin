-- Flowin survey persistence schema (PostgreSQL)
-- Auth/users table omitted — integrate with your identity provider.

CREATE TYPE submission_status AS ENUM ('draft', 'completed');
CREATE TYPE upload_purpose AS ENUM ('logo', 'font', 'template', 'other');

CREATE TABLE brands (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       TEXT NOT NULL UNIQUE,
  name          TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE survey_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  survey_id       TEXT NOT NULL CHECK (
    survey_id IN (
      'branding', 'campaign', 'email', 'sms', 'push',
      'seo', 'social-competitor', 'social-strategy'
    )
  ),
  status          submission_status NOT NULL DEFAULT 'draft',
  answers         JSONB NOT NULL DEFAULT '{}',
  -- Optional denormalized parsed answers from normalizeSubmissionAnswers()
  normalized_answers JSONB,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One completed branding submission per brand (product rule)
CREATE UNIQUE INDEX survey_submissions_branding_completed_once
  ON survey_submissions (brand_id)
  WHERE survey_id = 'branding' AND status = 'completed';

CREATE INDEX survey_submissions_brand_survey_idx
  ON survey_submissions (brand_id, survey_id);

CREATE TABLE uploaded_files (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id        UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  submission_id   UUID REFERENCES survey_submissions(id) ON DELETE SET NULL,
  step_id         INTEGER,
  field           TEXT,
  purpose         upload_purpose NOT NULL,
  storage_key     TEXT NOT NULL,
  url             TEXT NOT NULL,
  name            TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  size_bytes      BIGINT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX uploaded_files_brand_idx ON uploaded_files (brand_id);

-- answers JSONB shape:
-- { "step_1": "plain string", "step_5": "[\"opt1\",\"opt2\"]", ... }
-- Complex step types store JSON-encoded strings as values.

COMMENT ON COLUMN survey_submissions.answers IS
  'Raw form payload from frontend. Keys: step_{id}. Values: string (JSON string for complex types).';

COMMENT ON COLUMN survey_submissions.normalized_answers IS
  'Array of { stepId, question, type, value, raw } — see app/lib/api/normalizeSubmission.ts';
