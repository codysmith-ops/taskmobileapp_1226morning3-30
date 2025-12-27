/**
 * Credit Card Points Maximization Service
 * Automatically suggests best credit card for each purchase
 */

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  categories: {
    [category: string]: {
      pointsPerDollar: number;
      cashbackPercent?: number;
    };
  };
  annualFee: number;
  signupBonus?: {
    points: number;
    spendRequirement: number;
    months: number;
  };
  perks: string[];
}

export interface PointsRecommendation {
  card: CreditCard;
  category: string;
  pointsEarned: number;
  cashValue: number;
  reason: string;
  alternativeCards?: {
    card: CreditCard;
    pointsDifference: number;
  }[];
}

export interface MonthlyAnalytics {
  totalSpent: number;
  totalPoints: number;
  totalCashback: number;
  potentialPoints: number; // If optimal card used
  pointsLeftOnTable: number;
  cardBreakdown: {
    cardId: string;
    spent: number;
    pointsEarned: number;
  }[];
}

class CreditCardOptimizationService {
  private cards: CreditCard[] = [];
  private defaultCPP = 0.01; // cents per point (Chase: 1cpp, Amex: varies)

  initialize() {
    this.loadPresetCards();
  }

  /**
   * Load popular credit cards with their rewards structure
   */
  private loadPresetCards() {
    this.cards = [
      // Chase Sapphire Preferred
      {
        id: 'chase-sapphire-preferred',
        name: 'Chase Sapphire Preferred',
        issuer: 'Chase',
        categories: {
          dining: { pointsPerDollar: 3 },
          groceries: { pointsPerDollar: 3 },
          travel: { pointsPerDollar: 5 },
          streaming: { pointsPerDollar: 3 },
          default: { pointsPerDollar: 1 },
        },
        annualFee: 95,
        signupBonus: {
          points: 60000,
          spendRequirement: 4000,
          months: 3,
        },
        perks: ['Primary rental car insurance', '2x points on travel', 'No foreign transaction fees'],
      },

      // Chase Freedom Unlimited
      {
        id: 'chase-freedom-unlimited',
        name: 'Chase Freedom Unlimited',
        issuer: 'Chase',
        categories: {
          dining: { pointsPerDollar: 3 },
          drugstore: { pointsPerDollar: 3 },
          travel: { pointsPerDollar: 5 },
          default: { pointsPerDollar: 1.5 },
        },
        annualFee: 0,
        signupBonus: {
          points: 20000,
          spendRequirement: 500,
          months: 3,
        },
        perks: ['0% intro APR for 15 months'],
      },

      // Amex Gold
      {
        id: 'amex-gold',
        name: 'American Express Gold',
        issuer: 'Amex',
        categories: {
          groceries: { pointsPerDollar: 4 }, // up to $25k/year
          dining: { pointsPerDollar: 4 },
          default: { pointsPerDollar: 1 },
        },
        annualFee: 250,
        signupBonus: {
          points: 60000,
          spendRequirement: 4000,
          months: 6,
        },
        perks: ['$120 Uber credit', '$120 dining credit', 'No foreign fees'],
      },

      // Citi Double Cash
      {
        id: 'citi-double-cash',
        name: 'Citi Double Cash',
        issuer: 'Citi',
        categories: {
          default: { pointsPerDollar: 0, cashbackPercent: 2 },
        },
        annualFee: 0,
        perks: ['2% on everything (1% purchase + 1% payment)'],
      },

      // Capital One Savor
      {
        id: 'capital-one-savor',
        name: 'Capital One Savor',
        issuer: 'Capital One',
        categories: {
          dining: { pointsPerDollar: 4 },
          entertainment: { pointsPerDollar: 4 },
          groceries: { pointsPerDollar: 3 },
          streaming: { pointsPerDollar: 4 },
          default: { pointsPerDollar: 1 },
        },
        annualFee: 95,
        signupBonus: {
          points: 50000,
          spendRequirement: 3000,
          months: 3,
        },
        perks: ['No foreign fees'],
      },

      // Discover it Cash Back
      {
        id: 'discover-it',
        name: 'Discover it Cash Back',
        issuer: 'Discover',
        categories: {
          rotating: { cashbackPercent: 5 }, // Changes quarterly
          default: { cashbackPercent: 1 },
        },
        annualFee: 0,
        perks: ['First year cashback match', 'Rotating 5% categories'],
      },

      // Blue Cash Preferred (Amex)
      {
        id: 'amex-bcp',
        name: 'Blue Cash Preferred',
        issuer: 'Amex',
        categories: {
          groceries: { cashbackPercent: 6 }, // up to $6k/year
          streaming: { cashbackPercent: 6 },
          transit: { cashbackPercent: 3 },
          gas: { cashbackPercent: 3 },
          default: { cashbackPercent: 1 },
        },
        annualFee: 95,
        signupBonus: {
          points: 0, // cashback
          spendRequirement: 3000,
          months: 6,
        },
        perks: ['6% at US supermarkets'],
      },

      // Amazon Prime Visa
      {
        id: 'amazon-prime',
        name: 'Amazon Prime Visa',
        issuer: 'Chase',
        categories: {
          amazon: { cashbackPercent: 5 },
          'whole-foods': { cashbackPercent: 5 },
          dining: { cashbackPercent: 2 },
          gas: { cashbackPercent: 2 },
          drugstore: { cashbackPercent: 2 },
          default: { cashbackPercent: 1 },
        },
        annualFee: 0, // Requires Prime membership
        perks: ['5% on Amazon/Whole Foods'],
      },

      // Costco Anywhere Visa
      {
        id: 'costco-visa',
        name: 'Costco Anywhere Visa',
        issuer: 'Citi',
        categories: {
          gas: { cashbackPercent: 4 },
          'costco-warehouse': { cashbackPercent: 2 },
          dining: { cashbackPercent: 3 },
          travel: { cashbackPercent: 3 },
          default: { cashbackPercent: 1 },
        },
        annualFee: 0, // Requires Costco membership
        perks: ['4% on gas', '3% dining & travel'],
      },
    ];
  }

