# Authentication Service Setup

This document explains how to configure and use the authentication service integrated with the SpendWise API backend.

## Configuration

### 1. Update API Base URL

Edit `config/api.ts` and update the `API_BASE_URL` constant:

```typescript
// For local development
export const API_BASE_URL = 'http://localhost:5000';

// For production
export const API_BASE_URL = 'https://your-api-domain.com';
```

### 2. Install Dependencies

The authentication service requires `@react-native-async-storage/async-storage` for token storage:

```bash
npm install @react-native-async-storage/async-storage
```

## API Endpoints

The authentication service integrates with the following backend endpoints:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/send-mobile-verification` - Send OTP to mobile (requires auth)
- `POST /api/auth/verify-mobile-code` - Verify mobile OTP (requires auth)
- `GET /api/auth/otp-status` - Get OTP status (requires auth)
- `POST /api/auth/forgot-password` - Request password reset via mobile
- `POST /api/auth/reset-password` - Reset password with OTP

## Usage Examples

### Login

```typescript
import { authService } from './services/auth';

try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  // Tokens are automatically stored
  console.log('Login successful:', response);
  console.log('Requires mobile verification:', response.requiresMobileVerification);
  console.log('OTP Code (if provided):', response.otpCode);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Register

```typescript
try {
  const response = await authService.register({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    mobileNumber: '+1234567890' // Optional
  });
  
  // If mobile number provided, OTP will be sent automatically
  if (response.otpCode) {
    console.log('OTP Code:', response.otpCode);
  }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Mobile Verification

```typescript
// Send verification code
try {
  await authService.sendMobileVerificationCode();
  console.log('Verification code sent');
} catch (error) {
  console.error('Failed to send code:', error.message);
}

// Verify code
try {
  await authService.verifyMobileCode({ code: '123456' });
  console.log('Mobile number verified');
} catch (error) {
  console.error('Verification failed:', error.message);
}

// Check OTP status
try {
  const status = await authService.getOtpStatus();
  console.log('Has OTP:', status.hasOtp);
  console.log('Is Expired:', status.isExpired);
  console.log('Seconds Remaining:', status.secondsRemaining);
} catch (error) {
  console.error('Failed to get status:', error.message);
}
```

### Forgot Password

```typescript
try {
  await authService.forgotPassword({
    mobileNumber: '+1234567890'
  });
  console.log('Password reset code sent');
} catch (error) {
  console.error('Failed to send reset code:', error.message);
}
```

### Reset Password

```typescript
try {
  await authService.resetPassword({
    mobileNumber: '+1234567890',
    otpCode: '123456',
    newPassword: 'newpassword123'
  });
  console.log('Password reset successful');
} catch (error) {
  console.error('Password reset failed:', error.message);
}
```

### Token Management

```typescript
// Check if authenticated
const isAuth = await authService.isAuthenticated();

// Get current token
const token = await authService.getToken();

// Refresh token
try {
  const response = await authService.refreshToken();
  console.log('Token refreshed');
} catch (error) {
  console.error('Token refresh failed:', error.message);
}

// Logout
await authService.logout();
```

## Response Types

### AuthResponse

```typescript
{
  token: string;
  refreshToken: string;
  expiration: string; // ISO date string
  requiresMobileVerification: boolean;
  message?: string;
  otpCode?: string; // Provided during registration if mobile number included
}
```

### OTPStatus

```typescript
{
  hasOtp: boolean;
  isExpired: boolean;
  expiresAt?: string; // ISO date string
  secondsRemaining?: number;
  isMobileNumberConfirmed: boolean;
}
```

## Error Handling

All methods throw `APIError` objects:

```typescript
interface APIError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}
```

Example error handling:

```typescript
try {
  await authService.login(credentials);
} catch (error) {
  if (error.status === 401) {
    // Unauthorized
  } else if (error.errors) {
    // Validation errors
    Object.keys(error.errors).forEach(key => {
      console.error(`${key}:`, error.errors[key]);
    });
  } else {
    console.error(error.message);
  }
}
```

## Token Storage

Tokens are automatically stored using:
- **React Native**: `@react-native-async-storage/async-storage`
- **Web**: `localStorage`

The storage utility (`utils/storage.ts`) handles platform differences automatically.

## Notes

1. **Mobile Number Format**: Use international format (e.g., `+1234567890`)
2. **OTP Expiration**: OTPs expire after a set time (check backend configuration)
3. **Token Refresh**: Refresh tokens automatically when they expire (if implemented in your app)
4. **Mobile Verification**: Required before login if mobile number is not confirmed
5. **Password Reset**: Uses mobile number instead of email for security

