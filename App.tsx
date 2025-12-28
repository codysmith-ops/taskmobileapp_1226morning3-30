import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useTodoStore, Task } from './src/store';
import { palette, radius, shadow, spacing, typography } from './src/theme';
import { SetupWizard, UserSetupData } from './src/components/SetupWizard';
import { NavigationMenu, NavigationPage } from './src/components/NavigationMenu';
import { AccountPage } from './src/pages/AccountPage';
import { PreferencesPage } from './src/pages/PreferencesPage';
import { IntegrationsPage } from './src/pages/IntegrationsPage';
import {
  getTaskIcon,
  ScannerIcon,
  CameraIcon,
  CalendarIcon,
  AssignIcon,
} from './src/components/TaskTypeIcons';

const App = (): React.JSX.Element => {
  const { tasks, addTask, toggleComplete, removeTask } = useTodoStore();

  // Setup wizard state
  const [setupComplete, setSetupComplete] = useState(false);
  const [userName, setUserName] = useState('User');

  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');

  // Task input state
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [skuCode, setSkuCode] = useState('');

  // Activity log state
  const [activityLog, setActivityLog] = useState<
    Array<{ id: string; action: string; timestamp: number; taskTitle: string }>
  >([]);

  const handleSetupComplete = (userData: UserSetupData) => {
    setUserName(userData.name);
    setSetupComplete(true);
  };

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter what you need');
      return;
    }

    addTask({
      title: title.trim(),
      note: note.trim() || undefined,
      quantity: parseInt(quantity) || 1,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      imageUri,
      productBrand: skuCode || undefined,
    });

    // Add to activity log
    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        action: 'added',
        timestamp: Date.now(),
        taskTitle: title.trim(),
      },
      ...prev.slice(0, 9), // Keep last 10 activities
    ]);

    // Reset form
    setTitle('');
    setNote('');
    setQuantity('1');
    setDueDate('');
    setAssignedTo('');
    setImageUri(undefined);
    setSkuCode('');

    Alert.alert('Success', 'Task added successfully');
  };

  const handleToggle = (task: Task) => {
    toggleComplete(task.id);
    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        action: task.completed ? 'uncompleted' : 'completed',
        timestamp: Date.now(),
        taskTitle: task.title,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          setActivityLog(prev => [
            {
              id: Date.now().toString(),
              action: 'deleted',
              timestamp: Date.now(),
              taskTitle: task.title,
            },
            ...prev.slice(0, 9),
          ]);
        },
      },
    ]);
  };

  const handleCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Camera error');
          return;
        }
        if (response.assets && response.assets[0]) {
          setImageUri(response.assets[0].uri);
        }
      }
    );
  };

  const handleScanner = () => {
    // Placeholder for barcode scanner
    Alert.alert('Scanner', 'Barcode scanner will open here', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Simulate Scan',
        onPress: () => {
          const mockSku = `SKU-${Math.floor(Math.random() * 100000)}`;
          setSkuCode(mockSku);
          setTitle(`Product ${mockSku}`);
        },
      },
    ]);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  // Show setup wizard if not complete
  if (!setupComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
        <SetupWizard onComplete={handleSetupComplete} />
      </SafeAreaView>
    );
  }

  // Show different pages based on navigation
  if (currentPage !== 'home') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
        <NavigationMenu currentPage={currentPage} onNavigate={setCurrentPage} userName={userName} />
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'preferences' && <PreferencesPage />}
        {currentPage === 'integrations' && <IntegrationsPage />}
        {currentPage === 'help' && (
          <View style={styles.placeholderPage}>
            <Text style={styles.placeholderText}>❓</Text>
            <Text style={styles.placeholderTitle}>Help & Support</Text>
            <Text style={styles.placeholderSubtitle}>Documentation and support coming soon</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Home page
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
      <NavigationMenu currentPage={currentPage} onNavigate={setCurrentPage} userName={userName} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back, {userName}!</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>
        </View>

        {/* Add Task Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What do you need?</Text>

          {/* Scanner and Camera Buttons */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction} onPress={handleScanner}>
              <ScannerIcon size={24} color={palette.primary} />
              <Text style={styles.quickActionText}>Scan SKU</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={handleCamera}>
              <CameraIcon size={24} color={palette.primary} />
              <Text style={styles.quickActionText}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {skuCode ? (
            <View style={styles.skuBadge}>
              <Text style={styles.skuBadgeText}>SKU: {skuCode}</Text>
              <TouchableOpacity onPress={() => setSkuCode('')}>
                <Text style={styles.skuClear}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {imageUri ? (
            <View style={styles.imagePreview}>
              <Text style={styles.imagePreviewText}>📷 Photo attached</Text>
              <TouchableOpacity onPress={() => setImageUri(undefined)}>
                <Text style={styles.imageRemove}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Item name or description"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={palette.textTertiary}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes (optional)"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
            placeholderTextColor={palette.textTertiary}
          />

          <View style={styles.formRow}>
            <View style={styles.formHalf}>
              <Text style={styles.fieldLabel}>Quantity</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="number-pad"
                placeholderTextColor={palette.textTertiary}
              />
            </View>
            <View style={styles.formHalf}>
              <Text style={styles.fieldLabel}>Due Date</Text>
              <TextInput
                style={styles.inputSmall}
                placeholder="YYYY-MM-DD"
                value={dueDate}
                onChangeText={setDueDate}
                placeholderTextColor={palette.textTertiary}
              />
            </View>
          </View>

          <View style={styles.formField}>
            <Text style={styles.fieldLabel}>Assign To</Text>
            <TextInput
              style={styles.input}
              placeholder="Team member name"
              value={assignedTo}
              onChangeText={setAssignedTo}
              placeholderTextColor={palette.textTertiary}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
            <Text style={styles.primaryButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              {activityLog.slice(0, 5).map(activity => (
                <View key={activity.id} style={styles.activityItem}>
                  <Text style={styles.activityIcon}>
                    {activity.action === 'added' && '➕'}
                    {activity.action === 'completed' && '✅'}
                    {activity.action === 'uncompleted' && '↩️'}
                    {activity.action === 'deleted' && '🗑️'}
                  </Text>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityAction}>{activity.action}</Text>{' '}
                      {activity.taskTitle}
                    </Text>
                    <Text style={styles.activityTime}>
                      {formatRelativeTime(activity.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tasks List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tasks ({pendingCount} pending)</Text>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tasks yet</Text>
              <Text style={styles.emptyStateSubtext}>Add your first task above</Text>
            </View>
          ) : (
            tasks.map(task => {
              const TaskIcon = getTaskIcon(task.title);
              return (
                <View
                  key={task.id}
                  style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
                >
                  <TouchableOpacity style={styles.taskCheckbox} onPress={() => handleToggle(task)}>
                    <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                      {task.completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.taskIcon}>
                    <TaskIcon size={24} color={palette.primary} />
                  </View>

                  <View style={styles.taskContent}>
                    <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                      {task.title}
                    </Text>
                    {task.note && <Text style={styles.taskNote}>{task.note}</Text>}
                    <View style={styles.taskMeta}>
                      {task.quantity && task.quantity > 1 && (
                        <Text style={styles.taskMetaItem}>Qty: {task.quantity}</Text>
                      )}
                      {task.dueDate && (
                        <Text style={styles.taskMetaItem}>
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(task)}>
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function for relative time
const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  hero: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroTitle: {
    ...typography.h3,
    color: palette.surface,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: palette.surface,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.secondary,
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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: palette.infoLight,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  quickActionText: {
    ...typography.body,
    color: palette.primary,
  },
  skuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.badge,
    marginBottom: spacing.md,
  },
  skuBadgeText: {
    ...typography.body,
    color: palette.success,
  },
  skuClear: {
    ...typography.bodyBold,
    color: palette.success,
    fontSize: 20,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.infoLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.badge,
    marginBottom: spacing.md,
  },
  imagePreviewText: {
    ...typography.body,
    color: palette.primary,
  },
  imageRemove: {
    ...typography.bodyBold,
    color: palette.primary,
    fontSize: 20,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    color: palette.text,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  formHalf: {
    flex: 1,
  },
  formField: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  inputSmall: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    ...typography.body,
    color: palette.text,
  },
  activityAction: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  activityTime: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.subtitle,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskCheckbox: {
    padding: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: palette.success,
    borderColor: palette.success,
  },
  checkmark: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  taskIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.body,
    color: palette.text,
    marginBottom: 2,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: palette.textSecondary,
  },
  taskNote: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  taskMetaItem: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 28,
    color: palette.error,
    lineHeight: 28,
  },
  placeholderPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  placeholderSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});

export default App;