  /**
   * Get best card for a specific purchase
   */
  getBestCardForPurchase(
    amount: number,
    category: string,
    store?: string
  ): PointsRecommendation {
    let bestCard: CreditCard | null = null;
    let bestValue = 0;
    let bestPoints = 0;

    // Check each card
    for (const card of this.cards) {
      let earnRate = 0;
      let categoryMatched = 'default';

      // Check store-specific bonuses
      if (store) {
        const storeKey = store.toLowerCase().replace(/\s+/g, '-');
        if (card.categories[storeKey]) {
          earnRate = card.categories[storeKey].pointsPerDollar || 
                    (card.categories[storeKey].cashbackPercent || 0) * 100;
          categoryMatched = storeKey;
        }
      }

      // Check category bonuses
      if (earnRate === 0 && card.categories[category]) {
        earnRate = card.categories[category].pointsPerDollar || 
                  (card.categories[category].cashbackPercent || 0) * 100;
        categoryMatched = category;
      }

      // Default rate
      if (earnRate === 0 && card.categories.default) {
        earnRate = card.categories.default.pointsPerDollar || 
                  (card.categories.default.cashbackPercent || 0) * 100;
        categoryMatched = 'default';
      }

      const points = amount * earnRate;
      const value = points * this.defaultCPP;

      if (value > bestValue) {
        bestValue = value;
        bestPoints = points;
        bestCard = card;
      }
    }

    if (!bestCard) {
      throw new Error('No cards available');
    }

    // Find alternatives
    const alternatives = this.cards
      .filter(c => c.id !== bestCard!.id)
      .map(card => {
        const rate = card.categories[category]?.pointsPerDollar || 
                    (card.categories[category]?.cashbackPercent || 0) * 100 ||
                    card.categories.default?.pointsPerDollar || 0;
        const points = amount * rate;
        return {
          card,
          pointsDifference: bestPoints - points,
        };
      })
      .filter(alt => alt.pointsDifference < bestPoints) // Only show competitive alternatives
      .sort((a, b) => a.pointsDifference - b.pointsDifference)
      .slice(0, 2);

    return {
      card: bestCard,
      category,
      pointsEarned: bestPoints,
      cashValue: bestValue,
      reason: this.generateReason(bestCard, category, bestPoints, amount),
      alternativeCards: alternatives,
    };
  }

  private generateReason(card: CreditCard, category: string, points: number, amount: number): string {
    const rate = points / amount;
    
    if (rate >= 5) {
      return `Excellent! ${rate}x points on ${category}`;
    } else if (rate >= 3) {
      return `Great choice! ${rate}x points on ${category}`;
    } else if (rate >= 2) {
      return `Good value! ${rate}x points on ${category}`;
    } else {
      return `Earning ${rate}x points`;
    }
  }

