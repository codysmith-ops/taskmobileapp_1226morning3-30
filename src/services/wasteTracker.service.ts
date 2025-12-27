/**
 * Waste Tracking Service
 * Track food waste, calculate costs, suggest improvements
 */

export interface WastedItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  purchaseDate: Date;
  wasteDate: Date;
  reason: 'expired' | 'spoiled' | 'too_much' | 'forgot' | 'dont_like' | 'other';
  photo?: string;
}

export interface WasteAnalytics {
  totalItemsWasted: number;
  totalMoneyWasted: number;
  wasteByCategory: { [category: string]: { items: number; cost: number } };
  wasteByReason: { [reason: string]: { items: number; cost: number } };
  topWastedItems: Array<{ name: string; count: number; totalCost: number }>;
  wasteTrend: 'increasing' | 'decreasing' | 'stable';
  suggestions: string[];
}

export interface WasteSuggestion {
  type: 'portion_size' | 'storage_method' | 'meal_plan' | 'freeze' | 'alternative';
  item: string;
  suggestion: string;
  potentialSavings: number;
}

class WasteTrackingService {
  private wastedItems: WastedItem[] = [];

  /**
   * Log wasted item
   */
  async logWastedItem(item: Omit<WastedItem, 'id'>): Promise<WastedItem> {
    const wastedItem: WastedItem = {
      ...item,
      id: `waste-${Date.now()}`,
    };

    this.wastedItems.push(wastedItem);
    
    // Generate immediate suggestion
    const suggestion = this.generateSuggestion(wastedItem);
    if (suggestion) {
      console.log('Suggestion:', suggestion);
    }

    return wastedItem;
  }

  /**
   * Scan item being thrown away
   */
  async scanWastedItem(barcode: string): Promise<WastedItem | null> {
    // Mock product lookup - would integrate with barcode service
    const product = {
      name: 'Organic Lettuce',
      category: 'Produce',
      price: 3.99,
    };

    return this.logWastedItem({
      name: product.name,
      category: product.category,
      quantity: 1,
      price: product.price,
      purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      wasteDate: new Date(),
      reason: 'spoiled',
    });
  }

  /**
   * Get waste analytics
   */
  getWasteAnalytics(period: 'week' | 'month' | 'year' = 'month'): WasteAnalytics {
    const periodMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };

    const cutoffDate = new Date(Date.now() - periodMs[period]);
    const relevantWaste = this.wastedItems.filter(item => item.wasteDate >= cutoffDate);

    // Total stats
    const totalItemsWasted = relevantWaste.length;
    const totalMoneyWasted = relevantWaste.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // By category
    const wasteByCategory: { [key: string]: { items: number; cost: number } } = {};
    relevantWaste.forEach(item => {
      if (!wasteByCategory[item.category]) {
        wasteByCategory[item.category] = { items: 0, cost: 0 };
      }
      wasteByCategory[item.category].items += item.quantity;
      wasteByCategory[item.category].cost += item.price * item.quantity;
    });

    // By reason
    const wasteByReason: { [key: string]: { items: number; cost: number } } = {};
    relevantWaste.forEach(item => {
      if (!wasteByReason[item.reason]) {
        wasteByReason[item.reason] = { items: 0, cost: 0 };
      }
      wasteByReason[item.reason].items += item.quantity;
      wasteByReason[item.reason].cost += item.price * item.quantity;
    });

    // Top wasted items
    const itemCounts: { [name: string]: { count: number; totalCost: number } } = {};
    relevantWaste.forEach(item => {
      if (!itemCounts[item.name]) {
        itemCounts[item.name] = { count: 0, totalCost: 0 };
      }
      itemCounts[item.name].count += item.quantity;
      itemCounts[item.name].totalCost += item.price * item.quantity;
    });

    const topWastedItems = Object.entries(itemCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 5);

    // Trend analysis
    const wasteTrend = this.calculateWasteTrend(period);

    // Generate suggestions
    const suggestions = this.generateSuggestions(relevantWaste);

