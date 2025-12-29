import type {
  LoginCredentials,
  RegisterData,
  OTPData,
  ForgotPasswordData,
  ResetPasswordData,
  AuthResponse,
  OTPResponse,
  OTPStatus,
  APIError,
} from './types';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { storage } from '../../utils/storage';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

class AuthService {
  /**
   * Get stored token
   */
  async getToken(): Promise<string | null> {
    return await storage.getItem(TOKEN_KEY);
  }

  /**
   * Store token
   */
  async setToken(token: string): Promise<void> {
    await storage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Store refresh token
   */
  async setRefreshToken(refreshToken: string): Promise<void> {
    await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Remove tokens
   */
  async removeTokens(): Promise<void> {
    await storage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  }

  /**
   * Get authorization header
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
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
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.apiRequest<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );

      // Store tokens
      await this.setToken(response.token);
      await this.setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Login failed. Please try again.',
      } as APIError;
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.apiRequest<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        {
          method: 'POST',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNumber: data.mobileNumber,
          }),
        }
      );

      // Store tokens if provided
      if (response.token) {
        await this.setToken(response.token);
        await this.setRefreshToken(response.refreshToken);
      }

      return response;
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Registration failed. Please try again.',
      } as APIError;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw { message: 'No refresh token available' } as APIError;
      }

      const response = await this.apiRequest<AuthResponse>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        }
      );

      // Update stored tokens
      await this.setToken(response.token);
      await this.setRefreshToken(response.refreshToken);

      return response;
    } catch (error) {
      // If refresh fails, clear tokens
      await this.removeTokens();
      throw {
        message: error instanceof Error ? error.message : 'Token refresh failed',
      } as APIError;
    }
  }

  /**
   * Send mobile verification code
   */
  async sendMobileVerificationCode(): Promise<OTPResponse> {
    try {
      return await this.apiRequest<OTPResponse>(
        API_ENDPOINTS.AUTH.SEND_MOBILE_VERIFICATION,
        {
          method: 'POST',
        }
      );
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Failed to send verification code. Please try again.',
      } as APIError;
    }
  }

  /**
   * Verify mobile code
   */
  async verifyMobileCode(data: OTPData): Promise<OTPResponse> {
    try {
      return await this.apiRequest<OTPResponse>(
        API_ENDPOINTS.AUTH.VERIFY_MOBILE_CODE,
        {
          method: 'POST',
          body: JSON.stringify({
            code: data.code,
          }),
        }
      );
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'OTP verification failed. Please try again.',
      } as APIError;
    }
  }

  /**
   * Get OTP status
   */
  async getOtpStatus(): Promise<OTPStatus> {
    try {
      return await this.apiRequest<OTPStatus>(
        API_ENDPOINTS.AUTH.OTP_STATUS,
        {
          method: 'GET',
        }
      );
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Failed to get OTP status.',
      } as APIError;
    }
  }

  /**
   * Request password reset (Forgot Password)
   */
  async forgotPassword(data: ForgotPasswordData): Promise<OTPResponse> {
    try {
      return await this.apiRequest<OTPResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify({
            mobileNumber: data.mobileNumber,
          }),
        }
      );
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Failed to send reset code. Please try again.',
      } as APIError;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(data: ResetPasswordData): Promise<OTPResponse> {
    try {
      return await this.apiRequest<OTPResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        {
          method: 'POST',
          body: JSON.stringify({
            mobileNumber: data.mobileNumber,
            otpCode: data.otpCode,
            newPassword: data.newPassword,
          }),
        }
      );
    } catch (error) {
      throw {
        message: error instanceof Error ? error.message : 'Password reset failed. Please try again.',
      } as APIError;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.apiRequest(
        API_ENDPOINTS.AUTH.LOGOUT,
        {
          method: 'POST',
        }
      );
    } catch (error) {
      // Even if API call fails, we should still logout locally
      console.error('Logout error:', error);
    } finally {
      // Always remove tokens locally
      await this.removeTokens();
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
