// File: src/context/SettingsContext.tsx

/**
 * @file src/context/SettingsContext.tsx
 * @description
 * Provides user settings state management for the BestBefore app.
 * Loads and updates settings from Supabase.
 *
 * Key features:
 * - Loads reminder frequency on mount
 * - Exposes updateSetting to change frequency
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase client for database operations
 * - React: Context API for state management
 * - useAuth: To retrieve current user ID
 *
 * @notes
 * - Only manages the `reminder_frequency` setting for now.
 */

import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect,
  } from 'react';
  import { supabase } from '../utils/supabaseClient';
  import { useAuth } from './AuthContext';
  
  /** Shape of settings in the app */
  interface Settings {
    reminder_frequency: number;
  }
  
  /** Methods and state exposed by the settings context */
  interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    updateReminderFrequency: (days: number) => Promise<void>;
  }
  
  /** Create the settings context */
  const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
  );
  
  /** Provider component for settings state */
  export const SettingsProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
    const { user } = useAuth();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
  
    /** Fetch settings for current user */
    const fetchSettings = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code === 'PGRST116') {
        // No row exists yet: insert default
        await supabase
          .from('settings')
          .insert({ user_id: user.id, reminder_frequency: 3 });
        setSettings({ reminder_frequency: 3 });
      } else if (error) {
        throw error;
      } else {
        setSettings(data);
      }
      setLoading(false);
    };
  
    /** Update the reminder_frequency setting */
    const updateReminderFrequency = async (days: number) => {
      if (!user) return;
      setLoading(true);
      const { error } = await supabase
        .from('settings')
        .update({ reminder_frequency: days })
        .eq('user_id', user.id);
      if (error) throw error;
      setSettings({ reminder_frequency: days });
      setLoading(false);
    };
  
    // Load settings when user changes
    useEffect(() => {
      fetchSettings().catch(console.error);
    }, [user]);
  
    return (
      <SettingsContext.Provider
        value={{ settings, loading, updateReminderFrequency }}
      >
        {children}
      </SettingsContext.Provider>
    );
  };
  
  /**
   * Custom hook to access settings context.
   * Throws an error if used outside of SettingsProvider.
   */
  export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
      throw new Error(
        'useSettings must be used within a SettingsProvider'
      );
    }
    return context;
  };