  /**
   * Optimize entire shopping cart
   */
  optimizeCart(items: Array<{ name: string; price: number; category: string; store?: string }>) {
    const recommendations: Array<PointsRecommendation & { item: string }> = [];
    
    let totalPoints = 0;
    let totalCash = 0;

    for (const item of items) {
      const rec = this.getBestCardForPurchase(item.price, item.category, item.store);
      recommendations.push({
        ...rec,
        item: item.name,
      });
      totalPoints += rec.pointsEarned;
      totalCash += rec.cashValue;
    }

    // Group by card
    const cardGroups = recommendations.reduce((acc, rec) => {
      const cardId = rec.card.id;
      if (!acc[cardId]) {
        acc[cardId] = {
          card: rec.card,
          items: [],
          totalPoints: 0,
          totalValue: 0,
        };
      }
      acc[cardId].items.push(rec.item);
      acc[cardId].totalPoints += rec.pointsEarned;
      acc[cardId].totalValue += rec.cashValue;
      return acc;
    }, {} as any);

    return {
      recommendations,
      totalPoints,
      totalCash,
      cardGroups: Object.values(cardGroups),
      summary: this.generateCartSummary(Object.values(cardGroups)),
    };
  }

  private generateCartSummary(groups: any[]): string {
    if (groups.length === 1) {
      const card = groups[0].card.name;
      const points = Math.round(groups[0].totalPoints);
      return `Use ${card} for everything and earn ${points} points (worth $${groups[0].totalValue.toFixed(2)})`;
    }

    const lines = groups.map(g => 
      `${g.card.name}: ${g.items.length} items, ${Math.round(g.totalPoints)} points`
    );

    return `Split across ${groups.length} cards:\n` + lines.join('\n');
  }

  /**
   * Monthly analytics
   */
  calculateMonthlyAnalytics(
    purchases: Array<{
      amount: number;
      category: string;
      cardUsed: string;
      store?: string;
      date: Date;
    }>
  ): MonthlyAnalytics {
    let totalSpent = 0;
    let totalPoints = 0;
    let potentialPoints = 0;

    const cardBreakdown: { [cardId: string]: { spent: number; pointsEarned: number } } = {};

    for (const purchase of purchases) {
      totalSpent += purchase.amount;

      // Actual points earned
      const usedCard = this.cards.find(c => c.id === purchase.cardUsed);
      if (usedCard) {
        const rate = usedCard.categories[purchase.category]?.pointsPerDollar || 
                    usedCard.categories.default?.pointsPerDollar || 0;
        const points = purchase.amount * rate;
        totalPoints += points;

        if (!cardBreakdown[usedCard.id]) {
          cardBreakdown[usedCard.id] = { spent: 0, pointsEarned: 0 };
        }
        cardBreakdown[usedCard.id].spent += purchase.amount;
        cardBreakdown[usedCard.id].pointsEarned += points;
      }

      // Optimal points
      const optimal = this.getBestCardForPurchase(purchase.amount, purchase.category, purchase.store);
      potentialPoints += optimal.pointsEarned;
    }

    return {
      totalSpent,
      totalPoints,
      totalCashback: totalPoints * this.defaultCPP,
      potentialPoints,
      pointsLeftOnTable: potentialPoints - totalPoints,
      cardBreakdown: Object.entries(cardBreakdown).map(([cardId, data]) => ({
        cardId,
        ...data,
      })),
    };
  }

  /**
   * Add custom card
   */
  addCustomCard(card: CreditCard) {
    this.cards.push(card);
  }

  /**
   * Get all cards
   */
  getAllCards(): CreditCard[] {
    return this.cards;
  }

  /**
   * Get card by ID
   */
  getCardById(id: string): CreditCard | undefined {
    return this.cards.find(c => c.id === id);
  }

  /**
   * Suggest new cards based on spending
   */
  suggestNewCards(
    monthlySpending: { [category: string]: number }
  ): Array<{ card: CreditCard; annualValue: number; reasoning: string }> {
    const suggestions: Array<{ card: CreditCard; annualValue: number; reasoning: string }> = [];

    for (const card of this.cards) {
      let annualValue = 0;
      const categories: string[] = [];

      // Calculate annual value based on spending
      for (const [category, monthlyAmount] of Object.entries(monthlySpending)) {
        const rate = card.categories[category]?.pointsPerDollar || 
                    card.categories.default?.pointsPerDollar || 0;
        const annualPoints = monthlyAmount * 12 * rate;
        const value = annualPoints * this.defaultCPP;
        annualValue += value;

        if (rate >= 3) {
          categories.push(`${rate}x on ${category}`);
        }
      }

      // Subtract annual fee
      annualValue -= card.annualFee;

      // Add signup bonus value (spread over 2 years)
      if (card.signupBonus) {
        annualValue += (card.signupBonus.points * this.defaultCPP) / 2;
      }

      if (annualValue > 100) {
        suggestions.push({
          card,
          annualValue,
          reasoning: categories.length > 0 
            ? `Earn extra on: ${categories.join(', ')}`
            : `Good general-purpose card`,
        });
      }
    }

    return suggestions.sort((a, b) => b.annualValue - a.annualValue).slice(0, 3);
  }
}

export const creditCardOptimizer = new CreditCardOptimizationService();
