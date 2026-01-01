/**
 * Push Notification Service
 * Handles local and remote notifications for deals, reminders, and proximity alerts
 */

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  badge?: number;
  sound?: string;
  category?: string;
}

class PushNotificationService {
  private static instance: PushNotificationService;

  private constructor() {
    if (Platform.OS === 'ios') {
      this.configure();
    }
  }

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  private configure() {
    // Request permissions on app start
    PushNotificationIOS.requestPermissions();

    // Handle notification received while app is in foreground
    PushNotificationIOS.addEventListener('notification', notification => {
      console.log('📱 Notification received:', notification);

      // Show alert
      const data = notification.getData();
      if (data.type === 'deal_alert') {
        this.handleDealAlert(data);
      } else if (data.type === 'proximity_alert') {
        this.handleProximityAlert(data);
      }

      // Required: tell the app you handled the notification
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    });

    // Handle user tapping notification
    PushNotificationIOS.addEventListener('localNotification', notification => {
      console.log('👆 Notification tapped:', notification);
    });

    // Handle registration for remote notifications
    PushNotificationIOS.addEventListener('register', token => {
      console.log('🔑 Device token:', token);
      // TODO: Send token to your backend
    });

    // Handle registration failure
    PushNotificationIOS.addEventListener('registrationError', error => {
      console.error('❌ Registration failed:', error);
    });
  }

  /**
   * Schedule local notification
   */
  async scheduleNotification(notification: NotificationData, fireDate?: Date): Promise<void> {
    if (Platform.OS !== 'ios') {
      return;
    }

    const details: any = {
      alertTitle: notification.title,
      alertBody: notification.body,
      userInfo: notification.data || {},
      applicationIconBadgeNumber: notification.badge || 0,
    };

    if (fireDate) {
      details.fireDate = fireDate.toISOString();
    }

    if (notification.sound) {
      details.soundName = notification.sound;
    }

    if (notification.category) {
      details.category = notification.category;
    }

    PushNotificationIOS.addNotificationRequest(details);
    console.log('✅ Notification scheduled:', notification.title);
  }

  /**
   * Send immediate notification
   */
  async sendNotification(notification: NotificationData): Promise<void> {
    await this.scheduleNotification(notification, new Date());
  }

  /**
   * Cancel all notifications
   */
  cancelAllNotifications(): void {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications();
    }
  }

  /**
   * Get badge count
   */
  async getBadgeCount(): Promise<number> {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        PushNotificationIOS.getApplicationIconBadgeNumber(count => resolve(count));
      });
    }
    return 0;
  }

  /**
   * Set badge count
   */
  setBadgeCount(count: number): void {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(count);
    }
  }

  /**
   * Handle deal alert notification
   */
  private handleDealAlert(data: any) {
    console.log('💰 Deal alert:', data.deal_title);
    // Navigate to deal or show in-app alert
  }

  /**
   * Handle proximity alert notification
   */
  private handleProximityAlert(data: any) {
    console.log('📍 Proximity alert:', data.store_name);
    // Navigate to store or shopping list
  }

  /**
   * Schedule deal notification
   */
  async scheduleDealNotification(
    dealTitle: string,
    storeName: string,
    discount: string
  ): Promise<void> {
    await this.sendNotification({
      title: '💰 Flash Deal Alert!',
      body: `${dealTitle} - ${discount} off at ${storeName}`,
      data: {
        type: 'deal_alert',
        deal_title: dealTitle,
        store_name: storeName,
        discount,
      },
      badge: 1,
      sound: 'default',
      category: 'DEAL_ALERT',
    });
  }

  /**
   * Schedule proximity notification
   */
  async scheduleProximityNotification(storeName: string, itemCount: number): Promise<void> {
    await this.sendNotification({
      title: `🛒 You're near ${storeName}`,
      body: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} to buy here!`,
      data: {
        type: 'proximity_alert',
        store_name: storeName,
        item_count: itemCount,
      },
      badge: itemCount,
      sound: 'default',
      category: 'PROXIMITY_ALERT',
    });
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const permissions = await PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
      });
      return permissions.alert === 1;
    }
    return false;
  }

  /**
   * Check if notifications are enabled
   */
  async checkPermissions(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        PushNotificationIOS.checkPermissions(permissions => {
          resolve(permissions.alert === 1);
        });
      });
    }
    return false;
  }

  /**
   * Schedule a notification for a specific date/time
   */
  async scheduleNotificationAt(params: {
    id: string;
    title: string;
    body: string;
    data?: any;
    date: Date;
  }): Promise<void> {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.scheduleLocalNotification({
        alertTitle: params.title,
        alertBody: params.body,
        fireDate: params.date.toISOString(),
        userInfo: { ...params.data, notificationId: params.id },
      });
      console.log('🔔 Scheduled notification:', params.id, 'for', params.date.toISOString());
    }
  }

  /**
   * Cancel a specific scheduled notification
   */
  async cancelScheduledNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.cancelLocalNotifications({ notificationId });
      console.log('🔕 Cancelled notification:', notificationId);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllScheduledNotifications(): Promise<void> {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.cancelAllLocalNotifications();
      console.log('🔕 Cancelled all notifications');
    }
  }
}

export const notificationService = PushNotificationService.getInstance();

// Export simple functions for backward compatibility
export async function scheduleNotification(params: {
  id: string;
  title: string;
  body: string;
  data?: any;
  date?: Date;
}): Promise<void> {
  await notificationService.scheduleNotificationAt({
    id: params.id,
    title: params.title,
    body: params.body,
    data: params.data,
    date: params.date || new Date(Date.now() + 60000), // Default: 1 minute from now
  });
}

export async function cancelNotification(notificationId: string): Promise<void> {
  await notificationService.cancelScheduledNotification(notificationId);
}
