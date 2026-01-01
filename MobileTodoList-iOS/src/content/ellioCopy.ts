/**
 * ELLIO CENTRALIZED COPY
 *
 * All user-facing text must use this file.
 * Never hardcode strings in components.
 *
 * Voice: Calm, warm, competent, non-urgent
 * Reference: docs/ELLIO_VOICE.md
 */

// ============================================================================
// TOOLTIPS (ⓘ)
// ============================================================================

export const EllioTooltips = {
  // Home - Next up
  nextUp: {
    title: 'Next up',
    body: "This is the one thing Ellio thinks matters most right now.",
    footnote: "Not all at once—everything else can wait.",
    buttons: { primary: 'Got it' },
  },

  // Add task
  addTask: {
    title: 'Add a task',
    body: "Keep it simple. A name is enough to start. You can add details later, if you want.",
    buttons: { primary: 'Got it' },
  },

  // Voice input
  voiceInput: {
    title: 'Voice input',
    body: "Say something like: 'Buy milk at Kroger tomorrow.' Ellio fills in the details.",
    footnote: "Your device's speech recognition is used. No audio is stored.",
    buttons: { primary: 'Try it', secondary: 'Not now' },
  },

  // Scanner
  scanner: {
    title: 'Barcode scanner',
    body: "Scan product barcodes to add items fast. Ellio looks up product info automatically.",
    buttons: { primary: 'Got it' },
  },

  // Camera
  camera: {
    title: 'Photo recognition',
    body: "Take a photo of a product and Ellio will try to identify it.",
    footnote: "Camera is only used when you tap this icon.",
    buttons: { primary: 'Got it' },
  },

  // Shopping list
  shoppingList: {
    title: 'Shopping list',
    body: "All your 'Buy' tasks in one place, organized by store.",
    buttons: { primary: 'Got it' },
  },

  // Money saved
  moneySaved: {
    title: 'Money saved',
    body: "Ellio compares prices on your receipts to typical prices in your area.",
    footnote: "Location comes from store info printed on receipts—not GPS.",
    buttons: { primary: 'Got it', secondary: 'How it works' },
  },

  // Budget
  budget: {
    title: 'Budget',
    body: "Ellio suggests budget categories based on your scanned receipts. You can edit any category anytime.",
    buttons: { primary: 'Got it' },
  },

  // Cashback
  cashback: {
    title: 'Cashback',
    body: "Ellio estimates cashback based on retailer programs and your purchase history.",
    footnote: "Actual amounts may vary by store and date.",
    buttons: { primary: 'Got it', secondary: 'Link accounts' },
  },

  // Savings goal
  savingsGoal: {
    title: 'Savings goal',
    body: "Set a weekly goal and Ellio tracks how you're doing. No pressure—just feedback.",
    buttons: { primary: 'Got it' },
  },
};

// ============================================================================
// ONBOARDING
// ============================================================================

export const EllioOnboarding = {
  // Screen 1: Welcome
  welcome: {
    title: 'Welcome to Ellio',
    body: "One next step at a time.\nAdd what you need—Ellio keeps it calm.",
    button: 'Get started',
  },

  // Screen 2: Not all at once
  notAllAtOnce: {
    title: 'Not all at once',
    body: "Ellio focuses on what's next.\nEverything else can wait.",
    button: 'Continue',
  },

  // Screen 3: Features
  features: {
    title: 'A few things Ellio can do',
    items: [
      'Scan receipts to track spending',
      'Voice-add tasks naturally',
      "Suggest what's next",
    ],
    button: 'Start using Ellio',
  },

  // Permission pre-prompts
  permissions: {
    microphone: {
      title: 'Voice input',
      body: "Voice input lets you add tasks by speaking.\n\nEllio uses your device's speech recognition.\nNo audio is stored.",
      buttons: { primary: 'Continue', secondary: 'Not now' },
    },
    camera: {
      title: 'Camera',
      body: "Barcode scanning and photo recognition help you add tasks faster.\n\nCamera is only used when you tap the icons.",
      buttons: { primary: 'Continue', secondary: 'Not now' },
    },
    location: {
      title: 'Location (receipts only)',
      body: "Ellio finds your approximate area (county, ZIP) from store info printed on receipts.\n\nNo GPS. No location tracking. No history.",
      buttons: { primary: 'Continue', secondary: 'Not now' },
    },
  },
};

