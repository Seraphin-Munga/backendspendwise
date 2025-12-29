import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { expenseService } from '../services/expenses';
import type {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  ExpenseFilters,
} from '../services/expenses/types';

interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  filters: ExpenseFilters | null;
  total: number;
}

const initialState: ExpenseState = {
  expenses: [],
  selectedExpense: null,
  isLoading: false,
  error: null,
  filters: null,
  total: 0,
};

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (filters?: ExpenseFilters, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenses(filters);
      if (response.success && response.data) {
        return {
          expenses: response.data,
          total: response.total || response.data.length,
        };
      }
      return rejectWithValue(response.message || 'Failed to fetch expenses');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch expenses');
    }
  }
);

export const fetchExpenseById = createAsyncThunk(
  'expenses/fetchExpenseById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await expenseService.getExpenseById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch expense');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch expense');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (data: CreateExpenseData, { rejectWithValue }) => {
    try {
      const response = await expenseService.createExpense(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create expense');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async (data: UpdateExpenseData, { rejectWithValue }) => {
    try {
      const response = await expenseService.updateExpense(data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update expense');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await expenseService.deleteExpense(id);
      if (response.success) {
        // Refetch expenses after deletion
        dispatch(fetchExpenses());
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete expense');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete expense');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedExpense: (state) => {
      state.selectedExpense = null;
    },
    setFilters: (state, action: PayloadAction<ExpenseFilters | null>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.expenses;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Expense By ID
    builder
      .addCase(fetchExpenseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedExpense = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Expense
    builder
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new expense to the beginning of the list
        state.expenses.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Expense
    builder
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(
          (exp) => exp.id === action.payload.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        if (state.selectedExpense?.id === action.payload.id) {
          state.selectedExpense = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Expense
    builder
      .addCase(deleteExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = state.expenses.filter(
          (exp) => exp.id !== action.payload
        );
        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null;
        }
        state.total -= 1;
        state.error = null;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSelectedExpense,
  setFilters,
  clearFilters,
} = expenseSlice.actions;
export default expenseSlice.reducer;



