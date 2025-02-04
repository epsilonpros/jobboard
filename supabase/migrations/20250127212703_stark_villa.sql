/*
  # Job Board Database Schema

  1. Core Tables
    - Profiles (users)
    - Companies
    - Candidates
    - Jobs
    - Applications
  
  2. Supporting Tables
    - Experiences
    - Education
    - Skills
    - Notifications
  
  3. Security
    - Row Level Security (RLS) policies
    - Function-based security
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create base tables
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('company', 'candidate', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  name text NOT NULL,
  description text,
  logo_url text,
  website text,
  verified boolean DEFAULT false,
  size text CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  industry text,
  location text
);

CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY REFERENCES profiles(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text,
  bio text,
  avatar_url text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  resume_url text,
  available_for_hire boolean DEFAULT true,
  preferred_location text,
  willing_to_relocate boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL DEFAULT '{}',
  type text NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  location text NOT NULL,
  remote boolean DEFAULT false,
  salary_min integer,
  salary_max integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  applications_count integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) NOT NULL,
  candidate_id uuid REFERENCES candidates(id) NOT NULL,
  cover_letter text,
  resume_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create supporting tables
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(id) NOT NULL,
  company text NOT NULL,
  title text NOT NULL,
  location text,
  start_date date NOT NULL,
  end_date date,
  current boolean DEFAULT false,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id uuid REFERENCES candidates(id) NOT NULL,
  school text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  category text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS candidate_skills (
  candidate_id uuid REFERENCES candidates(id) NOT NULL,
  skill_id uuid REFERENCES skills(id) NOT NULL,
  years_of_experience integer,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (candidate_id, skill_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
DO $$ 
BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
  ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
  ALTER TABLE education ENABLE ROW LEVEL SECURITY;
  ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
  ALTER TABLE candidate_skills ENABLE ROW LEVEL SECURITY;
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
END $$;

-- Create RLS Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Companies
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Companies can update own profile"
  ON companies FOR UPDATE
  USING (auth.uid() = id);

-- Candidates
CREATE POLICY "Candidates are viewable by everyone"
  ON candidates FOR SELECT
  USING (true);

CREATE POLICY "Candidates can update own profile"
  ON candidates FOR UPDATE
  USING (auth.uid() = id);

-- Jobs
CREATE POLICY "Published jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Companies can manage own jobs"
  ON jobs FOR ALL
  USING (auth.uid() = company_id);

-- Applications
CREATE POLICY "Candidates can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = candidate_id);

CREATE POLICY "Companies can view applications for their jobs"
  ON applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM jobs
    WHERE jobs.id = applications.job_id
    AND jobs.company_id = auth.uid()
  ));

CREATE POLICY "Candidates can create applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

-- Experiences
CREATE POLICY "Experiences are viewable by everyone"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "Candidates can manage own experiences"
  ON experiences FOR ALL
  USING (auth.uid() = candidate_id);

-- Education
CREATE POLICY "Education entries are viewable by everyone"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Candidates can manage own education"
  ON education FOR ALL
  USING (auth.uid() = candidate_id);

-- Skills
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  USING (true);

-- Candidate Skills
CREATE POLICY "Candidate skills are viewable by everyone"
  ON candidate_skills FOR SELECT
  USING (true);

CREATE POLICY "Candidates can manage own skills"
  ON candidate_skills FOR ALL
  USING (auth.uid() = candidate_id);

-- Notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to handle new users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO profiles (id, email, role)
  VALUES (new.id, new.email, 'candidate');
  RETURN new;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_experiences_candidate_id ON experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_education_candidate_id ON education(candidate_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX IF NOT EXISTS idx_candidate_skills_skill_id ON candidate_skills(skill_id);

-- Create function to increment applications count
CREATE OR REPLACE FUNCTION increment_applications_count(job_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE jobs
  SET applications_count = applications_count + 1
  WHERE id = job_id;
END;
$$;