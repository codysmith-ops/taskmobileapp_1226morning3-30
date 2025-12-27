/**
 * Shopping Optimization Services
 * Includes: Price History, Bulk Buy Calculator, Smart Cart, Loyalty Auto-Apply, Flash Deals
 */

// ============================================================================
// STORE PRICE HISTORY API
// ============================================================================

export interface PriceHistory {
  productId: string;
  productName: string;
  currentPrice: number;
  history: Array<{
    date: Date;
    price: number;
    store: string;
  }>;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  prediction: number;
}

class PriceHistoryService {
  /**
   * Get price history for product
   */
  async getPriceHistory(productId: string): Promise<PriceHistory> {
    // Mock data - would call real price tracking API
    const basePrice = 4.99;
    const history = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      price: basePrice + (Math.random() - 0.5) * 1.5,
      store: ['Walmart', 'Target', 'Whole Foods'][Math.floor(Math.random() * 3)],
    }));

    const prices = history.map(h => h.price);
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate trend
    const recentPrices = prices.slice(-7);
    const olderPrices = prices.slice(-14, -7);
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    const trend =
      recentAvg > olderAvg * 1.05
        ? 'increasing'
        : recentAvg < olderAvg * 0.95
        ? 'decreasing'
        : 'stable';

    // Predict next price
    const prediction = recentAvg + (recentAvg - olderAvg);

    return {
      productId,
      productName: 'Organic Whole Milk',
      currentPrice: prices[prices.length - 1],
      history,
      lowestPrice,
      highestPrice,
      averagePrice,
      trend,
      prediction,
    };
  }

  /**
   * Get price alert recommendation
   */
  shouldBuyNow(priceHistory: PriceHistory): {
    recommendation: 'buy_now' | 'wait' | 'excellent_deal';
    reason: string;
  } {
    const { currentPrice, averagePrice, lowestPrice, trend } = priceHistory;

    if (currentPrice <= lowestPrice * 1.05) {
      return {
        recommendation: 'excellent_deal',
        reason: `Current price $${currentPrice.toFixed(2)} is at all-time low!`,
      };
    }

    if (currentPrice < averagePrice * 0.9 && trend === 'increasing') {
      return {
        recommendation: 'buy_now',
        reason: 'Price is 10% below average and trending up',
      };
    }

    if (trend === 'decreasing') {
      return {
        recommendation: 'wait',
        reason: 'Price is decreasing, wait for better deal',
      };
    }

    return {
      recommendation: 'buy_now',
      reason: `Fair price at $${currentPrice.toFixed(2)}`,
    };
  }

  /**
   * Compare across stores
   */
  async compareStores(productId: string): Promise<
    Array<{
      store: string;
      price: number;
      distance: number;
      savings: number;
    }>
  > {
    // Mock data - would call store APIs
    return [
      { store: 'Walmart', price: 4.49, distance: 2.5, savings: 0 },
      { store: 'Target', price: 4.99, distance: 1.2, savings: -0.5 },
      { store: 'Whole Foods', price: 6.99, distance: 3.8, savings: -2.5 },
      { store: 'Costco', price: 3.99, distance: 5.5, savings: 0.5 },
    ].sort((a, b) => a.price - b.price);
  }
}

// ============================================================================
// BULK BUY CALCULATOR
// ============================================================================

export interface BulkBuyAnalysis {
  item: string;
  singlePrice: number;
  singleQuantity: number;
  bulkPrice: number;
  bulkQuantity: number;
  unitPriceSingle: number;
  unitPriceBulk: number;
  savings: number;
  savingsPercent: number;
  recommendation: string;
  considerations: string[];
}

