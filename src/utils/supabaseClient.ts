/**
 * @file src/utils/supabaseClient.ts
 * @description
 * Initializes and exports a Supabase client instance for interacting with
 * the Supabase backend. Pulls configuration from environment variables defined
 * in the root .env file.
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase client library.
 * - react-native-dotenv (or equivalent): To load environment variables in React Native.
 *
 * @notes
 * - Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env at project root.
 * - This file should be imported wherever Supabase interactions are required.
 * - Throws an error if required environment variables are missing.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Load environment variables from Expo Constants
const { SUPABASE_URL, SUPABASE_ANON_KEY } = Constants.expoConfig?.extra || {};

/**
 * Validates that required environment variables are present.
 * @throws {Error} If SUPABASE_URL or SUPABASE_ANON_KEY is missing.
 */
function validateEnv(): void {
  if (!SUPABASE_URL) {
    throw new Error(
      'Missing SUPABASE_URL environment variable. Please add it to your .env file.'
    );
  }
  if (!SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing SUPABASE_ANON_KEY environment variable. Please add it to your .env file.'
    );
  }
}

validateEnv();

/**
 * The Supabase client instance, configured with URL and anon key.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL!,
  SUPABASE_ANON_KEY!
);