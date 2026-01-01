import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera } from 'react-native-image-picker';
import {
  recognizeProductFromBarcode,
  recognizeProductFromImage,
} from './src/services/productRecognition';
import { useTodoStore, Task } from './src/store';
import { palette, radius, shadow, spacing, typography } from './src/theme';
import { SetupWizard, UserSetupData } from './src/components/SetupWizard';
import { NavigationMenu, NavigationPage } from './src/components/NavigationMenu';
import { HomePage } from './src/components/HomePage';
import { PageTipContainer, resetSessionTipCounter } from './src/components/PageTipContainer';
import { ShoppingListPage } from './src/pages/ShoppingListPage';
import { AccountPage } from './src/pages/AccountPage';
import { PreferencesPage } from './src/pages/PreferencesPage';
import { IntegrationsPage } from './src/pages/IntegrationsPage';
import { ChatPage } from './src/pages/ChatPage';
import { NotificationsPage } from './src/pages/NotificationsPage';
import { ReportsPage } from './src/pages/ReportsPage';
import { TeamPage } from './src/pages/TeamPage';
import { ReceiptScannerPage } from './src/pages/ReceiptScannerPage';
import { BudgetPage } from './src/pages/BudgetPage';
import { FamilyPage } from './src/pages/FamilyPage';
import { CashbackAccountsPage } from './src/pages/CashbackAccountsPage';
import { SavingsDashboardPage } from './src/pages/SavingsDashboardPage';
import { WeeklySummaryPage } from './src/pages/WeeklySummaryPage';
import { MonthlyReportPage } from './src/pages/MonthlyReportPage';
import { InsightsPage } from './src/pages/InsightsPage';
import { TimelinePage } from './src/pages/TimelinePage';
import { TaskAnalyticsPage } from './src/pages/TaskAnalyticsPage';
import { AuditLogPage } from './src/pages/AuditLogPage';
import { SearchPage } from './src/pages/SearchPage';
import { ExportPage } from './src/pages/ExportPage';
import { CalendarPage } from './src/pages/CalendarPage';
import { DocumentsPage } from './src/pages/DocumentsPage';
import { ApprovalsPage } from './src/pages/ApprovalsPage';
import { TemplatesPage } from './src/pages/TemplatesPage';
import { AdminPage } from './src/pages/AdminPage';
import { SyncStatusPage } from './src/pages/SyncStatusPage';
import { FeatureOnboarding } from './src/components/FeatureOnboarding';
import { CompliancePage } from './src/pages/CompliancePage';
import { BrandPreferenceDialog, BrandPreference } from './src/components/BrandPreferenceDialog';
import { StorePreferenceDialog } from './src/components/StorePreferenceDialog';
import { TaskCompletionDialog } from './src/components/TaskCompletionDialog';
import { GeofenceMonitor } from './src/components/GeofenceMonitor';
import { getTaskIcon, ScannerIcon, CameraIcon } from './src/components/TaskTypeIcons';
import { TrashIcon } from './src/components/Icons';
import { BarcodeScanner } from './src/components/BarcodeScanner';
import { DueDatePicker } from './src/components/DueDatePicker';
import { VoiceInput } from './src/components/VoiceInput';
import { ParsedTask } from './src/services/taskParser.service';
import { EllioButtons, EllioToasts } from './src/content/ellioTheme';
import { ChatAssistant } from './src/components/ChatAssistant';

