/**
 * Trial Subscription Manager
 * Tracks trial period and sends reminders before expiration
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelNotification } from './pushNotification.service';

export interface SubscriptionStatus {
  isTrial: boolean;
  isPremium: boolean;
  trialStartDate: string | null;
  trialEndDate: string | null;
  subscriptionStartDate: string | null;
  subscriptionType: 'free' | 'trial' | 'monthly' | 'yearly' | null;
  autoRenew: boolean;
}

const STORAGE_KEY_SUBSCRIPTION = 'ellio_subscription_status';
const TRIAL_DURATION_DAYS = 7; // 7-day free trial
const TRIAL_REMINDER_NOTIFICATION_ID = 'trial_expiry_reminder';

/**
 * Start a free trial
 */
export async function startFreeTrial(): Promise<SubscriptionStatus> {
  const now = new Date();
  const startDate = now.toISOString();
  
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);
  
  const status: SubscriptionStatus = {
    isTrial: true,
    isPremium: true, // Trial users get premium features
    trialStartDate: startDate,
    trialEndDate: endDate.toISOString(),
    subscriptionStartDate: null,
    subscriptionType: 'trial',
    autoRenew: false,
  };
  
  await AsyncStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(status));
  
  // Schedule trial expiry reminder (1 day before)
  await scheduleTrialExpiryReminder(endDate);
  
  console.log('🎁 Free trial started:', startDate, '→', endDate.toISOString());
  return status;
}

/**
 * Schedule notification 1 day before trial ends
 */
async function scheduleTrialExpiryReminder(trialEndDate: Date): Promise<void> {
  const reminderDate = new Date(trialEndDate);
  reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before
  reminderDate.setHours(10, 0, 0, 0); // 10 AM
  
  // Only schedule if reminder is in the future
  if (reminderDate > new Date()) {
    await scheduleNotification({
      id: TRIAL_REMINDER_NOTIFICATION_ID,
      title: '⏰ Trial Ending Tomorrow',
      body: 'Your Ellio free trial ends tomorrow. Continue saving with premium features!',
      data: { type: 'trial_expiry' },
      date: reminderDate,
    });
    
    console.log('🔔 Trial reminder scheduled for:', reminderDate.toISOString());
  }
}

/**
 * Get current subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SUBSCRIPTION);
    if (!data) {
      // Default: free tier
      return {
        isTrial: false,
        isPremium: false,
        trialStartDate: null,
        trialEndDate: null,
        subscriptionStartDate: null,
        subscriptionType: 'free',
        autoRenew: false,
      };
    }
    
    const status: SubscriptionStatus = JSON.parse(data);
    
    // Check if trial has expired
    if (status.isTrial && status.trialEndDate) {
      const now = new Date();
      const endDate = new Date(status.trialEndDate);
      
      if (now > endDate) {
        // Trial expired, downgrade to free
        status.isTrial = false;
        status.isPremium = false;
        status.subscriptionType = 'free';
        await AsyncStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(status));
        console.log('⏱️ Trial expired, downgraded to free tier');
      }
    }
    
    return status;
  } catch (error) {
    console.error('Failed to get subscription status:', error);
    return {
      isTrial: false,
      isPremium: false,
      trialStartDate: null,
      trialEndDate: null,
      subscriptionStartDate: null,
      subscriptionType: 'free',
      autoRenew: false,
    };
  }
}

/**
 * Check if trial is ending soon (within 2 days)
 */
export async function isTrialEndingSoon(): Promise<boolean> {
  const status = await getSubscriptionStatus();
  
  if (!status.isTrial || !status.trialEndDate) {
    return false;
  }
  
  const now = new Date();
  const endDate = new Date(status.trialEndDate);
  const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysUntilExpiry <= 2 && daysUntilExpiry > 0;
}

/**
 * Get days remaining in trial
 */
export async function getTrialDaysRemaining(): Promise<number> {
  const status = await getSubscriptionStatus();
  
  if (!status.isTrial || !status.trialEndDate) {
    return 0;
  }
  
  const now = new Date();
  const endDate = new Date(status.trialEndDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysRemaining);
}

/**
 * Upgrade to paid subscription
 */
export async function upgradeToPremium(subscriptionType: 'monthly' | 'yearly'): Promise<SubscriptionStatus> {
  const status = await getSubscriptionStatus();
  
  // Cancel trial reminder if exists
  if (status.isTrial) {
    await cancelNotification(TRIAL_REMINDER_NOTIFICATION_ID);
  }
  
  const updatedStatus: SubscriptionStatus = {
    ...status,
    isTrial: false,
    isPremium: true,
    subscriptionStartDate: new Date().toISOString(),
    subscriptionType,
    autoRenew: true,
  };
  
  await AsyncStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(updatedStatus));
  console.log('💎 Upgraded to premium:', subscriptionType);
  
  return updatedStatus;
}

/**
 * Cancel subscription (downgrade to free)
 */
export async function cancelSubscription(): Promise<SubscriptionStatus> {
  const status = await getSubscriptionStatus();
  
  // Cancel any pending notifications
  await cancelNotification(TRIAL_REMINDER_NOTIFICATION_ID);
  
  const updatedStatus: SubscriptionStatus = {
    ...status,
    isTrial: false,
    isPremium: false,
    subscriptionType: 'free',
    autoRenew: false,
  };
  
  await AsyncStorage.setItem(STORAGE_KEY_SUBSCRIPTION, JSON.stringify(updatedStatus));
  console.log('📉 Subscription cancelled, downgraded to free');
  
  return updatedStatus;
}

/**
 * Get trial status message for UI
 */
export async function getTrialStatusMessage(): Promise<string> {
  const status = await getSubscriptionStatus();
  
  if (!status.isTrial) {
    return '';
  }
  
  const daysRemaining = await getTrialDaysRemaining();
  
  if (daysRemaining === 0) {
    return 'Your trial ends today! Upgrade to keep premium features.';
  } else if (daysRemaining === 1) {
    return '⏰ Trial ends tomorrow! Continue saving with premium.';
  } else if (daysRemaining <= 3) {
    return `Trial ends in ${daysRemaining} days`;
  } else {
    return `${daysRemaining} days left in your free trial`;
  }
}