    return {
      totalItemsWasted,
      totalMoneyWasted,
      wasteByCategory,
      wasteByReason,
      topWastedItems,
      wasteTrend,
      suggestions,
    };
  }

  private calculateWasteTrend(period: 'week' | 'month' | 'year'): 'increasing' | 'decreasing' | 'stable' {
    // Simple trend: compare last period to previous period
    const periodMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };

    const now = Date.now();
    const currentPeriodStart = now - periodMs[period];
    const previousPeriodStart = currentPeriodStart - periodMs[period];

    const currentWaste = this.wastedItems.filter(
      item => item.wasteDate.getTime() >= currentPeriodStart
    ).length;

    const previousWaste = this.wastedItems.filter(
      item => item.wasteDate.getTime() >= previousPeriodStart && 
             item.wasteDate.getTime() < currentPeriodStart
    ).length;

    const difference = currentWaste - previousWaste;
    const percentChange = previousWaste > 0 ? (difference / previousWaste) * 100 : 0;

    if (Math.abs(percentChange) < 10) return 'stable';
    return percentChange > 0 ? 'increasing' : 'decreasing';
  }

  private generateSuggestions(wastedItems: WastedItem[]): string[] {
    const suggestions: string[] = [];

    // Analyze patterns
    const lettucewaste = wastedItems.filter(item => 
      item.name.toLowerCase().includes('lettuce') || 
      item.name.toLowerCase().includes('salad')
    ).length;

    if (lettucewaste >= 3) {
      suggestions.push(`You've thrown out lettuce ${lettucewaste} times. Try buying smaller portions or pre-washed bags`);
    }

    // Check for 'too_much' reason
    const tooMuch = wastedItems.filter(item => item.reason === 'too_much');
    if (tooMuch.length >= 5) {
      const categories = [...new Set(tooMuch.map(i => i.category))];
      suggestions.push(`You often buy too much in: ${categories.join(', ')}. Consider smaller packages`);
    }

    // Check for expiry
    const expired = wastedItems.filter(item => item.reason === 'expired');
    if (expired.length >= 5) {
      suggestions.push(`${expired.length} items expired. Set up expiry alerts to use items before they go bad`);
    }

    // Check for 'forgot' reason
    const forgot = wastedItems.filter(item => item.reason === 'forgot');
    if (forgot.length >= 3) {
      suggestions.push(`You forgot about ${forgot.length} items. Try organizing your fridge better or using meal plans`);
    }

    // Money wasted
    const totalWasted = wastedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (totalWasted > 50) {
      suggestions.push(`You've wasted $${totalWasted.toFixed(2)} worth of food. See recommendations below to save money`);
    }

    return suggestions;
  }

  private generateSuggestion(item: WastedItem): WasteSuggestion | null {
    // Portion size suggestion
    if (item.reason === 'too_much') {
      return {
        type: 'portion_size',
        item: item.name,
        suggestion: `Consider buying smaller portions of ${item.name}. You could save $${(item.price * 0.5).toFixed(2)} per trip`,
        potentialSavings: item.price * 0.5,
      };
    }

    // Storage suggestion
    if (item.reason === 'spoiled' && item.category === 'Produce') {
      return {
        type: 'storage_method',
        item: item.name,
        suggestion: `${item.name} spoiled. Try storing in the crisper drawer or using produce saver containers`,
        potentialSavings: item.price,
      };
    }

    // Freeze suggestion
    if (item.reason === 'expired' && ['Meat', 'Bread', 'Dairy'].includes(item.category)) {
      return {
        type: 'freeze',
        item: item.name,
        suggestion: `${item.name} expired. Next time, freeze extra portions to extend shelf life`,
        potentialSavings: item.price,
      };
    }

    // Meal plan suggestion
    if (item.reason === 'forgot') {
      return {
        type: 'meal_plan',
        item: item.name,
        suggestion: `You forgot about ${item.name}. Try planning meals that use this ingredient`,
        potentialSavings: item.price,
      };
    }

    return null;
  }

  /**
   * Get personalized shopping recommendations based on waste
   */
  getSmartShoppingRecommendations(): Array<{
    item: string;
    recommendation: string;
    reasoning: string;
  }> {
    const recommendations: Array<{
      item: string;
      recommendation: string;
      reasoning: string;
    }> = [];

    // Find frequently wasted items
    const itemCounts: { [name: string]: number } = {};
    this.wastedItems.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
    });

    Object.entries(itemCounts).forEach(([item, count]) => {
      if (count >= 3) {
        recommendations.push({
          item,
          recommendation: `Buy smaller portions or skip this item`,
          reasoning: `You've thrown out ${item} ${count} times`,
        });
      }
    });

    return recommendations;
  }

  /**
   * Calculate environmental impact
   */
  getEnvironmentalImpact(): {
    co2Saved: number;
    waterSaved: number;
    landfillDiverted: number;
  } {
    // Average waste: 1 lb food = 0.7 kg CO2
    const totalWeight = this.wastedItems.reduce((sum, item) => sum + item.quantity * 0.5, 0); // Assume 0.5 lb per item
    
    return {
      co2Saved: totalWeight * 0.7, // kg CO2
      waterSaved: totalWeight * 25, // gallons
      landfillDiverted: totalWeight, // pounds
    };
  }

  /**
   * Get waste history
   */
  getWasteHistory(limit = 50): WastedItem[] {
    return this.wastedItems
      .sort((a, b) => b.wasteDate.getTime() - a.wasteDate.getTime())
      .slice(0, limit);
  }

  /**
   * Delete waste record
   */
  deleteWasteRecord(id: string) {
    this.wastedItems = this.wastedItems.filter(item => item.id !== id);
  }
}

export const wasteTracker = new WasteTrackingService();
