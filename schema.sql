-- ========================================================
-- RIS School Web App — Production PostgreSQL / Supabase Schema
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
    title VARCHAR(255),
    homeroom_class VARCHAR(50),
    is_homeroom_teacher BOOLEAN DEFAULT FALSE,
    subjects JSONB DEFAULT '[]'::jsonb,
    class_id VARCHAR(50),
    roll_no VARCHAR(50),
    avatar TEXT,
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    section VARCHAR(20) NOT NULL
);

-- Seed Default Classes
INSERT INTO classes (id, name, grade, section) VALUES
('10A', 'Class 10-A', '10', 'A'),
('10B', 'Class 10-B', '10', 'B'),
('9A',  'Class 9-A',  '9',  'A'),
('9B',  'Class 9-B',  '9',  'B')
ON CONFLICT (id) DO NOTHING;

-- 3. HOMEWORK TABLE
CREATE TABLE IF NOT EXISTS homework (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id),
    teacher_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    completed_by JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. NOTICES TABLE
CREATE TABLE IF NOT EXISTS notices (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
    target_audience VARCHAR(100) DEFAULT 'Whole School',
    author_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(100),
    read_by JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STUDENT MORNING ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS student_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id VARCHAR(50) NOT NULL REFERENCES classes(id),
    date_str VARCHAR(20) NOT NULL,
    period VARCHAR(100) DEFAULT 'Daily Morning Register',
    marked_by VARCHAR(255) NOT NULL,
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    records JSONB NOT NULL, -- { "studentId": { "status": "present"|"absent" } }
    CONSTRAINT unique_class_date UNIQUE (class_id, date_str)
);

-- 6. LEAVE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS leave_requests (
    id VARCHAR(100) PRIMARY KEY,
    teacher_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    leave_type VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewer_note TEXT
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(100) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL
);

-- Seed Default Admin User
INSERT INTO users (id, name, email, role, title, avatar) VALUES
('admin-1', 'School Principal (Admin)', 'admin@risschool.edu', 'admin', 'School Principal / Administrator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150')
ON CONFLICT (id) DO NOTHING;
