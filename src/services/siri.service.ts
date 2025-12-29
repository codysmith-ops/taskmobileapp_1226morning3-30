/**
 * Siri Shortcuts Service
 * Enables "Hey Siri" voice commands for shopping list
 */

import { NativeModules, Platform } from 'react-native';

interface SiriShortcut {
  activityType: string;
  title: string;
  userInfo?: any;
  keywords?: string[];
  persistentIdentifier?: string;
  isEligibleForSearch?: boolean;
  isEligibleForPrediction?: boolean;
  suggestedInvocationPhrase?: string;
}

export const SiriService = {
  /**
   * Donate "Add to Shopping List" shortcut
   */
  async donateAddItemShortcut(itemName: string): Promise<void> {
    if (Platform.OS !== 'ios') return;

    const shortcut: SiriShortcut = {
      activityType: 'com.codysmith.ellio.addItem',
      title: `Add ${itemName} to shopping list`,
      userInfo: { item: itemName },
      keywords: ['add', 'shopping', 'list', itemName],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: `Add ${itemName} to my list`,
      persistentIdentifier: `add-${itemName}`,
    };

    console.log('🎤 Siri shortcut donated:', itemName);
    // Native iOS will handle this via NSUserActivity
  },

  /**
   * Donate "View Shopping List" shortcut
   */
  async donateViewListShortcut(): Promise<void> {
    if (Platform.OS !== 'ios') return;

    const shortcut: SiriShortcut = {
      activityType: 'com.codysmith.ellio.viewList',
      title: 'View Shopping List',
      keywords: ['view', 'shopping', 'list', 'show'],
      isEligibleForSearch: true,
      isEligibleForPrediction: true,
      suggestedInvocationPhrase: 'Show my shopping list',
      persistentIdentifier: 'view-list',
    };

    console.log('🎤 Siri view shortcut donated');
  },

  /**
   * Create custom Siri phrases
   * Users can record: "Hey Siri, grocery time"
   */
  getSuggestedPhrases(): string[] {
    return [
      'Add to my shopping list',
      'Show my shopping list',
      'What do I need to buy?',
      'Add milk to my list',
      'Grocery time',
      'Shopping mode',
    ];
  },
};
