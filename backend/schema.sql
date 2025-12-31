-- Database Schema for Budget + Crypto App

-- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    security_question TEXT,
    security_answer TEXT,
    country TEXT,
    join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration for existing tables (Run this if table already exists)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer TEXT;

-- 2. Table: user_events
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    meta_data JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
