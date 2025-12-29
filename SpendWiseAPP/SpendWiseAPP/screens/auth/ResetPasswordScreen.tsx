import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { validatePassword, validateMatch } from '../../helpers/validations';

// Import meeting image
const meetingImage = require('../../assets/imgs/meeting-1453895_1280.png');

interface ResetPasswordScreenProps {
  onResetSuccess?: () => void;
  onBackToLogin?: () => void;
  resetToken?: string; // Token from email link
}

export default function ResetPasswordScreen({
  onResetSuccess,
  onBackToLogin,
  resetToken,
}: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    // Reset errors
    setNewPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    const passwordValidation = validatePassword(newPassword);
    const confirmPasswordValidation = validateMatch(
      newPassword,
      confirmPassword,
      'Passwords'
    );

    let hasError = false;

    if (!passwordValidation.isValid) {
      setNewPasswordError(passwordValidation.error || '');
      hasError = true;
    }

    if (!confirmPasswordValidation.isValid) {
      setConfirmPasswordError(confirmPasswordValidation.error || '');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Simulate password reset API call
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Include resetToken in the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);

      if (onResetSuccess) {
        // Delay navigation to show success message
        setTimeout(() => {
          onResetSuccess();
        }, 2000);
      } else {
        Alert.alert(
          'Success',
          'Your password has been reset successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onBackToLogin) {
                  onBackToLogin();
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    if (newPasswordError) {
      setNewPasswordError('');
    }
    // Also clear confirm password error if passwords match
    if (confirmPassword && text === confirmPassword && confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Meeting Image */}
          <View style={styles.imageContainer}>
            <Image
              source={meetingImage}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {isSuccess
                ? 'Your password has been reset successfully!'
                : 'Enter your new password below'}
            </Text>
          </View>

          {/* Form */}
          {!isSuccess ? (
            <View style={styles.form}>
              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={[styles.input, newPasswordError && styles.inputError]}
                  placeholder="Enter your new password"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={handleNewPasswordChange}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {newPasswordError ? (
                  <Text style={styles.errorText}>{newPasswordError}</Text>
                ) : null}
                <Text style={styles.helperText}>
                  Must be at least 8 characters with uppercase, lowercase, and number
                </Text>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    confirmPasswordError && styles.inputError,
                  ]}
                  placeholder="Confirm your new password"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  isLoading && styles.resetButtonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <Text style={styles.resetButtonText}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Text>
              </TouchableOpacity>

              {/* Back to Login Link */}
              <View style={styles.backToLoginContainer}>
                <Text style={styles.backToLoginText}>Remember your password? </Text>
                <TouchableOpacity onPress={onBackToLogin}>
                  <Text style={styles.backToLoginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successIconText}>✓</Text>
              </View>
              <Text style={styles.successText}>
                Password Reset Successful!
              </Text>
              <Text style={styles.successSubtext}>
                Your password has been changed successfully. You can now sign in with your new password.
              </Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBackToLogin}
              >
                <Text style={styles.backButtonText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    marginTop: 40,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: '#666666',
  },
  backToLoginLink: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

