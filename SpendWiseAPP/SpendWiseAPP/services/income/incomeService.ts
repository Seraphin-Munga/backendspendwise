import type {
  Income,
  CreateIncomeData,
  UpdateIncomeData,
  IncomeFilters,
  IncomesResponse,
  IncomeResponse,
  APIError,
} from './types';
import { API_BASE_URL } from '../../config/api';
import { authService } from '../auth';

// API endpoints for income
const INCOME_ENDPOINTS = {
  BASE: '/api/income',
  BY_ID: (id: number) => `/api/income/${id}`,
};

class IncomeService {
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
   * Get all incomes
   */
  async getIncomes(filters?: IncomeFilters): Promise<IncomesResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.minAmount !== undefined) queryParams.append('minAmount', filters.minAmount.toString());
        if (filters.maxAmount !== undefined) queryParams.append('maxAmount', filters.maxAmount.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${INCOME_ENDPOINTS.BASE}?${queryString}`
        : INCOME_ENDPOINTS.BASE;

      const incomes = await this.apiRequest<Income[]>(endpoint, {
        method: 'GET',
      });

      return {
        success: true,
        data: incomes,
        total: incomes.length,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch income. Please try again.',
      } as APIError;
    }
  }

  /**
   * Get income by ID
   */
  async getIncomeById(id: number): Promise<IncomeResponse> {
    try {
      const income = await this.apiRequest<Income>(
        INCOME_ENDPOINTS.BY_ID(id),
        {
          method: 'GET',
        }
      );

      return {
        success: true,
        data: income,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch income. Please try again.',
      } as APIError;
    }
  }

  /**
   * Create new income
   */
  async createIncome(data: CreateIncomeData): Promise<IncomeResponse> {
    try {
      const income = await this.apiRequest<Income>(
        INCOME_ENDPOINTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify({
            source: data.source,
            amount: data.amount,
            date: data.date,
            description: data.description,
          }),
        }
      );

      return {
        success: true,
        message: 'Income added successfully',
        data: income,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to add income. Please try again.',
      } as APIError;
    }
  }

  /**
   * Update income
   */
  async updateIncome(data: UpdateIncomeData): Promise<IncomeResponse> {
    try {
      const income = await this.apiRequest<Income>(
        INCOME_ENDPOINTS.BY_ID(data.id),
        {
          method: 'PUT',
          body: JSON.stringify({
            source: data.source,
            amount: data.amount,
            date: data.date,
            description: data.description,
          }),
        }
      );

      return {
        success: true,
        message: 'Income updated successfully',
        data: income,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update income. Please try again.',
      } as APIError;
    }
  }

  /**
   * Delete income
   */
  async deleteIncome(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await this.apiRequest(
        INCOME_ENDPOINTS.BY_ID(id),
        {
          method: 'DELETE',
        }
      );

      return {
        success: true,
        message: 'Income deleted successfully',
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete income. Please try again.',
      } as APIError;
    }
  }
}

export const incomeService = new IncomeService();
