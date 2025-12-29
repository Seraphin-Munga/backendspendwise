export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
};

/**
 * Validates a password
 * Requirements: at least 8 characters, contains uppercase, lowercase, and number
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
};

/**
 * Validates a password with optional custom requirements
 */
export const validatePasswordWithOptions = (
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecialChar?: boolean;
  } = {}
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = false,
  } = options;

  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character',
    };
  }

  return { isValid: true };
};

/**
 * Validates a phone number (basic validation)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return {
      isValid: false,
      error: 'Phone number is required',
    };
  }

  // Remove common formatting characters
  const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's all digits and has reasonable length
  if (!/^\d+$/.test(cleanedPhone)) {
    return {
      isValid: false,
      error: 'Phone number must contain only digits',
    };
  }

  if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }

  return { isValid: true };
};

/**
 * Validates a required field
 */
export const validateRequired = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true };
};

/**
 * Validates minimum length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validates maximum length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (value && value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validates that two values match (e.g., password confirmation)
 */
export const validateMatch = (
  value1: string,
  value2: string,
  fieldName: string = 'Fields'
): ValidationResult => {
  if (value1 !== value2) {
    return {
      isValid: false,
      error: `${fieldName} do not match`,
    };
  }

  return { isValid: true };
};

