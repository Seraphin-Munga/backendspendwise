import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { transactionService } from '../services/transactions';
import type {
  Transaction,
  TransactionFilter,
} from '../services/transactions/types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilter | null;
  total: number;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  filters: null,
  total: 0,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (filters?: TransactionFilter, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactions(filters);
      if (response.success && response.data) {
        return {
          transactions: response.data,
          total: response.total || response.data.length,
        };
      }
      return rejectWithValue(response.message || 'Failed to fetch transactions');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch transactions');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<TransactionFilter | null>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = null;
    },
    // Add transaction to list (when created via expense/income)
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.total += 1;
    },
    // Update transaction in list
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    // Remove transaction from list
    removeTransaction: (state, action: PayloadAction<number>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      state.total -= 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  addTransaction,
  updateTransaction,
  removeTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;

