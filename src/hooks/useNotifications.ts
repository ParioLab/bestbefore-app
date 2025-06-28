/**
 * @file src/hooks/useNotifications.ts
 * @description
 * Custom hook for handling push notification registration and scheduling
 * reminders for expiring products via Expo Notifications.
 *
 * Provides methods to register for push notifications and to schedule
 * notifications for a given product based on user settings.
 *
 * Key features:
 * - Request and obtain Expo push token for push notifications.
 * - Schedule notifications at specified days before expiry at 12 PM and 8 PM.
 * - Skip scheduling if the trigger time is in the past.
 *
 * @dependencies
 * - expo-notifications: For push notification handling and scheduling.
 * - dayjs: For date calculations.
 *
 * @notes
 * - Ensure to configure push notification credentials (APNs/FCM) in Expo.
 * - Notification scheduling does not persist IDs; duplicate scheduling may occur if invoked multiple times.
 * - Future enhancements: cancel existing scheduled notifications when updating/deleting products.
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { useSettings } from '../context/SettingsContext';

/**
 * Hook providing notification utilities.
 */
export function useNotifications() {
  const { settings } = useSettings();

  /**
   * Registers for push notifications and returns the Expo push token.
   * Requests permissions if not already granted.
   * Sets up the Android notification channel.
   * @returns Expo push token string, or undefined if permission denied.
   */
  async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    // Check existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Push notification permission not granted');
      return undefined;
    }
    // Get the Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    // Android-specific channel setup
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    console.log('Obtained Expo push token:', token);
    return token;
  }

  /**
   * Schedules notifications for a product's expiry reminders.
   * Schedules at 12 PM and 8 PM on user-configured days before expiry and 1 day before.
   * Skips any trigger times that are already in the past.
   * @param product Object containing id, name, and expiry_date (YYYY-MM-DD).
   * @returns Array of scheduled notification IDs.
   */
  async function scheduleNotificationsForProduct(product: {
    id: string;
    name: string;
    expiry_date: string;
  }): Promise<string[]> {
    const notificationIds: string[] = [];
    if (!settings) {
      console.warn('Settings not loaded, cannot schedule notifications');
      return notificationIds;
    }
    // Determine days before expiry to notify: user setting and always 1 day
    const daysBeforeSet = new Set<number>([settings.reminder_frequency, 1]);
    // Times of day to send: 12 PM and 8 PM
    const hours = [12, 20];
    for (const daysBefore of Array.from(daysBeforeSet)) {
      for (const hour of hours) {
        // Compute trigger date/time
        const triggerDate = dayjs(product.expiry_date)
          .subtract(daysBefore, 'day')
          .hour(hour)
          .minute(0)
          .second(0)
          .toDate();
        // Skip scheduling past times
        if (triggerDate <= new Date()) {
          continue;
        }
        // Schedule the notification
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Expiry Reminder',
            body: `${product.name} expires in ${daysBefore} day(s)`,
            data: { productId: product.id },
          },
          trigger: triggerDate as any,
        });
        notificationIds.push(notificationId);
      }
    }
    console.log(`Scheduled ${notificationIds.length} notifications for product ${product.id}`);
    return notificationIds;
  }

  return {
    registerForPushNotificationsAsync,
    scheduleNotificationsForProduct,
  };
}