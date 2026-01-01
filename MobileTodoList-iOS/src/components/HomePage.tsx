import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { EllioColors, EllioSpacing, EllioRadius, EllioTypography, EllioShadow } from '../theme/ellioTokens';
import { Task } from '../store';
import {
  ChartIcon,
  DollarIcon,
  CheckmarkIcon,
  TargetIcon,
  TrendUpIcon,
  CalendarIcon,
} from './Icons';
import { InfoTooltip } from './InfoTooltip';

import { NavigationPage } from './NavigationMenu';
import {
  getActiveGoal,
  createSavingsGoal,
  calculateGoalProgress,
  getGoalStatusMessage,
  GoalProgress,
  SavingsGoal,
} from '../services/savingsGoals.service';
import {
  getSubscriptionStatus,
  isTrialEndingSoon,
  getTrialStatusMessage,
  SubscriptionStatus,
} from '../services/trialSubscription.service';

interface HomePageProps {
  tasks: Task[];
  userName: string;
  onNavigate: (page: NavigationPage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ tasks, userName, onNavigate }) => {
  const [weeklySavingsGoal, setWeeklySavingsGoal] = useState('150');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<SavingsGoal | null>(null);
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [trialEnding, setTrialEnding] = useState(false);
  const [trialMessage, setTrialMessage] = useState('');

  // Load savings goal and subscription status on mount
  useEffect(() => {
    loadSavingsGoal();
    loadSubscriptionStatus();
  }, []);

  const loadSavingsGoal = async () => {
    const activeGoal = await getActiveGoal();
    if (activeGoal) {
      setCurrentGoal(activeGoal);
      setWeeklySavingsGoal(activeGoal.targetAmount.toString());
      const progress = await calculateGoalProgress(activeGoal);
      setGoalProgress(progress);
    }
  };

  const loadSubscriptionStatus = async () => {
    const status = await getSubscriptionStatus();
    setSubscriptionStatus(status);
    
    const isEnding = await isTrialEndingSoon();
    setTrialEnding(isEnding);
    
    if (status.isTrial) {
      const message = await getTrialStatusMessage();
      setTrialMessage(message);
    }
  };


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

  const handleSaveGoal = async () => {
    setIsEditingGoal(false);
    const amount = parseFloat(weeklySavingsGoal) || 150;
    
    // Create new weekly savings goal
    await createSavingsGoal('weekly', amount, 'groceries');
    await loadSavingsGoal();
    
    Alert.alert('Goal Updated', `Weekly savings goal set to $${amount.toFixed(2)}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Trial Reminder Banner */}
      {trialEnding && trialMessage && (
        <TouchableOpacity 
          style={styles.trialBanner}
          onPress={() => onNavigate('settings')}
        >
          <Text style={styles.trialBannerIcon}>⏰</Text>
          <View style={styles.trialBannerContent}>
            <Text style={styles.trialBannerText}>{trialMessage}</Text>
            <Text style={styles.trialBannerAction}>Upgrade Now →</Text>
          </View>
        </TouchableOpacity>
      )}

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
            <CheckmarkIcon size={24} color={EllioColors.primary.main} />
          </View>
          <Text style={styles.statValue}>{completedThisWeek}</Text>
          <Text style={styles.statLabel}>Completed this week</Text>
          <Text style={styles.statDetail}>{completionRate}% completion rate</Text>
        </TouchableOpacity>

        {/* Upcoming Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('calendar')}>
          <View style={styles.statIcon}>
            <CalendarIcon size={20} color={EllioColors.states.warning.main} />
          </View>
          <Text style={styles.statValueSmall}>{upcomingTasks}</Text>
          <Text style={styles.statLabelSmall}>Due soon</Text>
        </TouchableOpacity>

        {/* Money Saved Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('savingsdashboard')}>
          <View style={styles.cardHeader}>
            <View style={styles.statIcon}>
              <DollarIcon size={20} color={EllioColors.states.success.main} />
            </View>
            <InfoTooltip
              title="How Money Saved Works"
              body="Ellio compares prices on your receipts to average prices in your area (using county + ZIP from receipts, not GPS). This shows how much you saved by shopping smart!"
              footnote="Scan 3+ receipts to see your savings."
              iconSize={14}
            />
          </View>
          <Text style={styles.statValueSmall}>${moneySavedThisWeek.toFixed(2)}</Text>
          <Text style={styles.statLabelSmall}>Saved</Text>
        </TouchableOpacity>

        {/* Cashback Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('cashback')}>
          <View style={styles.cardHeader}>
            <View style={styles.statIcon}>
              <TrendUpIcon size={20} color={EllioColors.primary.main} />
            </View>
            <InfoTooltip
              title="How Cashback Works"
              body="Connect your cashback apps (Rakuten, Ibotta, Fetch) and Ellio will track your total earnings in one place."
              footnote="Link accounts in Settings → Integrations."
              iconSize={14}
            />
          </View>
          <Text style={styles.statValueSmall}>${cashbackEarned.toFixed(2)}</Text>
          <Text style={styles.statLabelSmall}>Cashback</Text>
        </TouchableOpacity>

        {/* Total Tasks Card */}
        <TouchableOpacity style={styles.statCard} onPress={() => onNavigate('analytics')}>
          <View style={styles.statIcon}>
            <ChartIcon size={20} color={EllioColors.text.secondary} />
          </View>
          <Text style={styles.statValueSmall}>{totalTasks}</Text>
          <Text style={styles.statLabelSmall}>Total tasks</Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Savings Goal */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={styles.goalTitleRow}>
            <TargetIcon size={20} color={EllioColors.primary.main} />
            <Text style={styles.goalTitle}>Weekly Savings Goal</Text>
            <InfoTooltip
              title="How Goal Progress Works"
              body="Your progress is calculated from receipts scanned this week compared to your target. It updates in real-time as you shop."
              iconSize={14}
            />
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
              placeholderTextColor={EllioColors.text.tertiary}
            />
            <Text style={styles.perWeek}>/ week</Text>
          </View>
        ) : (
          <Text style={styles.goalAmount}>${savingsGoalNumber.toFixed(2)} / week</Text>
        )}

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${goalProgress?.percentComplete || savingsProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            ${moneySavedThisWeek.toFixed(2)} of ${savingsGoalNumber.toFixed(2)} (
            {Math.round(goalProgress?.percentComplete || savingsProgress)}%)
          </Text>
          {goalProgress && (
            <Text style={styles.goalStatusMessage}>
              {getGoalStatusMessage(goalProgress)}
            </Text>
          )}
          {(goalProgress?.percentComplete || savingsProgress) >= 50 && (goalProgress?.percentComplete || savingsProgress) < 100 && (
            <Text style={styles.encouragementText}>Halfway there! 🌟</Text>
          )}
        </View>

        {(goalProgress?.percentComplete || savingsProgress) >= 100 && (
          <View style={styles.goalAchieved}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.goalAchievedText}>
              Goal crushed! You saved ${moneySavedThisWeek.toFixed(2)} this week!
            </Text>
          </View>
        )}
        {(goalProgress?.percentComplete || savingsProgress) > 100 && (
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
    paddingHorizontal: EllioSpacing.lg,
    paddingTop: EllioSpacing.lg,
  },
  trialBanner: {
    backgroundColor: '#FEF3C7',
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EllioSpacing.lg,
    ...EllioShadow.light,
  },
  trialBannerIcon: {
    fontSize: 28,
    marginRight: EllioSpacing.md,
  },
  trialBannerContent: {
    flex: 1,
  },
  trialBannerText: {
    ...EllioTypography.bodyBold,
    color: '#92400E',
    marginBottom: EllioSpacing.xs,
  },
  trialBannerAction: {
    ...EllioTypography.caption,
    color: EllioColors.primary.main,
    fontWeight: '600',
  },
  header: {
    marginBottom: EllioSpacing.xl,
  },
  greeting: {
    ...EllioTypography.h1,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  subtitle: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EllioSpacing.md,
    marginBottom: EllioSpacing.xl,
  },
  statCard: {
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.md,
    borderRadius: EllioRadius.lg,
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
    marginBottom: EllioSpacing.sm,
  },
  statIcon: {
    marginBottom: EllioSpacing.sm,
  },
  statValue: {
    ...EllioTypography.h1,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  statLabel: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginBottom: EllioSpacing.xs,
  },
  statDetail: {
    ...EllioTypography.caption,
    color: EllioColors.text.tertiary,
  },
  statValueSmall: {
    ...EllioTypography.h2,
    color: palette.text,
    marginBottom: EllioSpacing.xs,
  },
  statLabelSmall: {
    ...EllioTypography.caption,
    color: EllioColors.text.secondary,
  },
  goalCard: {
    backgroundColor: EllioColors.surface.background,
    padding: EllioSpacing.lg,
    borderRadius: EllioRadius.lg,
    ...EllioShadow.light,
    marginBottom: EllioSpacing.xl,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: EllioSpacing.md,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EllioSpacing.sm,
  },
  goalTitle: {
    ...EllioTypography.h3,
    color: palette.text,
  },
  editButton: {
    ...EllioTypography.bodyBold,
    color: EllioColors.primary.main,
  },
  saveButton: {
    ...EllioTypography.bodyBold,
    color: EllioColors.states.success.main,
  },
  goalAmount: {
    ...EllioTypography.h2,
    color: palette.text,
    marginBottom: EllioSpacing.md,
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EllioSpacing.md,
  },
  dollarSign: {
    ...EllioTypography.h2,
    color: palette.text,
    marginRight: EllioSpacing.xs,
  },
  goalInput: {
    ...EllioTypography.h2,
    color: palette.text,
    borderBottomWidth: 2,
    borderBottomColor: EllioColors.primary.main,
    paddingVertical: EllioSpacing.xs,
    minWidth: 100,
  },
  perWeek: {
    ...EllioTypography.body,
    color: EllioColors.text.secondary,
    marginLeft: EllioSpacing.sm,
  },
  progressContainer: {
    marginTop: EllioSpacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: EllioColors.surface.elevated,
    borderRadius: EllioRadius.full,
    overflow: 'hidden',
    marginBottom: EllioSpacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: EllioColors.states.success.main,
  },
  progressText: {
    ...EllioTypography.secondary,
    color: EllioColors.text.secondary,
    textAlign: 'center',
  },
  goalStatusMessage: {
    ...EllioTypography.caption,
    color: EllioColors.primary.main,
    textAlign: 'center',
    marginTop: EllioSpacing.xs,
    fontStyle: 'italic',
  },
  encouragementText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.states.warning.main,
    textAlign: 'center',
    marginTop: EllioSpacing.xs,
  },
  goalAchieved: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: EllioSpacing.xs,
    marginTop: EllioSpacing.md,
    paddingTop: EllioSpacing.md,
    borderTopWidth: 1,
    borderTopColor: EllioColors.border.standard,
  },
  celebrationEmoji: {
    fontSize: 20,
  },
  goalAchievedText: {
    ...EllioTypography.bodyBold,
    color: EllioColors.states.success.main,
    flex: 1,
  },
  bonusText: {
    ...EllioTypography.secondary,
    color: EllioColors.states.success.main,
    textAlign: 'center',
    marginTop: EllioSpacing.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    ...EllioTypography.h3,
    color: palette.text,
    marginBottom: EllioSpacing.md,
  },
  quickActions: {
    marginBottom: EllioSpacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: EllioSpacing.md,
  },
  actionButton: {
    backgroundColor: EllioColors.surface.background,
    width: '48%',
    padding: EllioSpacing.lg,
    borderRadius: EllioRadius.lg,
    alignItems: 'center',
    ...EllioShadow.light,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: EllioSpacing.sm,
  },
  actionText: {
    ...EllioTypography.body,
    color: palette.text,
  },
  bottomSpacer: {
    height: 100,
  },
});
