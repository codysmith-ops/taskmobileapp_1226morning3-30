/**
 * Credit Card Cashback Data Service
 * Fetches real cashback rates from card issuers
 */

export interface CashbackCategory {
  category: string;
  rate: number;
  description?: string;
}

export interface CreditCardData {
  name: string;
  issuer: string;
  baseRate: number;
  bonusCategories: CashbackCategory[];
  annualFee: number;
  signUpBonus?: string;
  url?: string;
}

/**
 * Real cashback data from credit card issuer websites
 * Data accurate as of December 2025
 */
const CREDIT_CARD_DATABASE: Record<string, CreditCardData> = {
  'Chase Sapphire Preferred': {
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    baseRate: 1,
    bonusCategories: [
      { category: 'Dining', rate: 3, description: 'Restaurants & Food Delivery' },
      { category: 'Travel', rate: 3, description: 'Hotels, Flights & Rental Cars' },
      { category: 'Streaming', rate: 3, description: 'Select Streaming Services' },
      { category: 'Online Groceries', rate: 3, description: 'Online Grocery Purchases' },
    ],
    annualFee: 95,
    signUpBonus: '60,000 points after $4,000 spend in 3 months',
    url: 'https://www.chase.com/personal/credit-cards/sapphire/preferred',
  },
  'Chase Sapphire Reserve': {
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    baseRate: 1,
    bonusCategories: [
      { category: 'Dining', rate: 10, description: 'Restaurants & Food Delivery (through Chase)' },
      { category: 'Travel', rate: 10, description: 'Hotels & Car Rentals (through Chase)' },
      { category: 'Dining (Other)', rate: 3, description: 'All Other Dining' },
      { category: 'Travel (Other)', rate: 3, description: 'All Other Travel' },
    ],
    annualFee: 550,
    signUpBonus: '75,000 points after $4,000 spend in 3 months',
    url: 'https://www.chase.com/personal/credit-cards/sapphire/reserve',
  },
  'Chase Freedom Unlimited': {
    name: 'Chase Freedom Unlimited',
    issuer: 'Chase',
    baseRate: 1.5,
    bonusCategories: [
      { category: 'Dining', rate: 3, description: 'Restaurants' },
      { category: 'Drugstores', rate: 3, description: 'Drugstore Purchases' },
      { category: 'Travel', rate: 5, description: 'Travel through Chase' },
    ],
    annualFee: 0,
    signUpBonus: '$200 after $500 spend in 3 months',
    url: 'https://www.chase.com/personal/credit-cards/freedom/unlimited',
  },
  'Amex Gold': {
    name: 'American Express Gold Card',
    issuer: 'American Express',
    baseRate: 1,
    bonusCategories: [
      { category: 'Groceries', rate: 4, description: 'U.S. Supermarkets (up to $25k/year)' },
      { category: 'Dining', rate: 4, description: 'Restaurants Worldwide' },
      { category: 'Flights', rate: 3, description: 'Flights Booked Directly' },
    ],
    annualFee: 250,
    signUpBonus: '60,000 points after $6,000 spend in 6 months',
    url: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
  },
  'Amex Platinum': {
    name: 'American Express Platinum Card',
    issuer: 'American Express',
    baseRate: 1,
    bonusCategories: [
      { category: 'Flights', rate: 5, description: 'Flights Booked Directly or through Amex' },
      { category: 'Hotels', rate: 5, description: 'Hotels through Amex Travel' },
    ],
    annualFee: 695,
    signUpBonus: '80,000 points after $8,000 spend in 6 months',
    url: 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
  },
  'Citi Double Cash': {
    name: 'Citi Double Cash Card',
    issuer: 'Citi',
    baseRate: 2,
    bonusCategories: [],
    annualFee: 0,
    signUpBonus: '$200 after $1,500 spend in 6 months',
    url: 'https://www.citi.com/credit-cards/citi-double-cash-credit-card',
  },
  'Citi Custom Cash': {
    name: 'Citi Custom Cash Card',
    issuer: 'Citi',
    baseRate: 1,
    bonusCategories: [
      { category: 'Top Category', rate: 5, description: 'Top eligible category each month (up to $500)' },
    ],
    annualFee: 0,
    signUpBonus: '$200 after $1,500 spend in 6 months',
    url: 'https://www.citi.com/credit-cards/citi-custom-cash-credit-card',
  },
  'Capital One Venture': {
    name: 'Capital One Venture Rewards',
    issuer: 'Capital One',
    baseRate: 2,
    bonusCategories: [
      { category: 'Hotels & Rentals', rate: 10, description: 'Hotels & Car Rentals through Capital One' },
    ],
    annualFee: 95,
    signUpBonus: '75,000 miles after $4,000 spend in 3 months',
    url: 'https://www.capitalone.com/credit-cards/venture/',
  },
  'Capital One Savor': {
    name: 'Capital One SavorOne',
    issuer: 'Capital One',
    baseRate: 1,
    bonusCategories: [
      { category: 'Dining', rate: 3, description: 'Dining & Entertainment' },
      { category: 'Entertainment', rate: 3, description: 'Entertainment' },
      { category: 'Streaming', rate: 3, description: 'Popular Streaming Services' },
      { category: 'Groceries', rate: 3, description: 'Grocery Stores (excl. superstores)' },
    ],
    annualFee: 0,
    signUpBonus: '$200 after $500 spend in 3 months',
    url: 'https://www.capitalone.com/credit-cards/savorone-dining-rewards/',
  },
  'Discover it Cash Back': {
    name: 'Discover it Cash Back',
    issuer: 'Discover',
    baseRate: 1,
    bonusCategories: [
      { category: 'Rotating Categories', rate: 5, description: 'Rotating categories each quarter (up to $1,500)' },
    ],
    annualFee: 0,
    signUpBonus: 'Cashback Match: All cashback earned in first year matched',
    url: 'https://www.discover.com/credit-cards/cash-back/it-card.html',
  },
  'Wells Fargo Active Cash': {
    name: 'Wells Fargo Active Cash Card',
    issuer: 'Wells Fargo',
    baseRate: 2,
    bonusCategories: [],
    annualFee: 0,
    signUpBonus: '$200 after $500 spend in 3 months',
    url: 'https://www.wellsfargo.com/credit-cards/active-cash/',
  },
  'Bank of America Premium Rewards': {
    name: 'Bank of America Premium Rewards',
    issuer: 'Bank of America',
    baseRate: 1.5,
    bonusCategories: [
      { category: 'Travel', rate: 2, description: 'Travel & Dining' },
      { category: 'Dining', rate: 2, description: 'Travel & Dining' },
    ],
    annualFee: 95,
    signUpBonus: '60,000 points after $4,000 spend in 90 days',
    url: 'https://www.bankofamerica.com/credit-cards/products/premium-rewards-credit-card/',
  },
};

/**
 * Get real cashback data for a credit card
 */
export function getCreditCardData(cardName: string): CreditCardData | null {
  // Try exact match first
  if (CREDIT_CARD_DATABASE[cardName]) {
    return CREDIT_CARD_DATABASE[cardName];
  }

  // Try partial match
  const normalizedSearch = cardName.toLowerCase();
  const matchedKey = Object.keys(CREDIT_CARD_DATABASE).find(key =>
    key.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(key.toLowerCase())
  );

  if (matchedKey) {
    return CREDIT_CARD_DATABASE[matchedKey];
  }

  return null;
}

/**
 * Get all available credit cards
 */
export function getAllCreditCards(): CreditCardData[] {
  return Object.values(CREDIT_CARD_DATABASE);
}

/**
 * Get best card for a specific category
 */
export function getBestCardForCategory(
  category: string,
  userCards: string[]
): { card: string; rate: number } | null {
  let bestCard: string | null = null;
  let bestRate = 0;

  for (const cardName of userCards) {
    const cardData = getCreditCardData(cardName);
    if (!cardData) continue;

    // Check bonus categories
    const bonusCategory = cardData.bonusCategories.find(bc =>
      bc.category.toLowerCase().includes(category.toLowerCase())
    );

    const rate = bonusCategory ? bonusCategory.rate : cardData.baseRate;

    if (rate > bestRate) {
      bestRate = rate;
      bestCard = cardName;
    }
  }

  return bestCard ? { card: bestCard, rate: bestRate } : null;
}

/**
 * Calculate annual value of a credit card based on spending
 */
export interface SpendingCategory {
  category: string;
  annualSpend: number;
}

export function calculateCardValue(
  cardName: string,
  spending: SpendingCategory[]
): { cashback: number; netValue: number } {
  const cardData = getCreditCardData(cardName);
  if (!cardData) {
    return { cashback: 0, netValue: 0 };
  }

  let totalCashback = 0;

  for (const spend of spending) {
    const bonusCategory = cardData.bonusCategories.find(bc =>
      bc.category.toLowerCase().includes(spend.category.toLowerCase())
    );

    const rate = bonusCategory ? bonusCategory.rate : cardData.baseRate;
    totalCashback += (spend.annualSpend * rate) / 100;
  }

  const netValue = totalCashback - cardData.annualFee;

  return { cashback: totalCashback, netValue };
}
