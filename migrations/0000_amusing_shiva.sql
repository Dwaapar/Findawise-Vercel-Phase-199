CREATE TABLE "affiliate_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer,
	"session_id" varchar(255),
	"user_agent" text,
	"ip_address" varchar(45),
	"referrer_url" text,
	"source_page" varchar(255),
	"clicked_at" timestamp DEFAULT now(),
	"conversion_tracked" boolean DEFAULT false,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "affiliate_networks" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"base_url" text NOT NULL,
	"tracking_params" jsonb,
	"cookie_settings" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "affiliate_networks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "affiliate_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"network_id" integer,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"emotion" varchar(50),
	"target_url" text NOT NULL,
	"cta_text" varchar(100),
	"commission" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "affiliate_offers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "agent_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"reward_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" varchar(255) NOT NULL,
	"prompt_version" varchar(50),
	"task_type" varchar(100) NOT NULL,
	"reward_score" real NOT NULL,
	"performance_score" real NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"success_rate" real DEFAULT 0 NOT NULL,
	"recent_performance" real DEFAULT 0 NOT NULL,
	"weekly_performance" real DEFAULT 0 NOT NULL,
	"overall_performance" real DEFAULT 0 NOT NULL,
	"persona_performance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"device_performance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"geo_performance" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"current_rank" integer DEFAULT 100 NOT NULL,
	"routing_weight" real DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_training_run" timestamp,
	"training_data_count" integer DEFAULT 0 NOT NULL,
	"model_version" varchar(50),
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "agent_rewards_reward_id_unique" UNIQUE("reward_id")
);
--> statement-breakpoint
CREATE TABLE "ai_ml_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"vertical" varchar(100),
	"neuron_id" varchar(255),
	"model_type" varchar(100),
	"metrics" jsonb NOT NULL,
	"predictions" integer DEFAULT 0,
	"correct_predictions" integer DEFAULT 0,
	"accuracy" numeric(5, 4),
	"revenue_impact" numeric(10, 2),
	"user_impact" integer DEFAULT 0,
	"optimizations_applied" integer DEFAULT 0,
	"rules_triggered" integer DEFAULT 0,
	"experiments_running" integer DEFAULT 0,
	"data_quality" numeric(5, 4),
	"system_health" varchar(50) DEFAULT 'healthy',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ai_ml_audit_trail" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" varchar(255) NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"old_value" jsonb,
	"new_value" jsonb,
	"change_reason" text,
	"impact" jsonb,
	"is_automatic" boolean DEFAULT false,
	"learning_cycle_id" varchar(255),
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now(),
	CONSTRAINT "ai_ml_audit_trail_audit_id_unique" UNIQUE("audit_id")
);
--> statement-breakpoint
CREATE TABLE "ai_ml_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" varchar(255) NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"version" varchar(50) NOT NULL,
	"weights" jsonb NOT NULL,
	"hyperparameters" jsonb,
	"architecture" jsonb,
	"training_data" jsonb NOT NULL,
	"performance" jsonb NOT NULL,
	"accuracy" numeric(5, 4),
	"is_active" boolean DEFAULT true,
	"is_production" boolean DEFAULT false,
	"training_start_time" timestamp,
	"training_end_time" timestamp,
	"deployed_at" timestamp,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ai_ml_models_model_id_unique" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE "alert_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(100) NOT NULL,
	"metric" varchar(100) NOT NULL,
	"threshold" real NOT NULL,
	"operator" varchar(20) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"actions" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "alert_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar(36) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"global_user_id" integer,
	"device_fingerprint" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"event_category" varchar(100),
	"event_action" varchar(100),
	"event_label" varchar(255),
	"event_value" integer,
	"page_slug" varchar(255),
	"page_title" varchar(255),
	"referrer_url" text,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"utm_term" varchar(100),
	"utm_content" varchar(100),
	"device_type" varchar(50),
	"browser_name" varchar(50),
	"browser_version" varchar(50),
	"operating_system" varchar(50),
	"screen_resolution" varchar(50),
	"language" varchar(10),
	"timezone" varchar(50),
	"ip_address" varchar(45),
	"country" varchar(5),
	"region" varchar(100),
	"city" varchar(100),
	"coordinates" jsonb,
	"custom_data" jsonb,
	"server_timestamp" timestamp DEFAULT now(),
	"client_timestamp" timestamp,
	"processing_delay" integer,
	"is_processed" boolean DEFAULT false,
	"batch_id" varchar(36),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "analytics_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "analytics_events_archive" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(100),
	"user_id" varchar(100),
	"session_id" varchar(100),
	"properties" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"archived_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_sync_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"global_user_id" integer,
	"last_sync_at" timestamp DEFAULT now(),
	"last_client_event_id" varchar(36),
	"last_server_event_id" varchar(36),
	"pending_event_count" integer DEFAULT 0,
	"sync_version" varchar(10) DEFAULT '1.0',
	"client_version" varchar(20),
	"device_fingerprint" varchar(255),
	"sync_errors" jsonb,
	"is_healthy" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_neuron_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"date" timestamp NOT NULL,
	"request_count" integer DEFAULT 0,
	"successful_requests" integer DEFAULT 0,
	"failed_requests" integer DEFAULT 0,
	"average_response_time" integer DEFAULT 0,
	"p95_response_time" integer DEFAULT 0,
	"p99_response_time" integer DEFAULT 0,
	"total_data_processed" integer DEFAULT 0,
	"error_rate" integer DEFAULT 0,
	"uptime" integer DEFAULT 0,
	"cpu_usage_avg" integer DEFAULT 0,
	"memory_usage_avg" integer DEFAULT 0,
	"disk_usage_avg" integer DEFAULT 0,
	"network_bytes_in" integer DEFAULT 0,
	"network_bytes_out" integer DEFAULT 0,
	"custom_metrics" jsonb,
	"alerts" jsonb,
	"events" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "api_neuron_commands" (
	"id" serial PRIMARY KEY NOT NULL,
	"command_id" varchar(36) NOT NULL,
	"neuron_id" varchar(100),
	"command_type" varchar(100) NOT NULL,
	"command_data" jsonb NOT NULL,
	"priority" integer DEFAULT 1,
	"status" varchar(50) DEFAULT 'pending',
	"issued_by" varchar(255) NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp,
	"acknowledged_at" timestamp,
	"completed_at" timestamp,
	"failed_at" timestamp,
	"timeout_at" timestamp,
	"response" jsonb,
	"error_message" text,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"metadata" jsonb,
	CONSTRAINT "api_neuron_commands_command_id_unique" UNIQUE("command_id")
);
--> statement-breakpoint
CREATE TABLE "api_neuron_heartbeats" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"status" varchar(50) NOT NULL,
	"health_score" integer NOT NULL,
	"uptime" integer NOT NULL,
	"process_id" varchar(100),
	"host_info" jsonb,
	"system_metrics" jsonb,
	"application_metrics" jsonb,
	"dependency_status" jsonb,
	"error_log" text,
	"warnings_log" jsonb,
	"performance_metrics" jsonb,
	"config_version" varchar(50),
	"build_version" varchar(100),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_only_neurons" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"language" varchar(50) NOT NULL,
	"version" varchar(50) NOT NULL,
	"base_url" text,
	"healthcheck_endpoint" text NOT NULL,
	"api_endpoints" jsonb NOT NULL,
	"authentication" jsonb NOT NULL,
	"capabilities" jsonb NOT NULL,
	"dependencies" jsonb,
	"resource_requirements" jsonb,
	"deployment_info" jsonb,
	"status" varchar(50) DEFAULT 'inactive',
	"last_heartbeat" timestamp,
	"health_score" integer DEFAULT 100,
	"uptime" integer DEFAULT 0,
	"error_count" integer DEFAULT 0,
	"total_requests" integer DEFAULT 0,
	"successful_requests" integer DEFAULT 0,
	"average_response_time" integer DEFAULT 0,
	"last_error" text,
	"alert_thresholds" jsonb,
	"auto_restart_enabled" boolean DEFAULT true,
	"max_restart_attempts" integer DEFAULT 3,
	"current_restart_attempts" integer DEFAULT 0,
	"last_restart_attempt" timestamp,
	"registered_at" timestamp DEFAULT now(),
	"api_key" varchar(255) NOT NULL,
	"metadata" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "api_only_neurons_neuron_id_unique" UNIQUE("neuron_id")
);
--> statement-breakpoint
CREATE TABLE "behavior_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb,
	"page_slug" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "device_fingerprints" (
	"id" serial PRIMARY KEY NOT NULL,
	"fingerprint" varchar(255) NOT NULL,
	"global_user_id" integer,
	"device_info" jsonb NOT NULL,
	"browser_info" jsonb NOT NULL,
	"hardware_info" jsonb,
	"network_info" jsonb,
	"confidence_score" integer DEFAULT 0,
	"session_count" integer DEFAULT 0,
	"first_seen" timestamp DEFAULT now(),
	"last_seen" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "device_fingerprints_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "email_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"lead_magnet_id" integer,
	"email_sequence" jsonb NOT NULL,
	"trigger_type" varchar(50) NOT NULL,
	"trigger_config" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "email_campaigns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "empire_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_key" varchar(255) NOT NULL,
	"config_value" jsonb NOT NULL,
	"description" text,
	"category" varchar(100),
	"is_secret" boolean DEFAULT false,
	"version" varchar(50) DEFAULT '1.0',
	"updated_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "empire_config_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE "experiment_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"experiment_id" integer,
	"variant_id" integer,
	"event_type" varchar(50) NOT NULL,
	"event_value" varchar(255),
	"page_slug" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "experiment_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer,
	"variant_id" integer,
	"date" timestamp NOT NULL,
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"bounces" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"conversion_rate" varchar(10),
	"click_through_rate" varchar(10),
	"bounce_rate" varchar(10),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experiment_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"traffic_percentage" integer NOT NULL,
	"configuration" jsonb NOT NULL,
	"is_control" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"target_entity" varchar(255) NOT NULL,
	"traffic_allocation" integer DEFAULT 100,
	"status" varchar(20) DEFAULT 'draft',
	"start_date" timestamp,
	"end_date" timestamp,
	"created_by" varchar(255),
	"metadata" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "experiments_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "federation_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb,
	"initiated_by" varchar(255),
	"success" boolean DEFAULT true,
	"error_message" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "federation_rlhf_sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"source_neuron" varchar(255) NOT NULL,
	"target_neurons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sync_type" varchar(50) NOT NULL,
	"sync_data" jsonb NOT NULL,
	"data_type" varchar(50) NOT NULL,
	"data_size" integer NOT NULL,
	"data_quality" real DEFAULT 0.5 NOT NULL,
	"validation_results" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conflict_resolution" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"processed_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"error_details" text,
	"federation_version" varchar(50),
	"consensus_score" real,
	"priority_level" varchar(20) DEFAULT 'normal',
	"initiated_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "federation_rlhf_sync_sync_id_unique" UNIQUE("sync_id")
);
--> statement-breakpoint
CREATE TABLE "funnel_blueprints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"vertical" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"config" jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"priority" integer DEFAULT 100 NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnel_experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"blueprint_id" uuid NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"experiment_type" text DEFAULT 'ab_test' NOT NULL,
	"variants" jsonb NOT NULL,
	"targeting" jsonb,
	"success_metrics" jsonb,
	"results" jsonb,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnel_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text,
	"variant_id" text,
	"entry_point" text NOT NULL,
	"current_block" text,
	"status" text DEFAULT 'active' NOT NULL,
	"personalization_data" jsonb,
	"analytics_data" jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"last_activity" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnel_lifecycle_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"integration_type" text NOT NULL,
	"trigger_conditions" jsonb NOT NULL,
	"action_config" jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"performance_stats" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funnel_optimizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"blueprint_id" uuid NOT NULL,
	"optimization_type" text NOT NULL,
	"category" text NOT NULL,
	"current_config" jsonb NOT NULL,
	"suggested_config" jsonb NOT NULL,
	"reasoning" text NOT NULL,
	"confidence_score" numeric(5, 4),
	"expected_impact" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"implementation_date" timestamp with time zone,
	"results" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "global_user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" varchar(36) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"merged_from_sessions" jsonb,
	"total_sessions" integer DEFAULT 0,
	"total_page_views" integer DEFAULT 0,
	"total_interactions" integer DEFAULT 0,
	"total_time_on_site" integer DEFAULT 0,
	"first_visit" timestamp,
	"last_visit" timestamp,
	"preferred_device_type" varchar(50),
	"preferred_browser" varchar(50),
	"preferred_os" varchar(50),
	"location_data" jsonb,
	"preferences" jsonb,
	"segments" jsonb,
	"tags" jsonb,
	"custom_attributes" jsonb,
	"lifetime_value" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"lead_quality_score" integer DEFAULT 0,
	"engagement_score" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "global_user_profiles_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "global_user_profiles_email_unique" UNIQUE("email"),
	CONSTRAINT "global_user_profiles_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_capture_id" integer,
	"activity_type" varchar(50) NOT NULL,
	"activity_data" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"session_id" varchar(255),
	"page_slug" varchar(255),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "lead_captures" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"lead_form_id" integer,
	"lead_magnet_id" integer,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(20),
	"additional_data" jsonb,
	"source" varchar(100),
	"user_agent" text,
	"ip_address" varchar(45),
	"referrer_url" text,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"utm_term" varchar(100),
	"utm_content" varchar(100),
	"is_verified" boolean DEFAULT false,
	"is_delivered" boolean DEFAULT false,
	"delivered_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"experiment_id" integer,
	"lead_form_id" integer,
	"variant_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_form_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_form_id" integer,
	"page_slug" varchar(255),
	"position" varchar(50) NOT NULL,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lead_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"lead_magnet_id" integer,
	"form_type" varchar(50) NOT NULL,
	"trigger_config" jsonb,
	"form_fields" jsonb NOT NULL,
	"styling" jsonb,
	"emotion" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lead_forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lead_magnets" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"delivery_method" varchar(50) NOT NULL,
	"delivery_url" text,
	"delivery_config" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "lead_magnets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "learning_cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_id" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"data_processed" jsonb NOT NULL,
	"discoveries" jsonb NOT NULL,
	"models_updated" jsonb,
	"rules_generated" integer DEFAULT 0,
	"performance" jsonb,
	"error_message" text,
	"triggered_by" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "learning_cycles_cycle_id_unique" UNIQUE("cycle_id")
);
--> statement-breakpoint
CREATE TABLE "llm_insights" (
	"id" serial PRIMARY KEY NOT NULL,
	"insight_id" varchar(36) NOT NULL,
	"llm_provider" varchar(100) NOT NULL,
	"llm_model" varchar(100) NOT NULL,
	"insight_type" varchar(100) NOT NULL,
	"analysis_scope" varchar(100),
	"target_entity" varchar(255),
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"insights" jsonb NOT NULL,
	"suggestions" jsonb,
	"confidence" integer,
	"data_references" jsonb,
	"token_usage" jsonb,
	"processing_time" integer,
	"status" varchar(50) DEFAULT 'generated',
	"implemented_change_ids" jsonb,
	"reviewed_by" varchar(255),
	"reviewed_at" timestamp,
	"review_notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "llm_insights_insight_id_unique" UNIQUE("insight_id")
);
--> statement-breakpoint
CREATE TABLE "llm_scheduling" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_name" varchar(255) NOT NULL,
	"frequency" varchar(50) NOT NULL,
	"analysis_type" varchar(100) NOT NULL,
	"scope" varchar(100),
	"trigger_conditions" jsonb,
	"llm_config" jsonb NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"run_count" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"average_execution_time" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "llm_scheduling_schedule_name_unique" UNIQUE("schedule_name")
);
--> statement-breakpoint
CREATE TABLE "ml_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"type" varchar(100) NOT NULL,
	"algorithm" varchar(100) NOT NULL,
	"purpose" text NOT NULL,
	"features" jsonb NOT NULL,
	"hyperparameters" jsonb,
	"performance" jsonb,
	"training_data" jsonb,
	"model_path" text,
	"is_active" boolean DEFAULT true,
	"is_production" boolean DEFAULT false,
	"trained_at" timestamp,
	"deployed_at" timestamp,
	"last_used_at" timestamp,
	"usage_count" integer DEFAULT 0,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ml_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "ml_predictions" (
	"id" serial PRIMARY KEY NOT NULL,
	"prediction_id" varchar(36) NOT NULL,
	"model_id" integer,
	"input_features" jsonb NOT NULL,
	"prediction" jsonb NOT NULL,
	"confidence" integer NOT NULL,
	"actual_outcome" jsonb,
	"source_entity" varchar(255),
	"source_type" varchar(100),
	"orchestration_run_id" varchar(255),
	"was_implemented" boolean DEFAULT false,
	"implemented_at" timestamp,
	"feedback_received" boolean DEFAULT false,
	"feedback_data" jsonb,
	"is_correct" boolean,
	"prediction_accuracy" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ml_predictions_prediction_id_unique" UNIQUE("prediction_id")
);
--> statement-breakpoint
CREATE TABLE "ml_training_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"dataset_name" varchar(255) NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"features" jsonb NOT NULL,
	"labels" jsonb NOT NULL,
	"source_entity" varchar(255),
	"source_type" varchar(100),
	"performance_metrics" jsonb,
	"context_data" jsonb,
	"is_validated" boolean DEFAULT false,
	"is_outlier" boolean DEFAULT false,
	"confidence_score" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_performance_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" integer,
	"evaluation_date" timestamp DEFAULT now(),
	"evaluation_type" varchar(50) NOT NULL,
	"dataset_size" integer,
	"metrics" jsonb NOT NULL,
	"confusion_matrix" jsonb,
	"feature_importance" jsonb,
	"prediction_distribution" jsonb,
	"drift_detection" jsonb,
	"performance_change" jsonb,
	"is_production_ready" boolean DEFAULT false,
	"recommended_actions" jsonb,
	"evaluated_by" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "model_training_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"model_id" varchar(255) NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"progress" integer DEFAULT 0,
	"training_config" jsonb NOT NULL,
	"dataset_size" integer,
	"epochs" integer,
	"current_epoch" integer DEFAULT 0,
	"loss" numeric(10, 6),
	"accuracy" numeric(5, 4),
	"validation_loss" numeric(10, 6),
	"validation_accuracy" numeric(5, 4),
	"training_logs" text,
	"error_message" text,
	"start_time" timestamp,
	"end_time" timestamp,
	"estimated_completion_time" timestamp,
	"resources" jsonb,
	"learning_cycle_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "model_training_jobs_job_id_unique" UNIQUE("job_id")
);
--> statement-breakpoint
CREATE TABLE "neuron_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"date" timestamp NOT NULL,
	"page_views" integer DEFAULT 0,
	"unique_visitors" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" varchar(20) DEFAULT '0',
	"uptime" integer DEFAULT 0,
	"error_count" integer DEFAULT 0,
	"average_response_time" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "neuron_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"config_version" varchar(50) NOT NULL,
	"config_data" jsonb NOT NULL,
	"deployed_at" timestamp,
	"is_active" boolean DEFAULT false,
	"deployed_by" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "neuron_data_pipelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"neuron_name" varchar(255) NOT NULL,
	"vertical" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"last_sync" timestamp DEFAULT now(),
	"sync_frequency" integer DEFAULT 300,
	"metrics_collected" jsonb NOT NULL,
	"health_score" numeric(5, 4) DEFAULT '1.0000',
	"config_version" varchar(100),
	"is_active" boolean DEFAULT true,
	"error_count" integer DEFAULT 0,
	"last_error" text,
	"last_error_time" timestamp,
	"data_quality" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "neuron_data_pipelines_neuron_id_unique" UNIQUE("neuron_id")
);
--> statement-breakpoint
CREATE TABLE "neuron_status_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100),
	"status" varchar(50) NOT NULL,
	"health_score" integer,
	"uptime" integer,
	"stats" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "neurons" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"status" varchar(50) DEFAULT 'active',
	"version" varchar(50),
	"supported_features" jsonb,
	"last_check_in" timestamp,
	"health_score" integer DEFAULT 100,
	"uptime" integer DEFAULT 0,
	"registered_at" timestamp DEFAULT now(),
	"api_key" varchar(255) NOT NULL,
	"metadata" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "neurons_neuron_id_unique" UNIQUE("neuron_id")
);
--> statement-breakpoint
CREATE TABLE "orchestration_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"change_id" varchar(255) NOT NULL,
	"orchestration_run_id" varchar(255) NOT NULL,
	"change_type" varchar(100) NOT NULL,
	"target_entity" varchar(255) NOT NULL,
	"action" varchar(50) NOT NULL,
	"before_state" jsonb,
	"after_state" jsonb,
	"reason" text NOT NULL,
	"ml_prediction_id" varchar(36),
	"confidence" integer NOT NULL,
	"expected_impact" jsonb,
	"actual_impact" jsonb,
	"status" varchar(50) NOT NULL,
	"applied_at" timestamp,
	"rolled_back_at" timestamp,
	"rollback_reason" text,
	"is_reversible" boolean DEFAULT true,
	"reverse_change_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orchestration_changes_change_id_unique" UNIQUE("change_id")
);
--> statement-breakpoint
CREATE TABLE "orchestration_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" varchar(255) NOT NULL,
	"status" varchar(50) NOT NULL,
	"trigger_type" varchar(50) NOT NULL,
	"triggered_by" varchar(255),
	"orchestration_config" jsonb NOT NULL,
	"analytics_snapshot" jsonb,
	"models_used" jsonb,
	"changes_proposed" jsonb,
	"changes_applied" jsonb,
	"changes_rejected" jsonb,
	"approval_status" varchar(50) DEFAULT 'auto_approved',
	"approved_by" varchar(255),
	"approved_at" timestamp,
	"backup_id" varchar(255),
	"performance_metrics" jsonb,
	"ml_confidence" integer,
	"error_log" text,
	"execution_time" integer,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "orchestration_runs_run_id_unique" UNIQUE("run_id")
);
--> statement-breakpoint
CREATE TABLE "page_affiliate_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_slug" varchar(255) NOT NULL,
	"offer_id" integer,
	"position" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "performance_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(20) NOT NULL,
	"component" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"metadata" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "persona_evolution" (
	"id" serial PRIMARY KEY NOT NULL,
	"evolution_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"evolution_type" varchar(50) NOT NULL,
	"source_persona" varchar(100),
	"target_persona" varchar(100),
	"cluster_data" jsonb,
	"cluster_size" integer,
	"cluster_cohesion" real,
	"evolution_strength" real NOT NULL,
	"affected_users" integer DEFAULT 0 NOT NULL,
	"confidence_score" real DEFAULT 0.5 NOT NULL,
	"behavior_patterns" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"demographic_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"validation_status" varchar(20) DEFAULT 'pending',
	"validated_by" integer,
	"validation_notes" text,
	"is_implemented" boolean DEFAULT false NOT NULL,
	"implemented_at" timestamp,
	"rollback_plan" jsonb,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"algorithm_version" varchar(50),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "persona_evolution_evolution_id_unique" UNIQUE("evolution_id")
);
--> statement-breakpoint
CREATE TABLE "persona_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer,
	"session_id" varchar(255),
	"primary_persona" varchar(100) NOT NULL,
	"primary_score" real NOT NULL,
	"persona_scores" jsonb NOT NULL,
	"hybrid_personas" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"traits" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"persona_drift" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"confidence_level" real DEFAULT 0.5 NOT NULL,
	"stability_score" real DEFAULT 0.5 NOT NULL,
	"quiz_results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"behavior_patterns" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"engagement_history" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conversion_history" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ui_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"offer_preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"first_seen" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"data_quality" real DEFAULT 0.5 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "persona_profiles_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
