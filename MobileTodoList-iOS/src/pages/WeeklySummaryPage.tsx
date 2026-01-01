import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { useTodoStore } from '../store';
import { palette, spacing, typography, radius, shadow } from '../theme';
import {
  ChartIcon,
  TargetIcon,
  TrendUpIcon,
  ClockIcon,
  CheckmarkIcon,
  WarningIcon,
  LightbulbIcon,
} from '../components/Icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WeeklySummaryPage: React.FC = () => {
  const { tasks } = useTodoStore();
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

  // Calculate weekly metrics
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const weekTasks = tasks.filter(t => {
    if (!t.createdAt) {
      return false;
    }
    return t.createdAt >= weekStart.getTime();
  });

  const completedThisWeek = weekTasks.filter(t => t.completed).length;
  const totalThisWeek = weekTasks.length;
  const completionRate = totalThisWeek > 0 ? (completedThisWeek / totalThisWeek) * 100 : 0;

  // Calculate on-time completion
  const tasksWithDueDate = weekTasks.filter(t => t.dueDate && t.completed);
  const onTimeCompleted = tasksWithDueDate.filter(t => {
    if (!t.completedAt || !t.dueDate) {
      return false;
    }
    return t.completedAt <= t.dueDate;
  }).length;
  const onTimeRate =
    tasksWithDueDate.length > 0 ? (onTimeCompleted / tasksWithDueDate.length) * 100 : 0;

  // Calculate letter grade
  const getLetterGrade = (rate: number): string => {
    if (rate >= 90) {
      return 'A';
    }
    if (rate >= 80) {
      return 'B';
    }
    if (rate >= 70) {
      return 'C';
    }
    if (rate >= 60) {
      return 'D';
    }
    return 'F';
  };

  const grade = getLetterGrade(completionRate);
  const gradeColor =
    completionRate >= 80 ? palette.success : completionRate >= 60 ? palette.warning : palette.error;

  // Detect wins
  const wins: string[] = [];
  if (completedThisWeek >= 10) wins.push('Completed 10+ tasks');
  if (completionRate >= 80) wins.push('80%+ completion rate');
  if (onTimeRate >= 90) wins.push('90%+ on-time completion');
  if (totalThisWeek > 0 && totalThisWeek === completedThisWeek) wins.push('Completed every task');

  // Daily breakdown with emoji indicators
  const getDailyEmoji = (completed: number, total: number): string => {
    if (total === 0) return '—';
    const rate = completed / total;
    if (rate >= 0.8) return '😊';
    if (rate >= 0.5) return '😐';
    return '😟';
  };

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - i));
    const dayTasks = tasks.filter(t => {
      if (!t.createdAt) {
        return false;
      }
      const taskDate = new Date(t.createdAt);
      return taskDate.toDateString() === date.toDateString();
    });
    const completed = dayTasks.filter(t => t.completed).length;
    const total = dayTasks.length;
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed,
      total,
      emoji: getDailyEmoji(completed, total),
    };
  });

  // Next week goals
  const nextWeekGoals = [
    { id: 'scan_receipts', text: 'Scan every receipt' },
    { id: 'generic_brands', text: 'Try 2 generic brands' },
    { id: 'price_insights', text: 'Check price insights daily' },
  ];

  const toggleGoal = (goalId: string) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(goalId)) {
      newSelected.delete(goalId);
    } else {
      newSelected.add(goalId);
    }
    setSelectedGoals(newSelected);
    // Save to AsyncStorage
    AsyncStorage.setItem('@ellio_next_week_goals', JSON.stringify(Array.from(newSelected)));
  };

  const handleShare = async () => {
    try {
      const message = `My Ellio Weekly Summary:\n\n📊 Grade: ${grade}\n✅ Completed: ${completedThisWeek} tasks\n🎯 Completion Rate: ${completionRate.toFixed(0)}%\n⏰ On-Time Rate: ${onTimeRate.toFixed(0)}%\n\n${wins.length > 0 ? `🌟 This Week's Wins:\n${wins.map(w => `• ${w}`).join('\n')}\n\n` : ''}Keep crushing it! 💪`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Summary</Text>
          <Text style={styles.subtitle}>Your productivity at a glance</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
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
              <Text style={styles.dayEmoji}>{day.emoji}</Text>
              <View style={styles.barContainer}>
                {day.total > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${
                          (day.completed / Math.max(...dailyData.map(d => d.total), 1)) * 100
                        }%`,
                        backgroundColor: palette.success,
                      },
                    ]}
                  />
                )}
              </View>
              <Text style={styles.dayLabel}>{day.day}</Text>
              <Text style={styles.dayValue}>
                {day.completed}/{day.total}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* This Week's Wins */}
      {wins.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🌟 This Week's Wins</Text>
          <View style={styles.winsList}>
            {wins.map((win, index) => (
              <View key={index} style={styles.winItem}>
                <Text style={styles.winCheckmark}>✓</Text>
                <Text style={styles.winText}>{win}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Goals for Next Week */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Goals for Next Week</Text>
        <View style={styles.goalsList}>
          {nextWeekGoals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCheckboxRow}
              onPress={() => toggleGoal(goal.id)}
            >
              <View style={[styles.checkbox, selectedGoals.has(goal.id) && styles.checkboxChecked]}>
                {selectedGoals.has(goal.id) && <Text style={styles.checkboxIcon}>✓</Text>}
              </View>
              <Text style={styles.goalCheckboxText}>{goal.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Old Goals Section - Removed */}

      {/* Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Insights</Text>
        <View style={styles.insightsList}>
          {completionRate >= 80 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>
                <CheckmarkIcon />
              </Text>
              <Text style={styles.insightText}>
                Excellent work! You're completing most of your tasks.
              </Text>
            </View>
          )}
          {onTimeRate < 70 && tasksWithDueDate.length > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>
                <WarningIcon />
              </Text>
              <Text style={styles.insightText}>
                Consider setting more realistic due dates to improve on-time completion.
              </Text>
            </View>
          )}
          {totalThisWeek === 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>
                <LightbulbIcon />
              </Text>
              <Text style={styles.insightText}>
                No tasks this week. Start adding tasks to track your progress!
              </Text>
            </View>
          )}
          {completionRate < 50 && totalThisWeek > 0 && (
            <View style={styles.insightItem}>
              <Text style={styles.insightIcon}>
                <ChartIcon />
              </Text>
              <Text style={styles.insightText}>
                Focus on completing existing tasks before adding new ones.
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
  },
  shareButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
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
    height: 180,
    paddingTop: spacing.md,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayEmoji: {
    fontSize: 20,
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
  winsList: {
    gap: spacing.sm,
  },
  winItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.successLight,
    borderRadius: radius.button,
  },
  winCheckmark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: palette.success,
  },
  winText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  goalsList: {
    gap: spacing.md,
  },
  goalCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.button,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkboxIcon: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCheckboxText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
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
