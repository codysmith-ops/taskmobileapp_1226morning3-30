/**
 * Premium & Utility Services
 * Includes: Personal Shopper Mode, Energy/Time Calculator, Historical Analytics
 */

// ============================================================================
// PERSONAL SHOPPER MODE
// ============================================================================

export interface ShopperProfile {
  userId: string;
  preferences: {
    budget: number;
    dietaryRestrictions: string[];
    favoriteStores: string[];
    preferredBrands: string[];
    householdSize: number;
    cookingSkillLevel: 'beginner' | 'intermediate' | 'expert';
  };
  shoppingHistory: Array<{
    date: Date;
    items: string[];
    total: number;
  }>;
}

export interface PersonalizedSuggestion {
  category: string;
  suggestions: Array<{
    product: string;
    reason: string;
    price: number;
    store: string;
  }>;
}

class PersonalShopperService {
  /**
   * Get personalized suggestions
   */
  async getPersonalizedSuggestions(profile: ShopperProfile): Promise<PersonalizedSuggestion[]> {
    // Analyze shopping history
    const frequentItems = this.analyzeFrequentPurchases(profile.shoppingHistory);
    const upcomingNeeds = this.predictUpcomingNeeds(profile.shoppingHistory);

    const suggestions: PersonalizedSuggestion[] = [
      {
        category: 'Staples',
        suggestions: frequentItems.slice(0, 5).map(item => ({
          product: item.name,
          reason: `You buy this every ${item.frequency} days`,
          price: item.avgPrice,
          store: profile.preferences.favoriteStores[0] || 'Walmart',
        })),
      },
      {
        category: 'Predicted Needs',
        suggestions: upcomingNeeds.map(item => ({
          product: item.name,
          reason: `Running low based on your usage pattern`,
          price: item.estimatedPrice,
          store: item.bestStore,
        })),
      },
      {
        category: 'Deals for You',
        suggestions: [
          {
            product: 'Organic Chicken Breast',
            reason: '30% off at your favorite store',
            price: 5.99,
            store: profile.preferences.favoriteStores[0] || 'Whole Foods',
          },
        ],
      },
    ];

    return suggestions;
  }

  /**
   * Create complete shopping list
   */
  createCompleteShoppingList(
    profile: ShopperProfile,
    daysToShopFor: number = 7
  ): {
    list: Array<{ item: string; quantity: number; estimated: number }>;
    estimatedTotal: number;
    estimatedTime: number;
  } {
    // Mock complete list based on household size and preferences
    const baseList = [
      { item: 'Milk', quantity: 2, estimated: 7.98 },
      { item: 'Eggs', quantity: 1, estimated: 4.99 },
      { item: 'Bread', quantity: 2, estimated: 5.98 },
      { item: 'Chicken', quantity: 2, estimated: 15.98 },
      { item: 'Vegetables', quantity: 5, estimated: 12.45 },
      { item: 'Fruits', quantity: 4, estimated: 10.96 },
    ];

    // Scale by household size
    const scaleFactor = profile.preferences.householdSize / 2;
    const list = baseList.map(item => ({
      ...item,
      quantity: Math.ceil(item.quantity * scaleFactor),
      estimated: item.estimated * scaleFactor,
    }));

    const estimatedTotal = list.reduce((sum, item) => sum + item.estimated, 0);
    const estimatedTime = list.length * 2; // 2 minutes per item

    return {
      list,
      estimatedTotal,
      estimatedTime,
    };
  }

