import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import {
  DollarIcon,
  StarIcon,
  ChartIcon,
  CreditCardIcon,
  TrendUpIcon,
  TargetIcon,
  CheckmarkIcon,
  LightbulbIcon,
} from '../components/Icons';

const { width } = Dimensions.get('window');

export const SavingsDashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Actual user data
  const actualSpending = {
    week: 287.45,
    month: 1247.89,
    year: 14234.56,
  };

  // What they WOULD have spent without the app
  const withoutAppSpending = {
    week: 425.0,
    month: 1850.0,
    year: 22200.0,
  };

  // National averages
  const nationalAverage = {
    week: 475.0,
    month: 2050.0,
    year: 24600.0,
  };

  const currentActual = actualSpending[timeframe];
  const currentWithoutApp = withoutAppSpending[timeframe];
  const currentNational = nationalAverage[timeframe];

  const savedVsWithoutApp = currentWithoutApp - currentActual;
  const savedVsNational = currentNational - currentActual;
  const cashbackEarned = {
    week: 23.45,
    month: 102.34,
    year: 1234.56,
  }[timeframe];

  const totalValue = savedVsWithoutApp + cashbackEarned;
  const percentageSaved = ((savedVsWithoutApp / currentWithoutApp) * 100).toFixed(1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <DollarIcon /> Your Savings Dashboard
        </Text>
        <Text style={styles.headerSubtitle}>See how much you're saving</Text>
      </View>

      <View style={styles.timeframeSelector}>
        {(['week', 'month', 'year'] as const).map(tf => (
          <TouchableOpacity
            key={tf}
            style={[styles.timeframeButton, timeframe === tf && styles.timeframeButtonActive]}
            onPress={() => setTimeframe(tf)}
          >
            <Text style={[styles.timeframeText, timeframe === tf && styles.timeframeTextActive]}>
              {tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : 'This Year'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total Value Hero */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Value Generated</Text>
        <Text style={styles.heroAmount}>${totalValue.toFixed(2)}</Text>
        <Text style={styles.heroSubtext}>
          This {timeframe} • {percentageSaved}% savings rate
        </Text>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>
            <CheckmarkIcon /> Outstanding Performance!
          </Text>
        </View>
      </View>

      {/* Comparison Bars */}
      <View style={styles.comparisonCard}>
        <Text style={styles.sectionTitle}>
          <ChartIcon /> Spending Comparison
        </Text>

        {/* Your Spending */}
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonLabel}>
            <Text style={styles.comparisonLabelText}>Your Spending</Text>
            <Text style={styles.comparisonAmount}>${currentActual.toFixed(2)}</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(currentActual / currentNational) * 100}%`,
                  backgroundColor: palette.success,
                },
              ]}
            />
          </View>
        </View>

        {/* Without App */}
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonLabel}>
            <Text style={styles.comparisonLabelText}>Without App</Text>
            <Text style={styles.comparisonAmount}>${currentWithoutApp.toFixed(2)}</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(currentWithoutApp / currentNational) * 100}%`,
                  backgroundColor: palette.warning,
                },
              ]}
            />
          </View>
        </View>

        {/* National Average */}
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonLabel}>
            <Text style={styles.comparisonLabelText}>National Average</Text>
            <Text style={styles.comparisonAmount}>${currentNational.toFixed(2)}</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  width: '100%',
                  backgroundColor: palette.error,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.comparisonInsight}>
          <Text style={styles.insightText}>
            <LightbulbIcon /> You're spending{' '}
            <Text style={styles.insightHighlight}>{percentageSaved}% less</Text> than you would
            without this app!
          </Text>
        </View>
      </View>

      {/* Savings Breakdown */}
      <View style={styles.breakdownCard}>
        <Text style={styles.sectionTitle}>💎 Value Breakdown</Text>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIcon}>
            <Text style={styles.breakdownIconText}>
              <DollarIcon />
            </Text>
          </View>
          <View style={styles.breakdownContent}>
            <Text style={styles.breakdownLabel}>Smart Spending Saved</Text>
            <Text style={styles.breakdownDescription}>vs. your pre-app habits</Text>
          </View>
          <Text style={styles.breakdownAmount}>+${savedVsWithoutApp.toFixed(2)}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIcon}>
            <Text style={styles.breakdownIconText}>
              <CreditCardIcon />
            </Text>
          </View>
          <View style={styles.breakdownContent}>
            <Text style={styles.breakdownLabel}>Cashback Earned</Text>
            <Text style={styles.breakdownDescription}>Optimized card usage</Text>
          </View>
          <Text style={styles.breakdownAmount}>+${cashbackEarned.toFixed(2)}</Text>
        </View>

        <View style={styles.breakdownItem}>
          <View style={styles.breakdownIcon}>
            <Text style={styles.breakdownIconText}>
              <ChartIcon />
            </Text>
          </View>
          <View style={styles.breakdownContent}>
            <Text style={styles.breakdownLabel}>vs. National Average</Text>
            <Text style={styles.breakdownDescription}>You're ahead of the curve</Text>
          </View>
          <Text style={styles.breakdownAmount}>+${savedVsNational.toFixed(2)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Value</Text>
          <Text style={styles.totalAmount}>${totalValue.toFixed(2)}</Text>
        </View>
      </View>

      {/* Projected Annual Impact */}
      {timeframe !== 'year' && (
        <View style={styles.projectionCard}>
          <Text style={styles.projectionTitle}>
            <TrendUpIcon /> Projected Annual Impact
          </Text>
          <Text style={styles.projectionSubtitle}>If you maintain this pace...</Text>

          <View style={styles.projectionGrid}>
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Annual Savings</Text>
              <Text style={styles.projectionValue}>
                ${(savedVsWithoutApp * (timeframe === 'week' ? 52 : 12)).toFixed(2)}
              </Text>
            </View>
            <View style={styles.projectionDivider} />
            <View style={styles.projectionItem}>
              <Text style={styles.projectionLabel}>Annual Cashback</Text>
              <Text style={styles.projectionValue}>
                ${(cashbackEarned * (timeframe === 'week' ? 52 : 12)).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.projectionTotal}>
            <Text style={styles.projectionTotalLabel}>Total Annual Value</Text>
            <Text style={styles.projectionTotalAmount}>
              ${(totalValue * (timeframe === 'week' ? 52 : 12)).toFixed(2)}
            </Text>
          </View>

          <View style={styles.equivalentCard}>
            <Text style={styles.equivalentText}>
              That's equivalent to{' '}
              <Text style={styles.equivalentHighlight}>
                {Math.floor((totalValue * (timeframe === 'week' ? 52 : 12)) / 150)} free dinners
              </Text>{' '}
              or{' '}
              <Text style={styles.equivalentHighlight}>
                {Math.floor((totalValue * (timeframe === 'week' ? 52 : 12)) / 500)} months of
                streaming
              </Text>
              !
            </Text>
          </View>
        </View>
      )}

      {/* Performance Meter */}
      <View style={styles.meterCard}>
        <Text style={styles.sectionTitle}>
          <TargetIcon /> Performance Rating
        </Text>

        <View style={styles.meterContainer}>
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                {
                  width: `${Math.min(parseFloat(percentageSaved) * 2, 100)}%`,
                },
              ]}
            />
            <View
              style={[
                styles.meterPointer,
                {
                  left: `${Math.min(parseFloat(percentageSaved) * 2, 100)}%`,
                },
              ]}
            />
          </View>
          <View style={styles.meterLabels}>
            <Text style={styles.meterLabel}>Poor</Text>
            <Text style={styles.meterLabel}>Good</Text>
            <Text style={styles.meterLabel}>Excellent</Text>
          </View>
        </View>

        <Text style={styles.ratingText}>
          {parseFloat(percentageSaved) >= 30
            ? "<StarIcon /> Excellent! You're a savings superstar!"
            : parseFloat(percentageSaved) >= 20
            ? '👍 Great job! Keep up the good work!'
            : '💪 Good start! You can save even more!'}
        </Text>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsCard}>
        <Text style={styles.sectionTitle}>🏆 Recent Wins</Text>

        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>
            <TargetIcon />
          </Text>
          <Text style={styles.achievementText}>Stayed under budget in 5/6 categories</Text>
        </View>

        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>
            <CreditCardIcon />
          </Text>
          <Text style={styles.achievementText}>
            Used optimal credit card 18 times this {timeframe}
          </Text>
        </View>

        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>
            <ChartIcon />
          </Text>
          <Text style={styles.achievementText}>
            Beat your average by ${(currentWithoutApp - currentActual - 50).toFixed(2)}
          </Text>
        </View>
      </View>

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
  timeframeSelector: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: palette.surface,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.background,
    alignItems: 'center',
  },
  timeframeButtonActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  timeframeText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  timeframeTextActive: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  heroCard: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: palette.success,
    borderRadius: radius.card,
    alignItems: 'center',
  },
  heroLabel: {
    ...typography.body,
    color: palette.surface,
    opacity: 0.9,
    marginBottom: spacing.xs,
  },
  heroAmount: {
    ...typography.h1,
    color: palette.surface,
    fontSize: 48,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  heroSubtext: {
    ...typography.body,
    color: palette.surface,
    opacity: 0.9,
  },
  heroBadge: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.badge,
  },
  heroBadgeText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  comparisonCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.lg,
  },
  comparisonRow: {
    marginBottom: spacing.lg,
  },
  comparisonLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  comparisonLabelText: {
    ...typography.bodyBold,
    color: palette.text,
  },
  comparisonAmount: {
    ...typography.bodyBold,
    color: palette.text,
  },
  barContainer: {
    height: 24,
    backgroundColor: palette.border,
    borderRadius: radius.badge,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radius.badge,
  },
  comparisonInsight: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: palette.successLight,
    borderRadius: radius.card,
  },
  insightText: {
    ...typography.body,
    color: palette.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  insightHighlight: {
    ...typography.bodyBold,
    color: palette.success,
  },
  breakdownCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  breakdownIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  breakdownIconText: {
    fontSize: 24,
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownLabel: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 2,
  },
  breakdownDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  breakdownAmount: {
    ...typography.h3,
    color: palette.success,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
  },
  totalLabel: {
    ...typography.h3,
    color: palette.text,
  },
  totalAmount: {
    ...typography.h2,
    color: palette.success,
  },
  projectionCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.infoLight,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.info,
  },
  projectionTitle: {
    ...typography.h3,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  projectionSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  projectionGrid: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  projectionItem: {
    flex: 1,
    alignItems: 'center',
  },
  projectionDivider: {
    width: 1,
    backgroundColor: palette.info,
  },
  projectionLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  projectionValue: {
    ...typography.h3,
    color: palette.text,
  },
  projectionTotal: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    marginBottom: spacing.md,
  },
  projectionTotalLabel: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
  },
  projectionTotalAmount: {
    ...typography.h2,
    color: palette.success,
    fontSize: 32,
  },
  equivalentCard: {
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: radius.card,
  },
  equivalentText: {
    ...typography.body,
    color: palette.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  equivalentHighlight: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  meterCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  meterContainer: {
    marginBottom: spacing.lg,
  },
  meterTrack: {
    height: 32,
    backgroundColor: palette.border,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.sm,
  },
  meterFill: {
    height: '100%',
    backgroundColor: palette.success,
    borderRadius: 16,
  },
  meterPointer: {
    position: 'absolute',
    top: -4,
    width: 4,
    height: 40,
    backgroundColor: palette.text,
    borderRadius: 2,
    marginLeft: -2,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  ratingText: {
    ...typography.body,
    color: palette.text,
    textAlign: 'center',
    backgroundColor: palette.background,
    padding: spacing.md,
    borderRadius: radius.card,
  },
  achievementsCard: {
    margin: spacing.lg,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    marginBottom: spacing.sm,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  achievementText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
