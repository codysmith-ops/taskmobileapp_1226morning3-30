import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import {
  ListIcon,
  CalendarIcon,
  TextIcon,
  TrashIcon,
  UploadIcon,
  DownloadIcon,
} from '../components/Icons';

export const PreferencesPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [emailReminders, setEmailReminders] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');
  const [autoSync, setAutoSync] = useState(true);

  const PreferenceToggle: React.FC<{
    label: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }> = ({ label, description, value, onValueChange }) => (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceInfo}>
        <Text style={styles.preferenceLabel}>{label}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.border, true: palette.primary }}
        thumbColor={palette.surface}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <PreferenceToggle
            label="Push Notifications"
            description="Receive task reminders and updates"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
          <View style={styles.divider} />
          <PreferenceToggle
            label="Sound"
            description="Play sound for notifications"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
          <View style={styles.divider} />
          <PreferenceToggle
            label="Vibration"
            description="Vibrate for notifications"
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
          />
          <View style={styles.divider} />
          <PreferenceToggle
            label="Email Reminders"
            description="Get daily task summary via email"
            value={emailReminders}
            onValueChange={setEmailReminders}
          />
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <PreferenceToggle
            label="Dark Mode"
            description="Use dark theme (coming soon)"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <View style={styles.divider} />
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Default View</Text>
              <Text style={styles.preferenceDescription}>How tasks are displayed</Text>
            </View>
          </View>
          <View style={styles.optionButtons}>
            <TouchableOpacity
              style={[styles.optionButton, defaultView === 'list' && styles.optionButtonActive]}
              onPress={() => setDefaultView('list')}
            >
              <View style={styles.optionButtonContent}>
                <ListIcon
                  size={16}
                  color={defaultView === 'list' ? palette.surface : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    defaultView === 'list' && styles.optionButtonTextActive,
                  ]}
                >
                  List
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, defaultView === 'grid' && styles.optionButtonActive]}
              onPress={() => setDefaultView('grid')}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  defaultView === 'grid' && styles.optionButtonTextActive,
                ]}
              >
                ⊞ Grid
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Task Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Task Management</Text>
        <View style={styles.card}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceLabel}>Default Sort Order</Text>
              <Text style={styles.preferenceDescription}>How tasks are sorted</Text>
            </View>
          </View>
          <View style={styles.optionButtons}>
            <TouchableOpacity
              style={[styles.optionButtonSmall, sortBy === 'date' && styles.optionButtonActive]}
              onPress={() => setSortBy('date')}
            >
              <View style={styles.optionButtonContent}>
                <CalendarIcon
                  size={14}
                  color={sortBy === 'date' ? palette.surface : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    sortBy === 'date' && styles.optionButtonTextActive,
                  ]}
                >
                  Date
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButtonSmall, sortBy === 'priority' && styles.optionButtonActive]}
              onPress={() => setSortBy('priority')}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  sortBy === 'priority' && styles.optionButtonTextActive,
                ]}
              >
                icon Priority
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButtonSmall, sortBy === 'name' && styles.optionButtonActive]}
              onPress={() => setSortBy('name')}
            >
              <View style={styles.optionButtonContent}>
                <TextIcon
                  size={14}
                  color={sortBy === 'name' ? palette.surface : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.optionButtonText,
                    sortBy === 'name' && styles.optionButtonTextActive,
                  ]}
                >
                  Name
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <PreferenceToggle
            label="Auto-Sync"
            description="Automatically sync with cloud"
            value={autoSync}
            onValueChange={setAutoSync}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Clear Completed Tasks</Text>
            <TrashIcon size={20} color={palette.danger} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Export All Tasks</Text>
            <UploadIcon size={20} color={palette.textSecondary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Import Tasks</Text>
            <DownloadIcon size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Terms of Service</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Privacy Policy</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
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
  content: {
    paddingBottom: spacing.xxl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  preferenceRow: {
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  preferenceLabel: {
    ...typography.body,
    color: palette.text,
    marginBottom: 4,
  },
  preferenceDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.sm,
  },
  optionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    backgroundColor: palette.surface,
  },
  optionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  optionButtonSmall: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    backgroundColor: palette.surface,
  },
  optionButtonActive: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  optionButtonText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  optionButtonTextActive: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionLabel: {
    ...typography.body,
    color: palette.text,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionArrow: {
    ...typography.body,
    color: palette.textTertiary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  infoValue: {
    ...typography.bodyBold,
    color: palette.text,
  },
});
