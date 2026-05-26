import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getErrorMessage } from '../../utils/api';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export interface User {
  username: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registerSuccess: boolean;
}

// Helper to safely parse local storage
const getSavedUser = (): User | null => {
  const saved = localStorage.getItem('hms_user');
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem('hms_token'),
  user: getSavedUser(),
  isAuthenticated: !!localStorage.getItem('hms_token'),
  loading: false,
  error: null,
  registerSuccess: false,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        return rejectWithValue(getErrorMessage(errorMsg) || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Save token and user details to localStorage
      localStorage.setItem('hms_token', data.token);
      
      const userObj: User = {
        username: data.username,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      };
      
      localStorage.setItem('hms_user', JSON.stringify(userObj));
      return { token: data.token, user: userObj };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Server error occurred');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userDetails: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        return rejectWithValue(getErrorMessage(errorMsg) || 'Registration failed');
      }

      const message = await response.text();
      return message;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Server error occurred');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('hms_token');
      localStorage.removeItem('hms_user');
    },
    clearError: (state) => {
      state.error = null;
    },
    resetRegisterSuccess: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registerSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registerSuccess = false;
      });
  },
});

export const { logout, clearError, resetRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
