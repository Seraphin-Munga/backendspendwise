# Category Service Integration

The category service has been fully integrated with the backend API and Redux state management.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Redux state management
- ✅ Automatic token handling
- ✅ Error handling
- ✅ Type-safe API calls
- ✅ Emoji support

## API Endpoints

- `GET /api/category` - Get all categories for authenticated user
- `GET /api/category/{id}` - Get category by ID
- `POST /api/category` - Create new category
- `PUT /api/category/{id}` - Update category
- `DELETE /api/category/{id}` - Delete category

## Usage Examples

### Using Redux Thunks

```typescript
import { useAppDispatch, useAppSelector } from '../store';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../store/categorySlice';

function CategoryComponent() {
  const dispatch = useAppDispatch();
  const { categories, isLoading, error } = useAppSelector(state => state.categories);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Create category
  const handleCreate = async () => {
    await dispatch(createCategory({
      name: 'Groceries',
      emoji: '🛒',
      description: 'Food and household items'
    }));
  };

  // Update category
  const handleUpdate = async (id: number) => {
    await dispatch(updateCategory({
      id,
      emoji: '🍔'
    }));
  };

  // Delete category
  const handleDelete = async (id: number) => {
    await dispatch(deleteCategory(id));
  };

  return (
    // Your component JSX
  );
}
```

### Using Service Directly

```typescript
import { categoryService } from '../services/categories';

// Get all categories
const categories = await categoryService.getCategories();

// Get category by ID
const category = await categoryService.getCategoryById(1);

// Create category
const newCategory = await categoryService.createCategory({
  name: 'Transportation',
  emoji: '🚗',
  description: 'Travel expenses'
});

// Update category
const updated = await categoryService.updateCategory({
  id: 1,
  name: 'Food & Dining',
  emoji: '🍽️'
});

// Delete category
await categoryService.deleteCategory(1);
```

## Data Types

### Category

```typescript
interface Category {
  id: number;
  name: string;
  emoji?: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}
```

### CreateCategoryData

```typescript
interface CreateCategoryData {
  name: string;
  emoji?: string;
  description?: string;
}
```

## Redux State

```typescript
interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  total: number;
}
```

## Redux Actions

- `fetchCategories()` - Fetch all categories
- `fetchCategoryById(id)` - Fetch single category
- `createCategory(data)` - Create new category
- `updateCategory(data)` - Update existing category
- `deleteCategory(id)` - Delete category
- `clearError()` - Clear error state
- `clearSelectedCategory()` - Clear selected category

## Notes

1. **Emoji Field**: The backend uses `emoji` (string) instead of `icon` and `color`. You can store emoji characters directly (e.g., `'🛒'`, `'🍔'`).

2. **Unique Names**: Category names must be unique per user. The backend enforces this.

3. **Authentication**: All endpoints require authentication. Tokens are automatically included in requests.

4. **Error Handling**: Errors are automatically handled and stored in Redux state. Check `state.categories.error` for error messages.

5. **Loading States**: Loading states are managed in Redux. Check `state.categories.isLoading` for loading status.

6. **User-Specific**: Categories are user-specific. Each user only sees their own categories.

## Migration Notes

If you have existing code using `icon` and `color` fields:
- Replace `icon` with `emoji` (use emoji characters)
- Remove `color` field (not supported by backend)
- Update `id` from `string` to `number`

