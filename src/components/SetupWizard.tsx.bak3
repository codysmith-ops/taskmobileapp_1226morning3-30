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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import {
  CameraIcon,
  BellIcon,
  CheckmarkIcon,
  DollarIcon,
  CreditCardIcon,
  ChartIcon,
  UsersIcon,
  LightbulbIcon,
  ClockIcon,
  CalendarIcon,
  LocationIcon,
  TargetIcon,
} from './Icons';

interface SetupWizardProps {
  onComplete: (userData: UserSetupData) => void;
}

export type UserGoal =
  | 'save-money'
  | 'credit-points'
  | 'budget'
  | 'collaborate'
  | 'organize'
  | 'efficiency';
export type Category = 'groceries' | 'hardware' | 'errands' | 'medical' | 'shopping' | 'returns';

export interface UserSetupData {
  name: string;
  email: string;
  company?: string;
  notificationsEnabled: boolean;
  defaultView: 'list' | 'grid';
  authProvider?: 'apple' | 'google' | 'email';
  goals: UserGoal[];
  budgetAmount?: number;
  budgetPeriod?: 'weekly' | 'monthly';
  creditCards?: Array<{ name: string; rewardsType: string }>;
  locationPermissionGranted?: boolean;
  selectedCategories?: Category[];
  displayName?: string;
  collaborators?: string[];
  autoReceiptUpload?: boolean;
  cameraPreference?: 'camera' | 'library';
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // New onboarding state
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>(['']);
  const [autoReceiptUpload, setAutoReceiptUpload] = useState(true);
  const [cameraPreference, setCameraPreference] = useState<'camera' | 'library'>('camera');
  const [defaultView, setDefaultView] = useState<'list' | 'grid'>('list');
  const [authProvider, setAuthProvider] = useState<'apple' | 'google' | 'email' | undefined>();
  const [selectedGoals, setSelectedGoals] = useState<UserGoal[]>([]);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState<'weekly' | 'monthly'>('monthly');
  const [creditCardName, setCreditCardName] = useState('');
  const [rewardsType, setRewardsType] = useState('');
  const [showCardSuggestions, setShowCardSuggestions] = useState(false);
  const [showRewardsSuggestions, setShowRewardsSuggestions] = useState(false);

  // Popular credit cards
  const popularCards = [
    'Chase Sapphire Preferred',
    'Chase Sapphire Reserve',
    'Chase Freedom Unlimited',
    'Chase Freedom Flex',
    'American Express Gold',
    'American Express Platinum',
    'Capital One Venture',
    'Capital One Venture X',
    'Citi Double Cash',
    'Discover it Cash Back',
    'Wells Fargo Active Cash',
    'Bank of America Premium Rewards',
    'Apple Card',
  ];

  // Common rewards types
  const rewardsTypes = [
    'Travel Points',
    'Cashback',
    'Airline Miles',
    'Hotel Points',
    'Flex Points',
    'Membership Rewards',
    'Ultimate Rewards',
    'ThankYou Points',
  ];

  const filteredCards = creditCardName
    ? popularCards.filter(card => card.toLowerCase().includes(creditCardName.toLowerCase()))
    : popularCards;

  const filteredRewards = rewardsType
    ? rewardsTypes.filter(reward => reward.toLowerCase().includes(rewardsType.toLowerCase()))
    : rewardsTypes;