// ============================================================================
// LABELS
// ============================================================================

export const EllioLabels = {
  // Calm replacements for stressful words
  when: 'When', // instead of "Due Date"
  with: 'With', // instead of "Assign To"
  next: 'Next', // instead of "Tasks" (upcoming)
  list: 'List', // instead of "All Tasks"
  
  // Actions
  add: 'Add',
  save: 'Save',
  edit: 'Edit',
  remove: 'Remove', // instead of "Delete"
  done: 'Done',
  undo: 'Undo',
  notNow: 'Not now', // instead of "Cancel"
  maybeLater: 'Maybe later', // instead of "Skip"
  gotIt: 'Got it',
  continue: 'Continue',
  viewAll: 'View all',
  showLess: 'Show less',
  addDetails: 'Add details',
  
  // Navigation
  home: 'Home',
  timeline: 'Timeline',
  budget: 'Budget',
  insights: 'Insights',
  receipts: 'Receipts',
  family: 'Family',
  messages: 'Messages',
  preferences: 'Preferences', // instead of "Settings"
  
  // Empty states
  allClear: 'All clear.',
  noTasksYet: "Add one thing you'd like to handle next.",
  
  // Date chips
  today: 'Today',
  tomorrow: 'Tomorrow',
  pickDate: 'Pick date',
  
  // Loading
  oneMoment: 'One moment...',
};

// ============================================================================
// MESSAGES
// ============================================================================

export const EllioMessages = {
  // Success toasts (1-2 words max)
  saved: 'Saved.',
  added: 'Added.',
  removed: 'Removed.',
  allSet: 'All set.',
  receiptSaved: 'Receipt saved.',
  youreGood: "You're good.",
  
  // Progress/Goal
  onTrack: "You're on track.",
  halfway: 'Halfway there.',
  almostThere: 'Almost there.',
  
  // Milestones (use sparingly)
  milestone50Receipts: '50 receipts scanned. Price insights are getting sharper.',
  
  // Empty states
  emptyHome: {
    title: 'All clear.',
    body: "Add one thing you'd like to handle next.",
  },
  emptyBudget: {
    title: 'No budget set yet.',
    body: 'Scan a few receipts and Ellio will suggest one.',
  },
  emptyReceipts: {
    title: 'Receipts unlock price insights.',
    body: 'Tap here to scan your first one.',
  },
  emptyCashback: {
    title: 'No accounts linked yet.',
    body: 'Link retailer accounts to track cashback.',
  },
  emptyFamily: {
    title: 'Just you for now.',
    body: "Invite family members when you're ready.",
  },
  emptyTimeline: {
    title: 'Your timeline starts now.',
    body: "Add a task and it'll show up here.",
  },
  
  // Data transparency
  budgetSource: "Budget suggestions are based on your past spending from receipts you've scanned.\n\nYou can edit any category anytime.",
  cashbackSource: "Cashback is estimated based on retailer programs and your purchase history.\n\nActual amounts may vary by store and date.",
  priceInsightSource: "Price comparisons use typical prices in your area (county and ZIP) from public data sources.\n\nEstimates are updated monthly.",
  automationBehavior: "Ellio groups and summarizes tasks to reduce effort—not add pressure.\n\nYou can adjust automation in Preferences.",
};

// ============================================================================
// ERRORS
// ============================================================================

