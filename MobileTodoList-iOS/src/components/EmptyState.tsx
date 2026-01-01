import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onActionPress?: () => void;
  secondaryActionText?: string;
  onSecondaryActionPress?: () => void;
  helpText?: string;
  bulletPoints?: string[];
}

export type EmptyStateType =
  | 'budget'
  | 'insights'
  | 'analytics'
  | 'cashback_accounts'
  | 'receipts'
  | 'tasks'
  | 'generic';

/**
 * Predefined empty state configurations
 * All use calm, helpful messaging per UX_GAPS.md
 */
export const EMPTY_STATE_CONFIGS: Record<
  EmptyStateType,
  Omit<EmptyStateProps, 'onActionPress' | 'onSecondaryActionPress'>
> = {
  budget: {
    icon: '💰',
    title: 'Set your first budget',
    message:
      "Set a budget to track your spending and get alerts when you're close to limits.",
    actionText: 'Set Your First Budget',
    helpText: "Not sure where to start? Most people begin with a $500/month grocery budget.",
  },
  insights: {
    icon: '📊',
    title: 'Learning your patterns',
    message: "We're learning your shopping patterns. Come back after you've:",
    bulletPoints: [
      'Completed 10+ tasks',
      'Scanned 5+ receipts',
      'Shopped at 2+ different stores',
    ],
  },
  analytics: {
    icon: '📈',
    title: 'Not enough data yet',
    message: 'We need 7 days of activity to show analytics. In the meantime, check out:',
    bulletPoints: ['Weekly Summary', 'Your completed tasks', 'Savings Dashboard'],
    helpText: 'Keep scanning receipts and completing tasks!',
  },
  cashback_accounts: {
    icon: '💸',
    title: 'Connect cashback apps',
    message: "No cashback accounts connected yet. When you're ready, connect apps like:",
    bulletPoints: ['Rakuten', 'Ibotta', 'Fetch Rewards', 'Honey'],
    actionText: 'Browse Integrations',
  },
  receipts: {
    icon: '🧾',
    title: 'No receipts yet',
    message:
      'Scan your first receipt to start tracking spending and finding savings.',
    actionText: 'Scan Your First Receipt',
  },
  tasks: {
    icon: '✅',
    title: 'No tasks yet',
    message: 'Add your first task to get started with Ellio.',
    actionText: 'Add Your First Task',
  },
  generic: {
    icon: '📋',
    title: 'Nothing here yet',
    message: 'Get started by adding your first item.',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📋',
  title,
  message,
  actionText,
  onActionPress,
  secondaryActionText,
  onSecondaryActionPress,
  helpText,
  bulletPoints,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {bulletPoints && bulletPoints.length > 0 && (
        <View style={styles.bulletContainer}>
          {bulletPoints.map((point, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletIcon}>✓</Text>
              <Text style={styles.bulletText}>{point}</Text>
            </View>
          ))}
        </View>
      )}

      {helpText && <Text style={styles.helpText}>{helpText}</Text>}

      {actionText && onActionPress && (
        <TouchableOpacity style={styles.primaryButton} onPress={onActionPress}>
          <Text style={styles.primaryButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}

      {secondaryActionText && onSecondaryActionPress && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onSecondaryActionPress}>
          <Text style={styles.secondaryButtonText}>{secondaryActionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  bulletContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bulletIcon: {
    ...typography.body,
    color: palette.primary,
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  bulletText: {
    ...typography.body,
    color: palette.textSecondary,
    flex: 1,
  },
  helpText: {
    ...typography.secondary,
    color: palette.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  primaryButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  secondaryButtonText: {
    ...typography.body,
    color: palette.primary,
  },
});
