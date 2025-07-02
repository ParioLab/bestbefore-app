/**
 * @file src/screens/AuthScreen.tsx
 * @description
 * Screen for handling user authentication: sign up or log in.
 * Renders input fields and performs validation, then calls AuthContext methods.
 *
 * Key features:
 * - Modeled for both "signup" and "login" based on route params.
 * - Inputs: email, password, confirmPassword (signup only).
 * - Inline validation for required fields and password confirmation.
 * - Displays errors from Supabase responses.
 *
 * @dependencies
 * - react-navigation: For navigation and route params.
 * - useAuth: Custom hook providing signUp and signIn functions.
 * - CustomTextInput: Reusable styled text input component.
 *
 * @notes
 * - Ensure AuthContext is correctly configured and wrapping the app.
 * - After successful authentication, navigates to "Main" stack.
 */

import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import CustomTextInput from '../components/CustomTextInput';
import { useAuth } from '../context/AuthContext';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { signIn, signUp, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setResent(false);
    if (!email || !password || (mode === 'signup' && !confirmPassword)) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error: signInError, data } = await signIn(email, password);
        if (signInError) throw signInError;
        navigation.replace('Main');
      } else {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) throw signUpError;
        setMode('login');
        setError('Account created! Please log in.');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Please confirm your email address. Check your inbox for a confirmation link.');
      } else {
        setError(msg || 'Authentication failed.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResent(false);
    setSubmitting(true);
    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) throw signUpError;
      setResent(true);
    } catch (err: any) {
      setError('Failed to resend confirmation email.');
    } finally {
      setSubmitting(false);
    }
  };

  const showResend =
    mode === 'login' &&
    error &&
    error.toLowerCase().includes('confirm your email');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
            <Text style={styles.subtitle}>
              {mode === 'login' ? 'Sign in to continue.' : 'Create a new account.'}
            </Text>
            {error && <Text style={styles.error}>{error}</Text>}
            {showResend && (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={handleResend}
                disabled={submitting || authLoading}
              >
                <Text style={styles.resendButtonText}>Resend Confirmation Email</Text>
              </TouchableOpacity>
            )}
            {resent && (
              <Text style={styles.resentMsg}>Confirmation email resent! Please check your inbox.</Text>
            )}
            <CustomTextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <CustomTextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
            {mode === 'signup' && (
              <CustomTextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={submitting || authLoading}
            >
              {submitting || authLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Sign Up'}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.switchModeButton}
              onPress={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
                setResent(false);
              }}
              disabled={submitting || authLoading}
            >
              <Text style={styles.switchModeText}>
                {mode === 'login'
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 28,
    color: '#141414',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 16,
    color: '#757575',
    marginBottom: 24,
    textAlign: 'center',
  },
  error: {
    color: '#D32F2F',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#121712',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 64,
    alignItems: 'center',
    marginTop: 8,
    width: 240,
  },
  buttonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  switchModeButton: {
    marginTop: 20,
  },
  switchModeText: {
    color: '#121712',
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    textAlign: 'center',
  },
  resendButton: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#121712',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
  },
  resendButtonText: {
    color: '#121712',
    fontFamily: 'Manrope-Bold',
    fontSize: 15,
  },
  resentMsg: {
    color: '#388e3c',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default AuthScreen;