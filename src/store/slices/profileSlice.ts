import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import type { Candidate, Company } from '../../types';

interface ProfileState {
  loading: boolean;
  error: string | null;
  data: Candidate | Company | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile.role === 'candidate') {
        const { data: candidate, error: candidateError } = await supabase
          .from('candidates')
          .select(`
            *,
            experiences (*),
            education (*),
            candidate_skills (
              skill_id,
              years_of_experience,
              skills (name, category)
            )
          `)
          .eq('id', user.id)
          .single();

        if (candidateError) throw candidateError;
        return candidate;
      } else {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', user.id)
          .single();

        if (companyError) throw companyError;
        return company;
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCandidateProfile = createAsyncThunk(
  'profile/updateCandidateProfile',
  async (profile: Partial<Candidate>, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update basic profile information
      const { error: profileError } = await supabase
        .from('candidates')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          title: profile.title,
          bio: profile.bio,
          portfolio_url: profile.portfolio_url,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          available_for_hire: profile.available_for_hire,
          willing_to_relocate: profile.willing_to_relocate,
          preferred_location: profile.preferred_location,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update experiences
      if (profile.experience) {
        for (const exp of profile.experience) {
          if (exp.id) {
            const { error } = await supabase
              .from('experiences')
              .update(exp)
              .eq('id', exp.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('experiences')
              .insert({ ...exp, candidate_id: user.id });
            if (error) throw error;
          }
        }
      }

      // Update education
      if (profile.education) {
        for (const edu of profile.education) {
          if (edu.id) {
            const { error } = await supabase
              .from('education')
              .update(edu)
              .eq('id', edu.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('education')
              .insert({ ...edu, candidate_id: user.id });
            if (error) throw error;
          }
        }
      }

      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'profile/updateCompanyProfile',
  async (profile: Partial<Company>, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('companies')
        .update(profile)
        .eq('id', user.id);

      if (error) throw error;
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Update Candidate Profile
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        toast.success('Profile updated successfully!');
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Update Company Profile
      .addCase(updateCompanyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        toast.success('Company profile updated successfully!');
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export default profileSlice.reducer;