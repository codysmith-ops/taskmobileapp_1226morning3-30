import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

export const AccountPage: React.FC = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [company, setCompany] = useState('Acme Corp');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)}
          </Text>
        </View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userEmail}>{email}</Text>
      </View>

      {/* Account Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              editable={isEditing}
              placeholderTextColor={palette.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={palette.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Company</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={company}
              onChangeText={setCompany}
              editable={isEditing}
              placeholderTextColor={palette.textTertiary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={phone}
              onChangeText={setPhone}
              editable={isEditing}
              keyboardType="phone-pad"
              placeholderTextColor={palette.textTertiary}
            />
          </View>
        </View>

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Account Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Active Tasks</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>94%</Text>
            <Text style={styles.statLabel}>On-Time Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>23</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Change Password</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionLabel}>Two-Factor Authentication</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.dangerTitle]}>Danger Zone</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.dangerAction}>Sign Out</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.dangerAction}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Member since December 2025</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: palette.surface,
  },
  userName: {
    ...typography.h3,
    color: palette.text,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body,
    color: palette.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  editButton: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text,
  },
  inputDisabled: {
    backgroundColor: palette.surface,
    borderColor: 'transparent',
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cancelButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  saveButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  saveButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: palette.primary,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    textAlign: 'center',
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
  actionArrow: {
    ...typography.body,
    color: palette.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
  },
  dangerTitle: {
    color: palette.error,
  },
  dangerAction: {
    ...typography.bodyBold,
    color: palette.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  footerText: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
});
