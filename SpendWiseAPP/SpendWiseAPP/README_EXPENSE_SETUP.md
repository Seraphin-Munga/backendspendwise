# Expense Service Integration

The expense service has been fully integrated with the backend API and Redux state management.

## Features

- ✅ Get all expenses
- ✅ Get expense by ID
- ✅ Create expense
- ✅ Update expense
- ✅ Delete expense
- ✅ Date range filtering
- ✅ Category filtering
- ✅ Amount range filtering
- ✅ Redux state management
- ✅ Automatic token handling
- ✅ Error handling
- ✅ Type-safe API calls

## API Endpoints

- `GET /api/expense` - Get all expenses for authenticated user
- `GET /api/expense/{id}` - Get expense by ID
- `POST /api/expense` - Create new expense
- `PUT /api/expense/{id}` - Update expense
- `DELETE /api/expense/{id}` - Delete expense
- `GET /api/expense/date-range?startDate={date}&endDate={date}` - Get expenses by date range

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchExpenses, 
  fetchExpenseById,
  createExpense,
  updateExpense,
  deleteExpense 
} from '../store/expenseSlice';

function ExpenseComponent() {
  const dispatch = useAppDispatch();
  const { expenses, isLoading, error } = useAppSelector(state => state.expenses);

  // Fetch all expenses
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Fetch with date range
  useEffect(() => {
    dispatch(fetchExpenses({
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z'
    }));
  }, [dispatch]);

  // Fetch with filters
  useEffect(() => {
    dispatch(fetchExpenses({
      categoryId: 1,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      minAmount: 10,
      maxAmount: 1000
    }));
  }, [dispatch]);

  // Create expense
  const handleCreate = async () => {
    await dispatch(createExpense({
      description: 'Grocery Shopping',
      amount: 150.00,
      date: new Date().toISOString(),
      categoryId: 1,
      notes: 'Weekly groceries'
    }));
  };

  // Update expense
  const handleUpdate = async (id: number) => {
    await dispatch(updateExpense({
      id,
      description: 'Updated Description',
      amount: 200.00
    }));
  };

  // Delete expense
  const handleDelete = async (id: number) => {
    await dispatch(deleteExpense(id));
  };

  return (
    // Your component JSX
  );
}
```

### Using Service Directly

```typescript
import { expenseService } from '../services/expenses';

// Get all expenses
const expenses = await expenseService.getExpenses();

// Get expenses with date range
const filteredExpenses = await expenseService.getExpenses({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
});

// Get expenses with filters
const categoryExpenses = await expenseService.getExpenses({
  categoryId: 1,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  minAmount: 10,
  maxAmount: 1000
});

// Get expense by ID
const expense = await expenseService.getExpenseById(1);

// Create expense
const newExpense = await expenseService.createExpense({
  description: 'Grocery Shopping',
  amount: 150.00,
  date: new Date().toISOString(),
  categoryId: 1,
  notes: 'Weekly groceries'
});

// Update expense
const updatedExpense = await expenseService.updateExpense({
  id: 1,
  description: 'Updated Description',
  amount: 200.00
});

// Delete expense
await expenseService.deleteExpense(1);
```

### Using Redux Actions

```typescript
import { useAppDispatch } from '../store';
import { 
  setFilters, 
  clearFilters,
  clearError,
  clearSelectedExpense
} from '../store/expenseSlice';

// Set filters
dispatch(setFilters({
  categoryId: 1,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
}));

// Clear filters
dispatch(clearFilters());

// Clear error
dispatch(clearError());

// Clear selected expense
dispatch(clearSelectedExpense());
```

## Data Types

### Expense

```typescript
interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO date string
  notes?: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
```

### CreateExpenseData

```typescript
interface CreateExpenseData {
  description: string;
  amount: number;
  date: string; // ISO date string
  notes?: string;
  categoryId: number;
}
```

### UpdateExpenseData

```typescript
interface UpdateExpenseData {
  id: number;
  description?: string;
  amount?: number;
  date?: string; // ISO date string
  notes?: string;
  categoryId?: number;
}
```

### ExpenseFilters

```typescript
interface ExpenseFilters {
  categoryId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  minAmount?: number;
  maxAmount?: number;
}
```

## Redux State

```typescript
interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  isLoading: boolean;
  error: string | null;
  filters: ExpenseFilters | null;
  total: number;
}
```

## Redux Actions

- `fetchExpenses(filters?)` - Fetch expenses with optional filters
- `fetchExpenseById(id)` - Fetch single expense by ID
- `createExpense(data)` - Create new expense
- `updateExpense(data)` - Update existing expense
- `deleteExpense(id)` - Delete expense
- `setFilters(filters)` - Set filter criteria
- `clearFilters()` - Clear filters
- `clearError()` - Clear error state
- `clearSelectedExpense()` - Clear selected expense

## Notes

1. **Category ID Required**: When creating an expense, you must provide a valid `categoryId`. Make sure the category exists before creating the expense.

2. **Date Format**: Use ISO 8601 format for dates (e.g., `'2024-01-01T00:00:00Z'`).

3. **Filtering**: 
   - Date range filtering is done on the backend (when both `startDate` and `endDate` are provided)
   - Category, minAmount, and maxAmount filtering is done on the client side

4. **Authentication**: All endpoints require authentication. Tokens are automatically included in requests.

5. **Error Handling**: Errors are automatically handled and stored in Redux state. Check `state.expenses.error` for error messages.

6. **Loading States**: Loading states are managed in Redux. Check `state.expenses.isLoading` for loading status.

7. **Category Information**: Category name is included when available (if expense has a category).

8. **Transaction Creation**: When an expense is created, a corresponding transaction is automatically created in the backend.

9. **Amount Validation**: Amount must be greater than 0.01 (validated on backend).

10. **Description Length**: Description has a maximum length of 500 characters (validated on backend).

11. **Notes Length**: Notes have a maximum length of 1000 characters (validated on backend).

## Integration with Transactions

When you create an expense, a transaction is automatically created. You can update the transaction list in Redux:

```typescript
import { addTransaction } from '../store/transactionSlice';

// After creating expense
const expense = await expenseService.createExpense(data);
dispatch(addTransaction({
  id: expense.id,
  type: 'Expense',
  description: expense.description,
  amount: -expense.amount, // Negative for expenses
  date: expense.date,
  categoryId: expense.categoryId,
  categoryName: expense.categoryName,
  notes: expense.notes,
  createdAt: expense.createdAt
}));
```

## Backend Validation

The backend validates:
- `description`: Required, max 500 characters
- `amount`: Required, must be >= 0.01
- `date`: Required, must be a valid date
- `categoryId`: Required, must exist in database
- `notes`: Optional, max 1000 characters

