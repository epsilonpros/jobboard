export type UserRole = 'company' | 'candidate' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Company extends User {
  company?: number
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  verified: boolean;
}

export interface Candidate extends User {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  avatar_url?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
}

export interface Job {
  id?: string;
  company?: string;
  title: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  remote: boolean;
  salaryMin?: number|string;
  salaryMax?: number|string;
  createdAt?: string;
  expiresAt: string;
  status: 'draft' | 'published' | 'closed';
  featured?: boolean;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  cover_letter?: string;
}