  /**
   * Analyze frequent purchases
   */
  private analyzeFrequentPurchases(
    history: ShopperProfile['shoppingHistory']
  ): Array<{ name: string; frequency: number; avgPrice: number }> {
    const itemFrequency: { [item: string]: { count: number; totalPrice: number; lastPurchase: Date } } = {};

    history.forEach(trip => {
      trip.items.forEach(item => {
        if (!itemFrequency[item]) {
          itemFrequency[item] = { count: 0, totalPrice: 0, lastPurchase: trip.date };
        }
        itemFrequency[item].count++;
        itemFrequency[item].totalPrice += trip.total / trip.items.length; // Rough estimate
        itemFrequency[item].lastPurchase = trip.date;
      });
    });

    return Object.entries(itemFrequency)
      .map(([name, data]) => ({
        name,
        frequency: data.count,
        avgPrice: data.totalPrice / data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Predict upcoming needs
   */
  private predictUpcomingNeeds(
    history: ShopperProfile['shoppingHistory']
  ): Array<{ name: string; estimatedPrice: number; bestStore: string }> {
    // Mock prediction - would use ML model
    return [
      { name: 'Coffee', estimatedPrice: 12.99, bestStore: 'Costco' },
      { name: 'Yogurt', estimatedPrice: 4.99, bestStore: 'Walmart' },
    ];
  }

  /**
   * Get real-time assistance
   */
  getRealTimeAssistance(currentLocation: { lat: number; lon: number }, shoppingList: string[]): {
    nearbyItems: Array<{ item: string; aisle: number; distance: string }>;
    nextItem: string;
    optimizedRoute: string[];
  } {
    // Mock real-time assistance
    return {
      nearbyItems: [
        { item: 'Milk', aisle: 12, distance: '20 feet' },
        { item: 'Bread', aisle: 5, distance: '50 feet' },
      ],
      nextItem: 'Milk',
      optimizedRoute: ['Milk', 'Eggs', 'Bread', 'Chicken'],
    };
  }
}

// ============================================================================
// ENERGY & TIME CALCULATOR
// ============================================================================

export interface TripEfficiency {
  distance: number;
  fuelCost: number;
  timeSpent: number;
  energyCost: number;
  totalCost: number;
  efficiency: 'excellent' | 'good' | 'fair' | 'poor';
  suggestions: string[];
}

class EnergyTimeCalculatorService {
  /**
   * Calculate trip efficiency
   */
  calculateTripEfficiency(
    distance: number, // miles
    fuelPrice: number, // per gallon
    mpg: number,
    timeSpent: number, // minutes
    purchaseAmount: number
  ): TripEfficiency {
    const fuelUsed = distance / mpg;
    const fuelCost = fuelUsed * fuelPrice;
    
    // Value of time (assume $20/hour)
    const timeCost = (timeSpent / 60) * 20;
    
    // Energy cost (electricity if EV)
    const energyCost = fuelCost; // Same for comparison
    
    const totalCost = fuelCost + timeCost;
    const costPerDollarSpent = totalCost / purchaseAmount;

    // Determine efficiency
    let efficiency: TripEfficiency['efficiency'];
    if (costPerDollarSpent < 0.05) {
      efficiency = 'excellent';
    } else if (costPerDollarSpent < 0.10) {
      efficiency = 'good';
    } else if (costPerDollarSpent < 0.15) {
      efficiency = 'fair';
    } else {
      efficiency = 'poor';
    }

    const suggestions: string[] = [];
    
    if (distance > 10) {
      suggestions.push('Consider delivery ($5) vs. $' + fuelCost.toFixed(2) + ' fuel');
    }
    
    if (timeSpent > 60) {
      suggestions.push('Combine with other errands to save time');
    }
    
    if (purchaseAmount < 50) {
      suggestions.push('Small trip - consider adding items or waiting');
    }

    return {
      distance,
      fuelCost,
      timeSpent,
      energyCost,
      totalCost,
      efficiency,
      suggestions,
    };
  }

  /**
   * Compare delivery vs. in-store
   */
  compareDeliveryVsInStore(
    distance: number,
    fuelPrice: number,
    mpg: number,
    timeSpent: number,
    deliveryFee: number,
    deliveryTip: number = 5
  ): {
    inStoreCost: number;
    deliveryCost: number;
    timeSaved: number;
    recommendation: string;
  } {
    const fuelCost = (distance / mpg) * fuelPrice;
    const timeCost = (timeSpent / 60) * 20;
    const inStoreCost = fuelCost + timeCost;
    const deliveryCost = deliveryFee + deliveryTip;
    const timeSaved = timeSpent;

    const recommendation =
      deliveryCost < inStoreCost
        ? `Delivery saves $${(inStoreCost - deliveryCost).toFixed(2)} and ${timeSaved} minutes`
        : inStoreCost < deliveryCost
        ? `In-store saves $${(deliveryCost - inStoreCost).toFixed(2)} but costs ${timeSaved} minutes`
        : 'About the same - choose based on convenience';

    return {
      inStoreCost,
      deliveryCost,
      timeSaved,
      recommendation,
    };
  }

  /**
   * Optimize multi-store trip
   */
  optimizeMultiStoreTrip(
    stores: Array<{ name: string; location: { lat: number; lon: number }; items: string[] }>
  ): {
    optimalOrder: string[];
    totalDistance: number;
    estimatedTime: number;
    recommendation: string;
  } {
    // Mock optimization - would use real routing algorithm
    const optimalOrder = stores.map(s => s.name);
    const totalDistance = stores.length * 3; // Assume 3 miles between stores
    const estimatedTime = stores.length * 20 + totalDistance * 2; // 20 min per store + drive time

    const recommendation =
      stores.length > 3
        ? 'Many stops - consider consolidating to 2-3 stores'
        : 'Efficient route';

    return {
      optimalOrder,
      totalDistance,
      estimatedTime,
      recommendation,
    };
  }

  /**
   * Calculate carbon footprint
   */
  calculateCarbonFootprint(
    distance: number,
    mpg: number,
    isElectric: boolean = false
  ): {
    kgCO2: number;
    comparison: string;
    offsetCost: number;
  } {
    // Gas: 8.89 kg CO2 per gallon
    // Electric: 0.92 kg CO2 per kWh, ~0.3 kWh per mile
    const kgCO2 = isElectric
      ? distance * 0.3 * 0.92
      : (distance / mpg) * 8.89;

    const comparison = `${kgCO2.toFixed(2)} kg CO2 = ${(kgCO2 * 0.45).toFixed(0)} smartphone charges`;
    const offsetCost = kgCO2 * 0.01; // $0.01 per kg CO2

    return {
      kgCO2,
      comparison,
      offsetCost,
    };
  }
}

// ============================================================================
// HISTORICAL ANALYTICS
// ============================================================================

export interface SpendingAnalytics {
  period: 'week' | 'month' | 'year';
  totalSpent: number;
  averageTrip: number;
  tripCount: number;
  byCategory: { [category: string]: number };
  byStore: { [store: string]: number };
  trends: {
    vsLastPeriod: number; // percentage change
    topIncreases: Array<{ category: string; change: number }>;
    topDecreases: Array<{ category: string; change: number }>;
  };
  insights: string[];
}

class HistoricalAnalyticsService {
  /**
   * Get spending analytics
   */
  getSpendingAnalytics(
    period: 'week' | 'month' | 'year',
    transactions: Array<{
      date: Date;
      store: string;
      items: Array<{ name: string; category: string; price: number }>;
    }>
  ): SpendingAnalytics {
    const totalSpent = transactions.reduce(
      (sum, t) => sum + t.items.reduce((itemSum, i) => itemSum + i.price, 0),
      0
    );

    const tripCount = transactions.length;
    const averageTrip = tripCount > 0 ? totalSpent / tripCount : 0;

    // By category
    const byCategory: { [category: string]: number } = {};
    transactions.forEach(t => {
      t.items.forEach(item => {
        byCategory[item.category] = (byCategory[item.category] || 0) + item.price;
      });
    });

    // By store
    const byStore: { [store: string]: number } = {};
    transactions.forEach(t => {
      const storeTotal = t.items.reduce((sum, i) => sum + i.price, 0);
      byStore[t.store] = (byStore[t.store] || 0) + storeTotal;
    });

    // Mock trends (would compare with previous period)
    const vsLastPeriod = 5.2; // 5.2% increase
    const topIncreases = [
      { category: 'Snacks', change: 25 },
      { category: 'Beverages', change: 15 },
    ];
    const topDecreases = [
      { category: 'Produce', change: -10 },
    ];

    // Generate insights
    const insights: string[] = [];
    
    if (vsLastPeriod > 10) {
      insights.push(`Spending up ${vsLastPeriod.toFixed(1)}% - review budget`);
    }
    
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCategory) {
      insights.push(`Top category: ${topCategory[0]} ($${topCategory[1].toFixed(2)})`);
    }

    if (topIncreases.length > 0) {
      insights.push(`Spending up on: ${topIncreases[0].category} (+${topIncreases[0].change}%)`);
    }

    return {
      period,
      totalSpent,
      averageTrip,
      tripCount,
      byCategory,
      byStore,
      trends: {
        vsLastPeriod,
        topIncreases,
        topDecreases,
      },
      insights,
    };
  }

  /**
   * Get price trends
   */
  getPriceTrends(
    product: string,
    history: Array<{ date: Date; price: number }>
  ): {
    currentPrice: number;
    avgPrice: number;
    lowestPrice: number;
    highestPrice: number;
    trend: 'up' | 'down' | 'stable';
    prediction: number;
  } {
    const prices = history.map(h => h.price);
    const currentPrice = prices[prices.length - 1];
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);

    // Calculate trend
    const recentPrices = prices.slice(-5);
    const olderPrices = prices.slice(-10, -5);
    const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;

    const trend = recentAvg > olderAvg * 1.05 ? 'up' : recentAvg < olderAvg * 0.95 ? 'down' : 'stable';
    const prediction = recentAvg + (recentAvg - olderAvg);

    return {
      currentPrice,
      avgPrice,
      lowestPrice,
      highestPrice,
      trend,
      prediction,
    };
  }

  /**
   * Get waste analysis
   */
  getWasteAnalysis(
    wastedItems: Array<{ item: string; category: string; value: number; reason: string }>
  ): {
    totalWaste: number;
    byCategory: { [category: string]: number };
    byReason: { [reason: string]: number };
    suggestions: string[];
  } {
    const totalWaste = wastedItems.reduce((sum, i) => sum + i.value, 0);

    const byCategory: { [category: string]: number } = {};
    wastedItems.forEach(item => {
      byCategory[item.category] = (byCategory[item.category] || 0) + item.value;
    });

    const byReason: { [reason: string]: number } = {};
    wastedItems.forEach(item => {
      byReason[item.reason] = (byReason[item.reason] || 0) + item.value;
    });

    const suggestions: string[] = [];
    
    if (byReason['expired'] > totalWaste * 0.3) {
      suggestions.push('Reduce portion sizes or buy smaller quantities');
    }
    
    if (byReason['forgot'] > totalWaste * 0.2) {
      suggestions.push('Use shopping list app to track inventory');
    }

    const topWasteCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    if (topWasteCategory) {
      suggestions.push(`Focus on reducing ${topWasteCategory[0]} waste ($${topWasteCategory[1].toFixed(2)})`);
    }

    return {
      totalWaste,
      byCategory,
      byReason,
      suggestions,
    };
  }

  /**
   * Get budget performance
   */
  getBudgetPerformance(
    budget: number,
    spent: number,
    daysInPeriod: number,
    daysRemaining: number
  ): {
    percentUsed: number;
    remaining: number;
    dailyBudget: number;
    projectedOverage: number;
    status: 'on_track' | 'warning' | 'over_budget';
    recommendation: string;
  } {
    const percentUsed = (spent / budget) * 100;
    const remaining = budget - spent;
    const dailyBudget = remaining / daysRemaining;
    const projectedTotal = spent + (spent / (daysInPeriod - daysRemaining)) * daysRemaining;
    const projectedOverage = Math.max(0, projectedTotal - budget);

    let status: 'on_track' | 'warning' | 'over_budget';
    if (spent > budget) {
      status = 'over_budget';
    } else if (projectedOverage > budget * 0.1) {
      status = 'warning';
    } else {
      status = 'on_track';
    }

    const recommendation =
      status === 'over_budget'
        ? `Over budget by $${(spent - budget).toFixed(2)} - reduce spending`
        : status === 'warning'
        ? `Projected to exceed budget by $${projectedOverage.toFixed(2)} - limit to $${dailyBudget.toFixed(2)}/day`
        : `On track - $${dailyBudget.toFixed(2)}/day remaining`;

    return {
      percentUsed,
      remaining,
      dailyBudget,
      projectedOverage,
      status,
      recommendation,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const personalShopper = new PersonalShopperService();
export const energyTimeCalculator = new EnergyTimeCalculatorService();
export const historicalAnalytics = new HistoricalAnalyticsService();