CREATE TABLE "persona_simulations" (
	"id" serial PRIMARY KEY NOT NULL,
	"simulation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"simulation_type" varchar(50) NOT NULL,
	"target_persona" varchar(100) NOT NULL,
	"persona_config" jsonb NOT NULL,
	"test_scenarios" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"test_duration" integer,
	"sample_size" integer,
	"engagement_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conversion_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"ui_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"baseline_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"improvement_ratio" real,
	"statistical_significance" real,
	"status" varchar(20) DEFAULT 'planned',
	"is_active" boolean DEFAULT false NOT NULL,
	"user_feedback" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"qualitative_notes" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "persona_simulations_simulation_id_unique" UNIQUE("simulation_id")
);
--> statement-breakpoint
CREATE TABLE "personalization_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"vertical" varchar(100) NOT NULL,
	"archetype" varchar(100) NOT NULL,
	"condition" jsonb NOT NULL,
	"action" jsonb NOT NULL,
	"confidence" numeric(5, 4) NOT NULL,
	"impact" numeric(5, 4),
	"priority" integer DEFAULT 100,
	"is_active" boolean DEFAULT true,
	"is_test_mode" boolean DEFAULT false,
	"test_results" jsonb,
	"applied_count" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"created_by" varchar(255),
	"learning_cycle_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "personalization_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"quiz_id" varchar(255) NOT NULL,
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"result" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rlhf_training_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"training_type" varchar(50) NOT NULL,
	"target_agents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_personas" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"feedback_data_range" jsonb NOT NULL,
	"training_data_size" integer NOT NULL,
	"data_quality_score" real DEFAULT 0.5 NOT NULL,
	"pre_training_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"post_training_metrics" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"improvement_score" real,
	"hyperparameters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"algorithm_version" varchar(50),
	"compute_resources" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'queued',
	"progress" integer DEFAULT 0 NOT NULL,
	"error_details" text,
	"results_summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"model_artifacts" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"validation_results" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"triggered_by" integer,
	"automation_reason" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "rlhf_training_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "session_bridge" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"global_user_id" integer,
	"device_fingerprint" varchar(255),
	"link_method" varchar(50) NOT NULL,
	"link_confidence" integer DEFAULT 0,
	"link_data" jsonb,
	"linked_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "session_bridge_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "system_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"value" real NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" text,
	"source" varchar(50) DEFAULT 'system',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_experiment_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"experiment_id" integer,
	"variant_id" integer,
	"assigned_at" timestamp DEFAULT now(),
	"user_id" varchar(255),
	"device_fingerprint" varchar(255),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "user_profile_merge_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"master_profile_id" integer,
	"merged_profile_id" integer,
	"merged_session_ids" jsonb,
	"merge_reason" varchar(100) NOT NULL,
	"merge_confidence" integer DEFAULT 0,
	"merge_data" jsonb,
	"merged_at" timestamp DEFAULT now(),
	"merged_by" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"start_time" timestamp DEFAULT now() NOT NULL,
	"last_activity" timestamp DEFAULT now() NOT NULL,
	"total_time_on_site" integer DEFAULT 0,
	"page_views" integer DEFAULT 0,
	"interactions" integer DEFAULT 0,
	"device_info" jsonb,
	"location" jsonb,
	"preferences" jsonb,
	"segment" varchar(50) DEFAULT 'new_visitor',
	"personalization_flags" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"native_name" varchar(100) NOT NULL,
	"direction" varchar(3) DEFAULT 'ltr',
	"region" varchar(10),
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"fallback_language" varchar(10) DEFAULT 'en',
	"completeness" integer DEFAULT 0,
	"auto_translate" boolean DEFAULT true,
	"custom_settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "localization_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"language_code" varchar(10) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"content_type" varchar(100),
	"content_id" varchar(255),
	"key_path" varchar(500),
	"fallback_used" boolean DEFAULT false,
	"translation_quality" integer,
	"user_feedback" jsonb,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "localized_content_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"content_id" varchar(255) NOT NULL,
	"language_code" varchar(10),
	"translation_keys" jsonb NOT NULL,
	"custom_translations" jsonb,
	"seo_settings" jsonb,
	"routing_settings" jsonb,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "translation_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_path" varchar(500) NOT NULL,
	"category" varchar(100) NOT NULL,
	"context" text,
	"default_value" text NOT NULL,
	"interpolation_vars" jsonb,
	"is_plural" boolean DEFAULT false,
	"priority" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "translation_keys_key_path_unique" UNIQUE("key_path")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_id" integer,
	"language_code" varchar(10),
	"translated_value" text NOT NULL,
	"is_auto_translated" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"quality" integer DEFAULT 0,
	"last_reviewed" timestamp,
	"reviewer_id" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_language_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"preferred_language" varchar(10),
	"detected_language" varchar(10),
	"detection_method" varchar(50),
	"auto_detect" boolean DEFAULT true,
	"browser_languages" jsonb,
	"geo_location" jsonb,
	"is_manual_override" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_calculator_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"calculator_type" varchar(100) NOT NULL,
	"inputs" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"tools_compared" jsonb,
	"recommendations" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"parent_category" varchar(100),
	"tool_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "saas_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saas_comparisons" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(255) NOT NULL,
	"tool_a" integer,
	"tool_b" integer,
	"category" varchar(100),
	"comparison_matrix" jsonb,
	"verdict" text,
	"votes_a" integer DEFAULT 0,
	"votes_b" integer DEFAULT 0,
	"total_votes" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "saas_comparisons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saas_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"category" varchar(100),
	"featured_tools" jsonb,
	"tags" jsonb,
	"meta_title" varchar(255),
	"meta_description" text,
	"og_image" text,
	"read_time" integer,
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "saas_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "saas_deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_id" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"deal_type" varchar(100) NOT NULL,
	"original_price" numeric(10, 2),
	"deal_price" numeric(10, 2),
	"discount_percent" integer,
	"deal_url" text NOT NULL,
	"coupon_code" varchar(100),
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"quiz_type" varchar(100) NOT NULL,
	"answers" jsonb NOT NULL,
	"persona" varchar(100),
	"recommended_tools" jsonb,
	"recommended_stack" jsonb,
	"budget" jsonb,
	"priorities" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_id" integer,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"rating" integer NOT NULL,
	"title" varchar(255),
	"content" text,
	"pros" jsonb,
	"cons" jsonb,
	"use_case" varchar(100),
	"user_role" varchar(100),
	"company_size" varchar(100),
	"is_verified" boolean DEFAULT false,
	"is_published" boolean DEFAULT false,
	"helpful_votes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_stacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"name" varchar(255) NOT NULL,
	"description" text,
	"persona" varchar(100),
	"tools" jsonb NOT NULL,
	"total_cost" jsonb,
	"is_public" boolean DEFAULT false,
	"likes" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "saas_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"sub_category" varchar(100),
	"website" text NOT NULL,
	"affiliate_url" text,
	"logo" text,
	"screenshots" jsonb,
	"pricing" jsonb NOT NULL,
	"features" jsonb NOT NULL,
	"pros" jsonb,
	"cons" jsonb,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0,
	"alternatives" jsonb,
	"integrations" jsonb,
	"target_users" jsonb,
	"tags" jsonb,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"deal_active" boolean DEFAULT false,
	"deal_description" text,
	"deal_expiry" timestamp,
	"affiliate_commission" numeric(5, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "saas_tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_archetypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"characteristics" jsonb,
	"emotion_mapping" varchar(50),
	"color_scheme" jsonb,
	"preferred_tools" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_archetypes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" varchar(100),
	"content_type" varchar(50),
	"target_archetype" varchar(100),
	"emotion_tone" varchar(50),
	"reading_time" integer DEFAULT 5,
	"seo_title" varchar(255),
	"seo_description" text,
	"tags" jsonb,
	"sources" jsonb,
	"is_generated" boolean DEFAULT false,
	"published_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_content_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer,
	"date" date NOT NULL,
	"views" integer DEFAULT 0,
	"unique_views" integer DEFAULT 0,
	"average_time_on_page" integer DEFAULT 0,
	"bounce_rate" real DEFAULT 0,
	"cta_clicks" integer DEFAULT 0,
	"lead_captures" integer DEFAULT 0,
	"social_shares" integer DEFAULT 0,
	"archetype" varchar(100),
	"traffic_source" varchar(100),
	"device_type" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_daily_quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"xp_reward" integer DEFAULT 10,
	"difficulty_level" varchar(20) DEFAULT 'easy',
	"completion_criteria" jsonb,
	"is_daily" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_daily_quests_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_gamification" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"current_level" integer DEFAULT 1,
	"total_xp" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"last_activity" date,
	"achieved_badges" jsonb,
	"current_quests" jsonb,
	"wellness_points" integer DEFAULT 0,
	"preferences" jsonb,
	"share_settings" jsonb,
	"leaderboard_opt_in" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_lead_magnets" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"magnet_type" varchar(50),
	"category" varchar(100),
	"target_archetype" varchar(100),
	"delivery_method" varchar(50),
	"file_url" text,
	"email_sequence" jsonb,
	"download_count" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_lead_magnets_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_quest_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"completed_at" timestamp DEFAULT now(),
	"completion_data" jsonb,
	"xp_earned" integer DEFAULT 0,
	"streak_contribution" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"archetype_result" varchar(100),
	"confidence_score" real DEFAULT 0.8,
	"recommendations" jsonb,
	"time_to_complete" integer DEFAULT 0,
	"exit_point" varchar(50),
	"action_taken" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"questions" jsonb NOT NULL,
	"scoring_logic" jsonb NOT NULL,
	"result_mappings" jsonb NOT NULL,
	"estimated_time" integer DEFAULT 300,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_quizzes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "health_tool_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"inputs" jsonb NOT NULL,
	"outputs" jsonb NOT NULL,
	"archetype" varchar(100),
	"time_spent" integer DEFAULT 0,
	"action_taken" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "health_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"emotion_mapping" varchar(50),
	"input_fields" jsonb,
	"calculation_logic" text,
	"output_format" jsonb,
	"tracking_enabled" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "health_tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "finance_ai_chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"chat_session_id" varchar(255) NOT NULL,
	"persona" varchar(100),
	"context" jsonb,
	"messages" jsonb NOT NULL,
	"topics" jsonb,
	"recommendations" jsonb,
	"product_suggestions" jsonb,
	"satisfaction_rating" integer,
	"resolved_query" boolean DEFAULT false,
	"follow_up_scheduled" boolean DEFAULT false,
	"total_messages" integer DEFAULT 0,
	"session_duration" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "finance_ai_chat_sessions_chat_session_id_unique" UNIQUE("chat_session_id")
);
--> statement-breakpoint
CREATE TABLE "finance_calculator_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"calculator_type" varchar(100) NOT NULL,
	"inputs" jsonb NOT NULL,
	"results" jsonb NOT NULL,
	"recommendations" jsonb,
	"action_items" jsonb,
	"shareable_link" varchar(255),
	"bookmarked" boolean DEFAULT false,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"meta_description" text,
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"target_personas" jsonb NOT NULL,
	"emotion_tone" varchar(50) DEFAULT 'optimistic',
	"content_type" varchar(50) DEFAULT 'article',
	"content" text NOT NULL,
	"reading_time" integer,
	"difficulty" varchar(50) DEFAULT 'beginner',
	"key_takeaways" jsonb,
	"action_items" jsonb,
	"related_products" jsonb,
	"seo_keywords" jsonb,
	"last_updated" timestamp DEFAULT now(),
	"author_credentials" varchar(255),
	"fact_check_date" timestamp,
	"view_count" integer DEFAULT 0,
	"engagement_score" numeric(5, 2) DEFAULT '0.00',
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "finance_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "finance_gamification" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"current_level" integer DEFAULT 1,
	"total_xp" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"last_activity_date" timestamp DEFAULT now(),
	"completed_challenges" jsonb,
	"earned_badges" jsonb,
	"current_quests" jsonb,
	"lifetime_stats" jsonb,
	"weekly_goals" jsonb,
	"monthly_goals" jsonb,
	"preferences" jsonb,
	"leaderboard_score" integer DEFAULT 0,
	"is_public_profile" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_lead_magnets" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"magnet_type" varchar(100) NOT NULL,
	"magnet_title" varchar(255) NOT NULL,
	"user_email" varchar(255),
	"user_first_name" varchar(100),
	"user_persona" varchar(100),
	"downloaded_at" timestamp DEFAULT now(),
	"download_source" varchar(100),
	"follow_up_sequence" varchar(100),
	"conversion_tracked" boolean DEFAULT false,
	"email_opt_in" boolean DEFAULT true,
	"sms_opt_in" boolean DEFAULT false,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_date" timestamp DEFAULT now(),
	"total_sessions" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"quiz_completions" integer DEFAULT 0,
	"calculator_usage" integer DEFAULT 0,
	"content_views" integer DEFAULT 0,
	"ai_chat_sessions" integer DEFAULT 0,
	"lead_magnet_downloads" integer DEFAULT 0,
	"affiliate_clicks" integer DEFAULT 0,
	"average_session_duration" integer DEFAULT 0,
	"bounce_rate" numeric(5, 2) DEFAULT '0.00',
	"conversion_rate" numeric(5, 2) DEFAULT '0.00',
	"engagement_score" numeric(5, 2) DEFAULT '0.00',
	"content_performance" jsonb,
	"product_performance" jsonb,
	"persona_breakdown" jsonb,
	"top_performing_content" jsonb,
	"optimization_suggestions" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_product_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_type" varchar(100) NOT NULL,
	"provider_name" varchar(255) NOT NULL,
	"product_name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"key_features" jsonb NOT NULL,
	"target_personas" jsonb NOT NULL,
	"apr" numeric(5, 2),
	"interest_rate" numeric(5, 2),
	"fees" jsonb,
	"minimum_amount" numeric(12, 2),
	"maximum_amount" numeric(12, 2),
	"eligibility_requirements" jsonb,
	"affiliate_url" text NOT NULL,
	"cta_text" varchar(100) DEFAULT 'Learn More',
	"trust_score" integer DEFAULT 85,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"disclaimers" jsonb,
	"promotional_offer" text,
	"expiration_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"persona" varchar(100) NOT NULL,
	"goals" jsonb NOT NULL,
	"risk_tolerance" varchar(50) DEFAULT 'moderate',
	"current_income" numeric(12, 2),
	"current_savings" numeric(12, 2),
	"current_debt" numeric(12, 2),
	"age" integer,
	"dependents" integer DEFAULT 0,
	"financial_experience" varchar(50) DEFAULT 'beginner',
	"preferred_products" jsonb,
	"last_quiz_score" integer,
	"engagement_level" varchar(50) DEFAULT 'low',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"quiz_type" varchar(100) NOT NULL,
	"answers" jsonb NOT NULL,
	"calculated_persona" varchar(100) NOT NULL,
	"score" integer NOT NULL,
	"recommendations" jsonb NOT NULL,
	"product_matches" jsonb,
	"completion_time" integer,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb,
	"destination_id" integer,
	"offer_id" integer,
	"archetype_id" integer,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"page_slug" varchar(255),
	"referrer" text,
	"user_agent" text,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_archetypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"characteristics" jsonb,
	"preferred_destinations" jsonb,
	"budget_range" varchar(50),
	"travel_style" varchar(50),
	"theme_colors" jsonb,
	"icon" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_archetypes_name_unique" UNIQUE("name"),
	CONSTRAINT "travel_archetypes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"featured_image" text,
	"author" text DEFAULT 'Travel Expert',
	"read_time" integer DEFAULT 5,
	"tags" jsonb,
	"destinations" jsonb,
	"archetypes" jsonb,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"meta_title" text,
	"meta_description" text,
	"keywords" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_content_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"selectors" jsonb,
	"last_scraped" timestamp,
	"scraping_enabled" boolean DEFAULT true,
	"priority" integer DEFAULT 0,
	"tags" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_destinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"country" text NOT NULL,
	"continent" text NOT NULL,
	"description" text,
	"short_description" text,
	"coordinates" jsonb,
	"featured_image" text,
	"gallery" jsonb,
	"best_time" text,
	"budget_range" varchar(50),
	"travel_time" text,
	"tags" jsonb,
	"visa_requirements" text,
	"currency" varchar(10),
	"language" text,
	"timezone" varchar(50),
	"safety_rating" integer DEFAULT 5,
	"popularity_score" integer DEFAULT 0,
	"is_hidden" boolean DEFAULT false,
	"is_trending" boolean DEFAULT false,
	"meta_title" text,
	"meta_description" text,
	"keywords" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_destinations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_itineraries" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"destinations" jsonb NOT NULL,
	"duration" integer NOT NULL,
	"budget" jsonb,
	"activities" jsonb,
	"tips" jsonb,
	"archetypes" jsonb,
	"difficulty" varchar(20) DEFAULT 'easy',
	"season" varchar(20),
	"featured_image" text,
	"gallery" jsonb,
	"is_public" boolean DEFAULT true,
	"likes" integer DEFAULT 0,
	"saves" integer DEFAULT 0,
	"views" integer DEFAULT 0,
	"author_id" varchar(255),
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_itineraries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"offer_type" varchar(50) NOT NULL,
	"provider" text NOT NULL,
	"original_url" text NOT NULL,
	"affiliate_url" text NOT NULL,
	"price" numeric(10, 2),
	"currency" varchar(10) DEFAULT 'USD',
	"discount" integer,
	"valid_from" timestamp,
	"valid_to" timestamp,
	"destination_id" integer,
	"archetypes" jsonb,
	"tags" jsonb,
	"image" text,
	"priority" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_type" varchar(100) NOT NULL,
	"question" text NOT NULL,
	"options" jsonb NOT NULL,
	"order" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"quiz_type" varchar(100) NOT NULL,
	"answers" jsonb NOT NULL,
	"result" jsonb NOT NULL,
	"archetype_id" integer,
	"destination_ids" jsonb,
	"confidence" numeric(3, 2) DEFAULT '0.00',
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "travel_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"tool_type" varchar(50) NOT NULL,
	"config" jsonb,
	"is_active" boolean DEFAULT true,
	"order" integer DEFAULT 0,
	"icon" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "travel_user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"archetype_id" integer,
	"preferences" jsonb,
	"wishlist" jsonb,
	"search_history" jsonb,
	"clicked_offers" jsonb,
	"quiz_results" jsonb,
	"device_info" jsonb,
	"location" jsonb,
	"is_active" boolean DEFAULT true,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "travel_user_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "education_ai_chat_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"chat_id" varchar(255) NOT NULL,
	"subject" varchar(100),
	"archetype" varchar(100),
	"conversation_history" jsonb NOT NULL,
	"total_messages" integer DEFAULT 0,
	"session_duration" integer DEFAULT 0,
	"questions_asked" integer DEFAULT 0,
	"answers_provided" integer DEFAULT 0,
	"helpful_rating" real DEFAULT 0,
	"topics_discussed" jsonb,
	"recommendations_given" jsonb,
	"is_active" boolean DEFAULT true,
	"last_interaction" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_ai_chat_sessions_chat_id_unique" UNIQUE("chat_id")
);
--> statement-breakpoint
CREATE TABLE "education_archetypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"characteristics" jsonb,
	"emotion_mapping" varchar(50),
	"color_scheme" jsonb,
	"preferred_tools" jsonb,
	"learning_style" varchar(50),
	"goal_type" varchar(50),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_archetypes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" varchar(100),
	"content_type" varchar(50),
	"target_archetype" varchar(100),
	"difficulty" varchar(20),
	"estimated_time" integer DEFAULT 30,
	"xp_reward" integer DEFAULT 10,
	"prerequisites" jsonb,
	"emotion_tone" varchar(50),
	"reading_time" integer DEFAULT 5,
	"seo_title" varchar(255),
	"seo_description" text,
	"tags" jsonb,
	"sources" jsonb,
	"is_generated" boolean DEFAULT false,
	"published_at" timestamp,
	"is_active" boolean DEFAULT true,
	"view_count" integer DEFAULT 0,
	"completion_rate" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_daily_quests" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"quest_type" varchar(50),
	"title" varchar(255) NOT NULL,
	"description" text,
	"requirements" jsonb,
	"xp_reward" integer DEFAULT 20,
	"badge_reward" varchar(100),
	"difficulty" varchar(20),
	"category" varchar(100),
	"target_archetype" varchar(100),
	"is_active" boolean DEFAULT true,
	"completion_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_gamification" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"total_xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"current_streak" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_activity_date" date,
	"badges" jsonb,
	"achievements" jsonb,
	"leaderboard_position" integer,
	"friends_list" jsonb,
	"preferences" jsonb,
	"daily_goal" integer DEFAULT 30,
	"weekly_goal" integer DEFAULT 300,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"provider" varchar(100),
	"category" varchar(100),
	"offer_type" varchar(50),
	"original_price" real,
	"sale_price" real,
	"discount_percent" integer,
	"affiliate_url" text NOT NULL,
	"tracking_url" text,
	"commission_rate" real,
	"target_archetype" varchar(100),
	"tags" jsonb,
	"thumbnail_url" text,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"start_date" timestamp,
	"end_date" timestamp,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_offers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_paths" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"target_archetype" varchar(100),
	"difficulty" varchar(20),
	"estimated_hours" integer DEFAULT 40,
	"curriculum" jsonb NOT NULL,
	"prerequisites" jsonb,
	"outcomes" jsonb,
	"xp_total" integer DEFAULT 500,
	"certificate_template" text,
	"is_active" boolean DEFAULT true,
	"enrollment_count" integer DEFAULT 0,
	"completion_rate" real DEFAULT 0,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_paths_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"path_id" integer,
	"content_id" integer,
	"quiz_id" integer,
	"status" varchar(50) NOT NULL,
	"progress_percentage" real DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"last_accessed" timestamp DEFAULT now(),
	"xp_earned" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"completed_at" timestamp,
	"certificate_issued" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_quest_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"quest_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"completed_at" timestamp DEFAULT now(),
	"xp_earned" integer DEFAULT 0,
	"badge_earned" varchar(100),
	"time_to_complete" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"quiz_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"answers" jsonb NOT NULL,
	"score" integer NOT NULL,
	"percentage" real NOT NULL,
	"archetype_result" varchar(100),
	"recommendations" jsonb,
	"time_to_complete" integer DEFAULT 0,
	"exit_point" varchar(50),
	"action_taken" varchar(100),
	"xp_earned" integer DEFAULT 0,
	"is_passed" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"quiz_type" varchar(50),
	"questions" jsonb NOT NULL,
	"scoring_logic" jsonb NOT NULL,
	"result_mappings" jsonb NOT NULL,
	"estimated_time" integer DEFAULT 300,
	"xp_reward" integer DEFAULT 25,
	"retake_allowed" boolean DEFAULT true,
	"passing_score" integer DEFAULT 70,
	"is_active" boolean DEFAULT true,
	"completion_count" integer DEFAULT 0,
	"average_score" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_quizzes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "education_tool_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tool_id" integer,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"inputs" jsonb NOT NULL,
	"outputs" jsonb NOT NULL,
	"archetype" varchar(100),
	"time_spent" integer DEFAULT 0,
	"action_taken" varchar(100),
	"xp_earned" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"tool_type" varchar(50),
	"emotion_mapping" varchar(50),
	"input_fields" jsonb,
	"calculation_logic" text,
	"output_format" jsonb,
	"tracking_enabled" boolean DEFAULT true,
	"xp_reward" integer DEFAULT 5,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "education_tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"shortDescription" text,
	"website" text NOT NULL,
	"logo" text,
	"categoryId" integer NOT NULL,
	"subcategories" jsonb,
	"pricingModel" text NOT NULL,
	"priceFrom" numeric(10, 2),
	"priceTo" numeric(10, 2),
	"pricingDetails" jsonb,
	"features" jsonb,
	"useCase" jsonb,
	"platforms" jsonb,
	"integrations" jsonb,
	"apiAvailable" boolean DEFAULT false,
	"rating" numeric(3, 2) DEFAULT '0',
	"totalReviews" integer DEFAULT 0,
	"launchDate" timestamp,
	"lastUpdated" timestamp,
	"isActive" boolean DEFAULT true,
	"isFeatured" boolean DEFAULT false,
	"trustScore" integer DEFAULT 50,
	"metaTitle" text,
	"metaDescription" text,
	"tags" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools_analytics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_analytics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"sessionId" text NOT NULL,
	"event" text NOT NULL,
	"toolId" integer,
	"categoryId" integer,
	"contentId" integer,
	"offerId" integer,
	"userArchetype" text,
	"deviceType" text,
	"source" text,
	"data" jsonb,
	"value" numeric(10, 2),
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_archetypes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_archetypes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"primaryMotivation" text NOT NULL,
	"preferredFeatures" jsonb,
	"uiPreferences" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_tools_archetypes_name_unique" UNIQUE("name"),
	CONSTRAINT "ai_tools_archetypes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools_categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"icon" text,
	"parentId" integer,
	"sortOrder" integer DEFAULT 0,
	"isActive" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_tools_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools_comparisons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_comparisons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"toolIds" jsonb NOT NULL,
	"criteria" jsonb,
	"overallWinner" integer,
	"categoryWinners" jsonb,
	"metaTitle" text,
	"metaDescription" text,
	"views" integer DEFAULT 0,
	"isPublished" boolean DEFAULT true,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_tools_comparisons_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools_content" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_content_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featuredImage" text,
	"relatedTools" jsonb,
	"categories" jsonb,
	"tags" jsonb,
	"metaTitle" text,
	"metaDescription" text,
	"focusKeyword" text,
	"views" integer DEFAULT 0,
	"avgTimeOnPage" integer DEFAULT 0,
	"bounceRate" numeric(5, 2) DEFAULT '0',
	"status" text DEFAULT 'draft',
	"publishedAt" timestamp,
	"isAiGenerated" boolean DEFAULT false,
	"generationPrompt" text,
	"lastOptimized" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_tools_content_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ai_tools_experiments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_experiments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"variants" jsonb NOT NULL,
	"targetArchetypes" jsonb,
	"targetPages" jsonb,
	"status" text DEFAULT 'draft',
	"startDate" timestamp,
	"endDate" timestamp,
	"participantCount" integer DEFAULT 0,
	"results" jsonb,
	"winner" text,
	"confidence" numeric(5, 2),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_leads" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"sessionId" text NOT NULL,
	"source" text NOT NULL,
	"leadMagnet" text,
	"archetype" text,
	"interests" jsonb,
	"experience" text,
	"quizTaken" boolean DEFAULT false,
	"downloadsCount" integer DEFAULT 0,
	"emailsOpened" integer DEFAULT 0,
	"emailsClicked" integer DEFAULT 0,
	"isSubscribed" boolean DEFAULT true,
	"unsubscribedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_offers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_offers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"toolId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"offerType" text NOT NULL,
	"originalPrice" numeric(10, 2),
	"offerPrice" numeric(10, 2),
	"discountPercentage" integer,
	"affiliateUrl" text NOT NULL,
	"affiliateNetwork" text,
	"commission" numeric(5, 2),
	"startDate" timestamp,
	"endDate" timestamp,
	"isActive" boolean DEFAULT true,
	"isLimitedTime" boolean DEFAULT false,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" numeric(10, 2) DEFAULT '0',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_quiz_results" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_quiz_results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quizId" integer NOT NULL,
	"sessionId" text NOT NULL,
	"userId" text,
	"answers" jsonb NOT NULL,
	"primaryArchetype" text NOT NULL,
	"secondaryArchetype" text,
	"recommendedCategories" jsonb,
	"recommendedTools" jsonb,
	"archetypeScores" jsonb,
	"categoryScores" jsonb,
	"completedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_quizzes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_quizzes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text,
	"questions" jsonb NOT NULL,
	"archetypeWeights" jsonb,
	"categoryWeights" jsonb,
	"isActive" boolean DEFAULT true,
	"totalTaken" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_tools_reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_tools_reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"toolId" integer NOT NULL,
	"userId" text,
	"sessionId" text,
	"rating" integer NOT NULL,
	"title" text,
	"content" text,
	"pros" jsonb,
	"cons" jsonb,
	"userArchetype" text,
	"useCase" text,
	"experienceLevel" text,
	"verified" boolean DEFAULT false,
	"helpful" integer DEFAULT 0,
	"unhelpful" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "config_ai_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" varchar(255) NOT NULL,
	"prompt_snippets" jsonb,
	"rag_context" jsonb,
	"ai_assist_metadata" jsonb,
	"training_tags" jsonb,
	"training_examples" jsonb,
	"feedback_data" jsonb,
	"ai_generated_fields" jsonb,
	"confidence_scores" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "config_change_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"change_id" uuid DEFAULT gen_random_uuid(),
	"config_id" varchar(255) NOT NULL,
	"change_type" varchar(50) NOT NULL,
	"previous_version" varchar(50),
	"new_version" varchar(50),
	"previous_data" jsonb,
	"new_data" jsonb,
	"diff" jsonb,
	"reason" text,
	"rollback_id" varchar(255),
	"user_id" varchar(255),
	"username" varchar(255),
	"user_role" varchar(100),
	"source" varchar(100) DEFAULT 'manual',
	"source_details" jsonb,
	"requires_approval" boolean DEFAULT false,
	"approved_by" varchar(255),
	"approved_at" timestamp,
	"approval_notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "config_federation_sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_id" uuid DEFAULT gen_random_uuid(),
	"config_id" varchar(255) NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"neuron_type" varchar(100),
	"neuron_version" varchar(50),
	"sync_type" varchar(50) NOT NULL,
	"sync_status" varchar(50) DEFAULT 'pending',
	"config_version" varchar(50),
	"synced_data" jsonb,
	"overrides" jsonb,
	"conflicts" jsonb,
	"conflict_resolution" varchar(50),
	"sync_duration" integer,
	"retry_count" integer DEFAULT 0,
	"last_error" text,
	"sync_started_at" timestamp DEFAULT now(),
	"sync_completed_at" timestamp,
	"next_sync_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "config_performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_id" uuid DEFAULT gen_random_uuid(),
	"config_id" varchar(255) NOT NULL,
	"load_time" real,
	"cache_hit_rate" real,
	"validation_time" real,
	"sync_time" real,
	"access_count" integer DEFAULT 0,
	"update_count" integer DEFAULT 0,
	"error_count" integer DEFAULT 0,
	"memory_usage" integer,
	"cpu_usage" real,
	"network_usage" integer,
	"environment" varchar(50),
	"user_agent" varchar(255),
	"region" varchar(50),
	"recorded_at" timestamp DEFAULT now(),
	"day_bucket" varchar(10)
);
--> statement-breakpoint
CREATE TABLE "config_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"user_role" varchar(100),
	"team_id" varchar(255),
	"can_read" boolean DEFAULT true,
	"can_write" boolean DEFAULT false,
	"can_delete" boolean DEFAULT false,
	"can_approve" boolean DEFAULT false,
	"can_rollback" boolean DEFAULT false,
	"allowed_environments" jsonb DEFAULT '["development"]'::jsonb,
	"allowed_verticals" jsonb,
	"allowed_locales" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "config_registry" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"vertical" varchar(100),
	"locale" varchar(10) DEFAULT 'en-US',
	"user_persona" varchar(100),
	"intent_cluster" varchar(100),
	"layout_type" varchar(50) DEFAULT 'standard',
	"feature_flags" jsonb DEFAULT '{}'::jsonb,
	"ab_test_variant" varchar(100),
	"config_data" jsonb NOT NULL,
	"schema" jsonb,
	"title" varchar(255) NOT NULL,
	"description" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"category" varchar(100),
	"is_active" boolean DEFAULT true,
	"is_locked" boolean DEFAULT false,
	"deprecated" boolean DEFAULT false,
	"author" varchar(255),
	"last_modified_by" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_deployed_at" timestamp,
	CONSTRAINT "config_registry_config_id_unique" UNIQUE("config_id")
);
--> statement-breakpoint
CREATE TABLE "config_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"snapshot_id" varchar(255) NOT NULL,
	"config_id" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"config_data" jsonb NOT NULL,
	"metadata" jsonb,
	"snapshot_type" varchar(50) DEFAULT 'manual',
	"description" text,
	"is_valid" boolean DEFAULT true,
	"validation_errors" jsonb,
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "config_snapshots_snapshot_id_unique" UNIQUE("snapshot_id")
);
--> statement-breakpoint
CREATE TABLE "config_validation_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100),
	"rule_type" varchar(50) NOT NULL,
	"rule_definition" jsonb NOT NULL,
	"severity" varchar(50) DEFAULT 'error',
	"applies_to" jsonb,
	"conditions" jsonb,
	"is_active" boolean DEFAULT true,
	"is_built_in" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "config_validation_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "graph_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" integer,
	"edge_id" integer,
	"metric_type" varchar(50) NOT NULL,
	"value" real NOT NULL,
	"aggregation_type" varchar(20) DEFAULT 'sum',
	"timeframe" varchar(20) NOT NULL,
	"date" timestamp NOT NULL,
	"neuron_id" varchar(100),
	"vertical" varchar(50),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "graph_audit_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_type" varchar(50) NOT NULL,
	"node_id" integer,
	"edge_id" integer,
	"severity" varchar(20) NOT NULL,
	"issue" text NOT NULL,
	"recommendation" text,
	"auto_fix_available" boolean DEFAULT false,
	"is_resolved" boolean DEFAULT false,
	"resolved_by" varchar(50),
	"resolved_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "realtime_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255) NOT NULL,
	"fingerprint" varchar(500),
	"node_id" integer NOT NULL,
	"recommendation_type" varchar(50) NOT NULL,
	"score" real NOT NULL,
	"reason" text,
	"context" jsonb,
	"position" integer,
	"is_displayed" boolean DEFAULT false,
	"is_clicked" boolean DEFAULT false,
	"is_converted" boolean DEFAULT false,
	"displayed_at" timestamp,
	"clicked_at" timestamp,
	"converted_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "semantic_edges" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_node_id" integer NOT NULL,
	"to_node_id" integer NOT NULL,
	"edge_type" varchar(50) NOT NULL,
	"weight" real DEFAULT 1,
	"confidence" real DEFAULT 0.5,
	"metadata" jsonb,
	"created_by" varchar(50) DEFAULT 'system',
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"last_traversed" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "semantic_nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"node_type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"metadata" jsonb,
	"vector_embedding" jsonb,
	"semantic_keywords" jsonb,
	"llm_summary" text,
	"intent_profile_tags" jsonb,
	"status" varchar(20) DEFAULT 'active',
	"vertical_id" varchar(50),
	"neuron_id" varchar(100),
	"click_through_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"engagement" real DEFAULT 0,
	"last_optimized" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "semantic_nodes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "semantic_search_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"query_text" text NOT NULL,
	"query_vector" jsonb,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"results" jsonb,
	"clicked_results" jsonb,
	"performance_metrics" jsonb,
	"intent" varchar(100),
	"vertical" varchar(50),
	"neuron_id" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_intent_vectors" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"fingerprint" varchar(500),
	"intent_vector" jsonb NOT NULL,
	"current_archetype" varchar(100),
	"intent_tags" jsonb,
	"behaviors" jsonb,
	"preferences" jsonb,
	"interaction_history" jsonb,
	"strength" real DEFAULT 1,
	"last_activity" timestamp DEFAULT now(),
	"decay_rate" real DEFAULT 0.1,
	"neuron_affinities" jsonb,
	"vertical_preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_similarity_index" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" integer NOT NULL,
	"similar_node_id" integer NOT NULL,
	"similarity" real NOT NULL,
	"algorithm" varchar(50) DEFAULT 'cosine',
	"last_calculated" timestamp DEFAULT now(),
	"is_valid" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "vector_database_adapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"adapter_name" varchar(100) NOT NULL,
	"database_type" varchar(50) NOT NULL,
	"connection_string" text,
	"is_active" boolean DEFAULT true,
	"is_primary" boolean DEFAULT false,
	"priority" integer DEFAULT 1,
	"configuration" jsonb,
	"health_status" varchar(20) DEFAULT 'unknown',
	"last_health_check" timestamp,
	"performance" jsonb,
	"capacity" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vector_database_adapters_adapter_name_unique" UNIQUE("adapter_name")
);
--> statement-breakpoint
CREATE TABLE "vector_embedding_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_name" varchar(100) NOT NULL,
	"provider" varchar(50) NOT NULL,
	"dimensions" integer NOT NULL,
	"max_input_length" integer NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"configuration" jsonb,
	"performance" jsonb,
	"supported_languages" jsonb,
	"api_endpoint" text,
	"api_key_required" boolean DEFAULT false,
	"cost_per_token" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vector_embedding_models_model_name_unique" UNIQUE("model_name")
);
--> statement-breakpoint
CREATE TABLE "vector_embeddings" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" varchar(255) NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_hash" varchar(64),
	"embedding" jsonb NOT NULL,
	"model_id" integer NOT NULL,
	"dimensions" integer NOT NULL,
	"metadata" jsonb,
	"text_content" text,
	"semantic_keywords" jsonb,
	"language" varchar(10) DEFAULT 'en',
	"quality_score" real DEFAULT 0.5,
	"is_stale" boolean DEFAULT false,
	"version" integer DEFAULT 1,
	"neuron_id" varchar(100),
	"vertical_id" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_indexing_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"content_id" varchar(255),
	"content_type" varchar(50),
	"content_data" jsonb,
	"model_id" integer,
	"priority" integer DEFAULT 5,
	"status" varchar(20) DEFAULT 'pending',
	"attempt_count" integer DEFAULT 0,
	"max_attempts" integer DEFAULT 3,
	"scheduled_at" timestamp DEFAULT now(),
	"started_at" timestamp,
	"completed_at" timestamp,
	"error_message" text,
	"processing_time_ms" integer,
	"batch_id" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_migration_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"migration_type" varchar(50) NOT NULL,
	"source_version" varchar(20),
	"target_version" varchar(20),
	"status" varchar(20) DEFAULT 'in_progress',
	"affected_records" integer DEFAULT 0,
	"backup_location" text,
	"checksum_before" varchar(64),
	"checksum_after" varchar(64),
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"error_message" text,
	"executed_by" varchar(100) DEFAULT 'system',
	"rollback_data" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"fingerprint" varchar(500),
	"recommendation_type" varchar(50) NOT NULL,
	"source_content_id" varchar(255),
	"recommended_content_id" varchar(255) NOT NULL,
	"score" real NOT NULL,
	"algorithm" varchar(50) DEFAULT 'hybrid',
	"model_id" integer,
	"reasoning" jsonb,
	"context" jsonb,
	"is_served" boolean DEFAULT false,
	"is_clicked" boolean DEFAULT false,
	"is_converted" boolean DEFAULT false,
	"clicked_at" timestamp,
	"converted_at" timestamp,
	"conversion_value" real,
	"user_feedback" integer,
	"expires_at" timestamp,
	"neuron_id" varchar(100),
	"vertical_id" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_search_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" varchar(10) NOT NULL,
	"hour" integer,
	"model_id" integer,
	"search_type" varchar(50),
	"total_queries" integer DEFAULT 0,
	"unique_users" integer DEFAULT 0,
	"avg_response_time" real DEFAULT 0,
	"avg_result_count" real DEFAULT 0,
	"avg_click_through_rate" real DEFAULT 0,
	"avg_conversion_rate" real DEFAULT 0,
	"top_queries" jsonb,
	"top_results" jsonb,
	"error_rate" real DEFAULT 0,
	"neuron_id" varchar(100),
	"vertical_id" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_search_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"query_text" text NOT NULL,
	"query_vector" jsonb,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"fingerprint" varchar(500),
	"search_type" varchar(50) NOT NULL,
	"filters" jsonb,
	"model_id" integer,
	"top_k" integer DEFAULT 10,
	"threshold" real DEFAULT 0.3,
	"result_count" integer DEFAULT 0,
	"result_ids" jsonb,
	"response_time_ms" integer,
	"algorithm" varchar(20) DEFAULT 'cosine',
	"quality_score" real,
	"click_through_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"neuron_id" varchar(100),
	"vertical_id" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vector_similarity_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_content_id" varchar(255) NOT NULL,
	"target_content_id" varchar(255) NOT NULL,
	"similarity" real NOT NULL,
	"algorithm" varchar(20) DEFAULT 'cosine',
	"model_id" integer NOT NULL,
	"is_valid" boolean DEFAULT true,
	"rank" integer,
	"last_calculated" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "neuron_offer_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"offer_id" integer,
	"position" varchar(100),
	"context" varchar(255),
	"emotion_match" varchar(50),
	"intent_match" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"auto_assigned" boolean DEFAULT true,
	"assigned_at" timestamp DEFAULT now(),
	"last_served" timestamp,
	"serve_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "offer_ai_optimization_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"priority" integer DEFAULT 1,
	"offer_id" integer,
	"neuron_id" varchar(255),
	"parameters" jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"result" jsonb,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"neuron_id" varchar(255),
	"page_slug" varchar(255),
	"event_type" varchar(50) NOT NULL,
	"device_type" varchar(50),
	"geo_location" varchar(100),
	"user_agent" text,
	"referrer" text,
	"conversion_value" real,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_compliance_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rule_type" varchar(50) NOT NULL,
	"conditions" jsonb NOT NULL,
	"action" varchar(50) NOT NULL,
	"severity" varchar(20) DEFAULT 'medium',
	"is_active" boolean DEFAULT true,
	"violation_count" integer DEFAULT 0,
	"last_triggered" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"target_metric" varchar(50) NOT NULL,
	"variants" jsonb NOT NULL,
	"traffic_split" jsonb DEFAULT '{"control": 50, "variant": 50}',
	"status" varchar(50) DEFAULT 'draft',
	"start_date" timestamp,
	"end_date" timestamp,
	"results" jsonb,
	"winning_variant" varchar(100),
	"confidence" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"source_id" integer,
	"title" varchar(500) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"merchant" varchar(255) NOT NULL,
	"price" real,
	"old_price" real,
	"currency" varchar(10) DEFAULT 'USD',
	"coupon_code" varchar(100),
	"discount_type" varchar(50),
	"discount_value" real,
	"valid_till" timestamp,
	"region" varchar(100) DEFAULT 'global',
	"emotion" varchar(50),
	"category" varchar(100) NOT NULL,
	"tags" jsonb,
	"source_type" varchar(50) NOT NULL,
	"is_expired" boolean DEFAULT false,
	"click_tracking_url" text NOT NULL,
	"api_source" varchar(100),
	"commission_estimate" real,
	"meta" jsonb,
	"llm_summary" text,
	"intent_embedding" jsonb,
	"quality_score" real DEFAULT 0,
	"ctr" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"last_click" timestamp,
	"click_count" integer DEFAULT 0,
	"revenue_generated" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"priority" integer DEFAULT 1,
	"auto_generated" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"synced_at" timestamp DEFAULT now(),
	CONSTRAINT "offer_feed_offer_uuid_unique" UNIQUE("offer_uuid"),
	CONSTRAINT "offer_feed_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offer_personalization_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"conditions" jsonb NOT NULL,
	"actions" jsonb NOT NULL,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"success_rate" real DEFAULT 0,
	"last_tested" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offer_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"description" text,
	"base_url" text,
	"api_config" jsonb,
	"scraping_config" jsonb,
	"credentials" jsonb,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"sync_frequency" varchar(50) DEFAULT 'hourly',
	"error_count" integer DEFAULT 0,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "offer_sources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offer_sync_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"batch_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sync_type" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"offers_processed" integer DEFAULT 0,
	"offers_added" integer DEFAULT 0,
	"offers_updated" integer DEFAULT 0,
	"offers_removed" integer DEFAULT 0,
	"errors" jsonb,
	"metadata" jsonb,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notification_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer,
	"trigger_id" integer,
	"campaign_id" integer,
	"queue_id" integer,
	"date" timestamp NOT NULL,
	"hour" integer,
	"channel" varchar(50) NOT NULL,
	"segment" varchar(100),
	"queued" integer DEFAULT 0,
	"sent" integer DEFAULT 0,
	"delivered" integer DEFAULT 0,
	"failed" integer DEFAULT 0,
	"bounced" integer DEFAULT 0,
	"opened" integer DEFAULT 0,
	"clicked" integer DEFAULT 0,
	"converted" integer DEFAULT 0,
	"unsubscribed" integer DEFAULT 0,
	"avg_delivery_time" real,
	"open_rate" real,
	"click_rate" real,
	"conversion_rate" real,
	"unsubscribe_rate" real,
	"cost_per_send" real,
	"total_cost" real,
	"spam_score" real,
	"reputation_score" real,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'draft',
	"target_audience" jsonb,
	"estimated_reach" integer DEFAULT 0,
	"start_date" timestamp,
	"end_date" timestamp,
	"primary_goal" varchar(100),
	"success_metrics" jsonb,
	"is_test_campaign" boolean DEFAULT false,
	"test_configuration" jsonb,
	"budget_limit" real,
	"send_limit" integer,
	"tags" jsonb,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "notification_campaigns_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notification_channels" (
	"id" serial PRIMARY KEY NOT NULL,
	"channel" varchar(50) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"config" jsonb NOT NULL,
	"credentials" jsonb,
	"is_active" boolean DEFAULT true,
	"is_primary" boolean DEFAULT false,
	"priority" integer DEFAULT 1,
	"rate_limit" integer DEFAULT 1000,
	"daily_limit" integer DEFAULT 10000,
	"last_health_check" timestamp,
	"health_status" varchar(20) DEFAULT 'healthy',
	"error_rate" real DEFAULT 0,
	"cost_per_send" real DEFAULT 0,
	"monthly_budget" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "notification_channels_channel_unique" UNIQUE("channel")
);
--> statement-breakpoint
CREATE TABLE "notification_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer,
	"trigger_id" integer,
	"campaign_id" integer,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"recipient_email" varchar(255),
	"recipient_phone" varchar(50),
	"recipient_push_token" text,
	"channel" varchar(50) NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"html_content" text,
	"personalization_data" jsonb,
	"rendered_at" timestamp,
	"priority" varchar(20) DEFAULT 'normal',
	"scheduled_for" timestamp DEFAULT now(),
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"status" varchar(20) DEFAULT 'queued',
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"failed_at" timestamp,
	"error_message" text,
	"provider_response" jsonb,
	"opened_at" timestamp,
	"clicked_at" timestamp,
	"converted_at" timestamp,
	"unsubscribed_at" timestamp,
	"delivery_time" integer,
	"engagement_score" real,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"channel" varchar(50) NOT NULL,
	"type" varchar(100) NOT NULL,
	"subject" text,
	"body_template" text NOT NULL,
	"html_template" text,
	"variables" jsonb,
	"priority" varchar(20) DEFAULT 'normal',
	"segment" varchar(100),
	"locale" varchar(10) DEFAULT 'en',
	"personalization_rules" jsonb,
	"ai_optimized" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_default" boolean DEFAULT false,
	"testing_enabled" boolean DEFAULT false,
	"conversion_goal" varchar(100),
	"requires_consent" boolean DEFAULT false,
	"gdpr_compliant" boolean DEFAULT true,
	"tags" jsonb,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "notification_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "notification_triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"trigger_type" varchar(50) NOT NULL,
	"event_name" varchar(100),
	"conditions" jsonb NOT NULL,
	"delay" integer DEFAULT 0,
	"time_window" jsonb,
	"timezone" varchar(50) DEFAULT 'UTC',
	"target_segments" jsonb,
	"exclude_segments" jsonb,
	"channel_priority" jsonb NOT NULL,
	"fallback_logic" jsonb,
	"max_sends_per_user" integer DEFAULT 1,
	"cooldown_period" integer DEFAULT 1440,
	"is_active" boolean DEFAULT true,
	"pause_after_failures" integer DEFAULT 5,
	"priority" varchar(20) DEFAULT 'normal',
	"expected_volume" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "notification_triggers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"session_id" varchar(255),
	"email" varchar(255),
	"email_enabled" boolean DEFAULT true,
	"sms_enabled" boolean DEFAULT false,
	"push_enabled" boolean DEFAULT true,
	"in_app_enabled" boolean DEFAULT true,
	"whatsapp_enabled" boolean DEFAULT false,
	"marketing_enabled" boolean DEFAULT true,
	"transactional_enabled" boolean DEFAULT true,
	"security_enabled" boolean DEFAULT true,
	"product_updates_enabled" boolean DEFAULT true,
	"frequency" varchar(20) DEFAULT 'normal',
	"quiet_hours" jsonb,
	"timezone" varchar(50) DEFAULT 'UTC',
	"personalization_level" varchar(20) DEFAULT 'standard',
	"ai_optimization_enabled" boolean DEFAULT true,
	"consent_given" boolean DEFAULT false,
	"consent_date" timestamp,
	"gdpr_compliant" boolean DEFAULT true,
	"global_opt_out" boolean DEFAULT false,
	"opt_out_date" timestamp,
	"opt_out_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deep_link_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"link_type" varchar(50),
	"source_url" text,
	"target_path" varchar(500),
	"campaign_source" varchar(100),
	"campaign_medium" varchar(100),
	"campaign_name" varchar(100),
	"referrer" text,
	"user_agent" text,
	"is_success" boolean DEFAULT true,
	"error_message" text,
	"conversion_value" real,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "device_capabilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"device_type" varchar(50),
	"operating_system" varchar(50),
	"os_version" varchar(50),
	"browser_engine" varchar(50),
	"screen_resolution" varchar(50),
	"color_depth" integer,
	"pixel_ratio" real,
	"touch_support" boolean DEFAULT false,
	"gpu_info" jsonb,
	"network_type" varchar(20),
	"battery_level" real,
	"memory_gb" real,
	"storage_gb" real,
	"supported_features" jsonb,
	"performance_metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mobile_app_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"app_version" varchar(50) NOT NULL,
	"build_number" integer NOT NULL,
	"manifest_config" jsonb NOT NULL,
	"native_plugins" jsonb,
	"permissions" jsonb,
	"store_listing_data" jsonb,
	"security_config" jsonb,
	"performance_config" jsonb,
	"compliance_settings" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "offline_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"action" varchar(100) NOT NULL,
	"endpoint" varchar(255),
	"method" varchar(10) DEFAULT 'POST',
	"data" jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"created_at" timestamp DEFAULT now(),
	"processed_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "push_personalization" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscription_id" integer,
	"session_id" varchar(255),
	"user_archetype" varchar(100),
	"preferred_time" varchar(20),
	"timezone" varchar(50),
	"engagement_score" real DEFAULT 0,
	"click_through_rate" real DEFAULT 0,
	"unsubscribe_rate" real DEFAULT 0,
	"content_preferences" jsonb,
	"device_preferences" jsonb,
	"behavior_metrics" jsonb,
	"last_engagement" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"topics" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_notification_at" timestamp,
	"metadata" jsonb,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "pwa_aso_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"app_name" varchar(255) NOT NULL,
	"platform" varchar(50) NOT NULL,
	"keyword" varchar(255),
	"ranking" integer,
	"search_volume" integer,
	"conversion_rate" real,
	"impressions" integer DEFAULT 0,
	"installs" integer DEFAULT 0,
	"date" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "pwa_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"vapid_public_key" text,
	"notification_topics" jsonb DEFAULT '[]'::jsonb,
	"cache_strategy" varchar(50) DEFAULT 'networkFirst',
	"offline_pages" jsonb DEFAULT '[]'::jsonb,
	"install_prompt_config" jsonb,
	"features" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pwa_installs" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"user_agent" text,
	"platform" varchar(50),
	"install_source" varchar(50),
	"engagement_score" integer DEFAULT 0,
	"device_info" jsonb,
	"installed_at" timestamp DEFAULT now(),
	"uninstalled_at" timestamp,
	"is_active" boolean DEFAULT true,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "pwa_notification_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"topics" jsonb DEFAULT '[]'::jsonb,
	"targeted_users" integer DEFAULT 0,
	"delivered_count" integer DEFAULT 0,
	"clicked_count" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "pwa_performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"device_id" varchar(255),
	"metric_type" varchar(50),
	"metric_value" real NOT NULL,
	"url" text,
	"connection_type" varchar(20),
	"device_type" varchar(20),
	"user_agent" text,
	"timestamp" timestamp DEFAULT now(),
	"additional_data" jsonb
);
--> statement-breakpoint
CREATE TABLE "pwa_usage_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255),
	"date" timestamp DEFAULT now(),
	"is_standalone" boolean DEFAULT false,
	"is_offline" boolean DEFAULT false,
	"page_views" integer DEFAULT 0,
	"session_duration" integer DEFAULT 0,
	"features_used" jsonb DEFAULT '[]'::jsonb,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"performance" jsonb,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "funnel_ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"funnel_id" integer,
	"test_type" varchar(50) DEFAULT 'ab',
	"variants" jsonb NOT NULL,
	"traffic_split" jsonb NOT NULL,
	"target_audience" jsonb,
	"start_conditions" jsonb,
	"stop_conditions" jsonb,
	"status" varchar(50) DEFAULT 'draft',
	"winning_variant" varchar(100),
	"confidence" real,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "funnel_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"funnel_id" integer,
	"block_id" integer,
	"date" timestamp NOT NULL,
	"period" varchar(20) DEFAULT 'daily',
	"views" integer DEFAULT 0,
	"interactions" integer DEFAULT 0,
	"completions" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"abandons" integer DEFAULT 0,
	"average_time_spent" real DEFAULT 0,
	"bounce_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"engagement_score" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"avg_order_value" real DEFAULT 0,
	"ltv" real DEFAULT 0,
	"variant" varchar(100),
	"test_confidence" real,
	"segment" varchar(100),
	"demographic_data" jsonb,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "funnel_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category" varchar(100),
	"config" jsonb NOT NULL,
	"content" jsonb NOT NULL,
	"styling" jsonb,
	"entry_conditions" jsonb,
	"exit_conditions" jsonb,
	"personalization_rules" jsonb,
	"tracking_events" jsonb,
	"is_reusable" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "funnel_blocks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "funnel_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"funnel_session_id" integer,
	"event_type" varchar(100) NOT NULL,
	"block_id" integer,
	"block_type" varchar(100),
	"event_data" jsonb,
	"user_input" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"time_on_block" integer,
	"scroll_depth" real,
	"click_position" jsonb,
	"emotion_detected" varchar(50),
	"intent_score" real,
	"engagement_level" varchar(50),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "funnel_integrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"endpoint" varchar(500),
	"credentials" jsonb,
	"config" jsonb,
	"event_mapping" jsonb,
	"data_mapping" jsonb,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"error_count" integer DEFAULT 0,
	"last_error" text,
	"rate_limit_config" jsonb,
	"retry_config" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "funnel_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"slug" varchar(255) NOT NULL,
	"category" varchar(100),
	"is_public" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"version" varchar(50) DEFAULT '1.0.0',
	"blocks" jsonb NOT NULL,
	"flow_logic" jsonb NOT NULL,
	"trigger_rules" jsonb,
	"personalization_rules" jsonb,
	"ai_optimization_settings" jsonb,
	"ml_model_config" jsonb,
	"conversion_goals" jsonb,
	"testing_config" jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "funnel_templates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "funnel_triggers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"funnel_id" integer,
	"trigger_type" varchar(100) NOT NULL,
	"conditions" jsonb NOT NULL,
	"action" varchar(100) NOT NULL,
	"action_config" jsonb,
	"audience_rules" jsonb,
	"timing_rules" jsonb,
	"frequency_rules" jsonb,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 100,
	"trigger_count" integer DEFAULT 0,
	"success_rate" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "user_funnel_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"funnel_id" integer,
	"current_block_id" integer,
	"current_step" integer DEFAULT 0,
	"status" varchar(50) DEFAULT 'active',
	"user_vector" jsonb,
	"emotion_state" jsonb,
	"device_info" jsonb,
	"geo_location" jsonb,
	"referral_source" varchar(255),
	"completed_blocks" jsonb DEFAULT '[]'::jsonb,
	"skipped_blocks" jsonb DEFAULT '[]'::jsonb,
	"block_responses" jsonb DEFAULT '{}'::jsonb,
	"assigned_variant" varchar(100),
	"personalization_applied" jsonb,
	"ai_recommendations" jsonb,
	"engagement_score" real DEFAULT 0,
	"conversion_score" real DEFAULT 0,
	"total_time_spent" integer DEFAULT 0,
	"started_at" timestamp DEFAULT now(),
	"last_activity_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"resume_token" varchar(255),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "codex_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" varchar(255) NOT NULL,
	"audit_type" varchar(100) NOT NULL,
	"scope" varchar(255) NOT NULL,
	"target_path" varchar(500),
	"status" varchar(50) DEFAULT 'pending',
	"priority" varchar(20) DEFAULT 'medium',
	"llm_provider" varchar(100) DEFAULT 'openai',
	"model_used" varchar(100),
	"prompt_template" text,
	"issues_found" integer DEFAULT 0,
	"issues_resolved" integer DEFAULT 0,
	"audit_score" real,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"execution_time" integer,
	"triggered_by" varchar(100),
	"audit_config" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "codex_audits_audit_id_unique" UNIQUE("audit_id")
);
--> statement-breakpoint
CREATE TABLE "codex_fixes" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer,
	"fix_id" varchar(255) NOT NULL,
	"fix_type" varchar(100) NOT NULL,
	"fix_category" varchar(100),
	"file_path" varchar(500) NOT NULL,
	"original_code" text,
	"fixed_code" text,
	"diff_patch" text,
	"status" varchar(50) DEFAULT 'pending',
	"apply_method" varchar(100),
	"requires_approval" boolean DEFAULT true,
	"approved_by" varchar(255),
	"approved_at" timestamp,
	"rejected_by" varchar(255),
	"rejected_at" timestamp,
	"rejection_reason" text,
	"commit_hash" varchar(100),
	"branch_name" varchar(255),
	"pull_request_url" varchar(500),
	"can_rollback" boolean DEFAULT true,
	"rollback_data" jsonb,
	"rolled_back_at" timestamp,
	"tests_passed" boolean,
	"validation_results" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"applied_at" timestamp,
	CONSTRAINT "codex_fixes_fix_id_unique" UNIQUE("fix_id")
);
--> statement-breakpoint
CREATE TABLE "codex_issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" integer,
	"issue_id" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"type" varchar(100) NOT NULL,
	"file_path" varchar(500),
	"line_number" integer,
	"column_number" integer,
	"code_snippet" text,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"recommendation" text,
	"status" varchar(50) DEFAULT 'open',
	"resolution" varchar(50),
	"ai_confidence" real,
	"ai_reasoning" text,
	"proposed_fix" text,
	"fix_diff" text,
	"fix_applied" boolean DEFAULT false,
	"impact_score" real,
	"risk_level" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	CONSTRAINT "codex_issues_issue_id_unique" UNIQUE("issue_id")
);
--> statement-breakpoint
CREATE TABLE "codex_learning" (
	"id" serial PRIMARY KEY NOT NULL,
	"learning_id" varchar(255) NOT NULL,
	"pattern_type" varchar(100) NOT NULL,
	"pattern_data" jsonb NOT NULL,
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"neuron_scope" varchar(100),
	"occurrence_count" integer DEFAULT 1,
	"success_rate" real,
	"confidence" real,
	"prevention_rule" jsonb,
	"improvement_suggestion" text,
	"automation_opportunity" text,
	"impact_score" real,
	"priority_level" varchar(20),
	"is_active" boolean DEFAULT true,
	"last_seen" timestamp DEFAULT now(),
	"evolution_stage" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "codex_learning_learning_id_unique" UNIQUE("learning_id")
);
--> statement-breakpoint
CREATE TABLE "codex_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" varchar(255) NOT NULL,
	"report_type" varchar(100) NOT NULL,
	"period" varchar(50),
	"scope" varchar(100),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"report_data" jsonb NOT NULL,
	"summary" jsonb,
	"metrics" jsonb,
	"insights" jsonb,
	"recommendations" jsonb,
	"generated_by" varchar(100),
	"generation_time" integer,
	"status" varchar(50) DEFAULT 'generated',
	"is_public" boolean DEFAULT false,
	"export_formats" jsonb,
	"distribution_list" jsonb,
	"last_distributed" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "codex_reports_report_id_unique" UNIQUE("report_id")
);
--> statement-breakpoint
CREATE TABLE "codex_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"schedule_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"audit_types" jsonb NOT NULL,
	"cron_expression" varchar(100),
	"frequency" varchar(50),
	"next_run" timestamp,
	"last_run" timestamp,
	"scope" jsonb,
	"filters" jsonb,
	"llm_config" jsonb,
	"audit_config" jsonb,
	"auto_fix_enabled" boolean DEFAULT false,
	"max_auto_fixes" integer DEFAULT 10,
	"is_active" boolean DEFAULT true,
	"last_successful_run" timestamp,
	"consecutive_failures" integer DEFAULT 0,
	"health_status" varchar(50) DEFAULT 'healthy',
	"notify_on_completion" boolean DEFAULT false,
	"notify_on_failure" boolean DEFAULT true,
	"notification_channels" jsonb,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "codex_schedules_schedule_id_unique" UNIQUE("schedule_id")
);
--> statement-breakpoint
CREATE TABLE "content_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"external_id" varchar(255),
	"content_type" varchar(100) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"content" text,
	"excerpt" text,
	"category" varchar(100),
	"tags" jsonb,
	"price" numeric(10, 2),
	"original_price" numeric(10, 2),
	"currency" varchar(10),
	"discount" numeric(5, 2),
	"coupon_code" varchar(100),
	"affiliate_url" text,
	"merchant_name" varchar(255),
	"author" varchar(255),
	"published_at" timestamp,
	"image_url" text,
	"images" jsonb,
	"rating" numeric(3, 2),
	"review_count" integer,
	"views" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"ctr" numeric(5, 4) DEFAULT '0',
	"conversion_rate" numeric(5, 4) DEFAULT '0',
	"quality_score" numeric(3, 2),
	"status" varchar(50) DEFAULT 'active',
	"is_manually_overridden" boolean DEFAULT false,
	"manual_priority" integer,
	"ai_enriched" boolean DEFAULT false,
	"ai_generated_content" jsonb,
	"ai_quality_flags" jsonb,
	"compliance_status" varchar(50) DEFAULT 'pending',
	"moderation_flags" jsonb,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"synced_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer,
	"date" timestamp NOT NULL,
	"metric" varchar(100) NOT NULL,
	"value" numeric(15, 4) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"parent_id" integer,
	"description" text,
	"icon" varchar(100),
	"vertical_neuron" varchar(100),
	"content_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "content_feed_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "content_feed_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"interaction_type" varchar(100) NOT NULL,
	"metadata" jsonb,
	"revenue" numeric(10, 2),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer,
	"source_id" integer,
	"notification_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text,
	"severity" varchar(50) DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_id" integer,
	"rule_type" varchar(100) NOT NULL,
	"conditions" jsonb NOT NULL,
	"actions" jsonb NOT NULL,
	"priority" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"applied_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"source_type" varchar(100) NOT NULL,
	"api_endpoint" text,
	"auth_config" jsonb,
	"refresh_interval" integer DEFAULT 3600,
	"is_active" boolean DEFAULT true,
	"last_sync_at" timestamp,
	"next_sync_at" timestamp,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_feed_sync_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"sync_type" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"items_processed" integer DEFAULT 0,
	"items_added" integer DEFAULT 0,
	"items_updated" integer DEFAULT 0,
	"items_removed" integer DEFAULT 0,
	"errors" jsonb,
	"metadata" jsonb,
	"duration" integer,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "media_contacts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"publication" varchar(255),
	"beat" jsonb,
	"tier" varchar(100),
	"location" varchar(255),
	"verified" boolean DEFAULT false,
	"last_contacted" timestamp,
	"response_history" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "outreach_templates" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"subject" varchar(500),
	"template" text,
	"type" varchar(100),
	"variables" jsonb,
	"performance" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "affiliate_compliance_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"network_name" varchar(255) NOT NULL,
	"network_type" varchar(100) NOT NULL,
	"network_id" varchar(255),
	"allowed_countries" jsonb,
	"restricted_countries" jsonb,
	"restricted_regions" jsonb,
	"legal_frameworks" jsonb,
	"required_disclosures" jsonb,
	"disclosure_templates" jsonb,
	"disclosure_position" varchar(50),
	"disclosure_languages" jsonb,
	"network_policies" jsonb,
	"commission_structure" jsonb,
	"cookie_duration" integer,
	"tracking_methods" jsonb,
	"compliance_checks" jsonb,
	"last_compliance_check" timestamp,
	"compliance_score" numeric(3, 2),
	"violation_history" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"contract_start" timestamp,
	"contract_end" timestamp,
	"auto_renewal" boolean DEFAULT false,
	"total_clicks" integer DEFAULT 0,
	"total_conversions" integer DEFAULT 0,
	"total_revenue" numeric(12, 2) DEFAULT '0',
	"avg_epc" numeric(8, 4),
	"account_manager" varchar(255),
	"support_email" varchar(320),
	"technical_contact" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "compliance_audit_system" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" varchar(100) NOT NULL,
	"audit_type" varchar(100) NOT NULL,
	"vertical" varchar(100),
	"country" varchar(10),
	"date_range" jsonb,
	"audit_criteria" jsonb,
	"status" varchar(50) DEFAULT 'scheduled',
	"started_at" timestamp,
	"completed_at" timestamp,
	"executed_by" varchar(255),
	"automated_scan" boolean DEFAULT true,
	"overall_score" numeric(3, 2),
	"critical_issues" integer DEFAULT 0,
	"high_issues" integer DEFAULT 0,
	"medium_issues" integer DEFAULT 0,
	"low_issues" integer DEFAULT 0,
	"audit_findings" jsonb,
	"non_compliance_items" jsonb,
	"recommended_actions" jsonb,
	"risk_assessment" jsonb,
	"previous_audit_id" integer,
	"improvement_score" numeric(3, 2),
	"trend_analysis" jsonb,
	"remediation_plan" jsonb,
	"remediation_deadline" timestamp,
	"remediation_status" varchar(50),
	"follow_up_required" boolean DEFAULT false,
	"next_audit_date" timestamp,
	"report_generated" boolean DEFAULT false,
	"report_url" text,
	"report_format" varchar(50),
	"stakeholders_notified" boolean DEFAULT false,
	"audit_framework" varchar(100),
	"audit_standard" varchar(100),
	"certification_impact" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "compliance_audit_system_audit_id_unique" UNIQUE("audit_id")
);
--> statement-breakpoint
CREATE TABLE "compliance_rbac_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role_id" varchar(100) NOT NULL,
	"role_name" varchar(255) NOT NULL,
	"permissions" jsonb,
	"vertical_access" jsonb,
	"country_access" jsonb,
	"data_access" jsonb,
	"role_type" varchar(50) NOT NULL,
	"access_level" varchar(50) NOT NULL,
	"can_view_pii" boolean DEFAULT false,
	"can_export_data" boolean DEFAULT false,
	"can_delete_data" boolean DEFAULT false,
	"can_manage_consent" boolean DEFAULT false,
	"session_timeout" integer DEFAULT 3600,
	"ip_whitelist" jsonb,
	"require_mfa" boolean DEFAULT true,
	"last_login" timestamp,
	"failed_login_attempts" integer DEFAULT 0,
	"account_locked" boolean DEFAULT false,
	"is_delegated" boolean DEFAULT false,
	"delegated_by" varchar(255),
	"delegation_reason" text,
	"access_expires_at" timestamp,
	"access_log" jsonb,
	"actions_performed" jsonb,
	"data_accessed" jsonb,
	"compliance_training" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"granted_by" varchar(255),
	"granted_at" timestamp DEFAULT now(),
	"revoked_by" varchar(255),
	"revoked_at" timestamp,
	"revocation_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "geo_restriction_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(100) NOT NULL,
	"rule_name" varchar(255) NOT NULL,
	"rule_type" varchar(50) NOT NULL,
	"target_countries" jsonb,
	"target_regions" jsonb,
	"excluded_countries" jsonb,
	"excluded_regions" jsonb,
	"content_types" jsonb,
	"verticals" jsonb,
	"affiliate_networks" jsonb,
	"offer_categories" jsonb,
	"conditions" jsonb,
	"actions" jsonb,
	"fallback_content" jsonb,
	"redirect_url" text,
	"legal_basis" varchar(255),
	"compliance_framework" varchar(100),
	"regulatory_requirement" text,
	"status" varchar(50) DEFAULT 'active',
	"priority" integer DEFAULT 100,
	"effective_date" timestamp,
	"expiration_date" timestamp,
	"applications_count" integer DEFAULT 0,
	"blocked_requests" integer DEFAULT 0,
	"allowed_requests" integer DEFAULT 0,
	"last_triggered" timestamp,
	"test_mode" boolean DEFAULT false,
	"test_results" jsonb,
	"validation_status" varchar(50),
	"created_by" varchar(255),
	"last_modified_by" varchar(255),
	"change_reason" text,
	"approval_required" boolean DEFAULT false,
	"approved_by" varchar(255),
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "geo_restriction_management_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "global_consent_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"fingerprint" varchar(255),
	"ip_address" varchar(45),
	"user_agent" text,
	"country" varchar(10) NOT NULL,
	"region" varchar(100),
	"detected_region" varchar(100),
	"legal_framework" varchar(50) NOT NULL,
	"language_code" varchar(10) DEFAULT 'en',
	"cookies_consent" varchar(20) DEFAULT 'pending',
	"analytics_consent" varchar(20) DEFAULT 'pending',
	"personalization_consent" varchar(20) DEFAULT 'pending',
	"marketing_consent" varchar(20) DEFAULT 'pending',
	"affiliate_consent" varchar(20) DEFAULT 'pending',
	"email_consent" varchar(20) DEFAULT 'pending',
	"push_consent" varchar(20) DEFAULT 'pending',
	"sms_consent" varchar(20) DEFAULT 'pending',
	"consent_details" jsonb,
	"consent_method" varchar(50),
	"consent_version" varchar(20) NOT NULL,
	"legal_basis" varchar(100),
	"consent_evidence" jsonb,
	"withdrawal_reason" text,
	"consent_granted_at" timestamp,
	"consent_withdrawn_at" timestamp,
	"last_updated_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"is_active" boolean DEFAULT true,
	"requires_reconfirmation" boolean DEFAULT false,
	"is_minor" boolean DEFAULT false,
	"parental_consent_required" boolean DEFAULT false,
	"audit_trail" jsonb,
	"synced_with_external_systems" jsonb,
	"compliance_score" numeric(3, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "moderation_rules" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"type" varchar(100),
	"pattern" text,
	"severity" varchar(50),
	"action" varchar(50),
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "privacy_policy_management" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_type" varchar(100) NOT NULL,
	"vertical" varchar(100),
	"country" varchar(10),
	"language" varchar(10) DEFAULT 'en',
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"html_content" text,
	"summary" text,
	"legal_frameworks" jsonb,
	"required_disclosures" jsonb,
	"affiliate_networks" jsonb,
	"ad_networks" jsonb,
	"version" varchar(50) NOT NULL,
	"previous_version_id" integer,
	"status" varchar(50) DEFAULT 'draft',
	"approved_by" varchar(255),
	"approved_at" timestamp,
	"is_auto_generated" boolean DEFAULT false,
	"generation_prompt" text,
	"ai_model" varchar(100),
	"generation_metadata" jsonb,
	"published_at" timestamp,
	"effective_date" timestamp,
	"expiration_date" timestamp,
	"notification_sent" boolean DEFAULT false,
	"notification_sent_at" timestamp,
	"views" integer DEFAULT 0,
	"acceptances" integer DEFAULT 0,
	"rejections" integer DEFAULT 0,
	"avg_read_time" integer,
	"bounce_rate" numeric(5, 4),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_data_control_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" varchar(100) NOT NULL,
	"user_id" varchar(255),
	"email" varchar(320),
	"request_type" varchar(50) NOT NULL,
	"legal_basis" varchar(100),
	"description" text,
	"data_categories" jsonb,
	"verticals" jsonb,
	"date_range" jsonb,
	"status" varchar(50) DEFAULT 'pending',
	"priority" varchar(20) DEFAULT 'normal',
	"assigned_to" varchar(255),
	"verification_method" varchar(100),
	"verification_status" varchar(50) DEFAULT 'pending',
	"verification_attempts" integer DEFAULT 0,
	"verification_data" jsonb,
	"estimated_completion_date" timestamp,
	"actual_completion_date" timestamp,
	"processing_notes" text,
	"rejection_reason" text,
	"export_format" varchar(50),
	"export_file_size" integer,
	"export_url" text,
	"download_count" integer DEFAULT 0,
	"export_expires_at" timestamp,
	"follow_up_required" boolean DEFAULT false,
	"appealed" boolean DEFAULT false,
	"appeal_reason" text,
	"appeal_status" varchar(50),
	"response_time" integer,
	"sla_compliance" boolean,
	"audit_trail" jsonb,
	"notifications_sent" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_data_control_requests_request_id_unique" UNIQUE("request_id")
);
--> statement-breakpoint
CREATE TABLE "affiliate_partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"company" varchar(255),
	"partner_type" varchar(50) NOT NULL,
	"commission_rate" real DEFAULT 0,
	"custom_commissions" jsonb,
	"payout_method" varchar(50) DEFAULT 'paypal',
	"payout_details" jsonb,
	"total_earnings" numeric(15, 2) DEFAULT '0',
	"pending_earnings" numeric(15, 2) DEFAULT '0',
	"paid_earnings" numeric(15, 2) DEFAULT '0',
	"total_sales" integer DEFAULT 0,
	"total_clicks" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"status" varchar(20) DEFAULT 'pending',
	"tier" varchar(20) DEFAULT 'standard',
	"allowed_products" integer[],
	"cookie_duration" integer DEFAULT 30,
	"phone" varchar(50),
	"website" varchar(255),
	"social_profiles" jsonb,
	"tax_info" jsonb,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"verified_at" timestamp,
	"last_activity_at" timestamp,
	CONSTRAINT "affiliate_partners_partner_id_unique" UNIQUE("partner_id")
);
--> statement-breakpoint
CREATE TABLE "affiliate_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" varchar(100) NOT NULL,
	"order_id" integer,
	"product_id" integer,
	"click_id" varchar(255) NOT NULL,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"campaign" varchar(100),
	"source" varchar(100),
	"medium" varchar(100),
	"content" varchar(255),
	"sale_amount" numeric(10, 2),
	"commission_rate" real,
	"commission_amount" numeric(10, 2),
	"commission_status" varchar(20) DEFAULT 'pending',
	"clicked_at" timestamp,
	"converted_at" timestamp,
	"conversion_type" varchar(50),
	"ip_address" varchar(45),
	"user_agent" text,
	"country_code" varchar(2),
	"device_type" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "affiliate_tracking_click_id_unique" UNIQUE("click_id")
);
--> statement-breakpoint
CREATE TABLE "digital_products" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"long_description" text,
	"product_type" varchar(50) NOT NULL,
	"category" varchar(100),
	"tags" text[],
	"base_price" numeric(10, 2) NOT NULL,
	"sale_price" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"price_by_country" jsonb,
	"featured_image" text,
	"gallery_images" text[],
	"preview_url" text,
	"demo_url" text,
	"video_url" text,
	"download_url" text,
	"access_type" varchar(50) DEFAULT 'immediate',
	"drip_schedule" jsonb,
	"license_type" varchar(50) DEFAULT 'single',
	"max_downloads" integer DEFAULT -1,
	"expiration_days" integer,
	"meta_title" text,
	"meta_description" text,
	"keywords" text[],
	"upsell_products" integer[],
	"cross_sell_products" integer[],
	"bundle_products" integer[],
	"total_sales" integer DEFAULT 0,
	"total_revenue" numeric(15, 2) DEFAULT '0',
	"conversion_rate" real DEFAULT 0,
	"average_rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"personalization_tags" text[],
	"target_archetypes" text[],
	"emotion_triggers" jsonb,
	"ai_optimized_title" text,
	"ai_optimized_description" text,
	"status" varchar(20) DEFAULT 'draft',
	"is_digital" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"auto_optimize" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	CONSTRAINT "digital_products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(100) NOT NULL,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"customer_info" jsonb,
	"billing_address" jsonb,
	"items" jsonb NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"shipping_amount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"payment_method" varchar(50),
	"payment_provider" varchar(50),
	"transaction_id" varchar(255),
	"payment_status" varchar(20) DEFAULT 'pending',
	"fulfillment_status" varchar(20) DEFAULT 'pending',
	"delivery_method" varchar(50) DEFAULT 'digital',
	"download_links" jsonb,
	"access_keys" jsonb,
	"promo_code" varchar(100),
	"affiliate_id" varchar(255),
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"device_info" jsonb,
	"ip_address" varchar(45),
	"country_code" varchar(2),
	"conversion_source" varchar(100),
	"affiliate_commission" numeric(10, 2) DEFAULT '0',
	"partner_revenue" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"paid_at" timestamp,
	"delivered_at" timestamp,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "product_licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" varchar(255),
	"license_key" varchar(255) NOT NULL,
	"license_type" varchar(50) NOT NULL,
	"max_activations" integer DEFAULT 1,
	"current_activations" integer DEFAULT 0,
	"download_count" integer DEFAULT 0,
	"max_downloads" integer DEFAULT -1,
	"status" varchar(20) DEFAULT 'active',
	"expires_at" timestamp,
	"last_accessed_at" timestamp,
	"last_download_at" timestamp,
	"allowed_ips" text[],
	"device_fingerprints" jsonb,
	"suspicious_activity" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"activated_at" timestamp,
	CONSTRAINT "product_licenses_license_key_unique" UNIQUE("license_key")
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"order_id" integer,
	"user_id" varchar(255),
	"email" varchar(255),
	"rating" integer NOT NULL,
	"title" varchar(255),
	"content" text,
	"pros" text[],
	"cons" text[],
	"is_verified_purchase" boolean DEFAULT false,
	"is_recommended" boolean,
	"helpful_votes" integer DEFAULT 0,
	"total_votes" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'pending',
	"moderated_by" varchar(255),
	"moderation_notes" text,
	"sentiment_score" real,
	"key_phrases" text[],
	"ai_summary" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"moderated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"features" jsonb,
	"max_licenses" integer DEFAULT 1,
	"is_default" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"name" varchar(255),
	"description" text,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"min_order_amount" numeric(10, 2),
	"max_discount_amount" numeric(10, 2),
	"max_uses" integer DEFAULT -1,
	"current_uses" integer DEFAULT 0,
	"max_uses_per_user" integer DEFAULT 1,
	"applicable_products" integer[],
	"excluded_products" integer[],
	"applicable_categories" text[],
	"valid_from" timestamp,
	"valid_until" timestamp,
	"target_countries" varchar(2)[],
	"target_user_segments" text[],
	"first_time_customers_only" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT true,
	"auto_apply" boolean DEFAULT false,
	"total_savings" numeric(15, 2) DEFAULT '0',
	"conversion_rate" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "shopping_carts" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"items" jsonb NOT NULL,
	"subtotal" numeric(10, 2) DEFAULT '0',
	"tax_amount" numeric(10, 2) DEFAULT '0',
	"discount_amount" numeric(10, 2) DEFAULT '0',
	"total" numeric(10, 2) DEFAULT '0',
	"currency" varchar(3) DEFAULT 'USD',
	"promo_code" varchar(100),
	"abandoned_at" timestamp,
	"recovery_email_sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "storefront_ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"test_type" varchar(50) NOT NULL,
	"target_element" varchar(100),
	"variants" jsonb NOT NULL,
	"traffic_split" jsonb,
	"success_metric" varchar(50) NOT NULL,
	"minimum_sample_size" integer DEFAULT 100,
	"confidence_level" real DEFAULT 0.95,
	"minimum_detectable_effect" real DEFAULT 0.05,
	"status" varchar(20) DEFAULT 'draft',
	"winning_variant" varchar(50),
	"statistical_significance" real,
	"results" jsonb,
	"target_products" integer[],
	"target_segments" text[],
	"target_countries" varchar(2)[],
	"start_date" timestamp,
	"end_date" timestamp,
	"max_duration" integer,
	"total_participants" integer DEFAULT 0,
	"total_conversions" integer DEFAULT 0,
	"revenue_impact" numeric(15, 2) DEFAULT '0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "storefront_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"session_id" varchar(255),
	"user_id" varchar(255),
	"product_id" integer,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cta_ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"variants" jsonb NOT NULL,
	"traffic_allocation" jsonb,
	"targeting_rules" jsonb,
	"hypothesis" text,
	"primary_metric" varchar(100),
	"secondary_metrics" jsonb,
	"minimum_sample_size" integer DEFAULT 1000,
	"significance_threshold" real DEFAULT 0.05,
	"status" varchar(50) DEFAULT 'draft',
	"start_date" timestamp,
	"end_date" timestamp,
	"planned_duration" integer,
	"results" jsonb,
	"winning_variant" varchar(50),
	"confidence_level" real,
	"created_by" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_ab_tests_test_id_unique" UNIQUE("test_id")
);
--> statement-breakpoint
CREATE TABLE "cta_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar(100) NOT NULL,
	"instance_id" varchar(100) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb,
	"dwell_time" integer DEFAULT 0,
	"interaction_depth" integer DEFAULT 0,
	"completion_rate" real DEFAULT 0,
	"render_time" integer,
	"frame_rate" real,
	"device_performance" jsonb,
	"entry_point" varchar(255),
	"exit_point" varchar(255),
	"conversion_action" varchar(255),
	"page_url" text,
	"referrer" text,
	"device_info" jsonb,
	"browser_info" jsonb,
	"geolocation" jsonb,
	"timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_analytics_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "cta_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"format" varchar(50) NOT NULL,
	"category" varchar(100),
	"file_path" text NOT NULL,
	"file_size" integer,
	"dimensions" jsonb,
	"resolution" jsonb,
	"compression_level" varchar(50),
	"lod_levels" jsonb,
	"optimized_versions" jsonb,
	"tags" jsonb,
	"license" varchar(100),
	"attribution" text,
	"scan_status" varchar(50) DEFAULT 'pending',
	"scan_results" jsonb,
	"compliance_flags" jsonb,
	"usage_count" integer DEFAULT 0,
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"uploaded_by" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_assets_asset_id_unique" UNIQUE("asset_id")
);
--> statement-breakpoint
CREATE TABLE "cta_compliance" (
	"id" serial PRIMARY KEY NOT NULL,
	"compliance_id" varchar(100) NOT NULL,
	"instance_id" varchar(100),
	"template_id" varchar(100),
	"compliance_type" varchar(100) NOT NULL,
	"wcag_level" varchar(10),
	"accessibility_features" jsonb,
	"alternative_formats" jsonb,
	"data_collection" jsonb,
	"consent_required" boolean DEFAULT false,
	"consent_obtained" boolean DEFAULT false,
	"privacy_policy_ref" text,
	"asset_integrity" jsonb,
	"content_security_policy" text,
	"cross_origin_policy" text,
	"content_rating" varchar(50),
	"content_warnings" jsonb,
	"cultural_considerations" jsonb,
	"last_audit_date" timestamp,
	"audit_results" jsonb,
	"remedial_actions" jsonb,
	"compliance_status" varchar(50) DEFAULT 'pending',
	"expiry_date" timestamp,
	"created_by" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_compliance_compliance_id_unique" UNIQUE("compliance_id")
);
--> statement-breakpoint
CREATE TABLE "cta_instances" (
	"id" serial PRIMARY KEY NOT NULL,
	"instance_id" varchar(100) NOT NULL,
	"template_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"custom_config" jsonb,
	"targeting_rules" jsonb,
	"personalization_data" jsonb,
	"context_rules" jsonb,
	"triggers" jsonb,
	"activation_conditions" jsonb,
	"display_rules" jsonb,
	"ab_test_id" varchar(100),
	"variant" varchar(50) DEFAULT 'default',
	"integration_hooks" jsonb,
	"affiliate_data" jsonb,
	"status" varchar(50) DEFAULT 'draft',
	"scheduled_start" timestamp,
	"scheduled_end" timestamp,
	"neuron_id" varchar(100),
	"federation_config" jsonb,
	"created_by" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_instances_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
CREATE TABLE "cta_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"config" jsonb NOT NULL,
	"assets" jsonb,
	"interactions" jsonb,
	"animations" jsonb,
	"physics" jsonb,
	"render_settings" jsonb,
	"device_compatibility" jsonb,
	"fallback_options" jsonb,
	"customizable_elements" jsonb,
	"branding_options" jsonb,
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"created_by" varchar(100),
	"version" varchar(20) DEFAULT '1.0.0',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cta_templates_template_id_unique" UNIQUE("template_id")
);
--> statement-breakpoint
CREATE TABLE "cta_user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"instance_id" varchar(100) NOT NULL,
	"user_id" varchar(255),
	"start_time" timestamp DEFAULT now(),
	"end_time" timestamp,
	"total_duration" integer,
	"device_capabilities" jsonb,
	"performance_metrics" jsonb,
	"browser_support" jsonb,
	"interactions" jsonb,
	"gesture_data" jsonb,
	"gaze_tracking" jsonb,
	"conversion_events" jsonb,
	"exit_reason" varchar(100),
	"user_feedback" jsonb,
	"page_context" jsonb,
	"user_segment" varchar(100),
	"personalization_applied" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backups" (
	"id" serial PRIMARY KEY NOT NULL,
	"backup_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"backup_type" varchar(50) NOT NULL,
	"scope" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"file_size" integer,
	"checksum" varchar(128),
	"file_path" text,
	"storage_location" varchar(100) NOT NULL,
	"retention_days" integer DEFAULT 90 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_encrypted" boolean DEFAULT true NOT NULL,
	"encryption_key" varchar(128),
	"compression_ratio" real,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "backups_backup_id_unique" UNIQUE("backup_id")
);
--> statement-breakpoint
CREATE TABLE "deployment_audit" (
	"id" serial PRIMARY KEY NOT NULL,
	"audit_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"resource_type" varchar(50) NOT NULL,
	"resource_id" varchar(100) NOT NULL,
	"action" varchar(50) NOT NULL,
	"user_id" integer,
	"user_agent" text,
	"ip_address" varchar(45),
	"before" jsonb,
	"after" jsonb,
	"changes" jsonb,
	"reason" text,
	"outcome" varchar(20) NOT NULL,
	"duration" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "deployment_audit_audit_id_unique" UNIQUE("audit_id")
);
--> statement-breakpoint
CREATE TABLE "deployment_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"permissions" jsonb NOT NULL,
	"environments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"resources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"restrictions" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"granted_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deployment_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"deployment_id" uuid NOT NULL,
	"step_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"step_type" varchar(50) NOT NULL,
	"order" integer NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"command" text,
	"output" text,
	"error_output" text,
	"duration" integer,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"dependencies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rollback_command" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" serial PRIMARY KEY NOT NULL,
	"deployment_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"environment" varchar(50) NOT NULL,
	"deployment_type" varchar(50) NOT NULL,
	"version" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"total_steps" integer DEFAULT 0 NOT NULL,
	"completed_steps" integer DEFAULT 0 NOT NULL,
	"failed_steps" integer DEFAULT 0 NOT NULL,
	"config" jsonb NOT NULL,
	"manifest" jsonb NOT NULL,
	"logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"health_checks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"deployed_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"rollback_data" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "deployments_deployment_id_unique" UNIQUE("deployment_id")
);
--> statement-breakpoint
CREATE TABLE "disaster_recovery_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"plan_type" varchar(50) NOT NULL,
	"priority" varchar(20) DEFAULT 'medium' NOT NULL,
	"rto" integer NOT NULL,
	"rpo" integer NOT NULL,
	"steps" jsonb NOT NULL,
	"dependencies" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"test_results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"last_tested" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "disaster_recovery_plans_plan_id_unique" UNIQUE("plan_id")
);
--> statement-breakpoint
CREATE TABLE "export_archives" (
	"id" serial PRIMARY KEY NOT NULL,
	"archive_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"export_type" varchar(50) NOT NULL,
	"version" varchar(50) NOT NULL,
	"file_size" integer NOT NULL,
	"checksum" varchar(128) NOT NULL,
	"file_path" text NOT NULL,
	"manifest" jsonb NOT NULL,
	"exported_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "export_archives_archive_id_unique" UNIQUE("archive_id")
);
--> statement-breakpoint
CREATE TABLE "import_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"operation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"archive_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"import_type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"total_items" integer DEFAULT 0 NOT NULL,
	"processed_items" integer DEFAULT 0 NOT NULL,
	"failed_items" integer DEFAULT 0 NOT NULL,
	"import_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"logs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"imported_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"rollback_data" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "import_operations_operation_id_unique" UNIQUE("operation_id")
);
--> statement-breakpoint
CREATE TABLE "multi_region_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"config_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"primary_region" varchar(50) NOT NULL,
	"regions" jsonb NOT NULL,
	"load_balancing" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"failover_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"data_replication" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"health_check_url" text,
	"last_health_check" timestamp,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "multi_region_config_config_id_unique" UNIQUE("config_id")
);
--> statement-breakpoint
CREATE TABLE "agent_memories" (
	"id" serial PRIMARY KEY NOT NULL,
	"memory_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"embedding" jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quality_score" real,
	"usage_count" integer DEFAULT 1 NOT NULL,
	"last_used" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "agent_memories_memory_id_unique" UNIQUE("memory_id")
);
--> statement-breakpoint
CREATE TABLE "agent_usage_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"tracking_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"user_id" integer,
	"project_id" varchar(100),
	"task_type" varchar(100) NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_cost" real DEFAULT 0 NOT NULL,
	"latency_ms" integer NOT NULL,
	"success" boolean NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "agent_usage_tracking_tracking_id_unique" UNIQUE("tracking_id")
);
--> statement-breakpoint
CREATE TABLE "agentic_workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"definition" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"trigger" jsonb NOT NULL,
	"input_schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output_schema" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"max_execution_time" integer DEFAULT 300 NOT NULL,
	"retry_policy" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cost_budget" real DEFAULT 0 NOT NULL,
	"execution_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"average_duration" integer DEFAULT 0 NOT NULL,
	"average_cost" real DEFAULT 0 NOT NULL,
	"last_executed" timestamp,
	"created_by" integer NOT NULL,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "agentic_workflows_workflow_id_unique" UNIQUE("workflow_id")
);
--> statement-breakpoint
CREATE TABLE "federation_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"source_neuron" varchar(100) NOT NULL,
	"target_neuron" varchar(100),
	"task_type" varchar(100) NOT NULL,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"payload" jsonb NOT NULL,
	"result" jsonb,
	"assigned_agent" uuid,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"cost_budget" real DEFAULT 0 NOT NULL,
	"cost_used" real DEFAULT 0 NOT NULL,
	"scheduled_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "federation_tasks_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
