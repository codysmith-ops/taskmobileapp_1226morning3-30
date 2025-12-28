import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

interface FeatureTipProps {
  visible: boolean;
  title: string;
  message: string;
  icon?: string;
  canDisable?: boolean;
  onClose: () => void;
  onDisableForever?: () => void;
}

export const FeatureTip: React.FC<FeatureTipProps> = ({
  visible,
  title,
  message,
  icon = 'lightbulb',
  canDisable = true,
  onClose,
  onDisableForever,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleDisable = () => {
    if (onDisableForever) {
      onDisableForever();
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.tipBubble, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <ScrollView style={styles.messageContainer}>
            <Text style={styles.message}>{message}</Text>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
              <Text style={styles.gotItButtonText}>Got it!</Text>
            </TouchableOpacity>
            {canDisable && onDisableForever && (
              <TouchableOpacity style={styles.disableButton} onPress={handleDisable}>
                <Text style={styles.disableButtonText}>Don't show again</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  tipBubble: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    ...shadow.large,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  messageContainer: {
    maxHeight: 300,
    marginBottom: spacing.lg,
  },
  message: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  gotItButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  gotItButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  disableButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  disableButtonText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
});