// Helper to detect task type from title
const getTaskType = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('return') || lowerTitle.includes('refund')) {
    return 'returns';
  }
  if (
    lowerTitle.includes('grocery') ||
    lowerTitle.includes('groceries') ||
    lowerTitle.includes('food') ||
    lowerTitle.includes('produce')
  ) {
    return 'groceries';
  }
  if (
    lowerTitle.includes('hardware') ||
    lowerTitle.includes('tool') ||
    lowerTitle.includes('repair')
  ) {
    return 'hardware';
  }
  // New categories
  if (
    lowerTitle.includes('dental') ||
    lowerTitle.includes('dentist') ||
    lowerTitle.includes('tooth') ||
    lowerTitle.includes('teeth')
  ) {
    return 'dental';
  }
  if (
    lowerTitle.includes('chiro') ||
    lowerTitle.includes('chiropractor') ||
    lowerTitle.includes('adjustment') ||
    lowerTitle.includes('spine')
  ) {
    return 'chiropractic';
  }
  if (
    lowerTitle.includes('car') ||
    lowerTitle.includes('auto') ||
    lowerTitle.includes('vehicle') ||
    lowerTitle.includes('oil change') ||
    lowerTitle.includes('mechanic')
  ) {
    return 'automotive';
  }
  if (
    lowerTitle.includes('home repair') ||
    lowerTitle.includes('fix') ||
    lowerTitle.includes('maintenance') ||
    lowerTitle.includes('hvac') ||
    lowerTitle.includes('plumbing')
  ) {
    return 'home-maintenance';
  }
  if (
    lowerTitle.includes('pet') ||
    lowerTitle.includes('vet') ||
    lowerTitle.includes('dog') ||
    lowerTitle.includes('cat')
  ) {
    return 'pet-care';
  }
  if (
    lowerTitle.includes('gym') ||
    lowerTitle.includes('workout') ||
    lowerTitle.includes('fitness') ||
    lowerTitle.includes('exercise')
  ) {
    return 'fitness';
  }
  if (
    lowerTitle.includes('pharmacy') ||
    lowerTitle.includes('prescription') ||
    lowerTitle.includes('medication') ||
    lowerTitle.includes('medicine')
  ) {
    return 'pharmacy';
  }
  if (
    lowerTitle.includes('beauty') ||
    lowerTitle.includes('salon') ||
    lowerTitle.includes('spa') ||
    lowerTitle.includes('cosmetic')
  ) {
    return 'beauty';
  }
  if (
    lowerTitle.includes('retail') ||
    lowerTitle.includes('store') ||
    lowerTitle.includes('shop')
  ) {
    return 'retail';
  }
  if (
    lowerTitle.includes('medical') ||
    lowerTitle.includes('doctor') ||
    lowerTitle.includes('prescription')
  ) {
    return 'medical';
  }
  if (
    lowerTitle.includes('home') ||
    lowerTitle.includes('house') ||
    lowerTitle.includes('cleaning')
  ) {
    return 'home';
  }
  return 'other';
};

