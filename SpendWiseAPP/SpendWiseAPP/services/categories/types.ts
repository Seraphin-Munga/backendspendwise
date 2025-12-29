export interface Category {
  id: number;
  name: string;
  emoji?: string;
  description?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface CreateCategoryData {
  name: string;
  emoji?: string;
  description?: string;
}

export interface UpdateCategoryData {
  id: number;
  name?: string;
  emoji?: string;
  description?: string;
}

export interface CategoriesResponse {
  success: boolean;
  message?: string;
  data?: Category[];
  total?: number;
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: Category;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}
