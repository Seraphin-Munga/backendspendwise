export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO date string
  notes?: string;
  categoryId: number;
  categoryName?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface CreateExpenseData {
  description: string;
  amount: number;
  date: string; // ISO date string
  notes?: string;
  categoryId: number;
}

export interface UpdateExpenseData {
  id: number;
  description?: string;
  amount?: number;
  date?: string; // ISO date string
  notes?: string;
  categoryId?: number;
}

export interface ExpenseFilters {
  categoryId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpensesResponse {
  success: boolean;
  message?: string;
  data?: Expense[];
  total?: number;
}

export interface ExpenseResponse {
  success: boolean;
  message?: string;
  data?: Expense;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
}



