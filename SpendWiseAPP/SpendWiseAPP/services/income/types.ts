export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface CreateIncomeData {
  source: string;
  amount: number;
  date: string; // ISO date string
  description?: string;
}

export interface UpdateIncomeData {
  id: number;
  source?: string;
  amount?: number;
  date?: string; // ISO date string
  description?: string;
}

export interface IncomeFilters {
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  minAmount?: number;
  maxAmount?: number;
}

export interface IncomesResponse {
  success: boolean;
  message?: string;
  data?: Income[];
  total?: number;
}

export interface IncomeResponse {
  success: boolean;
  message?: string;
  data?: Income;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}
