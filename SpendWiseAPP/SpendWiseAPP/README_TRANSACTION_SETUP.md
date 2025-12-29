# Transaction Service Integration

The transaction service has been fully integrated with the backend API and Redux state management.

## Features

- ✅ Get all transactions
- ✅ Date range filtering
- ✅ Type filtering (Income/Expense)
- ✅ Category filtering
- ✅ Redux state management
- ✅ Automatic token handling
- ✅ Error handling
- ✅ Type-safe API calls
- ✅ Expenses shown as negative amounts

## API Endpoints

- `GET /api/transaction` - Get all transactions for authenticated user
- `GET /api/transaction?startDate={date}&endDate={date}` - Get transactions by date range

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { fetchTransactions, setFilters } from '../store/transactionSlice';

function TransactionComponent() {
  const dispatch = useAppDispatch();
  const { transactions, isLoading, error } = useAppSelector(state => state.transactions);

  // Fetch all transactions
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  // Fetch with date range
  useEffect(() => {
    dispatch(fetchTransactions({
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z'
    }));
  }, [dispatch]);

  // Fetch with filters
  useEffect(() => {
    dispatch(fetchTransactions({
      type: 'Expense',
      categoryId: 1,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z'
    }));
  }, [dispatch]);

  return (
    // Your component JSX
  );
}
```

### Using Service Directly

```typescript
import { transactionService } from '../services/transactions';

// Get all transactions
const transactions = await transactionService.getTransactions();

// Get transactions with date range
const filteredTransactions = await transactionService.getTransactions({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
});

// Get transactions with filters
const expenseTransactions = await transactionService.getTransactions({
  type: 'Expense',
  categoryId: 1,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
});
```

### Using Redux Actions

```typescript
import { useAppDispatch } from '../store';
import { 
  addTransaction, 
  updateTransaction, 
  removeTransaction 
} from '../store/transactionSlice';

// Add transaction (when expense/income is created)
dispatch(addTransaction({
  id: 1,
  type: 'Expense',
  description: 'Grocery Shopping',
  amount: -150.00, // Negative for expenses
  date: '2024-12-28T10:00:00Z',
  categoryId: 1,
  categoryName: 'Groceries',
  categoryEmoji: '🛒'
}));

// Update transaction
dispatch(updateTransaction({
  id: 1,
  type: 'Expense',
  description: 'Updated Description',
  amount: -200.00,
  // ... other fields
}));

// Remove transaction
dispatch(removeTransaction(1));
```

## Data Types

### Transaction

```typescript
interface Transaction {
  id: number;
  type: 'Income' | 'Expense';
  description: string;
  amount: number; // Negative for expenses, positive for income
  date: string; // ISO date string
  categoryId?: number;
  categoryName?: string;
  categoryEmoji?: string;
  notes?: string;
  createdAt: string; // ISO date string
}
```

### TransactionFilter

```typescript
interface TransactionFilter {
  type?: 'Income' | 'Expense' | 'all';
  categoryId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
}
```

## Redux State

```typescript
interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilter | null;
  total: number;
}
```

## Redux Actions

- `fetchTransactions(filters?)` - Fetch transactions with optional filters
- `setFilters(filters)` - Set filter criteria
- `clearFilters()` - Clear filters
- `clearError()` - Clear error state
- `addTransaction(transaction)` - Add transaction to list (for when expense/income created)
- `updateTransaction(transaction)` - Update transaction in list
- `removeTransaction(id)` - Remove transaction from list

## Notes

1. **Amount Sign**: Expenses are returned as **negative amounts**, income as **positive amounts**. This makes it easy to calculate net amounts.

2. **Transaction Creation**: Transactions are automatically created when expenses or incomes are created. You don't create transactions directly.

3. **Filtering**: 
   - Date range filtering is done on the backend
   - Type and category filtering is done on the client side

4. **Authentication**: All endpoints require authentication. Tokens are automatically included in requests.

5. **Date Format**: Use ISO 8601 format for dates (e.g., `'2024-01-01T00:00:00Z'`).

6. **Error Handling**: Errors are automatically handled and stored in Redux state. Check `state.transactions.error` for error messages.

7. **Loading States**: Loading states are managed in Redux. Check `state.transactions.isLoading` for loading status.

8. **Category Information**: Category name and emoji are included when available (if transaction has a category).

## Integration with Expenses and Income

When you create an expense or income, you can update the transaction list:

```typescript
// After creating expense
const expense = await expenseService.createExpense(data);
dispatch(addTransaction({
  id: expense.id,
  type: 'Expense',
  description: expense.description,
  amount: -expense.amount, // Negative
  date: expense.date,
  categoryId: expense.categoryId,
  // ...
}));

// After creating income
const income = await incomeService.createIncome(data);
dispatch(addTransaction({
  id: income.id,
  type: 'Income',
  description: income.source,
  amount: income.amount, // Positive
  date: income.date,
  // ...
}));
```