CREATE TABLE "llm_agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"agent_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"model" varchar(255) NOT NULL,
	"api_endpoint" text NOT NULL,
	"api_key" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"capabilities" jsonb NOT NULL,
	"cost_per_token" real DEFAULT 0 NOT NULL,
	"rate_limit" integer DEFAULT 0 NOT NULL,
	"max_tokens" integer DEFAULT 4096 NOT NULL,
	"latency_ms" integer DEFAULT 0 NOT NULL,
	"success_rate" real DEFAULT 1 NOT NULL,
	"quota_daily" integer DEFAULT 0 NOT NULL,
	"quota_used" integer DEFAULT 0 NOT NULL,
	"last_used" timestamp,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "llm_agents_agent_id_unique" UNIQUE("agent_id")
);
--> statement-breakpoint
CREATE TABLE "prompt_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"template" text NOT NULL,
	"variables" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"supported_agents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"average_tokens" integer DEFAULT 0 NOT NULL,
	"success_rate" real DEFAULT 1 NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"last_used" timestamp,
	"created_by" integer NOT NULL,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "prompt_templates_template_id_unique" UNIQUE("template_id")
);
--> statement-breakpoint
CREATE TABLE "router_learning" (
	"id" serial PRIMARY KEY NOT NULL,
	"learning_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"complexity" varchar(20) NOT NULL,
	"context_patterns" jsonb NOT NULL,
	"best_agent_id" uuid NOT NULL,
	"alternative_agents" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"success_rate" real NOT NULL,
	"average_cost" real NOT NULL,
	"average_latency" integer NOT NULL,
	"confidence" real DEFAULT 0 NOT NULL,
	"sample_size" integer DEFAULT 1 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"model_version" varchar(50) DEFAULT '1.0' NOT NULL,
	"training_data" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "router_learning_learning_id_unique" UNIQUE("learning_id")
);
--> statement-breakpoint
CREATE TABLE "task_routing_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"task_complexity" varchar(20) NOT NULL,
	"original_agent_id" uuid NOT NULL,
	"final_agent_id" uuid NOT NULL,
	"fallback_count" integer DEFAULT 0 NOT NULL,
	"routing_reason" text NOT NULL,
	"input_tokens" integer DEFAULT 0 NOT NULL,
	"output_tokens" integer DEFAULT 0 NOT NULL,
	"total_cost" real DEFAULT 0 NOT NULL,
	"latency_ms" integer NOT NULL,
	"success" boolean NOT NULL,
	"error_message" text,
	"quality_score" real,
	"conversion_impact" real,
	"context_size" integer DEFAULT 0 NOT NULL,
	"parallel_routes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"executed_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "task_routing_history_task_id_unique" UNIQUE("task_id")
);
--> statement-breakpoint
CREATE TABLE "workflow_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"current_step" varchar(255),
	"input" jsonb NOT NULL,
	"output" jsonb,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"total_cost" real DEFAULT 0 NOT NULL,
	"total_tokens" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"triggered_by" varchar(100) NOT NULL,
	"user_id" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "workflow_executions_execution_id_unique" UNIQUE("execution_id")
);
--> statement-breakpoint
CREATE TABLE "federation_memory_sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"sync_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"source_neuron" varchar(100) NOT NULL,
	"target_neuron" varchar(100) NOT NULL,
	"sync_type" varchar(50) NOT NULL,
	"nodes_synced" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"edges_synced" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sync_status" varchar(20) DEFAULT 'pending' NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"errors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"total_time" integer,
	"triggered_by" varchar(100) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "federation_memory_sync_sync_id_unique" UNIQUE("sync_id")
);
--> statement-breakpoint
CREATE TABLE "knowledge_graph_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"node_id" uuid NOT NULL,
	"change_type" varchar(50) NOT NULL,
	"previous_data" jsonb,
	"new_data" jsonb NOT NULL,
	"diff" jsonb NOT NULL,
	"change_reason" text,
	"change_source" varchar(100) NOT NULL,
	"approval_status" varchar(20) DEFAULT 'pending',
	"changed_by" integer NOT NULL,
	"approved_by" integer,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"effective_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "knowledge_graph_versions_version_id_unique" UNIQUE("version_id")
);
--> statement-breakpoint
CREATE TABLE "memory_edges" (
	"id" serial PRIMARY KEY NOT NULL,
	"edge_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"source_node_id" uuid NOT NULL,
	"target_node_id" uuid NOT NULL,
	"relationship_type" varchar(100) NOT NULL,
	"strength" real DEFAULT 0.5 NOT NULL,
	"direction" varchar(20) DEFAULT 'bidirectional' NOT NULL,
	"context" text,
	"evidence" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"confidence" real DEFAULT 0.5 NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_verified" timestamp,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "memory_edges_edge_id_unique" UNIQUE("edge_id")
);
--> statement-breakpoint
CREATE TABLE "memory_nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"node_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"node_type" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"embedding" jsonb,
	"embedding_model" varchar(100) DEFAULT 'text-embedding-ada-002',
	"keywords" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"entities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"user_archetype" varchar(100),
	"conversion_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"last_used" timestamp,
	"quality_score" real DEFAULT 0.5 NOT NULL,
	"confidence_score" real DEFAULT 0.5 NOT NULL,
	"verification_status" varchar(20) DEFAULT 'unverified',
	"source_type" varchar(100) NOT NULL,
	"source_id" varchar(255),
	"parent_node_id" uuid,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"content_timestamp" timestamp,
	"expires_at" timestamp,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "memory_nodes_node_id_unique" UNIQUE("node_id"),
	CONSTRAINT "memory_nodes_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "memory_search_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"query" text NOT NULL,
	"search_type" varchar(50) NOT NULL,
	"filters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"results_returned" integer NOT NULL,
	"top_result_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"search_time" integer NOT NULL,
	"user_id" integer,
	"user_archetype" varchar(100),
	"clicked_results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"satisfaction_score" real,
	"context_type" varchar(100),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "memory_search_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "memory_usage_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"analytics_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"node_id" uuid NOT NULL,
	"usage_type" varchar(100) NOT NULL,
	"context_id" varchar(255),
	"retrieval_time" integer,
	"relevance_score" real,
	"user_engagement" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"conversion_impact" real,
	"quality_feedback" real,
	"user_id" integer,
	"session_id" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "memory_usage_analytics_analytics_id_unique" UNIQUE("analytics_id")
);
--> statement-breakpoint
CREATE TABLE "prompt_optimizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"optimization_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"original_prompt" text NOT NULL,
	"optimized_prompt" text NOT NULL,
	"injected_nodes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"injection_strategy" varchar(100) NOT NULL,
	"task_type" varchar(100) NOT NULL,
	"user_context" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"session_id" varchar(255),
	"retrieval_score" real,
	"prompt_quality" real,
	"execution_time" integer NOT NULL,
	"tokens_added" integer DEFAULT 0 NOT NULL,
	"output_generated" text,
	"user_satisfaction" real,
	"conversion_result" boolean,
	"agent_id" uuid,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "prompt_optimizations_optimization_id_unique" UNIQUE("optimization_id")
);
--> statement-breakpoint
CREATE TABLE "api_alert_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"alert_id" varchar(64) NOT NULL,
	"rule_id" integer NOT NULL,
	"diff_id" integer,
	"event_id" text,
	"alert_type" varchar(50) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"details" jsonb,
	"channels_sent" jsonb,
	"delivery_status" jsonb,
	"delivery_attempts" integer DEFAULT 0 NOT NULL,
	"acknowledged" boolean DEFAULT false NOT NULL,
	"acknowledged_by" varchar(100),
	"acknowledged_at" timestamp,
	"response_time_seconds" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_alert_history_alert_id_unique" UNIQUE("alert_id")
);
--> statement-breakpoint
CREATE TABLE "api_analytics_summary" (
	"id" serial PRIMARY KEY NOT NULL,
	"summary_id" varchar(64) NOT NULL,
	"period_type" varchar(20) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"module_name" varchar(100),
	"total_diffs" integer DEFAULT 0 NOT NULL,
	"total_changes" integer DEFAULT 0 NOT NULL,
	"breaking_changes" integer DEFAULT 0 NOT NULL,
	"endpoints_added" integer DEFAULT 0 NOT NULL,
	"endpoints_removed" integer DEFAULT 0 NOT NULL,
	"endpoints_modified" integer DEFAULT 0 NOT NULL,
	"alerts_triggered" integer DEFAULT 0 NOT NULL,
	"critical_alerts" integer DEFAULT 0 NOT NULL,
	"alerts_acknowledged" integer DEFAULT 0 NOT NULL,
	"avg_response_time_seconds" real,
	"api_stability_score" real DEFAULT 100 NOT NULL,
	"documentation_coverage" real DEFAULT 0 NOT NULL,
	"compatibility_score" real DEFAULT 100 NOT NULL,
	"schema_validation_time_ms" real,
	"diff_processing_time_ms" real,
	"alert_delivery_time_ms" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_analytics_summary_summary_id_unique" UNIQUE("summary_id")
);
--> statement-breakpoint
CREATE TABLE "api_change_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" varchar(64) NOT NULL,
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_change_events_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "api_diffs" (
	"id" serial PRIMARY KEY NOT NULL,
	"diff_hash" varchar(64) NOT NULL,
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
	"reviewed_at" timestamp,
	CONSTRAINT "api_diffs_diff_hash_unique" UNIQUE("diff_hash")
);
--> statement-breakpoint
CREATE TABLE "api_endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"endpoint_hash" varchar(64),
	"snapshot_id" integer,
	"path" varchar(500) NOT NULL,
	"method" varchar(10) NOT NULL,
	"description" text,
	"parameters" jsonb,
	"request_body" jsonb,
	"responses" jsonb,
	"authentication" jsonb,
	"middleware" jsonb,
	"rate_limits" jsonb,
	"permissions" jsonb,
	"tags" jsonb,
	"is_deprecated" boolean DEFAULT false NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"last_modified" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_export_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"export_id" varchar(64) NOT NULL,
	"export_type" varchar(50) NOT NULL,
	"format" varchar(20) NOT NULL,
	"filters" jsonb,
	"modules" jsonb,
	"date_range" jsonb,
	"include_sensitive" boolean DEFAULT false NOT NULL,
	"file_path" varchar(500),
	"file_size" integer,
	"checksum" varchar(64),
	"encryption_used" boolean DEFAULT false NOT NULL,
	"compression_used" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"records_exported" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"access_level" varchar(20) DEFAULT 'private' NOT NULL,
	"expires_at" timestamp,
	"download_count" integer DEFAULT 0 NOT NULL,
	"last_downloaded" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	CONSTRAINT "api_export_operations_export_id_unique" UNIQUE("export_id")
);
--> statement-breakpoint
CREATE TABLE "api_monitoring_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_name" varchar(100) NOT NULL,
	"module_filter" varchar(100),
	"endpoint_filter" varchar(500),
	"change_types" jsonb NOT NULL,
	"severity_threshold" varchar(20) DEFAULT 'warning' NOT NULL,
	"alert_channels" jsonb NOT NULL,
	"alert_template" text,
	"cooldown_minutes" integer DEFAULT 60 NOT NULL,
	"conditions" jsonb,
	"aggregation_window" integer DEFAULT 5 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"last_triggered" timestamp,
	"trigger_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "api_monitoring_rules_rule_name_unique" UNIQUE("rule_name")
);
--> statement-breakpoint
CREATE TABLE "api_rollback_operations" (
	"id" serial PRIMARY KEY NOT NULL,
	"operation_id" varchar(64) NOT NULL,
	"version_history_id" integer NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"from_version" varchar(50) NOT NULL,
	"to_version" varchar(50) NOT NULL,
	"operation_type" varchar(20) NOT NULL,
	"reason" text,
	"approval_required" boolean DEFAULT true NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"approved_by" varchar(100),
	"approved_at" timestamp,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"execution_log" text,
	"error_details" text,
	"affected_endpoints" jsonb,
	"impact_assessment" text,
	"downtime_estimate" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	CONSTRAINT "api_rollback_operations_operation_id_unique" UNIQUE("operation_id")
);
--> statement-breakpoint
CREATE TABLE "api_schema_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"schema_hash" varchar(64) NOT NULL,
	"version" varchar(50) NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"neuron_id" varchar(100),
	"schema_type" varchar(20) NOT NULL,
	"schema_content" jsonb NOT NULL,
	"endpoints_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"deploy_hash" varchar(64),
	"environment" varchar(20) DEFAULT 'production',
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "api_schema_snapshots_schema_hash_unique" UNIQUE("schema_hash")
);
--> statement-breakpoint
CREATE TABLE "api_version_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" varchar(64) NOT NULL,
	"module_name" varchar(100) NOT NULL,
	"version" varchar(50) NOT NULL,
	"previous_version" varchar(50),
	"release_type" varchar(20) NOT NULL,
	"release_notes" text,
	"changelog" jsonb,
	"migration_notes" text,
	"breaking_changes" jsonb,
	"schema_archive" jsonb,
	"configuration_archive" jsonb,
	"dependencies_archive" jsonb,
	"rollback_available" boolean DEFAULT true NOT NULL,
	"rollback_script" text,
	"rollback_notes" text,
	"deployed" boolean DEFAULT false NOT NULL,
	"deployed_at" timestamp,
	"deployed_by" varchar(100),
	"deployment_environment" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar(100) NOT NULL,
	CONSTRAINT "api_version_history_version_id_unique" UNIQUE("version_id")
);
--> statement-breakpoint
CREATE TABLE "conflict_resolution_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"conflict_type" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"local_data" jsonb NOT NULL,
	"server_data" jsonb NOT NULL,
	"merged_data" jsonb,
	"resolution_strategy" varchar(50) NOT NULL,
	"resolution_reason" text,
	"is_auto_resolved" boolean DEFAULT true,
	"resolved_by" varchar(255),
	"conflict_severity" varchar(50),
	"data_loss_risk" boolean DEFAULT false,
	"user_notified" boolean DEFAULT false,
	"conflict_detected_at" timestamp NOT NULL,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conflict_resolution_log_conflict_id_unique" UNIQUE("conflict_id")
);
--> statement-breakpoint
CREATE TABLE "device_sync_state" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"device_type" varchar(50),
	"platform" varchar(50),
	"user_agent" text,
	"capabilities" jsonb NOT NULL,
	"storage_quota" integer,
	"storage_used" integer,
	"connection_type" varchar(50),
	"is_online" boolean DEFAULT true,
	"last_online_at" timestamp DEFAULT now(),
	"network_quality" varchar(50),
	"last_sync_at" timestamp,
	"sync_version" integer DEFAULT 1,
	"pending_events" integer DEFAULT 0,
	"sync_errors" integer DEFAULT 0,
	"avg_sync_time" integer,
	"battery_level" real,
	"is_low_power_mode" boolean DEFAULT false,
	"device_fingerprint" varchar(255),
	"encryption_supported" boolean DEFAULT false,
	"is_compromised" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "device_sync_state_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "edge_ai_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" varchar(100) NOT NULL,
	"model_name" varchar(255) NOT NULL,
	"model_type" varchar(100) NOT NULL,
	"model_version" varchar(50) NOT NULL,
	"runtime" varchar(50) NOT NULL,
	"device_capability" varchar(50),
	"model_data" jsonb NOT NULL,
	"model_size" integer,
	"load_time" integer,
	"inference_time" integer,
	"accuracy" real,
	"deployment_strategy" varchar(50) DEFAULT 'lazy',
	"cache_strategy" varchar(50) DEFAULT 'memory',
	"max_cache_size" integer DEFAULT 50,
	"is_active" boolean DEFAULT true,
	"is_deprecated" boolean DEFAULT false,
	"deprecation_date" timestamp,
	"model_hash" varchar(64),
	"signature" text,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "edge_ai_models_model_id_unique" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE "offline_analytics_buffer" (
	"id" serial PRIMARY KEY NOT NULL,
	"buffer_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"event_category" varchar(100),
	"event_action" varchar(100),
	"event_label" varchar(255),
	"event_value" real,
	"page_url" text,
	"referrer" text,
	"screen_resolution" varchar(50),
	"user_agent" text,
	"custom_dimensions" jsonb,
	"custom_metrics" jsonb,
	"client_timestamp" timestamp NOT NULL,
	"server_timestamp" timestamp DEFAULT now(),
	"page_load_time" integer,
	"batch_id" varchar(255),
	"is_batched" boolean DEFAULT false,
	"batched_at" timestamp,
	"sync_status" varchar(50) DEFAULT 'pending',
	"sync_attempts" integer DEFAULT 0,
	"synced_at" timestamp,
	"event_hash" varchar(64),
	"is_duplicate" boolean DEFAULT false,
	"quality_score" real DEFAULT 100,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "offline_analytics_buffer_buffer_id_unique" UNIQUE("buffer_id")
);
--> statement-breakpoint
CREATE TABLE "offline_content_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_id" varchar(255) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"content_id" varchar(255) NOT NULL,
	"content_url" text,
	"content_data" jsonb,
	"content_size" integer,
	"mime_type" varchar(100),
	"encoding" varchar(50),
	"priority" integer DEFAULT 5,
	"access_frequency" integer DEFAULT 0,
	"last_accessed_at" timestamp,
	"expires_at" timestamp,
	"is_compressed" boolean DEFAULT false,
	"compression_ratio" real,
	"source_version" varchar(50),
	"local_version" varchar(50),
	"is_stale" boolean DEFAULT false,
	"last_updated_at" timestamp,
	"content_hash" varchar(64),
	"is_encrypted" boolean DEFAULT false,
	"encryption_key" varchar(255),
	"storage_type" varchar(50) DEFAULT 'indexeddb',
	"is_preloaded" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "offline_content_cache_cache_id_unique" UNIQUE("cache_id")
);
--> statement-breakpoint
CREATE TABLE "offline_sync_queue" (
	"id" serial PRIMARY KEY NOT NULL,
	"queue_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"module_id" varchar(100) NOT NULL,
	"entity_type" varchar(100),
	"entity_id" varchar(255),
	"event_data" jsonb NOT NULL,
	"context_data" jsonb,
	"priority" integer DEFAULT 5,
	"sync_status" varchar(50) DEFAULT 'pending',
	"sync_attempts" integer DEFAULT 0,
	"last_sync_attempt" timestamp,
	"synced_at" timestamp,
	"conflict_data" jsonb,
	"conflict_resolution" varchar(50),
	"is_resolved" boolean DEFAULT false,
	"event_hash" varchar(64),
	"encryption_key" varchar(255),
	"is_encrypted" boolean DEFAULT false,
	"client_timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "offline_sync_queue_queue_id_unique" UNIQUE("queue_id")
);
--> statement-breakpoint
CREATE TABLE "cultural_ab_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"test_id" varchar(100) NOT NULL,
	"test_name" text NOT NULL,
	"target_countries" jsonb NOT NULL,
	"emotion_targets" jsonb NOT NULL,
	"variants" jsonb NOT NULL,
	"traffic_allocation" jsonb DEFAULT '{"control": 50, "variant": 50}',
	"status" varchar(20) DEFAULT 'draft',
	"cultural_hypothesis" text,
	"expected_outcome" text,
	"metrics" jsonb NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"min_sample_size" integer DEFAULT 1000,
	"confidence_level" real DEFAULT 0.95,
	"results" jsonb,
	"cultural_insights" jsonb,
	"winning_variant" varchar(100),
	"statistical_significance" real,
	"cultural_significance" real,
	"recommended_actions" jsonb,
	"created_by" varchar(255),
	"approved_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cultural_ab_tests_test_id_unique" UNIQUE("test_id")
);
--> statement-breakpoint
CREATE TABLE "cultural_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"date" varchar(10) NOT NULL,
	"unique_visitors" integer DEFAULT 0,
	"total_sessions" integer DEFAULT 0,
	"average_session_duration" integer DEFAULT 0,
	"emotion_distribution" jsonb NOT NULL,
	"dominant_emotions" jsonb NOT NULL,
	"cultural_personalizations_applied" integer DEFAULT 0,
	"personalization_success_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"cultural_conversion_lift" real DEFAULT 0,
	"revenue_per_visitor" real DEFAULT 0,
	"cultural_revenue_impact" real DEFAULT 0,
	"top_performing_rules" jsonb,
	"cultural_insights" jsonb,
	"quality_score" real DEFAULT 0.8,
	"data_points" integer DEFAULT 0,
	"cultural_trends" jsonb,
	"seasonal_factors" jsonb,
	"local_events" jsonb,
	"competitor_analysis" jsonb,
	"recommended_actions" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cultural_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"feedback_id" varchar(100) NOT NULL,
	"feedback_type" varchar(50) NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"cultural_element_id" varchar(100),
	"element_type" varchar(50),
	"rating" integer,
	"feedback" text NOT NULL,
	"cultural_accuracy" real,
	"offensive_risk" real DEFAULT 0,
	"improvement_suggestions" jsonb,
	"cultural_context" text,
	"validation_status" varchar(20) DEFAULT 'pending',
	"expert_validation" jsonb,
	"user_impact" real,
	"business_impact" real,
	"implementation_status" varchar(20) DEFAULT 'pending',
	"submitted_by" varchar(255),
	"expert_reviewer" varchar(255),
	"review_notes" text,
	"priority" integer DEFAULT 3,
	"resolved" boolean DEFAULT false,
	"resolution" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cultural_feedback_feedback_id_unique" UNIQUE("feedback_id")
);
--> statement-breakpoint
CREATE TABLE "cultural_mappings" (
	"id" serial PRIMARY KEY NOT NULL,
	"country_code" varchar(3) NOT NULL,
	"country_name" text NOT NULL,
	"region" varchar(100) NOT NULL,
	"communication_style" varchar(50) NOT NULL,
	"color_psychology" jsonb NOT NULL,
	"trust_indicators" jsonb NOT NULL,
	"conversion_triggers" jsonb NOT NULL,
	"emotion_patterns" jsonb NOT NULL,
	"cultural_context" jsonb,
	"marketing_preferences" jsonb,
	"decision_making_style" varchar(50),
	"collectivism_score" real DEFAULT 0.5,
	"uncertainty_avoidance" real DEFAULT 0.5,
	"power_distance" real DEFAULT 0.5,
	"masculinity_index" real DEFAULT 0.5,
	"long_term_orientation" real DEFAULT 0.5,
	"indulgence_level" real DEFAULT 0.5,
	"is_active" boolean DEFAULT true,
	"data_quality" integer DEFAULT 85,
	"last_validated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cultural_mappings_country_code_unique" UNIQUE("country_code")
);
--> statement-breakpoint
CREATE TABLE "cultural_personalization_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(100) NOT NULL,
	"rule_name" text NOT NULL,
	"target_countries" jsonb NOT NULL,
	"emotion_triggers" jsonb NOT NULL,
	"conditions" jsonb NOT NULL,
	"personalizations" jsonb NOT NULL,
	"priority" integer DEFAULT 5,
	"rule_type" varchar(50) NOT NULL,
	"cultural_reasoning" text,
	"expected_impact" real DEFAULT 0.1,
	"actual_impact" real,
	"confidence" real DEFAULT 0.8,
	"testing_phase" varchar(50) DEFAULT 'production',
	"application_count" integer DEFAULT 0,
	"success_rate" real,
	"cultural_feedback" jsonb,
	"user_feedback" jsonb,
	"business_impact" jsonb,
	"is_active" boolean DEFAULT true,
	"last_applied" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cultural_personalization_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "emotion_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"emotion_id" varchar(100) NOT NULL,
	"emotion_name" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"intensity" real DEFAULT 0.5,
	"cultural_variance" real DEFAULT 0.3,
	"universality" real DEFAULT 0.7,
	"behavioral_triggers" jsonb NOT NULL,
	"response_patterns" jsonb NOT NULL,
	"neural_signals" jsonb,
	"color_associations" jsonb,
	"contextual_modifiers" jsonb,
	"opposite_emotions" jsonb,
	"complementary_emotions" jsonb,
	"psychological_basis" text,
	"marketing_application" jsonb,
	"conversion_impact" real DEFAULT 0.5,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "emotion_profiles_emotion_id_unique" UNIQUE("emotion_id")
);
--> statement-breakpoint
CREATE TABLE "user_emotion_tracking" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"country_code" varchar(3) NOT NULL,
	"detected_emotions" jsonb NOT NULL,
	"dominant_emotion" varchar(100),
	"emotion_intensity" real DEFAULT 0.5,
	"cultural_alignment" real DEFAULT 0.5,
	"behavior_context" jsonb,
	"device_type" varchar(50),
	"interaction_type" varchar(100),
	"time_on_page" integer DEFAULT 0,
	"emotion_confidence" real DEFAULT 0.7,
	"biometric_data" jsonb,
	"previous_emotions" jsonb,
	"cultural_modifiers" jsonb,
	"personalization_applied" jsonb,
	"conversion_probability" real,
	"optimization_suggestions" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "layout_ab_tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"template_id" uuid NOT NULL,
	"variations" json NOT NULL,
	"traffic_split" json NOT NULL,
	"target_metric" varchar(100) NOT NULL,
	"hypothesis" text,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"status" varchar(50) DEFAULT 'draft',
	"participants" integer DEFAULT 0,
	"results" json,
	"winner_variation" varchar(100),
	"confidence_level" numeric(3, 2),
	"significance_threshold" numeric(3, 2) DEFAULT '0.95',
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "layout_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"page_views" integer DEFAULT 0,
	"time_on_page" integer DEFAULT 0,
	"interactions" json,
	"conversions" json,
	"elements_engagement" json,
	"load_time" numeric(5, 2),
	"error_count" integer DEFAULT 0,
	"bounce_rate" numeric(3, 2),
	"conversion_rate" numeric(5, 4),
	"satisfaction_score" numeric(3, 2),
	"timestamp" timestamp DEFAULT now(),
	"device_type" varchar(50),
	"browser_info" json,
	"location_data" json
);
--> statement-breakpoint
CREATE TABLE "layout_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255) NOT NULL,
	"device_type" varchar(50) NOT NULL,
	"screen_size" json,
	"elements" json NOT NULL,
	"personalizations" json,
	"applied_rules" json,
	"ab_test_segment" varchar(50),
	"generated_at" timestamp DEFAULT now(),
	"last_mutated" timestamp,
	"is_active" boolean DEFAULT true,
	"confidence_score" numeric(3, 2) DEFAULT '0.50',
	"conversion_goal" varchar(255),
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE "layout_mutations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"instance_id" uuid NOT NULL,
	"element_id" varchar(255) NOT NULL,
	"mutation_type" varchar(50) NOT NULL,
	"mutation_data" json NOT NULL,
	"trigger_type" varchar(50),
	"trigger_data" json,
	"applied_at" timestamp DEFAULT now(),
	"success" boolean DEFAULT true,
	"error_message" text,
	"performance_impact" numeric(5, 2),
	"reverted" boolean DEFAULT false,
	"reverted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "layout_personalization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"rule_type" varchar(50) NOT NULL,
	"conditions" json NOT NULL,
	"mutations" json NOT NULL,
	"priority" integer DEFAULT 100,
	"is_active" boolean DEFAULT true,
	"effectiveness_score" numeric(3, 2),
	"application_count" integer DEFAULT 0,
	"conversion_lift" numeric(5, 4),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_applied" timestamp,
	"created_by" varchar(255),
	"tags" json
);
--> statement-breakpoint
CREATE TABLE "layout_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"elements" json NOT NULL,
	"default_rules" json,
	"metadata" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255),
	"version" varchar(50) DEFAULT '1.0.0'
);
--> statement-breakpoint
CREATE TABLE "user_layout_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"layout_id" uuid NOT NULL,
	"element_id" varchar(255) NOT NULL,
	"preferences" json NOT NULL,
	"preference_type" varchar(50) NOT NULL,
	"strength" numeric(3, 2) DEFAULT '1.00',
	"source" varchar(100) DEFAULT 'user_action',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_used" timestamp DEFAULT now(),
	"usage_count" integer DEFAULT 1,
	"effectiveness" numeric(3, 2)
);
--> statement-breakpoint
CREATE TABLE "auto_scaling_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_id" text NOT NULL,
	"scaling_action" text NOT NULL,
	"trigger_metric" text NOT NULL,
	"trigger_value" real NOT NULL,
	"threshold_value" real NOT NULL,
	"instances_before" integer NOT NULL,
	"instances_after" integer NOT NULL,
	"scaling_duration_seconds" integer DEFAULT 0 NOT NULL,
	"cost_impact" real DEFAULT 0 NOT NULL,
	"performance_impact" jsonb,
	"prediction_accuracy" real,
	"rollback_triggered" boolean DEFAULT false NOT NULL,
	"automation_confidence" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disaster_recovery_scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_name" text NOT NULL,
	"scenario_type" text NOT NULL,
	"affected_regions" jsonb NOT NULL,
	"backup_regions" jsonb NOT NULL,
	"recovery_strategy" jsonb NOT NULL,
	"estimated_recovery_time" integer DEFAULT 0 NOT NULL,
	"data_recovery_method" text NOT NULL,
	"business_continuity_plan" jsonb,
	"last_tested" timestamp,
	"test_success_rate" real DEFAULT 0 NOT NULL,
	"identified_gaps" jsonb,
	"times_executed" integer DEFAULT 0 NOT NULL,
	"average_execution_time" real DEFAULT 0 NOT NULL,
	"success_rate" real DEFAULT 0 NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "failover_events" (
	"id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"trigger_reason" text NOT NULL,
	"from_region" text NOT NULL,
	"to_region" text NOT NULL,
	"affected_users" integer DEFAULT 0 NOT NULL,
	"affected_requests" integer DEFAULT 0 NOT NULL,
	"recovery_time_seconds" integer DEFAULT 0 NOT NULL,
	"downtime_seconds" integer DEFAULT 0 NOT NULL,
	"data_consistency_check" boolean DEFAULT false NOT NULL,
	"rollback_available" boolean DEFAULT false NOT NULL,
	"impact_assessment" jsonb NOT NULL,
	"automated_actions" jsonb NOT NULL,
	"manual_interventions" jsonb,
	"lessons_learned" text,
	"resolution_status" text DEFAULT 'resolved' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "global_performance_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"metric_type" text NOT NULL,
	"global_uptime_percentage" real DEFAULT 100 NOT NULL,
	"average_response_time" real DEFAULT 0 NOT NULL,
	"p95_response_time" real DEFAULT 0 NOT NULL,
	"p99_response_time" real DEFAULT 0 NOT NULL,
	"total_requests" integer DEFAULT 0 NOT NULL,
	"successful_requests" integer DEFAULT 0 NOT NULL,
	"failed_requests" integer DEFAULT 0 NOT NULL,
	"peak_concurrent_users" integer DEFAULT 0 NOT NULL,
	"regions_active" integer DEFAULT 0 NOT NULL,
	"cross_region_requests" integer DEFAULT 0 NOT NULL,
	"geographic_efficiency" real DEFAULT 0 NOT NULL,
	"revenue_impact" real DEFAULT 0 NOT NULL,
	"conversion_rate" real DEFAULT 0 NOT NULL,
	"user_satisfaction_avg" real DEFAULT 0 NOT NULL,
	"sla_compliance_percentage" real DEFAULT 100 NOT NULL,
	"predicted_growth_rate" real DEFAULT 0 NOT NULL,
	"capacity_utilization" real DEFAULT 0 NOT NULL,
	"optimization_opportunities" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "load_balancing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"conditions" jsonb NOT NULL,
	"actions" jsonb NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"effectiveness_score" real DEFAULT 0 NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region_health" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"region_id" text NOT NULL,
	"status" text NOT NULL,
	"response_time_ms" integer DEFAULT 0 NOT NULL,
	"cpu_usage" real DEFAULT 0 NOT NULL,
	"memory_usage" real DEFAULT 0 NOT NULL,
	"disk_usage" real DEFAULT 0 NOT NULL,
	"network_throughput" real DEFAULT 0 NOT NULL,
	"error_rate" real DEFAULT 0 NOT NULL,
	"active_connections" integer DEFAULT 0 NOT NULL,
	"queue_length" integer DEFAULT 0 NOT NULL,
	"availability_percentage" real DEFAULT 100 NOT NULL,
	"health_score" real DEFAULT 100 NOT NULL,
	"check_timestamp" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" jsonb NOT NULL,
	"endpoints" jsonb NOT NULL,
	"capacity" jsonb NOT NULL,
	"load_balancing" jsonb NOT NULL,
	"auto_scaling" jsonb NOT NULL,
	"status" text DEFAULT 'healthy' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "routing_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"session_id" text,
	"request_id" text,
	"user_location" jsonb,
	"user_agent" text,
	"selected_region" text NOT NULL,
	"routing_algorithm" text NOT NULL,
	"applied_rules" jsonb,
	"decision_factors" jsonb,
	"routing_latency_ms" integer DEFAULT 0 NOT NULL,
	"prediction_confidence" real DEFAULT 0 NOT NULL,
	"actual_performance" jsonb,
	"user_satisfaction_score" real,
	"business_impact" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "traffic_distribution" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"total_requests" integer DEFAULT 0 NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"average_response_time" real DEFAULT 0 NOT NULL,
	"global_error_rate" real DEFAULT 0 NOT NULL,
	"peak_concurrent_users" integer DEFAULT 0 NOT NULL,
	"bandwidth_utilization" real DEFAULT 0 NOT NULL,
	"distribution_efficiency" real DEFAULT 0 NOT NULL,
	"regions_data" jsonb NOT NULL,
	"geographic_spread" jsonb NOT NULL,
	"user_experience_score" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plugin_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"instance_id" varchar(255),
	"neuron_id" varchar(255),
	"event_type" varchar(100) NOT NULL,
	"event_data" jsonb NOT NULL,
	"metrics" jsonb NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45),
	"country" varchar(2),
	"region" varchar(100),
	"city" varchar(100),
	"timezone" varchar(50),
	"device_type" varchar(50),
	"operating_system" varchar(50),
	"browser_name" varchar(50),
	"browser_version" varchar(50),
	"screen_resolution" varchar(20),
	"session_id" varchar(255),
	"user_id" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plugin_dependencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"dependency_type" varchar(50) NOT NULL,
	"dependency_name" varchar(255) NOT NULL,
	"dependency_version" varchar(50),
	"version_constraint" varchar(100),
	"is_optional" boolean DEFAULT false,
	"is_dev_dependency" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'unknown',
	"installed_version" varchar(50),
	"last_checked" timestamp,
	"installation_path" text,
	"download_url" text,
	"license_type" varchar(100),
	"security_issues" jsonb,
	"alternative_packages" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plugin_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"execution_id" varchar(255) NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"instance_id" varchar(255) NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"execution_type" varchar(100) NOT NULL,
	"function_name" varchar(255) NOT NULL,
	"endpoint" varchar(500),
	"method" varchar(10),
	"input" jsonb,
	"output" jsonb,
	"error" text,
	"stack_trace" text,
	"execution_time" integer NOT NULL,
	"memory_usage" integer,
	"cpu_time" integer,
	"status" varchar(50) NOT NULL,
	"priority" integer DEFAULT 1,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"request_id" varchar(255),
	"correlation_id" varchar(255),
	"parent_execution_id" varchar(255),
	"tags" jsonb,
	"metadata" jsonb,
	"resources_accessed" jsonb,
	"cache_hit" boolean DEFAULT false,
	"cache_key" varchar(500),
	"billing_units" numeric(10, 4) DEFAULT '0.0000',
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "plugin_executions_execution_id_unique" UNIQUE("execution_id")
);
--> statement-breakpoint
CREATE TABLE "plugin_instances" (
	"id" serial PRIMARY KEY NOT NULL,
	"instance_id" varchar(255) NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"neuron_type" varchar(100) NOT NULL,
	"version" varchar(50) NOT NULL,
	"configuration" jsonb NOT NULL,
	"status" varchar(50) DEFAULT 'inactive',
	"health" varchar(50) DEFAULT 'unknown',
	"last_health_check" timestamp,
	"health_details" jsonb,
	"usage_stats" jsonb NOT NULL,
	"performance_metrics" jsonb,
	"error_log" jsonb,
	"configuration_override" jsonb,
	"permissions_granted" jsonb,
	"resource_usage" jsonb,
	"billing_info" jsonb,
	"auto_update_enabled" boolean DEFAULT true,
	"last_update_check" timestamp,
	"update_available" boolean DEFAULT false,
	"available_version" varchar(50),
	"installation_method" varchar(100),
	"installation_source" text,
	"installed_by" varchar(255),
	"installation_notes" text,
	"customizations" jsonb,
	"backup_configuration" jsonb,
	"last_backup" timestamp,
	"maintenance_window" jsonb,
	"alert_settings" jsonb,
	"installed_at" timestamp DEFAULT now(),
	"last_updated" timestamp DEFAULT now(),
	"last_accessed" timestamp,
	"uninstalled_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plugin_instances_instance_id_unique" UNIQUE("instance_id")
);
--> statement-breakpoint
CREATE TABLE "plugin_manifests" (
	"id" serial PRIMARY KEY NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"author" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"type" varchar(50) NOT NULL,
	"entry_point" varchar(500) NOT NULL,
	"dependencies" jsonb NOT NULL,
	"permissions" jsonb NOT NULL,
	"configuration_schema" jsonb NOT NULL,
	"api_endpoints" jsonb,
	"hooks" jsonb NOT NULL,
	"compatibility" jsonb NOT NULL,
	"pricing" jsonb,
	"metadata" jsonb NOT NULL,
	"source_url" text,
	"documentation_url" text,
	"support_url" text,
	"license_type" varchar(100) DEFAULT 'MIT',
	"minimum_system_requirements" jsonb,
	"tags" jsonb,
	"screenshots" jsonb,
	"changelog" jsonb,
	"security_scan" jsonb,
	"performance_metrics" jsonb,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"download_count" integer DEFAULT 0,
	"rating" numeric(3, 2) DEFAULT '0.00',
	"review_count" integer DEFAULT 0,
	"last_security_scan" timestamp,
	"approved_at" timestamp,
	"approved_by" varchar(255),
	"rejected_at" timestamp,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plugin_manifests_plugin_id_unique" UNIQUE("plugin_id")
);
--> statement-breakpoint
CREATE TABLE "plugin_marketplace" (
	"id" serial PRIMARY KEY NOT NULL,
	"marketplace_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"base_url" text NOT NULL,
	"api_key" text,
	"api_secret" text,
	"auth_type" varchar(50) NOT NULL,
	"auth_config" jsonb,
	"sync_interval" integer DEFAULT 3600,
	"last_sync" timestamp,
	"sync_status" varchar(50) DEFAULT 'pending',
	"sync_errors" jsonb,
	"plugin_count" integer DEFAULT 0,
	"featured_plugins" jsonb,
	"categories" jsonb,
	"supported_languages" jsonb,
	"average_rating" numeric(3, 2) DEFAULT '0.00',
	"total_downloads" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_trusted" boolean DEFAULT false,
	"contact_email" varchar(255),
	"support_url" text,
	"terms_url" text,
	"privacy_url" text,
	"commission" numeric(5, 2) DEFAULT '0.00',
	"payment_methods" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plugin_marketplace_marketplace_id_unique" UNIQUE("marketplace_id")
);
--> statement-breakpoint
CREATE TABLE "plugin_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"review_id" varchar(255) NOT NULL,
	"plugin_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"neuron_id" varchar(255) NOT NULL,
	"rating" integer NOT NULL,
	"title" varchar(255),
	"review" text,
	"pros" jsonb,
	"cons" jsonb,
	"use_cases" jsonb,
	"recommendation" varchar(50),
	"verified" boolean DEFAULT false,
	"helpful_votes" integer DEFAULT 0,
	"total_votes" integer DEFAULT 0,
	"plugin_version" varchar(50) NOT NULL,
	"usage_duration" integer,
	"performance_rating" integer,
	"documentation_rating" integer,
	"support_rating" integer,
	"value_rating" integer,
	"response_from_author" text,
	"response_date" timestamp,
	"is_featured" boolean DEFAULT false,
	"is_moderated" boolean DEFAULT false,
	"moderation_notes" text,
	"language" varchar(10) DEFAULT 'en',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "plugin_reviews_review_id_unique" UNIQUE("review_id")
);
--> statement-breakpoint
CREATE TABLE "profit_forecast_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"model_id" varchar(255) NOT NULL,
	"model_name" varchar(255) NOT NULL,
	"model_type" varchar(50) NOT NULL,
	"forecast_horizon" integer DEFAULT 90,
	"historical_period" integer DEFAULT 365,
	"data_features" text[],
	"target_metrics" text[],
	"model_parameters" jsonb NOT NULL,
	"hyperparameters" jsonb,
	"accuracy" real DEFAULT 0,
	"mape" real DEFAULT 100,
	"rmse" real DEFAULT 0,
	"r2_score" real DEFAULT 0,
	"status" varchar(50) DEFAULT 'training',
	"version" varchar(50) DEFAULT '1.0',
	"is_default" boolean DEFAULT false,
	"last_trained_at" timestamp,
	"next_training_at" timestamp,
	"training_frequency" varchar(50) DEFAULT 'weekly',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255),
	"metadata" jsonb,
	CONSTRAINT "profit_forecast_models_model_id_unique" UNIQUE("model_id")
);
--> statement-breakpoint
CREATE TABLE "profit_forecasts" (
	"id" serial PRIMARY KEY NOT NULL,
	"forecast_id" varchar(255) NOT NULL,
	"model_id" integer NOT NULL,
	"model_version" varchar(50) NOT NULL,
	"forecast_type" varchar(50) NOT NULL,
	"scope" jsonb,
	"forecast_period" jsonb NOT NULL,
	"generated_at" timestamp DEFAULT now(),
	"predictions" jsonb NOT NULL,
	"confidence" jsonb,
	"seasonal_factors" jsonb,
	"trend_analysis" jsonb,
	"total_revenue_forecast" numeric(15, 2),
	"partner_split_forecast" numeric(15, 2),
	"net_profit_forecast" numeric(15, 2),
	"risk_factors" jsonb,
	"scenario_analysis" jsonb,
	"volatility_metrics" jsonb,
	"actual_vs_predicted" jsonb,
	"accuracy_score" real,
	"status" varchar(50) DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"metadata" jsonb,
	CONSTRAINT "profit_forecasts_forecast_id_unique" UNIQUE("forecast_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_split_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"analytics_id" varchar(255) NOT NULL,
	"period" varchar(20) NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"partner_id" integer,
	"vertical" varchar(100),
	"product_category" varchar(100),
	"total_revenue" numeric(15, 2) DEFAULT '0',
	"total_commissions" numeric(15, 2) DEFAULT '0',
	"total_payouts" numeric(15, 2) DEFAULT '0',
	"net_profit" numeric(15, 2) DEFAULT '0',
	"transaction_count" integer DEFAULT 0,
	"unique_partners" integer DEFAULT 0,
	"average_commission_rate" real DEFAULT 0,
	"average_order_value" numeric(10, 2) DEFAULT '0',
	"revenue_growth" real DEFAULT 0,
	"commission_growth" real DEFAULT 0,
	"partner_growth" real DEFAULT 0,
	"top_partners" jsonb,
	"top_products" jsonb,
	"top_verticals" jsonb,
	"conversion_rate" real DEFAULT 0,
	"revenue_per_partner" numeric(10, 2) DEFAULT '0',
	"cost_per_acquisition" numeric(10, 2) DEFAULT '0',
	"calculated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"metadata" jsonb,
	CONSTRAINT "revenue_split_analytics_analytics_id_unique" UNIQUE("analytics_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_split_partners" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" varchar(255) NOT NULL,
	"partner_name" varchar(255) NOT NULL,
	"partner_type" varchar(50) NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_phone" varchar(50),
	"legal_entity_name" varchar(255),
	"tax_id" varchar(100),
	"business_address" jsonb,
	"default_commission_rate" numeric(5, 2) NOT NULL,
	"split_type" varchar(50) DEFAULT 'percentage',
	"minimum_payout" numeric(10, 2) DEFAULT '50.00',
	"payout_frequency" varchar(20) DEFAULT 'monthly',
	"payment_method" varchar(50) DEFAULT 'bank_transfer',
	"payment_details" jsonb,
	"currency" varchar(3) DEFAULT 'USD',
	"total_earnings" numeric(15, 2) DEFAULT '0',
	"pending_payouts" numeric(15, 2) DEFAULT '0',
	"lifetime_revenue" numeric(15, 2) DEFAULT '0',
	"average_conversion_rate" real DEFAULT 0,
	"custom_split_rules" jsonb,
	"vertical_assignments" text[],
	"geo_restrictions" text[],
	"contract_terms" jsonb,
	"status" varchar(20) DEFAULT 'active',
	"is_vip" boolean DEFAULT false,
	"auto_payouts" boolean DEFAULT true,
	"requires_approval" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"last_payout_at" timestamp,
	"contract_start_date" timestamp,
	"contract_end_date" timestamp,
	"metadata" jsonb,
	"notes" text,
	CONSTRAINT "revenue_split_partners_partner_id_unique" UNIQUE("partner_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_split_payouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"payout_id" varchar(255) NOT NULL,
	"batch_id" varchar(255) NOT NULL,
	"partner_id" integer NOT NULL,
	"partner_name" varchar(255) NOT NULL,
	"payout_period" jsonb NOT NULL,
	"total_transactions" integer NOT NULL,
	"gross_amount" numeric(15, 2) NOT NULL,
	"deductions" numeric(10, 2) DEFAULT '0',
	"net_payout_amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"payment_method" varchar(50) NOT NULL,
	"payment_details" jsonb,
	"payment_processor_id" varchar(255),
	"payment_processor_fee" numeric(10, 2) DEFAULT '0',
	"status" varchar(50) DEFAULT 'pending',
	"failure_reason" text,
	"retry_count" integer DEFAULT 0,
	"max_retries" integer DEFAULT 3,
	"scheduled_at" timestamp NOT NULL,
	"processed_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"invoice_number" varchar(100),
	"tax_documents" jsonb,
	"compliance_data" jsonb,
	"metadata" jsonb,
	"notes" text,
	CONSTRAINT "revenue_split_payouts_payout_id_unique" UNIQUE("payout_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_split_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"rule_id" varchar(255) NOT NULL,
	"rule_name" varchar(255) NOT NULL,
	"partner_id" integer,
	"vertical" varchar(100),
	"product_category" varchar(100),
	"specific_products" integer[],
	"split_type" varchar(50) NOT NULL,
	"commission_structure" jsonb NOT NULL,
	"minimum_order_value" numeric(10, 2),
	"maximum_order_value" numeric(10, 2),
	"eligible_countries" text[],
	"eligible_customer_types" text[],
	"time_restrictions" jsonb,
	"performance_bonuses" jsonb,
	"priority" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"effective_date" timestamp DEFAULT now(),
	"expiration_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" varchar(255),
	"metadata" jsonb,
	CONSTRAINT "revenue_split_rules_rule_id_unique" UNIQUE("rule_id")
);
--> statement-breakpoint
CREATE TABLE "revenue_split_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"order_id" varchar(255),
	"click_id" varchar(255),
	"affiliate_code" varchar(100),
	"partner_id" integer NOT NULL,
	"rule_id" integer,
	"original_amount" numeric(15, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'USD',
	"exchange_rate" numeric(10, 6) DEFAULT '1.000000',
	"commission_rate" numeric(5, 2) NOT NULL,
	"commission_amount" numeric(15, 2) NOT NULL,
	"bonus_amount" numeric(15, 2) DEFAULT '0',
	"total_split_amount" numeric(15, 2) NOT NULL,
	"processing_fees" numeric(10, 2) DEFAULT '0',
	"platform_fees" numeric(10, 2) DEFAULT '0',
	"net_payout_amount" numeric(15, 2) NOT NULL,
	"vertical" varchar(100),
	"product_category" varchar(100),
	"product_id" integer,
	"product_name" varchar(255),
	"customer_segment" varchar(100),
	"customer_country" varchar(3),
	"is_new_customer" boolean DEFAULT true,
	"status" varchar(50) DEFAULT 'pending',
	"payout_batch_id" varchar(255),
	"transaction_date" timestamp DEFAULT now(),
	"approved_at" timestamp,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"audit_trail" jsonb,
	"compliance_checks" jsonb,
	"metadata" jsonb,
	CONSTRAINT "revenue_split_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "federation_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"aggregation_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"timeframe" varchar(20) NOT NULL,
	"aggregation_type" varchar(50) NOT NULL,
	"neuron_id" varchar(255),
	"metrics" jsonb NOT NULL,
	"comparisons" jsonb DEFAULT '{}'::jsonb,
	"trends" jsonb DEFAULT '{}'::jsonb,
	"alerts" jsonb DEFAULT '[]'::jsonb,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_config_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"config_key" varchar(255) NOT NULL,
	"config_value" jsonb NOT NULL,
	"version" varchar(50) NOT NULL,
	"previous_version" varchar(50),
	"change_type" varchar(50) NOT NULL,
	"change_reason" text,
	"rollback_data" jsonb,
	"is_active" boolean DEFAULT true,
	"created_by" varchar(255) NOT NULL,
	"approved_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"deployed_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_conflicts" (
	"id" serial PRIMARY KEY NOT NULL,
	"conflict_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neuron_id" varchar(255),
	"conflict_type" varchar(50) NOT NULL,
	"source_data" jsonb NOT NULL,
	"target_data" jsonb NOT NULL,
	"resolution" varchar(50),
	"resolution_data" jsonb,
	"resolved_by" varchar(255),
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(20) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_health_checks" (
	"id" serial PRIMARY KEY NOT NULL,
	"check_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neuron_id" varchar(255),
	"check_type" varchar(50) NOT NULL,
	"status" varchar(20) NOT NULL,
	"response_time" integer,
	"metrics" jsonb DEFAULT '{}'::jsonb,
	"issues" jsonb DEFAULT '[]'::jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"checked_at" timestamp DEFAULT now() NOT NULL,
	"next_check_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_hot_reloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"reload_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neuron_id" varchar(255),
	"reload_type" varchar(50) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"acknowledgment" jsonb,
	"rollback_available" boolean DEFAULT false,
	"rollback_data" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"triggered_by" varchar(255) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"migration_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neuron_id" varchar(255),
	"from_version" varchar(50) NOT NULL,
	"to_version" varchar(50) NOT NULL,
	"migration_type" varchar(50) NOT NULL,
	"migration_script" text,
	"rollback_script" text,
	"status" varchar(20) DEFAULT 'pending',
	"progress" integer DEFAULT 0,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"backup_reference" varchar(255),
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"triggered_by" varchar(255) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_security_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"neuron_id" varchar(255),
	"token_type" varchar(20) NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"scope" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"last_used_at" timestamp,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"revoked_by" varchar(255),
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "federation_sync_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sync_type" varchar(50) NOT NULL,
	"target_neurons" jsonb DEFAULT '[]'::jsonb,
	"payload" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"progress" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"triggered_by" varchar(255) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "api_access_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_id" varchar(255) NOT NULL,
	"key_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"application_name" varchar(255),
	"scopes" jsonb,
	"rate_limit_rpm" integer DEFAULT 1000,
	"rate_limit_rpd" integer DEFAULT 10000,
	"usage_stats" jsonb,
	"last_used_at" timestamp,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "api_access_tokens_token_id_unique" UNIQUE("token_id")
);
--> statement-breakpoint
CREATE TABLE "cache_invalidation_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" varchar(255) NOT NULL,
	"invalidation_type" varchar(50) NOT NULL,
	"invalidation_token" varchar(255),
	"reason" text,
	"triggered_by" varchar(255),
	"affected_routes" jsonb,
	"success" boolean DEFAULT true,
	"error_message" text,
	"invalidated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cache_performance_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"hits" integer DEFAULT 0,
	"misses" integer DEFAULT 0,
	"hit_ratio" real DEFAULT 0,
	"avg_response_time" real DEFAULT 0,
	"bandwidth_saved" integer DEFAULT 0,
	"requests" integer DEFAULT 0,
	"errors" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cdn_cache_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"route_id" varchar(255) NOT NULL,
	"route_pattern" varchar(500) NOT NULL,
	"cache_policy" varchar(100) NOT NULL,
	"ttl_seconds" integer DEFAULT 3600,
	"max_age" integer DEFAULT 3600,
	"stale_while_revalidate" integer DEFAULT 600,
	"vary_headers" jsonb,
	"conditions" jsonb,
	"invalidation_tokens" jsonb,
	"compression_enabled" boolean DEFAULT true,
	"preload_rules" jsonb,
	"geo_location" jsonb,
	"last_updated" timestamp DEFAULT now(),
	"last_invalidated" timestamp,
	"hit_ratio" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "cdn_cache_config_route_id_unique" UNIQUE("route_id")
);
--> statement-breakpoint
CREATE TABLE "llm_fallback_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"request_id" varchar(255) NOT NULL,
	"primary_llm_id" varchar(255),
	"fallback_llm_id" varchar(255),
	"event_type" varchar(50) NOT NULL,
	"error_message" text,
	"response_time" integer,
	"token_count" integer,
	"cost" real,
	"retry_attempt" integer DEFAULT 0,
	"user_agent" text,
	"ip_address" varchar(45),
	"session_id" varchar(255),
	"metadata" jsonb,
	"event_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "llm_fallbacks" (
	"id" serial PRIMARY KEY NOT NULL,
	"llm_id" varchar(255) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"endpoint" text NOT NULL,
	"api_key_ref" varchar(255),
	"model" varchar(100) NOT NULL,
	"priority" integer DEFAULT 100,
	"max_tokens" integer DEFAULT 2048,
	"temperature" real DEFAULT 0.7,
	"timeout" integer DEFAULT 30000,
	"rate_limit_rpm" integer DEFAULT 60,
	"cost_per_token" real DEFAULT 0.0001,
	"supported_features" jsonb,
	"configuration" jsonb,
	"health_status" varchar(50) DEFAULT 'healthy',
	"last_health_check" timestamp,
	"health_check_interval" integer DEFAULT 300,
	"error_count" integer DEFAULT 0,
	"total_requests" integer DEFAULT 0,
	"success_rate" real DEFAULT 100,
	"avg_response_time" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "llm_fallbacks_llm_id_unique" UNIQUE("llm_id")
);
--> statement-breakpoint
CREATE TABLE "llm_usage_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"llm_id" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"requests" integer DEFAULT 0,
	"successful_requests" integer DEFAULT 0,
	"failed_requests" integer DEFAULT 0,
	"total_tokens" integer DEFAULT 0,
	"avg_response_time" real DEFAULT 0,
	"total_cost" real DEFAULT 0,
	"error_rate" real DEFAULT 0,
	"uptime" real DEFAULT 100,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "migration_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"component" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"backup_location" text,
	"restore_location" text,
	"records_affected" integer DEFAULT 0,
	"duration" integer,
	"error_message" text,
	"metadata" jsonb,
	"triggered_by" varchar(255),
	"event_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "secret_rotation_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_id" varchar(255) NOT NULL,
	"old_value" text,
	"new_value" text,
	"rotation_type" varchar(50) NOT NULL,
	"rotated_by" varchar(255),
	"reason" text,
	"rollback_available" boolean DEFAULT true,
	"rotated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "secrets_vault" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_id" varchar(255) NOT NULL,
	"secret_type" varchar(50) NOT NULL,
	"value" text NOT NULL,
	"environment" varchar(50) DEFAULT 'production',
	"description" text,
	"version" integer DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"rotated_at" timestamp,
	"rotation_frequency_days" integer DEFAULT 90,
	"metadata" jsonb,
	"audit_trail" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "secrets_vault_key_id_unique" UNIQUE("key_id")
);
--> statement-breakpoint
CREATE TABLE "backlink_monitoring" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_url" text NOT NULL,
	"target_url" text NOT NULL,
	"anchor_text" text,
	"link_type" varchar(50),
	"source_authority" real DEFAULT 0,
	"link_status" varchar(50) DEFAULT 'active',
	"traffic_from_link" integer DEFAULT 0,
	"link_value" real DEFAULT 0,
	"discovered_at" timestamp DEFAULT now(),
	"last_checked" timestamp DEFAULT now(),
	"alerts_enabled" boolean DEFAULT true,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backlink_opportunities" (
	"id" serial PRIMARY KEY NOT NULL,
	"target_domain" text NOT NULL,
	"contact_email" text,
	"contact_name" text,
	"website_authority" real DEFAULT 0,
	"domain_rating" real DEFAULT 0,
	"traffic_estimate" integer DEFAULT 0,
	"vertical" varchar(50),
	"link_type" varchar(50) NOT NULL,
	"outreach_status" varchar(50) DEFAULT 'not_contacted',
	"response_status" varchar(50),
	"link_placed" boolean DEFAULT false,
	"link_url" text,
	"anchor_text" text,
	"content_url" text,
	"pitch_template" text,
	"follow_up_schedule" jsonb DEFAULT '[]'::jsonb,
	"expected_value" real DEFAULT 0,
	"priority" integer DEFAULT 1,
	"last_contact_at" timestamp,
	"next_follow_up" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "backlink_outreach" (
	"id" serial PRIMARY KEY NOT NULL,
	"opportunity_id" integer,
	"outreach_type" varchar(50) NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"sent_at" timestamp DEFAULT now(),
	"opened" boolean DEFAULT false,
	"opened_at" timestamp,
	"clicked" boolean DEFAULT false,
	"clicked_at" timestamp,
	"replied" boolean DEFAULT false,
	"replied_at" timestamp,
	"reply_content" text,
	"sentiment" varchar(50),
	"next_action" text,
	"automation_triggered" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_swarm_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" integer,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"meta_description" text,
	"focus_keyword" text,
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"categories" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"internal_links" jsonb DEFAULT '[]'::jsonb,
	"external_links" jsonb DEFAULT '[]'::jsonb,
	"images" jsonb DEFAULT '[]'::jsonb,
	"faq_section" jsonb DEFAULT '[]'::jsonb,
	"schema_markup" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(50) DEFAULT 'published',
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"backlinks" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"published_at" timestamp DEFAULT now(),
	"last_optimized" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_swarm_sites" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" text NOT NULL,
	"domain" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"niche" text NOT NULL,
	"target_location" text,
	"content_strategy" jsonb DEFAULT '{}'::jsonb,
	"seo_config" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(50) DEFAULT 'active',
	"total_posts" integer DEFAULT 0,
	"monthly_traffic" integer DEFAULT 0,
	"backlinks" integer DEFAULT 0,
	"domain_authority" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_swarm_sites_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE "blog_swarm_trends" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"trend_source" varchar(50) NOT NULL,
	"search_volume" integer DEFAULT 0,
	"competition_level" varchar(20) DEFAULT 'medium',
	"trend_direction" varchar(20) DEFAULT 'stable',
	"viral_potential" real DEFAULT 0,
	"content_opportunities" jsonb DEFAULT '[]'::jsonb,
	"related_keywords" jsonb DEFAULT '[]'::jsonb,
	"is_processed" boolean DEFAULT false,
	"last_tracked" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer,
	"user_id" text NOT NULL,
	"user_name" text NOT NULL,
	"user_email" text NOT NULL,
	"score" integer DEFAULT 0,
	"progress" jsonb DEFAULT '{}'::jsonb,
	"completion_data" jsonb DEFAULT '{}'::jsonb,
	"is_completed" boolean DEFAULT false,
	"completed_at" timestamp,
	"rank" integer,
	"badges_earned" jsonb DEFAULT '[]'::jsonb,
	"rewards_earned" jsonb DEFAULT '[]'::jsonb,
	"shares_count" integer DEFAULT 0,
	"invites_count" integer DEFAULT 0,
	"invited_by" text,
	"referral_code" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_generation" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"content_type" varchar(50) NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"emotional_tone" varchar(50),
	"readability_score" real DEFAULT 0,
	"seo_score" real DEFAULT 0,
	"viral_potential" real DEFAULT 0,
	"status" varchar(50) DEFAULT 'draft',
	"published_at" timestamp,
	"scheduled_for" timestamp,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_performance" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_id" integer,
	"platform" varchar(50) NOT NULL,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"click_through_rate" real DEFAULT 0,
	"engagement_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"traffic_generated" integer DEFAULT 0,
	"backlinks_earned" integer DEFAULT 0,
	"virality_score" real DEFAULT 0,
	"tracking_period" varchar(20) DEFAULT '7d',
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_remix_distribution" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"platform" varchar(50) NOT NULL,
	"content_format" varchar(50) NOT NULL,
	"platform_content_id" text,
	"content_url" text,
	"status" varchar(50) DEFAULT 'scheduled',
	"scheduled_for" timestamp,
	"posted_at" timestamp,
	"engagement" jsonb DEFAULT '{}'::jsonb,
	"reach" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" real DEFAULT 0,
	"backlinks_generated" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_remix_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_content_id" text NOT NULL,
	"source_content_type" varchar(50) NOT NULL,
	"original_title" text NOT NULL,
	"original_url" text,
	"vertical" varchar(50) NOT NULL,
	"remix_strategy" varchar(50) NOT NULL,
	"target_platforms" jsonb DEFAULT '[]'::jsonb,
	"remixed_content" jsonb DEFAULT '{}'::jsonb,
	"generation_prompts" jsonb DEFAULT '{}'::jsonb,
	"branding_elements" jsonb DEFAULT '{}'::jsonb,
	"affiliate_links" jsonb DEFAULT '[]'::jsonb,
	"backlinks" jsonb DEFAULT '[]'::jsonb,
	"utm_parameters" jsonb DEFAULT '{}'::jsonb,
	"scheduling_config" jsonb DEFAULT '{}'::jsonb,
	"is_generated" boolean DEFAULT false,
	"is_scheduled" boolean DEFAULT false,
	"generated_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_scraping_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"base_url" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"scraping_config" jsonb NOT NULL,
	"selectors" jsonb DEFAULT '{}'::jsonb,
	"api_endpoint" text,
	"api_key" text,
	"request_headers" jsonb DEFAULT '{}'::jsonb,
	"scraping_frequency" varchar(50) DEFAULT 'daily',
	"last_scraped_at" timestamp,
	"is_active" boolean DEFAULT true,
	"error_count" integer DEFAULT 0,
	"success_rate" real DEFAULT 0,
	"average_content_quality" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"template_type" varchar(50) NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"viral_score" real DEFAULT 0,
	"structure" jsonb NOT NULL,
	"hooks" jsonb DEFAULT '[]'::jsonb,
	"call_to_actions" jsonb DEFAULT '[]'::jsonb,
	"emotional_triggers" jsonb DEFAULT '[]'::jsonb,
	"target_audience" jsonb DEFAULT '{}'::jsonb,
	"avg_engagement_rate" real DEFAULT 0,
	"avg_share_rate" real DEFAULT 0,
	"estimated_reach" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversion_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"funnel_id" integer,
	"experiment_id" integer,
	"session_id" text NOT NULL,
	"user_id" text,
	"visitor_id" text NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"step_name" text,
	"variant_shown" varchar(50),
	"event_value" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"page_url" text NOT NULL,
	"referrer_url" text,
	"traffic_source" varchar(50),
	"utm_campaign" text,
	"utm_medium" text,
	"utm_source" text,
	"device_type" varchar(50),
	"browser_type" varchar(50),
	"ip_address" text,
	"user_agent" text,
	"location" jsonb DEFAULT '{}'::jsonb,
	"event_metadata" jsonb DEFAULT '{}'::jsonb,
	"event_timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversion_experiments" (
	"id" serial PRIMARY KEY NOT NULL,
	"funnel_id" integer,
	"experiment_name" text NOT NULL,
	"experiment_type" varchar(50) NOT NULL,
	"hypothesis" text NOT NULL,
	"variable" text NOT NULL,
	"control_version" jsonb NOT NULL,
	"variants" jsonb NOT NULL,
	"traffic_split" jsonb DEFAULT '{}'::jsonb,
	"status" varchar(50) DEFAULT 'draft',
	"confidence_level" real DEFAULT 95,
	"statistical_significance" real DEFAULT 0,
	"minimum_sample_size" integer DEFAULT 1000,
	"current_sample_size" integer DEFAULT 0,
	"expected_lift" real DEFAULT 0,
	"actual_lift" real DEFAULT 0,
	"winning_variant" varchar(50),
	"start_date" timestamp,
	"end_date" timestamp,
	"duration" integer DEFAULT 14,
	"results" jsonb DEFAULT '{}'::jsonb,
	"conclusion" text,
	"implementation_status" varchar(50) DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "conversion_funnels" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"funnel_type" varchar(50) NOT NULL,
	"steps" jsonb NOT NULL,
	"goal_type" varchar(50) NOT NULL,
	"goal_value" real DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"traffic_sources" jsonb DEFAULT '[]'::jsonb,
	"target_audience" jsonb DEFAULT '{}'::jsonb,
	"conversion_strategy" text,
	"ab_testing_enabled" boolean DEFAULT false,
	"current_variant" varchar(50) DEFAULT 'control',
	"variants" jsonb DEFAULT '[]'::jsonb,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp,
	"total_visitors" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"average_order_value" real DEFAULT 0,
	"last_optimized_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_visualization_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"viz_type" varchar(50) NOT NULL,
	"data_sources" jsonb DEFAULT '[]'::jsonb,
	"chart_config" jsonb DEFAULT '{}'::jsonb,
	"interactive_elements" jsonb DEFAULT '[]'::jsonb,
	"embed_code" text,
	"shareable_url" text,
	"download_formats" jsonb DEFAULT '["png","pdf","svg"]'::jsonb,
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"embeds" integer DEFAULT 0,
	"downloads" integer DEFAULT 0,
	"viral_score" real DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"last_data_update" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_visualization_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer,
	"platform" varchar(50) NOT NULL,
	"shares" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"click_throughs" integer DEFAULT 0,
	"virality_coefficient" real DEFAULT 0,
	"engagement_rate" real DEFAULT 0,
	"reach_estimate" integer DEFAULT 0,
	"last_tracked" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_automations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"automation_type" varchar(50) NOT NULL,
	"trigger_event" varchar(50) NOT NULL,
	"trigger_conditions" jsonb DEFAULT '{}'::jsonb,
	"vertical" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"delay_minutes" integer DEFAULT 0,
	"send_time" varchar(10),
	"time_zone" varchar(50) DEFAULT 'UTC',
	"frequency" varchar(50) DEFAULT 'once',
	"max_executions" integer DEFAULT 0,
	"current_executions" integer DEFAULT 0,
	"segment_filters" jsonb DEFAULT '{}'::jsonb,
	"email_sequence" jsonb DEFAULT '[]'::jsonb,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "email_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"status" varchar(50) DEFAULT 'active',
	"source_url" text,
	"source_type" varchar(50),
	"vertical" varchar(50),
	"segments" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"engagement_score" real DEFAULT 0,
	"last_opened_at" timestamp,
	"last_clicked_at" timestamp,
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp,
	"ip_address" text,
	"user_agent" text,
	"lead_magnet_used" text,
	"total_emails_received" integer DEFAULT 0,
	"total_emails_opened" integer DEFAULT 0,
	"total_links_clicked" integer DEFAULT 0,
	"lifetime_value" real DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "email_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "forum_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"vertical" varchar(50) NOT NULL,
	"parent_id" integer,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"moderators" jsonb DEFAULT '[]'::jsonb,
	"post_count" integer DEFAULT 0,
	"topic_count" integer DEFAULT 0,
	"last_post_at" timestamp,
	"seo_optimized" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "forum_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "forum_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"topic_id" integer,
	"parent_id" integer,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"helpful_votes" integer DEFAULT 0,
	"is_accepted_answer" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"moderation_status" varchar(50) DEFAULT 'approved',
	"ai_generated" boolean DEFAULT false,
	"sentiment" varchar(20),
	"edit_history" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "forum_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"author_name" text NOT NULL,
	"is_sticky" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"is_pinned" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"replies" integer DEFAULT 0,
	"upvotes" integer DEFAULT 0,
	"downvotes" integer DEFAULT 0,
	"helpful_votes" integer DEFAULT 0,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"meta_description" text,
	"seo_score" real DEFAULT 0,
	"last_reply_at" timestamp,
	"last_reply_by" text,
	"is_solved" boolean DEFAULT false,
	"best_answer_id" integer,
	"moderation_status" varchar(50) DEFAULT 'approved',
	"ai_generated" boolean DEFAULT false,
	"source_platform" varchar(50),
	"original_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_editions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"edition_type" varchar(50) NOT NULL,
	"subject" text NOT NULL,
	"preheader" text,
	"content" text NOT NULL,
	"content_summary" text,
	"trending_sources" jsonb DEFAULT '[]'::jsonb,
	"ai_generated_sections" jsonb DEFAULT '[]'::jsonb,
	"embedded_offers" jsonb DEFAULT '[]'::jsonb,
	"cta" jsonb DEFAULT '{}'::jsonb,
	"recipient_count" integer DEFAULT 0,
	"open_rate" real DEFAULT 0,
	"click_rate" real DEFAULT 0,
	"unsubscribe_rate" real DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"status" varchar(50) DEFAULT 'draft',
	"scheduled_for" timestamp,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"vertical" varchar(50),
	"subscription_source" text,
	"lead_magnet" text,
	"segments" jsonb DEFAULT '[]'::jsonb,
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"open_rate" real DEFAULT 0,
	"click_rate" real DEFAULT 0,
	"engagement_score" real DEFAULT 0,
	"last_opened_at" timestamp,
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "public_api_endpoints" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"endpoint" text NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"method" varchar(10) DEFAULT 'GET' NOT NULL,
	"parameters" jsonb DEFAULT '[]'::jsonb,
	"response_schema" jsonb DEFAULT '{}'::jsonb,
	"examples" jsonb DEFAULT '[]'::jsonb,
	"rate_limit" jsonb DEFAULT '{}'::jsonb,
	"requires_auth" boolean DEFAULT false,
	"pricing_tier" varchar(50) DEFAULT 'free',
	"is_active" boolean DEFAULT true,
	"total_calls" integer DEFAULT 0,
	"monthly_call_limit" integer DEFAULT 1000,
	"documentation" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "public_api_endpoints_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "public_api_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"user_id" text,
	"user_email" text,
	"key_name" text,
	"allowed_endpoints" jsonb DEFAULT '[]'::jsonb,
	"calls_this_month" integer DEFAULT 0,
	"total_calls" integer DEFAULT 0,
	"last_used_at" timestamp,
	"monthly_limit" integer DEFAULT 1000,
	"is_active" boolean DEFAULT true,
	"rate_limit_tier" varchar(50) DEFAULT 'basic',
	"created_at" timestamp DEFAULT now(),
	"expires_at" timestamp,
	CONSTRAINT "public_api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "public_widgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"widget_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"embed_code" text NOT NULL,
	"config_options" jsonb DEFAULT '{}'::jsonb,
	"branding_required" boolean DEFAULT true,
	"affiliate_tracking" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"embed_count" integer DEFAULT 0,
	"total_views" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_id" integer,
	"referrer_id" text NOT NULL,
	"referral_code" text NOT NULL,
	"custom_url" text,
	"target_url" text NOT NULL,
	"campaign_name" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" real DEFAULT 0,
	"commission_earned" real DEFAULT 0,
	"last_click_at" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "referral_links_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "referral_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"vertical" varchar(50) NOT NULL,
	"reward_type" varchar(50) NOT NULL,
	"reward_value" real NOT NULL,
	"referrer_reward" real NOT NULL,
	"referee_reward" real DEFAULT 0,
	"minimum_purchase" real DEFAULT 0,
	"cookie_duration" integer DEFAULT 30,
	"max_rewards_per_user" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"auto_approval" boolean DEFAULT true,
	"tracking_method" varchar(50) DEFAULT 'cookie',
	"payment_schedule" varchar(50) DEFAULT 'monthly',
	"terms_and_conditions" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "referral_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_id" integer,
	"program_id" integer,
	"referrer_id" text NOT NULL,
	"referee_id" text,
	"referee_email" text,
	"transaction_type" varchar(50) NOT NULL,
	"transaction_value" real DEFAULT 0,
	"commission_rate" real DEFAULT 0,
	"commission_amount" real DEFAULT 0,
	"status" varchar(50) DEFAULT 'pending',
	"ip_address" text,
	"user_agent" text,
	"conversion_data" jsonb DEFAULT '{}'::jsonb,
	"payment_date" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resource_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"vertical" varchar(50) NOT NULL,
	"parent_id" integer,
	"icon" text,
	"color" text,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"resource_count" integer DEFAULT 0,
	"seo_optimized" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "resource_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resource_comparisons" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"comparison_type" varchar(50) NOT NULL,
	"resources" jsonb NOT NULL,
	"comparison_matrix" jsonb DEFAULT '{}'::jsonb,
	"winner" integer,
	"views" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"revenue" real DEFAULT 0,
	"is_published" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resource_directory" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"short_description" text,
	"url" text NOT NULL,
	"logo_url" text,
	"screenshots" jsonb DEFAULT '[]'::jsonb,
	"resource_type" varchar(50) NOT NULL,
	"pricing" jsonb DEFAULT '{}'::jsonb,
	"features" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"affiliate_url" text,
	"commission_rate" real DEFAULT 0,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"conversions" integer DEFAULT 0,
	"revenue" real DEFAULT 0,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_updated" timestamp DEFAULT now(),
	"submitted_by" text,
	"moderation_status" varchar(50) DEFAULT 'approved',
	"seo_score" real DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scraped_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" integer,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"author" text,
	"original_url" text NOT NULL,
	"published_at" timestamp,
	"scraped_at" timestamp DEFAULT now(),
	"content_type" varchar(50) NOT NULL,
	"language" varchar(10) DEFAULT 'en',
	"sentiment" varchar(20),
	"keywords" jsonb DEFAULT '[]'::jsonb,
	"entities" jsonb DEFAULT '[]'::jsonb,
	"quality_score" real DEFAULT 0,
	"viral_potential" real DEFAULT 0,
	"is_processed" boolean DEFAULT false,
	"is_approved" boolean DEFAULT false,
	"is_plagiarized" boolean DEFAULT false,
	"moderation_status" varchar(50) DEFAULT 'pending',
	"ai_enhanced" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_keyword_research" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" text NOT NULL,
	"search_volume" integer DEFAULT 0,
	"competition_level" varchar(20) DEFAULT 'medium',
	"difficulty" real DEFAULT 0,
	"cpc" real DEFAULT 0,
	"trend" varchar(20) DEFAULT 'stable',
	"related_keywords" jsonb DEFAULT '[]'::jsonb,
	"content_opportunity" text,
	"vertical" varchar(50) NOT NULL,
	"priority" integer DEFAULT 1,
	"is_targeted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_optimization_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"target_keyword" text NOT NULL,
	"title" text,
	"meta_description" text,
	"heading_structure" jsonb DEFAULT '{}'::jsonb,
	"keyword_density" real DEFAULT 0,
	"content_length" integer DEFAULT 0,
	"internal_links" integer DEFAULT 0,
	"external_links" integer DEFAULT 0,
	"image_alt_tags" integer DEFAULT 0,
	"seo_score" real DEFAULT 0,
	"status" varchar(50) DEFAULT 'pending',
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"priority" integer DEFAULT 1,
	"last_analyzed" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_site_audits" (
	"id" serial PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"overall_score" real DEFAULT 0,
	"technical_issues" jsonb DEFAULT '[]'::jsonb,
	"content_issues" jsonb DEFAULT '[]'::jsonb,
	"linking_issues" jsonb DEFAULT '[]'::jsonb,
	"speed_score" real DEFAULT 0,
	"mobile_score" real DEFAULT 0,
	"accessibility_score" real DEFAULT 0,
	"best_practices_score" real DEFAULT 0,
	"fix_recommendations" jsonb DEFAULT '[]'::jsonb,
	"estimated_traffic_impact" integer DEFAULT 0,
	"audit_date" timestamp DEFAULT now(),
	"next_audit_due" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(50) NOT NULL,
	"account_name" text NOT NULL,
	"account_handle" text,
	"account_id" text,
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"is_active" boolean DEFAULT true,
	"is_connected" boolean DEFAULT false,
	"vertical" varchar(50),
	"follower_count" integer DEFAULT 0,
	"following_count" integer DEFAULT 0,
	"post_count" integer DEFAULT 0,
	"engagement_rate" real DEFAULT 0,
	"last_sync_at" timestamp,
	"automation_settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_engagement" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"platform" varchar(50) NOT NULL,
	"engagement_type" varchar(50) NOT NULL,
	"user_id" text,
	"username" text,
	"user_profile_url" text,
	"engagement_content" text,
	"sentiment_score" real,
	"is_influencer" boolean DEFAULT false,
	"follower_count" integer DEFAULT 0,
	"engagement_value" real DEFAULT 0,
	"automated_response" text,
	"response_scheduled" boolean DEFAULT false,
	"engaged_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_media_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer,
	"platform" varchar(50) NOT NULL,
	"content_id" integer,
	"post_content" text NOT NULL,
	"media_urls" jsonb DEFAULT '[]'::jsonb,
	"hashtags" jsonb DEFAULT '[]'::jsonb,
	"mentions" jsonb DEFAULT '[]'::jsonb,
	"post_url" text,
	"platform_post_id" text,
	"status" varchar(50) DEFAULT 'draft',
	"scheduled_for" timestamp,
	"posted_at" timestamp,
	"engagement_metrics" jsonb DEFAULT '{}'::jsonb,
	"is_promoted" boolean DEFAULT false,
	"promotion_budget" real DEFAULT 0,
	"target_audience" jsonb DEFAULT '{}'::jsonb,
	"campaign_name" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ugc_video_contests" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"contest_type" varchar(50) NOT NULL,
	"prize" text NOT NULL,
	"prize_value" real DEFAULT 0,
	"guidelines" text NOT NULL,
	"judgement_criteria" jsonb DEFAULT '[]'::jsonb,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"voting_end_date" timestamp,
	"max_submissions" integer DEFAULT 0,
	"current_submissions" integer DEFAULT 0,
	"winner_announced" boolean DEFAULT false,
	"winner_id" integer,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ugc_video_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"vertical" varchar(50) NOT NULL,
	"video_type" varchar(50) NOT NULL,
	"video_url" text NOT NULL,
	"thumbnail_url" text,
	"duration" integer,
	"submitter_name" text NOT NULL,
	"submitter_email" text NOT NULL,
	"submitter_social" jsonb DEFAULT '{}'::jsonb,
	"moderation_status" varchar(50) DEFAULT 'pending',
	"is_approved" boolean DEFAULT false,
	"reject_reason" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"ai_optimized_title" text,
	"ai_optimized_description" text,
	"ai_generated_tags" jsonb DEFAULT '[]'::jsonb,
	"platforms" jsonb DEFAULT '[]'::jsonb,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"conversion_rate" real DEFAULT 0,
	"viral_score" real DEFAULT 0,
	"contest_entry" boolean DEFAULT false,
	"reward_eligible" boolean DEFAULT false,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "viral_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"vertical" varchar(50) NOT NULL,
	"challenge_type" varchar(50) NOT NULL,
	"rules" text NOT NULL,
	"instructions" text NOT NULL,
	"duration" integer DEFAULT 30,
	"max_participants" integer DEFAULT 0,
	"current_participants" integer DEFAULT 0,
	"challenge_data" jsonb NOT NULL,
	"scoring" jsonb DEFAULT '{}'::jsonb,
	"rewards" jsonb DEFAULT '[]'::jsonb,
	"badges" jsonb DEFAULT '[]'::jsonb,
	"sharing_rewards" jsonb DEFAULT '{}'::jsonb,
	"invite_rewards" jsonb DEFAULT '{}'::jsonb,
	"leaderboard_visible" boolean DEFAULT true,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"viral_factor" real DEFAULT 0,
	"total_shares" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "widget_embeds" (
	"id" serial PRIMARY KEY NOT NULL,
	"widget_id" integer,
	"embed_domain" text NOT NULL,
	"embed_url" text NOT NULL,
	"embed_config" jsonb DEFAULT '{}'::jsonb,
	"first_seen_at" timestamp DEFAULT now(),
	"last_seen_at" timestamp DEFAULT now(),
	"view_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_knowledge_base" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"source_type" varchar(50),
	"source_id" text,
	"tags" text[],
	"intents" text[],
	"verticals" text[],
	"archetypes" text[],
	"priority" integer DEFAULT 5,
	"is_active" boolean DEFAULT true,
	"usage_count" integer DEFAULT 0,
	"last_used_at" timestamp,
	"accuracy" real DEFAULT 0.8,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "canned_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(50) NOT NULL,
	"intents" text[],
	"languages" text[],
	"is_global" boolean DEFAULT true,
	"agent_id" text,
	"usage_count" integer DEFAULT 0,
	"tags" text[],
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb NOT NULL,
	"user_id" text,
	"user_archetype" varchar(100),
	"intent" varchar(100),
	"conversion_value" real,
	"response_time" integer,
	"satisfaction_score" real,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"timestamp" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_escalations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"from_agent_id" text,
	"to_agent_id" text,
	"escalation_type" varchar(50) NOT NULL,
	"reason" varchar(100) NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"status" varchar(20) DEFAULT 'pending',
	"notes" text,
	"context" jsonb DEFAULT '{}'::jsonb,
	"response_time" integer,
	"resolution_time" integer,
	"customer_satisfaction" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"feedback_type" varchar(50) NOT NULL,
	"rating" integer,
	"comment" text,
	"categories" text[],
	"user_id" text,
	"agent_id" text,
	"is_resolved" boolean DEFAULT false,
	"resolution" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_intents" (
	"id" serial PRIMARY KEY NOT NULL,
	"intent_name" varchar(100) NOT NULL,
	"intent_category" varchar(50) NOT NULL,
	"trigger_keywords" text[],
	"trigger_phrases" text[],
	"response_templates" jsonb DEFAULT '[]'::jsonb,
	"follow_up_actions" jsonb DEFAULT '[]'::jsonb,
	"confidence" real DEFAULT 0.5,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 5,
	"context_required" jsonb DEFAULT '[]'::jsonb,
	"personalized_by_archetype" boolean DEFAULT false,
	"conversion_potential" real DEFAULT 0.1,
	"handoff_to_human" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chat_intents_intent_name_unique" UNIQUE("intent_name")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"message_type" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"content_type" varchar(50) DEFAULT 'text',
	"intent" varchar(100),
	"confidence" real,
	"language" varchar(10) DEFAULT 'en',
	"user_id" text,
	"agent_id" text,
	"llm_provider" varchar(50),
	"llm_model" varchar(100),
	"processing_time" integer,
	"tokens" integer,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_edited" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"parent_message_id" uuid,
	"thread_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"session_id" text NOT NULL,
	"channel_type" varchar(50) DEFAULT 'web' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"intent" varchar(100),
	"language" varchar(10) DEFAULT 'en',
	"user_archetype" varchar(100),
	"is_anonymous" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"started_at" timestamp DEFAULT now(),
	"last_activity_at" timestamp DEFAULT now(),
	"ended_at" timestamp,
	"total_messages" integer DEFAULT 0,
	"human_takeover_at" timestamp,
	"human_agent_id" text,
	"satisfaction_rating" integer,
	"conversion_event" varchar(100),
	"lead_value" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chat_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "chat_widgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"widget_name" varchar(100) NOT NULL,
	"widget_type" varchar(50) NOT NULL,
	"target_pages" text[],
	"target_verticals" text[],
	"appearance" jsonb NOT NULL,
	"behavior" jsonb NOT NULL,
	"greeting_message" text,
	"placeholder_text" text,
	"is_active" boolean DEFAULT true,
	"show_on_mobile" boolean DEFAULT true,
	"show_on_desktop" boolean DEFAULT true,
	"trigger_conditions" jsonb DEFAULT '{}'::jsonb,
	"analytics" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "chat_widgets_widget_name_unique" UNIQUE("widget_name")
);
--> statement-breakpoint
CREATE TABLE "conversation_context" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"user_id" text,
	"context_type" varchar(50) NOT NULL,
	"context_key" varchar(100) NOT NULL,
	"context_value" jsonb NOT NULL,
	"importance" integer DEFAULT 5,
	"expires_at" timestamp,
	"is_global" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "human_agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"departments" text[],
	"skills" text[],
	"languages" text[],
	"is_active" boolean DEFAULT true,
	"is_online" boolean DEFAULT false,
	"current_sessions" integer DEFAULT 0,
	"max_sessions" integer DEFAULT 5,
	"total_sessions" integer DEFAULT 0,
	"avg_rating" real,
	"total_ratings" integer DEFAULT 0,
	"schedule" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"last_active_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "human_agents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "content_defense_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb NOT NULL,
	"content_id" uuid,
	"plagiarism_id" uuid,
	"dmca_id" uuid,
	"impact_metrics" jsonb DEFAULT '{}'::jsonb,
	"response_time" integer,
	"resolution_time" integer,
	"cost_metrics" jsonb DEFAULT '{}'::jsonb,
	"success_metrics" jsonb DEFAULT '{}'::jsonb,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content_type" varchar(50) NOT NULL,
	"content_url" text NOT NULL,
	"content_title" text NOT NULL,
	"content_hash" text NOT NULL,
	"content_snippet" text,
	"word_count" integer,
	"vertical" varchar(50),
	"neuron_id" text,
	"is_protected" boolean DEFAULT true,
	"is_public" boolean DEFAULT true,
	"seo_value" real DEFAULT 0.5,
	"traffic_value" integer DEFAULT 0,
	"business_value" real DEFAULT 0,
	"last_scanned" timestamp,
	"last_modified" timestamp,
	"scan_frequency" varchar(20) DEFAULT 'weekly',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "content_inventory_content_url_unique" UNIQUE("content_url")
);
--> statement-breakpoint
CREATE TABLE "content_monitoring_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_name" varchar(100) NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"schedule" varchar(50) NOT NULL,
	"cron_expression" varchar(100),
	"target_content_ids" text[],
	"scan_parameters" jsonb NOT NULL,
	"search_engines" text[],
	"monitoring_apis" text[],
	"alert_thresholds" jsonb NOT NULL,
	"notification_channels" text[],
	"is_active" boolean DEFAULT true,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"total_runs" integer DEFAULT 0,
	"successful_runs" integer DEFAULT 0,
	"avg_execution_time" integer,
	"last_error" text,
	"performance" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_refreshes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_content_id" uuid NOT NULL,
	"refresh_reason" varchar(100) NOT NULL,
	"refresh_type" varchar(50) NOT NULL,
	"llm_provider" varchar(50),
	"llm_model" varchar(100),
	"original_content" text,
	"refreshed_content" text,
	"content_changes" jsonb DEFAULT '{}'::jsonb,
	"quality_score" real,
	"seo_improvements" jsonb DEFAULT '{}'::jsonb,
	"readability_score" real,
	"uniqueness_score" real,
	"approval_status" varchar(30) DEFAULT 'pending',
	"approved_by" text,
	"go_live_at" timestamp,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"rollback_available" boolean DEFAULT true,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dmca_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plagiarism_detection_id" uuid NOT NULL,
	"dmca_type" varchar(50) NOT NULL,
	"target_platform" varchar(100) NOT NULL,
	"platform_email" varchar(255),
	"request_status" varchar(30) DEFAULT 'draft',
	"dmca_template" varchar(50),
	"legal_jurisdiction" varchar(50),
	"request_content" text NOT NULL,
	"confirmation_number" varchar(100),
	"response_received" text,
	"follow_up_required" boolean DEFAULT false,
	"follow_up_date" timestamp,
	"legal_counsel_involved" boolean DEFAULT false,
	"estimated_cost" real,
	"actual_cost" real,
	"success_rate" real,
	"time_to_resolution" integer,
	"notes" text,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"sent_at" timestamp,
	"acknowledged_at" timestamp,
	"resolved_at" timestamp,
	"escalated_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plagiarism_detections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_content_id" uuid NOT NULL,
	"theft_url" text NOT NULL,
	"theft_domain" varchar(255) NOT NULL,
	"similarity_score" real NOT NULL,
	"detection_method" varchar(50) NOT NULL,
	"detection_source" varchar(100),
	"theft_type" varchar(50) NOT NULL,
	"theft_severity" varchar(20) NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"status" varchar(30) DEFAULT 'detected',
	"dmca_status" varchar(30),
	"theft_content" text,
	"theft_metadata" jsonb DEFAULT '{}'::jsonb,
	"impact_assessment" jsonb DEFAULT '{}'::jsonb,
	"evidence_urls" text[],
	"priority" integer DEFAULT 5,
	"detected_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"last_checked_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scraper_detections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"request_pattern" varchar(100),
	"request_count" integer DEFAULT 1,
	"request_timespan" integer,
	"avg_request_rate" real,
	"suspicion_score" real NOT NULL,
	"scraper_type" varchar(50),
	"target_urls" text[],
	"detection_method" varchar(50),
	"is_blocked" boolean DEFAULT false,
	"block_reason" text,
	"action_taken" varchar(100),
	"geolocation" jsonb DEFAULT '{}'::jsonb,
	"whois_data" jsonb DEFAULT '{}'::jsonb,
	"threat_level" varchar(20) DEFAULT 'medium',
	"is_resolved" boolean DEFAULT false,
	"first_detected_at" timestamp DEFAULT now(),
	"last_detected_at" timestamp DEFAULT now(),
	"resolved_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_counter_attacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plagiarism_detection_id" uuid NOT NULL,
	"attack_strategy" varchar(100) NOT NULL,
	"target_keywords" text[],
	"content_variations" integer,
	"publication_channels" text[],
	"backlink_campaigns" jsonb DEFAULT '[]'::jsonb,
	"social_signals" jsonb DEFAULT '{}'::jsonb,
	"seo_metrics" jsonb DEFAULT '{}'::jsonb,
	"effectiveness_score" real,
	"cost_invested" real,
	"roi_estimate" real,
	"campaign_status" varchar(30) DEFAULT 'active',
	"launched_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "coupon_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_code" varchar(100) NOT NULL,
	"retailer" varchar(100) NOT NULL,
	"coupon_type" varchar(50) NOT NULL,
	"discount_value" real NOT NULL,
	"minimum_purchase" real,
	"maximum_discount" real,
	"applicable_categories" text[],
	"excluded_categories" text[],
	"applicable_products" text[],
	"is_storewide" boolean DEFAULT false,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"success_rate" real,
	"last_tested" timestamp,
	"valid_from" timestamp,
	"valid_until" timestamp,
	"source" varchar(100),
	"popularity" integer DEFAULT 0,
	"user_rating" real,
	"description" text,
	"terms" text,
	"regions" text[],
	"first_time_customer_only" boolean DEFAULT false,
	"membership_required" boolean DEFAULT false,
	"stackable_with_others" boolean DEFAULT false,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"user_email" varchar(255),
	"phone_number" varchar(20),
	"product_id" uuid NOT NULL,
	"retailer" varchar(100),
	"alert_type" varchar(50) NOT NULL,
	"target_price" real,
	"discount_threshold" real,
	"is_active" boolean DEFAULT true,
	"frequency" varchar(20) DEFAULT 'instant',
	"channels" text[],
	"last_triggered" timestamp,
	"trigger_count" integer DEFAULT 0,
	"max_triggers" integer DEFAULT 50,
	"user_archetype" varchar(100),
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deal_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb NOT NULL,
	"deal_id" uuid,
	"product_id" uuid,
	"user_id" text,
	"user_archetype" varchar(100),
	"retailer" varchar(100),
	"deal_value" real,
	"conversion_value" real,
	"click_through_rate" real,
	"bounce_rate" real,
	"time_on_page" integer,
	"device_type" varchar(50),
	"traffic_source" varchar(100),
	"geolocation" jsonb DEFAULT '{}'::jsonb,
	"timestamp" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deal_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar(100) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"description" text,
	"keywords" text[],
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 5,
	"parent_category_id" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "deal_categories_category_name_unique" UNIQUE("category_name")
);
--> statement-breakpoint
CREATE TABLE "deal_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"deal_type" varchar(50) NOT NULL,
	"deal_severity" varchar(20) NOT NULL,
	"retailer" varchar(100) NOT NULL,
	"old_price" real,
	"new_price" real NOT NULL,
	"discount_percent" real,
	"discount_amount" real,
	"savings_value" real,
	"deal_score" real NOT NULL,
	"is_flash_sale" boolean DEFAULT false,
	"deal_duration" integer,
	"deal_end_time" timestamp,
	"coupon_code" varchar(100),
	"min_quantity" integer DEFAULT 1,
	"max_quantity" integer,
	"deal_url" text NOT NULL,
	"deal_description" text,
	"eligibility_conditions" text,
	"regions" text[],
	"verification_status" varchar(30) DEFAULT 'pending',
	"popularity_rank" integer,
	"click_count" integer DEFAULT 0,
	"conversion_rate" real,
	"revenue" real,
	"is_expired" boolean DEFAULT false,
	"notifications_sent" integer DEFAULT 0,
	"detected_at" timestamp DEFAULT now(),
	"expired_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deal_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" text NOT NULL,
	"retailer" varchar(100) NOT NULL,
	"category" varchar(100),
	"current_price" real NOT NULL,
	"original_price" real,
	"discount_percent" real,
	"deal_url" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deal_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_name" varchar(100) NOT NULL,
	"source_type" varchar(50) NOT NULL,
	"base_url" text NOT NULL,
	"api_endpoint" text,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 5,
	"categories" text[],
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "deal_sources_source_name_unique" UNIQUE("source_name")
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"retailer" varchar(100) NOT NULL,
	"retailer_product_id" text,
	"product_url" text NOT NULL,
	"current_price" real NOT NULL,
	"original_price" real,
	"discount_percent" real,
	"discount_amount" real,
	"currency" varchar(10) DEFAULT 'USD',
	"availability" varchar(50),
	"stock_level" integer,
	"price_history" jsonb DEFAULT '[]'::jsonb,
	"lowest_price" real,
	"highest_price" real,
	"average_price" real,
	"price_volatility" real,
	"last_price_change" timestamp,
	"price_change_frequency" integer,
	"is_on_sale" boolean DEFAULT false,
	"sale_end_date" timestamp,
	"coupon_codes" text[],
	"shipping_cost" real,
	"total_cost" real,
	"deal_score" real,
	"api_source" varchar(50),
	"data_quality" real DEFAULT 0.8,
	"last_updated" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"retailer" varchar(100) NOT NULL,
	"current_price" real NOT NULL,
	"predicted_price" real NOT NULL,
	"prediction_confidence" real NOT NULL,
	"prediction_horizon" integer NOT NULL,
	"prediction_model" varchar(100),
	"model_version" varchar(50),
	"factors" jsonb DEFAULT '{}'::jsonb,
	"next_sale_date" timestamp,
	"best_buy_window" jsonb DEFAULT '{}'::jsonb,
	"price_direction" varchar(20),
	"volatility_score" real,
	"demand_forecast" real,
	"accuracy" real,
	"is_active" boolean DEFAULT true,
	"predicted_at" timestamp DEFAULT now(),
	"actual_price" real,
	"accuracy_score" real,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product_catalog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_name" text NOT NULL,
	"product_slug" varchar(255) NOT NULL,
	"brand" varchar(100),
	"category" varchar(100) NOT NULL,
	"subcategory" varchar(100),
	"description" text,
	"specifications" jsonb DEFAULT '{}'::jsonb,
	"images" text[],
	"upc" varchar(50),
	"ean" varchar(50),
	"asin" varchar(20),
	"mpn" varchar(100),
	"tags" text[],
	"average_rating" real,
	"review_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"tracking_priority" integer DEFAULT 5,
	"popularity_score" real DEFAULT 0.5,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "product_catalog_product_slug_unique" UNIQUE("product_slug")
);
--> statement-breakpoint
CREATE TABLE "retailer_apis" (
	"id" serial PRIMARY KEY NOT NULL,
	"retailer_name" varchar(100) NOT NULL,
	"retailer_slug" varchar(50) NOT NULL,
	"api_type" varchar(50) NOT NULL,
	"api_endpoint" text,
	"api_key" text,
	"api_secret" text,
	"rate_limit" integer,
	"current_usage" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"last_sync" timestamp,
	"sync_frequency" integer DEFAULT 60,
	"error_count" integer DEFAULT 0,
	"success_rate" real DEFAULT 1,
	"avg_response_time" integer,
	"data_quality" real DEFAULT 0.8,
	"supported_features" text[],
	"regions" text[],
	"categories" text[],
	"api_documentation" text,
	"contact_info" jsonb DEFAULT '{}'::jsonb,
	"billing_info" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "retailer_apis_retailer_name_unique" UNIQUE("retailer_name"),
	CONSTRAINT "retailer_apis_retailer_slug_unique" UNIQUE("retailer_slug")
);
--> statement-breakpoint
CREATE TABLE "user_wishlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"wishlist_name" varchar(100) DEFAULT 'My Wishlist',
	"product_id" uuid NOT NULL,
	"target_price" real,
	"max_price" real,
	"priority" integer DEFAULT 5,
	"notes" text,
	"alerts_enabled" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"share_token" varchar(100),
	"tags" text[],
	"added_at" timestamp DEFAULT now(),
	"last_checked" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cross_promotion_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_franchise_id" uuid NOT NULL,
	"target_franchise_id" uuid NOT NULL,
	"link_type" varchar(50) NOT NULL,
	"link_position" varchar(100),
	"link_content" text NOT NULL,
	"link_text" text,
	"link_url" text NOT NULL,
	"link_title" text,
	"link_description" text,
	"display_conditions" jsonb DEFAULT '{}'::jsonb,
	"audience_targeting" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true,
	"priority" integer DEFAULT 5,
	"click_tracking_enabled" boolean DEFAULT true,
	"conversion_tracking_enabled" boolean DEFAULT true,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"click_count" integer DEFAULT 0,
	"conversion_count" integer DEFAULT 0,
	"conversion_value" real DEFAULT 0,
	"last_clicked" timestamp,
	"last_converted" timestamp,
	"is_reciprocal" boolean DEFAULT false,
	"reciprocal_link_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"franchise_id" uuid NOT NULL,
	"metric_type" varchar(50) NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_value" real NOT NULL,
	"metric_unit" varchar(20),
	"timeframe" varchar(20) NOT NULL,
	"date" timestamp NOT NULL,
	"dimensions" jsonb DEFAULT '{}'::jsonb,
	"compared_to_parent" real,
	"compared_to_previous" real,
	"benchmark" real,
	"is_anomaly" boolean DEFAULT false,
	"confidence" real,
	"data_source" varchar(100),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_backups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"franchise_id" uuid NOT NULL,
	"backup_name" varchar(100) NOT NULL,
	"backup_type" varchar(50) NOT NULL,
	"backup_trigger" varchar(50),
	"backup_status" varchar(30) DEFAULT 'in_progress',
	"backup_size" integer,
	"compression_ratio" real,
	"backup_location" text NOT NULL,
	"backup_metadata" jsonb DEFAULT '{}'::jsonb,
	"included_components" text[],
	"excluded_components" text[],
	"retention_policy" varchar(50) DEFAULT '30_days',
	"encryption_enabled" boolean DEFAULT true,
	"compression_enabled" boolean DEFAULT true,
	"verification_status" varchar(30),
	"restore_tested" boolean DEFAULT false,
	"last_restore_test" timestamp,
	"expires_at" timestamp,
	"started_at" timestamp DEFAULT now(),
	"completed_at" timestamp,
	"duration" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_deployments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"franchise_id" uuid NOT NULL,
	"deployment_type" varchar(50) NOT NULL,
	"version" varchar(20) NOT NULL,
	"deployment_status" varchar(30) DEFAULT 'pending',
	"deployment_method" varchar(50),
	"triggered_by" varchar(100),
	"changes_included" jsonb DEFAULT '[]'::jsonb,
	"deployment_steps" jsonb DEFAULT '[]'::jsonb,
	"current_step" integer DEFAULT 0,
	"total_steps" integer,
	"deployment_logs" text,
	"errors" jsonb DEFAULT '[]'::jsonb,
	"warnings" jsonb DEFAULT '[]'::jsonb,
	"pre_deployment_tests" jsonb DEFAULT '{}'::jsonb,
	"post_deployment_tests" jsonb DEFAULT '{}'::jsonb,
	"performance_comparison" jsonb DEFAULT '{}'::jsonb,
	"rollback_point" varchar(100),
	"can_rollback" boolean DEFAULT true,
	"estimated_duration" integer,
	"actual_duration" integer,
	"resources_used" jsonb DEFAULT '{}'::jsonb,
	"downtime" integer DEFAULT 0,
	"started_at" timestamp,
	"completed_at" timestamp,
	"rollback_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_instances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"franchise_name" varchar(100) NOT NULL,
	"franchise_slug" varchar(100) NOT NULL,
	"template_id" uuid NOT NULL,
	"parent_neuron_id" text,
	"status" varchar(30) DEFAULT 'initializing',
	"deployment_type" varchar(50) NOT NULL,
	"primary_domain" varchar(255),
	"subdomains" text[],
	"custom_domains" text[],
	"deployment_url" text,
	"admin_url" text,
	"api_endpoint" text,
	"region" varchar(50),
	"language" varchar(10) DEFAULT 'en',
	"localization" jsonb DEFAULT '{}'::jsonb,
	"branding_customization" jsonb DEFAULT '{}'::jsonb,
	"content_customization" jsonb DEFAULT '{}'::jsonb,
	"feature_flags" jsonb DEFAULT '{}'::jsonb,
	"integration_config" jsonb DEFAULT '{}'::jsonb,
	"analytics_config" jsonb DEFAULT '{}'::jsonb,
	"seo_config" jsonb DEFAULT '{}'::jsonb,
	"affiliate_config" jsonb DEFAULT '{}'::jsonb,
	"cross_promotion_config" jsonb DEFAULT '{}'::jsonb,
	"backlinks_to_parent" text[],
	"backlinks_from_parent" text[],
	"shared_resources" jsonb DEFAULT '{}'::jsonb,
	"isolated_resources" jsonb DEFAULT '{}'::jsonb,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"business_metrics" jsonb DEFAULT '{}'::jsonb,
	"deployed_at" timestamp,
	"last_sync" timestamp,
	"last_update" timestamp,
	"health_status" varchar(20) DEFAULT 'healthy',
	"uptime" real DEFAULT 1,
	"is_auto_update_enabled" boolean DEFAULT true,
	"sync_frequency" varchar(20) DEFAULT 'daily',
	"backup_strategy" varchar(30) DEFAULT 'automated',
	"last_backup" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "franchise_instances_franchise_slug_unique" UNIQUE("franchise_slug")
);
--> statement-breakpoint
CREATE TABLE "franchise_management_dashboard" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dashboard_name" varchar(100) NOT NULL,
	"dashboard_type" varchar(50) DEFAULT 'overview',
	"owner_id" text,
	"access_level" varchar(20) DEFAULT 'admin',
	"dashboard_config" jsonb NOT NULL,
	"widgets" jsonb DEFAULT '[]'::jsonb,
	"filters" jsonb DEFAULT '{}'::jsonb,
	"alert_rules" jsonb DEFAULT '[]'::jsonb,
	"report_schedule" jsonb DEFAULT '{}'::jsonb,
	"is_default" boolean DEFAULT false,
	"is_public" boolean DEFAULT false,
	"share_token" varchar(100),
	"last_accessed" timestamp,
	"access_count" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opportunity_name" varchar(100) NOT NULL,
	"region" varchar(100) NOT NULL,
	"country" varchar(100),
	"market_size" real,
	"competition_level" varchar(20) DEFAULT 'medium',
	"entry_barriers" text[],
	"revenue_projection" real,
	"investment_required" real,
	"roi" real,
	"risk_score" real,
	"demographic_fit" real,
	"priority" integer DEFAULT 5,
	"is_active" boolean DEFAULT true,
	"analysis_date" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "franchise_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_name" varchar(100) NOT NULL,
	"template_type" varchar(50) NOT NULL,
	"source_neuron_id" text,
	"source_module_id" text,
	"description" text NOT NULL,
	"category" varchar(50),
	"complexity" varchar(20) DEFAULT 'medium',
	"estimated_value" real,
	"required_resources" jsonb DEFAULT '{}'::jsonb,
	"dependencies" text[],
	"supported_regions" text[],
	"supported_languages" text[],
	"template_structure" jsonb NOT NULL,
	"code_templates" jsonb DEFAULT '{}'::jsonb,
	"content_templates" jsonb DEFAULT '{}'::jsonb,
	"config_templates" jsonb DEFAULT '{}'::jsonb,
	"deployment_instructions" text,
	"migration_steps" jsonb DEFAULT '[]'::jsonb,
	"testing_checklist" jsonb DEFAULT '[]'::jsonb,
	"performance_metrics" jsonb DEFAULT '{}'::jsonb,
	"success_criteria" jsonb DEFAULT '{}'::jsonb,
	"last_used" timestamp,
	"usage_count" integer DEFAULT 0,
	"average_setup_time" integer,
	"success_rate" real DEFAULT 1,
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT false,
	"version" varchar(20) DEFAULT '1.0.0',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "franchise_templates_template_name_unique" UNIQUE("template_name")
);
--> statement-breakpoint
CREATE TABLE "franchise_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"update_name" varchar(100) NOT NULL,
	"update_type" varchar(50) NOT NULL,
	"update_scope" varchar(50) NOT NULL,
	"source_neuron_id" text,
	"template_ids" text[],
	"target_franchise_ids" text[],
	"update_content" jsonb NOT NULL,
	"update_instructions" text,
	"pre_conditions" jsonb DEFAULT '[]'::jsonb,
	"post_conditions" jsonb DEFAULT '[]'::jsonb,
	"testing_required" boolean DEFAULT true,
	"approval_required" boolean DEFAULT false,
	"rollback_plan" jsonb DEFAULT '{}'::jsonb,
	"update_priority" varchar(20) DEFAULT 'medium',
	"scheduled_at" timestamp,
	"batch_size" integer DEFAULT 10,
	"batch_delay" integer DEFAULT 300,
	"update_status" varchar(30) DEFAULT 'pending',
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"skip_count" integer DEFAULT 0,
	"update_logs" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"estimated_duration" integer,
	"actual_duration" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "autonomic_decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"decision_id" varchar(50) NOT NULL,
	"decision_type" varchar(50) NOT NULL,
	"context_data" jsonb NOT NULL,
	"decision_rules" jsonb NOT NULL,
	"system_state" jsonb NOT NULL,
	"decision" text NOT NULL,
	"confidence" real NOT NULL,
	"reasoning" text[],
	"alternatives" text[],
	"expected_outcome" jsonb NOT NULL,
	"actual_outcome" jsonb,
	"risk_assessment" real,
	"implementation_plan" text[],
	"rollback_plan" jsonb DEFAULT '{}'::jsonb,
	"implementation_status" varchar(30) DEFAULT 'pending',
	"started_at" timestamp,
	"completed_at" timestamp,
	"validated_at" timestamp,
	"performance_impact" real,
	"user_feedback" varchar(20),
	"feedback_details" jsonb DEFAULT '{}'::jsonb,
	"learned_patterns" jsonb DEFAULT '{}'::jsonb,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "autonomic_decisions_decision_id_unique" UNIQUE("decision_id")
);
--> statement-breakpoint
CREATE TABLE "empire_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_name" varchar(100) NOT NULL,
	"metric_type" varchar(30) NOT NULL,
	"metric_value" real NOT NULL,
	"metric_unit" varchar(20),
	"dimension1" varchar(100),
	"dimension2" varchar(100),
	"dimension3" varchar(100),
	"time_granularity" varchar(20) DEFAULT 'hourly',
	"aggregation_type" varchar(20) DEFAULT 'sum',
	"metric_source" varchar(50) NOT NULL,
	"calculation_method" text,
	"is_real_time" boolean DEFAULT false,
	"alert_threshold" real,
	"alert_direction" varchar(10),
	"is_anomalous" boolean DEFAULT false,
	"anomaly_score" real,
	"trend" varchar(20),
	"seasonality" jsonb DEFAULT '{}'::jsonb,
	"correlated_metrics" text[],
	"business_impact" real,
	"recorded_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "empire_brain_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"config_key" varchar(100) NOT NULL,
	"config_value" jsonb NOT NULL,
	"config_type" varchar(30) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"requires_restart" boolean DEFAULT false,
	"validation_rules" jsonb DEFAULT '{}'::jsonb,
	"default_value" jsonb,
	"last_modified_by" varchar(100),
	"environment_scope" varchar(20) DEFAULT 'all',
	"feature_flag" varchar(50),
	"experiment_id" varchar(50),
	"rollout_percentage" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "empire_brain_config_config_key_unique" UNIQUE("config_key")
);
--> statement-breakpoint
CREATE TABLE "empire_intelligence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"analysis_type" varchar(50) NOT NULL,
	"analysis_data" jsonb NOT NULL,
	"insights" jsonb DEFAULT '[]'::jsonb,
	"recommendations" jsonb DEFAULT '[]'::jsonb,
	"confidence" real NOT NULL,
	"actionable" boolean DEFAULT false,
	"priority" integer DEFAULT 5,
	"processed_by" varchar(50),
	"processing_time" integer,
	"tokens_used" integer,
	"status" varchar(30) DEFAULT 'pending',
	"implementation_plan" jsonb DEFAULT '[]'::jsonb,
	"expected_outcome" jsonb DEFAULT '{}'::jsonb,
	"actual_outcome" jsonb,
	"success_metrics" jsonb DEFAULT '{}'::jsonb,
	"validated_at" timestamp,
	"expires_at" timestamp,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "empire_vector_memory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memory_id" varchar(50) NOT NULL,
	"memory_type" varchar(50) NOT NULL,
	"memory_content" text NOT NULL,
	"vector_embedding" jsonb NOT NULL,
	"embedding_model" varchar(50) DEFAULT 'text-embedding-3-large',
	"memory_source" varchar(50) NOT NULL,
	"context_tags" text[],
	"importance_score" real NOT NULL,
	"access_frequency" integer DEFAULT 0,
	"last_accessed_at" timestamp,
	"memory_age" integer,
	"decay_rate" real DEFAULT 0.01,
	"refresh_count" integer DEFAULT 0,
	"last_refreshed_at" timestamp,
	"related_memories" text[],
	"similarity_threshold" real DEFAULT 0.85,
	"cluster_id" varchar(50),
	"cluster_weight" real,
	"is_active" boolean DEFAULT true,
	"is_archived" boolean DEFAULT false,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "empire_vector_memory_memory_id_unique" UNIQUE("memory_id")
);
--> statement-breakpoint
CREATE TABLE "intelligence_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_name" varchar(100) NOT NULL,
	"request_type" varchar(50) NOT NULL,
	"required_capabilities" text[],
	"preferred_providers" text[],
	"fallback_providers" text[],
	"routing_rules" jsonb NOT NULL,
	"load_balancing" varchar(20) DEFAULT 'priority',
	"timeout_ms" integer DEFAULT 30000,
	"retry_attempts" integer DEFAULT 3,
	"retry_delay" integer DEFAULT 1000,
	"cache_enabled" boolean DEFAULT true,
	"cache_ttl" integer DEFAULT 3600,
	"rate_limit_enabled" boolean DEFAULT true,
	"success_count" integer DEFAULT 0,
	"failure_count" integer DEFAULT 0,
	"avg_response_time" integer,
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "intent_graphs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"graph_id" varchar(50) NOT NULL,
	"source_intent" varchar(100) NOT NULL,
	"target_intent" varchar(100) NOT NULL,
	"transition_weight" real NOT NULL,
	"transition_conditions" jsonb DEFAULT '{}'::jsonb,
	"expected_outcomes" jsonb DEFAULT '{}'::jsonb,
	"actual_outcomes" jsonb DEFAULT '{}'::jsonb,
	"success_rate" real,
	"transition_count" integer DEFAULT 0,
	"last_transition" timestamp,
	"avg_transition_time" integer,
	"conversion_rate" real,
	"revenue_impact" real,
	"user_segments" text[],
	"context_requirements" jsonb DEFAULT '{}'::jsonb,
	"optimization_history" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"confidence" real,
	"last_optimized" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "intent_graphs_graph_id_unique" UNIQUE("graph_id")
);
--> statement-breakpoint
CREATE TABLE "llm_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_name" varchar(50) NOT NULL,
	"model_name" varchar(100) NOT NULL,
	"api_endpoint" text,
	"capabilities" text[],
	"specialties" text[],
	"quota_limit" integer,
	"current_usage" integer DEFAULT 0,
	"reset_at" timestamp,
	"cost_per_token" real,
	"avg_latency" integer,
	"reliability_score" real,
	"priority" integer DEFAULT 5,
	"is_active" boolean DEFAULT true,
	"health_status" varchar(20) DEFAULT 'healthy',
	"last_health_check" timestamp,
	"failure_count" integer DEFAULT 0,
	"success_count" integer DEFAULT 0,
	"config_settings" jsonb DEFAULT '{}'::jsonb,
	"rate_limit" integer,
	"current_rate_usage" integer DEFAULT 0,
	"rate_limit_reset_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "llm_providers_provider_name_unique" UNIQUE("provider_name")
);
--> statement-breakpoint
CREATE TABLE "rlhf_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feedback_id" varchar(50) NOT NULL,
	"session_id" varchar(100),
	"user_id" varchar(100),
	"action_taken" text NOT NULL,
	"action_context" jsonb NOT NULL,
	"action_outcome" jsonb NOT NULL,
	"user_feedback" varchar(20) NOT NULL,
	"feedback_type" varchar(30) DEFAULT 'explicit',
	"feedback_details" jsonb DEFAULT '{}'::jsonb,
	"feedback_weight" real NOT NULL,
	"confidence" real,
	"context_data" jsonb NOT NULL,
	"environment_data" jsonb DEFAULT '{}'::jsonb,
	"time_to_feedback" integer,
	"feedback_quality" real,
	"processed" boolean DEFAULT false,
	"processed_at" timestamp,
	"learning_applied" boolean DEFAULT false,
	"applied_at" timestamp,
	"behavior_changes" jsonb DEFAULT '{}'::jsonb,
	"related_feedback" text[],
	"feedback_trend" varchar(20),
	"impact_measured" boolean DEFAULT false,
	"impact_results" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "rlhf_feedback_feedback_id_unique" UNIQUE("feedback_id")
);
--> statement-breakpoint
CREATE TABLE "system_mutations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mutation_id" varchar(50) NOT NULL,
	"mutation_type" varchar(50) NOT NULL,
	"target_system" varchar(100) NOT NULL,
	"target_component" varchar(100),
	"original_state" jsonb NOT NULL,
	"mutated_state" jsonb NOT NULL,
	"mutation_reason" text NOT NULL,
	"expected_impact" jsonb NOT NULL,
	"actual_impact" jsonb,
	"rollback_plan" jsonb NOT NULL,
	"testing_strategy" text[],
	"validation_criteria" jsonb DEFAULT '{}'::jsonb,
	"mutation_status" varchar(30) DEFAULT 'pending',
	"confidence" real,
	"risk_level" varchar(20) DEFAULT 'medium',
	"approval_required" boolean DEFAULT false,
	"approved_by" varchar(100),
	"approved_at" timestamp,
	"executed_at" timestamp,
	"completed_at" timestamp,
	"rolled_back_at" timestamp,
	"performance_impact" real,
	"user_impact" real,
	"business_impact" real,
	"failure_reason" text,
	"learned_insights" jsonb DEFAULT '{}'::jsonb,
	"related_mutations" text[],
	"is_reversible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "system_mutations_mutation_id_unique" UNIQUE("mutation_id")
);
--> statement-breakpoint
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_offer_id_affiliate_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."affiliate_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_offers" ADD CONSTRAINT "affiliate_offers_network_id_affiliate_networks_id_fk" FOREIGN KEY ("network_id") REFERENCES "public"."affiliate_networks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_global_user_id_global_user_profiles_id_fk" FOREIGN KEY ("global_user_id") REFERENCES "public"."global_user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_sync_status" ADD CONSTRAINT "analytics_sync_status_global_user_id_global_user_profiles_id_fk" FOREIGN KEY ("global_user_id") REFERENCES "public"."global_user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_neuron_analytics" ADD CONSTRAINT "api_neuron_analytics_neuron_id_api_only_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."api_only_neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_neuron_commands" ADD CONSTRAINT "api_neuron_commands_neuron_id_api_only_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."api_only_neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_neuron_heartbeats" ADD CONSTRAINT "api_neuron_heartbeats_neuron_id_api_only_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."api_only_neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_fingerprints" ADD CONSTRAINT "device_fingerprints_global_user_id_global_user_profiles_id_fk" FOREIGN KEY ("global_user_id") REFERENCES "public"."global_user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_campaigns" ADD CONSTRAINT "email_campaigns_lead_magnet_id_lead_magnets_id_fk" FOREIGN KEY ("lead_magnet_id") REFERENCES "public"."lead_magnets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_events" ADD CONSTRAINT "experiment_events_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_events" ADD CONSTRAINT "experiment_events_variant_id_experiment_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."experiment_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_variant_id_experiment_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."experiment_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiment_variants" ADD CONSTRAINT "experiment_variants_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_experiments" ADD CONSTRAINT "funnel_experiments_blueprint_id_funnel_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."funnel_blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_instances" ADD CONSTRAINT "funnel_instances_blueprint_id_funnel_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."funnel_blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_lifecycle_integrations" ADD CONSTRAINT "funnel_lifecycle_integrations_blueprint_id_funnel_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."funnel_blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_optimizations" ADD CONSTRAINT "funnel_optimizations_blueprint_id_funnel_blueprints_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."funnel_blueprints"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_capture_id_lead_captures_id_fk" FOREIGN KEY ("lead_capture_id") REFERENCES "public"."lead_captures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_captures" ADD CONSTRAINT "lead_captures_lead_form_id_lead_forms_id_fk" FOREIGN KEY ("lead_form_id") REFERENCES "public"."lead_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_captures" ADD CONSTRAINT "lead_captures_lead_magnet_id_lead_magnets_id_fk" FOREIGN KEY ("lead_magnet_id") REFERENCES "public"."lead_magnets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_experiments" ADD CONSTRAINT "lead_experiments_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_experiments" ADD CONSTRAINT "lead_experiments_lead_form_id_lead_forms_id_fk" FOREIGN KEY ("lead_form_id") REFERENCES "public"."lead_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_experiments" ADD CONSTRAINT "lead_experiments_variant_id_experiment_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."experiment_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_form_assignments" ADD CONSTRAINT "lead_form_assignments_lead_form_id_lead_forms_id_fk" FOREIGN KEY ("lead_form_id") REFERENCES "public"."lead_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_forms" ADD CONSTRAINT "lead_forms_lead_magnet_id_lead_magnets_id_fk" FOREIGN KEY ("lead_magnet_id") REFERENCES "public"."lead_magnets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ml_predictions" ADD CONSTRAINT "ml_predictions_model_id_ml_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ml_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_performance_tracking" ADD CONSTRAINT "model_performance_tracking_model_id_ml_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."ml_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neuron_analytics" ADD CONSTRAINT "neuron_analytics_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neuron_configs" ADD CONSTRAINT "neuron_configs_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neuron_status_updates" ADD CONSTRAINT "neuron_status_updates_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_affiliate_assignments" ADD CONSTRAINT "page_affiliate_assignments_offer_id_affiliate_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."affiliate_offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_bridge" ADD CONSTRAINT "session_bridge_global_user_id_global_user_profiles_id_fk" FOREIGN KEY ("global_user_id") REFERENCES "public"."global_user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_experiment_assignments" ADD CONSTRAINT "user_experiment_assignments_experiment_id_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_experiment_assignments" ADD CONSTRAINT "user_experiment_assignments_variant_id_experiment_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."experiment_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile_merge_history" ADD CONSTRAINT "user_profile_merge_history_master_profile_id_global_user_profiles_id_fk" FOREIGN KEY ("master_profile_id") REFERENCES "public"."global_user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "localized_content_assignments" ADD CONSTRAINT "localized_content_assignments_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_key_id_translation_keys_id_fk" FOREIGN KEY ("key_id") REFERENCES "public"."translation_keys"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_language_preferences" ADD CONSTRAINT "user_language_preferences_preferred_language_languages_code_fk" FOREIGN KEY ("preferred_language") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_comparisons" ADD CONSTRAINT "saas_comparisons_tool_a_saas_tools_id_fk" FOREIGN KEY ("tool_a") REFERENCES "public"."saas_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_comparisons" ADD CONSTRAINT "saas_comparisons_tool_b_saas_tools_id_fk" FOREIGN KEY ("tool_b") REFERENCES "public"."saas_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_deals" ADD CONSTRAINT "saas_deals_tool_id_saas_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."saas_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saas_reviews" ADD CONSTRAINT "saas_reviews_tool_id_saas_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."saas_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_content_performance" ADD CONSTRAINT "health_content_performance_content_id_health_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."health_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_quest_completions" ADD CONSTRAINT "health_quest_completions_quest_id_health_daily_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."health_daily_quests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_quiz_results" ADD CONSTRAINT "health_quiz_results_quiz_id_health_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."health_quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_tool_sessions" ADD CONSTRAINT "health_tool_sessions_tool_id_health_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."health_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_progress" ADD CONSTRAINT "education_progress_path_id_education_paths_id_fk" FOREIGN KEY ("path_id") REFERENCES "public"."education_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_progress" ADD CONSTRAINT "education_progress_content_id_education_content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."education_content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_progress" ADD CONSTRAINT "education_progress_quiz_id_education_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."education_quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_quest_completions" ADD CONSTRAINT "education_quest_completions_quest_id_education_daily_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."education_daily_quests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_quiz_results" ADD CONSTRAINT "education_quiz_results_quiz_id_education_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."education_quizzes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education_tool_sessions" ADD CONSTRAINT "education_tool_sessions_tool_id_education_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."education_tools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graph_analytics" ADD CONSTRAINT "graph_analytics_node_id_semantic_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graph_analytics" ADD CONSTRAINT "graph_analytics_edge_id_semantic_edges_id_fk" FOREIGN KEY ("edge_id") REFERENCES "public"."semantic_edges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graph_audit_results" ADD CONSTRAINT "graph_audit_results_node_id_semantic_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "graph_audit_results" ADD CONSTRAINT "graph_audit_results_edge_id_semantic_edges_id_fk" FOREIGN KEY ("edge_id") REFERENCES "public"."semantic_edges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "realtime_recommendations" ADD CONSTRAINT "realtime_recommendations_node_id_semantic_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semantic_edges" ADD CONSTRAINT "semantic_edges_from_node_id_semantic_nodes_id_fk" FOREIGN KEY ("from_node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "semantic_edges" ADD CONSTRAINT "semantic_edges_to_node_id_semantic_nodes_id_fk" FOREIGN KEY ("to_node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_similarity_index" ADD CONSTRAINT "vector_similarity_index_node_id_semantic_nodes_id_fk" FOREIGN KEY ("node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_similarity_index" ADD CONSTRAINT "vector_similarity_index_similar_node_id_semantic_nodes_id_fk" FOREIGN KEY ("similar_node_id") REFERENCES "public"."semantic_nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_embeddings" ADD CONSTRAINT "vector_embeddings_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_indexing_jobs" ADD CONSTRAINT "vector_indexing_jobs_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_recommendations" ADD CONSTRAINT "vector_recommendations_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_search_analytics" ADD CONSTRAINT "vector_search_analytics_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_search_queries" ADD CONSTRAINT "vector_search_queries_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vector_similarity_cache" ADD CONSTRAINT "vector_similarity_cache_model_id_vector_embedding_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."vector_embedding_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "neuron_offer_assignments" ADD CONSTRAINT "neuron_offer_assignments_offer_id_offer_feed_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_ai_optimization_queue" ADD CONSTRAINT "offer_ai_optimization_queue_offer_id_offer_feed_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_analytics" ADD CONSTRAINT "offer_analytics_offer_id_offer_feed_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offer_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_feed" ADD CONSTRAINT "offer_feed_source_id_offer_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."offer_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_sync_history" ADD CONSTRAINT "offer_sync_history_source_id_offer_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."offer_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_analytics" ADD CONSTRAINT "notification_analytics_template_id_notification_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."notification_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_analytics" ADD CONSTRAINT "notification_analytics_trigger_id_notification_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."notification_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_analytics" ADD CONSTRAINT "notification_analytics_campaign_id_notification_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."notification_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_analytics" ADD CONSTRAINT "notification_analytics_queue_id_notification_queue_id_fk" FOREIGN KEY ("queue_id") REFERENCES "public"."notification_queue"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_template_id_notification_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."notification_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_trigger_id_notification_triggers_id_fk" FOREIGN KEY ("trigger_id") REFERENCES "public"."notification_triggers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_queue" ADD CONSTRAINT "notification_queue_campaign_id_notification_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."notification_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_personalization" ADD CONSTRAINT "push_personalization_subscription_id_push_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."push_subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_ab_tests" ADD CONSTRAINT "funnel_ab_tests_funnel_id_funnel_templates_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."funnel_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_analytics" ADD CONSTRAINT "funnel_analytics_funnel_id_funnel_templates_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."funnel_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_events" ADD CONSTRAINT "funnel_events_funnel_session_id_user_funnel_sessions_id_fk" FOREIGN KEY ("funnel_session_id") REFERENCES "public"."user_funnel_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funnel_triggers" ADD CONSTRAINT "funnel_triggers_funnel_id_funnel_templates_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."funnel_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_funnel_sessions" ADD CONSTRAINT "user_funnel_sessions_funnel_id_funnel_templates_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."funnel_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "codex_fixes" ADD CONSTRAINT "codex_fixes_issue_id_codex_issues_id_fk" FOREIGN KEY ("issue_id") REFERENCES "public"."codex_issues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "codex_issues" ADD CONSTRAINT "codex_issues_audit_id_codex_audits_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."codex_audits"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed" ADD CONSTRAINT "content_feed_source_id_content_feed_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_feed_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_analytics" ADD CONSTRAINT "content_feed_analytics_content_id_content_feed_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_interactions" ADD CONSTRAINT "content_feed_interactions_content_id_content_feed_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_notifications" ADD CONSTRAINT "content_feed_notifications_content_id_content_feed_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_feed"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_notifications" ADD CONSTRAINT "content_feed_notifications_source_id_content_feed_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_feed_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_rules" ADD CONSTRAINT "content_feed_rules_source_id_content_feed_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_feed_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_feed_sync_logs" ADD CONSTRAINT "content_feed_sync_logs_source_id_content_feed_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_feed_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_alert_history" ADD CONSTRAINT "api_alert_history_rule_id_api_monitoring_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."api_monitoring_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_alert_history" ADD CONSTRAINT "api_alert_history_diff_id_api_diffs_id_fk" FOREIGN KEY ("diff_id") REFERENCES "public"."api_diffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_change_events" ADD CONSTRAINT "api_change_events_diff_id_api_diffs_id_fk" FOREIGN KEY ("diff_id") REFERENCES "public"."api_diffs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_diffs" ADD CONSTRAINT "api_diffs_from_snapshot_id_api_schema_snapshots_id_fk" FOREIGN KEY ("from_snapshot_id") REFERENCES "public"."api_schema_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_diffs" ADD CONSTRAINT "api_diffs_to_snapshot_id_api_schema_snapshots_id_fk" FOREIGN KEY ("to_snapshot_id") REFERENCES "public"."api_schema_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_endpoints" ADD CONSTRAINT "api_endpoints_snapshot_id_api_schema_snapshots_id_fk" FOREIGN KEY ("snapshot_id") REFERENCES "public"."api_schema_snapshots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_rollback_operations" ADD CONSTRAINT "api_rollback_operations_version_history_id_api_version_history_id_fk" FOREIGN KEY ("version_history_id") REFERENCES "public"."api_version_history"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout_ab_tests" ADD CONSTRAINT "layout_ab_tests_template_id_layout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."layout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout_analytics" ADD CONSTRAINT "layout_analytics_instance_id_layout_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."layout_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout_analytics" ADD CONSTRAINT "layout_analytics_template_id_layout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."layout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout_instances" ADD CONSTRAINT "layout_instances_template_id_layout_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."layout_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout_mutations" ADD CONSTRAINT "layout_mutations_instance_id_layout_instances_id_fk" FOREIGN KEY ("instance_id") REFERENCES "public"."layout_instances"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auto_scaling_events" ADD CONSTRAINT "auto_scaling_events_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failover_events" ADD CONSTRAINT "failover_events_from_region_regions_id_fk" FOREIGN KEY ("from_region") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "failover_events" ADD CONSTRAINT "failover_events_to_region_regions_id_fk" FOREIGN KEY ("to_region") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_health" ADD CONSTRAINT "region_health_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "routing_decisions" ADD CONSTRAINT "routing_decisions_selected_region_regions_id_fk" FOREIGN KEY ("selected_region") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profit_forecasts" ADD CONSTRAINT "profit_forecasts_model_id_profit_forecast_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."profit_forecast_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_split_analytics" ADD CONSTRAINT "revenue_split_analytics_partner_id_revenue_split_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."revenue_split_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_split_payouts" ADD CONSTRAINT "revenue_split_payouts_partner_id_revenue_split_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."revenue_split_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_split_rules" ADD CONSTRAINT "revenue_split_rules_partner_id_revenue_split_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."revenue_split_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_split_transactions" ADD CONSTRAINT "revenue_split_transactions_partner_id_revenue_split_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."revenue_split_partners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revenue_split_transactions" ADD CONSTRAINT "revenue_split_transactions_rule_id_revenue_split_rules_id_fk" FOREIGN KEY ("rule_id") REFERENCES "public"."revenue_split_rules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_analytics" ADD CONSTRAINT "federation_analytics_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_conflicts" ADD CONSTRAINT "federation_conflicts_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_health_checks" ADD CONSTRAINT "federation_health_checks_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_hot_reloads" ADD CONSTRAINT "federation_hot_reloads_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_migrations" ADD CONSTRAINT "federation_migrations_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "federation_security_tokens" ADD CONSTRAINT "federation_security_tokens_neuron_id_neurons_neuron_id_fk" FOREIGN KEY ("neuron_id") REFERENCES "public"."neurons"("neuron_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backlink_outreach" ADD CONSTRAINT "backlink_outreach_opportunity_id_backlink_opportunities_id_fk" FOREIGN KEY ("opportunity_id") REFERENCES "public"."backlink_opportunities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_swarm_posts" ADD CONSTRAINT "blog_swarm_posts_site_id_blog_swarm_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."blog_swarm_sites"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_viral_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."viral_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_generation" ADD CONSTRAINT "content_generation_template_id_content_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."content_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_performance" ADD CONSTRAINT "content_performance_content_id_content_generation_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_generation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_remix_distribution" ADD CONSTRAINT "content_remix_distribution_project_id_content_remix_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."content_remix_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_funnel_id_conversion_funnels_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."conversion_funnels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_events" ADD CONSTRAINT "conversion_events_experiment_id_conversion_experiments_id_fk" FOREIGN KEY ("experiment_id") REFERENCES "public"."conversion_experiments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversion_experiments" ADD CONSTRAINT "conversion_experiments_funnel_id_conversion_funnels_id_fk" FOREIGN KEY ("funnel_id") REFERENCES "public"."conversion_funnels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_visualization_stats" ADD CONSTRAINT "data_visualization_stats_project_id_data_visualization_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."data_visualization_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_categories" ADD CONSTRAINT "forum_categories_parent_id_forum_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forum_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_topic_id_forum_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_parent_id_forum_replies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."forum_replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_topics" ADD CONSTRAINT "forum_topics_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_links" ADD CONSTRAINT "referral_links_program_id_referral_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."referral_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_transactions" ADD CONSTRAINT "referral_transactions_link_id_referral_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."referral_links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referral_transactions" ADD CONSTRAINT "referral_transactions_program_id_referral_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."referral_programs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_categories" ADD CONSTRAINT "resource_categories_parent_id_resource_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resource_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_directory" ADD CONSTRAINT "resource_directory_category_id_resource_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."resource_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scraped_content" ADD CONSTRAINT "scraped_content_source_id_content_scraping_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."content_scraping_sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_engagement" ADD CONSTRAINT "social_media_engagement_post_id_social_media_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."social_media_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_posts" ADD CONSTRAINT "social_media_posts_account_id_social_media_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."social_media_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_media_posts" ADD CONSTRAINT "social_media_posts_content_id_content_generation_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_generation"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget_embeds" ADD CONSTRAINT "widget_embeds_widget_id_public_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."public_widgets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_rewards_agent_idx" ON "agent_rewards" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "agent_rewards_task_idx" ON "agent_rewards" USING btree ("task_type");--> statement-breakpoint
CREATE INDEX "agent_rewards_performance_idx" ON "agent_rewards" USING btree ("performance_score");--> statement-breakpoint
CREATE INDEX "agent_rewards_rank_idx" ON "agent_rewards" USING btree ("current_rank");--> statement-breakpoint
CREATE INDEX "federation_rlhf_source_idx" ON "federation_rlhf_sync" USING btree ("source_neuron");--> statement-breakpoint
CREATE INDEX "federation_rlhf_type_idx" ON "federation_rlhf_sync" USING btree ("sync_type");--> statement-breakpoint
CREATE INDEX "federation_rlhf_status_idx" ON "federation_rlhf_sync" USING btree ("status");--> statement-breakpoint
CREATE INDEX "federation_rlhf_priority_idx" ON "federation_rlhf_sync" USING btree ("priority_level");--> statement-breakpoint
CREATE INDEX "funnel_blueprints_vertical_idx" ON "funnel_blueprints" USING btree ("vertical");--> statement-breakpoint
CREATE INDEX "funnel_blueprints_type_idx" ON "funnel_blueprints" USING btree ("type");--> statement-breakpoint
CREATE INDEX "funnel_blueprints_status_idx" ON "funnel_blueprints" USING btree ("status");--> statement-breakpoint
CREATE INDEX "funnel_experiments_blueprint_idx" ON "funnel_experiments" USING btree ("blueprint_id");--> statement-breakpoint
CREATE INDEX "funnel_experiments_status_idx" ON "funnel_experiments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "funnel_instances_session_idx" ON "funnel_instances" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "funnel_instances_user_idx" ON "funnel_instances" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "funnel_instances_blueprint_idx" ON "funnel_instances" USING btree ("blueprint_id");--> statement-breakpoint
CREATE INDEX "funnel_instances_status_idx" ON "funnel_instances" USING btree ("status");--> statement-breakpoint
CREATE INDEX "funnel_lifecycle_integrations_blueprint_idx" ON "funnel_lifecycle_integrations" USING btree ("blueprint_id");--> statement-breakpoint
CREATE INDEX "funnel_lifecycle_integrations_type_idx" ON "funnel_lifecycle_integrations" USING btree ("integration_type");--> statement-breakpoint
CREATE INDEX "funnel_optimizations_blueprint_idx" ON "funnel_optimizations" USING btree ("blueprint_id");--> statement-breakpoint
CREATE INDEX "funnel_optimizations_status_idx" ON "funnel_optimizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "funnel_optimizations_type_idx" ON "funnel_optimizations" USING btree ("optimization_type");--> statement-breakpoint
CREATE INDEX "persona_evolution_type_idx" ON "persona_evolution" USING btree ("evolution_type");--> statement-breakpoint
CREATE INDEX "persona_evolution_source_idx" ON "persona_evolution" USING btree ("source_persona");--> statement-breakpoint
CREATE INDEX "persona_evolution_status_idx" ON "persona_evolution" USING btree ("validation_status");--> statement-breakpoint
CREATE INDEX "persona_evolution_strength_idx" ON "persona_evolution" USING btree ("evolution_strength");--> statement-breakpoint
CREATE INDEX "persona_profiles_user_idx" ON "persona_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "persona_profiles_session_idx" ON "persona_profiles" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "persona_profiles_primary_idx" ON "persona_profiles" USING btree ("primary_persona");--> statement-breakpoint
CREATE INDEX "persona_profiles_confidence_idx" ON "persona_profiles" USING btree ("confidence_level");--> statement-breakpoint
CREATE INDEX "persona_simulations_type_idx" ON "persona_simulations" USING btree ("simulation_type");--> statement-breakpoint
CREATE INDEX "persona_simulations_persona_idx" ON "persona_simulations" USING btree ("target_persona");--> statement-breakpoint
CREATE INDEX "persona_simulations_status_idx" ON "persona_simulations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rlhf_training_type_idx" ON "rlhf_training_sessions" USING btree ("training_type");--> statement-breakpoint
CREATE INDEX "rlhf_training_status_idx" ON "rlhf_training_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rlhf_training_completed_idx" ON "rlhf_training_sessions" USING btree ("completed_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_edge_idx" ON "semantic_edges" USING btree ("from_node_id","to_node_id","edge_type");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_similarity_idx" ON "vector_similarity_index" USING btree ("node_id","similar_node_id");--> statement-breakpoint
CREATE INDEX "content_id_idx" ON "vector_embeddings" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "content_type_idx" ON "vector_embeddings" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "model_id_idx" ON "vector_embeddings" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "neuron_id_idx" ON "vector_embeddings" USING btree ("neuron_id");--> statement-breakpoint
CREATE INDEX "content_hash_idx" ON "vector_embeddings" USING btree ("content_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_content_model_idx" ON "vector_embeddings" USING btree ("content_id","model_id");--> statement-breakpoint
CREATE INDEX "job_status_idx" ON "vector_indexing_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_priority_idx" ON "vector_indexing_jobs" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "job_scheduled_at_idx" ON "vector_indexing_jobs" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "job_content_id_idx" ON "vector_indexing_jobs" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "job_batch_id_idx" ON "vector_indexing_jobs" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "migration_type_idx" ON "vector_migration_log" USING btree ("migration_type");--> statement-breakpoint
CREATE INDEX "migration_status_idx" ON "vector_migration_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX "migration_started_at_idx" ON "vector_migration_log" USING btree ("started_at");--> statement-breakpoint
CREATE INDEX "rec_user_id_idx" ON "vector_recommendations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "rec_session_id_idx" ON "vector_recommendations" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "recommendation_type_idx" ON "vector_recommendations" USING btree ("recommendation_type");--> statement-breakpoint
CREATE INDEX "recommendation_score_idx" ON "vector_recommendations" USING btree ("score");--> statement-breakpoint
CREATE INDEX "is_served_idx" ON "vector_recommendations" USING btree ("is_served");--> statement-breakpoint
CREATE INDEX "rec_created_at_idx" ON "vector_recommendations" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "analytics_date_idx" ON "vector_search_analytics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "analytics_model_id_idx" ON "vector_search_analytics" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "analytics_neuron_id_idx" ON "vector_search_analytics" USING btree ("neuron_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_date_model_analytics_idx" ON "vector_search_analytics" USING btree ("date","hour","model_id","search_type");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "vector_search_queries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_id_idx" ON "vector_search_queries" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "search_type_idx" ON "vector_search_queries" USING btree ("search_type");--> statement-breakpoint
CREATE INDEX "query_model_id_idx" ON "vector_search_queries" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX "query_created_at_idx" ON "vector_search_queries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "source_content_id_idx" ON "vector_similarity_cache" USING btree ("source_content_id");--> statement-breakpoint
CREATE INDEX "target_content_id_idx" ON "vector_similarity_cache" USING btree ("target_content_id");--> statement-breakpoint
CREATE INDEX "similarity_idx" ON "vector_similarity_cache" USING btree ("similarity");--> statement-breakpoint
CREATE INDEX "cache_model_id_idx" ON "vector_similarity_cache" USING btree ("model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_similarity_cache_idx" ON "vector_similarity_cache" USING btree ("source_content_id","target_content_id","model_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_analytics_idx" ON "notification_analytics" USING btree ("template_id","channel","date","hour");--> statement-breakpoint
CREATE UNIQUE INDEX "user_channel_queue_idx" ON "notification_queue" USING btree ("user_id","channel","scheduled_for");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_preferences_idx" ON "user_notification_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "fed_sync_source_idx" ON "federation_memory_sync" USING btree ("source_neuron");--> statement-breakpoint
CREATE INDEX "fed_sync_target_idx" ON "federation_memory_sync" USING btree ("target_neuron");--> statement-breakpoint
CREATE INDEX "fed_sync_status_idx" ON "federation_memory_sync" USING btree ("sync_status");--> statement-breakpoint
CREATE INDEX "fed_sync_timestamp_idx" ON "federation_memory_sync" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "kg_versions_node_idx" ON "knowledge_graph_versions" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "kg_versions_timestamp_idx" ON "knowledge_graph_versions" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "kg_versions_approval_idx" ON "knowledge_graph_versions" USING btree ("approval_status");--> statement-breakpoint
CREATE INDEX "memory_edges_source_idx" ON "memory_edges" USING btree ("source_node_id");--> statement-breakpoint
CREATE INDEX "memory_edges_target_idx" ON "memory_edges" USING btree ("target_node_id");--> statement-breakpoint
CREATE INDEX "memory_edges_relationship_idx" ON "memory_edges" USING btree ("relationship_type");--> statement-breakpoint
CREATE INDEX "memory_edges_strength_idx" ON "memory_edges" USING btree ("strength");--> statement-breakpoint
CREATE INDEX "memory_nodes_slug_idx" ON "memory_nodes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "memory_nodes_type_idx" ON "memory_nodes" USING btree ("node_type");--> statement-breakpoint
CREATE INDEX "memory_nodes_embedding_idx" ON "memory_nodes" USING btree ("embedding");--> statement-breakpoint
CREATE INDEX "memory_nodes_usage_idx" ON "memory_nodes" USING btree ("usage_count");--> statement-breakpoint
CREATE INDEX "memory_nodes_quality_idx" ON "memory_nodes" USING btree ("quality_score");--> statement-breakpoint
CREATE INDEX "memory_search_query_idx" ON "memory_search_sessions" USING btree ("query");--> statement-breakpoint
CREATE INDEX "memory_search_timestamp_idx" ON "memory_search_sessions" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "memory_search_user_idx" ON "memory_search_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "memory_usage_node_idx" ON "memory_usage_analytics" USING btree ("node_id");--> statement-breakpoint
CREATE INDEX "memory_usage_timestamp_idx" ON "memory_usage_analytics" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "memory_usage_relevance_idx" ON "memory_usage_analytics" USING btree ("relevance_score");--> statement-breakpoint
CREATE INDEX "prompt_opts_task_type_idx" ON "prompt_optimizations" USING btree ("task_type");--> statement-breakpoint
CREATE INDEX "prompt_opts_timestamp_idx" ON "prompt_optimizations" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "prompt_opts_quality_idx" ON "prompt_optimizations" USING btree ("prompt_quality");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_alert_id" ON "api_alert_history" USING btree ("alert_id");--> statement-breakpoint
CREATE INDEX "idx_api_alert_rule" ON "api_alert_history" USING btree ("rule_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_alert_severity" ON "api_alert_history" USING btree ("severity","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_alert_acknowledged" ON "api_alert_history" USING btree ("acknowledged");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_analytics_summary_id" ON "api_analytics_summary" USING btree ("summary_id");--> statement-breakpoint
CREATE INDEX "idx_api_analytics_period" ON "api_analytics_summary" USING btree ("period_type","period_start");--> statement-breakpoint
CREATE INDEX "idx_api_analytics_module" ON "api_analytics_summary" USING btree ("module_name","period_start");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_change_event_id" ON "api_change_events" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_api_change_diff" ON "api_change_events" USING btree ("diff_id");--> statement-breakpoint
CREATE INDEX "idx_api_change_severity" ON "api_change_events" USING btree ("severity","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_change_resolved" ON "api_change_events" USING btree ("is_resolved");--> statement-breakpoint
CREATE INDEX "idx_api_change_notification" ON "api_change_events" USING btree ("notifications_sent");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_diff_hash" ON "api_diffs" USING btree ("diff_hash");--> statement-breakpoint
CREATE INDEX "idx_api_diff_module" ON "api_diffs" USING btree ("module_name","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_diff_risk" ON "api_diffs" USING btree ("risk_level","impact_score");--> statement-breakpoint
CREATE INDEX "idx_api_diff_versions" ON "api_diffs" USING btree ("version_from","version_to");--> statement-breakpoint
CREATE INDEX "idx_api_diff_reviewed" ON "api_diffs" USING btree ("reviewed");--> statement-breakpoint
CREATE INDEX "idx_api_endpoint_hash" ON "api_endpoints" USING btree ("endpoint_hash");--> statement-breakpoint
CREATE INDEX "idx_api_endpoint_snapshot" ON "api_endpoints" USING btree ("snapshot_id");--> statement-breakpoint
CREATE INDEX "idx_api_endpoint_path_method" ON "api_endpoints" USING btree ("path","method");--> statement-breakpoint
CREATE INDEX "idx_api_endpoint_deprecated" ON "api_endpoints" USING btree ("is_deprecated");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_export_id" ON "api_export_operations" USING btree ("export_id");--> statement-breakpoint
CREATE INDEX "idx_api_export_status" ON "api_export_operations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_api_export_created_by" ON "api_export_operations" USING btree ("created_by","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_export_expires" ON "api_export_operations" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_monitoring_rule_name" ON "api_monitoring_rules" USING btree ("rule_name");--> statement-breakpoint
CREATE INDEX "idx_api_monitoring_module" ON "api_monitoring_rules" USING btree ("module_filter");--> statement-breakpoint
CREATE INDEX "idx_api_monitoring_active" ON "api_monitoring_rules" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_rollback_operation_id" ON "api_rollback_operations" USING btree ("operation_id");--> statement-breakpoint
CREATE INDEX "idx_api_rollback_module" ON "api_rollback_operations" USING btree ("module_name","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_rollback_status" ON "api_rollback_operations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_api_rollback_approved" ON "api_rollback_operations" USING btree ("approved");--> statement-breakpoint
CREATE INDEX "idx_api_schema_module_version" ON "api_schema_snapshots" USING btree ("module_name","version");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_schema_hash" ON "api_schema_snapshots" USING btree ("schema_hash");--> statement-breakpoint
CREATE INDEX "idx_api_schema_active" ON "api_schema_snapshots" USING btree ("is_active","created_at");--> statement-breakpoint
CREATE INDEX "idx_api_schema_neuron" ON "api_schema_snapshots" USING btree ("neuron_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_api_version_id" ON "api_version_history" USING btree ("version_id");--> statement-breakpoint
CREATE INDEX "idx_api_version_module" ON "api_version_history" USING btree ("module_name","version");--> statement-breakpoint
CREATE INDEX "idx_api_version_deployed" ON "api_version_history" USING btree ("deployed","deployed_at");--> statement-breakpoint
CREATE INDEX "idx_api_version_rollback" ON "api_version_history" USING btree ("rollback_available");--> statement-breakpoint
CREATE INDEX "cultural_ab_tests_test_id_idx" ON "cultural_ab_tests" USING btree ("test_id");--> statement-breakpoint
CREATE INDEX "cultural_ab_tests_status_idx" ON "cultural_ab_tests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "cultural_ab_tests_start_date_idx" ON "cultural_ab_tests" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "cultural_analytics_country_date_idx" ON "cultural_analytics" USING btree ("country_code","date");--> statement-breakpoint
CREATE INDEX "cultural_analytics_conversion_rate_idx" ON "cultural_analytics" USING btree ("conversion_rate");--> statement-breakpoint
CREATE INDEX "cultural_analytics_quality_score_idx" ON "cultural_analytics" USING btree ("quality_score");--> statement-breakpoint
CREATE INDEX "cultural_feedback_feedback_id_idx" ON "cultural_feedback" USING btree ("feedback_id");--> statement-breakpoint
CREATE INDEX "cultural_feedback_country_code_idx" ON "cultural_feedback" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "cultural_feedback_feedback_type_idx" ON "cultural_feedback" USING btree ("feedback_type");--> statement-breakpoint
CREATE INDEX "cultural_feedback_validation_status_idx" ON "cultural_feedback" USING btree ("validation_status");--> statement-breakpoint
CREATE INDEX "cultural_feedback_priority_idx" ON "cultural_feedback" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "cultural_mappings_country_code_idx" ON "cultural_mappings" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "cultural_mappings_region_idx" ON "cultural_mappings" USING btree ("region");--> statement-breakpoint
CREATE INDEX "cultural_mappings_active_idx" ON "cultural_mappings" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "cultural_personalization_rules_rule_id_idx" ON "cultural_personalization_rules" USING btree ("rule_id");--> statement-breakpoint
CREATE INDEX "cultural_personalization_rules_rule_type_idx" ON "cultural_personalization_rules" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "cultural_personalization_rules_priority_idx" ON "cultural_personalization_rules" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "cultural_personalization_rules_active_idx" ON "cultural_personalization_rules" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "emotion_profiles_emotion_id_idx" ON "emotion_profiles" USING btree ("emotion_id");--> statement-breakpoint
CREATE INDEX "emotion_profiles_category_idx" ON "emotion_profiles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "emotion_profiles_intensity_idx" ON "emotion_profiles" USING btree ("intensity");--> statement-breakpoint
CREATE INDEX "user_emotion_tracking_session_id_idx" ON "user_emotion_tracking" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "user_emotion_tracking_user_id_idx" ON "user_emotion_tracking" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_emotion_tracking_country_code_idx" ON "user_emotion_tracking" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "user_emotion_tracking_dominant_emotion_idx" ON "user_emotion_tracking" USING btree ("dominant_emotion");--> statement-breakpoint
CREATE INDEX "user_emotion_tracking_timestamp_idx" ON "user_emotion_tracking" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "layout_ab_tests_template_idx" ON "layout_ab_tests" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "layout_ab_tests_status_idx" ON "layout_ab_tests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "layout_ab_tests_date_idx" ON "layout_ab_tests" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX "layout_ab_tests_metric_idx" ON "layout_ab_tests" USING btree ("target_metric");--> statement-breakpoint
CREATE INDEX "layout_analytics_instance_idx" ON "layout_analytics" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "layout_analytics_template_idx" ON "layout_analytics" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "layout_analytics_session_idx" ON "layout_analytics" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "layout_analytics_timestamp_idx" ON "layout_analytics" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "layout_analytics_conversions_idx" ON "layout_analytics" USING btree ("conversion_rate");--> statement-breakpoint
CREATE INDEX "layout_instances_template_idx" ON "layout_instances" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "layout_instances_session_idx" ON "layout_instances" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "layout_instances_user_idx" ON "layout_instances" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "layout_instances_device_idx" ON "layout_instances" USING btree ("device_type");--> statement-breakpoint
CREATE INDEX "layout_instances_active_idx" ON "layout_instances" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "layout_instances_generated_at_idx" ON "layout_instances" USING btree ("generated_at");--> statement-breakpoint
CREATE INDEX "layout_mutations_instance_idx" ON "layout_mutations" USING btree ("instance_id");--> statement-breakpoint
CREATE INDEX "layout_mutations_element_idx" ON "layout_mutations" USING btree ("element_id");--> statement-breakpoint
CREATE INDEX "layout_mutations_type_idx" ON "layout_mutations" USING btree ("mutation_type");--> statement-breakpoint
CREATE INDEX "layout_mutations_applied_at_idx" ON "layout_mutations" USING btree ("applied_at");--> statement-breakpoint
CREATE INDEX "layout_mutations_trigger_idx" ON "layout_mutations" USING btree ("trigger_type");--> statement-breakpoint
CREATE INDEX "layout_personalization_type_idx" ON "layout_personalization" USING btree ("rule_type");--> statement-breakpoint
CREATE INDEX "layout_personalization_priority_idx" ON "layout_personalization" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "layout_personalization_active_idx" ON "layout_personalization" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "layout_personalization_effectiveness_idx" ON "layout_personalization" USING btree ("effectiveness_score");--> statement-breakpoint
CREATE INDEX "layout_templates_category_idx" ON "layout_templates" USING btree ("category");--> statement-breakpoint
CREATE INDEX "layout_templates_active_idx" ON "layout_templates" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "layout_templates_name_idx" ON "layout_templates" USING btree ("name");--> statement-breakpoint
CREATE INDEX "user_layout_preferences_user_idx" ON "user_layout_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_layout_preferences_layout_idx" ON "user_layout_preferences" USING btree ("layout_id");--> statement-breakpoint
CREATE INDEX "user_layout_preferences_element_idx" ON "user_layout_preferences" USING btree ("element_id");--> statement-breakpoint
CREATE INDEX "user_layout_preferences_type_idx" ON "user_layout_preferences" USING btree ("preference_type");--> statement-breakpoint
CREATE INDEX "user_layout_preferences_strength_idx" ON "user_layout_preferences" USING btree ("strength");--> statement-breakpoint
CREATE INDEX "api_tokens_token_idx" ON "api_access_tokens" USING btree ("token_id");--> statement-breakpoint
CREATE INDEX "api_tokens_active_idx" ON "api_access_tokens" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "api_tokens_expiry_idx" ON "api_access_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "cache_invalidation_route_idx" ON "cache_invalidation_logs" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "cache_invalidation_type_idx" ON "cache_invalidation_logs" USING btree ("invalidation_type");--> statement-breakpoint
CREATE INDEX "cache_invalidation_date_idx" ON "cache_invalidation_logs" USING btree ("invalidated_at");--> statement-breakpoint
CREATE INDEX "cache_metrics_route_date_idx" ON "cache_performance_metrics" USING btree ("route_id","date");--> statement-breakpoint
CREATE INDEX "cache_metrics_performance_idx" ON "cache_performance_metrics" USING btree ("hit_ratio","avg_response_time");--> statement-breakpoint
CREATE INDEX "cdn_cache_route_idx" ON "cdn_cache_config" USING btree ("route_pattern");--> statement-breakpoint
CREATE INDEX "cdn_cache_policy_idx" ON "cdn_cache_config" USING btree ("cache_policy");--> statement-breakpoint
CREATE INDEX "cdn_cache_active_idx" ON "cdn_cache_config" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "llm_fallback_request_idx" ON "llm_fallback_events" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "llm_fallback_type_idx" ON "llm_fallback_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "llm_fallback_llm_idx" ON "llm_fallback_events" USING btree ("primary_llm_id","fallback_llm_id");--> statement-breakpoint
CREATE INDEX "llm_fallback_date_idx" ON "llm_fallback_events" USING btree ("event_at");--> statement-breakpoint
CREATE INDEX "llm_fallbacks_provider_idx" ON "llm_fallbacks" USING btree ("provider");--> statement-breakpoint
CREATE INDEX "llm_fallbacks_priority_idx" ON "llm_fallbacks" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "llm_fallbacks_health_idx" ON "llm_fallbacks" USING btree ("health_status");--> statement-breakpoint
CREATE INDEX "llm_fallbacks_active_idx" ON "llm_fallbacks" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "llm_usage_llm_date_idx" ON "llm_usage_analytics" USING btree ("llm_id","date");--> statement-breakpoint
CREATE INDEX "llm_usage_cost_idx" ON "llm_usage_analytics" USING btree ("total_cost");--> statement-breakpoint
CREATE INDEX "llm_usage_performance_idx" ON "llm_usage_analytics" USING btree ("avg_response_time","error_rate");--> statement-breakpoint
CREATE INDEX "migration_events_type_idx" ON "migration_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "migration_events_component_idx" ON "migration_events" USING btree ("component");--> statement-breakpoint
CREATE INDEX "migration_events_status_idx" ON "migration_events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "migration_events_date_idx" ON "migration_events" USING btree ("event_at");--> statement-breakpoint
CREATE INDEX "rotation_history_key_idx" ON "secret_rotation_history" USING btree ("key_id");--> statement-breakpoint
CREATE INDEX "rotation_history_date_idx" ON "secret_rotation_history" USING btree ("rotated_at");--> statement-breakpoint
CREATE INDEX "secrets_vault_type_idx" ON "secrets_vault" USING btree ("secret_type");--> statement-breakpoint
CREATE INDEX "secrets_vault_active_idx" ON "secrets_vault" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "secrets_vault_expiry_idx" ON "secrets_vault" USING btree ("expires_at");