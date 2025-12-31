import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';
import { Task } from '../store';
import {
  ChartIcon,
  DollarIcon,
  CheckmarkIcon,
  TargetIcon,
  TrendUpIcon,
  CalendarIcon,
} from './Icons';

import { NavigationPage } from './NavigationMenu';

interface HomePageProps {
  tasks: Task[];
  userName: string;
  onNavigate: (page: NavigationPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ tasks, userName, onNavigate }) => {
  const [weeklySavingsGoal, setWeeklySavingsGoal] = useState('150');
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  // Calculate statistics
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay()
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completedThisWeek = tasks.filter(
    t => t.completed && t.completedAt && t.completedAt >= startOfWeek.getTime()
  ).length;

  const upcomingTasks = tasks.filter(
    t => !t.completed && t.dueDate && t.dueDate <= Date.now() + 7 * 24 * 60 * 60 * 1000
  ).length;

  // Mock data - in real app, calculate from actual spending/cashback
  const moneySavedThisWeek = 47.32;
  const cashbackEarned = 23.15;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const savingsGoalNumber = parseFloat(weeklySavingsGoal) || 150;
  const savingsProgress = Math.min((moneySavedThisWeek / savingsGoalNumber) * 100, 100);

  const handleSaveGoal = () => {
    setIsEditingGoal(false);
    Alert.alert('Goal Updated', `Weekly savings goal set to $${weeklySavingsGoal}`);
  };

  const showMoneySavedInfo = () => {
    Alert.alert(
      '💰 How Money Saved Works',
      'Ellio compares prices on your receipts to average prices in your area (using county + ZIP from receipts, not GPS).\n\nThis shows how much you saved by shopping smart!\n\nScan 3+ receipts to see your savings.',
      [{ text: 'Got It' }]
    );
  };

  const showCashbackInfo = () => {
    Alert.alert(
      '💳 How Cashback Works',
      'Connect your cashback apps (Rakuten, Ibotta, Fetch) and Ellio will track your total earnings in one place.\n\nLink accounts in Settings → Integrations.',
      [{ text: 'Got It' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hey, {userName}</Text>
        <Text style={styles.subtitle}>Here's what's happening</Text>
      </View>

      {/* Statistics Overview */}
      <View style={styles.statsGrid}>
        {/* Tasks Card */}
        <TouchableOpacity
          style={[styles.statCard, styles.statCardLarge]}
          onPress={() => onNavigate('analytics')}
        >
          <View style={styles.statIcon}>
            <CheckmarkIcon size={24} color={palette.primary} />
          </View>
          <Text style={styles.statValue}>{completedThisWeek}</Text>
          <Text style={styles.statLabel}>Completed this week</Text>
          <Text style={styles.statDetail}>{completionRate}% completion rate</Text>
        </TouchableOpacity>

        {/* Upcoming Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('calendar')}>
          <View style={styles.statIcon}>
            <CalendarIcon size={20} color={palette.warning} />
          </View>
          <Text style={styles.statValueSmall}>{upcomingTasks}</Text>
          <Text style={styles.statLabelSmall}>Due soon</Text>
        </TouchableOpacity>

        {/* Money Saved Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('savingsdashboard')}>
          <View style={styles.cardHeader}>
            <View style={styles.statIcon}>
              <DollarIcon size={20} color={palette.success} />
            </View>
            <TouchableOpacity onPress={showMoneySavedInfo} style={styles.helpButton}>
              <Text style={styles.helpIcon}>?</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statValueSmall}>${moneySavedThisWeek.toFixed(2)}</Text>
          <Text style={styles.statLabelSmall}>Saved</Text>
        </TouchableOpacity>

        {/* Cashback Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('cashback')}>
          <View style={styles.cardHeader}>
            <View style={styles.statIcon}>
              <TrendUpIcon size={20} color={palette.primary} />
            </View>
            <TouchableOpacity onPress={showCashbackInfo} style={styles.helpButton}>
              <Text style={styles.helpIcon}>?</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.statValueSmall}>${cashbackEarned.toFixed(2)}</Text>
          <Text style={styles.statLabelSmall}>Cashback</Text>
        </TouchableOpacity>

        {/* Total Tasks Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('analytics')}>
          <View style={styles.statIcon}>
            <ChartIcon size={20} color={palette.textSecondary} />
          </View>
          <Text style={styles.statValueSmall}>{totalTasks}</Text>
          <Text style={styles.statLabelSmall}>Total tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Savings Goal */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <TargetIcon size={20} color={palette.primary} />
            <Text style={styles.goalTitle}>Weekly Savings Goal</Text>
          </View>
          {!isEditingGoal ? (
            <TouchableOpacity onPress={() => setIsEditingGoal(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSaveGoal}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        {isEditingGoal ? (
          <View style={styles.goalInputRow}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.goalInput}
              value={weeklySavingsGoal}
              onChangeText={setWeeklySavingsGoal}
              keyboardType="decimal-pad"
              placeholder="150"
              placeholderTextColor={palette.textTertiary}
            />
            <Text style={styles.perWeek}>/ week</Text>
          </View>
        ) : (
          <Text style={styles.goalAmount}>${savingsGoalNumber.toFixed(2)} / week</Text>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${savingsProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            ${moneySavedThisWeek.toFixed(2)} of ${savingsGoalNumber.toFixed(2)} (
            {Math.round(savingsProgress)}%)
          </Text>
          {savingsProgress >= 50 && savingsProgress < 100 && (
            <Text style={styles.encouragementText}>Halfway there! 🌟</Text>
          )}
        </View>

        {savingsProgress >= 100 && (
          <View style={styles.goalAchieved}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.goalAchievedText}>
              Goal crushed! You saved ${moneySavedThisWeek.toFixed(2)} this week!
            </Text>
          </View>
        )}
        {savingsProgress > 100 && (
          <Text style={styles.bonusText}>
            +${(moneySavedThisWeek - savingsGoalNumber).toFixed(2)} above goal 🚀
          </Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('budget')}>
            <Text style={styles.actionIcon}>💰</Text>
            <Text style={styles.actionText}>Budget</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('receipts')}>
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Receipts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('insights')}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('calendar')}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacing for bottom navigation */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.h1,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    ...shadow.light,
    width: '48%',
  },
  statCardLarge: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  helpButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.surface,
  },
  statIcon: {
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h1,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  statDetail: {
    ...typography.caption,
    color: palette.textTertiary,
  },
  statValueSmall: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  statLabelSmall: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  goalCard: {
    backgroundColor: palette.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadow.light,
    marginBottom: spacing.xl,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  goalTitle: {
    ...typography.h3,
    color: palette.text,
  },
  editButton: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  saveButton: {
    ...typography.bodyBold,
    color: palette.success,
  },
  goalAmount: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.md,
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dollarSign: {
    ...typography.h2,
    color: palette.text,
    marginRight: spacing.xs,
  },
  goalInput: {
    ...typography.h2,
    color: palette.text,
    borderBottomWidth: 2,
    borderBottomColor: palette.primary,
    paddingVertical: spacing.xs,
    minWidth: 100,
  },
  perWeek: {
    ...typography.body,
    color: palette.textSecondary,
    marginLeft: spacing.sm,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: palette.backgroundDark,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.success,
  },
  progressText: {
    ...typography.secondary,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  encouragementText: {
    ...typography.bodyBold,
    color: palette.warning,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  goalAchieved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  celebrationEmoji: {
    fontSize: 20,
  },
  goalAchievedText: {
    ...typography.bodyBold,
    color: palette.success,
    flex: 1,
  },
  bonusText: {
    ...typography.secondary,
    color: palette.success,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.md,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    backgroundColor: palette.surface,
    width: '48%',
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    ...shadow.sm,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionText: {
    ...typography.body,
    color: palette.text,
  },
  bottomSpacer: {
    height: 100,
  },
});
