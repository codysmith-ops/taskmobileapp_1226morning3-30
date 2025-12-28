import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import { FeatureTip } from './FeatureTip';

interface EnhancedOnboardingProps {
  onComplete: (preferences: OnboardingPreferences) => void;
}

export interface OnboardingPreferences {
  enableGeolocationPrompts: boolean;
  enableFeatureTips: boolean;
  gradualFeatureIntroduction: boolean;
  enableReceiptScanning: boolean;
  enableBudgetTracking: boolean;
  enableCashbackOptimization: boolean;
  familyMembers: number;
  primaryGoal: 'save-money' | 'track-spending' | 'maximize-rewards' | 'family-budget';
}

export const EnhancedOnboardingWizard: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [showMLExplanation, setShowMLExplanation] = useState(false);

  const [preferences, setPreferences] = useState<OnboardingPreferences>({
    enableGeolocationPrompts: true,
    enableFeatureTips: true,
    gradualFeatureIntroduction: true,
    enableReceiptScanning: true,
    enableBudgetTracking: true,
    enableCashbackOptimization: true,
    familyMembers: 1,
    primaryGoal: 'save-money',
  });

  const updatePreference = <K extends keyof OnboardingPreferences>(
    key: K,
    value: OnboardingPreferences[K]
  ) => {
    setPreferences({ ...preferences, [key]: value });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {[0, 1, 2, 3, 4].map(s => (
          <View key={s} style={[styles.progressDot, s <= step && styles.progressDotActive]} />
        ))}
      </View>
      <Text style={styles.progressText}>Step {step + 1} of 5</Text>
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepIcon}>Target</Text>
            <Text style={styles.stepTitle}>What's your primary goal?</Text>
            <Text style={styles.stepDescription}>
              We'll customize your experience based on what matters most to you
            </Text>

            <View style={styles.optionsGrid}>
              {[
                { value: 'save-money', icon: 'money', label: 'Save Money' },
                { value: 'track-spending', icon: 'chart', label: 'Track Spending' },
                { value: 'maximize-rewards', icon: 'gift', label: 'Maximize Rewards' },
                { value: 'family-budget', icon: 'family', label: 'Family Budget' },
              ].map(goal => (
                <TouchableOpacity
                  key={goal.value}
                  style={[
                    styles.optionCard,
                    preferences.primaryGoal === goal.value && styles.optionCardActive,
                  ]}
                  onPress={() => updatePreference('primaryGoal', goal.value as any)}
                >
                  <Text style={styles.optionIcon}>{goal.icon}</Text>
                  <Text
                    style={[
                      styles.optionLabel,
                      preferences.primaryGoal === goal.value && styles.optionLabelActive,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepIcon}>AI</Text>
            <Text style={styles.stepTitle}>Smart Features</Text>
            <Text style={styles.stepDescription}>
              Our AI learns your spending patterns to help you save automatically
            </Text>

            <TouchableOpacity
              style={styles.learnMoreButton}
              onPress={() => setShowMLExplanation(true)}
            >
              <Text style={styles.learnMoreText}>How does machine learning work? →</Text>
            </TouchableOpacity>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Switch
                  value={preferences.enableReceiptScanning}
                  onValueChange={v => updatePreference('enableReceiptScanning', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Receipt Scanning</Text>
                  <Text style={styles.featureDescription}>
                    Automatically extract purchase details and categorize spending
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Switch
                  value={preferences.enableCashbackOptimization}
                  onValueChange={v => updatePreference('enableCashbackOptimization', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>icon Cashback Optimization</Text>
                  <Text style={styles.featureDescription}>
                    AI suggests the best credit card for each purchase
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Switch
                  value={preferences.enableBudgetTracking}
                  onValueChange={v => updatePreference('enableBudgetTracking', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Smart Budgeting</Text>
                  <Text style={styles.featureDescription}>
                    Automatic budget recommendations based on your habits
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepIcon}>Location</Text>
            <Text style={styles.stepTitle}>Location Features</Text>
            <Text style={styles.stepDescription}>Get helpful prompts when you're shopping</Text>

            <View style={styles.demoCard}>
              <Text style={styles.demoTitle}>Example:</Text>
              <Text style={styles.demoText}>
                When you leave a store, we'll ask if you want to scan your receipt. This helps track
                spending and maximize cashback rewards.
              </Text>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Switch
                  value={preferences.enableGeolocationPrompts}
                  onValueChange={v => updatePreference('enableGeolocationPrompts', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Receipt Upload Prompts</Text>
                  <Text style={styles.featureDescription}>
                    Get reminders to scan receipts when leaving stores
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.privacyNote}>
              <Text style={styles.privacyText}>
                Your location data stays private and is never sold
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepIcon}>Tip</Text>
            <Text style={styles.stepTitle}>Learning Experience</Text>
            <Text style={styles.stepDescription}>How would you like to discover features?</Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Switch
                  value={preferences.gradualFeatureIntroduction}
                  onValueChange={v => updatePreference('gradualFeatureIntroduction', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Gradual Feature Introduction</Text>
                  <Text style={styles.featureDescription}>
                    We'll introduce new features over time as you use the app
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Switch
                  value={preferences.enableFeatureTips}
                  onValueChange={v => updatePreference('enableFeatureTips', v)}
                  trackColor={{ false: palette.border, true: palette.primary }}
                />
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Feature Tips & Hints</Text>
                  <Text style={styles.featureDescription}>
                    Show helpful explanations when you encounter new features
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                You can always change these settings later in Preferences
              </Text>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepIcon}>Family</Text>
            <Text style={styles.stepTitle}>Family Setup</Text>
            <Text style={styles.stepDescription}>How many people are in your household?</Text>

            <View style={styles.numberSelector}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() =>
                  updatePreference('familyMembers', Math.max(1, preferences.familyMembers - 1))
                }
              >
                <Text style={styles.numberButtonText}>−</Text>
              </TouchableOpacity>
              <View style={styles.numberDisplay}>
                <Text style={styles.numberValue}>{preferences.familyMembers}</Text>
                <Text style={styles.numberLabel}>
                  {preferences.familyMembers === 1 ? 'person' : 'people'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() =>
                  updatePreference('familyMembers', Math.min(10, preferences.familyMembers + 1))
                }
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>You're all set!</Text>
              <Text style={styles.summaryText}>Based on your selections, we've configured:</Text>
              <View style={styles.summaryList}>
                {preferences.enableReceiptScanning && (
                  <Text style={styles.summaryItem}>✓ Receipt scanning & OCR</Text>
                )}
                {preferences.enableCashbackOptimization && (
                  <Text style={styles.summaryItem}>✓ Cashback optimization</Text>
                )}
                {preferences.enableBudgetTracking && (
                  <Text style={styles.summaryItem}>✓ Smart budget tracking</Text>
                )}
                {preferences.enableGeolocationPrompts && (
                  <Text style={styles.summaryItem}>✓ Location-based prompts</Text>
                )}
                {preferences.familyMembers > 1 && (
                  <Text style={styles.summaryItem}>
                    ✓ Family tracking ({preferences.familyMembers} members)
                  </Text>
                )}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderProgressBar()}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, step === 0 && styles.nextButtonFull]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{step === 4 ? 'Get Started' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>

      <FeatureTip
        visible={showMLExplanation}
        title="Machine Learning Explained"
        icon="brain"
        message={`Our AI analyzes your spending patterns to help you:

• Identify where you spend the most
• Predict upcoming expenses
• Suggest better budget allocations
• Recommend the best credit card for each purchase
• Alert you to unusual spending

The more you use the app, the smarter it gets! Your data is encrypted and never shared.`}
        onClose={() => setShowMLExplanation(false)}
        canDisable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  progressContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  progressBar: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: palette.border,
  },
  progressDotActive: {
    backgroundColor: palette.primary,
  },
  progressText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
  },
  optionCardActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight,
  },
  optionIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    ...typography.body,
    color: palette.text,
    textAlign: 'center',
  },
  optionLabelActive: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  learnMoreButton: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  learnMoreText: {
    ...typography.body,
    color: palette.primary,
    textAlign: 'center',
  },
  featuresList: {
    width: '100%',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  demoCard: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: palette.infoLight,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.info,
    marginBottom: spacing.lg,
  },
  demoTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  demoText: {
    ...typography.body,
    color: palette.text,
    lineHeight: 20,
  },
  privacyNote: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: palette.successLight,
    borderRadius: radius.card,
  },
  privacyText: {
    ...typography.body,
    color: palette.text,
    textAlign: 'center',
  },
  infoBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  infoText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  numberSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginVertical: spacing.xl,
  },
  numberButton: {
    width: 56,
    height: 56,
    backgroundColor: palette.primary,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    ...typography.h2,
    color: palette.surface,
  },
  numberDisplay: {
    alignItems: 'center',
  },
  numberValue: {
    ...typography.h1,
    color: palette.text,
    fontSize: 48,
  },
  numberLabel: {
    ...typography.body,
    color: palette.textSecondary,
  },
  summaryCard: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: palette.background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  summaryTitle: {
    ...typography.h3,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  summaryText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  summaryList: {
    gap: spacing.sm,
  },
  summaryItem: {
    ...typography.body,
    color: palette.text,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.primary,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 16,
  },
});
