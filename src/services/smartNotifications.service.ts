/**
 * Smart Notifications Service
 * Context-aware, location-based, time-sensitive notifications
 */

import Geolocation from '@react-native-community/geolocation';
import { getDistance } from 'geolib';

export interface SmartNotification {
  id: string;
  type: 'proximity' | 'price_alert' | 'expiry' | 'deal' | 'routine' | 'social';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  triggerCondition: {
    type: string;
    params: any;
  };
  actionable: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationRule {
  id: string;
  type: string;
  enabled: boolean;
  conditions: any;
  message: string;
}

class SmartNotificationService {
  private activeNotifications: SmartNotification[] = [];
  private rules: NotificationRule[] = [];
  private sentNotifications: Set<string> = new Set();
  private userLocation: { latitude: number; longitude: number } | null = null;

  initialize() {
    this.setupDefaultRules();
    this.startLocationTracking();
    this.checkNotifications();
  }

  private setupDefaultRules() {
    this.rules = [
      // Proximity notifications
      {
        id: 'proximity-store',
        type: 'proximity',
        enabled: true,
        conditions: { distance: 500 }, // meters
        message: "You're passing {store}. You have {count} items to buy here",
      },

      // Price alerts
      {
        id: 'price-drop',
        type: 'price_alert',
        enabled: true,
        conditions: { percentDrop: 15 },
        message: "{item} is now {percent}% off at {store}!",
      },

      // Expiry warnings
      {
        id: 'expiry-soon',
        type: 'expiry',
        enabled: true,
        conditions: { daysBeforeExpiry: 2 },
        message: "{count} items expiring in {days} days",
      },

      // Deal notifications
      {
        id: 'nearby-deal',
        type: 'deal',
        enabled: true,
        conditions: { distance: 2000 }, // meters
        message: "{discount} at {store} - {distance} away",
      },

      // Routine reminders
      {
        id: 'shopping-time',
        type: 'routine',
        enabled: true,
        conditions: { dayOfWeek: 'Thursday', hour: 17 },
        message: "Your usual shopping time! {count} items on your list",
      },

      // Social notifications
      {
        id: 'friend-recommendation',
        type: 'social',
        enabled: true,
        conditions: {},
        message: "{friend} bought {item} at {store}. Add to your list?",
      },
    ];
  }

