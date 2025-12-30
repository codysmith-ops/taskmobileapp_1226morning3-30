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
import { getCreditCardData, getAllCreditCards } from '../services/creditCardData';

interface CreditCard {
  id: string;
  name: string;
  lastFour: string;
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  cashbackRate: number;
  bonusCategories: {
    category: string;
    rate: number;
  }[];
  linked: boolean;
  autoSync: boolean;
  totalCashback: number;
}

export const CashbackAccountsPage: React.FC = () => {
  const [cards, setCards] = useState<CreditCard[]>([
    {
      id: '1',
      name: 'Chase Sapphire Preferred',
      lastFour: '4532',
      network: 'Visa',
      cashbackRate: 1,
      bonusCategories: [
        { category: 'Dining', rate: 3 },
        { category: 'Travel', rate: 3 },
        { category: 'Streaming', rate: 3 },
        { category: 'Online Groceries', rate: 3 },
      ],
      linked: true,
      autoSync: true,
      totalCashback: 234.56,
    },
    {
      id: '2',
      name: 'Amex Gold',
      lastFour: '1009',
      network: 'Amex',
      cashbackRate: 1,
      bonusCategories: [
        { category: 'Groceries', rate: 4 },
        { category: 'Dining', rate: 4 },
      ],
      linked: true,
      autoSync: false,
      totalCashback: 567.89,
    },
    {
      id: '3',
      name: 'Citi Double Cash',
      lastFour: '8765',
      network: 'Mastercard',
      cashbackRate: 2,
      bonusCategories: [],
      linked: false,
      autoSync: false,
      totalCashback: 0,
    },
  ]);

  const [showAddCard, setShowAddCard] = useState(false);

  const totalCashback = cards.reduce(
    (sum, card) => sum + (card.linked ? card.totalCashback : 0),
    0
  );
  const linkedCount = cards.filter(card => card.linked).length;

  const handleToggleLink = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card) {
      return;
    }

    if (!card.linked) {
      Alert.alert(
        `Link ${card.name}?`,
        'You will be redirected to your bank to authorize access.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Link Account',
            onPress: () => {
              setCards(cards.map(c => (c.id === id ? { ...c, linked: true, autoSync: true } : c)));
              Alert.alert('Success', `${card.name} linked successfully!`);
            },
          },
        ]
      );
    } else {
      Alert.alert(`Unlink ${card.name}?`, 'You will stop receiving automatic cashback updates.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: () => {
            setCards(cards.map(c => (c.id === id ? { ...c, linked: false, autoSync: false } : c)));
          },
        },
      ]);
    }
  };

  const handleToggleAutoSync = (id: string) => {
    setCards(cards.map(card => (card.id === id ? { ...card, autoSync: !card.autoSync } : card)));
  };

  const handleAddNewCard = () => {
    Alert.alert('Add Credit Card', 'Choose how to add your card:', [
      {
        text: 'Link Existing Account',
        onPress: () => Alert.alert('Success', 'Card linking flow would start here'),
      },
      {
        text: 'Manual Entry',
        onPress: () => setShowAddCard(true),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const getNetworkColor = (network: CreditCard['network']) => {
    switch (network) {
      case 'Visa':
        return '#1A1F71';
      case 'Mastercard':
        return '#EB001B';
      case 'Amex':
        return '#006FCF';
      case 'Discover':
        return '#FF6000';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cashback Accounts</Text>
        <View style={styles.totalCashback}>
          <Text style={styles.totalAmount}>${totalCashback.toFixed(2)}</Text>
          <Text style={styles.totalLabel}>Total Earned</Text>
        </View>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{linkedCount}</Text>
          <Text style={styles.statLabel}>Linked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{cards.filter(c => c.autoSync).length}</Text>
          <Text style={styles.statLabel}>Auto-Sync</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{cards.length}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNewCard}>
          <Text style={styles.addButtonText}>Add card</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cardsList}>
        {cards.map(card => (
          <View key={card.id} style={styles.cardItem}>
            <View style={[styles.cardBrand, { backgroundColor: getNetworkColor(card.network) }]}>
              <Text style={styles.cardBrandText}>{card.network}</Text>
              <Text style={styles.cardLastFour}>••{card.lastFour}</Text>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{card.name}</Text>
                {card.linked && (
                  <View style={styles.linkedBadge}>
                    <Text style={styles.linkedBadgeText}>Linked</Text>
                  </View>
                )}
              </View>

              <Text style={styles.baseRate}>{card.cashbackRate}% base cashback</Text>

              {card.bonusCategories.length > 0 && (
                <View style={styles.bonusCategories}>
                  {card.bonusCategories.map((bonus, index) => (
                    <View key={index} style={styles.bonusChip}>
                      <Text style={styles.bonusText}>
                        {bonus.rate}% {bonus.category}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {card.linked && (
                <Text style={styles.cashbackEarned}>${card.totalCashback.toFixed(2)} earned</Text>
              )}

              <View style={styles.cardControls}>
                <View style={styles.controlRow}>
                  <Text style={styles.controlLabel}>
                    {card.linked ? 'Account Linked' : 'Link Account'}
                  </Text>
                  <Switch
                    value={card.linked}
                    onValueChange={() => handleToggleLink(card.id)}
                    trackColor={{ false: palette.border, true: palette.success }}
                  />
                </View>

                {card.linked && (
                  <View style={styles.controlRow}>
                    <Text style={styles.controlLabel}>Auto-sync transactions</Text>
                    <Switch
                      value={card.autoSync}
                      onValueChange={() => handleToggleAutoSync(card.id)}
                      trackColor={{ false: palette.border, true: palette.primary }}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>icon Secure & Private</Text>
          <Text style={styles.infoText}>• Bank-level 256-bit encryption</Text>
          <Text style={styles.infoText}>• Read-only access to transactions</Text>
          <Text style={styles.infoText}>• Your credentials are never stored</Text>
          <Text style={styles.infoText}>• Unlink anytime with one tap</Text>
        </View>

        <View style={styles.tipsCard}>
          <View style={styles.tipsTitle}>
            <LightbulbIcon size={18} color={palette.primary} />
            <Text style={styles.tipsTitle}>Maximize Your Rewards</Text>
          </View>
          <Text style={styles.tipItem}>• Use the right card for each purchase category</Text>
          <Text style={styles.tipItem}>• Our AI suggests the best card for each receipt</Text>
          <Text style={styles.tipItem}>• Track which cards give you the most rewards</Text>
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
    marginBottom: spacing.md,
  },
  totalCashback: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: palette.successLight,
    borderRadius: radius.card,
  },
  totalAmount: {
    ...typography.h2,
    color: palette.success,
    fontWeight: '700',
  },
  totalLabel: {
    ...typography.secondary,
    color: palette.success,
  },
  statsBar: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: palette.border,
  },
  statValue: {
    ...typography.h3,
    color: palette.text,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  addButtonContainer: {
    padding: spacing.md,
  },
  addButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  cardsList: {
    flex: 1,
  },
  cardItem: {
    flexDirection: 'row',
    margin: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  cardBrand: {
    width: 80,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBrandText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  cardLastFour: {
    ...typography.secondary,
    color: palette.surface,
    fontSize: 11,
  },
  cardDetails: {
    flex: 1,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardName: {
    ...typography.bodyBold,
    color: palette.text,
    flex: 1,
  },
  linkedBadge: {
    backgroundColor: palette.successLight,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  linkedBadgeText: {
    ...typography.secondary,
    color: palette.success,
    fontSize: 11,
    fontWeight: '600',
  },
  baseRate: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  bonusCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  bonusChip: {
    backgroundColor: palette.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  bonusText: {
    ...typography.secondary,
    color: palette.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  cashbackEarned: {
    ...typography.bodyBold,
    color: palette.success,
    marginBottom: spacing.sm,
  },
  cardControls: {
    gap: spacing.sm,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlLabel: {
    ...typography.body,
    color: palette.text,
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
  tipsCard: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  tipsTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.md,
  },
  tipItem: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
