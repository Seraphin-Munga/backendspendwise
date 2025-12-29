export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber?: string;
}

export interface OTPData {
  code: string;
}

export interface ForgotPasswordData {
  mobileNumber: string;
}

export interface ResetPasswordData {
  mobileNumber: string;
  otpCode: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  requiresMobileVerification: boolean;
  message?: string;
  otpCode?: string;
}

export interface OTPResponse {
  message: string;
}

export interface OTPStatus {
  hasOtp: boolean;
  isExpired: boolean;
  expiresAt?: string;
  secondsRemaining?: number;
  isMobileNumberConfirmed: boolean;
}

export interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
}



