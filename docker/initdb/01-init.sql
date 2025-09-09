-- Empire Database Initialization Script
-- This script sets up the local PostgreSQL database for the billion-dollar AI Empire

-- Ensure UTF-8 encoding
ALTER DATABASE empire_database SET TIMEZONE TO 'UTC';

-- Create extensions needed for the empire
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create schemas for modular organization
CREATE SCHEMA IF NOT EXISTS ai_ml;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS federation;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS commerce;
CREATE SCHEMA IF NOT EXISTS content;

-- Set search path
ALTER DATABASE empire_database SET search_path TO public, ai_ml, analytics, federation, compliance, commerce, content;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE empire_database TO empire_user;
GRANT ALL ON SCHEMA public TO empire_user;
GRANT ALL ON SCHEMA ai_ml TO empire_user;
GRANT ALL ON SCHEMA analytics TO empire_user;
GRANT ALL ON SCHEMA federation TO empire_user;
GRANT ALL ON SCHEMA compliance TO empire_user;
GRANT ALL ON SCHEMA commerce TO empire_user;
GRANT ALL ON SCHEMA content TO empire_user;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_created_at ON public.users (created_at);
CREATE INDEX IF NOT EXISTS idx_updated_at ON public.users (updated_at);

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Empire Database initialized successfully for local development';
    RAISE NOTICE 'Database: %', current_database();
    RAISE NOTICE 'User: %', current_user;
    RAISE NOTICE 'Timestamp: %', now();
END $$;