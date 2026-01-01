/**
 * Progressive Feature Disclosure Service
 * Manages feature reveals based on usage thresholds
 * Max 1 reveal per session
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type FeatureName =
  | 'shopping_list'
  | 'budget'
  | 'timeline'
  | 'price_insights'
  | 'cashback'
  | 'family'
  | 'voice_input'
  | 'scanner'
  | 'smart_route';

interface FeatureThreshold {
  feature: FeatureName;
  threshold: number;
  counterKey: string;
  description: string;
}

const FEATURE_THRESHOLDS: FeatureThreshold[] = [
  {
    feature: 'shopping_list',
    threshold: 3,
    counterKey: '@ellio_buy_tasks_count',
    description: 'Tasks that start with "Buy" show up in Shopping list',
  },
  {
    feature: 'budget',
    threshold: 5,
    counterKey: '@ellio_receipt_count',
    description: 'Ellio can suggest a budget based on your spending',
  },
  {
    feature: 'timeline',
    threshold: 5,
    counterKey: '@ellio_tasks_with_dates_count',
    description: 'Timeline shows your upcoming tasks in chronological order',
  },
  {
    feature: 'price_insights',
    threshold: 3,
    counterKey: '@ellio_receipt_count',
    description: 'See how your prices compare to area averages',
  },
  {
    feature: 'cashback',
    threshold: 1,
    counterKey: '@ellio_credit_cards_count',
    description: 'Get suggestions for best cashback card at each store',
  },
  {
    feature: 'family',
    threshold: 1,
    counterKey: '@ellio_family_invites_count',
    description: 'Share lists and collaborate with family members',
  },
];

const REVEAL_TRACKING_KEY = '@ellio_last_reveal_date';
const TOOLTIP_SEEN_PREFIX = '@ellio_tooltip_seen_';
const TOOLTIP_SUPPRESSED_PREFIX = '@ellio_tooltip_suppressed_';

/**
 * Increment counter for feature threshold tracking
 */
export async function incrementFeatureCounter(counterKey: string): Promise<void> {
  try {
    const count = await AsyncStorage.getItem(counterKey);
    const newCount = (parseInt(count || '0') + 1).toString();
    await AsyncStorage.setItem(counterKey, newCount);
    console.log(`📊 Incremented ${counterKey}: ${newCount}`);
  } catch (error) {
    console.error('Failed to increment feature counter:', error);
  }
}

/**
 * Check if feature should be revealed (threshold met & not already seen)
 */
export async function shouldRevealFeature(feature: FeatureName): Promise<boolean> {
  try {
    // Check if already revealed
    const alreadySeen = await AsyncStorage.getItem(`${TOOLTIP_SEEN_PREFIX}${feature}`);
    if (alreadySeen) return false;

    // Check if suppressed (user tapped "Not now")
    const suppressed = await isTooltipSuppressed(feature);
    if (suppressed) return false;

    // Check if threshold met
    const threshold = FEATURE_THRESHOLDS.find(t => t.feature === feature);
    if (!threshold) return false;

    const count = await AsyncStorage.getItem(threshold.counterKey);
    const currentCount = parseInt(count || '0');

    return currentCount >= threshold.threshold;
  } catch (error) {
    console.error('Failed to check feature reveal:', error);
    return false;
  }
}

/**
 * Check if tooltip is suppressed (user tapped "Not now")
 */
async function isTooltipSuppressed(feature: FeatureName): Promise<boolean> {
  try {
    const suppressedUntil = await AsyncStorage.getItem(`${TOOLTIP_SUPPRESSED_PREFIX}${feature}`);
    if (!suppressedUntil) return false;

    const suppressDate = new Date(suppressedUntil);
    return new Date() < suppressDate;
  } catch (error) {
    console.error('Failed to check tooltip suppression:', error);
    return false;
  }
}

/**
 * Check if can reveal any feature today (max 1 per session)
 */
export async function canRevealFeatureToday(): Promise<boolean> {
  try {
    const lastRevealDate = await AsyncStorage.getItem(REVEAL_TRACKING_KEY);
    const today = new Date().toDateString();

    return lastRevealDate !== today;
  } catch (error) {
    console.error('Failed to check reveal limit:', error);
    return false;
  }
}

/**
 * Get next feature to reveal (priority order)
 */
export async function getNextFeatureToReveal(): Promise<FeatureName | null> {
  try {
    const canReveal = await canRevealFeatureToday();
    if (!canReveal) {
      console.log('🔕 Already revealed 1 feature today');
      return null;
    }

    // Priority order
    const priorityOrder: FeatureName[] = [
      'shopping_list',
      'budget',
      'timeline',
      'price_insights',
      'cashback',
      'family',
    ];

    for (const feature of priorityOrder) {
      const should = await shouldRevealFeature(feature);
      if (should) {
        return feature;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get next feature:', error);
    return null;
  }
}

/**
 * Mark feature as revealed (tooltip shown)
 */
export async function markFeatureRevealed(feature: FeatureName): Promise<void> {
  try {
    await AsyncStorage.setItem(`${TOOLTIP_SEEN_PREFIX}${feature}`, 'true');
    await AsyncStorage.setItem(REVEAL_TRACKING_KEY, new Date().toDateString());
    console.log(`✅ Feature revealed: ${feature}`);
  } catch (error) {
    console.error('Failed to mark feature revealed:', error);
  }
}

/**
 * Suppress feature tooltip for 7 days (user tapped "Not now")
 */
export async function suppressFeatureTooltip(feature: FeatureName): Promise<void> {
  try {
    const suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + 7);

    await AsyncStorage.setItem(`${TOOLTIP_SUPPRESSED_PREFIX}${feature}`, suppressUntil.toISOString());
    await AsyncStorage.setItem(`${TOOLTIP_SEEN_PREFIX}${feature}`, 'true');
    await AsyncStorage.setItem(REVEAL_TRACKING_KEY, new Date().toDateString());

    console.log(`⏸️ Feature suppressed for 7 days: ${feature}`);
  } catch (error) {
    console.error('Failed to suppress feature tooltip:', error);
  }
}

/**
 * Get feature description for tooltip
 */
export function getFeatureDescription(feature: FeatureName): string {
  const threshold = FEATURE_THRESHOLDS.find(t => t.feature === feature);
  return threshold?.description || '';
}

/**
 * Get feature title for tooltip
 */
export function getFeatureTitle(feature: FeatureName): string {
  const titles: Record<FeatureName, string> = {
    shopping_list: 'Shopping list ready',
    budget: 'Budget suggestion ready',
    timeline: 'Timeline available',
    price_insights: 'Price insights ready',
    cashback: 'Cashback tracking ready',
    family: 'Family sharing ready',
    voice_input: 'Voice input available',
    scanner: 'Scanner available',
    smart_route: 'Smart route ready',
  };

  return titles[feature] || 'New feature available';
}

/**
 * Reset all feature tracking (for testing)
 */
export async function resetFeatureTracking(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const ellioKeys = keys.filter((key: string) => key.startsWith('@ellio_'));
    await AsyncStorage.multiRemove(ellioKeys);
    console.log('🔄 Feature tracking reset');
  } catch (error) {
    console.error('Failed to reset feature tracking:', error);
  }
}