export const EllioErrors = {
  // Network
  couldntConnect: {
    title: "Couldn't connect",
    body: "Check your internet and try again.",
    buttons: { primary: 'Try again', secondary: 'Not now' },
  },
  
  // Save failures
  couldntSave: {
    title: "Couldn't save.",
    body: "Nothing was lost. Try again in a moment.",
    buttons: { primary: 'Try again' },
  },
  
  // Permissions
  microphoneNeeded: {
    title: 'Microphone permission is needed.',
    body: "Enable it in Settings whenever you're ready.",
    buttons: { primary: 'Open Settings', secondary: 'Not now' },
  },
  cameraNeeded: {
    title: 'Camera permission is needed.',
    body: "Enable it in Settings whenever you're ready.",
    buttons: { primary: 'Open Settings', secondary: 'Not now' },
  },
  
  // Voice input
  didntCatchThat: {
    title: "Didn't catch that.",
    body: "Try again?",
    buttons: { primary: 'Try again', secondary: 'Not now' },
  },
  
  // Scanner
  couldntReadBarcode: {
    title: "Couldn't read barcode.",
    body: "Try holding your phone steady and make sure the code is in frame.",
    buttons: { primary: 'Try again' },
  },
  
  // Camera
  couldntRecognizeProduct: {
    title: "Couldn't recognize that.",
    body: "You can still add it manually.",
    buttons: { primary: 'Add manually', secondary: 'Try again' },
  },
};

// ============================================================================
// EMPTY STATES (FULL)
// ============================================================================

export const EllioEmptyStates = {
  home: {
    icon: '✓',
    title: 'All clear.',
    body: "Add one thing you'd like to handle next.",
    action: { label: 'Add', onPress: 'openAddTask' },
  },
  
  shoppingList: {
    icon: '🛒',
    title: 'No shopping items yet.',
    body: "Add a task that starts with 'Buy' and it'll show up here.",
    action: { label: 'Add item', onPress: 'openAddTask' },
  },
  
  timeline: {
    icon: '📅',
    title: 'Your timeline starts now.',
    body: "Add a task and it'll show up here.",
    action: { label: 'Add', onPress: 'openAddTask' },
  },
  
  budget: {
    icon: '💰',
    title: 'No budget set yet.',
    body: 'Scan a few receipts and Ellio will suggest one.',
    action: { label: 'Scan receipt', onPress: 'openScanner' },
  },
  
  receipts: {
    icon: '🧾',
    title: 'Receipts unlock price insights.',
    body: 'Tap here to scan your first one.',
    action: { label: 'Scan receipt', onPress: 'openScanner' },
  },
  
  cashback: {
    icon: '💵',
    title: 'No accounts linked yet.',
    body: 'Link retailer accounts to track cashback.',
    action: { label: 'Link accounts', onPress: 'openIntegrations' },
  },
  
  family: {
    icon: '👥',
    title: 'Just you for now.',
    body: "Invite family members when you're ready.",
    action: { label: 'Invite', onPress: 'openInvite' },
  },
  
  insights: {
    icon: '📊',
    title: 'Price insights need receipts.',
    body: 'Scan a few receipts to unlock savings suggestions.',
    action: { label: 'Scan receipt', onPress: 'openScanner' },
  },
  
  notifications: {
    icon: '🔔',
    title: 'All caught up.',
    body: 'Notifications from Ellio show up here.',
  },
  
  team: {
    icon: '👤',
    title: 'Just you for now.',
    body: "Invite team members when you're ready.",
    action: { label: 'Invite', onPress: 'openInvite' },
  },
  
  documents: {
    icon: '📄',
    title: 'No documents yet.',
    body: 'Uploaded files and receipts show up here.',
    action: { label: 'Upload', onPress: 'openUpload' },
  },
  
  calendar: {
    icon: '📅',
    title: 'Calendar view.',
    body: 'Tasks with dates show up here.',
    action: { label: 'Add task', onPress: 'openAddTask' },
  },
  
  search: {
    icon: '🔍',
    title: 'Search tasks, receipts, and insights.',
    body: 'Start typing to search.',
  },
  
  reports: {
    icon: '📈',
    title: 'Example: Weekly spending',
    body: 'Preview: Reports show spending trends by category and week.',
    note: 'This is a preview. Real data will appear once you scan receipts.',
  },
  
  export: {
    icon: '💾',
    title: 'Export data',
    body: 'Download tasks, receipts, and spending as CSV or PDF.',
    action: { label: 'Export', onPress: 'openExport' },
  },
  
  integrations: {
    icon: '🔗',
    title: 'Link accounts',
    body: 'Connect retailer accounts to track cashback and offers.',
    action: { label: 'Link', onPress: 'openOAuth' },
  },
};

