import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Company, Job } from '../../types';
import toast from 'react-hot-toast';
import { ApiGeneric } from "../../api";
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
    page?: number;
  };
  hasMore: boolean;
}

const initialState: JobsState = {
  jobs: [],
  selectedJob: null,
  loading: false,
  error: null,
  filters: {},
  hasMore: true,
};

const api = new ApiGeneric();

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: JobsState['filters'], { getState, rejectWithValue }) => {
    try {
      api.page = filters.page || 1;
      api.rowsPerPage = 12;

      const data = await api.onSend('/api/jobs?status=published');
      
      return {
        jobs: data.member,
        page: filters.page || 1,
        hasMore: data.member.length === 12 // Assuming 12 is the page size
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompanyJobs = createAsyncThunk(
  'jobs/fetchCompanyJobs',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const companyId = (state.auth.user as Company).company;
      if (!companyId) throw new Error('No company found');

      const data = await api.onSend('/api/jobs', {
        method: 'GET',
        params: {
          company: companyId
        }
      });

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
      const data = await api.onSend(`/api/jobs/${jobId}`);
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
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, ...job }: Partial<Job> & { id: string }, { rejectWithValue }) => {
    try {
      const data = await api.onSend(`/api/jobs/${id}`, {
        method: 'PUT',
        data: job,
        headers: {
          'Content-Type': 'application/ld+json'
        }
      });
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
      await api.onSend(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
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
        if (action.payload.page === 1) {
          state.jobs = action.payload.jobs;
        } else {
          state.jobs = [...state.jobs, ...action.payload.jobs];
        }
        state.hasMore = action.payload.hasMore;
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
        toast.success('Offre créée avec succès !');
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.selectedJob = action.payload;
        toast.success('Offre mise à jour avec succès !');
      })
      .addCase(updateJob.rejected, (state, action) => {
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
        toast.success('Offre supprimée avec succès !');
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