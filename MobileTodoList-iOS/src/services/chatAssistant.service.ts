/**
 * Chat Assistant Service
 * Intelligent assistant that knows everything about the app
 * Helps with onboarding, explains features, fetches data
 */

import { Task } from '../store';
import { EllioVoice } from '../content/ellioTheme';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: number;
  type?: 'text' | 'feature' | 'onboarding' | 'data';
  actions?: ChatAction[];
}

export interface ChatAction {
  label: string;
  onPress: () => void;
}

export interface ChatContext {
  currentPage?: string;
  setupStep?: number;
  tasks?: Task[];
  userName?: string;
}

/**
 * Get welcome message based on context
 */
export function getWelcomeMessage(context: ChatContext): ChatMessage {
  const name = context.userName || 'there';

  return {
    id: Date.now().toString(),
    text: `Hey ${name}! I'm here to help. ${EllioVoice.signatures.wantHelp}\n\nI know everything about this app and can:\n• Explain any feature\n• Fetch receipts or coupons\n• Answer questions\n• Guide you through setup\n\n${EllioVoice.signatures.whenReady}`,
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'text',
  };
}

/**
 * Get response for user query
 */
export function getAssistantResponse(userMessage: string, context: ChatContext): ChatMessage {
  const query = userMessage.toLowerCase().trim();

  // Onboarding questions
  if (
    query.includes('why') &&
    (query.includes('name') || query.includes('email') || query.includes('data'))
  ) {
    return getOnboardingExplanation('data_collection');
  }

  if (query.includes('credit card') && query.includes('why')) {
    return getOnboardingExplanation('credit_cards');
  }

  if (query.includes('location') && query.includes('why')) {
    return getOnboardingExplanation('location');
  }

  if (query.includes('notification') && query.includes('why')) {
    return getOnboardingExplanation('notifications');
  }

  // Feature explanations
  if (query.includes('voice') || query.includes('microphone')) {
    return getFeatureExplanation('voice_input');
  }

  if (query.includes('barcode') || query.includes('scan')) {
    return getFeatureExplanation('barcode_scanner');
  }

  if (query.includes('route') || query.includes('optimization')) {
    return getFeatureExplanation('route_planning');
  }

  if (query.includes('cashback') || query.includes('rewards')) {
    return getFeatureExplanation('cashback');
  }

  if (query.includes('receipt')) {
    return getFeatureExplanation('receipts');
  }

  if (query.includes('category') || query.includes('categories')) {
    return getFeatureExplanation('categories');
  }

  // Savings and money-saving tips
  if (
    query.includes('save money') ||
    query.includes('savings') ||
    query.includes('save more') ||
    query.includes('budget') ||
    query.includes('cheaper') ||
    query.includes('generic')
  ) {
    return getSavingsSuggestions();
  }

  // How-to questions
  if (query.includes('how') && query.includes('add task')) {
    return getHowToResponse('add_task');
  }

  if (query.includes('how') && query.includes('voice')) {
    return getHowToResponse('use_voice');
  }

  if (query.includes('how') && query.includes('scan')) {
    return getHowToResponse('scan_barcode');
  }

  // Data fetching
  if (query.includes('show') || query.includes('get') || query.includes('find')) {
    if (query.includes('receipt')) {
      return getDataFetchingResponse('receipts', context);
    }
    if (query.includes('coupon')) {
      return getDataFetchingResponse('coupons', context);
    }
    if (query.includes('task')) {
      return getDataFetchingResponse('tasks', context);
    }
  }

  // General help
  if (
    query.includes('help') ||
    query.includes('what can you do') ||
    query.includes('capabilities')
  ) {
    return getGeneralHelp();
  }

  // Default response
  return getDefaultResponse(userMessage);
}

/**
 * Provide money-saving suggestions and tips
 */
