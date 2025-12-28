import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTodoStore } from '../store';
import { palette, spacing, typography, radius, shadow } from '../theme';
import { ChartIcon, TargetIcon, TrendUpIcon, DollarIcon, CreditCardIcon } from '../components/Icons';

export const WeeklySummaryPage: React.FC = () => {
  const { tasks } = useTodoStore();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  // Calculate weekly metrics
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const weekTasks = tasks.filter(t => {
    if (!t.createdAt) return false;
    return t.createdAt >= weekStart.getTime();
  });

  const completedThisWeek = weekTasks.filter(t => t.completed).length;
  const totalThisWeek = weekTasks.length;
  const completionRate = totalThisWeek > 0 ? (completedThisWeek / totalThisWeek) * 100 : 0;

  // Calculate on-time completion
  const tasksWithDueDate = weekTasks.filter(t => t.dueDate && t.completed);
  const onTimeCompleted = tasksWithDueDate.filter(t => {
    if (!t.completedAt || !t.dueDate) return false;
    return t.completedAt <= t.dueDate;
  }).length;
  const onTimeRate = tasksWithDueDate.length > 0 ? (onTimeCompleted / tasksWithDueDate.length) * 100 : 0;

  // Calculate letter grade
  const getLetterGrade = (rate: number): string => {
    if (rate >= 90) return 'A';
    if (rate >= 80) return 'B';
    if (rate >= 70) return 'C';
    if (rate >= 60) return 'D';
    return 'F';
  };

  const grade = getLetterGrade(completionRate);
  const gradeColor = completionRate >= 80 ? palette.success : completionRate >= 60 ? palette.warning : palette.error;

  // Daily breakdown
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));
    const dayTasks = tasks.filter(t => {
      if (!t.createdAt) return false;
      const taskDate = new Date(t.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed: dayTasks.filter(t => t.completed).length,
      total: dayTasks.length,
    };
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Summary</Text>
        <Text style={styles.subtitle}>Your productivity at a glance</Text>
      </View>

      {/* Letter Grade Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Overall Performance</Text>
        <View style={styles.gradeContainer}>
          <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
            <Text style={styles.gradeText}>{grade}</Text>
          </View>
          <View style={styles.gradeInfo}>
            <Text style={styles.gradeLabel}>Completion Rate</Text>
            <Text style={styles.gradeValue}>{completionRate.toFixed(0)}%</Text>
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{completedThisWeek}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalThisWeek - completedThisWeek}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{onTimeRate.toFixed(0)}%</Text>
            <Text style={styles.metricLabel}>On Time</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{totalThisWeek}</Text>
            <Text style={styles.metricLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Daily Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Breakdown</Text>
        <View style={styles.dailyChart}>
          {dailyData.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.barContainer}>
                {day.total > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${(day.completed / Math.max(...dailyData.map(d => d.total), 1)) * 100}%`,
                        backgroundColor: palette.success,
                      },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <Text style={styles.dayValue}>{day.completed}/{day.total}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Goals & Recommendations */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week's Goals</Text>
        <View style={styles.goalsList}>
          <View style={styles.goalItem}>
            <Text style={styles.goalIcon}><TargetIcon /></Text>
            <View style={styles.goalContent}>
              <Text style={styles.goalText}>Maintain {completionRate >= 80 ? 'excellent' : 'good'} completion rate</Text>
              <Text style={styles.goalSubtext}>Current: {completionRate.toFixed(0)}%</Text>
            </View>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalIcon}><ClockIcon /></Text>
            <View style={styles.goalContent}>
              <Text style={styles.goalText}>Complete tasks on time</Text>
              <Text style={styles.goalSubtext}>Current: {onTimeRate.toFixed(0)}% on-time</Text>
            </View>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalIcon}><TrendUpIcon /></Text>
            <View style={styles.goalContent}>
              <Text style={styles.goalText}>Stay consistent daily</Text>
              <Text style={styles.goalSubtext}>Track progress each day</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Insights</Text>
        <View style={styles.insightsList}>
          {completionRate >= 80 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}><CheckmarkIcon /></Text>
              <Text style={styles.insightText}>Excellent work! You're completing most of your tasks.</Text>
            </View>
          )}
          {onTimeRate < 70 && tasksWithDueDate.length > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}><WarningIcon /></Text>
              <Text style={styles.insightText}>Consider setting more realistic due dates to improve on-time completion.</Text>
            </View>
          )}
          {totalThisWeek === 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}><LightbulbIcon /></Text>
              <Text style={styles.insightText}>No tasks this week. Start adding tasks to track your progress!</Text>
            </View>
          )}
          {completionRate < 50 && totalThisWeek > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}><ChartIcon /></Text>
              <Text style={styles.insightText}>Focus on completing existing tasks before adding new ones.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    backgroundColor: palette.primary,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: palette.surface,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: palette.labelOnDark,
  },
  card: {
    backgroundColor: palette.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    ...shadow,
  },
  cardTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  gradeBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 48,
    fontWeight: '700',
    color: palette.surface,
  },
  gradeInfo: {
    flex: 1,
  },
  gradeLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  gradeValue: {
    ...typography.h2,
    color: palette.text,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: palette.background,
    padding: spacing.md,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  metricValue: {
    ...typography.h2,
    color: palette.primary,
    marginBottom: spacing.xs,
  },
  metricLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  dailyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingTop: spacing.md,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '60%',
    borderRadius: radius.button,
    minHeight: 4,
  },
  dayLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 11,
  },
  dayValue: {
    ...typography.secondary,
    color: palette.text,
    fontSize: 10,
    fontWeight: '600',
  },
  goalsList: {
    gap: spacing.md,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.button,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalContent: {
    flex: 1,
  },
  goalText: {
    ...typography.body,
    color: palette.text,
    marginBottom: 2,
  },
  goalSubtext: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  insightsList: {
    gap: spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.infoLight,
    borderRadius: radius.button,
    borderLeftWidth: 4,
    borderLeftColor: palette.primary,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
});
