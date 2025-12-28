import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import { useTodoStore } from '../store';

export const TaskAnalyticsPage: React.FC = () => {
  const { tasks } = useTodoStore();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Filter by timeframe
  const filteredTasks =
    timeframe === 'all'
      ? tasks
      : tasks.filter(t => {
          const cutoff = timeframe === 'week' ? weekAgo : monthAgo;
          return t.createdAt && t.createdAt >= cutoff;
        });

  // Calculate stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueTasks = filteredTasks.filter(
    t => !t.completed && t.dueDate && t.dueDate < now,
  ).length;
  const onTimeTasks = filteredTasks.filter(
    t => t.completed && t.dueDate && t.completedAt && t.completedAt <= t.dueDate,
  ).length;
  const onTimeRate =
    completedTasks > 0 ? (onTimeTasks / completedTasks) * 100 : 0;

  // Productivity score
  const productivityScore = Math.round(
    (completionRate * 0.6 + onTimeRate * 0.3 + (100 - (overdueTasks / activeTasks) * 100) * 0.1),
  );

  // Daily completion trend
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const dailyCompletions = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    return filteredTasks.filter(
      t =>
        t.completed &&
        t.completedAt &&
        t.completedAt >= date.getTime() &&
        t.completedAt < nextDay.getTime(),
    ).length;
  });

  const maxDaily = Math.max(...dailyCompletions, 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📈 Task Analytics</Text>
        <Text style={styles.headerSubtitle}>Your productivity insights</Text>
      </View>

      {/* Timeframe Selector */}
      <View style={styles.timeframeContainer}>
        {(['week', 'month', 'all'] as const).map(tf => (
          <TouchableOpacity
            key={tf}
            style={[styles.timeframeButton, timeframe === tf && styles.timeframeButtonActive]}
            onPress={() => setTimeframe(tf)}>
            <Text
              style={[
                styles.timeframeText,
                timeframe === tf && styles.timeframeTextActive,
              ]}>
              {tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Productivity Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>Productivity Score</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumber}>{productivityScore}</Text>
          <Text style={styles.scoreOutOf}>/100</Text>
        </View>
        <Text style={styles.scoreDescription}>
          {productivityScore >= 80
            ? '🌟 Excellent!'
            : productivityScore >= 60
              ? '👍 Good work!'
              : '💪 Keep going!'}
        </Text>
      </View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>✅</Text>
          <Text style={styles.metricValue}>{completedTasks}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
          <Text style={styles.metricPercent}>{completionRate.toFixed(0)}%</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>📋</Text>
          <Text style={styles.metricValue}>{activeTasks}</Text>
          <Text style={styles.metricLabel}>Active</Text>
          <Text style={styles.metricPercent}>
            {((activeTasks / totalTasks) * 100 || 0).toFixed(0)}%
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>⏰</Text>
          <Text style={styles.metricValue}>{onTimeTasks}</Text>
          <Text style={styles.metricLabel}>On Time</Text>
          <Text style={styles.metricPercent}>{onTimeRate.toFixed(0)}%</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricIcon}>🔴</Text>
          <Text style={styles.metricValue}>{overdueTasks}</Text>
          <Text style={styles.metricLabel}>Overdue</Text>
        </View>
      </View>

      {/* Daily Completion Trend */}
      <View style={styles.trendCard}>
        <Text style={styles.sectionTitle}>📊 Daily Completions</Text>
        <View style={styles.chartContainer}>
          {last7Days.map((date, index) => {
            const count = dailyCompletions[index];
            const height = (count / maxDaily) * 100;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(height, 5)}%`,
                        backgroundColor:
                          index === 6 ? palette.primary : palette.info,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{count}</Text>
                <Text style={styles.barLabel}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.sectionTitle}>💡 Insights</Text>

        {completionRate >= 70 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>🎉</Text>
            <Text style={styles.insightText}>
              Great job! You're completing {completionRate.toFixed(0)}% of your tasks.
            </Text>
          </View>
        )}

        {overdueTasks > 0 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>⚠️</Text>
            <Text style={styles.insightText}>
              You have {overdueTasks} overdue {overdueTasks === 1 ? 'task' : 'tasks'}.
              Consider rescheduling or breaking them into smaller tasks.
            </Text>
          </View>
        )}

        {onTimeRate >= 80 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>⭐</Text>
            <Text style={styles.insightText}>
              Excellent! You complete {onTimeRate.toFixed(0)}% of tasks on time.
            </Text>
          </View>
        )}

        {activeTasks > 10 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>📌</Text>
            <Text style={styles.insightText}>
              You have {activeTasks} active tasks. Focus on completing high-priority items
              first.
            </Text>
          </View>
        )}

        {completionRate < 50 && (
          <View style={styles.insightItem}>
            <Text style={styles.insightIcon}>💪</Text>
            <Text style={styles.insightText}>
              Try breaking large tasks into smaller, achievable steps to boost your completion
              rate.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  timeframeContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: palette.surface,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  timeframeText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  timeframeTextActive: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  scoreCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: palette.primary,
    borderRadius: radius.card,
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.body,
    color: palette.surface,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  scoreNumber: {
    ...typography.h1,
    color: palette.primary,
    fontSize: 48,
    fontWeight: '700',
  },
  scoreOutOf: {
    ...typography.body,
    color: palette.textSecondary,
  },
  scoreDescription: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    gap: spacing.md,
  },
  metricCard: {
    width: '47%',
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  metricValue: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  metricPercent: {
    ...typography.bodyBold,
    color: palette.primary,
    fontSize: 14,
  },
  trendCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 150,
    paddingTop: spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  bar: {
    width: '100%',
    backgroundColor: palette.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 8,
  },
  barValue: {
    ...typography.secondary,
    color: palette.text,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  barLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 10,
  },
  insightsCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  insightItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  insightText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
