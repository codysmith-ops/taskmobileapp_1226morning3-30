import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { palette, spacing, radius, typography, shadow } from '../theme';
import { useTodoStore } from '../store';
import { NavigationPage } from '../components/NavigationMenu';

interface ShoppingListPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ShoppingListPage: React.FC<ShoppingListPageProps> = ({ onNavigate }) => {
  const { userPreferences, setUserPreferences, addTask } = useTodoStore();
  const automatedShoppingEnabled = userPreferences?.automatedShoppingEnabled ?? false;

  const handleToggle = (value: boolean) => {
    setUserPreferences({
      ...userPreferences,
      automatedShoppingEnabled: value,
      goals: userPreferences?.goals || [],
      aiSuggestionsEnabled: userPreferences?.aiSuggestionsEnabled ?? true,
      dealAlertsEnabled: userPreferences?.dealAlertsEnabled ?? true,
      priceComparisonEnabled: userPreferences?.priceComparisonEnabled ?? true,
      loyaltyProgramsEnabled: userPreferences?.loyaltyProgramsEnabled ?? true,
      autoReceiptUploadEnabled: userPreferences?.autoReceiptUploadEnabled ?? true,
      geofencingEnabled: userPreferences?.geofencingEnabled ?? true,
      autoCompleteRadius: userPreferences?.autoCompleteRadius ?? 100,
    });

    if (value) {
      Alert.alert(
        'Automated Shopping Enabled',
        'Ellio will now automatically add recurring items to your shopping list based on your purchase patterns.'
      );
    }
  };

  const generateRecurringItems = () => {
    // Common recurring shopping items
    const recurringItems = [
      { title: 'Milk', note: 'Weekly staple', category: 'groceries' },
      { title: 'Bread', note: 'Weekly staple', category: 'groceries' },
      { title: 'Eggs', note: 'Weekly staple', category: 'groceries' },
      { title: 'Fresh produce', note: 'Fruits and vegetables', category: 'groceries' },
      { title: 'Paper towels', note: 'Household essential', category: 'shopping' },
      { title: 'Toilet paper', note: 'Household essential', category: 'shopping' },
    ];

    recurringItems.forEach(item => {
      addTask({
        title: item.title,
        note: item.note,
      });
    });

    Alert.alert('Items Added', `Added ${recurringItems.length} recurring items to your list`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping List</Text>
        <Text style={styles.subtitle}>Automate your regular purchases</Text>
      </View>

      {/* Automated Shopping Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Automated Shopping</Text>
            <Text style={styles.toggleDescription}>
              Automatically add recurring items based on your purchase history
            </Text>
          </View>
          <Switch
            value={automatedShoppingEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: palette.border, true: palette.primary }}
            thumbColor={automatedShoppingEnabled ? palette.surface : palette.textTertiary}
          />
        </View>
      </View>

      {automatedShoppingEnabled && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>How it works</Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>📊</Text>
              <Text style={styles.infoText}>Ellio learns from your purchase patterns</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>🔄</Text>
              <Text style={styles.infoText}>Automatically suggests items when they're due</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>✏️</Text>
              <Text style={styles.infoText}>You can edit or remove any suggested items</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>💰</Text>
              <Text style={styles.infoText}>Get deal alerts when items go on sale</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <TouchableOpacity style={styles.actionButton} onPress={generateRecurringItems}>
          <Text style={styles.actionIcon}>🛒</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add recurring items</Text>
            <Text style={styles.actionDescription}>Common weekly staples</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('budget')}>
          <Text style={styles.actionIcon}>💰</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Set budget</Text>
            <Text style={styles.actionDescription}>Track spending on groceries</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onNavigate('preferences')}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Preferences</Text>
            <Text style={styles.actionDescription}>Customize automation settings</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>💡 Pro tips</Text>
        <Text style={styles.tipText}>• Complete items at stores to build purchase patterns</Text>
        <Text style={styles.tipText}>• Enable location services for store-based suggestions</Text>
        <Text style={styles.tipText}>• Add specific brands for more accurate recommendations</Text>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  toggleTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    ...typography.body,
    color: palette.textSecondary,
  },
  cardTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.md,
  },
  infoList: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoBullet: {
    fontSize: 20,
  },
  infoText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 2,
  },
  actionDescription: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  tipsCard: {
    backgroundColor: palette.backgroundSecondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.md,
  },
  tipText: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
});
