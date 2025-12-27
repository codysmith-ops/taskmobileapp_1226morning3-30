/**
 * Master Services Index
 * Exports all feature services for easy import
 */

// Voice & AI
export * from './voiceAssistant.service';

// Financial Optimization
export * from './creditCardOptimizer.service';

// Notifications & Alerts
export * from './smartNotifications.service';

// Sustainability
export * from './wasteTracker.service';

// Advanced Features (Social, Subscriptions, Family, etc.)
export * from './advancedFeatures.service';

// Health & Nutrition
export * from './healthNutrition.service';

// Shopping Optimization
export * from './shoppingOptimization.service';

// Premium & Utility
export * from './premiumUtility.service';

/**
 * Quick Access to All Services
 */
import { voiceAssistant } from './voiceAssistant.service';
import { creditCardOptimizer } from './creditCardOptimizer.service';
import { smartNotifications } from './smartNotifications.service';
import { wasteTracker } from './wasteTracker.service';
import {
  storeCrowding,
  socialProof,
  subscriptionManager,
  storeLayout,
  familyAllowance,
} from './advancedFeatures.service';
import {
  dietaryScanner,
  nutritionTracking,
  mealPlanner,
  carbonOffset,
} from './healthNutrition.service';
import {
  priceHistory,
  bulkBuyCalculator,
  smartCart,
  loyaltyCard,
  flashDeal,
} from './shoppingOptimization.service';
import {
  personalShopper,
  energyTimeCalculator,
  historicalAnalytics,
} from './premiumUtility.service';

export const AppServices = {
  // Voice & AI
  voiceAssistant,
  
  // Financial
  creditCardOptimizer,
  
  // Notifications
  smartNotifications,
  
  // Sustainability
  wasteTracker,
  carbonOffset,
  
  // Social & Family
  socialProof,
  familyAllowance,
  
  // Shopping Intelligence
  storeCrowding,
  storeLayout,
  priceHistory,
  bulkBuyCalculator,
  smartCart,
  flashDeal,
  
  // Subscriptions & Loyalty
  subscriptionManager,
  loyaltyCard,
  
  // Health & Nutrition
  dietaryScanner,
  nutritionTracking,
  mealPlanner,
  
  // Premium Features
  personalShopper,
  energyTimeCalculator,
  historicalAnalytics,
};

/**
 * Initialize all services
 */
export const initializeServices = () => {
  console.log('Initializing all app services...');
  
  // Set up default configurations
  smartNotifications.initialize();
  
  console.log('All services initialized');
  
  return AppServices;
};

/**
 * Feature flags for progressive rollout
 */
export const FeatureFlags = {
  voiceAssistant: true,
  creditCardOptimizer: true,
  smartNotifications: true,
  wasteTracker: true,
  storeCrowding: true,
  socialProof: true,
  subscriptionManager: true,
  storeLayout: true,
  familyAllowance: true,
  dietaryScanner: true,
  nutritionTracking: true,
  mealPlanner: true,
  carbonOffset: true,
  priceHistory: true,
  bulkBuyCalculator: true,
  smartCart: true,
  loyaltyCard: true,
  flashDeal: true,
  personalShopper: true, // Premium
  energyTimeCalculator: true,
  historicalAnalytics: true,
};

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (feature: keyof typeof FeatureFlags): boolean => {
  return FeatureFlags[feature] ?? false;
};
