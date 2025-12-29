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
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateRequired,
  validateMatch,
} from '../../helpers/validations';

// Import meeting image
const meetingImage = require('../../assets/imgs/meeting-1453895_1280.png');

interface RegisterScreenProps {
  onRegisterSuccess?: (email: string) => void;
  onLoginPress?: () => void;
}

export default function RegisterScreen({
  onRegisterSuccess,
  onLoginPress,
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Reset errors
    setFullNameError('');
    setEmailError('');
    setMobileNumberError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    const fullNameValidation = validateRequired(fullName, 'Full name');
    const emailValidation = validateEmail(email);
    const mobileValidation = validatePhoneNumber(mobileNumber);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateMatch(
      password,
      confirmPassword,
      'Passwords'
    );

    let hasError = false;

    if (!fullNameValidation.isValid) {
      setFullNameError(fullNameValidation.error || '');
      hasError = true;
    }

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      hasError = true;
    }

    if (!mobileValidation.isValid) {
      setMobileNumberError(mobileValidation.error || '');
      hasError = true;
    }

    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      hasError = true;
    }

    if (!confirmPasswordValidation.isValid) {
      setConfirmPasswordError(confirmPasswordValidation.error || '');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Simulate registration API call
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (onRegisterSuccess) {
        onRegisterSuccess(email);
      } else {
        Alert.alert('Success', 'Registration successful!');
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError) {
      setFullNameError('');
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleMobileNumberChange = (text: string) => {
    setMobileNumber(text);
    if (mobileNumberError) {
      setMobileNumberError('');
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError('');
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
        showsVerticalScrollIndicator={false}
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

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, fullNameError && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={handleFullNameChange}
                autoCapitalize="words"
                autoCorrect={false}
              />
              {fullNameError ? (
                <Text style={styles.errorText}>{fullNameError}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, emailError && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={[styles.input, mobileNumberError && styles.inputError]}
                placeholder="Enter your mobile number"
                placeholderTextColor="#999"
                value={mobileNumber}
                onChangeText={handleMobileNumberChange}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {mobileNumberError ? (
                <Text style={styles.errorText}>{mobileNumberError}</Text>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordError && styles.inputError]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmPasswordError && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={onLoginPress}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
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
  registerButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});