  const toggleGoal = (goal: UserGoal) => {
    setSelectedGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

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

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // iOS: Request location permission (would use react-native-permissions in production)
        Alert.alert(
          'Location Permission',
          'This app needs location access for automatic task completion when you leave stores.',
          [
            { text: 'Not Now', onPress: () => setLocationPermissionGranted(false) },
            { text: 'Allow', onPress: () => setLocationPermissionGranted(true) },
          ]
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setLocationPermissionGranted(granted === PermissionsAndroid.RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
      setLocationPermissionGranted(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Notification Permission',
        'Allow notifications for task reminders and completion alerts?',
        [
          { text: 'Not Now', onPress: () => setNotificationsEnabled(false) },
          { text: 'Allow', onPress: () => setNotificationsEnabled(true) },
        ]
      );
    } else {
      setNotificationsEnabled(true); // Android handles this differently
    }
  };

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const addCollaborator = () => {
    setCollaborators(prev => [...prev, '']);
  };

  const updateCollaborator = (index: number, value: string) => {
    setCollaborators(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const removeCollaborator = (index: number) => {
    setCollaborators(prev => prev.filter((_, i) => i !== index));
  };

  const steps = [
    {
      title: 'Welcome to Task Manager',
      subtitle: "Let's get you set up in just a few steps",
      content: (
        <View style={styles.welcomeContent}>
          <Text style={styles.sectionTitle}>Sign in to get started</Text>

          <TouchableOpacity style={styles.appleSignInButton} onPress={handleAppleSignIn}>
            <Text style={styles.appleIcon} />
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
            <View style={styles.featureRow}>
              <CheckmarkIcon size={20} color={palette.primary} />
              <Text style={styles.featureText}>Manage your tasks efficiently</Text>
            </View>
            <View style={styles.featureRow}>
              <CameraIcon size={20} color={palette.primary} />
              <Text style={styles.featureText}>Scan barcodes or take photos</Text>
            </View>
            <View style={styles.featureRow}>
              <BellIcon size={20} color={palette.primary} />
              <Text style={styles.featureText}>Get timely reminders</Text>
            </View>
            <View style={styles.featureRow}>
              <CheckmarkIcon size={20} color={palette.primary} />
              <Text style={styles.featureText}>Customize to your workflow</Text>
            </View>
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
              <View style={styles.viewOptionHeader}>
                <CheckmarkIcon
                  size={16}
                  color={defaultView === 'list' ? palette.primary : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.viewOptionText,
                    defaultView === 'list' && styles.viewOptionTextActive,
                  ]}
                >
                  List View
                </Text>
              </View>
              <Text style={styles.viewOptionDescription}>Tasks in a vertical list</Text>
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
              <View style={styles.viewOptionHeader}>
                <ChartIcon
                  size={16}
                  color={defaultView === 'grid' ? palette.primary : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.viewOptionText,
                    defaultView === 'grid' && styles.viewOptionTextActive,
                  ]}
                >
                  Grid View
                </Text>
              </View>
              <Text style={styles.viewOptionDescription}>Tasks in a card grid</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
    {
      title: 'What matters most to you?',
      subtitle: 'Select your goals so we can personalize your experience',
      content: (
        <View style={styles.goalsContent}>
          <Text style={styles.goalsIntro}>
            Choose one or more goals. We'll configure the app with AI-powered features to help you
            achieve them.
          </Text>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('save-money') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('save-money')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <DollarIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Save Money</Text>
                <Text style={styles.goalDescription}>
                  Find deals, compare prices, track savings
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('save-money') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('save-money') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('credit-points') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('credit-points')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <CreditCardIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Credit Card Points</Text>
                <Text style={styles.goalDescription}>Earn rewards on every purchase</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('credit-points') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('credit-points') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('budget') && styles.goalCardSelected]}
            onPress={() => toggleGoal('budget')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <ChartIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Within Budget</Text>
                <Text style={styles.goalDescription}>Track spending, set limits, get alerts</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('budget') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('budget') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('collaborate') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('collaborate')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <UsersIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Collaborate with Others</Text>
                <Text style={styles.goalDescription}>Share lists, assign tasks, work together</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('collaborate') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('collaborate') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.goalCard, selectedGoals.includes('organize') && styles.goalCardSelected]}
            onPress={() => toggleGoal('organize')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <CheckmarkIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Stay Organized</Text>
                <Text style={styles.goalDescription}>Categories, reminders, prioritization</Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('organize') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('organize') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.goalCard,
              selectedGoals.includes('efficiency') && styles.goalCardSelected,
            ]}
            onPress={() => toggleGoal('efficiency')}
          >
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <ClockIcon size={32} color={palette.primary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Maximize Efficiency</Text>
                <Text style={styles.goalDescription}>
                  Smart routing, batch tasks, time optimization
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  selectedGoals.includes('efficiency') && styles.checkboxSelected,
                ]}
              >
                {selectedGoals.includes('efficiency') && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ),
    },
    // Conditional goal-specific configuration steps
    ...(selectedGoals.includes('budget')
      ? [
          {
            title: 'Set Your Budget',
            subtitle: "We'll help you stay on track",
            content: (
              <View style={styles.budgetContent}>
                <Text style={styles.configIntro}>
                  Set a spending limit and we'll track your purchases, alert you when you're
                  approaching the limit, and provide insights to help you save.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Budget Amount</Text>
                  <View style={styles.budgetInputContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.budgetInput}
                      placeholder="500"
                      value={budgetAmount}
                      onChangeText={setBudgetAmount}
                      keyboardType="decimal-pad"
                      placeholderTextColor={palette.textTertiary}
                    />
                  </View>
                </View>

                <View style={styles.periodSelector}>
                  <Text style={styles.label}>Budget Period</Text>
                  <View style={styles.periodButtons}>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        budgetPeriod === 'weekly' && styles.periodButtonActive,
                      ]}
                      onPress={() => setBudgetPeriod('weekly')}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          budgetPeriod === 'weekly' && styles.periodButtonTextActive,
                        ]}
                      >
                        Weekly
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.periodButton,
                        budgetPeriod === 'monthly' && styles.periodButtonActive,
                      ]}
                      onPress={() => setBudgetPeriod('monthly')}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          budgetPeriod === 'monthly' && styles.periodButtonTextActive,
                        ]}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.aiFeatureBox}>
                  <View style={styles.aiIconContainer}>
                    <LightbulbIcon size={24} color={palette.primary} />
                  </View>
                  <View style={styles.aiFeatureContent}>
                    <Text style={styles.aiFeatureTitle}>AI-Powered Budget Assistant</Text>
                    <Text style={styles.aiFeatureText}>
                      Get smart spending recommendations, category breakdowns, and early warnings
                      when you're likely to exceed your budget.
                    </Text>
                  </View>
                </View>
              </View>
            ),
          },
        ]
      : []),
    ...(selectedGoals.includes('credit-points')
      ? [
          {
            title: 'Maximize Your Rewards',
            subtitle: 'Tell us about your credit cards',
            content: (
              <View style={styles.creditCardContent}>
                <Text style={styles.configIntro}>
                  Add your credit cards and we'll suggest which card to use for each purchase to
                  maximize your points and cashback.
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Card Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Start typing..."
                    value={creditCardName}
                    onChangeText={text => {
                      setCreditCardName(text);
                      setShowCardSuggestions(text.length > 0);
                    }}
                    onFocus={() => setShowCardSuggestions(creditCardName.length > 0)}
                    onBlur={() => setTimeout(() => setShowCardSuggestions(false), 200)}
                    placeholderTextColor={palette.textTertiary}
                  />
                  {showCardSuggestions && filteredCards.length > 0 && (
                    <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
                      {filteredCards.slice(0, 5).map((card, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setCreditCardName(card);
                            setShowCardSuggestions(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>{card}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Rewards Type</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Start typing..."
                    value={rewardsType}
                    onChangeText={text => {
                      setRewardsType(text);
                      setShowRewardsSuggestions(text.length > 0);
                    }}
                    onFocus={() => setShowRewardsSuggestions(rewardsType.length > 0)}
                    onBlur={() => setTimeout(() => setShowRewardsSuggestions(false), 200)}
                    placeholderTextColor={palette.textTertiary}
                  />
                  {showRewardsSuggestions && filteredRewards.length > 0 && (
                    <ScrollView style={styles.suggestionsContainer} nestedScrollEnabled>
                      {filteredRewards.slice(0, 5).map((reward, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setRewardsType(reward);
                            setShowRewardsSuggestions(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>{reward}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <View style={styles.aiFeatureBox}>
                  <View style={styles.aiIconContainer}>
                    <LightbulbIcon size={24} color={palette.primary} />
                  </View>
                  <View style={styles.aiFeatureContent}>
                    <Text style={styles.aiFeatureTitle}>Smart Card Recommendations</Text>
                    <Text style={styles.aiFeatureText}>
                      Our AI analyzes category bonuses, rotating rewards, and special offers to
                      recommend the best card for each purchase.
                    </Text>
                  </View>
                </View>

                <Text style={styles.skipHint}>You can add more cards later in settings</Text>
              </View>
            ),
          },
        ]
      : []),
    // Step 7: Location Permission (MUST HAVE)
    {
      title: 'Enable Location Services',
      subtitle: 'Automatic task completion when you leave stores',
      content: (
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <LocationIcon size={64} color={palette.primary} />
          </View>
          <Text style={styles.permissionTitle}>Geofencing Magic</Text>
          <Text style={styles.permissionDescription}>
            When you leave a store like Home Depot, we'll automatically ask if you completed your
            task "Buy screws". No more forgetting!
          </Text>
          <TouchableOpacity
            style={[
              styles.permissionButton,
              locationPermissionGranted && styles.permissionButtonActive,
            ]}
            onPress={requestLocationPermission}
          >
            <LocationIcon
              size={20}
              color={locationPermissionGranted ? palette.surface : palette.primary}
            />
            <Text
              style={[
                styles.permissionButtonText,
                locationPermissionGranted && styles.permissionButtonTextActive,
              ]}
            >
              {locationPermissionGranted ? '✓ Location Enabled' : 'Enable Location'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.permissionHint}>You can change this later in Settings</Text>
        </View>
      ),
    },
    // Step 8: Category Selection (MUST HAVE)
    {
      title: 'Choose Your Categories',
      subtitle: 'Select 2-5 categories you shop for most',
      content: (
        <View style={styles.categoryContent}>
          <Text style={styles.categoryIntro}>
            We'll pre-populate store preferences and optimize your experience for these categories.
          </Text>
          <View style={styles.categoryGrid}>
            {(
              ['groceries', 'hardware', 'errands', 'medical', 'shopping', 'returns'] as Category[]
            ).map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  selectedCategories.includes(category) && styles.categoryCardSelected,
                ]}
                onPress={() => toggleCategory(category)}
              >
                <View style={styles.categoryIconContainer}>
                  {category === 'groceries' && (
                    <ChartIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                  {category === 'hardware' && (
                    <CheckmarkIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                  {category === 'errands' && (
                    <LocationIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                  {category === 'medical' && (
                    <CalendarIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                  {category === 'shopping' && (
                    <CreditCardIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                  {category === 'returns' && (
                    <TargetIcon
                      size={32}
                      color={
                        selectedCategories.includes(category)
                          ? palette.primary
                          : palette.textSecondary
                      }
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategories.includes(category) && styles.categoryLabelActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                {selectedCategories.includes(category) && (
                  <View style={styles.categoryCheckmark}>
                    <CheckmarkIcon size={16} color={palette.surface} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          {selectedCategories.length > 0 && selectedCategories.length < 2 && (
            <Text style={styles.categoryWarning}>Select at least 2 categories</Text>
          )}
        </View>
      ),
    },
    // Step 9: Notification Permission (SHOULD HAVE)
    {
      title: 'Stay in the Loop',
      subtitle: 'Get reminders and completion alerts',
      content: (
        <View style={styles.permissionContent}>
          <View style={styles.permissionIconContainer}>
            <BellIcon size={64} color={palette.primary} />
          </View>
          <Text style={styles.permissionTitle}>Never Miss a Task</Text>
          <Text style={styles.permissionDescription}>
            Get timely reminders for due tasks and alerts when you complete items near stores.
          </Text>
          <TouchableOpacity
            style={[styles.permissionButton, notificationsEnabled && styles.permissionButtonActive]}
            onPress={requestNotificationPermission}
          >
            <BellIcon size={20} color={notificationsEnabled ? palette.surface : palette.primary} />
            <Text
              style={[
                styles.permissionButtonText,
                notificationsEnabled && styles.permissionButtonTextActive,
              ]}
            >
              {notificationsEnabled ? '✓ Notifications Enabled' : 'Enable Notifications'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.permissionHint}>You can customize notification types later</Text>
        </View>
      ),
    },
    // Step 10: Collaboration Setup (SHOULD HAVE, conditional)
    ...(selectedGoals.includes('collaborate')
      ? [
          {
            title: 'Set Up Collaboration',
            subtitle: 'Share lists with family and team',
            content: (
              <View style={styles.collaborationContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Display Name for Sharing</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your display name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholderTextColor={palette.textTertiary}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Invite Collaborators (Optional)</Text>
                  {collaborators.map((collab, index) => (
                    <View key={index} style={styles.collaboratorRow}>
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="email@example.com"
                        value={collab}
                        onChangeText={text => updateCollaborator(index, text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={palette.textTertiary}
                      />
                      {collaborators.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeCollaborator(index)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity style={styles.addButton} onPress={addCollaborator}>
                    <Text style={styles.addButtonText}>+ Add Another</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.permissionRow}>
                  <UsersIcon size={20} color={palette.primary} />
                  <Text style={styles.permissionInfo}>
                    Collaborators can view and edit shared lists
                  </Text>
                </View>
              </View>
            ),
          },
        ]
      : []),
    // Step 11: Receipt Preferences (SHOULD HAVE)
    {
      title: 'Receipt Management',
      subtitle: 'How should we handle receipts?',
      content: (
        <View style={styles.receiptContent}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>Auto-Upload Receipts</Text>
              <Text style={styles.preferenceSubtitle}>
                Automatically save receipts when tasks are completed
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, autoReceiptUpload && styles.toggleActive]}
              onPress={() => setAutoReceiptUpload(!autoReceiptUpload)}
            >
              <View style={[styles.toggleThumb, autoReceiptUpload && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Preferred Method</Text>
            <View style={styles.receiptOptions}>
              <TouchableOpacity
                style={[
                  styles.receiptOption,
                  cameraPreference === 'camera' && styles.receiptOptionActive,
                ]}
                onPress={() => setCameraPreference('camera')}
              >
                <CameraIcon
                  size={32}
                  color={cameraPreference === 'camera' ? palette.primary : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.receiptOptionText,
                    cameraPreference === 'camera' && styles.receiptOptionTextActive,
                  ]}
                >
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.receiptOption,
                  cameraPreference === 'library' && styles.receiptOptionActive,
                ]}
                onPress={() => setCameraPreference('library')}
              >
                <CheckmarkIcon
                  size={32}
                  color={cameraPreference === 'library' ? palette.primary : palette.textSecondary}
                />
                <Text
                  style={[
                    styles.receiptOptionText,
                    cameraPreference === 'library' && styles.receiptOptionTextActive,
                  ]}
                >
                  Choose from Library
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
    },
    // Step 12: Quick Tips (NICE TO HAVE)
    {
      title: 'Quick Tips',
      subtitle: 'Get the most out of your experience',
      content: (
        <View style={styles.tipsContent}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator
            style={styles.tipsCarousel}
          >
            <View style={styles.tipSlide}>
              <TargetIcon size={48} color={palette.primary} />
              <Text style={styles.tipTitle}>Smart Task Completion</Text>
              <Text style={styles.tipDescription}>
                Tap a task near its store location to automatically mark it complete with receipt
                capture.
              </Text>
            </View>
            <View style={styles.tipSlide}>
              <ChartIcon size={48} color={palette.primary} />
              <Text style={styles.tipTitle}>Track Your Savings</Text>
              <Text style={styles.tipDescription}>
                View dashboards showing how much you've saved compared to average spending.
              </Text>
            </View>
            <View style={styles.tipSlide}>
              <CreditCardIcon size={48} color={palette.primary} />
              <Text style={styles.tipTitle}>Maximize Rewards</Text>
              <Text style={styles.tipDescription}>
                AI recommends the best credit card for each purchase to maximize points and
                cashback.
              </Text>
            </View>
          </ScrollView>
          <View style={styles.tipIndicators}>
            <View style={[styles.tipIndicator, styles.tipIndicatorActive]} />
            <View style={styles.tipIndicator} />
            <View style={styles.tipIndicator} />
          </View>
        </View>
      ),
    },
    // Step 13: Sample Task Offer (NICE TO HAVE)
    {
      title: 'Try It Out!',
      subtitle: 'See how it works with a sample task',
      content: (
        <View style={styles.sampleContent}>
          <View style={styles.sampleIconContainer}>
            <CheckmarkIcon size={64} color={palette.primary} />
          </View>
          <Text style={styles.sampleTitle}>Ready to Get Started?</Text>
          <Text style={styles.sampleDescription}>
            Want to see how it works? We can add a sample task to help you get familiar with the
            features.
          </Text>
          <View style={styles.samplePreview}>
            <View style={styles.sampleTaskCard}>
              <CheckmarkIcon size={24} color={palette.primary} />
              <View style={styles.sampleTaskInfo}>
                <Text style={styles.sampleTaskTitle}>Buy groceries</Text>
                <Text style={styles.sampleTaskDetails}>Whole Foods • $50 budget</Text>
              </View>
              <DollarIcon size={20} color={palette.success} />
            </View>
          </View>
          <View style={styles.sampleActions}>
            <TouchableOpacity style={styles.sampleButtonSecondary}>
              <Text style={styles.sampleButtonSecondaryText}>Skip - I'll Create My Own</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sampleButtonPrimary}>
              <Text style={styles.sampleButtonPrimaryText}>Add Sample Task</Text>
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

    if (step === 3) {
      if (selectedGoals.length === 0) {
        Alert.alert(
          'Select at least one goal',
          'Choose what matters most to you so we can personalize your experience'
        );
        return;
      }
    }

    // Step 8 validation: Category selection
    if (currentStep.title === 'Choose Your Categories') {
      if (selectedCategories.length < 2) {
        Alert.alert('Select Categories', 'Please select at least 2 categories to continue');
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Prepare credit cards array
      const creditCards = creditCardName.trim()
        ? [{ name: creditCardName, rewardsType: rewardsType || 'cashback' }]
        : undefined;

      onComplete({
        name,
        email,
        company,
        notificationsEnabled,
        defaultView,
        authProvider,
        goals: selectedGoals,
        budgetAmount: budgetAmount ? parseFloat(budgetAmount) : undefined,
        budgetPeriod,
        creditCards,
        locationPermissionGranted,
        selectedCategories,
        displayName: displayName || name,
        collaborators: collaborators.filter(c => c.trim() !== ''),
        autoReceiptUpload,
        cameraPreference,
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
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  featureText: {
    ...typography.body,
    color: palette.text,
    flex: 1,
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
  viewOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
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
  goalsContent: {
    gap: spacing.md,
  },
  goalsIntro: {
    ...typography.body,
    color: palette.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  goalCard: {
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.large,
    padding: spacing.md,
  },
  goalCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight || '#EBF5FF',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.medium,
    backgroundColor: '#FFFFFF',
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: 4,
  },
  goalDescription: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  budgetContent: {
    gap: spacing.lg,
  },
  creditCardContent: {
    gap: spacing.lg,
  },
  configIntro: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.surface,
  },
  currencySymbol: {
    ...typography.h3,
    color: palette.textSecondary,
    marginRight: spacing.sm,
  },
  budgetInput: {
    flex: 1,
    ...typography.h3,
    color: palette.text,
    paddingVertical: spacing.md,
  },
  periodSelector: {
    gap: spacing.sm,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: palette.border,
    borderRadius: radius.button,
    backgroundColor: palette.surface,
  },
  periodButtonActive: {
    borderColor: palette.primary,
    backgroundColor: palette.primaryLight || '#EBF5FF',
  },
  periodButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  periodButtonTextActive: {
    color: palette.primary,
  },
  aiFeatureBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: palette.primaryLight || '#EBF5FF',
    padding: spacing.md,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: palette.primary + '30',
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: '#FFFFFF',
  },
  aiFeatureContent: {
    flex: 1,
    gap: 4,
  },
  aiFeatureTitle: {
    ...typography.bodyBold,
    color: palette.text,
  },
  aiFeatureText: {
    ...typography.secondary,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  skipHint: {
    ...typography.secondary,
    color: palette.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  suggestionsContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.medium,
    backgroundColor: palette.surface,
    marginTop: spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  suggestionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  suggestionText: {
    ...typography.body,
    color: palette.text,
  },
  // New onboarding step styles
  permissionContent: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
    backgroundColor: palette.infoLight,
  },
  permissionTitle: {
    ...typography.h2,
    color: palette.text,
    textAlign: 'center',
  },
  permissionDescription: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 2,
    borderColor: palette.primary,
    backgroundColor: palette.surface,
  },
  permissionButtonActive: {
    backgroundColor: palette.primary,
  },
  permissionButtonText: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  permissionButtonTextActive: {
    color: palette.surface,
  },
  permissionHint: {
    ...typography.secondary,
    color: palette.textTertiary,
    textAlign: 'center',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: palette.infoLight,
    borderRadius: radius.medium,
  },
  permissionInfo: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  categoryContent: {
    gap: spacing.lg,
  },
  categoryIntro: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  categoryCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  categoryCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryWarning: {
    ...typography.secondary,
    color: palette.error,
    textAlign: 'center',
  },
  collaborationContent: {
    gap: spacing.lg,
  },
  collaboratorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: palette.error,
  },
  removeButtonText: {
    fontSize: 24,
    color: palette.surface,
    lineHeight: 24,
  },
  addButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  receiptContent: {
    gap: spacing.lg,
  },
  receiptOptions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  receiptOption: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    gap: spacing.md,
  },
  receiptOptionActive: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  receiptOptionText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  receiptOptionTextActive: {
    color: palette.primary,
  },
  tipsContent: {
    gap: spacing.lg,
  },
  tipsCarousel: {
    height: 300,
  },
  tipSlide: {
    width: 300,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  tipTitle: {
    ...typography.h3,
    color: palette.text,
    textAlign: 'center',
  },
  tipDescription: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  tipIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  tipIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.border,
  },
  tipIndicatorActive: {
    backgroundColor: palette.primary,
  },
  sampleContent: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  sampleIconContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: palette.infoLight,
  },
  sampleTitle: {
    ...typography.h2,
    color: palette.text,
    textAlign: 'center',
  },
  sampleDescription: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  samplePreview: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  sampleTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  sampleTaskInfo: {
    flex: 1,
  },
  sampleTaskTitle: {
    ...typography.bodyBold,
    color: palette.text,
  },
  sampleTaskDetails: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  sampleActions: {
    width: '100%',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sampleButtonPrimary: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    backgroundColor: palette.primary,
    alignItems: 'center',
  },
  sampleButtonPrimaryText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  sampleButtonSecondary: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
  },
  sampleButtonSecondaryText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
});
