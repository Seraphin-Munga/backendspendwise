import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { incomeService } from '../services/income';
import type {
  Income,
  CreateIncomeData,
  UpdateIncomeData,
  IncomeFilters,
} from '../services/income/types';

interface IncomeState {
  incomes: Income[];
  selectedIncome: Income | null;
  isLoading: boolean;
  error: string | null;
  filters: IncomeFilters | null;
  total: number;
}

const initialState: IncomeState = {
  incomes: [],
  selectedIncome: null,
  isLoading: false,
  error: null,
  filters: null,
  total: 0,
};

// Async thunks
export const fetchIncomes = createAsyncThunk(
  'income/fetchIncomes',
  async (filters?: IncomeFilters, { rejectWithValue }) => {
    try {
      const response = await incomeService.getIncomes(filters);
      if (response.success && response.data) {
        return {
          incomes: response.data,
          total: response.total || response.data.length,
        };
      }
      return rejectWithValue(response.message || 'Failed to fetch income');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch income');
    }
  }
);

export const fetchIncomeById = createAsyncThunk(
  'income/fetchIncomeById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await incomeService.getIncomeById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch income');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch income');
    }
  }
);

export const createIncome = createAsyncThunk(
  'income/createIncome',
  async (data: CreateIncomeData, { rejectWithValue }) => {
    try {
      const response = await incomeService.createIncome(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to add income');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add income');
    }
  }
);

export const updateIncome = createAsyncThunk(
  'income/updateIncome',
  async (data: UpdateIncomeData, { rejectWithValue }) => {
    try {
      const response = await incomeService.updateIncome(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update income');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update income');
    }
  }
);

export const deleteIncome = createAsyncThunk(
  'income/deleteIncome',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await incomeService.deleteIncome(id);
      if (response.success) {
        // Refetch incomes after deletion
        dispatch(fetchIncomes());
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete income');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete income');
    }
  }
);

const incomeSlice = createSlice({
  name: 'income',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedIncome: (state) => {
      state.selectedIncome = null;
    },
    setFilters: (state, action: PayloadAction<IncomeFilters | null>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Incomes
    builder
      .addCase(fetchIncomes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes = action.payload.incomes;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Income By ID
    builder
      .addCase(fetchIncomeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncomeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedIncome = action.payload;
        state.error = null;
      })
      .addCase(fetchIncomeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Income
    builder
      .addCase(createIncome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new income to the beginning of the list
        state.incomes.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Income
    builder
      .addCase(updateIncome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.incomes.findIndex(
          (inc) => inc.id === action.payload.id
        );
        if (index !== -1) {
          state.incomes[index] = action.payload;
        }
        if (state.selectedIncome?.id === action.payload.id) {
          state.selectedIncome = action.payload;
        }
        state.error = null;
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Income
    builder
      .addCase(deleteIncome.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomes = state.incomes.filter(
          (inc) => inc.id !== action.payload
        );
        if (state.selectedIncome?.id === action.payload) {
          state.selectedIncome = null;
        }
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSelectedIncome,
  setFilters,
  clearFilters,
} = incomeSlice.actions;
export default incomeSlice.reducer;



