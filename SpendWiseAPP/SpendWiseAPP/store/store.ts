import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expenseReducer from './expenseSlice';
import categoryReducer from './categorySlice';
import budgetReducer from './budgetSlice';
import incomeReducer from './incomeSlice';
import transactionReducer from './transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    categories: categoryReducer,
    budgets: budgetReducer,
    income: incomeReducer,
    transactions: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'auth/login/fulfilled',
          'auth/register/fulfilled',
          'expenses/createExpense/fulfilled',
          'expenses/updateExpense/fulfilled',
          'categories/createCategory/fulfilled',
          'categories/updateCategory/fulfilled',
          'budgets/createBudget/fulfilled',
          'budgets/updateBudget/fulfilled',
          'income/createIncome/fulfilled',
          'income/updateIncome/fulfilled',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