// ============================================================================
// FIRST-TIME TOOLTIPS (Progressive Disclosure)
// ============================================================================

export const EllioFirstTimeTooltips = {
  // After completing first task
  afterFirstTask: {
    title: 'Nice.',
    body: "That's one thing handled.",
    buttons: { primary: 'Got it' },
  },
  
  // After 3 tasks completed
  afterThreeTasks: {
    title: 'Shopping list',
    body: "Tasks that start with 'Buy' show up in Shopping list. Tap to see them grouped by store.",
    buttons: { primary: 'Show me', secondary: 'Maybe later' },
  },
  
  // After scanning first receipt
  afterFirstReceipt: {
    title: 'Price insights unlocked.',
    body: "Scan a few more receipts and Ellio will spot patterns and savings opportunities.",
    buttons: { primary: 'Got it' },
  },
  
  // After 5 receipts scanned
  afterFiveReceipts: {
    title: 'Budget suggestion ready.',
    body: "Ellio can suggest a budget based on your spending. Want to see it?",
    buttons: { primary: 'Show me', secondary: 'Not now' },
  },
  
  // After voice input used once
  afterFirstVoiceInput: {
    title: "That's it.",
    body: "Voice input works from anywhere. Tap the microphone whenever you're ready.",
    buttons: { primary: 'Got it' },
  },
};

// ============================================================================
// DETAILS / SOURCE SCREEN (Reusable)
// ============================================================================

export const EllioDetailsScreen = {
  // Budget category details
  budgetCategoryDetails: (category: string, amount: number, source: string) => ({
    title: category,
    sections: [
      {
        label: 'What this means',
        value: `Ellio suggests spending no more than $${amount} per week on ${category.toLowerCase()}.`,
      },
      {
        label: 'Where from',
        value: source,
      },
      {
        label: 'Last updated',
        value: 'Today',
      },
    ],
    buttons: { primary: 'Edit', secondary: 'Got it' },
  }),
  
  // Price insight details
  priceInsightDetails: (product: string, yourPrice: number, typicalPrice: number) => ({
    title: product,
    sections: [
      {
        label: 'What this means',
        value: `You paid $${yourPrice}. Typical price in your area is $${typicalPrice}.`,
      },
      {
        label: 'Where from',
        value: 'Public price data for your county and ZIP code.',
      },
      {
        label: 'Confidence',
        value: 'High — based on 120+ data points this month.',
      },
    ],
    buttons: { primary: 'Got it' },
  }),
  
  // Cashback details
  cashbackDetails: (retailer: string, amount: number, status: string) => ({
    title: `${retailer} cashback`,
    sections: [
      {
        label: 'What this means',
        value: `Estimated cashback: $${amount}. ${status}.`,
      },
      {
        label: 'Where from',
        value: `Linked ${retailer} account and purchase history.`,
      },
      {
        label: 'Last updated',
        value: '2 hours ago',
      },
    ],
    buttons: { primary: 'View account', secondary: 'Got it' },
  }),
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  Tooltips: EllioTooltips,
  Onboarding: EllioOnboarding,
  Labels: EllioLabels,
  Messages: EllioMessages,
  Errors: EllioErrors,
  EmptyStates: EllioEmptyStates,
  FirstTime: EllioFirstTimeTooltips,
  Details: EllioDetailsScreen,
};
