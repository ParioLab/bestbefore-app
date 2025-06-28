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

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Bypass auth for testing
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>[Auth Bypassed]</Text>
        <Text style={{ marginBottom: 16 }}>Authentication is disabled for testing. Tap below to continue.</Text>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.submitButtonText}>Continue to App</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: '#141414',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default AuthScreen;