  private startLocationTracking() {
    // Track location every 5 minutes when app is active
    setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.checkProximityNotifications();
        },
        error => console.error('Location error:', error),
        { enableHighAccuracy: false, timeout: 15000 }
      );
    }, 5 * 60 * 1000);
  }

  /**
   * Check and trigger notifications
   */
  private async checkNotifications() {
    setInterval(() => {
      this.checkTimeBasedNotifications();
      this.checkExpiryNotifications();
      this.checkDealNotifications();
    }, 60 * 1000); // Every minute
  }

  /**
   * Proximity notifications - "You're passing Costco"
   */
  private async checkProximityNotifications() {
    if (!this.userLocation) return;

    const rule = this.rules.find(r => r.type === 'proximity' && r.enabled);
    if (!rule) return;

    // Mock stores nearby - would fetch from store discovery service
    const nearbyStores = [
      { name: 'Costco', lat: 37.7749, lng: -122.4194, itemCount: 5 },
      { name: 'Safeway', lat: 37.7750, lng: -122.4180, itemCount: 3 },
    ];

    for (const store of nearbyStores) {
      const distance = getDistance(
        this.userLocation,
        { latitude: store.lat, longitude: store.lng }
      );

      if (distance <= rule.conditions.distance && store.itemCount > 0) {
        const notifId = `proximity-${store.name}-${Date.now()}`;
        
        if (!this.sentNotifications.has(notifId)) {
          this.sendNotification({
            id: notifId,
            type: 'proximity',
            title: `${store.name} nearby`,
            message: rule.message
              .replace('{store}', store.name)
              .replace('{count}', store.itemCount.toString()),
            priority: 'high',
            triggerCondition: {
              type: 'proximity',
              params: { store: store.name, distance },
            },
            actionable: true,
            actions: [
              { label: 'View Items', action: 'view_list' },
              { label: 'Navigate', action: 'navigate' },
              { label: 'Dismiss', action: 'dismiss' },
            ],
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
          });

          this.sentNotifications.add(notifId);
        }
      }
    }
  }

  /**
   * Price alerts - "Eggs are $2 off at Whole Foods"
   */
  async sendPriceAlert(item: string, oldPrice: number, newPrice: number, store: string) {
    const rule = this.rules.find(r => r.type === 'price_alert' && r.enabled);
    if (!rule) return;

    const percentDrop = ((oldPrice - newPrice) / oldPrice) * 100;
    
    if (percentDrop >= rule.conditions.percentDrop) {
      const notifId = `price-${item}-${store}-${Date.now()}`;
      
      this.sendNotification({
        id: notifId,
        type: 'price_alert',
        title: `${item} price drop!`,
        message: rule.message
          .replace('{item}', item)
          .replace('{percent}', percentDrop.toFixed(0))
          .replace('{store}', store),
        priority: 'high',
        triggerCondition: {
          type: 'price_drop',
          params: { item, oldPrice, newPrice, store },
        },
        actionable: true,
        actions: [
          { label: 'Add to List', action: 'add_item' },
          { label: 'View Store', action: 'view_store' },
          { label: 'Dismiss', action: 'dismiss' },
        ],
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    }
  }

  /**
   * Expiry notifications - "3 items expiring in 2 days"
   */
  private async checkExpiryNotifications() {
    const rule = this.rules.find(r => r.type === 'expiry' && r.enabled);
    if (!rule) return;

    // Mock pantry items - would fetch from pantry service
    const pantryItems = [
      { name: 'Milk', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { name: 'Yogurt', expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { name: 'Lettuce', expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
    ];

    const expiringItems = pantryItems.filter(item => {
      const daysUntilExpiry = (item.expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
      return daysUntilExpiry <= rule.conditions.daysBeforeExpiry && daysUntilExpiry > 0;
    });

    if (expiringItems.length > 0) {
      const notifId = `expiry-${new Date().toDateString()}`;
      
      if (!this.sentNotifications.has(notifId)) {
        this.sendNotification({
          id: notifId,
          type: 'expiry',
          title: 'Items expiring soon',
          message: rule.message
            .replace('{count}', expiringItems.length.toString())
            .replace('{days}', rule.conditions.daysBeforeExpiry.toString()),
          priority: 'medium',
          triggerCondition: {
            type: 'expiry',
            params: { items: expiringItems },
          },
          actionable: true,
          actions: [
            { label: 'View Items', action: 'view_pantry' },
            { label: 'Find Recipes', action: 'find_recipes' },
            { label: 'Dismiss', action: 'dismiss' },
          ],
          createdAt: new Date(),
        });

        this.sentNotifications.add(notifId);
      }
    }
  }

  /**
   * Deal notifications
   */
  private async checkDealNotifications() {
    if (!this.userLocation) return;

    const rule = this.rules.find(r => r.type === 'deal' && r.enabled);
    if (!rule) return;

    // Mock deals - would fetch from deals service
    const nearbyDeals = [
      { store: 'Target', discount: '20% off groceries', lat: 37.7749, lng: -122.4194 },
      { store: 'Walmart', discount: '$5 off $50', lat: 37.7755, lng: -122.4185 },
    ];

    for (const deal of nearbyDeals) {
      const distance = getDistance(
        this.userLocation,
        { latitude: deal.lat, longitude: deal.lng }
      );

      if (distance <= rule.conditions.distance) {
        const notifId = `deal-${deal.store}-${Date.now()}`;
        
        if (!this.sentNotifications.has(notifId)) {
          this.sendNotification({
            id: notifId,
            type: 'deal',
            title: `Deal at ${deal.store}`,
            message: rule.message
              .replace('{discount}', deal.discount)
              .replace('{store}', deal.store)
              .replace('{distance}', (distance / 1000).toFixed(1) + 'km'),
            priority: 'medium',
            triggerCondition: {
              type: 'nearby_deal',
              params: { deal, distance },
            },
            actionable: true,
            actions: [
              { label: 'View Deal', action: 'view_deal' },
              { label: 'Navigate', action: 'navigate' },
              { label: 'Dismiss', action: 'dismiss' },
            ],
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
          });

          this.sentNotifications.add(notifId);
        }
      }
    }
  }

  /**
   * Time-based notifications - "Your usual shopping time"
   */
  private async checkTimeBasedNotifications() {
    const rule = this.rules.find(r => r.type === 'routine' && r.enabled);
    if (!rule) return;

    const now = new Date();
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const hour = now.getHours();

    if (dayOfWeek === rule.conditions.dayOfWeek && hour === rule.conditions.hour) {
      const notifId = `routine-${dayOfWeek}-${hour}`;
      
      if (!this.sentNotifications.has(notifId)) {
        // Mock list count - would fetch from store
        const listCount = 12;

        this.sendNotification({
          id: notifId,
          type: 'routine',
          title: 'Shopping reminder',
          message: rule.message.replace('{count}', listCount.toString()),
          priority: 'medium',
          triggerCondition: {
            type: 'routine',
            params: { dayOfWeek, hour },
          },
          actionable: true,
          actions: [
            { label: 'View List', action: 'view_list' },
            { label: 'Start Shopping', action: 'start_shopping' },
            { label: 'Snooze', action: 'snooze' },
          ],
          createdAt: new Date(),
        });

        this.sentNotifications.add(notifId);
      }
    }
  }

  /**
   * Social notifications
   */
  async sendSocialNotification(friend: string, item: string, store: string) {
    const rule = this.rules.find(r => r.type === 'social' && r.enabled);
    if (!rule) return;

    const notifId = `social-${friend}-${item}-${Date.now()}`;
    
    this.sendNotification({
      id: notifId,
      type: 'social',
      title: `${friend}'s recommendation`,
      message: rule.message
        .replace('{friend}', friend)
        .replace('{item}', item)
        .replace('{store}', store),
      priority: 'low',
      triggerCondition: {
        type: 'social',
        params: { friend, item, store },
      },
      actionable: true,
      actions: [
        { label: 'Add to List', action: 'add_item' },
        { label: 'View Details', action: 'view_item' },
        { label: 'Dismiss', action: 'dismiss' },
      ],
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  /**
   * Send notification
   */
  private async sendNotification(notification: SmartNotification) {
    this.activeNotifications.push(notification);
    
    // Here you would integrate with React Native's notification system
    // or a service like Firebase Cloud Messaging
    console.log('Notification:', notification.title, notification.message);

    // Trigger system notification
    // PushNotification.localNotification({...})
  }

  /**
   * Get active notifications
   */
  getActiveNotifications(): SmartNotification[] {
    return this.activeNotifications.filter(n => 
      !n.expiresAt || n.expiresAt > new Date()
    );
  }

  /**
   * Dismiss notification
   */
  dismissNotification(id: string) {
    this.activeNotifications = this.activeNotifications.filter(n => n.id !== id);
  }

  /**
   * Update notification rule
   */
  updateRule(id: string, updates: Partial<NotificationRule>) {
    const rule = this.rules.find(r => r.id === id);
    if (rule) {
      Object.assign(rule, updates);
    }
  }

  /**
   * Get all rules
   */
  getRules(): NotificationRule[] {
    return this.rules;
  }

  /**
   * Clear sent notifications cache (for testing)
   */
  clearSentCache() {
    this.sentNotifications.clear();
  }
}

export const smartNotifications = new SmartNotificationService();
