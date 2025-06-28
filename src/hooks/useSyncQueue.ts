// File: src/hooks/useSyncQueue.ts

/**
 * @file src/hooks/useSyncQueue.ts
 * @description
 * Hook for managing an offline sync queue for BestBefore.
 * Enqueues CRUD actions in AsyncStorage when offline and
 * processes them against Supabase when connectivity is restored.
 *
 * @dependencies
 * - @react-native-async-storage/async-storage: Local storage for queue
 * - @supabase/supabase-js: Supabase client to execute queued operations
 * - useAuth: To retrieve current user ID for securing actions
 *
 * @notes
 * - Queue entries live under the key '@BestBefore:syncQueue'
 * - After a successful sync, the queue is cleared
 * - Errors during sync are logged, leaving entries for retry
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Key under which the queue is stored in AsyncStorage
const STORAGE_KEY = '@BestBefore:syncQueue';

/** Allowed actions on the products table */
type QueueAction = 'ADD' | 'EDIT' | 'DELETE';

/** Structure of a queued entry */
interface QueueEntry {
  id: string;               // Unique entry ID
  action: QueueAction;      // CRUD action
  table: 'products';        // Currently only products supported
  payload: any;             // Data needed for the action
  timestamp: string;        // ISO timestamp when enqueued
}

/**
 * Custom hook exposing queue management functions.
 */
export function useSyncQueue() {
  const { user } = useAuth();

  /**
   * Retrieves the current queue from AsyncStorage.
   */
  async function getQueue(): Promise<QueueEntry[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (err) {
      console.error('Error reading sync queue:', err);
      return [];
    }
  }

  /**
   * Persists the given queue array to AsyncStorage.
   */
  async function saveQueue(queue: QueueEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.error('Error saving sync queue:', err);
    }
  }

  /**
   * Adds a new action to the local queue.
   * @param action The CRUD action type
   * @param payload Data needed to perform the action
   */
  async function enqueueAction(action: QueueAction, payload: any): Promise<void> {
    const queue = await getQueue();
    const entry: QueueEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      table: 'products',
      payload,
      timestamp: new Date().toISOString(),
    };
    queue.push(entry);
    await saveQueue(queue);
    console.log(`Enqueued ${action} action`, entry);
  }

  /**
   * Processes all queued actions against Supabase.
   * On full success, clears the local queue.
   */
  async function syncQueue(): Promise<void> {
    if (!user) {
      console.warn('syncQueue: no user, skipping');
      return;
    }
    const queue = await getQueue();
    if (queue.length === 0) {
      return;
    }

    console.log(`Syncing ${queue.length} queued actions...`);
    for (const entry of queue) {
      let resultError = null;
      try {
        const { action, payload } = entry;
        switch (action) {
          case 'ADD':
            // Insert new product, attaching user_id
            await supabase
              .from('products')
              .insert({ ...payload, user_id: user.id });
            break;
          case 'EDIT':
            // payload: { id, updates }
            await supabase
              .from('products')
              .update(payload.updates)
              .eq('id', payload.id)
              .eq('user_id', user.id);
            break;
          case 'DELETE':
            // payload: { id }
            await supabase
              .from('products')
              .delete()
              .eq('id', payload.id)
              .eq('user_id', user.id);
            break;
          default:
            console.warn(`Unknown action type: ${(entry as any).action}`);
        }
      } catch (err) {
        resultError = err;
        console.error('Error syncing entry:', entry, err);
        break; // stop on first failure
      }
      if (resultError) {
        // Leave queue intact for retry
        return;
      }
    }

    // All queued actions succeeded, clear the queue
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      console.log('Sync queue cleared');
    } catch (err) {
      console.error('Failed to clear sync queue:', err);
    }
  }

  return {
    enqueueAction,
    syncQueue,
  };
}