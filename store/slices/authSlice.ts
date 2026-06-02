import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';

interface User {
  _id: string;
  fullName?: string;
  phone: string;
  role: string;
  status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  adminToken: string | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  adminToken: typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null,
  loading: false,
  error: null,
  isNewUser: false,
};

export const requestOtp = createAsyncThunk(
  'auth/requestOtp',
  async ({ phone, isAdminLogin = false }: { phone: string, isAdminLogin?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/request-otp', { phone, isAdminLogin });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phone, otp, isAdminLogin = false }: { phone: string, otp: string, isAdminLogin?: boolean }, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/verify-otp', { phone, otp });
      const { data: user, token, isNewUser } = response.data;
      
      if (isAdminLogin) {
        if (user.role !== 'admin' && user.role !== 'staff') {
          return rejectWithValue('Unauthorized: Admin or Staff access required');
        }
      }
      
      return { user, token, isNewUser, isAdminLogin };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

export const addReseller = createAsyncThunk(
  'auth/addReseller',
  async ({ name, number }: { name: string, number: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reseller', { name, number });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add reseller');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ id, fullName, phone, otp }: { id: string, fullName?: string, phone?: string, otp?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/${id}`, { fullName, phone, otp });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') localStorage.removeItem('token');
    },
    adminLogout: (state) => {
      state.adminToken = null;
      if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setNewUserFlag: (state, action) => {
      state.isNewUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.isNewUser = action.payload.isNewUser;
        state.user = action.payload.user;
        
        if (action.payload.isAdminLogin) {
          state.adminToken = action.payload.token;
          if (typeof window !== 'undefined') {
            localStorage.setItem('admin_token', action.payload.token);
          }
        } else {
          // If it's a new user, we don't save the token just yet until profile is completed
          if (!action.payload.isNewUser) {
            state.token = action.payload.token;
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', action.payload.token);
            }
          } else {
            // Keep token in state temporarily for new users so we can use it to create reseller
            state.token = action.payload.token;
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', action.payload.token);
            }
          }
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Reseller
      .addCase(addReseller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReseller.fulfilled, (state) => {
        state.loading = false;
        state.isNewUser = false; // Profile completed
      })
      .addCase(addReseller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user && action.payload.data) {
          state.user = { ...state.user, ...action.payload.data };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        if (typeof window !== 'undefined') localStorage.removeItem('token');
      });
  },
});

export const { logout, adminLogout, clearError, setNewUserFlag } = authSlice.actions;
export default authSlice.reducer;
