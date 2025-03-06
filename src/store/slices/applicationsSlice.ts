import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Application, Company } from '../../types';
import toast from 'react-hot-toast';
import { ApiGeneric } from "../../api";
import { RootState } from "../index.ts";

interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
  hasMore: true,
};

const api = new ApiGeneric();

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ page = 1, status }: { page?: number; status?: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      api.page = page;
      api.rowsPerPage = 12;

      let url = `candidate=${state.auth.user.id}`;
      if (state.auth.user.role === 'company') {
        const companyId = (state.auth.user as Company).company;
        url = `job.company=${companyId}`;
      }
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }

      const data = await api.onSend(`/api/applications?${url}`);
      
      return {
        applications: data.member,
        page,
        hasMore: data.member.length === 12 // Assuming 12 is the page size
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async ({ job_id, cover_letter }: { job_id: string; cover_letter: string }, { rejectWithValue }) => {
    try {
      const data = await api.onSend(`/api/jobs/${job_id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        data: {
          coverLetter: cover_letter,
        }
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(error.errors.message);
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
        if (action.payload.page === 1) {
          state.applications = action.payload.applications;
        } else {
          state.applications = [...state.applications, ...action.payload.applications];
        }
        state.hasMore = action.payload.hasMore;
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
        toast.success('Candidature soumise avec succès!');
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default applicationsSlice.reducer;