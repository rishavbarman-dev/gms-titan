import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ------------------ ASYNC THUNKS ------------------

// Members
export const fetchMembers = createAsyncThunk('gym/fetchMembers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/members');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch members');
  }
});

export const createMember = createAsyncThunk('gym/createMember', async (memberData, { rejectWithValue }) => {
  try {
    const response = await api.post('/members', memberData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to register member');
  }
});

export const editMember = createAsyncThunk('gym/editMember', async ({ id, memberData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update member');
  }
});

export const removeMember = createAsyncThunk('gym/removeMember', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/members/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete member');
  }
});

// Trainers
export const fetchTrainers = createAsyncThunk('gym/fetchTrainers', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/trainers');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch trainers');
  }
});

export const createTrainer = createAsyncThunk('gym/createTrainer', async (trainerData, { rejectWithValue }) => {
  try {
    const response = await api.post('/trainers', trainerData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to hire trainer');
  }
});

export const removeTrainer = createAsyncThunk('gym/removeTrainer', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/trainers/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete trainer');
  }
});

// Payments
export const fetchPayments = createAsyncThunk('gym/fetchPayments', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/payments');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch payments');
  }
});

export const createPayment = createAsyncThunk('gym/createPayment', async (paymentData, { rejectWithValue }) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to record transaction');
  }
});

// Attendance
export const fetchAttendance = createAsyncThunk('gym/fetchAttendance', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/attendance');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch attendance');
  }
});

export const checkInMember = createAsyncThunk('gym/checkInMember', async (checkInData, { rejectWithValue }) => {
  try {
    const response = await api.post('/attendance/checkin', checkInData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to check in');
  }
});

export const checkOutMember = createAsyncThunk('gym/checkOutMember', async (id, { rejectWithValue }) => {
  try {
    const response = await api.post(`/attendance/checkout/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to check out');
  }
});

// Workout Plans
export const fetchWorkoutPlans = createAsyncThunk('gym/fetchWorkoutPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/workout-plans');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch workout plans');
  }
});

export const createWorkoutPlan = createAsyncThunk('gym/createWorkoutPlan', async (planData, { rejectWithValue }) => {
  try {
    const response = await api.post('/workout-plans', planData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create workout plan');
  }
});

export const deleteWorkoutPlan = createAsyncThunk('gym/deleteWorkoutPlan', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/workout-plans/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete workout plan');
  }
});

// Diet Plans
export const fetchDietPlans = createAsyncThunk('gym/fetchDietPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/diet-plans');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch diet plans');
  }
});

export const createDietPlan = createAsyncThunk('gym/createDietPlan', async (planData, { rejectWithValue }) => {
  try {
    const response = await api.post('/diet-plans', planData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create diet plan');
  }
});

export const deleteDietPlan = createAsyncThunk('gym/deleteDietPlan', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/diet-plans/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete diet plan');
  }
});

// Analytics
export const fetchDashboardAnalytics = createAsyncThunk('gym/fetchDashboardAnalytics', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard metrics');
  }
});


// ------------------ INITIAL STATE ------------------
const initialState = {
  members: [],
  trainers: [],
  payments: [],
  attendance: [],
  workoutPlans: [],
  dietPlans: [],
  analytics: {
    stats: { totalMembers: 0, activeMembers: 0, totalTrainers: 0, totalRevenue: 0 },
    charts: { revenue: [], attendance: [] }
  },
  loading: false,
  error: null,
};


// ------------------ SLICE ------------------
const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    clearGymError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Utility loading handlers
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Members
      .addCase(fetchMembers.pending, setPending)
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, setRejected)
      
      .addCase(createMember.fulfilled, (state, action) => {
        state.members.unshift(action.payload);
      })
      .addCase(editMember.fulfilled, (state, action) => {
        const idx = state.members.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) {
          state.members[idx] = action.payload;
        }
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.members = state.members.filter(m => m.id !== action.payload);
      })

      // Trainers
      .addCase(fetchTrainers.pending, setPending)
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, setRejected)
      
      .addCase(createTrainer.fulfilled, (state, action) => {
        state.trainers.unshift(action.payload);
      })
      .addCase(removeTrainer.fulfilled, (state, action) => {
        state.trainers = state.trainers.filter(t => t.id !== action.payload);
      })

      // Payments
      .addCase(fetchPayments.pending, setPending)
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, setRejected)
      
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payments.unshift(action.payload);
      })

      // Attendance
      .addCase(fetchAttendance.pending, setPending)
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendance = action.payload;
      })
      .addCase(fetchAttendance.rejected, setRejected)
      
      .addCase(checkInMember.fulfilled, (state, action) => {
        state.attendance.unshift(action.payload);
      })
      .addCase(checkOutMember.fulfilled, (state, action) => {
        const idx = state.attendance.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) {
          state.attendance[idx] = action.payload;
        }
      })

      // Workout Plans
      .addCase(fetchWorkoutPlans.pending, setPending)
      .addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload;
      })
      .addCase(fetchWorkoutPlans.rejected, setRejected)
      
      .addCase(createWorkoutPlan.fulfilled, (state, action) => {
        state.workoutPlans.unshift(action.payload);
      })
      .addCase(deleteWorkoutPlan.fulfilled, (state, action) => {
        state.workoutPlans = state.workoutPlans.filter(wp => wp.id !== action.payload);
      })

      // Diet Plans
      .addCase(fetchDietPlans.pending, setPending)
      .addCase(fetchDietPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.dietPlans = action.payload;
      })
      .addCase(fetchDietPlans.rejected, setRejected)
      
      .addCase(createDietPlan.fulfilled, (state, action) => {
        state.dietPlans.unshift(action.payload);
      })
      .addCase(deleteDietPlan.fulfilled, (state, action) => {
        state.dietPlans = state.dietPlans.filter(dp => dp.id !== action.payload);
      })

      // Dashboard Analytics
      .addCase(fetchDashboardAnalytics.pending, setPending)
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, setRejected);
  }
});

export const { clearGymError } = gymSlice.actions;
export default gymSlice.reducer;
