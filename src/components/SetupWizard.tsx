import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
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
  authProvider?: 'apple' | 'google' | 'email';
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');
  const [authProvider, setAuthProvider] = useState<'apple' | 'google' | 'email' | undefined>();

  const handleAppleSignIn = () => {
    // Simulate Apple Sign In
    Alert.alert('Apple Sign In', 'Would you like to sign in with Apple ID?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign In',
        onPress: () => {
          setAuthProvider('apple');
          setName('Apple User');
          setEmail('user@privaterelay.appleid.com');
          setStep(2); // Skip to preferences
        },
      },
    ]);
  };

  const handleGoogleSignIn = () => {
    // Simulate Google Sign In
    Alert.alert('Google Sign In', 'Would you like to sign in with Google?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign In',
        onPress: () => {
          setAuthProvider('google');
          setName('Google User');
          setEmail('user@gmail.com');
          setStep(2); // Skip to preferences
        },
      },
    ]);
  };

  const steps = [
    {
      title: 'Welcome to Task Manager',
      subtitle: "Let's get you set up in just a few steps",
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.sectionTitle}>Sign in to get started</Text>
          
          <TouchableOpacity style={styles.appleSignInButton} onPress={handleAppleSignIn}>
            <Text style={styles.appleIcon}></Text>
            <Text style={styles.appleSignInText}>Sign in with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleSignInButton} onPress={handleGoogleSignIn}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleSignInText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.emailSignInButton}
            onPress={() => {
              setAuthProvider('email');
              setStep(1);
            }}
          >
            <Text style={styles.emailSignInText}>Continue with Email</Text>
          </TouchableOpacity>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What you'll get:</Text>
            <Text style={styles.welcomeText}>📋 Manage your tasks efficiently</Text>
            <Text style={styles.welcomeText}>📷 Scan barcodes or take photos</Text>
            <Text style={styles.welcomeText}>🔔 Get timely reminders</Text>
            <Text style={styles.welcomeText}>⚙️ Customize to your workflow</Text>
          </View>
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
              <View style={styles.viewPreview}>
                <View style={styles.listPreviewItem} />
                <View style={styles.listPreviewItem} />
                <View style={styles.listPreviewItem} />
              </View>
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'list' && styles.viewOptionTextActive,
                ]}
              >
                📋 List View
              </Text>
              <Text style={styles.viewOptionDescription}>
                Tasks in a vertical list
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.viewOption, defaultView === 'grid' && styles.viewOptionActive]}
              onPress={() => setDefaultView('grid')}
            >
              <View style={styles.viewPreview}>
                <View style={styles.gridPreviewRow}>
                  <View style={styles.gridPreviewItem} />
                  <View style={styles.gridPreviewItem} />
                </View>
                <View style={styles.gridPreviewRow}>
                  <View style={styles.gridPreviewItem} />
                  <View style={styles.gridPreviewItem} />
                </View>
              </View>
              <Text
                style={[
                  styles.viewOptionText,
                  defaultView === 'grid' && styles.viewOptionTextActive,
                ]}
              >
                ⊞ Grid View
              </Text>
              <Text style={styles.viewOptionDescription}>
                Tasks in a card grid
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
        authProvider,
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
  sectionTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  appleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    gap: spacing.sm,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  appleSignInText: {
    ...typography.bodyBold,
    color: '#FFFFFF',
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    gap: spacing.sm,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  googleSignInText: {
    ...typography.bodyBold,
    color: palette.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: palette.border,
  },
  dividerText: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  emailSignInButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
    alignItems: 'center',
  },
  emailSignInText: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  featuresContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  featuresTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  welcomeText: {
    ...typography.body,
    color: palette.text,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
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
    gap: spacing.md,
  },
  viewOptionActive: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  viewPreview: {
    width: '100%',
    height: 80,
    marginBottom: spacing.sm,
  },
  listPreviewItem: {
    height: 20,
    backgroundColor: palette.border,
    borderRadius: 4,
    marginBottom: 6,
  },
  gridPreviewRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  gridPreviewItem: {
    flex: 1,
    height: 35,
    backgroundColor: palette.border,
    borderRadius: 4,
  },
  viewOptionText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  viewOptionTextActive: {
    color: palette.primary,
  },
  viewOptionDescription: {
    ...typography.secondary,
    color: palette.textTertiary,
    fontSize: 12,
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
