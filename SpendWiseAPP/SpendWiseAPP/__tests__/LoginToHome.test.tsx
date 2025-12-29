import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import { LoginScreen } from '../screens/auth';

// Mock the MainLayout to avoid navigation container issues in tests
jest.mock('../layout/MainLayout', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockMainLayout() {
    return (
      <View testID="main-layout">
        <Text>Main Layout</Text>
      </View>
    );
  };
});

// Mock image assets
jest.mock('../assets/imgs/meeting-1453895_1280.png', () => 'meeting-image.png');

describe('Login to Home Screen Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render onboarding screen initially', () => {
    const { getByText } = render(<App />);
    
    // Check if onboarding screen is shown first
    expect(getByText('Skip')).toBeTruthy();
  });

  it('should navigate to login screen after skipping onboarding', async () => {
    const { getByText, getByPlaceholderText } = render(<App />);
    
    // Skip onboarding
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen to appear
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });
  });

  it('should show error when email is invalid', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);
    
    // Skip onboarding first
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    // Enter invalid email
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.press(signInButton);

    // Wait for validation error
    await waitFor(() => {
      expect(queryByText(/Please enter a valid email address/i)).toBeTruthy();
    });
  });

  it('should show error when password is invalid', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);
    
    // Skip onboarding first
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    // Enter valid email but invalid password
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'short');
    fireEvent.press(signInButton);

    // Wait for validation error
    await waitFor(() => {
      expect(queryByText(/Password must be at least 8 characters/i)).toBeTruthy();
    });
  });

  it('should successfully login and navigate to home screen', async () => {
    const { getByText, getByPlaceholderText, queryByTestId } = render(<App />);
    
    // Skip onboarding first
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    // Enter valid credentials
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.press(signInButton);

    // Wait for login to complete and home screen to appear
    await waitFor(
      () => {
        expect(queryByTestId('main-layout')).toBeTruthy();
      },
      { timeout: 3000 }
    );

    // Verify login screen is no longer visible
    expect(() => getByPlaceholderText('Enter your email')).toThrow();
  });

  it('should show loading state during login', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);
    
    // Skip onboarding first
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    // Enter valid credentials
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.press(signInButton);

    // Check for loading state
    await waitFor(() => {
      expect(queryByText('Signing in...')).toBeTruthy();
    });
  });

  it('should clear errors when user starts typing again', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<App />);
    
    // Skip onboarding first
    const skipButton = getByText('Skip');
    fireEvent.press(skipButton);

    // Wait for login screen
    await waitFor(() => {
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    });

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    // Trigger validation error
    fireEvent.changeText(emailInput, 'invalid');
    fireEvent.press(signInButton);

    // Wait for error to appear
    await waitFor(() => {
      expect(queryByText(/Please enter a valid email address/i)).toBeTruthy();
    });

    // Start typing valid email
    fireEvent.changeText(emailInput, 'test@example.com');

    // Error should be cleared
    await waitFor(() => {
      expect(queryByText(/Please enter a valid email address/i)).toBeFalsy();
    });
  });
});

describe('LoginScreen Component', () => {
  it('should render all login form elements', () => {
    const mockOnLoginSuccess = jest.fn();
    const mockOnSignUpPress = jest.fn();
    const mockOnForgotPasswordPress = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen
        onLoginSuccess={mockOnLoginSuccess}
        onSignUpPress={mockOnSignUpPress}
        onForgotPasswordPress={mockOnForgotPasswordPress}
      />
    );

    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByText('Forgot Password?')).toBeTruthy();
    expect(getByText('Don\'t have an account?')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('should call onLoginSuccess when login is successful', async () => {
    const mockOnLoginSuccess = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLoginSuccess={mockOnLoginSuccess} />
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');
    const signInButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.press(signInButton);

    await waitFor(
      () => {
        expect(mockOnLoginSuccess).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should call onSignUpPress when sign up link is pressed', () => {
    const mockOnSignUpPress = jest.fn();
    const { getByText } = render(
      <LoginScreen onSignUpPress={mockOnSignUpPress} />
    );

    const signUpLink = getByText('Sign Up');
    fireEvent.press(signUpLink);

    expect(mockOnSignUpPress).toHaveBeenCalled();
  });

  it('should call onForgotPasswordPress when forgot password is pressed', () => {
    const mockOnForgotPasswordPress = jest.fn();
    const { getByText } = render(
      <LoginScreen onForgotPasswordPress={mockOnForgotPasswordPress} />
    );

    const forgotPasswordLink = getByText('Forgot Password?');
    fireEvent.press(forgotPasswordLink);

    expect(mockOnForgotPasswordPress).toHaveBeenCalled();
  });
});

