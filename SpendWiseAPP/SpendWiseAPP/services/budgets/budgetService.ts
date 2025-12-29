import type {
  Budget,
  CreateBudgetData,
  UpdateBudgetData,
  BudgetFilters,
  BudgetsResponse,
  BudgetResponse,
  APIError,
} from './types';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { authService } from '../auth';

// API endpoints for budgets
const BUDGET_ENDPOINTS = {
  BASE: '/api/budget',
  BY_ID: (id: number) => `/api/budget/${id}`,
};

class BudgetService {
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
   * Get all budgets
   */
  async getBudgets(filters?: BudgetFilters): Promise<BudgetsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.categoryId) queryParams.append('categoryId', filters.categoryId.toString());
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
      }

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${BUDGET_ENDPOINTS.BASE}?${queryString}`
        : BUDGET_ENDPOINTS.BASE;

      const budgets = await this.apiRequest<Budget[]>(endpoint, {
        method: 'GET',
      });

      return {
        success: true,
        data: budgets,
        total: budgets.length,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch budgets. Please try again.',
      } as APIError;
    }
  }

  /**
   * Get budget by ID
   */
  async getBudgetById(id: number): Promise<BudgetResponse> {
    try {
      const budget = await this.apiRequest<Budget>(
        BUDGET_ENDPOINTS.BY_ID(id),
        {
          method: 'GET',
        }
      );

      return {
        success: true,
        data: budget,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch budget. Please try again.',
      } as APIError;
    }
  }

  /**
   * Create new budget
   */
  async createBudget(data: CreateBudgetData): Promise<BudgetResponse> {
    try {
      const budget = await this.apiRequest<Budget>(
        BUDGET_ENDPOINTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            amount: data.amount,
            startDate: data.startDate,
            endDate: data.endDate,
            categoryId: data.categoryId,
          }),
        }
      );

      return {
        success: true,
        message: 'Budget created successfully',
        data: budget,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create budget. Please try again.',
      } as APIError;
    }
  }

  /**
   * Update budget
   */
  async updateBudget(data: UpdateBudgetData): Promise<BudgetResponse> {
    try {
      const budget = await this.apiRequest<Budget>(
        BUDGET_ENDPOINTS.BY_ID(data.id),
        {
          method: 'PUT',
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            amount: data.amount,
            startDate: data.startDate,
            endDate: data.endDate,
            categoryId: data.categoryId,
          }),
        }
      );

      return {
        success: true,
        message: 'Budget updated successfully',
        data: budget,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update budget. Please try again.',
      } as APIError;
    }
  }

  /**
   * Delete budget
   */
  async deleteBudget(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await this.apiRequest(
        BUDGET_ENDPOINTS.BY_ID(id),
        {
          method: 'DELETE',
        }
      );

      return {
        success: true,
        message: 'Budget deleted successfully',
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete budget. Please try again.',
      } as APIError;
    }
  }
}

export const budgetService = new BudgetService();
