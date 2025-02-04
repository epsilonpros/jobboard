import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { Application } from '../../types';
import toast from 'react-hot-toast';

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(
            id,
            title,
            company:companies(
              id,
              name,
              logo_url
            )
          )
        `)
        .eq('candidate_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async ({ job_id, candidate_id, cover_letter }: { job_id: string; candidate_id: string; cover_letter: string }, { rejectWithValue }) => {
    try {
      // Check if already applied
      const { data: existing, error: checkError } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', job_id)
        .eq('candidate_id', candidate_id)
        .single();

      if (existing) {
        throw new Error('You have already applied to this job');
      }

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Create application
      const { data, error } = await supabase
        .from('applications')
        .insert([{ job_id, candidate_id, cover_letter }])
        .select(`
          *,
          job:jobs(
            id,
            title,
            company:companies(
              id,
              name,
              logo_url
            )
          )
        `)
        .single();

      if (error) throw error;

      // Update applications count
      await supabase.rpc('increment_applications_count', { job_id });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applications.unshift(action.payload);
        toast.success('Application submitted successfully!');
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default applicationsSlice.reducer;