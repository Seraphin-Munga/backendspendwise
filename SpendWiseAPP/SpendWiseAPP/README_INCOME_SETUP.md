# Income Service Integration

The income service has been fully integrated with the backend API and Redux state management.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Redux state management
- ✅ Automatic token handling
- ✅ Error handling
- ✅ Type-safe API calls
- ✅ Date range filtering

## API Endpoints

- `GET /api/income` - Get all incomes for authenticated user
- `GET /api/income/{id}` - Get income by ID
- `POST /api/income` - Create new income
- `PUT /api/income/{id}` - Update income
- `DELETE /api/income/{id}` - Delete income

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchIncomes, 
  createIncome, 
  updateIncome, 
  deleteIncome 
} from '../store/incomeSlice';

function IncomeComponent() {
  const dispatch = useAppDispatch();
  const { incomes, isLoading, error } = useAppSelector(state => state.income);

  // Fetch incomes
  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  // Fetch with filters
  useEffect(() => {
    dispatch(fetchIncomes({
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      minAmount: 100
    }));
  }, [dispatch]);

  // Create income
  const handleCreate = async () => {
    await dispatch(createIncome({
      source: 'Salary',
      amount: 3000,
      date: new Date().toISOString(),
      description: 'Monthly salary'
    }));
  };

  // Update income
  const handleUpdate = async (id: number) => {
    await dispatch(updateIncome({
      id,
      amount: 3500
    }));
  };

  // Delete income
  const handleDelete = async (id: number) => {
    await dispatch(deleteIncome(id));
  };

  return (
    // Your component JSX
  );
}
```

### Using Service Directly

```typescript
import { incomeService } from '../services/income';

// Get all incomes
const incomes = await incomeService.getIncomes();

// Get incomes with filters
const filteredIncomes = await incomeService.getIncomes({
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  minAmount: 100,
  maxAmount: 5000
});

// Get income by ID
const income = await incomeService.getIncomeById(1);

// Create income
const newIncome = await incomeService.createIncome({
  source: 'Freelance Work',
  amount: 500,
  date: new Date().toISOString(),
  description: 'Web development project'
});

// Update income
const updated = await incomeService.updateIncome({
  id: 1,
  amount: 600
});

// Delete income
await incomeService.deleteIncome(1);
```

## Data Types

### Income

```typescript
interface Income {
  id: number;
  source: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
```

### CreateIncomeData

```typescript
interface CreateIncomeData {
  source: string;
  amount: number;
  date: string; // ISO date string - REQUIRED
  description?: string;
}
```

### IncomeFilters

```typescript
interface IncomeFilters {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  minAmount?: number;
  maxAmount?: number;
}
```

## Redux State

```typescript
interface IncomeState {
  incomes: Income[];
  selectedIncome: Income | null;
  isLoading: boolean;
  error: string | null;
  filters: IncomeFilters | null;
  total: number;
}
```

## Redux Actions

- `fetchIncomes(filters?)` - Fetch all incomes with optional filters
- `fetchIncomeById(id)` - Fetch single income
- `createIncome(data)` - Create new income
- `updateIncome(data)` - Update existing income
- `deleteIncome(id)` - Delete income
- `setFilters(filters)` - Set filter criteria
- `clearFilters()` - Clear filters
- `clearError()` - Clear error state
- `clearSelectedIncome()` - Clear selected income

## Notes

1. **Source Field**: The backend uses `source` instead of `title` or `category`. This represents where the income came from (e.g., "Salary", "Freelance", "Investment").

2. **Date Field**: The `date` field is **required** when creating income. Use ISO 8601 format (e.g., `new Date().toISOString()`).

3. **Authentication**: All endpoints require authentication. Tokens are automatically included in requests.

4. **Date Format**: Use ISO 8601 format for dates (e.g., `'2024-01-01T00:00:00Z'`).

5. **Error Handling**: Errors are automatically handled and stored in Redux state. Check `state.income.error` for error messages.

6. **Loading States**: Loading states are managed in Redux. Check `state.income.isLoading` for loading status.

7. **Filtering**: You can filter incomes by date range and amount range using the `IncomeFilters` interface.