function getSavingsSuggestions(): ChatMessage {
  const tips = [
    `💰 **Smart Savings Tips**\n\n**Buy Generic Brands:**\n• Store brands are 20-40% cheaper\n• Same quality, different label\n• Try: Kirkland (Costco), Great Value (Walmart), 365 (Whole Foods)\n\n**Alternatives & Substitutes:**\n• Frozen veggies = 50% cheaper than fresh\n• Dried beans instead of canned\n• Butter instead of specialty spreads\n• Oats instead of cereal\n\n**Other Ways to Save:**\n• Shop weekly ads\n• Use coupons (digital + paper)\n• Buy in bulk for non-perishables\n• Shop discount grocers (Aldi, Lidl)\n• Meal prep to reduce waste\n\n${EllioVoice.signatures.whenReady}`,

    `🛒 **Grocery Savings Strategies**\n\n**1. Choose Generic:**\n• Milk: Save $1-2 per gallon\n• Cereal: Save $2-3 per box\n• Pasta: Save $1 per pound\n• Spices: Save 50-70%\n\n**2. Smart Swaps:**\n• Fresh → Frozen veggies ($2-3 savings)\n• Name brand → Store brand (30% off)\n• Pre-cut → Whole produce (40% off)\n• Bottled water → Filter pitcher ($200/year)\n\n**3. Shopping Habits:**\n• Make a list (avoid impulse buys)\n• Never shop hungry\n• Compare unit prices\n• Check clearance section first\n\n${EllioVoice.signatures.youreGood}`,

    `💡 **Advanced Saving Techniques**\n\n**Stack Deals:**\n• Sale price + coupon + cashback app\n• Example: $4 cereal → $2 sale → $1 coupon → $0.50 Ibotta = $0.50!\n\n**Generic Brands Worth Trying:**\n• Kirkland (Costco) - Premium quality\n• Trader Joe's - Unique flavors\n• Amazon Basics - Household essentials\n• Great Value (Walmart) - Everything\n• Market Pantry (Target) - Reliable\n\n**Budget Grocery Stores:**\n• Aldi - 50% cheaper than big chains\n• Lidl - European quality, low prices\n• WinCo - Employee-owned, no frills\n• Costco - Bulk savings (membership pays off)\n\n**Meal Planning:**\n• Cook once, eat twice (leftovers)\n• Meatless Monday (save $5-10/meal)\n• Breakfast for dinner (cheap & easy)\n\nSet a weekly savings goal in the app!`,

    `🎯 **Hit Your Savings Goal**\n\n**Quick Wins (Save $20-50/week):**\n\n1. **Switch to Generic:**\n   • 5 name brands → store brands\n   • Weekly savings: $15-25\n\n2. **Buy Frozen:**\n   • Veggies, fruits, protein\n   • Weekly savings: $10-15\n\n3. **Skip Pre-Made:**\n   • Make your own: salads, snacks, lunches\n   • Weekly savings: $20-30\n\n4. **Use Cashback Apps:**\n   • Ibotta, Fetch, Rakuten\n   • Weekly savings: $5-10\n\n5. **Shop Sales Only:**\n   • Plan meals around weekly ads\n   • Weekly savings: $15-25\n\n**Total Potential: $65-105/week!**\n\n${EllioVoice.signatures.notAllAtOnce} Start with 2-3 tips!`,
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return {
    id: Date.now().toString(),
    text: randomTip,
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'text',
  };
}

/**
 * Explain why we collect data and how it adds value
 */
function getOnboardingExplanation(topic: string): ChatMessage {
  const explanations: Record<string, string> = {
    data_collection: `${EllioVoice.signatures.keepSimple}\n\nYour name and email help us:\n• Save your data securely\n• Sync across devices\n• Send helpful reminders\n\nWe never sell your data. Ever. You can delete everything anytime.\n\nIt's like having a personal assistant who remembers your preferences.`,

    credit_cards:
      "Great question! Here's why it helps:\n\n• Auto-suggest the best card for each store\n• Maximize your cashback earnings\n• Track which cards save you the most\n\nWe never charge your cards or see full numbers. Just names and rewards rates from official websites.\n\nThink of it as a smart wallet advisor.",

    location: `Location helps in two ways:\n\n1. Find nearby stores automatically\n2. Remind you when you're near a task location\n\nWe only use it when the app is open. Never tracked in background unless you choose.\n\n${EllioVoice.signatures.youreGood}`,

    notifications: `Notifications are gentle nudges:\n\n• "You're near Walmart" (if you choose)\n• "Don't forget the milk" (if you set it)\n• Never spam, never pressure\n\nYou control when, where, and how often. Turn them off anytime.\n\n${EllioVoice.signatures.notAllAtOnce}`,
  };

  return {
    id: Date.now().toString(),
    text: explanations[topic] || 'Let me explain that...',
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'onboarding',
  };
}

/**
 * Explain app features
 */
function getFeatureExplanation(feature: string): ChatMessage {
  const explanations: Record<string, string> = {
    voice_input:
      'Voice input is magic:\n\n1. Tap the microphone 🎤\n2. Say your list naturally:\n   "Buy milk, then call dentist tomorrow"\n3. App organizes everything automatically\n\nIt detects categories, priorities, and due dates. No typing needed!\n\nWant to try it?',

    barcode_scanner:
      'The barcode scanner auto-fills product details:\n\n1. Tap "Scan SKU"\n2. Point at any barcode\n3. Product name, size, and stores appear\n\nWorks with groceries, household items, anything with a barcode.\n\nSaves tons of typing!',

    route_planning:
      'Smart routing saves time and gas:\n\n• Add tasks at different stores\n• App arranges stops by distance\n• Shows fastest path through all locations\n\nLike having a personal route planner.\n\nNo more backtracking!',

    cashback:
      'Cashback matching is your money-saver:\n\n• Knows all your credit card rewards\n• Suggests best card for each store\n• Based on official rates from card websites\n\nExample: 3% at grocery stores with Chase Sapphire.\n\nMaximize every purchase!',

    receipts:
      'Receipt tracking keeps you organized:\n\n• Take photo after shopping\n• Attach to task automatically\n• Find later for returns or records\n\nNo more lost receipts in your wallet!',

    categories: `Categories auto-organize your life:\n\n• Shopping (groceries, retail)\n• Work (meetings, emails)\n• Personal (home, errands)\n• Health (appointments, gym)\n• Finance (bills, payments)\n\nTasks sort themselves. ${EllioVoice.signatures.youreGood}`,
  };

  return {
    id: Date.now().toString(),
    text: explanations[feature] || 'Let me explain that feature...',
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'feature',
  };
}

/**
 * Provide how-to instructions
 */
function getHowToResponse(action: string): ChatMessage {
  const instructions: Record<string, string> = {
    add_task: `Adding tasks is easy:\n\n**Type it:**\n1. Enter title in "What do you need?"\n2. Tap "Add"\n\n**Say it:**\n1. Tap 🎤 microphone\n2. Speak your list\n3. Review and confirm\n\n**Scan it:**\n1. Tap "Scan SKU"\n2. Point at barcode\n3. Details auto-fill\n\n${EllioVoice.signatures.whenReady}`,

    use_voice:
      'Voice input in 3 steps:\n\n1. **Tap** the microphone 🎤\n2. **Speak** naturally:\n   • Single: "Buy milk"\n   • Multiple: "Buy milk, then call mom tomorrow"\n3. **Confirm** the tasks\n\nThe app understands:\n• Categories (shopping, work, etc.)\n• Priorities (urgent, later)\n• Due dates (today, next week)\n\nTry it now!',

    scan_barcode:
      'Scanning barcodes:\n\n1. Tap "Scan SKU" button\n2. Point camera at barcode\n3. Hold steady until beep\n4. Product details appear\n\nWorks with:\n• Groceries (UPC codes)\n• Household items\n• Any retail product\n\nNo typing needed!',
  };

  return {
    id: Date.now().toString(),
    text: instructions[action] || "I'll walk you through it...",
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'text',
  };
}

/**
 * Fetch and display data
 */
function getDataFetchingResponse(dataType: string, context: ChatContext): ChatMessage {
  if (dataType === 'tasks') {
    const tasks = context.tasks || [];
    const incomplete = tasks.filter(t => !t.completed);

    if (incomplete.length === 0) {
      return {
        id: Date.now().toString(),
        text: `${EllioVoice.signatures.youreGood}\n\nNo tasks right now. Want to add one?`,
        sender: 'assistant',
        timestamp: Date.now(),
        type: 'data',
      };
    }

    const taskList = incomplete
      .slice(0, 5)
      .map((t, i) => `${i + 1}. ${t.title}`)
      .join('\n');

    return {
      id: Date.now().toString(),
      text: `Here are your next tasks:\n\n${taskList}\n\n${
        incomplete.length > 5
          ? `...and ${incomplete.length - 5} more`
          : EllioVoice.signatures.notAllAtOnce
      }`,
      sender: 'assistant',
      timestamp: Date.now(),
      type: 'data',
    };
  }

  if (dataType === 'receipts') {
    return {
      id: Date.now().toString(),
      text: "Receipt fetching coming soon!\n\nI'll be able to:\n• Find receipts by store\n• Search by date range\n• Export for records\n\nStay tuned!",
      sender: 'assistant',
      timestamp: Date.now(),
      type: 'data',
    };
  }

  if (dataType === 'coupons') {
    return {
      id: Date.now().toString(),
      text: "Coupon finder coming soon!\n\nI'll search:\n• Store-specific deals\n• Manufacturer coupons\n• Digital offers\n\nYou'll save even more!",
      sender: 'assistant',
      timestamp: Date.now(),
      type: 'data',
    };
  }

  return {
    id: Date.now().toString(),
    text: "I'm learning to fetch that data. Check back soon!",
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'data',
  };
}

/**
 * General help message
 */
function getGeneralHelp(): ChatMessage {
  return {
    id: Date.now().toString(),
    text: `I can help with:\n\n**Questions:**\n• "Why do you need my email?"\n• "How does voice input work?"\n• "What are categories?"\n\n**Actions:**\n• "Show my tasks"\n• "Find receipts"\n• "Get coupons"\n\n**Guidance:**\n• Explain any feature\n• Walk through setup\n• Answer questions\n\nJust ask! ${EllioVoice.signatures.whenReady}`,
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'text',
  };
}

/**
 * Default fallback response
 */
function getDefaultResponse(userMessage: string): ChatMessage {
  const responses = [
    'Hmm, let me think about that...\n\nCan you rephrase? Or ask:\n• "What can you do?"\n• "How do I [action]?"\n• "Why do you need [data]?"',

    'Good question! I\'m still learning that one.\n\nTry:\n• "Help"\n• "Show my tasks"\n• "Explain [feature]"',

    `I want to help, but I'm not sure about "${userMessage}".\n\nWhat would you like to know about:\n• Features?\n• Your data?\n• How to do something?`,
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  return {
    id: Date.now().toString(),
    text: randomResponse,
    sender: 'assistant',
    timestamp: Date.now(),
    type: 'text',
  };
}

/**
 * Get suggested questions for current context
 */
export function getSuggestedQuestions(context: ChatContext): string[] {
  if (context.setupStep !== undefined) {
    // During onboarding
    return [
      'Why do you need my email?',
      'How does credit card info help?',
      'Is my data safe?',
      'What are the benefits?',
    ];
  }

  if (context.currentPage === 'home') {
    return [
      'How do I add tasks?',
      'What is voice input?',
      'How can I save money?',
      'Show me savings tips',
    ];
  }

  return ['What can you do?', 'How can I save money?', 'Show my tasks', 'Help'];
}
