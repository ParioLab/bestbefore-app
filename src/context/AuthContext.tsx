// File: src/context/AuthContext.tsx

/**
 * @file src/context/AuthContext.tsx
 * @description
 * Provides authentication context for the BestBefore app using Supabase Auth.
 * Manages the user's session state and exposes sign-up, sign-in, and sign-out methods.
 *
 * Key features:
 * - Initializes and tracks the current Supabase session
 * - Listens for auth state changes to keep user state in sync
 * - Exposes methods: signUp, signIn, signOut
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase client for auth operations
 * - React: Context API for state management
 *
 * @notes
 * - Throws an error if `useAuth` is used outside `AuthProvider`.
 * - Loading flag indicates when the initial session check is in progress.
 */

import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
  } from 'react';
  import {
    User,
    AuthError,
    Session,
    AuthSession,
    AuthResponse,
    AuthTokenResponsePassword,
  } from '@supabase/supabase-js';
  import { supabase } from '../utils/supabaseClient';
  
  /** Shape of the authentication context */
  interface AuthContextType {
    /** The currently authenticated Supabase user, or null */
    user: User | null;
    /** True while checking initial session or processing auth changes */
    loading: boolean;
    /**
     * Registers a new user with email and password.
     * @returns Supabase AuthResponse
     */
    signUp: (
      email: string,
      password: string
    ) => Promise<AuthResponse>;
    /**
     * Signs in a user with email and password.
     * @returns Supabase AuthTokenResponsePassword
     */
    signIn: (
      email: string,
      password: string
    ) => Promise<AuthTokenResponsePassword>;
    /**
     * Signs out the current user.
     * @returns Supabase error if any
     */
    signOut: () => Promise<{ error: AuthError | null }>;
  }
  
  /** Create the AuthContext with undefined as initial value */
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  /** Provider component that wraps the app and makes auth context available */
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      // Fetch initial session on mount
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
  
      // Listen to auth state changes
      const { data: listener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      );
  
      // Cleanup subscription on unmount
      return () => {
        listener.subscription.unsubscribe();
      };
    }, []);
  
    // Expose auth methods directly from supabase client
    const signUp = (email: string, password: string) =>
      supabase.auth.signUp({ email, password });
    const signIn = (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password });
    const signOut = () => supabase.auth.signOut();
  
    return (
      <AuthContext.Provider
        value={{ user, loading, signUp, signIn, signOut }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  /**
   * Custom hook to access authentication context.
   * Throws an error if used outside of AuthProvider.
   */
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };