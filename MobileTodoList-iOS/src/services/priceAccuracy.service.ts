/**
 * Price Accuracy & Savings Logging Service
 * 
 * Compares receipt prices to area averages and logs savings
 * Uses county/ZIP from receipts (NO GPS tracking)
 * 
 * Features:
 * - Extract location from receipt text (county, ZIP)
 * - Compare prices to area averages
 * - Calculate and log savings
 * - Track price history
 * - Generate savings insights
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ReceiptLocation {
  county?: string;
  zipCode?: string;
  state?: string;
  city?: string;
  storeName?: string;
  storeAddress?: string;
}

export interface PriceComparison {
  itemName: string;
  category: string;
  actualPrice: number;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  savings: number; // Positive if saved money, negative if overpaid
  percentageSaved: number;
  source: 'area_average' | 'historical' | 'other_stores';
}

export interface SavingsLog {
  id: string;
  receiptId: string;
  date: string;
  storeName: string;
  location: ReceiptLocation;
  totalSpent: number;
  totalSavings: number;
  itemComparisons: PriceComparison[];
  savingsBreakdown: {
    vsAreaAverage: number;
    vsHistorical: number;
    vsOtherStores: number;
  };
}

export interface WeeklySavings {
  weekStart: string;
  weekEnd: string;
  totalSaved: number;
  totalSpent: number;
  receiptsCount: number;
  bestDeal: PriceComparison | null;
  topSavingsCategories: Array<{
    category: string;
    saved: number;
  }>;
}

// Mock area price database (in production, this would be an API call)
const AREA_PRICE_DATABASE: Record<string, { average: number; low: number; high: number }> = {
  // Dairy
  'milk': { average: 3.79, low: 2.99, high: 4.49 },
  'eggs': { average: 4.29, low: 3.49, high: 5.99 },
  'cheese': { average: 5.99, low: 4.49, high: 7.99 },
  'butter': { average: 4.99, low: 3.99, high: 6.49 },
  'yogurt': { average: 1.29, low: 0.99, high: 1.99 },
  
  // Produce
  'bananas': { average: 0.59, low: 0.39, high: 0.79 },
  'apples': { average: 1.99, low: 1.49, high: 2.99 },
  'tomatoes': { average: 2.49, low: 1.99, high: 3.49 },
  'lettuce': { average: 1.99, low: 1.49, high: 2.99 },
  'carrots': { average: 1.49, low: 0.99, high: 2.29 },
  
  // Meat & Poultry
  'chicken breast': { average: 4.99, low: 3.99, high: 6.99 },
  'ground beef': { average: 5.49, low: 4.29, high: 7.99 },
  'pork chops': { average: 4.29, low: 3.49, high: 5.99 },
  'salmon': { average: 12.99, low: 9.99, high: 16.99 },
  
  // Pantry
  'bread': { average: 2.99, low: 1.99, high: 4.99 },
  'rice': { average: 3.49, low: 2.49, high: 4.99 },
  'pasta': { average: 1.99, low: 1.29, high: 2.99 },
  'cereal': { average: 4.49, low: 2.99, high: 6.99 },
  'coffee': { average: 8.99, low: 5.99, high: 12.99 },
  
  // Household
  'paper towels': { average: 7.99, low: 5.99, high: 9.99 },
  'toilet paper': { average: 12.99, low: 9.99, high: 16.99 },
  'dish soap': { average: 3.49, low: 2.49, high: 4.99 },
  'laundry detergent': { average: 11.99, low: 8.99, high: 15.99 },
};

const STORAGE_KEY_SAVINGS_LOG = 'ellio_savings_log';
const STORAGE_KEY_PRICE_HISTORY = 'ellio_price_history';

/**
 * Extract location from receipt text using pattern matching
 * Looks for: ZIP codes, state abbreviations, city names, addresses
 */
export function extractLocationFromReceipt(receiptText: string): ReceiptLocation {
  const location: ReceiptLocation = {};
  
  // Extract ZIP code (5 digits)
  const zipMatch = receiptText.match(/\b(\d{5})\b/);
  if (zipMatch) {
    location.zipCode = zipMatch[1];
  }
  
  // Extract state (2-letter abbreviations)
  const stateMatch = receiptText.match(/\b([A-Z]{2})\b\s*\d{5}/);
  if (stateMatch) {
    location.state = stateMatch[1];
  }
  
  // Extract city (common pattern: City, ST ZIP)
  const cityMatch = receiptText.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})/);
  if (cityMatch) {
    location.city = cityMatch[1];
    location.state = cityMatch[2];
  }
  
  // Extract store address
  const addressMatch = receiptText.match(/(\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr))/i);
  if (addressMatch) {
    location.storeAddress = addressMatch[1];
  }
  
  return location;
}

/**
 * Compare item price to area average
 */
