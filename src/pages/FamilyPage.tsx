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
import { LightbulbIcon } from '../components/Icons';

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  avatar: string;
  color: string;
  trackExpenses: boolean;
  budgetLimit?: number;
  thisMonthSpent: number;
}

export const FamilyPage: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'You',
      relationship: 'Self',
      age: 32,
      avatar: 'Y',
      color: palette.primary,
      trackExpenses: true,
      budgetLimit: 1500,
      thisMonthSpent: 1234.56,
    },
    {
      id: '2',
      name: 'Sarah',
      relationship: 'Spouse',
      age: 30,
      avatar: 'S',
      color: '#EC4899',
      trackExpenses: true,
      budgetLimit: 1200,
      thisMonthSpent: 987.45,
    },
    {
      id: '3',
      name: 'Emma',
      relationship: 'Child',
      age: 8,
      avatar: 'E',
      color: '#F59E0B',
      trackExpenses: true,
      budgetLimit: 150,
      thisMonthSpent: 89.5,
    },
    {
      id: '4',
      name: 'Jack',
      relationship: 'Child',
      age: 5,
      avatar: 'J',
      color: '#10B981',
      trackExpenses: true,
      budgetLimit: 100,
      thisMonthSpent: 45.0,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelationship, setNewMemberRelationship] = useState('');

  const totalHouseholdBudget = members.reduce((sum, member) => sum + (member.budgetLimit || 0), 0);
  const totalHouseholdSpent = members.reduce((sum, member) => sum + member.thisMonthSpent, 0);

  const handleAddMember = () => {
    if (!newMemberName || !newMemberRelationship) {
      Alert.alert('Error', 'Please enter name and relationship');
      return;
    }

    const colors = ['#8B5CF6', '#3B82F6', '#14B8A6', '#F97316'];
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName,
      relationship: newMemberRelationship,
      avatar: newMemberName.substring(0, 1).toUpperCase(),
      color: colors[members.length % colors.length],
      trackExpenses: false,
      thisMonthSpent: 0,
    };

    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberRelationship('');
    setShowAddForm(false);
    Alert.alert('Success', `${newMemberName} added to family`);
  };

  const handleToggleTracking = (id: string) => {
    setMembers(
      members.map(member =>
        member.id === id ? { ...member, trackExpenses: !member.trackExpenses } : member
      )
    );
  };

  const handleSetBudget = (member: FamilyMember) => {
    Alert.alert(
      `Set Budget for ${member.name}`,
      `Current limit: $${member.budgetLimit || 0}/month`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            Alert.alert('Success', 'Budget limit updated');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family & Household</Text>
        <Text style={styles.headerSubtitle}>{members.length} members</Text>
      </View>

      <View style={styles.householdSummary}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Household Budget</Text>
            <Text style={styles.summaryAmount}>${totalHouseholdBudget.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Spent</Text>
            <Text style={[styles.summaryAmount, { color: palette.error }]}>
              ${totalHouseholdSpent.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min((totalHouseholdSpent / totalHouseholdBudget) * 100, 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.addMemberContainer}>
        <TouchableOpacity
          style={styles.addMemberButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Text style={styles.addMemberButtonText}>
            {showAddForm ? '✕ Cancel' : '+ Add Family Member'}
          </Text>
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.addForm}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newMemberName}
            onChangeText={setNewMemberName}
            placeholderTextColor={palette.textTertiary}
          />
          <TextInput
            style={styles.input}
            placeholder="Relationship (e.g., Spouse, Child, Parent)"
            value={newMemberRelationship}
            onChangeText={setNewMemberRelationship}
            placeholderTextColor={palette.textTertiary}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddMember}>
            <Text style={styles.submitButtonText}>Add Member</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.membersList}>
        <Text style={styles.listTitle}>Family Members</Text>
        {members.map(member => (
          <View key={member.id} style={styles.memberCard}>
            <View style={[styles.memberAvatar, { backgroundColor: member.color }]}>
              <Text style={styles.memberAvatarText}>{member.avatar}</Text>
            </View>
            <View style={styles.memberInfo}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRelationship}>{member.relationship}</Text>
              </View>
              {member.age && <Text style={styles.memberAge}>Age: {member.age}</Text>}

              {member.trackExpenses && (
                <View style={styles.budgetInfo}>
                  <Text style={styles.budgetLabel}>This Month:</Text>
                  <Text style={styles.budgetSpent}>${member.thisMonthSpent.toFixed(2)}</Text>
                  {member.budgetLimit && (
                    <>
                      <Text style={styles.budgetSeparator}>/</Text>
                      <Text style={styles.budgetLimit}>${member.budgetLimit.toFixed(2)}</Text>
                    </>
                  )}
                </View>
              )}

              <View style={styles.memberControls}>
                <View style={styles.trackingToggle}>
                  <Text style={styles.trackingLabel}>Track expenses</Text>
                  <Switch
                    value={member.trackExpenses}
                    onValueChange={() => handleToggleTracking(member.id)}
                    trackColor={{ false: palette.border, true: palette.primary }}
                  />
                </View>
                {member.trackExpenses && (
                  <TouchableOpacity
                    style={styles.setBudgetButton}
                    onPress={() => handleSetBudget(member)}
                  >
                    <Text style={styles.setBudgetButtonText}>Set Budget</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        ))}

        <View style={styles.infoCard}>
          <View style={styles.infoTitleRow}>
            <LightbulbIcon size={18} color={palette.primary} />
            <Text style={styles.infoTitle}>Family Budgeting Tips</Text>
          </View>
          <Text style={styles.infoText}>• Set individual budgets for each family member</Text>
          <Text style={styles.infoText}>• Track spending by person to identify trends</Text>
          <Text style={styles.infoText}>• Kids' budgets help teach financial responsibility</Text>
          <Text style={styles.infoText}>• Review household spending together monthly</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
  },
  headerSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  householdSummary: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: palette.border,
  },
  summaryLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryAmount: {
    ...typography.h3,
    color: palette.text,
  },
  progressBar: {
    marginTop: spacing.sm,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: palette.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.primary,
    borderRadius: 4,
  },
  addMemberContainer: {
    padding: spacing.md,
  },
  addMemberButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  addMemberButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  addForm: {
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
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
  submitButton: {
    backgroundColor: palette.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  submitButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  membersList: {
    flex: 1,
  },
  listTitle: {
    ...typography.bodyBold,
    color: palette.text,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  memberAvatarText: {
    ...typography.h3,
    color: palette.surface,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  memberName: {
    ...typography.bodyBold,
    color: palette.text,
  },
  memberRelationship: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  memberAge: {
    ...typography.secondary,
    color: palette.textTertiary,
    marginBottom: spacing.sm,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginRight: spacing.xs,
  },
  budgetSpent: {
    ...typography.bodyBold,
    color: palette.error,
  },
  budgetSeparator: {
    ...typography.body,
    color: palette.textTertiary,
    marginHorizontal: spacing.xs,
  },
  budgetLimit: {
    ...typography.body,
    color: palette.textSecondary,
  },
  memberControls: {
    gap: spacing.sm,
  },
  trackingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackingLabel: {
    ...typography.body,
    color: palette.text,
  },
  setBudgetButton: {
    backgroundColor: palette.info,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    alignSelf: 'flex-start',
  },
  setBudgetButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 14,
  },
  infoCard: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: palette.infoLight,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.info,
  },
  infoTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.md,
  },
  infoText: {
    ...typography.body,
    color: palette.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
