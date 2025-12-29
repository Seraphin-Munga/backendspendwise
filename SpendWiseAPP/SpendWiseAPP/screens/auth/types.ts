export interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onSignUpPress?: () => void;
}

export interface SignUpScreenProps {
  onSignUpSuccess?: () => void;
  onLoginPress?: () => void;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

