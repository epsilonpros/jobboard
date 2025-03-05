import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type {Company, Job} from '../../types';
import toast from 'react-hot-toast';
import {ApiGeneric} from "../../api";
import { RootState } from '../index';

interface JobsState {
  jobs: Job[];
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
  filters: {
    search?: string;
    type?: string;
    location?: string;
    salary?: string;
    remote?: boolean;
  };
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  filters: {},
};

const api = new ApiGeneric()

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: JobsState['filters'], { rejectWithValue }) => {
    try {
      // let query = supabase
      //   .from('jobs')
      //   .select(`
      //     *,
      //     company:companies(name, logo_url)
      //   `)
      //   .eq('status', 'published')
      //   .order('featured', { ascending: false })
      //   .order('created_at', { ascending: false });
      //
      // if (filters.search) {
      //   query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      // }
      //
      // if (filters.type) {
      //   query = query.eq('type', filters.type);
      // }
      //
      // if (filters.location) {
      //   query = query.eq('location', filters.location);
      // }
      //
      // if (filters.remote) {
      //   query = query.eq('remote', true);
      // }
      //
      // if (filters.salary) {
      //   const [min, max] = filters.salary.split('-').map(Number);
      //   if (max) {
      //     query = query.and(`salary_min.gte.${min},salary_min.lte.${max}`);
      //   } else {
      //     query = query.gte('salary_min', min);
      //   }
      // }

      const data = await api.onSend('/api/jobs?status=published')
      // const { data, error } = await query;

      // if (error) throw error;
      return data.member;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompanyJobs = createAsyncThunk(
  'jobs/fetchCompanyJobs',
  async (_, { getState,rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const campany_id = (state.auth.user as Company).company
      if (!campany_id) throw new Error('No user found');

      const data = await api.onSend('/api/jobs', {
        method: 'GET',
        params: {
          company: campany_id
        }
      })

      // if (error) throw error;
      return data.member;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const data = await api.onSend(`/api/jobs/${jobId}`)
      // Increment view count
      // await supabase
      //   .from('jobs')
      //   .update({ views: (data.views || 0) + 1 })
      //   .eq('id', jobId);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (job: Partial<Job>, { rejectWithValue }) => {
    try {
      const data = await api.onSend('/api/jobs', {
        method: 'POST',
        data: job,
        headers: {
            'Content-Type': 'application/ld+json'
        }
      })
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      return jobId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(fetchCompanyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchCompanyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
        toast.success('Job created successfully!');
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        toast.success('Job deleted successfully!');
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setFilters, clearSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;