# Budget Service Integration

The budget service has been fully integrated with the backend API and Redux state management.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Redux state management
- ✅ Automatic token handling
- ✅ Error handling
- ✅ Type-safe API calls

## API Endpoints

- `GET /api/budget` - Get all budgets for authenticated user
- `GET /api/budget/{id}` - Get budget by ID
- `POST /api/budget` - Create new budget
- `PUT /api/budget/{id}` - Update budget
- `DELETE /api/budget/{id}` - Delete budget

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchBudgets, 
  createBudget, 
  updateBudget, 
  deleteBudget 
} from '../store/budgetSlice';

function BudgetComponent() {
  const dispatch = useAppDispatch();
  const { budgets, isLoading, error } = useAppSelector(state => state.budgets);

  // Fetch budgets
  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  // Create budget
  const handleCreate = async () => {
    await dispatch(createBudget({
      name: 'Monthly Groceries',
      amount: 500,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      categoryId: 1,
      description: 'Monthly grocery budget'
    }));
  };

  // Update budget
  const handleUpdate = async (id: number) => {
    await dispatch(updateBudget({
      id,
      amount: 600
    }));
  };

  // Delete budget
  const handleDelete = async (id: number) => {
    await dispatch(deleteBudget(id));
  };

  return (
    // Your component JSX
  );
}
```

### Using Service Directly

```typescript
import { budgetService } from '../services/budgets';

// Get all budgets
const budgets = await budgetService.getBudgets();

// Get budget by ID
const budget = await budgetService.getBudgetById(1);

// Create budget
const newBudget = await budgetService.createBudget({
  name: 'Monthly Budget',
  amount: 1000,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-31T23:59:59Z',
  categoryId: 1
});

// Update budget
const updated = await budgetService.updateBudget({
  id: 1,
  amount: 1200
});

// Delete budget
await budgetService.deleteBudget(1);
```

## Data Types

### Budget

```typescript
interface Budget {
  id: number;
  name: string;
  description?: string;
  amount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryId: number;
  categoryName?: string; // Optional - fetch from categories
  categoryEmoji?: string; // Optional - fetch from categories
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
```

### CreateBudgetData

```typescript
interface CreateBudgetData {
  name: string;
  description?: string;
  amount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryId: number;
}
```

## Redux State

```typescript
interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
  filters: BudgetFilters | null;
  total: number;
}
```

## Redux Actions

- `fetchBudgets(filters?)` - Fetch all budgets
- `fetchBudgetById(id)` - Fetch single budget
- `createBudget(data)` - Create new budget
- `updateBudget(data)` - Update existing budget
- `deleteBudget(id)` - Delete budget
- `setFilters(filters)` - Set filter criteria
- `clearFilters()` - Clear filters
- `clearError()` - Clear error state
- `clearSelectedBudget()` - Clear selected budget

## Notes

1. **Category Information**: The backend returns `categoryId` only. To display category name/emoji, fetch categories separately and match by `categoryId`.

2. **Authentication**: All endpoints require authentication. Tokens are automatically included in requests.

3. **Date Format**: Use ISO 8601 format for dates (e.g., `'2024-01-01T00:00:00Z'`).

4. **Error Handling**: Errors are automatically handled and stored in Redux state. Check `state.budgets.error` for error messages.

5. **Loading States**: Loading states are managed in Redux. Check `state.budgets.isLoading` for loading status.

