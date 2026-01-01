import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ContextualTip } from './ContextualTip';
import { getTipsForPage, PAGE_NAME_MAP } from '../content/pageTips';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PageTipContainerProps {
  currentPage: string;
  children: React.ReactNode;
}

/**
 * Container that automatically shows contextual tips based on current page
 * Follows "1 tip per session" rule for calm UX
 */
export const PageTipContainer: React.FC<PageTipContainerProps> = ({
  currentPage,
  children,
}) => {
  const [activeTip, setActiveTip] = useState<any>(null);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    checkAndShowTip();
  }, [currentPage]);

  const checkAndShowTip = async () => {
    try {
      // Map navigation page name to tip page name
      const tipPageName = PAGE_NAME_MAP[currentPage] || currentPage;
      
      // Check if we've already shown a tip this session
      const sessionKey = `tip_shown_session_${Date.now()}`;
      const shownThisSession = await AsyncStorage.getItem('tip_shown_this_session');
      
      if (shownThisSession) {
        // Already showed one tip this session - respect the calm philosophy
        return;
      }

      // Get tips for this page
      const pageTips = getTipsForPage(tipPageName);
      if (pageTips.length === 0) {
        return;
      }

      // Find first tip that hasn't been dismissed
      for (const tip of pageTips) {
        const dismissKey = `tip_dismissed_${tip.page}_${tip.tipId}`;
        const dismissed = await AsyncStorage.getItem(dismissKey);
        
        if (!dismissed) {
          setActiveTip(tip);
          setShowTip(true);
          
          // Mark that we showed a tip this session
          await AsyncStorage.setItem('tip_shown_this_session', 'true');
          break;
        }
      }
    } catch (error) {
      console.log('Error checking tips:', error);
    }
  };

  const handleDismiss = () => {
    setShowTip(false);
    setActiveTip(null);
  };

  return (
    <View style={styles.container}>
      {children}
      {showTip && activeTip && (
        <ContextualTip
          page={activeTip.page}
          tipId={activeTip.tipId}
          message={activeTip.message}
          position={activeTip.position || 'top'}
          onDismiss={handleDismiss}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/**
 * Helper to reset session tip counter (call on app startup)
 */
export const resetSessionTipCounter = async () => {
  try {
    await AsyncStorage.removeItem('tip_shown_this_session');
  } catch (error) {
    console.log('Error resetting tip counter:', error);
  }
};

/**
 * Helper to reset all dismissed tips (for debugging)
 */
export const resetAllTips = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const tipKeys = keys.filter(key => key.startsWith('tip_dismissed_'));
    await AsyncStorage.multiRemove(tipKeys);
    await resetSessionTipCounter();
    console.log('✅ All tips reset');
  } catch (error) {
    console.log('Error resetting tips:', error);
  }
};
