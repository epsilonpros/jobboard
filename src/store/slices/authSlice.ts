import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import type { User } from '../../types';
import toast from 'react-hot-toast';
import {ApiGeneric} from "../../api";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const api = new ApiGeneric();
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Connexion de l'utilisateur
      const data = await api.onSend('/login', {
        method: 'POST',
        data: { username: email, password },
        headers: {
          "Content-Type": "application/json"
        }
      });

      let company = {}
      if(data.user.company){
        company = {company: data.user.company}
      }

      // Retourne les données de l'utilisateur avec son rôle
      return {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        created_at: data.user.created_at,
        token: data.token,
        ...company
      } as User;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.errors.message ?? error.errors.detail);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, role,first_name,last_name,company_name }: { email: string; password: string; role: 'company' | 'candidate' ;first_name: string;last_name: string;company_name:string}, { rejectWithValue }) => {
    try {
      const data = await api.onSend('/api/register', {
        method: 'POST',
        data: { email, password, role,first_name,last_name,company_name },
        headers: {
          "Content-Type": "application/json"
        }
      })

      // Retourne les données de l'utilisateur avec son rôle
      return {
        id: data.user?.id,
        email: data.user?.email,
        role,
        created_at: data.user?.created_at,
      } as User;
    } catch (error: any) {
      return rejectWithValue(error.errors.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    // const { error } = await supabase.auth.signOut();
    // if (error) throw error;
    sessionStorage.removeItem('tia-wfs-token');
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Compte créé avec succès !');
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Connexion réussie !');
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        toast.success('Déconnexion réussie !');
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;