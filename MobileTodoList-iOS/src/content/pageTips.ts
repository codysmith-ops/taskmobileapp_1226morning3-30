/**
 * Page-specific contextual tips
 * Auto-populate based on current page
 * Aligned with Ellio "calm" philosophy
 */

export interface PageTip {
  page: string;
  tipId: string;
  message: string;
  position?: 'top' | 'bottom';
}

export const PAGE_TIPS: PageTip[] = [
  // Home Page
  {
    page: 'home',
    tipId: 'next_up',
    message: 'Your "Next up" task is the one thing to focus on right now. Everything else can wait.',
    position: 'top',
  },
  {
    page: 'home',
    tipId: 'add_task',
    message: 'Tap + to add a task. Type, speak, or scan - whatever feels natural to you.',
    position: 'bottom',
  },

  // Shopping List
  {
    page: 'shopping',
    tipId: 'voice_input',
    message: 'Try voice input: "Milk, eggs, bread" - I\'ll organize it for you automatically.',
    position: 'top',
  },
  {
    page: 'shopping',
    tipId: 'scanner',
    message: 'Scan a barcode to instantly add products with prices and store locations.',
    position: 'bottom',
  },

  // Budget Page
  {
    page: 'budget',
    tipId: 'auto_budget',
    message: 'Your budget targets are based on past spending from scanned receipts. No manual entry needed.',
    position: 'top',
  },
  {
    page: 'budget',
    tipId: 'tap_category',
    message: 'Tap any category to see where your money went and find ways to save.',
    position: 'bottom',
  },

  // Receipts Page
  {
    page: 'receipts',
    tipId: 'scan_receipt',
    message: 'Just snap a photo of your receipt - I\'ll extract all the details automatically.',
    position: 'top',
  },
  {
    page: 'receipts',
    tipId: 'price_tracking',
    message: 'I track prices over time so you can see which store has the best deals.',
    position: 'bottom',
  },

  // Cashback Page
  {
    page: 'cashback',
    tipId: 'link_cards',
    message: 'Link your credit cards once, and I\'ll track all your cashback automatically.',
    position: 'top',
  },
  {
    page: 'cashback',
    tipId: 'optimize',
    message: 'I\'ll suggest which card to use for each purchase to maximize your rewards.',
    position: 'bottom',
  },

  // Insights Page
  {
    page: 'insights',
    tipId: 'spending_patterns',
    message: 'These insights are from your actual receipts - the more you scan, the smarter they get.',
    position: 'top',
  },
  {
    page: 'insights',
    tipId: 'savings_tips',
    message: 'Green highlights show opportunities to save. Tap to see specific recommendations.',
    position: 'bottom',
  },

  // Family/Team Page
  {
    page: 'family',
    tipId: 'shared_lists',
    message: 'Share lists with family - everyone sees updates in real-time, no texting needed.',
    position: 'top',
  },
  {
    page: 'family',
    tipId: 'assign_tasks',
    message: 'Assign tasks to family members with a tap. They\'ll get a gentle notification.',
    position: 'bottom',
  },

  // Timeline Page
  {
    page: 'timeline',
    tipId: 'activity_feed',
    message: 'Your timeline shows what\'s been happening - completed tasks, purchases, and savings.',
    position: 'top',
  },

  // Notifications Page
  {
    page: 'notifications',
    tipId: 'smart_reminders',
    message: 'I only notify you about things that matter - no spam, just helpful reminders.',
    position: 'top',
  },
  {
    page: 'notifications',
    tipId: 'location_alerts',
    message: 'Get reminded when you\'re near a store with items on your list. It\'s optional.',
    position: 'bottom',
  },

  // Calendar Page
  {
    page: 'calendar',
    tipId: 'due_dates',
    message: 'Tasks with due dates appear here. Don\'t stress - just focus on today.',
    position: 'top',
  },

  // Reports Page
  {
    page: 'reports',
    tipId: 'monthly_summary',
    message: 'Monthly reports show where your money went and how much you saved with Ellio.',
    position: 'top',
  },

  // Savings Dashboard
  {
    page: 'savings',
    tipId: 'total_saved',
    message: 'This shows real money saved from cashback, coupons, and price tracking. Not estimates.',
    position: 'top',
  },

  // Integrations Page
  {
    page: 'integrations',
    tipId: 'connect_apps',
    message: 'Connect your favorite apps to sync calendars, share lists, and automate tasks.',
    position: 'top',
  },

  // Account Page
  {
    page: 'account',
    tipId: 'your_data',
    message: 'Your data is encrypted and never shared. You can export or delete it anytime.',
    position: 'top',
  },

  // Preferences Page
  {
    page: 'preferences',
    tipId: 'customize',
    message: 'Customize Ellio to match how you work. Every setting is optional.',
    position: 'top',
  },

  // Task Analytics
  {
    page: 'analytics',
    tipId: 'completion_rate',
    message: 'Track your progress over time. This is about celebrating wins, not pressure.',
    position: 'top',
  },

  // Weekly Summary
  {
    page: 'weekly',
    tipId: 'week_recap',
    message: 'A quick summary of what you accomplished this week. You\'re doing great!',
    position: 'top',
  },

  // Documents Page
  {
    page: 'documents',
    tipId: 'receipt_storage',
    message: 'All your receipts are stored securely and searchable. No more digging through emails.',
    position: 'top',
  },
];

/**
 * Get tips for a specific page
 */
export const getTipsForPage = (page: string): PageTip[] => {
  return PAGE_TIPS.filter(tip => tip.page === page);
};

/**
 * Get a single tip for a page (rotates through available tips)
 */
export const getNextTipForPage = async (page: string, tipIndex: number = 0): Promise<PageTip | null> => {
  const pageTips = getTipsForPage(page);
  if (pageTips.length === 0) return null;
  
  // Rotate through tips
  const index = tipIndex % pageTips.length;
  return pageTips[index];
};

/**
 * Map navigation page names to tip page names
 */
export const PAGE_NAME_MAP: { [key: string]: string } = {
  'home': 'home',
  'shopping': 'shopping',
  'budget': 'budget',
  'receipts': 'receipts',
  'cashback': 'cashback',
  'insights': 'insights',
  'family': 'family',
  'team': 'family',
  'timeline': 'timeline',
  'notifications': 'notifications',
  'calendar': 'calendar',
  'reports': 'reports',
  'savings': 'savings',
  'integrations': 'integrations',
  'account': 'account',
  'preferences': 'preferences',
  'analytics': 'analytics',
  'weekly': 'weekly',
  'documents': 'documents',
};