class BulkBuyCalculatorService {
  /**
   * Analyze bulk buy opportunity
   */
  analyzeBulkBuy(
    item: string,
    singlePrice: number,
    singleQuantity: number,
    bulkPrice: number,
    bulkQuantity: number,
    shelfLife?: number, // days
    usageRate?: number // units per week
  ): BulkBuyAnalysis {
    const unitPriceSingle = singlePrice / singleQuantity;
    const unitPriceBulk = bulkPrice / bulkQuantity;
    const savings = (unitPriceSingle - unitPriceBulk) * bulkQuantity;
    const savingsPercent = ((unitPriceSingle - unitPriceBulk) / unitPriceSingle) * 100;

    const considerations: string[] = [];
    let recommendation = '';

    // Check if savings are significant
    if (savingsPercent < 10) {
      considerations.push('Savings less than 10%, may not be worth it');
    }

    // Check shelf life
    if (shelfLife && usageRate) {
      const weeksToConsume = bulkQuantity / usageRate;
      const daysToConsume = weeksToConsume * 7;

      if (daysToConsume > shelfLife) {
        considerations.push(
          `Will take ${weeksToConsume.toFixed(1)} weeks to use but expires in ${shelfLife} days`
        );
        recommendation = 'Not recommended - will expire before use';
      } else if (daysToConsume > shelfLife * 0.8) {
        considerations.push('Cutting it close on expiration');
        recommendation = 'Risky - only buy if you can use quickly';
      } else {
        recommendation = `Excellent deal! Save $${savings.toFixed(2)} (${savingsPercent.toFixed(
          0
        )}%)`;
      }
    } else {
      recommendation =
        savingsPercent > 20
          ? `Excellent deal! Save $${savings.toFixed(2)}`
          : savingsPercent > 10
          ? `Good savings at ${savingsPercent.toFixed(0)}%`
          : 'Marginal savings';
    }

    // Storage considerations
    if (bulkQuantity > 10) {
      considerations.push('Requires storage space');
    }

    // Upfront cost
    if (bulkPrice > 50) {
      considerations.push(`High upfront cost: $${bulkPrice.toFixed(2)}`);
    }

    return {
      item,
      singlePrice,
      singleQuantity,
      bulkPrice,
      bulkQuantity,
      unitPriceSingle,
      unitPriceBulk,
      savings,
      savingsPercent,
      recommendation,
      considerations,
    };
  }

  /**
   * Calculate break-even point
   */
  calculateBreakEven(
    membershipCost: number, // Annual cost like Costco
    avgSavingsPerTrip: number,
    tripsPerYear: number
  ): {
    breakEven: boolean;
    totalSavings: number;
    netSavings: number;
    recommendation: string;
  } {
    const totalSavings = avgSavingsPerTrip * tripsPerYear;
    const netSavings = totalSavings - membershipCost;

    return {
      breakEven: netSavings > 0,
      totalSavings,
      netSavings,
      recommendation:
        netSavings > 100
          ? `Worth it! Save $${netSavings.toFixed(2)}/year`
          : netSavings > 0
          ? `Marginally worth it, save $${netSavings.toFixed(2)}/year`
          : `Not worth it, lose $${Math.abs(netSavings).toFixed(2)}/year`,
    };
  }

  /**
   * Suggest optimal buy quantity
   */
  suggestOptimalQuantity(
    shelfLife: number,
    usageRate: number,
    priceBreaks: Array<{ quantity: number; unitPrice: number }>
  ): {
    optimalQuantity: number;
    reasoning: string;
  } {
    const maxUsableQuantity = (shelfLife / 7) * usageRate;

    // Find best price break that's within usable quantity
    const usableBreaks = priceBreaks.filter(pb => pb.quantity <= maxUsableQuantity);

    if (usableBreaks.length === 0) {
      return {
        optimalQuantity: Math.floor(maxUsableQuantity),
        reasoning: 'Buy maximum usable before expiration',
      };
    }

    // Get the highest quantity with best unit price
    const optimal = usableBreaks.reduce((best, current) =>
      current.unitPrice < best.unitPrice ? current : best
    );

    return {
      optimalQuantity: optimal.quantity,
      reasoning: `Best value at $${optimal.unitPrice.toFixed(
        2
      )}/unit, will use within ${shelfLife} days`,
    };
  }
}

// ============================================================================
// SMART CART RECOMMENDATIONS
// ============================================================================

