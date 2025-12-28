import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface SetupWizardProps {
  onComplete: (userData: UserSetupData) => void;
}

export interface UserSetupData {
  name: string;
  email: string;
  company?: string;
  notificationsEnabled: boolean;
  defaultView: 'list' | 'grid';
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');

  const steps = [
    {
      title: 'Welcome to Task Manager',
      subtitle: "Let's get you set up in just a few steps",
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeText}>📋 Manage your tasks efficiently</Text>
          <Text style={styles.welcomeText}>📷 Scan barcodes or take photos</Text>
          <Text style={styles.welcomeText}>🔔 Get timely reminders</Text>
          <Text style={styles.welcomeText}>⚙️ Customize to your workflow</Text>
        </View>
      ),
    },
    {
      title: 'Your Information',
      subtitle: 'Tell us a bit about yourself',
      content: (
        <View style={styles.formContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={palette.textTertiary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={palette.textTertiary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your company name"
              value={company}
              onChangeText={setCompany}
              placeholderTextColor={palette.textTertiary}
            />
          </View>
        </View>
      ),
    },
    {
      title: 'Preferences',
      subtitle: 'Customize your experience',
      content: (
        <View style={styles.preferencesContent}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Enable Notifications</Text>
              <Text style={styles.preferenceSubtitle}>Get reminders for due tasks</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notificationsEnabled && styles.toggleActive]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <View
                style={[styles.toggleThumb, notificationsEnabled && styles.toggleThumbActive]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Default View</Text>
              <Text style={styles.preferenceSubtitle}>Choose how tasks are displayed</Text>
            </View>
          </View>
          <View style={styles.viewOptions}>
            <TouchableOpacity
              style={[styles.viewOption, defaultView === 'list' && styles.viewOptionActive]}
              onPress={() => setDefaultView('list')}
            >
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'list' && styles.viewOptionTextActive,
                ]}
              >
                📋 List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewOption, defaultView === 'grid' && styles.viewOptionActive]}
              onPress={() => setDefaultView('grid')}
            >
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'grid' && styles.viewOptionTextActive,
                ]}
              >
                ⊞ Grid
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        Alert.alert('Required Fields', 'Please enter your name and email');
        return;
      }
      if (!email.includes('@')) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        name,
        email,
        company,
        notificationsEnabled,
        defaultView,
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === step && styles.progressDotActive,
                index < step && styles.progressDotComplete,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        {currentStep.content}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, step === 0 && styles.nextButtonFull]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {step === steps.length - 1 ? 'Get Started' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 32,
    height: 6,
    backgroundColor: palette.border,
    borderRadius: radius.badge,
  },
  progressDotActive: {
    backgroundColor: palette.primary,
  },
  progressDotComplete: {
    backgroundColor: palette.success,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  welcomeContent: {
    gap: spacing.lg,
  },
  welcomeText: {
    ...typography.subtitle,
    color: palette.text,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  formContent: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.bodyBold,
    color: palette.text,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.text,
  },
  preferencesContent: {
    gap: spacing.xl,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  preferenceSubtitle: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: palette.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: palette.primary,
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.surface,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  viewOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  viewOption: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
  },
  viewOptionActive: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  viewOptionText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  viewOptionTextActive: {
    color: palette.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.surface,
  },
  backButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
  },
  backButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  nextButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
});
