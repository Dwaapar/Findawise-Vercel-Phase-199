-- Create missing API Diff tables
CREATE TABLE "api_diffs" (
  "id" serial PRIMARY KEY NOT NULL,
  "diff_hash" varchar(64) NOT NULL UNIQUE,
  "from_snapshot_id" integer NOT NULL,
  "to_snapshot_id" integer NOT NULL,
  "module_name" varchar(100) NOT NULL,
  "version_from" varchar(50) NOT NULL,
  "version_to" varchar(50) NOT NULL,
  "added_endpoints_count" integer DEFAULT 0 NOT NULL,
  "removed_endpoints_count" integer DEFAULT 0 NOT NULL,
  "modified_endpoints_count" integer DEFAULT 0 NOT NULL,
  "breaking_changes_count" integer DEFAULT 0 NOT NULL,
  "added_endpoints" jsonb,
  "removed_endpoints" jsonb,
  "modified_endpoints" jsonb,
  "breaking_changes" jsonb,
  "risk_level" varchar(20) NOT NULL,
  "impact_score" real DEFAULT 0 NOT NULL,
  "compatibility_score" real DEFAULT 100 NOT NULL,
  "analysis_summary" text,
  "ai_summary" text,
  "recommendations" jsonb,
  "affected_modules" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "created_by" varchar(100),
  "deploy_hash" varchar(64),
  "commit_hash" varchar(64),
  "author" varchar(100),
  "reviewed" boolean DEFAULT false NOT NULL,
  "reviewed_by" varchar(100),
  "reviewed_at" timestamp
);

CREATE TABLE "api_change_events" (
  "id" text PRIMARY KEY NOT NULL,
  "event_id" varchar(64) NOT NULL UNIQUE,
  "diff_id" integer,
  "event_type" varchar(50) NOT NULL,
  "severity" varchar(20) NOT NULL,
  "title" varchar(200) NOT NULL,
  "description" text,
  "details" jsonb,
  "affected_endpoint" varchar(500),
  "change_data" jsonb,
  "notifications_sent" boolean DEFAULT false NOT NULL,
  "notification_channels" jsonb,
  "notification_attempts" integer DEFAULT 0 NOT NULL,
  "last_notification_at" timestamp,
  "is_resolved" boolean DEFAULT false NOT NULL,
  "resolved_by" varchar(100),
  "resolved_at" timestamp,
  "resolution_notes" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX "idx_api_diff_hash" ON "api_diffs" ("diff_hash");
CREATE INDEX "idx_api_diff_module" ON "api_diffs" ("module_name", "created_at");
CREATE INDEX "idx_api_diff_risk" ON "api_diffs" ("risk_level", "impact_score");
CREATE INDEX "idx_api_diff_versions" ON "api_diffs" ("version_from", "version_to");
CREATE INDEX "idx_api_diff_reviewed" ON "api_diffs" ("reviewed");

CREATE UNIQUE INDEX "idx_api_change_event_id" ON "api_change_events" ("event_id");
CREATE INDEX "idx_api_change_diff" ON "api_change_events" ("diff_id");
CREATE INDEX "idx_api_change_severity" ON "api_change_events" ("severity", "created_at");
CREATE INDEX "idx_api_change_resolved" ON "api_change_events" ("is_resolved");
CREATE INDEX "idx_api_change_notification" ON "api_change_events" ("notifications_sent");