import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { budgetService } from '../services/budgets';
import type {
  Budget,
  CreateBudgetData,
  UpdateBudgetData,
  BudgetFilters,
} from '../services/budgets/types';

interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
  filters: BudgetFilters | null;
  total: number;
}

const initialState: BudgetState = {
  budgets: [],
  selectedBudget: null,
  isLoading: false,
  error: null,
  filters: null,
  total: 0,
};

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (filters?: BudgetFilters, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgets(filters);
      if (response.success && response.data) {
        return {
          budgets: response.data,
          total: response.total || response.data.length,
        };
      }
      return rejectWithValue(response.message || 'Failed to fetch budgets');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budgets');
    }
  }
);

export const fetchBudgetById = createAsyncThunk(
  'budgets/fetchBudgetById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgetById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch budget');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch budget');
    }
  }
);

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (data: CreateBudgetData, { rejectWithValue }) => {
    try {
      const response = await budgetService.createBudget(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create budget');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async (data: UpdateBudgetData, { rejectWithValue }) => {
    try {
      const response = await budgetService.updateBudget(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update budget');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update budget');
    }
  }
);

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await budgetService.deleteBudget(id);
      if (response.success) {
        // Refetch budgets after deletion
        dispatch(fetchBudgets());
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete budget');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete budget');
    }
  }
);

// Note: updateBudgetSpent is not available in the backend API
// Budget spent is calculated automatically from expenses
// This thunk is kept for compatibility but will need to be removed or refactored
export const updateBudgetSpent = createAsyncThunk(
  'budgets/updateBudgetSpent',
  async (
    { categoryId, amount }: { categoryId: number; amount: number },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // Refetch budgets to get updated spent amounts from backend
      await dispatch(fetchBudgets());
      return { categoryId, amount };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update budget spent');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedBudget: (state) => {
      state.selectedBudget = null;
    },
    setFilters: (state, action: PayloadAction<BudgetFilters | null>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Budgets
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload.budgets;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Budget By ID
    builder
      .addCase(fetchBudgetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBudget = action.payload;
        state.error = null;
      })
      .addCase(fetchBudgetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Budget
    builder
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new budget to the beginning of the list
        state.budgets.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Budget
    builder
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.budgets.findIndex(
          (bud) => bud.id === action.payload.id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        if (state.selectedBudget?.id === action.payload.id) {
          state.selectedBudget = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Budget
    builder
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = state.budgets.filter(
          (bud) => bud.id !== action.payload
        );
        if (state.selectedBudget?.id === action.payload) {
          state.selectedBudget = null;
        }
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Budget Spent
    builder
      .addCase(updateBudgetSpent.pending, (state) => {
        // Don't set loading for this as it's a background update
      })
      .addCase(updateBudgetSpent.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(
          (bud) => bud.id === action.payload.id
        );
        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
        if (state.selectedBudget?.id === action.payload.id) {
          state.selectedBudget = action.payload;
        }
      })
      .addCase(updateBudgetSpent.rejected, (state, action) => {
        // Silently fail for background updates
        console.error('Failed to update budget spent:', action.payload);
      });
  },
});

export const {
  clearError,
  clearSelectedBudget,
  setFilters,
  clearFilters,
} = budgetSlice.actions;
export default budgetSlice.reducer;



