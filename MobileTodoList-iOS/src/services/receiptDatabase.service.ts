/**
 * Receipt Database Service
 * Central storage for physical receipts and e-receipts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavingsLog } from './priceAccuracy.service';

export type ReceiptType = 'physical' | 'email' | 'digital';
export type ReceiptCategory = 'groceries' | 'dining' | 'shopping' | 'gas' | 'healthcare' | 'household' | 'other';

export interface Receipt {
  id: string;
  type: ReceiptType;
  date: string;
  storeName: string;
  total: number;
  category: ReceiptCategory;
  
  // Physical receipts
  imageUri?: string;
  
  // E-receipts
  emailId?: string;
  emailSubject?: string;
  emailBody?: string;
  emailFrom?: string;
  pdfUri?: string;
  
  // Parsed data
  items: Array<{
    name: string;
    price: number;
    quantity?: number;
    category?: string;
  }>;
  
  // Metadata
  location?: string;
  paymentMethod?: string;
  tags?: string[];
  notes?: string;
  
  // Savings & rewards
  savingsLog?: SavingsLog;
  cashbackEarned?: number;
  
  // Organization
  isFavorite: boolean;
  isArchived: boolean;
}

export interface ReceiptFilter {
  type?: ReceiptType[];
  category?: ReceiptCategory[];
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  storeName?: string;
  searchTerm?: string;
  showArchived?: boolean;
}

export interface ReceiptStats {
  totalReceipts: number;
  totalSpent: number;
  totalSaved: number;
  totalCashback: number;
  byCategory: Record<ReceiptCategory, {
    count: number;
    spent: number;
    saved: number;
  }>;
  byStore: Record<string, {
    count: number;
    spent: number;
  }>;
  byMonth: Record<string, {
    count: number;
    spent: number;
  }>;
}

const STORAGE_KEY_RECEIPTS = 'ellio_receipt_database';

/**
 * Add a new receipt to the database
 */
export async function addReceipt(receipt: Omit<Receipt, 'id'>): Promise<Receipt> {
  const newReceipt: Receipt = {
    ...receipt,
    id: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
  
  const receipts = await getAllReceipts();
  receipts.push(newReceipt);
  
  await AsyncStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
  console.log('📄 Receipt added to database:', newReceipt.id, newReceipt.storeName);
  
  return newReceipt;
}

/**
 * Update an existing receipt
 */
export async function updateReceipt(receiptId: string, updates: Partial<Receipt>): Promise<void> {
  const receipts = await getAllReceipts();
  const index = receipts.findIndex(r => r.id === receiptId);
  
  if (index >= 0) {
    receipts[index] = { ...receipts[index], ...updates };
    await AsyncStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(receipts));
  }
}

/**
 * Delete a receipt
 */
export async function deleteReceipt(receiptId: string): Promise<void> {
  const receipts = await getAllReceipts();
  const filtered = receipts.filter(r => r.id !== receiptId);
  await AsyncStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(filtered));
}

/**
 * Get all receipts
 */
export async function getAllReceipts(): Promise<Receipt[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_RECEIPTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load receipts:', error);
    return [];
  }
}

/**
 * Filter receipts by criteria
 */
export async function filterReceipts(filter: ReceiptFilter): Promise<Receipt[]> {
  const allReceipts = await getAllReceipts();
  
  return allReceipts.filter(receipt => {
    // Show archived?
    if (!filter.showArchived && receipt.isArchived) {
      return false;
    }
    
    // Type filter
    if (filter.type && !filter.type.includes(receipt.type)) {
      return false;
    }
    
    // Category filter
    if (filter.category && !filter.category.includes(receipt.category)) {
      return false;
    }
    
    // Date range
    if (filter.startDate && receipt.date < filter.startDate) {
      return false;
    }
    if (filter.endDate && receipt.date > filter.endDate) {
      return false;
    }
    
    // Amount range
    if (filter.minAmount !== undefined && receipt.total < filter.minAmount) {
      return false;
    }
    if (filter.maxAmount !== undefined && receipt.total > filter.maxAmount) {
      return false;
    }
    
    // Store name
    if (filter.storeName && !receipt.storeName.toLowerCase().includes(filter.storeName.toLowerCase())) {
      return false;
    }
    
    // Search term (searches store name, items, notes)
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      const inStoreName = receipt.storeName.toLowerCase().includes(term);
      const inItems = receipt.items.some(item => item.name.toLowerCase().includes(term));
      const inNotes = receipt.notes?.toLowerCase().includes(term);
      
      if (!inStoreName && !inItems && !inNotes) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Get receipt statistics
 */
export async function getReceiptStats(filter?: ReceiptFilter): Promise<ReceiptStats> {
  const receipts = filter ? await filterReceipts(filter) : await getAllReceipts();
  
  const stats: ReceiptStats = {
    totalReceipts: receipts.length,
    totalSpent: 0,
    totalSaved: 0,
    totalCashback: 0,
    byCategory: {} as any,
    byStore: {},
    byMonth: {},
  };
  
  receipts.forEach(receipt => {
    stats.totalSpent += receipt.total;
    stats.totalSaved += receipt.savingsLog?.totalSavings || 0;
    stats.totalCashback += receipt.cashbackEarned || 0;
    
    // By category
    if (!stats.byCategory[receipt.category]) {
      stats.byCategory[receipt.category] = { count: 0, spent: 0, saved: 0 };
    }
    stats.byCategory[receipt.category].count++;
    stats.byCategory[receipt.category].spent += receipt.total;
    stats.byCategory[receipt.category].saved += receipt.savingsLog?.totalSavings || 0;
    
    // By store
    if (!stats.byStore[receipt.storeName]) {
      stats.byStore[receipt.storeName] = { count: 0, spent: 0 };
    }
    stats.byStore[receipt.storeName].count++;
    stats.byStore[receipt.storeName].spent += receipt.total;
    
    // By month
    const month = receipt.date.substring(0, 7); // YYYY-MM
    if (!stats.byMonth[month]) {
      stats.byMonth[month] = { count: 0, spent: 0 };
    }
    stats.byMonth[month].count++;
    stats.byMonth[month].spent += receipt.total;
  });
  
  return stats;
}

/**
 * Export receipts as JSON
 */
export async function exportReceipts(filter?: ReceiptFilter): Promise<string> {
  const receipts = filter ? await filterReceipts(filter) : await getAllReceipts();
  return JSON.stringify(receipts, null, 2);
}

/**
 * Import receipts from JSON
 */
export async function importReceipts(jsonData: string): Promise<number> {
  try {
    const importedReceipts: Receipt[] = JSON.parse(jsonData);
    const existing = await getAllReceipts();
    
    // Merge, avoiding duplicates
    const merged = [...existing];
    let addedCount = 0;
    
    importedReceipts.forEach(receipt => {
      if (!existing.find(r => r.id === receipt.id)) {
        merged.push(receipt);
        addedCount++;
      }
    });
    
    await AsyncStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(merged));
    return addedCount;
  } catch (error) {
    console.error('Failed to import receipts:', error);
    throw new Error('Invalid receipt data');
  }
}

/**
 * Clear all receipts (for testing)
 */
export async function clearAllReceipts(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY_RECEIPTS);
  console.log('📄 Receipt database cleared');
}