export interface CartRecommendation {
  type: 'bundle' | 'substitute' | 'add_on' | 'remove' | 'quantity_adjust';
  message: string;
  items?: string[];
  savings?: number;
}

class SmartCartService {
  /**
   * Analyze cart and get recommendations
   */
  analyzeCart(
    cart: Array<{ name: string; price: number; quantity: number }>
  ): CartRecommendation[] {
    const recommendations: CartRecommendation[] = [];

    // Check for common bundles
    const hasItem = (name: string) => cart.some(item => item.name.toLowerCase().includes(name));

    if (hasItem('pasta') && !hasItem('sauce')) {
      recommendations.push({
        type: 'add_on',
        message: 'Add pasta sauce? (Often bought together)',
        items: ['Marinara Sauce', 'Alfredo Sauce'],
      });
    }

    if (hasItem('chips') && !hasItem('dip')) {
      recommendations.push({
        type: 'add_on',
        message: 'Add dip? (Often bought together)',
        items: ['Salsa', 'Guacamole', 'French Onion Dip'],
      });
    }

    // Check for better deals
    cart.forEach(item => {
      if (item.quantity > 5) {
        recommendations.push({
          type: 'bundle',
          message: `${item.name}: Bulk pack saves $${(item.price * item.quantity * 0.15).toFixed(
            2
          )}`,
          savings: item.price * item.quantity * 0.15,
        });
      }
    });

    // Check for expensive brand alternatives
    const expensiveItems = cart.filter(item => item.price > 10);
    expensiveItems.forEach(item => {
      recommendations.push({
        type: 'substitute',
        message: `${item.name}: Store brand available for $${(item.price * 0.7).toFixed(2)}`,
        items: [`${item.name} (Store Brand)`],
        savings: item.price * 0.3 * item.quantity,
      });
    });

    // Check for quantity optimization
    const multipleItems = cart.filter(item => item.quantity > 1);
    multipleItems.forEach(item => {
      if (item.quantity % 3 === 2) {
        // e.g., buying 5 when 6-pack is available
        recommendations.push({
          type: 'quantity_adjust',
          message: `${item.name}: Buy ${item.quantity + 1} in multi-pack for better value`,
        });
      }
    });

    return recommendations;
  }

  /**
   * Optimize cart for savings
   */
  optimizeForSavings(cart: Array<{ name: string; price: number; quantity: number }>): {
    originalTotal: number;
    optimizedTotal: number;
    totalSavings: number;
    changes: string[];
  } {
    const originalTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Mock optimization - would use real pricing data
    const optimizedTotal = originalTotal * 0.85; // Assume 15% savings
    const totalSavings = originalTotal - optimizedTotal;

    const changes = [
      'Switched to store brand milk (-$2.50)',
      'Applied bulk discount on cereal (-$1.80)',
      'Used digital coupon for yogurt (-$0.75)',
    ];

    return {
      originalTotal,
      optimizedTotal,
      totalSavings,
      changes,
    };
  }

  /**
   * Check for missing essentials
   */
  checkMissingEssentials(cart: Array<{ name: string; price: number; quantity: number }>): string[] {
    const essentials = ['milk', 'eggs', 'bread', 'butter', 'coffee'];
    const missing = essentials.filter(
      essential => !cart.some(item => item.name.toLowerCase().includes(essential))
    );

    return missing.map(item => `Don't forget: ${item}`);
  }
}

// ============================================================================
// LOYALTY CARD AUTO-APPLY
// ============================================================================

export interface LoyaltyCard {
  id: string;
  store: string;
  number: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  benefits: string[];
  expiringPoints?: {
    amount: number;
    date: Date;
  };
}

class LoyaltyCardService {
  private cards: LoyaltyCard[] = [];

  /**
   * Add loyalty card
   */
  addCard(card: Omit<LoyaltyCard, 'id'>): LoyaltyCard {
    const newCard: LoyaltyCard = {
      ...card,
      id: `card-${Date.now()}`,
    };
    this.cards.push(newCard);
    return newCard;
  }

