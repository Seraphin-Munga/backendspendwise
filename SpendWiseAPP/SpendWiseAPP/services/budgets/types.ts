export interface Budget {
  id: number;
  name: string;
  description?: string;
  amount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryId: number;
  categoryName?: string;
  categoryEmoji?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface BudgetProgress {
  percentage: number;
  remaining: number;
  isOverBudget: boolean;
}

export interface CreateBudgetData {
  name: string;
  description?: string;
  amount: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  categoryId: number;
}

export interface UpdateBudgetData {
  id: number;
  name?: string;
  description?: string;
  amount?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  categoryId?: number;
}

export interface BudgetFilters {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}

export interface BudgetsResponse {
  success: boolean;
  message?: string;
  data?: Budget[];
  total?: number;
}

export interface BudgetResponse {
  success: boolean;
  message?: string;
  data?: Budget;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}
