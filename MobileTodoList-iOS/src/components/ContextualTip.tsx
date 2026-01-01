import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContextualTipProps {
  page: string;
  tipId: string;
  message: string;
  position?: 'top' | 'bottom';
  onDismiss?: () => void;
}

export const ContextualTip: React.FC<ContextualTipProps> = ({
  page,
  tipId,
  message,
  position = 'top',
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    checkIfShouldShow();
  }, [page, tipId]);

  const checkIfShouldShow = async () => {
    try {
      const key = `tip_dismissed_${page}_${tipId}`;
      const dismissed = await AsyncStorage.getItem(key);
      
      if (!dismissed) {
        setVisible(true);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.log('Error checking tip status:', error);
    }
  };

  const handleDismiss = async () => {
    try {
      const key = `tip_dismissed_${page}_${tipId}`;
      await AsyncStorage.setItem(key, 'true');
      
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onDismiss?.();
      });
    } catch (error) {
      console.log('Error dismissing tip:', error);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.positionTop : styles.positionBottom,
        { opacity: fadeAnim },
      ]}
    >
      <View style={styles.bubble}>
        <View style={styles.header}>
          <Text style={styles.icon}>💡</Text>
          <Text style={styles.label}>Tip</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>Got it</Text>
        </TouchableOpacity>
      </View>
      {position === 'top' && <View style={styles.arrowDown} />}
      {position === 'bottom' && <View style={styles.arrowUp} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  positionTop: {
    top: 80,
  },
  positionBottom: {
    bottom: 100,
  },
  bubble: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  message: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
  },
  dismissText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  arrowDown: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8B5CF6',
    alignSelf: 'center',
    marginTop: -1,
  },
  arrowUp: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#8B5CF6',
    alignSelf: 'center',
    marginBottom: -1,
  },
});
