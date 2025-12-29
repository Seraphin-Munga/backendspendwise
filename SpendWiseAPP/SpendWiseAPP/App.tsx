import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import { OnboardingScreen } from './screens/onboarding';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen, ResetPasswordScreen, OTPScreen } from './screens/auth';
import { MainLayout } from './layout';
import { useAppSelector } from './store';

function AppContent() {
  const { isAuthenticated, otpEmail } = useAppSelector((state) => state.auth);
  const [showOnboarding, setShowOnboarding] = React.useState<boolean>(true);
  const [showLogin, setShowLogin] = React.useState<boolean>(false);
  const [showRegister, setShowRegister] = React.useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState<boolean>(false);
  const [showResetPassword, setShowResetPassword] = React.useState<boolean>(false);
  const [showOTP, setShowOTP] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      setShowOnboarding(false);
      setShowLogin(false);
      setShowRegister(false);
      setShowOTP(false);
      setShowForgotPassword(false);
      setShowResetPassword(false);
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (otpEmail) {
      setShowOTP(true);
      setShowRegister(false);
    }
  }, [otpEmail]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowLogin(true);
    // TODO: Save onboarding completion status to AsyncStorage
    // to prevent showing it again on app restart
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
    // OTP screen will be shown automatically via Redux state
  };

  const handleOTPVerifySuccess = () => {
    setShowOTP(false);
  };

  const handleNavigateToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleNavigateToLogin = () => {
    setShowRegister(false);
    setShowForgotPassword(false);
    setShowOTP(false);
    setShowLogin(true);
  };

  const handleNavigateToForgotPassword = () => {
    setShowLogin(false);
    setShowForgotPassword(true);
  };

  const handleNavigateToResetPassword = () => {
    setShowForgotPassword(false);
    setShowResetPassword(true);
  };

  const handleResetPasswordSuccess = () => {
    setShowResetPassword(false);
    setShowLogin(true);
  };

  // Show main app if authenticated
  if (isAuthenticated) {
    return <MainLayout />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (showOTP) {
    return (
      <OTPScreen
        onVerifySuccess={handleOTPVerifySuccess}
        email={otpEmail || ''}
      />
    );
  }

  if (showResetPassword) {
    return (
      <ResetPasswordScreen
        onResetSuccess={handleResetPasswordSuccess}
        onBackToLogin={handleNavigateToLogin}
      />
    );
  }

  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen
        onResetSuccess={handleResetPasswordSuccess}
        onBackToLogin={handleNavigateToLogin}
        onNavigateToReset={handleNavigateToResetPassword}
      />
    );
  }

  if (showRegister) {
    return (
      <RegisterScreen
        onRegisterSuccess={handleRegisterSuccess}
        onLoginPress={handleNavigateToLogin}
      />
    );
  }

  if (showLogin) {
    return (
      <LoginScreen
        onSignUpPress={handleNavigateToRegister}
        onForgotPasswordPress={handleNavigateToForgotPassword}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to SpendWise!</Text>
      <Text style={styles.subtitle}>Start tracking your expenses</Text>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
});
