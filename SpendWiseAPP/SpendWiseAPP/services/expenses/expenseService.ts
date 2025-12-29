import type {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  ExpenseFilters,
  ExpensesResponse,
  ExpenseResponse,
  APIError,
} from './types';
import { API_BASE_URL } from '../../config/api';
import { authService } from '../auth';

// API endpoints for expenses
const EXPENSE_ENDPOINTS = {
  BASE: '/api/expense',
  BY_ID: (id: number) => `/api/expense/${id}`,
  DATE_RANGE: '/api/expense/date-range',
};

class ExpenseService {
  /**
   * Get authorization headers
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await authService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Make API request with error handling
   */
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        message: data.message || `Request failed with status ${response.status}`,
        errors: data.errors,
        status: response.status,
      } as APIError;
    }

    return data as T;
  }

  /**
   * Get all expenses
   */
  async getExpenses(filters?: ExpenseFilters): Promise<ExpensesResponse> {
    try {
      let endpoint = EXPENSE_ENDPOINTS.BASE;

      // If date range filters are provided, use the date-range endpoint
      if (filters?.startDate && filters?.endDate) {
        const queryParams = new URLSearchParams();
        queryParams.append('startDate', filters.startDate);
        queryParams.append('endDate', filters.endDate);
        endpoint = `${EXPENSE_ENDPOINTS.DATE_RANGE}?${queryParams.toString()}`;
      }

      const expenses = await this.apiRequest<Expense[]>(endpoint, {
        method: 'GET',
      });

      // Apply client-side filtering for categoryId, minAmount, maxAmount
      let filteredExpenses = expenses;
      if (filters) {
        if (filters.categoryId) {
          filteredExpenses = filteredExpenses.filter(
            (expense) => expense.categoryId === filters.categoryId
          );
        }
        if (filters.minAmount !== undefined) {
          filteredExpenses = filteredExpenses.filter(
            (expense) => expense.amount >= filters.minAmount!
          );
        }
        if (filters.maxAmount !== undefined) {
          filteredExpenses = filteredExpenses.filter(
            (expense) => expense.amount <= filters.maxAmount!
          );
        }
      }

      return {
        success: true,
        data: filteredExpenses,
        total: filteredExpenses.length,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch expenses. Please try again.',
      } as APIError;
    }
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(id: number): Promise<ExpenseResponse> {
    try {
      const expense = await this.apiRequest<Expense>(
        EXPENSE_ENDPOINTS.BY_ID(id),
        {
          method: 'GET',
        }
      );

      return {
        success: true,
        data: expense,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch expense. Please try again.',
      } as APIError;
    }
  }

  /**
   * Create new expense
   */
  async createExpense(data: CreateExpenseData): Promise<ExpenseResponse> {
    try {
      const expense = await this.apiRequest<Expense>(
        EXPENSE_ENDPOINTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );

      return {
        success: true,
        message: 'Expense created successfully',
        data: expense,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create expense. Please try again.',
      } as APIError;
    }
  }

  /**
   * Update expense
   */
  async updateExpense(data: UpdateExpenseData): Promise<ExpenseResponse> {
    try {
      const { id, ...updateData } = data;
      const expense = await this.apiRequest<Expense>(
        EXPENSE_ENDPOINTS.BY_ID(id),
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
        }
      );

      return {
        success: true,
        message: 'Expense updated successfully',
        data: expense,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update expense. Please try again.',
      } as APIError;
    }
  }

  /**
   * Delete expense
   */
  async deleteExpense(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await this.apiRequest<void>(EXPENSE_ENDPOINTS.BY_ID(id), {
        method: 'DELETE',
      });

      return {
        success: true,
        message: 'Expense deleted successfully',
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete expense. Please try again.',
      } as APIError;
    }
  }
}

export const expenseService = new ExpenseService();



