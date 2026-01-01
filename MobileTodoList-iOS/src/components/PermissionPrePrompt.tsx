/**
 * Permission Pre-Prompt Component
 * Shows custom explanation BEFORE iOS system prompt
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';

export type PermissionType = 'microphone' | 'camera' | 'location' | 'notifications';

interface PermissionPrePromptProps {
  visible: boolean;
  permissionType: PermissionType;
  onAllow: () => void;
  onDeny: () => void;
}

const PERMISSION_CONFIG: Record<
  PermissionType,
  {
    icon: string;
    title: string;
    description: string;
    benefits: string[];
    privacy: string;
  }
> = {
  microphone: {
    icon: '🎤',
    title: 'Voice makes adding tasks faster',
    description: 'Speak your shopping list naturally, and Ellio organizes it for you.',
    benefits: [
      'Add multiple tasks at once',
      'Hands-free while driving or cooking',
      'Automatically detects categories and priorities',
    ],
    privacy: 'Audio is processed on-device. Nothing is stored or sent to servers.',
  },
  camera: {
    icon: '📷',
    title: 'Snap photos of receipts',
    description: 'Ellio extracts items, prices, and stores automatically.',
    benefits: [
      'Track spending with zero typing',
      'Compare prices to area averages',
      'Maximize cashback rewards',
    ],
    privacy: 'Photos stay on your device. Text extraction happens locally.',
  },
  location: {
    icon: '📍',
    title: 'Find nearby stores',
    description: 'Ellio uses approximate area (county + ZIP) from receipt headers.',
    benefits: [
      'See price comparisons for your area',
      'Suggest stores where items are available',
      'Never track precise GPS location',
    ],
    privacy: 'We only extract county/ZIP from receipt text. No GPS tracking. No location history.',
  },
  notifications: {
    icon: '🔔',
    title: 'Gentle reminders when helpful',
    description: 'Get notified about trial expiry, savings achievements, and deal alerts.',
    benefits: [
      'Never miss free trial deadlines',
      'Celebrate savings milestones',
      'Optional store proximity alerts',
    ],
    privacy: 'You control frequency. Disable anytime in Settings.',
  },
};

export const PermissionPrePrompt: React.FC<PermissionPrePromptProps> = ({
  visible,
  permissionType,
  onAllow,
  onDeny,
}) => {
  const config = PERMISSION_CONFIG[permissionType];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onDeny}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.icon}>{config.icon}</Text>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.description}>{config.description}</Text>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>This helps you:</Text>
            {config.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.bulletPoint}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.privacyContainer}>
            <Text style={styles.privacyLabel}>🔒 Privacy</Text>
            <Text style={styles.privacyText}>{config.privacy}</Text>
          </View>

          <TouchableOpacity style={styles.allowButton} onPress={onAllow}>
            <Text style={styles.allowButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.denyButton} onPress={onDeny}>
            <Text style={styles.denyButtonText}>Not now</Text>
          </TouchableOpacity>
        </View>
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
  modal: {
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...shadow.xl,
  },
  icon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  benefitsContainer: {
    backgroundColor: palette.backgroundSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  benefitsTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bulletPoint: {
    color: palette.success,
    marginRight: spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  privacyContainer: {
    backgroundColor: '#F0F4FF',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  privacyLabel: {
    ...typography.bodyBold,
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  privacyText: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  allowButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  allowButtonText: {
    ...typography.bodyBold,
    color: '#fff',
    fontSize: 17,
  },
  denyButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  denyButtonText: {
    ...typography.body,
    color: palette.textSecondary,
  },
});