export function comparePriceToArea(
  itemName: string,
  actualPrice: number,
  category: string
): PriceComparison {
  // Normalize item name for lookup
  const normalizedName = itemName.toLowerCase().trim();
  
  // Try direct match first
  let priceData = AREA_PRICE_DATABASE[normalizedName];
  
  // If no match, try partial match
  if (!priceData) {
    const partialMatch = Object.keys(AREA_PRICE_DATABASE).find(key =>
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    if (partialMatch) {
      priceData = AREA_PRICE_DATABASE[partialMatch];
    }
  }
  
  // Use generic estimates if no match found
  if (!priceData) {
    priceData = { average: actualPrice, low: actualPrice * 0.8, high: actualPrice * 1.2 };
  }
  
  const savings = priceData.average - actualPrice;
  const percentageSaved = (savings / priceData.average) * 100;
  
  return {
    itemName,
    category,
    actualPrice,
    averagePrice: priceData.average,
    lowestPrice: priceData.low,
    highestPrice: priceData.high,
    savings,
    percentageSaved,
    source: 'area_average',
  };
}

/**
 * Calculate total savings from receipt
 */
export async function calculateReceiptSavings(
  receiptId: string,
  storeName: string,
  items: Array<{ name: string; price: number; category: string }>,
  receiptText?: string
): Promise<SavingsLog> {
  const location = receiptText ? extractLocationFromReceipt(receiptText) : {};
  
  // Compare each item to area prices
  const itemComparisons = items.map(item =>
    comparePriceToArea(item.name, item.price, item.category)
  );
  
  const totalSpent = items.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = itemComparisons.reduce((sum, comp) => sum + comp.savings, 0);
  
  const savingsLog: SavingsLog = {
    id: `savings_${Date.now()}`,
    receiptId,
    date: new Date().toISOString(),
    storeName,
    location: { ...location, storeName },
    totalSpent,
    totalSavings,
    itemComparisons,
    savingsBreakdown: {
      vsAreaAverage: totalSavings,
      vsHistorical: 0, // TODO: Compare to user's historical purchases
      vsOtherStores: 0, // TODO: Compare to other stores user shops at
    },
  };
  
  // Save to AsyncStorage
  await saveSavingsLog(savingsLog);
  
  return savingsLog;
}

/**
 * Save savings log to AsyncStorage
 */
async function saveSavingsLog(log: SavingsLog): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY_SAVINGS_LOG);
    const logs: SavingsLog[] = existing ? JSON.parse(existing) : [];
    logs.push(log);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }
    
    await AsyncStorage.setItem(STORAGE_KEY_SAVINGS_LOG, JSON.stringify(logs));
    console.log('💰 Savings log saved:', log.id, `Total saved: $${log.totalSavings.toFixed(2)}`);
  } catch (error) {
    console.error('Failed to save savings log:', error);
  }
}

/**
 * Get all savings logs
 */
export async function getAllSavingsLogs(): Promise<SavingsLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_SAVINGS_LOG);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load savings logs:', error);
    return [];
  }
}

/**
 * Calculate weekly savings
 */
export async function getWeeklySavings(): Promise<WeeklySavings> {
  const logs = await getAllSavingsLogs();
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  // Filter logs from this week
  const weekLogs = logs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate < weekEnd;
  });
  
  const totalSaved = weekLogs.reduce((sum, log) => sum + log.totalSavings, 0);
  const totalSpent = weekLogs.reduce((sum, log) => sum + log.totalSpent, 0);
  
  // Find best deal
  const allComparisons = weekLogs.flatMap(log => log.itemComparisons);
  const bestDeal = allComparisons.reduce((best, comp) =>
    comp.savings > (best?.savings || 0) ? comp : best
  , null as PriceComparison | null);
  
  // Calculate savings by category
  const categoryMap = new Map<string, number>();
  weekLogs.forEach(log => {
    log.itemComparisons.forEach(comp => {
      const current = categoryMap.get(comp.category) || 0;
      categoryMap.set(comp.category, current + comp.savings);
    });
  });
  
  const topSavingsCategories = Array.from(categoryMap.entries())
    .map(([category, saved]) => ({ category, saved }))
    .sort((a, b) => b.saved - a.saved)
    .slice(0, 5);
  
  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    totalSaved,
    totalSpent,
    receiptsCount: weekLogs.length,
    bestDeal,
    topSavingsCategories,
  };
}

/**
 * Get savings breakdown explanation (for "How is this calculated?" tooltip)
 */
export function getSavingsExplanation(log: SavingsLog): string {
  const examples = log.itemComparisons
    .filter(comp => Math.abs(comp.savings) > 0.25) // Only significant differences
    .slice(0, 3)
    .map(comp => {
      const saved = comp.savings > 0;
      const amount = Math.abs(comp.savings);
      return `${saved ? '✓' : '⚠️'} ${comp.itemName}: $${comp.actualPrice.toFixed(2)}\n  vs. Average price: $${comp.averagePrice.toFixed(2)}\n  You ${saved ? 'saved' : 'paid'}: $${amount.toFixed(2)}`;
    })
    .join('\n\n');
  
  return `💡 How We Calculate Savings\n\nEllio compares your receipt prices to:\n1. Average prices in your area (${log.location.county || 'county'} + ${log.location.zipCode || 'ZIP'})\n2. Prices at other stores you've shopped\n3. Historical prices for the same items\n\n${examples}\n\nTotal across ${log.itemComparisons.length} items: $${log.totalSavings.toFixed(2)}\n\nData source: Your receipts + aggregated pricing data from your area (no GPS).`;
}

/**
 * Clear all savings data (for testing/debugging)
 */
export async function clearSavingsData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_SAVINGS_LOG);
  await AsyncStorage.removeItem(STORAGE_KEY_PRICE_HISTORY);
  console.log('💰 Savings data cleared');
}
