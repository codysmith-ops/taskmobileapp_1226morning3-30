import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import { CalendarIcon } from '../components/Icons';
import { useTodoStore } from '../store';

export const TimelinePage: React.FC = () => {
  const { tasks } = useTodoStore();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');

  // Group tasks by date
  const groupedTasks = tasks
    .filter(t => !t.completed && t.dueDate)
    .reduce((acc, task) => {
      const date = new Date(task.dueDate!).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);

  const sortedDates = Object.keys(groupedTasks).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const now = new Date();
  const isToday = (dateString: string) =>
    new Date(dateString).toDateString() === now.toDateString();
  const isPast = (dateString: string) => new Date(dateString) < now && !isToday(dateString);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <CalendarIcon /> Timeline
        </Text>
        <Text style={styles.headerSubtitle}>Your tasks organized by due date</Text>
      </View>

      {/* View Mode Selector */}
      <View style={styles.viewModeContainer}>
        {(['day', 'week', 'month'] as const).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.viewModeButton, viewMode === mode && styles.viewModeButtonActive]}
            onPress={() => setViewMode(mode)}
          >
            <Text style={[styles.viewModeText, viewMode === mode && styles.viewModeTextActive]}>
              {mode === 'day' ? 'Day' : mode === 'week' ? 'Week' : 'Month'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {sortedDates.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarIcon size={64} color={palette.textTertiary} />
            <Text style={styles.emptyText}>No upcoming tasks with due dates</Text>
            <Text style={styles.emptySubtext}>Add due dates to your tasks to see them here</Text>
          </View>
        ) : (
          sortedDates.map((dateString) => {
            const taskList = groupedTasks[dateString];
            const date = new Date(dateString);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const dateFormatted = date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <View key={dateString} style={styles.dateSection}>
                {/* Date Header */}
                <View style={styles.dateHeader}>
                  <View
                    style={[
                      styles.dateMarker,
                      {
                        backgroundColor: isToday(dateString)
                          ? palette.primary
                          : isPast(dateString)
                          ? palette.error
                          : palette.success,
                      },
                    ]}
                  />
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateName}>{isToday(dateString) ? 'Today' : dayName}</Text>
                    <Text style={styles.dateText}>{dateFormatted}</Text>
                  </View>
                  <View
                    style={[
                      styles.dateBadge,
                      {
                        backgroundColor: isToday(dateString)
                          ? palette.infoLight
                          : isPast(dateString)
                          ? palette.errorLight
                          : palette.successLight,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateBadgeText,
                        {
                          color: isToday(dateString)
                            ? palette.primary
                            : isPast(dateString)
                            ? palette.error
                            : palette.success,
                        },
                      ]}
                    >
                      {taskList.length} {taskList.length === 1 ? 'task' : 'tasks'}
                    </Text>
                  </View>
                </View>

                {/* Tasks for this date */}
                <View style={styles.taskList}>
                  {taskList.map((task, taskIndex) => (
                    <View key={task.id} style={styles.taskCard}>
                      <View style={styles.taskLeft}>
                        <View
                          style={[
                            styles.taskDot,
                            {
                              backgroundColor: isPast(dateString) ? palette.error : palette.info,
                            },
                          ]}
                        />
                        {taskIndex < taskList.length - 1 && <View style={styles.taskLine} />}
                      </View>
                      <View style={styles.taskContent}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {task.note && <Text style={styles.taskNote}>{task.note}</Text>}
                        {task.quantity && task.quantity > 1 && (
                          <Text style={styles.taskMeta}>Qty: {task.quantity}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* No Date Section */}
      {tasks.filter(t => !t.completed && !t.dueDate).length > 0 && (
        <View style={styles.noDateSection}>
          <View style={styles.dateHeader}>
            <View style={[styles.dateMarker, { backgroundColor: palette.textSecondary }]} />
            <View style={styles.dateInfo}>
              <Text style={styles.dateName}>No Due Date</Text>
              <Text style={styles.dateText}>Unscheduled tasks</Text>
            </View>
            <View style={[styles.dateBadge, { backgroundColor: palette.border }]}>
              <Text style={[styles.dateBadgeText, { color: palette.textSecondary }]}>
                {tasks.filter(t => !t.completed && !t.dueDate).length} tasks
              </Text>
            </View>
          </View>
          <View style={styles.taskList}>
            {tasks
              .filter(t => !t.completed && !t.dueDate)
              .slice(0, 5)
              .map(task => (
                <View key={task.id} style={styles.taskCard}>
                  <View style={styles.taskLeft}>
                    <View style={[styles.taskDot, { backgroundColor: palette.textSecondary }]} />
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.note && <Text style={styles.taskNote}>{task.note}</Text>}
                  </View>
                </View>
              ))}
          </View>
        </View>
      )}

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
  viewModeContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: palette.surface,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  viewModeText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  viewModeTextActive: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  timeline: {
    padding: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.subtitle,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  dateSection: {
    marginBottom: spacing.xl,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dateMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.md,
  },
  dateInfo: {
    flex: 1,
  },
  dateName: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 2,
  },
  dateText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  dateBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  dateBadgeText: {
    ...typography.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  taskList: {
    marginLeft: 8,
  },
  taskCard: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  taskLeft: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  taskLine: {
    width: 2,
    flex: 1,
    backgroundColor: palette.border,
    marginTop: spacing.xs,
  },
  taskContent: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  taskTitle: {
    ...typography.body,
    color: palette.text,
    marginBottom: 4,
  },
  taskNote: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  taskMeta: {
    ...typography.secondary,
    color: palette.textTertiary,
    fontSize: 12,
  },
  noDateSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
