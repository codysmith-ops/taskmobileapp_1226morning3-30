import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import { LightbulbIcon, DollarIcon, StarIcon, TargetIcon } from '../components/Icons';

export const InsightsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'recommendations' | 'patterns' | 'opportunities'>(
    'recommendations'
  );

  const recommendations = [
    {
      id: 1,
      title: 'Switch to Chase Freedom for Dining',
      icon: '<CreditCardIcon />',
      savings: 23.5,
      impact: 'high',
      description:
        'You spent $235 on dining this month. Chase Freedom offers 5% cashback on restaurants this quarter vs. your current 1% card.',
      action: 'Link Chase Freedom',
      category: 'Credit Cards',
    },
    {
      id: 2,
      title: 'Meal Prep on Sundays',
      icon: 'food',
      savings: 48.0,
      impact: 'high',
      description:
        'You spent $192 on lunch during work days. Preparing meals at home could save you $48/month based on similar users.',
      action: 'Set Reminder',
      category: 'Food & Dining',
    },
    {
      id: 3,
      title: 'Consolidate Streaming Services',
      icon: 'entertainment',
      savings: 15.99,
      impact: 'medium',
      description:
        'You have 4 streaming subscriptions but only used 2 last month. Consider pausing unused services.',
      action: 'Review Subscriptions',
      category: 'Entertainment',
    },
    {
      id: 4,
      title: 'Shop at Aldi for Groceries',
      icon: '<ChartIcon />',
      savings: 34.2,
      impact: 'medium',
      description:
        'Based on your grocery list, shopping at Aldi instead of Whole Foods could save you ~$34/month.',
      action: 'Find Nearby Aldi',
      category: 'Groceries',
    },
    {
      id: 5,
      title: 'Bundle Insurance Policies',
      icon: 'home',
      savings: 67.0,
      impact: 'high',
      description:
        'Bundling your auto and home insurance with the same provider typically saves 15-25% ($67/month average).',
      action: 'Get Quotes',
      category: 'Insurance',
    },
  ];

  const patterns = [
    {
      id: 1,
      title: 'Friday Overspending Pattern',
      icon: '<CalendarIcon />',
      description:
        'You spend 45% more on Fridays ($89 avg) vs. other days ($52 avg). Consider meal prepping for Friday lunches.',
      trend: 'Weekdays: $52 avg → Fridays: $89 avg',
      color: palette.warning,
    },
    {
      id: 2,
      title: 'Coffee Shop Habit',
      icon: '☕',
      description:
        'You visit Starbucks 4.2x/week spending $6.50/visit. Brewing at home 2 days/week would save $56/month.',
      trend: 'Current: $112/mo → Potential: $56/mo savings',
      color: palette.info,
    },
    {
      id: 3,
      title: 'Impulse Shopping Trend',
      icon: '<BagIcon />',
      description:
        '68% of your shopping purchases are under $25 and made after 8pm. Setting a 24-hour rule could reduce impulse buys.',
      trend: '17 impulse purchases this month totaling $287',
      color: palette.error,
    },
    {
      id: 4,
      title: 'Excellent Budget Discipline',
      icon: '<CheckmarkIcon />',
      description:
        "You've stayed under budget for 11 consecutive weeks! You're in the top 5% of users.",
      trend: 'Streak: 11 weeks • Top 5% nationally',
      color: palette.success,
    },
  ];

  const opportunities = [
    {
      id: 1,
      title: 'Unclaimed Cashback',
      icon: '<DollarIcon />',
      amount: 47.23,
      description: 'You have $47.23 in cashback rewards ready to redeem from your Discover card.',
      action: 'Redeem Now',
      type: 'immediate',
    },
    {
      id: 2,
      title: 'Price Drop Alert',
      icon: 'icon',
      amount: 12.5,
      description:
        'A laptop you purchased from Amazon dropped $12.50 in price. Amazon offers price protection within 30 days.',
      action: 'Claim Difference',
      type: 'immediate',
    },
    {
      id: 3,
      title: 'Referral Bonuses Available',
      icon: 'users',
      amount: 100.0,
      description:
        'Refer 2 friends to your Chase card and earn $100 in statement credits ($50 each).',
      action: 'Invite Friends',
      type: 'action-required',
    },
    {
      id: 4,
      title: 'Credit Card Sign-Up Bonus',
      icon: 'gift',
      amount: 200.0,
      description:
        "You qualify for a Chase Sapphire Preferred with $200 sign-up bonus. Based on your spending, you'd earn it in 2 months.",
      action: 'Learn More',
      type: 'action-required',
    },
    {
      id: 5,
      title: 'Optimize Gas Purchases',
      icon: '⛽',
      amount: 8.4,
      description:
        'Using Shell fuel rewards program + your Amex could save an additional $8.40/month on gas.',
      action: 'Join Program',
      type: 'setup',
    },
  ];

  const totalSavingsOpportunity =
    recommendations.reduce((sum, r) => sum + r.savings, 0) +
    opportunities
      .filter(o => o.type === 'immediate' || o.type === 'setup')
      .reduce((sum, o) => sum + o.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <LightbulbIcon /> Smart Insights
        </Text>
        <Text style={styles.headerSubtitle}>AI-powered recommendations to save more</Text>
      </View>

      {/* Total Opportunity */}
      <View style={styles.opportunityCard}>
        <Text style={styles.opportunityLabel}>Total Savings Opportunity</Text>
        <Text style={styles.opportunityAmount}>${totalSavingsOpportunity.toFixed(2)}/mo</Text>
        <Text style={styles.opportunitySubtext}>Based on your spending patterns and habits</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recommendations' && styles.tabActive]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.tabTextActive]}>
            Recommendations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'patterns' && styles.tabActive]}
          onPress={() => setSelectedTab('patterns')}
        >
          <Text style={[styles.tabText, selectedTab === 'patterns' && styles.tabTextActive]}>
            Patterns
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'opportunities' && styles.tabActive]}
          onPress={() => setSelectedTab('opportunities')}
        >
          <Text style={[styles.tabText, selectedTab === 'opportunities' && styles.tabTextActive]}>
            Opportunities
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recommendations Tab */}
      {selectedTab === 'recommendations' && (
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Personalized for You</Text>
            <Text style={styles.contentSubtitle}>Based on your spending from the last 30 days</Text>
          </View>

          {recommendations.map(rec => (
            <View key={rec.id} style={styles.recommendationCard}>
              <View style={styles.recHeader}>
                <View style={styles.recIcon}>
                  <Text style={styles.recIconText}>{rec.icon}</Text>
                </View>
                <View style={styles.recHeaderContent}>
                  <Text style={styles.recTitle}>{rec.title}</Text>
                  <Text style={styles.recCategory}>{rec.category}</Text>
                </View>
                <View
                  style={[
                    styles.impactBadge,
                    {
                      backgroundColor:
                        rec.impact === 'high'
                          ? palette.successLight
                          : rec.impact === 'medium'
                          ? palette.warningLight
                          : palette.infoLight,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.impactText,
                      {
                        color:
                          rec.impact === 'high'
                            ? palette.success
                            : rec.impact === 'medium'
                            ? palette.warning
                            : palette.info,
                      },
                    ]}
                  >
                    {rec.impact.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.recDescription}>{rec.description}</Text>

              <View style={styles.recFooter}>
                <View style={styles.savingsTag}>
                  <Text style={styles.savingsTagText}>
                    <DollarIcon /> Save ${rec.savings.toFixed(2)}/mo
                  </Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>{rec.action}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Patterns Tab */}
      {selectedTab === 'patterns' && (
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Your Spending Patterns</Text>
            <Text style={styles.contentSubtitle}>Behavioral insights from machine learning</Text>
          </View>

          {patterns.map(pattern => (
            <View key={pattern.id} style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <Text style={styles.patternIcon}>{pattern.icon}</Text>
                <Text style={styles.patternTitle}>{pattern.title}</Text>
              </View>
              <Text style={styles.patternDescription}>{pattern.description}</Text>
              <View style={[styles.trendBar, { backgroundColor: pattern.color + '20' }]}>
                <Text style={[styles.trendText, { color: pattern.color }]}>{pattern.trend}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Opportunities Tab */}
      {selectedTab === 'opportunities' && (
        <View style={styles.content}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>Money on the Table</Text>
            <Text style={styles.contentSubtitle}>Quick wins and easy money you're missing</Text>
          </View>

          {/* Immediate Actions */}
          <Text style={styles.sectionLabel}>
            <StarIcon /> Immediate Actions
          </Text>
          {opportunities
            .filter(o => o.type === 'immediate')
            .map(opp => (
              <View key={opp.id} style={styles.opportunityItem}>
                <View style={styles.oppLeft}>
                  <Text style={styles.oppIcon}>{opp.icon}</Text>
                  <View style={styles.oppContent}>
                    <Text style={styles.oppTitle}>{opp.title}</Text>
                    <Text style={styles.oppDescription}>{opp.description}</Text>
                  </View>
                </View>
                <View style={styles.oppRight}>
                  <Text style={styles.oppAmount}>+${opp.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.oppButton}>
                    <Text style={styles.oppButtonText}>{opp.action}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {/* Action Required */}
          <Text style={styles.sectionLabel}>
            <TargetIcon /> Action Required
          </Text>
          {opportunities
            .filter(o => o.type === 'action-required')
            .map(opp => (
              <View key={opp.id} style={styles.opportunityItem}>
                <View style={styles.oppLeft}>
                  <Text style={styles.oppIcon}>{opp.icon}</Text>
                  <View style={styles.oppContent}>
                    <Text style={styles.oppTitle}>{opp.title}</Text>
                    <Text style={styles.oppDescription}>{opp.description}</Text>
                  </View>
                </View>
                <View style={styles.oppRight}>
                  <Text style={styles.oppAmount}>+${opp.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.oppButton}>
                    <Text style={styles.oppButtonText}>{opp.action}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

          {/* Setup & Optimize */}
          <Text style={styles.sectionLabel}>icon Setup & Optimize</Text>
          {opportunities
            .filter(o => o.type === 'setup')
            .map(opp => (
              <View key={opp.id} style={styles.opportunityItem}>
                <View style={styles.oppLeft}>
                  <Text style={styles.oppIcon}>{opp.icon}</Text>
                  <View style={styles.oppContent}>
                    <Text style={styles.oppTitle}>{opp.title}</Text>
                    <Text style={styles.oppDescription}>{opp.description}</Text>
                  </View>
                </View>
                <View style={styles.oppRight}>
                  <Text style={styles.oppAmount}>+${opp.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.oppButton}>
                    <Text style={styles.oppButtonText}>{opp.action}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
    textAlign: 'center',
  },
  opportunityCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: palette.success,
    borderRadius: radius.card,
    alignItems: 'center',
  },
  opportunityLabel: {
    ...typography.body,
    color: palette.surface,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  opportunityAmount: {
    ...typography.h1,
    color: palette.surface,
    fontSize: 42,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  opportunitySubtext: {
    ...typography.secondary,
    color: palette.surface,
    opacity: 0.9,
  },
  tabs: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: palette.primary,
  },
  tabText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  tabTextActive: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  content: {
    padding: spacing.lg,
  },
  contentHeader: {
    marginBottom: spacing.lg,
  },
  contentTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  contentSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  recommendationCard: {
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.md,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  recIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recIconText: {
    fontSize: 24,
  },
  recHeaderContent: {
    flex: 1,
  },
  recTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 2,
  },
  recCategory: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 12,
  },
  impactBadge: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.badge,
  },
  impactText: {
    ...typography.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  recDescription: {
    ...typography.body,
    color: palette.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsTag: {
    padding: spacing.sm,
    backgroundColor: palette.successLight,
    borderRadius: radius.badge,
  },
  savingsTagText: {
    ...typography.bodyBold,
    color: palette.success,
    fontSize: 14,
  },
  actionButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  actionButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  patternCard: {
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.md,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  patternIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  patternTitle: {
    ...typography.bodyBold,
    color: palette.text,
    flex: 1,
  },
  patternDescription: {
    ...typography.body,
    color: palette.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  trendBar: {
    padding: spacing.md,
    borderRadius: radius.card,
  },
  trendText: {
    ...typography.bodyBold,
    fontSize: 13,
  },
  sectionLabel: {
    ...typography.h3,
    color: palette.text,
    fontSize: 16,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  opportunityItem: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.md,
  },
  oppLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.md,
  },
  oppIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  oppContent: {
    flex: 1,
  },
  oppTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  oppDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 16,
  },
  oppRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  oppAmount: {
    ...typography.h3,
    color: palette.success,
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  oppButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  oppButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 12,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
