-- ===============================================================
-- POSTGRESQL INITIALIZATION SCRIPT
-- Billion-Dollar Empire Database Setup
-- ===============================================================

-- Create the main database user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'findawise') THEN
        CREATE USER findawise WITH PASSWORD 'findawise';
    END IF;
END
$$;

-- Grant all privileges to the user
GRANT ALL PRIVILEGES ON DATABASE findawise TO findawise;
ALTER USER findawise CREATEDB;
ALTER USER findawise SUPERUSER;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Vector extension for embeddings (if available)
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Create schemas for organization
CREATE SCHEMA IF NOT EXISTS ai_ml;
CREATE SCHEMA IF NOT EXISTS federation;
CREATE SCHEMA IF NOT EXISTS compliance;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS monitoring;

-- Grant schema permissions
GRANT ALL ON SCHEMA ai_ml TO findawise;
GRANT ALL ON SCHEMA federation TO findawise;
GRANT ALL ON SCHEMA compliance TO findawise;
GRANT ALL ON SCHEMA analytics TO findawise;
GRANT ALL ON SCHEMA monitoring TO findawise;

-- Optimize PostgreSQL for AI/ML workloads
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;

-- Enable query logging for monitoring
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Performance monitoring
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
ALTER SYSTEM SET track_functions = 'all';

-- Create performance monitoring function
CREATE OR REPLACE FUNCTION get_empire_database_stats()
RETURNS TABLE (
    metric_name TEXT,
    metric_value TEXT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_tables'::TEXT,
        (SELECT COUNT(*)::TEXT FROM information_schema.tables WHERE table_schema = 'public'),
        'Total number of tables in the database'::TEXT
    UNION ALL
    SELECT 
        'database_size'::TEXT,
        pg_size_pretty(pg_database_size(current_database())),
        'Total database size'::TEXT
    UNION ALL
    SELECT 
        'active_connections'::TEXT,
        (SELECT COUNT(*)::TEXT FROM pg_stat_activity WHERE state = 'active'),
        'Number of active database connections'::TEXT
    UNION ALL
    SELECT 
        'cache_hit_ratio'::TEXT,
        (SELECT ROUND((sum(blks_hit) * 100.0 / (sum(blks_hit) + sum(blks_read))), 2)::TEXT || '%' 
         FROM pg_stat_database WHERE datname = current_database()),
        'Database cache hit ratio'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create empire health check function
CREATE OR REPLACE FUNCTION empire_health_check()
RETURNS TABLE (
    component TEXT,
    status TEXT,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'database'::TEXT,
        'healthy'::TEXT,
        jsonb_build_object(
            'uptime', EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())),
            'version', version(),
            'current_time', now()
        )
    UNION ALL
    SELECT 
        'connections'::TEXT,
        CASE 
            WHEN (SELECT COUNT(*) FROM pg_stat_activity) < 100 THEN 'healthy'
            ELSE 'warning'
        END,
        jsonb_build_object(
            'active_connections', (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active'),
            'total_connections', (SELECT COUNT(*) FROM pg_stat_activity),
            'max_connections', (SELECT setting::INTEGER FROM pg_settings WHERE name = 'max_connections')
        );
END;
$$ LANGUAGE plpgsql;

-- Log successful initialization
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '===============================================================';
    RAISE NOTICE '🏆 BILLION-DOLLAR DATABASE INITIALIZATION COMPLETE!';
    RAISE NOTICE '✅ Extensions enabled: uuid-ossp, pg_stat_statements, pg_trgm';
    RAISE NOTICE '✅ Schemas created: ai_ml, federation, compliance, analytics';
    RAISE NOTICE '✅ Performance optimizations applied';
    RAISE NOTICE '✅ Monitoring functions created';
    RAISE NOTICE '✅ Ready for empire-grade operations!';
    RAISE NOTICE '===============================================================';
END $$;