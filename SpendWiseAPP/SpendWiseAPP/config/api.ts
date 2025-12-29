/**
 * API Configuration
 * Update the BASE_URL to match your backend API endpoint
 */

// For local development
export const API_BASE_URL = 'http://localhost:5002';

// For production - replace with your actual API URL
// export const API_BASE_URL = 'https://your-api-domain.com';

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    SEND_MOBILE_VERIFICATION: '/api/auth/send-mobile-verification',
    VERIFY_MOBILE_CODE: '/api/auth/verify-mobile-code',
    OTP_STATUS: '/api/auth/otp-status',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  BUDGET: {
    BASE: '/api/budget',
    BY_ID: (id: number) => `/api/budget/${id}`,
  },
  INCOME: {
    BASE: '/api/income',
    BY_ID: (id: number) => `/api/income/${id}`,
  },
  CATEGORY: {
    BASE: '/api/category',
    BY_ID: (id: number) => `/api/category/${id}`,
  },
  EXPENSE: {
    BASE: '/api/expense',
    BY_ID: (id: number) => `/api/expense/${id}`,
    DATE_RANGE: '/api/expense/date-range',
  },
  TRANSACTION: {
    BASE: '/api/transaction',
  },
} as const;

