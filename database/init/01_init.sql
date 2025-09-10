-- Initial database setup for MTLverse
-- This file is executed when the PostgreSQL container starts

-- Create database if it doesn't exist (handled by POSTGRES_DB environment variable)
-- Create user if it doesn't exist (handled by POSTGRES_USER environment variable)

-- Set timezone
SET timezone = 'UTC';

-- Create schema
CREATE SCHEMA IF NOT EXISTS mtlverse;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE mtlverse TO mtlverse_user;
GRANT ALL PRIVILEGES ON SCHEMA mtlverse TO mtlverse_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA mtlverse TO mtlverse_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA mtlverse TO mtlverse_user;

-- Set default schema
ALTER DATABASE mtlverse SET search_path TO mtlverse, public;
