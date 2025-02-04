export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'company' | 'candidate' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'company' | 'candidate' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'company' | 'candidate' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          verified: boolean;
          size: string | null;
          industry: string | null;
          location: string | null;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
          size?: string | null;
          industry?: string | null;
          location?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
          size?: string | null;
          industry?: string | null;
          location?: string | null;
        };
      };
      candidates: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          title: string | null;
          bio: string | null;
          avatar_url: string | null;
          portfolio_url: string | null;
          github_url: string | null;
          linkedin_url: string | null;
          resume_url: string | null;
          available_for_hire: boolean;
          preferred_location: string | null;
          willing_to_relocate: boolean;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          portfolio_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          resume_url?: string | null;
          available_for_hire?: boolean;
          preferred_location?: string | null;
          willing_to_relocate?: boolean;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          title?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          portfolio_url?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          resume_url?: string | null;
          available_for_hire?: boolean;
          preferred_location?: string | null;
          willing_to_relocate?: boolean;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          description: string;
          requirements: string[];
          type: 'full-time' | 'part-time' | 'contract' | 'internship';
          location: string;
          remote: boolean;
          salary_min: number | null;
          salary_max: number | null;
          created_at: string;
          updated_at: string;
          expires_at: string;
          status: 'draft' | 'published' | 'closed';
          featured: boolean;
          views: number;
          applications_count: number;
        };
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          description: string;
          requirements: string[];
          type: 'full-time' | 'part-time' | 'contract' | 'internship';
          location: string;
          remote?: boolean;
          salary_min?: number | null;
          salary_max?: number | null;
          created_at?: string;
          updated_at?: string;
          expires_at: string;
          status?: 'draft' | 'published' | 'closed';
          featured?: boolean;
          views?: number;
          applications_count?: number;
        };
        Update: {
          id?: string;
          company_id?: string;
          title?: string;
          description?: string;
          requirements?: string[];
          type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          location?: string;
          remote?: boolean;
          salary_min?: number | null;
          salary_max?: number | null;
          created_at?: string;
          updated_at?: string;
          expires_at?: string;
          status?: 'draft' | 'published' | 'closed';
          featured?: boolean;
          views?: number;
          applications_count?: number;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          cover_letter: string | null;
          resume_url: string | null;
          status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: 'pending' | 'reviewing' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string;
          cover_letter?: string | null;
          resume_url?: string | null;
          status?: 'pending' | 'reviewing' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_applications_count: {
        Args: { job_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
};