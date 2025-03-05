import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type {Application, Company} from '../../types';
import toast from 'react-hot-toast';
import {ApiGeneric} from "../../api";
import {RootState} from "../index.ts";

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

const api = new ApiGeneric()

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      let url = `candidate=${state.auth.user.id}`;
      if(state.auth.user.role === 'company'){
        const campany_id = (state.auth.user as Company).company
        url = `job.company=${campany_id}`;
      }

      const data = await api.onSend(`/api/applications?${url}`)
      // const { data, error } = await supabase
      //   .from('applications')
      //   .select(`
      //     *,
      //     job:jobs(
      //       id,
      //       title,
      //       company:companies(
      //         id,
      //         name,
      //         logo_url
      //       )
      //     )
      //   `)
      //   .eq('candidate_id', user.id)
      //   .order('created_at', { ascending: false });

      return data.member;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/applyToJob',
  async ({ job_id, cover_letter }: { job_id: string; cover_letter: string }, { rejectWithValue }) => {
    try {

      const data = await api.onSend(`/api/jobs/${job_id}/apply`,{
        method: 'POST',
        headers:{
            'Content-Type': "application/json"
        },
        data:{
          coverLetter: cover_letter,
        }
      })

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