const App = (): React.JSX.Element => {
  const {
    tasks,
    addTask,
    toggleComplete,
    removeTask,
    categoriesWithStorePrefs,
    setStorePreferences,
    setUserPreferences,
    attachReceipt,
    updateTask,
  } = useTodoStore();

  // Setup wizard state
  const [setupComplete, setSetupComplete] = useState(false);
  const [userName, setUserName] = useState('User');

  // Load setup status on mount
  useEffect(() => {
    const loadSetupStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('setupComplete');
        const savedName = await AsyncStorage.getItem('userName');
        if (status === 'true') {
          setSetupComplete(true);
        }
        if (savedName) {
          setUserName(savedName);
        }
        
        // Reset tip counter for new session (allows 1 tip per session)
        await resetSessionTipCounter();
      } catch (error) {
        console.log('Error loading setup status:', error);
      }
    };
    loadSetupStatus();
  }, []);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [taskFilter, setTaskFilter] = useState<string | null>(null);

  // Task input state
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [nearbyTasks, setNearbyTasks] = useState<Task[]>([]);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [skuCode, setSkuCode] = useState('');
  const [showBrandDialog, setShowBrandDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [pendingTaskData, setPendingTaskData] = useState<any>(null);
  const [isFirstTask, setIsFirstTask] = useState(true);
  const [pendingCategory, setPendingCategory] = useState<string>('other');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [dueDateLabel, setDueDateLabel] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingFeature, setOnboardingFeature] = useState<
    'voice' | 'camera' | 'barcode' | 'receipt'
  >('voice');

  // Check if first-time user for features
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const voiceOnboarded = await AsyncStorage.getItem('onboarding_voice');
        const cameraOnboarded = await AsyncStorage.getItem('onboarding_camera');
        const barcodeOnboarded = await AsyncStorage.getItem('onboarding_barcode');
        // Store onboarding flags for later use
      } catch (error) {
        console.log('Error checking onboarding:', error);
      }
    };
    if (setupComplete) {
      checkOnboarding();
    }
  }, [setupComplete]);

  // Activity log state
  const [activityLog, setActivityLog] = useState<
    Array<{ id: string; action: string; timestamp: number; taskTitle: string }>
  >([]);

  const handleSetupComplete = async (userData: UserSetupData) => {
    setUserName(userData.name);
    setSetupComplete(true);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('setupComplete', 'true');
      await AsyncStorage.setItem('userName', userData.name);
    } catch (error) {
      console.log('Error saving setup status:', error);
    }

    // Save user preferences to store
    setUserPreferences({
      goals: userData.goals,
      budgetAmount: userData.budgetAmount,
      budgetPeriod: userData.budgetPeriod,
      creditCards: userData.creditCards,
      aiSuggestionsEnabled: true,
      dealAlertsEnabled: userData.goals.includes('save-money'),
      priceComparisonEnabled: userData.goals.includes('save-money'),
      loyaltyProgramsEnabled: userData.goals.includes('credit-points'),
      autoReceiptUploadEnabled: userData.goals.includes('budget'),
      geofencingEnabled: true,
      autoCompleteRadius: 100,
    });

    // Show welcome message based on goals
    const goalMessages = {
      'save-money': 'deal alerts and price comparisons',
      'credit-points': 'smart card recommendations',
      budget: 'budget tracking and spending alerts',
      collaborate: 'team collaboration features',
      organize: 'advanced organization tools',
      efficiency: 'smart routing and time optimization',
    };

    const features = userData.goals.map(g => goalMessages[g]).join(', ');
    Alert.alert(
      `Welcome, ${userData.name}!`,
      `Your app is configured with ${features}. Let's get started!`
    );
  };

  const handleAdd = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter what you need');
      return;
    }

    const taskData = {
      title: title.trim(),
      note: note.trim() || undefined,
      quantity: parseInt(quantity, 10) || 1,
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      imageUri,
      productBrand: skuCode || undefined,
    };

    // Detect task category
    const category = getTaskType(taskData.title);

    // Show brand preference dialog for first few tasks
    if (isFirstTask && tasks.length < 5) {
      setPendingTaskData(taskData);
      setPendingCategory(category);
      setShowBrandDialog(true);
      return;
    }

    // Check if user needs to set store preferences for this category
    if (!categoriesWithStorePrefs.has(category)) {
      setPendingTaskData(taskData);
      setPendingCategory(category);
      setShowStoreDialog(true);
      return;
    }

    // Add task directly
    addTask(taskData);

    // Add to activity log
    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        action: 'added',
        timestamp: Date.now(),
        taskTitle: title.trim(),
      },
      ...prev.slice(0, 9), // Keep last 10 activities
    ]);

    // Reset form
    setTitle('');
    setNote('');
    setQuantity('1');
    setDueDate('');
    setDueDateLabel('');
    setAssignedTo('');
    setImageUri(undefined);
    setSkuCode('');

    Alert.alert('Success', 'Task added successfully');
  };

  const handleBrandPreferenceSelect = (preference: BrandPreference) => {
    if (pendingTaskData) {
      // Add brand preference to task
      const taskWithBrand = {
        ...pendingTaskData,
        productBrand: preference.preferredBrand || pendingTaskData.productBrand,
        note: preference.specificDetails
          ? `${pendingTaskData.note ? pendingTaskData.note + '\n' : ''}${
              preference.specificDetails
            }`
          : pendingTaskData.note,
      };

      // Check if store preferences dialog should be shown
      if (!categoriesWithStorePrefs.has(pendingCategory)) {
        // Save task data and show store dialog
        setPendingTaskData(taskWithBrand);
        setShowBrandDialog(false);
        setShowStoreDialog(true);
        setIsFirstTask(false);
        return;
      }

      addTask(taskWithBrand);

      // Add to activity log
      setActivityLog(prev => [
        {
          id: Date.now().toString(),
          action: 'added',
          timestamp: Date.now(),
          taskTitle: pendingTaskData.title,
        },
        ...prev.slice(0, 9),
      ]);

      // Reset form
      setTitle('');
      setNote('');
      setQuantity('1');
      setDueDate('');
      setAssignedTo('');
      setImageUri(undefined);
      setSkuCode('');
      setPendingTaskData(null);
      setShowBrandDialog(false);
      setIsFirstTask(false);

      Alert.alert('Success', 'Task added with your preferences!');
    }
  };

  const handleStorePreferenceSubmit = (stores: string[]) => {
    // Save store preferences for this category
    setStorePreferences(pendingCategory, stores);

    // Add the pending task
    if (pendingTaskData) {
      addTask(pendingTaskData);

      // Add to activity log
      setActivityLog(prev => [
        {
          id: Date.now().toString(),
          action: 'added',
          timestamp: Date.now(),
          taskTitle: pendingTaskData.title,
        },
        ...prev.slice(0, 9),
      ]);

      // Reset form
      setTitle('');
      setNote('');
      setQuantity('1');
      setDueDate('');
      setAssignedTo('');
      setImageUri(undefined);
      setSkuCode('');
      setPendingTaskData(null);
      setShowStoreDialog(false);

      Alert.alert('Success', 'Task added with your store preferences!');
    }
  };

  const handleStorePreferenceSkip = () => {
    // Add the task without setting store preferences
    if (pendingTaskData) {
      addTask(pendingTaskData);

      // Add to activity log
      setActivityLog(prev => [
        {
          id: Date.now().toString(),
          action: 'added',
          timestamp: Date.now(),
          taskTitle: pendingTaskData.title,
        },
        ...prev.slice(0, 9),
      ]);

      // Reset form
      setTitle('');
      setNote('');
      setQuantity('1');
      setDueDate('');
      setAssignedTo('');
      setImageUri(undefined);
      setSkuCode('');
      setPendingTaskData(null);
      setShowStoreDialog(false);

      Alert.alert('Success', 'Task added successfully');
    }
  };

  const handleTasksNearby = (nearbyTaskList: Task[]) => {
    if (nearbyTaskList.length > 0) {
      setNearbyTasks(nearbyTaskList);
      setShowCompletionDialog(true);
    }
  };

  const handleTaskComplete = (taskId: string, receiptUri?: string) => {
    if (receiptUri) {
      attachReceipt(taskId, receiptUri);
    }
    updateTask(taskId, {
      completed: true,
      completedAt: Date.now(),
    });

    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        action: 'completed',
        timestamp: Date.now(),
        taskTitle: tasks.find(t => t.id === taskId)?.title || 'Task',
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleTaskSkip = (taskId: string) => {
    // Remove from nearby tasks but don't mark complete
    setNearbyTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleToggle = (task: Task) => {
    toggleComplete(task.id);
    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        action: task.completed ? 'uncompleted' : 'completed',
        timestamp: Date.now(),
        taskTitle: task.title,
      },
      ...prev.slice(0, 9),
    ]);
  };

  const handleDelete = (task: Task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeTask(task.id);
          setActivityLog(prev => [
            {
              id: Date.now().toString(),
              action: 'deleted',
              timestamp: Date.now(),
              taskTitle: task.title,
            },
            ...prev.slice(0, 9),
          ]);
        },
      },
    ]);
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    // After showing onboarding, trigger the actual feature
    setTimeout(() => {
      if (onboardingFeature === 'voice') {
        setShowVoiceInput(true);
      } else if (onboardingFeature === 'barcode') {
        setShowBarcodeScanner(true);
      }
      // Camera already triggered via handleCamera
    }, 300);
  };

  const handleVoiceButton = async () => {
    const onboarded = await AsyncStorage.getItem('onboarding_voice');
    if (!onboarded) {
      setOnboardingFeature('voice');
      setShowOnboarding(true);
      await AsyncStorage.setItem('onboarding_voice', 'true');
    } else {
      setShowVoiceInput(true);
    }
  };

  const handleCamera = async () => {
    const onboarded = await AsyncStorage.getItem('onboarding_camera');
    if (!onboarded) {
      setOnboardingFeature('camera');
      setShowOnboarding(true);
      await AsyncStorage.setItem('onboarding_camera', 'true');
      return;
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: false,
        includeBase64: true,
      },
      async response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Camera error');
          return;
        }
        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          setImageUri(asset.uri);

          // Auto-recognize product and search stores
          if (asset.base64) {
            try {
              const result = await recognizeProductFromImage(asset.base64);
              if (result) {
                // Auto-fill product details
                setTitle(result.product.name);

                // Build note with brand, size, and description
                let noteText = '';
                if (result.product.brand) {
                  noteText += `Brand: ${result.product.brand}`;
                }
                if (result.product.size) {
                  noteText += noteText
                    ? `\nSize: ${result.product.size}`
                    : `Size: ${result.product.size}`;
                }
                if (result.product.description) {
                  noteText += noteText
                    ? `\n${result.product.description}`
                    : result.product.description;
                }
                if (noteText) {
                  setNote(noteText);
                }

                // Auto-fill quantity if detected
                if (result.product.quantity) {
                  setQuantity(result.product.quantity.toString());
                  console.log(`📦 Quantity auto-filled: ${result.product.quantity}`);
                }

                if (result.product.barcode) {
                  setSkuCode(result.product.barcode);
                }

                // Show available stores
                if (result.stores.length > 0) {
                  const storeList = result.stores
                    .filter(s => s.inStock)
                    .slice(0, 3)
                    .map(
                      s =>
                        `${s.storeName}${s.distance ? ` (${s.distance.toFixed(1)}mi)` : ''}${
                          s.price ? ` - $${s.price.toFixed(2)}` : ''
                        }`
                    )
                    .join('\n');

                  Alert.alert(
                    'Product Found!',
                    `${result.product.name}${
                      result.product.size ? ' - ' + result.product.size : ''
                    }${
                      result.product.quantity ? '\nQuantity: ' + result.product.quantity : ''
                    }\n\nAvailable at:\n${storeList}`,
                    [{ text: 'OK' }]
                  );
                }
              }
            } catch (error) {
              console.error('Product recognition error:', error);
            }
          }
        }
      }
    );
  };

  const handleBarcodeScanned = async (barcode: string) => {
    console.log('📊 Barcode scanned:', barcode);
    setSkuCode(barcode);

    // Auto-recognize product
    try {
      const result = await recognizeProductFromBarcode(barcode);
      if (result) {
        // Auto-fill all fields
        setTitle(result.product.name);
        if (result.product.brand) {
          setNote(
            `Brand: ${result.product.brand}${
              result.product.description ? '\n' + result.product.description : ''
            }`
          );
        }

        // Show available stores
        if (result.stores.length > 0) {
          const storeList = result.stores
            .filter(s => s.inStock)
            .slice(0, 3)
            .map(
              s =>
                `${s.storeName}${s.distance ? ` (${s.distance.toFixed(1)}mi)` : ''}${
                  s.price ? ` - $${s.price.toFixed(2)}` : ''
                }`
            )
            .join('\n');

          Alert.alert('Product Found!', `${result.product.name}\n\nAvailable at:\n${storeList}`, [
            { text: 'OK' },
          ]);
        }
      } else {
        Alert.alert(
          'Product Not Found',
          `Barcode ${barcode} not recognized. Please enter details manually.`
        );
      }
    } catch (error) {
      console.error('Product recognition error:', error);
      Alert.alert('Error', 'Failed to recognize product. Please try again.');
    }
  };

  const handleDueDateSelect = (date: Date, label: string) => {
    setDueDate(date.getTime().toString());
    setDueDateLabel(label);
  };

  const handleVoiceTasksGenerated = (parsedTasks: ParsedTask[]) => {
    console.log('🎤 Adding tasks from voice input:', parsedTasks);

    // Add each parsed task
    parsedTasks.forEach(parsedTask => {
      const newTask: Task = {
        id: Date.now().toString() + Math.random(),
        title: parsedTask.title,
        completed: false,
        category: parsedTask.category.toLowerCase(),
        priority: parsedTask.priority,
        createdAt: Date.now(),
        dueDate: parsedTask.dueDate?.getTime(),
        note: parsedTask.note,
      };

      addTask(newTask);

      setActivityLog(prev => [
        {
          id: Date.now().toString(),
          action: 'added',
          timestamp: Date.now(),
          taskTitle: newTask.title,
        },
        ...prev.slice(0, 9),
      ]);
    });

    // Show success message
    Alert.alert(
      EllioToasts.added,
      `Added ${parsedTasks.length} task${parsedTasks.length > 1 ? 's' : ''}`,
      [{ text: EllioButtons.gotIt }]
    );

    setShowVoiceInput(false);
  };

  const handleScanner = async () => {
    const onboarded = await AsyncStorage.getItem('onboarding_barcode');
    if (!onboarded) {
      setOnboardingFeature('barcode');
      setShowOnboarding(true);
      await AsyncStorage.setItem('onboarding_barcode', 'true');
    } else {
      setShowBarcodeScanner(true);
    }
  };

  const _handleOldScanner = async () => {
    // Placeholder for old barcode scanner with auto-fill
    Alert.alert('Scanner', 'Scan a barcode to auto-fill product details', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Simulate Scan',
        onPress: async () => {
          // Simulate scanning a real barcode (Coca-Cola example)
          const mockBarcode = '5449000000996'; // Coca-Cola barcode
          setSkuCode(mockBarcode);

          // Auto-recognize product
          try {
            const result = await recognizeProductFromBarcode(mockBarcode);
            if (result) {
              // Auto-fill all fields
              setTitle(result.product.name);
              if (result.product.brand) {
                setNote(
                  `Brand: ${result.product.brand}${
                    result.product.description ? '\n' + result.product.description : ''
                  }`
                );
              }

              // Show available stores
              if (result.stores.length > 0) {
                const storeList = result.stores
                  .filter(s => s.inStock)
                  .slice(0, 3)
                  .map(
                    s =>
                      `${s.storeName}${s.distance ? ` (${s.distance.toFixed(1)}mi)` : ''}${
                        s.price ? ` - $${s.price.toFixed(2)}` : ''
                      }`
                  )
                  .join('\n');

                Alert.alert(
                  'Product Found!',
                  `${result.product.name}\n\nAvailable at:\n${storeList}`,
                  [{ text: 'OK' }]
                );
              }
            } else {
              // Fallback to generic product
              setTitle(`Product ${mockBarcode}`);
            }
          } catch (error) {
            console.error('Barcode recognition error:', error);
            setTitle(`Product ${mockBarcode}`);
          }
        },
      },
    ]);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  // Show setup wizard if not complete
  if (!setupComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
        <SetupWizard onComplete={handleSetupComplete} />
      </SafeAreaView>
    );
  }

  // Show different pages based on navigation
  if (currentPage !== 'home') {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
        <NavigationMenu currentPage={currentPage} onNavigate={setCurrentPage} userName={userName} />
        <PageTipContainer currentPage={currentPage}>
        {currentPage === 'account' && <AccountPage />}
        {currentPage === 'preferences' && <PreferencesPage />}
        {currentPage === 'integrations' && <IntegrationsPage />}
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'notifications' && <NotificationsPage />}
        {currentPage === 'reports' && <ReportsPage />}
        {currentPage === 'team' && <TeamPage />}
        {currentPage === 'receipts' && <ReceiptScannerPage />}
        {currentPage === 'budget' && <BudgetPage />}
        {currentPage === 'family' && <FamilyPage />}
        {currentPage === 'cashback' && <CashbackAccountsPage />}
        {currentPage === 'savingsdashboard' && <SavingsDashboardPage />}
        {currentPage === 'weeklysummary' && <WeeklySummaryPage />}
        {currentPage === 'monthlyreport' && <MonthlyReportPage />}
        {currentPage === 'insights' && <InsightsPage />}
        {currentPage === 'timeline' && <TimelinePage />}
        {currentPage === 'analytics' && <TaskAnalyticsPage />}
        {currentPage === 'auditlog' && <AuditLogPage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'export' && <ExportPage />}
        {currentPage === 'calendar' && <CalendarPage />}
        {currentPage === 'documents' && <DocumentsPage />}
        {currentPage === 'approvals' && <ApprovalsPage />}
        {currentPage === 'templates' && <TemplatesPage />}
        {currentPage === 'admin' && <AdminPage />}
        {currentPage === 'syncstatus' && <SyncStatusPage />}
        {currentPage === 'compliance' && <CompliancePage />}
        {currentPage === 'shoppinglist' && <ShoppingListPage onNavigate={setCurrentPage} />}
        {currentPage === 'help' && (
          <View style={styles.placeholderPage}>
            <Text style={styles.placeholderText}>❓</Text>
            <Text style={styles.placeholderTitle}>Help & Support</Text>
            <Text style={styles.placeholderSubtitle}>Documentation and support coming soon</Text>
          </View>
        </PageTipContainer>
      </SafeAreaView>
    );
  }

  // Home page
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.background} />
      <NavigationMenu currentPage={currentPage} onNavigate={setCurrentPage} userName={userName} />

      <PageTipContainer currentPage={currentPage}>      <NavigationMenu currentPage={currentPage} onNavigate={setCurrentPage} userName={userName} />

      <HomePage tasks={tasks} userName={userName} onNavigate={setCurrentPage} />

      {/* Add Task Section - Floating above home */}
      <View style={styles.addTaskSection}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Add Task Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>What do you need?</Text>

            {/* Scanner and Camera Buttons */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction} onPress={handleScanner}>
                <ScannerIcon size={24} color={palette.primary} />
                <Text style={styles.quickActionText}>Scan SKU</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={handleCamera}>
                <CameraIcon size={24} color={palette.primary} />
                <Text style={styles.quickActionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={handleVoiceButton}>
                <Text style={styles.microphoneIcon}>🎤</Text>
                <Text style={styles.quickActionText}>Add by voice</Text>
              </TouchableOpacity>
            </View>

            {skuCode ? (
              <View style={styles.skuBadge}>
                <Text style={styles.skuBadgeText}>SKU: {skuCode}</Text>
                <TouchableOpacity onPress={() => setSkuCode('')}>
                  <Text style={styles.skuClear}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {imageUri ? (
              <View style={styles.imagePreview}>
                <View style={styles.imagePreviewContent}>
                  <CameraIcon size={16} color={palette.textSecondary} />
                  <Text style={styles.imagePreviewText}>Photo attached</Text>
                </View>
                <TouchableOpacity onPress={() => setImageUri(undefined)}>
                  <Text style={styles.imageRemove}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Item name or description"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={palette.textTertiary}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
              placeholderTextColor={palette.textTertiary}
            />

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.fieldLabel}>Quantity</Text>
                <TextInput
                  style={styles.inputSmall}
                  placeholder="1"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                  placeholderTextColor={palette.textTertiary}
                />
              </View>
              <View style={styles.formHalf}>
                <Text style={styles.fieldLabel}>Due Date</Text>
                <TouchableOpacity
                  style={styles.inputSmall}
                  onPress={() => setShowDueDatePicker(true)}
                >
                  <Text style={dueDateLabel ? styles.inputText : styles.inputPlaceholder}>
                    {dueDateLabel || 'Select date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Assign To</Text>
              <TextInput
                style={styles.input}
                placeholder="Team member name"
                value={assignedTo}
                onChangeText={setAssignedTo}
                placeholderTextColor={palette.textTertiary}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
              <Text style={styles.primaryButtonText}>{EllioButtons.add}</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Log */}
          {activityLog.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                {activityLog.slice(0, 5).map(activity => (
                  <View key={activity.id} style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                      {activity.action === 'added' && <Text style={styles.activityIcon}>➕</Text>}
                      {activity.action === 'completed' && (
                        <Text style={styles.activityIcon}>✅</Text>
                      )}
                      {activity.action === 'uncompleted' && (
                        <Text style={styles.activityIcon}>↩️</Text>
                      )}
                      {activity.action === 'deleted' && (
                        <TrashIcon size={18} color={palette.error} />
                      )}
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityText}>
                        <Text style={styles.activityAction}>{activity.action}</Text>{' '}
                        {activity.taskTitle}
                      </Text>
                      <Text style={styles.activityTime}>
                        {formatRelativeTime(activity.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Tasks List */}
          <View style={styles.card}>
            <View style={styles.tasksHeader}>
              <Text style={styles.cardTitle}>Tasks ({pendingCount} pending)</Text>
              {taskFilter && (
                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={() => setTaskFilter(null)}
                >
                  <Text style={styles.clearFilterText}>Clear Filter ✕</Text>
                </TouchableOpacity>
              )}
            </View>
            {tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No tasks yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first task above</Text>
              </View>
            ) : (
              (() => {
                // Apply filter based on task type
                const filteredTasks = taskFilter
                  ? tasks.filter(task => {
                      if (task.completed) {
                        return false;
                      }
                      return getTaskType(task.title) === taskFilter;
                    })
                  : tasks;

                if (filteredTasks.length === 0) {
                  return (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>No tasks in this category</Text>
                      <Text style={styles.emptyStateSubtext}>Try a different filter</Text>
                    </View>
                  );
                }

                return filteredTasks.map(task => {
                  const TaskIcon = getTaskIcon(task.title);
                  return (
                    <View
                      key={task.id}
                      style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
                    >
                      <TouchableOpacity
                        style={styles.taskCheckbox}
                        onPress={() => handleToggle(task)}
                      >
                        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                          {task.completed && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                      </TouchableOpacity>

                      <View style={styles.taskIcon}>
                        <TaskIcon size={24} color={palette.primary} />
                      </View>

                      <View style={styles.taskContent}>
                        <Text
                          style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}
                        >
                          {task.title}
                        </Text>
                        {task.note && <Text style={styles.taskNote}>{task.note}</Text>}
                        <View style={styles.taskMeta}>
                          {task.quantity && task.quantity > 1 && (
                            <Text style={styles.taskMetaItem}>Qty: {task.quantity}</Text>
                          )}
                          {task.dueDate && (
                            <Text style={styles.taskMetaItem}>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(task)}
                      >
                        <Text style={styles.deleteButtonText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  );
                });
              })()
            )}
          </View>
        </ScrollView>
      </View>

      {/* Brand Preference Dialog */}
      <BrandPreferenceDialog
        visible={showBrandDialog}
        itemName={title}
        category={
          pendingTaskData
            ? (() => {
                const lowerTitle = pendingTaskData.title.toLowerCase();
                if (lowerTitle.includes('return') || lowerTitle.includes('refund')) {
                  return 'returns';
                }
                if (
                  lowerTitle.includes('grocery') ||
                  lowerTitle.includes('groceries') ||
                  lowerTitle.includes('food')
                ) {
                  return 'groceries';
                }
                if (lowerTitle.includes('hardware') || lowerTitle.includes('tool')) {
                  return 'hardware';
                }
                if (lowerTitle.includes('retail') || lowerTitle.includes('store')) {
                  return 'retail';
                }
                if (lowerTitle.includes('medical') || lowerTitle.includes('pharmacy')) {
                  return 'medical';
                }
                if (lowerTitle.includes('home') || lowerTitle.includes('house')) {
                  return 'home';
                }
                return 'other';
              })()
            : 'other'
        }
        onSelect={handleBrandPreferenceSelect}
        onCancel={() => {
          // Add task without brand preference
          if (pendingTaskData) {
            addTask(pendingTaskData);
            setActivityLog(prev => [
              {
                id: Date.now().toString(),
                action: 'added',
                timestamp: Date.now(),
                taskTitle: pendingTaskData.title,
              },
              ...prev.slice(0, 9),
            ]);
          }
          setTitle('');
          setNote('');
          setQuantity('1');
          setDueDate('');
          setAssignedTo('');
          setImageUri(undefined);
          setSkuCode('');
          setPendingTaskData(null);
          setShowBrandDialog(false);
          setIsFirstTask(false);
        }}
      />

      {/* Store Preference Dialog */}
      <StorePreferenceDialog
        visible={showStoreDialog}
        category={pendingCategory}
        onSubmit={handleStorePreferenceSubmit}
        onSkip={handleStorePreferenceSkip}
      />

      {/* Task Completion Dialog */}
      <TaskCompletionDialog
        visible={showCompletionDialog}
        tasks={nearbyTasks}
        onComplete={handleTaskComplete}
        onSkip={handleTaskSkip}
        onDismiss={() => {
          setShowCompletionDialog(false);
          setNearbyTasks([]);
        }}
        requireReceipt={false}
      />

      {/* Barcode Scanner */}
      <BarcodeScanner
        visible={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Due Date Picker */}
      <DueDatePicker
        visible={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        onSelect={handleDueDateSelect}
      />

      {/* Voice Input */}
      <VoiceInput
        visible={showVoiceInput}
        onClose={() => setShowVoiceInput(false)}
        onTasksGenerated={handleVoiceTasksGenerated}
      />

      {/* Geofence Monitor */}
      {setupComplete && <GeofenceMonitor onTasksNearby={handleTasksNearby} />}

      {/* Chat Assistant */}
      {setupComplete && (
        <ChatAssistant
          context={{
            currentPage: currentPage,
            userName: userName,
          }}
          tasks={tasks}
        />
      )}

      {/* Feature Onboarding */}
      <FeatureOnboarding
        visible={showOnboarding}
        onClose={handleOnboardingClose}
        feature={onboardingFeature}
      />
      </PageTipContainer>
    </SafeAreaView>
  );
};

// Helper function for relative time
const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) {
    return 'just now';
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  flex: {
    flex: 1,
  },
  addTaskSection: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  hero: {
    backgroundColor: palette.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroTitle: {
    ...typography.h3,
    color: palette.surface,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: palette.surface,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.secondary,
    color: palette.labelOnDark,
  },
  card: {
    backgroundColor: palette.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.card,
    ...shadow,
  },
  cardTitle: {
    ...typography.subtitle,
    color: palette.text,
    marginBottom: spacing.md,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clearFilterButton: {
    backgroundColor: palette.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.button,
  },
  clearFilterText: {
    ...typography.secondary,
    color: palette.text,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: palette.infoLight,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  quickActionText: {
    ...typography.body,
    color: palette.primary,
  },
  microphoneIcon: {
    fontSize: 24,
  },
  skuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.successLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.badge,
    marginBottom: spacing.md,
  },
  skuBadgeText: {
    ...typography.body,
    color: palette.success,
  },
  skuClear: {
    ...typography.bodyBold,
    color: palette.success,
    fontSize: 20,
  },
  imagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.infoLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.badge,
    marginBottom: spacing.md,
  },
  imagePreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  imagePreviewText: {
    ...typography.body,
    color: palette.primary,
  },
  imageRemove: {
    ...typography.bodyBold,
    color: palette.primary,
    fontSize: 20,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    color: palette.text,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  formHalf: {
    flex: 1,
  },
  formField: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  inputSmall: {
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: palette.text,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  activityList: {
    gap: spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  activityIconContainer: {
    width: 20,
    alignItems: 'center',
  },
  activityIcon: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    ...typography.body,
    color: palette.text,
  },
  activityAction: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  activityTime: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    ...typography.subtitle,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  taskCardCompleted: {
    opacity: 0.6,
  },
  taskCheckbox: {
    padding: spacing.xs,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: palette.success,
    borderColor: palette.success,
  },
  checkmark: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  taskIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    ...typography.body,
    color: palette.text,
    marginBottom: 2,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: palette.textSecondary,
  },
  taskNote: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  taskMetaItem: {
    ...typography.secondary,
    color: palette.textTertiary,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 28,
    color: palette.error,
    lineHeight: 28,
  },
  placeholderPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  placeholderText: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  placeholderTitle: {
    ...typography.h2,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  placeholderSubtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
  inputText: {
    ...typography.body,
    color: palette.text,
  },
  inputPlaceholder: {
    ...typography.body,
    color: palette.textTertiary,
  },
});

export default App;
