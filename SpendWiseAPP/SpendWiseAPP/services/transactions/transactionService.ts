import type {
  Transaction,
  TransactionFilter,
  TransactionsResponse,
  APIError,
} from './types';
import { API_BASE_URL } from '../../config/api';
import { authService } from '../auth';

// API endpoints for transactions
const TRANSACTION_ENDPOINTS = {
  BASE: '/api/transaction',
};

class TransactionService {
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
   * Get all transactions
   */
  async getTransactions(filters?: TransactionFilter): Promise<TransactionsResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
      }

      const queryString = queryParams.toString();
      const endpoint = queryString 
        ? `${TRANSACTION_ENDPOINTS.BASE}?${queryString}`
        : TRANSACTION_ENDPOINTS.BASE;

      const transactions = await this.apiRequest<Transaction[]>(endpoint, {
        method: 'GET',
      });

      // Apply client-side filtering for type and categoryId
      let filteredTransactions = transactions;
      if (filters) {
        if (filters.type && filters.type !== 'all') {
          filteredTransactions = filteredTransactions.filter(
            t => t.type === filters.type
          );
        }
        if (filters.categoryId) {
          filteredTransactions = filteredTransactions.filter(
            t => t.categoryId === filters.categoryId
          );
        }
      }

      return {
        success: true,
        data: filteredTransactions,
        total: filteredTransactions.length,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch transactions. Please try again.',
      } as APIError;
    }
  }
}

export const transactionService = new TransactionService();

