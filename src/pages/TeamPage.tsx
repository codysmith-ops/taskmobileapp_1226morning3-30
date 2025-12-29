import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import { SettingsIcon, TrashIcon } from '../components/Icons';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
  status: 'active' | 'invited' | 'inactive';
  tasksAssigned: number;
  tasksCompleted: number;
}

export const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      email: 'you@example.com',
      role: 'owner',
      avatar: 'Y',
      status: 'active',
      tasksAssigned: 12,
      tasksCompleted: 47,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      avatar: 'SJ',
      status: 'active',
      tasksAssigned: 8,
      tasksCompleted: 32,
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'member',
      avatar: 'MC',
      status: 'active',
      tasksAssigned: 15,
      tasksCompleted: 28,
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'member',
      avatar: 'ED',
      status: 'invited',
      tasksAssigned: 0,
      tasksCompleted: 0,
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInviteMember = () => {
    if (!inviteEmail) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: selectedRole,
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      status: 'invited',
      tasksAssigned: 0,
      tasksCompleted: 0,
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    setShowInviteForm(false);
    Alert.alert('Success', `Invitation sent to ${inviteEmail}`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    Alert.alert('Remove Member', `Are you sure you want to remove ${name} from the team?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setTeamMembers(teamMembers.filter(m => m.id !== id));
        },
      },
    ]);
  };

  const handleChangeRole = (id: string, currentRole: string) => {
    Alert.alert(
      'Change Role',
      'Select a new role for this member',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Admin',
          onPress: () => updateRole(id, 'admin'),
        },
        {
          text: 'Member',
          onPress: () => updateRole(id, 'member'),
        },
        {
          text: 'Viewer',
          onPress: () => updateRole(id, 'viewer'),
        },
      ],
      { cancelable: true }
    );
  };

  const updateRole = (id: string, role: 'admin' | 'member' | 'viewer') => {
    setTeamMembers(teamMembers.map(member => (member.id === id ? { ...member, role } : member)));
  };

  const getRoleBadgeColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return palette.primary;
      case 'admin':
        return palette.info;
      case 'member':
        return palette.success;
      case 'viewer':
        return palette.textSecondary;
    }
  };

  const getStatusBadgeColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return palette.success;
      case 'invited':
        return palette.warning;
      case 'inactive':
        return palette.textTertiary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Team Management</Text>
        <View style={styles.teamStats}>
          <Text style={styles.teamStatsText}>{teamMembers.length} members</Text>
          <Text style={styles.teamStatsText}>
            {teamMembers.filter(m => m.status === 'active').length} active
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setShowInviteForm(!showInviteForm)}
        >
          <Text style={styles.inviteButtonText}>
            {showInviteForm ? '✕ Cancel' : '+ Invite Member'}
          </Text>
        </TouchableOpacity>
      </View>

      {showInviteForm && (
        <View style={styles.inviteForm}>
          <Text style={styles.formLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="colleague@example.com"
            value={inviteEmail}
            onChangeText={setInviteEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={palette.textTertiary}
          />

          <Text style={styles.formLabel}>Role</Text>
          <View style={styles.roleSelector}>
            {(['admin', 'member', 'viewer'] as const).map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    selectedRole === role && styles.roleButtonTextActive,
                  ]}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.sendInviteButton} onPress={handleInviteMember}>
            <Text style={styles.sendInviteButtonText}>Send Invitation</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.membersList}>
        {teamMembers.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>{member.avatar}</Text>
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member.name}</Text>
                <View style={styles.badges}>
                  <View
                    style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(member.role) }]}
                  >
                    <Text style={styles.roleBadgeText}>{member.role}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBadgeColor(member.status) },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{member.status}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.memberEmail}>{member.email}</Text>
              {member.status === 'active' && (
                <View style={styles.memberStats}>
                  <Text style={styles.memberStat}>{member.tasksAssigned} assigned</Text>
                  <Text style={styles.memberStat}>{member.tasksCompleted} completed</Text>
                </View>
              )}
            </View>
            {member.role !== 'owner' && (
              <View style={styles.memberActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleChangeRole(member.id, member.role)}
                >
                  <SettingsIcon size={18} color={palette.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRemoveMember(member.id, member.name)}
                >
                  <TrashIcon size={18} color={palette.danger} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.permissionsInfo}>
        <Text style={styles.permissionsTitle}>Role Permissions</Text>
        <Text style={styles.permissionItem}>
          <Text style={styles.permissionRole}>Owner:</Text> Full control over team and tasks
        </Text>
        <Text style={styles.permissionItem}>
          <Text style={styles.permissionRole}>Admin:</Text> Manage members and all tasks
        </Text>
        <Text style={styles.permissionItem}>
          <Text style={styles.permissionRole}>Member:</Text> Create and manage own tasks
        </Text>
        <Text style={styles.permissionItem}>
          <Text style={styles.permissionRole}>Viewer:</Text> View tasks only
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  teamStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  teamStatsText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  actionsContainer: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  inviteButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  inviteButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  inviteForm: {
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  formLabel: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.input,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: palette.surface,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  roleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  roleButtonText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  roleButtonTextActive: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  sendInviteButton: {
    backgroundColor: palette.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  sendInviteButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  membersList: {
    flex: 1,
  },
  memberCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  memberAvatarText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    ...typography.bodyBold,
    color: palette.text,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  roleBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  roleBadgeText: {
    ...typography.secondary,
    color: palette.surface,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  statusBadgeText: {
    ...typography.secondary,
    color: palette.surface,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  memberEmail: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  memberStats: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  memberStat: {
    ...typography.secondary,
    color: palette.textTertiary,
    fontSize: 12,
  },
  memberActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  actionButtonText: {
    fontSize: 20,
  },
  permissionsInfo: {
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  permissionsTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  permissionItem: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  permissionRole: {
    ...typography.bodyBold,
    color: palette.text,
  },
});
