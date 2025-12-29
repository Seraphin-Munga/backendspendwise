import type {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoriesResponse,
  CategoryResponse,
  APIError,
} from './types';
import { API_BASE_URL } from '../../config/api';
import { authService } from '../auth';

// API endpoints for categories
const CATEGORY_ENDPOINTS = {
  BASE: '/api/category',
  BY_ID: (id: number) => `/api/category/${id}`,
};

class CategoryService {
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
   * Get all categories
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const categories = await this.apiRequest<Category[]>(
        CATEGORY_ENDPOINTS.BASE,
        {
          method: 'GET',
        }
      );

      return {
        success: true,
        data: categories,
        total: categories.length,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch categories. Please try again.',
      } as APIError;
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<CategoryResponse> {
    try {
      const category = await this.apiRequest<Category>(
        CATEGORY_ENDPOINTS.BY_ID(id),
        {
          method: 'GET',
        }
      );

      return {
        success: true,
        data: category,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch category. Please try again.',
      } as APIError;
    }
  }

  /**
   * Create new category
   */
  async createCategory(data: CreateCategoryData): Promise<CategoryResponse> {
    try {
      const category = await this.apiRequest<Category>(
        CATEGORY_ENDPOINTS.BASE,
        {
          method: 'POST',
          body: JSON.stringify({
            name: data.name,
            emoji: data.emoji,
            description: data.description,
          }),
        }
      );

      return {
        success: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create category. Please try again.',
      } as APIError;
    }
  }

  /**
   * Update category
   */
  async updateCategory(data: UpdateCategoryData): Promise<CategoryResponse> {
    try {
      const category = await this.apiRequest<Category>(
        CATEGORY_ENDPOINTS.BY_ID(data.id),
        {
          method: 'PUT',
          body: JSON.stringify({
            name: data.name,
            emoji: data.emoji,
            description: data.description,
          }),
        }
      );

      return {
        success: true,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update category. Please try again.',
      } as APIError;
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await this.apiRequest(
        CATEGORY_ENDPOINTS.BY_ID(id),
        {
          method: 'DELETE',
        }
      );

      return {
        success: true,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw {
        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete category. Please try again.',
      } as APIError;
    }
  }
}

export const categoryService = new CategoryService();