  /**
   * Get card for store
   */
  getCardForStore(store: string): LoyaltyCard | undefined {
    return this.cards.find(card => card.store.toLowerCase() === store.toLowerCase());
  }

  /**
   * Auto-apply best card
   */
  autoApplyCard(store: string): {
    applied: boolean;
    card?: LoyaltyCard;
    benefits: string[];
  } {
    const card = this.getCardForStore(store);

    if (!card) {
      return { applied: false, benefits: [] };
    }

    return {
      applied: true,
      card,
      benefits: card.benefits,
    };
  }

  /**
   * Check expiring points
   */
  getExpiringPoints(): Array<{
    store: string;
    points: number;
    daysUntilExpiry: number;
  }> {
    return this.cards
      .filter(card => card.expiringPoints)
      .map(card => ({
        store: card.store,
        points: card.expiringPoints!.amount,
        daysUntilExpiry: Math.ceil(
          (card.expiringPoints!.date.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        ),
      }))
      .filter(exp => exp.daysUntilExpiry <= 30);
  }

  /**
   * Calculate points earned
   */
  calculatePointsEarned(store: string, amount: number): number {
    const card = this.getCardForStore(store);
    if (!card) {
      return 0;
    }

    // Typical: 1 point per $1, bonus for tier
    const basePoints = Math.floor(amount);
    const tierMultiplier = {
      bronze: 1,
      silver: 1.25,
      gold: 1.5,
      platinum: 2,
    };

    return Math.floor(basePoints * tierMultiplier[card.tier]);
  }
}

// ============================================================================
// FLASH DEAL PUSH NOTIFICATIONS
// ============================================================================

export interface FlashDeal {
  id: string;
  store: string;
  product: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  startsAt: Date;
  endsAt: Date;
  quantity?: number;
  category: string;
}

class FlashDealService {
  private deals: FlashDeal[] = [];
  private userPreferences: string[] = [];

  /**
   * Set user preferences (categories they care about)
   */
  setPreferences(categories: string[]) {
    this.userPreferences = categories;
  }

  /**
   * Add flash deal
   */
  addDeal(deal: Omit<FlashDeal, 'id' | 'discount'>): FlashDeal {
    const discount = ((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100;
    const newDeal: FlashDeal = {
      ...deal,
      id: `deal-${Date.now()}`,
      discount,
    };
    this.deals.push(newDeal);
    return newDeal;
  }

  /**
   * Get active deals
   */
  getActiveDeals(): FlashDeal[] {
    const now = new Date();
    return this.deals.filter(deal => deal.startsAt <= now && deal.endsAt >= now);
  }

  /**
   * Get relevant deals (based on preferences)
   */
  getRelevantDeals(): FlashDeal[] {
    const activeDeals = this.getActiveDeals();

    if (this.userPreferences.length === 0) {
      return activeDeals;
    }

    return activeDeals.filter(deal => this.userPreferences.includes(deal.category));
  }

  /**
   * Should notify user
   */
  shouldNotify(deal: FlashDeal): boolean {
    // Notify if:
    // 1. Discount > 30%
    // 2. Category matches preferences
    // 3. Deal just started (within last hour)

    const isRelevant = this.userPreferences.includes(deal.category);
    const isSignificant = deal.discount >= 30;
    const isNew = Date.now() - deal.startsAt.getTime() < 60 * 60 * 1000;

    return (isRelevant || isSignificant) && isNew;
  }

  /**
   * Format notification
   */
  formatNotification(deal: FlashDeal): string {
    const timeLeft = Math.ceil((deal.endsAt.getTime() - Date.now()) / (60 * 60 * 1000));
    return `Flash Deal: ${deal.product} at ${deal.store} - ${deal.discount.toFixed(
      0
    )}% off! Only ${timeLeft}h left`;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const priceHistory = new PriceHistoryService();
export const bulkBuyCalculator = new BulkBuyCalculatorService();
export const smartCart = new SmartCartService();
export const loyaltyCard = new LoyaltyCardService();
export const flashDeal = new FlashDealService();
