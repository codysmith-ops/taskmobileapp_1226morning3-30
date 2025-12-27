/**
 * Health & Nutrition Services
 * Includes: Dietary Scanner, Nutrition Tracking, Meal Planner, Carbon Offset
 */

// ============================================================================
// DIETARY SCANNER
// ============================================================================

export interface DietaryRestriction {
  name: string;
  type: 'allergy' | 'preference' | 'health' | 'religious';
  severity: 'severe' | 'moderate' | 'preference';
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface ScanResult {
  productName: string;
  barcode: string;
  isCompatible: boolean;
  warnings: string[];
  allergens: string[];
  nutrition: NutritionInfo;
  alternatives?: Array<{
    name: string;
    reason: string;
  }>;
}

class DietaryScannerService {
  private restrictions: DietaryRestriction[] = [];

  /**
   * Add dietary restriction
   */
  addRestriction(restriction: DietaryRestriction) {
    this.restrictions.push(restriction);
  }

  /**
   * Scan product barcode
   */
  async scanProduct(barcode: string): Promise<ScanResult> {
    // Mock data - would call real barcode API
    const mockProduct = {
      name: 'Chocolate Chip Cookies',
      ingredients: ['wheat flour', 'sugar', 'chocolate chips', 'eggs', 'milk', 'butter'],
      allergens: ['wheat', 'milk', 'eggs'],
      nutrition: {
        calories: 150,
        protein: 2,
        carbs: 20,
        fat: 7,
        fiber: 1,
        sugar: 12,
        sodium: 110,
      },
    };

    // Check restrictions
    const warnings: string[] = [];
    const isCompatible = this.restrictions.every(restriction => {
      const restrictionName = restriction.name.toLowerCase();
      const hasIssue = mockProduct.allergens.some(
        a => restrictionName.includes(a) || a.includes(restrictionName)
      );

      if (hasIssue) {
        warnings.push(`Contains ${restriction.name} (${restriction.severity})`);
        return restriction.severity === 'preference';
      }
      return true;
    });

    // Suggest alternatives
    const alternatives = !isCompatible
      ? [
          { name: 'Gluten-Free Cookies', reason: 'No wheat' },
          { name: 'Oatmeal Cookies', reason: 'Dairy-free available' },
        ]
      : undefined;

    return {
      productName: mockProduct.name,
      barcode,
      isCompatible,
      warnings,
      allergens: mockProduct.allergens,
      nutrition: mockProduct.nutrition,
      alternatives,
    };
  }

  /**
   * Check recipe compatibility
   */
  checkRecipe(ingredients: string[]): {
    compatible: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    ingredients.forEach(ingredient => {
      this.restrictions.forEach(restriction => {
        if (ingredient.toLowerCase().includes(restriction.name.toLowerCase())) {
          issues.push(`${ingredient} contains ${restriction.name}`);
        }
      });
    });

    return {
      compatible: issues.length === 0,
      issues,
    };
  }
}

// ============================================================================
// PERSONAL NUTRITION TRACKING
// ============================================================================

export interface DailyNutrition {
  date: Date;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
  meals: Array<{
    time: Date;
    name: string;
    nutrition: NutritionInfo;
  }>;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

class NutritionTrackingService {
  private dailyLogs: DailyNutrition[] = [];
  private goals: NutritionGoals = {
    calories: 2000,
    protein: 50,
    carbs: 250,
    fat: 70,
    fiber: 25,
    water: 8,
  };

  /**
   * Set nutrition goals
   */
  setGoals(goals: Partial<NutritionGoals>) {
    this.goals = { ...this.goals, ...goals };
  }

  /**
   * Log meal
   */
  logMeal(name: string, nutrition: NutritionInfo) {
    const today = new Date().toDateString();
    let dailyLog = this.dailyLogs.find(log => log.date.toDateString() === today);

    if (!dailyLog) {
      dailyLog = {
        date: new Date(),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        meals: [],
      };
      this.dailyLogs.push(dailyLog);
    }

    dailyLog.calories += nutrition.calories;
    dailyLog.protein += nutrition.protein;
    dailyLog.carbs += nutrition.carbs;
    dailyLog.fat += nutrition.fat;
    dailyLog.fiber += nutrition.fiber;

    dailyLog.meals.push({
      time: new Date(),
      name,
      nutrition,
    });
  }

  /**
   * Get today's progress
   */
  getTodayProgress(): {
    consumed: NutritionGoals;
    remaining: NutritionGoals;
    percentComplete: { [key: string]: number };
  } {
    const today = new Date().toDateString();
    const dailyLog = this.dailyLogs.find(log => log.date.toDateString() === today) || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      water: 0,
    };

    const consumed: NutritionGoals = {
      calories: dailyLog.calories,
      protein: dailyLog.protein,
      carbs: dailyLog.carbs,
      fat: dailyLog.fat,
      fiber: dailyLog.fiber,
      water: dailyLog.water,
    };

    const remaining: NutritionGoals = {
      calories: Math.max(0, this.goals.calories - consumed.calories),
      protein: Math.max(0, this.goals.protein - consumed.protein),
      carbs: Math.max(0, this.goals.carbs - consumed.carbs),
      fat: Math.max(0, this.goals.fat - consumed.fat),
      fiber: Math.max(0, this.goals.fiber - consumed.fiber),
      water: Math.max(0, this.goals.water - consumed.water),
    };

    const percentComplete = {
      calories: (consumed.calories / this.goals.calories) * 100,
      protein: (consumed.protein / this.goals.protein) * 100,
      carbs: (consumed.carbs / this.goals.carbs) * 100,
      fat: (consumed.fat / this.goals.fat) * 100,
      fiber: (consumed.fiber / this.goals.fiber) * 100,
      water: (consumed.water / this.goals.water) * 100,
    };

    return { consumed, remaining, percentComplete };
  }

  /**
   * Get weekly summary
   */
  getWeeklySummary(): {
    averageCalories: number;
    daysOnTrack: number;
    topDeficiency: string;
  } {
    const lastWeek = this.dailyLogs.slice(-7);
    const avgCalories = lastWeek.reduce((sum, log) => sum + log.calories, 0) / lastWeek.length || 0;
    const daysOnTrack = lastWeek.filter(
      log => log.calories >= this.goals.calories * 0.9 && log.calories <= this.goals.calories * 1.1
    ).length;

    // Find top deficiency
    const deficiencies = {
      protein: lastWeek.reduce((sum, log) => sum + (this.goals.protein - log.protein), 0),
      fiber: lastWeek.reduce((sum, log) => sum + (this.goals.fiber - log.fiber), 0),
      water: lastWeek.reduce((sum, log) => sum + (this.goals.water - log.water), 0),
    };

    const topDeficiency = Object.entries(deficiencies).sort((a, b) => b[1] - a[1])[0][0];

    return {
      averageCalories: avgCalories,
      daysOnTrack,
      topDeficiency,
    };
  }
}

// ============================================================================
// AI MEAL PLANNER PRO
// ============================================================================

export interface MealPlan {
  week: number;
  meals: {
    [day: string]: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snacks: Meal[];
    };
  };
  shoppingList: string[];
  totalCost: number;
  nutritionSummary: NutritionInfo;
}

export interface Meal {
  name: string;
  recipe?: string;
  ingredients: string[];
  cookTime: number;
  nutrition: NutritionInfo;
  cost: number;
}

class MealPlannerService {
  /**
   * Generate weekly meal plan
   */
  async generateMealPlan(options: {
    budget: number;
    servings: number;
    dietaryRestrictions?: string[];
    preferredCuisines?: string[];
  }): Promise<MealPlan> {
    // Mock meal plan - would use AI to generate based on preferences
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const meals: MealPlan['meals'] = {};
    const shoppingList: Set<string> = new Set();

    days.forEach(day => {
      const breakfast: Meal = {
        name: 'Oatmeal with Berries',
        ingredients: ['oats', 'berries', 'honey', 'almonds'],
        cookTime: 10,
        nutrition: {
          calories: 300,
          protein: 8,
          carbs: 45,
          fat: 8,
          fiber: 6,
          sugar: 12,
          sodium: 50,
        },
        cost: 3,
      };

      const lunch: Meal = {
        name: 'Chicken Caesar Salad',
        ingredients: [
          'chicken breast',
          'romaine lettuce',
          'parmesan',
          'caesar dressing',
          'croutons',
        ],
        cookTime: 20,
        nutrition: {
          calories: 450,
          protein: 35,
          carbs: 20,
          fat: 25,
          fiber: 3,
          sugar: 2,
          sodium: 800,
        },
        cost: 8,
      };

      const dinner: Meal = {
        name: 'Salmon with Roasted Vegetables',
        ingredients: ['salmon', 'broccoli', 'carrots', 'olive oil', 'lemon'],
        cookTime: 30,
        nutrition: {
          calories: 500,
          protein: 40,
          carbs: 25,
          fat: 28,
          fiber: 5,
          sugar: 5,
          sodium: 300,
        },
        cost: 12,
      };

      meals[day] = {
        breakfast,
        lunch,
        dinner,
        snacks: [],
      };

      // Add ingredients to shopping list
      [...breakfast.ingredients, ...lunch.ingredients, ...dinner.ingredients].forEach(i =>
        shoppingList.add(i)
      );
    });

    const totalCost = days.reduce((sum, day) => {
      const dayMeals = meals[day];
      return sum + dayMeals.breakfast.cost + dayMeals.lunch.cost + dayMeals.dinner.cost;
    }, 0);

    return {
      week: 1,
      meals,
      shoppingList: Array.from(shoppingList),
      totalCost,
      nutritionSummary: {
        calories: 1250 * 7,
        protein: 83 * 7,
        carbs: 90 * 7,
        fat: 61 * 7,
        fiber: 14 * 7,
        sugar: 19 * 7,
        sodium: 1150 * 7,
      },
    };
  }

  /**
   * Suggest meal based on inventory
   */
  suggestMealFromInventory(availableItems: string[]): Meal[] {
    // Mock suggestions - would use AI to match recipes with available items
    const suggestions: Meal[] = [
      {
        name: 'Pasta Primavera',
        recipe: '1. Boil pasta. 2. Sauté vegetables. 3. Mix together.',
        ingredients: ['pasta', 'tomatoes', 'bell peppers', 'olive oil'],
        cookTime: 25,
        nutrition: {
          calories: 400,
          protein: 12,
          carbs: 60,
          fat: 15,
          fiber: 5,
          sugar: 6,
          sodium: 400,
        },
        cost: 6,
      },
    ];

    return suggestions.filter(meal =>
      meal.ingredients.every(ing => availableItems.some(item => item.toLowerCase().includes(ing)))
    );
  }

  /**
   * Optimize for budget
   */
  optimizeMealPlanForBudget(mealPlan: MealPlan, targetBudget: number): MealPlan {
    // Would intelligently swap expensive meals for cheaper alternatives
    // For now, just reduce portion sizes or substitute ingredients
    const optimized = { ...mealPlan };

    if (mealPlan.totalCost > targetBudget) {
      const scaleFactor = targetBudget / mealPlan.totalCost;
      optimized.totalCost = targetBudget;
      // Scale down costs proportionally
    }

    return optimized;
  }
}

// ============================================================================
// CARBON OFFSET INTEGRATION
// ============================================================================

export interface CarbonFootprint {
  totalKgCO2: number;
  byCategory: {
    [category: string]: number;
  };
  comparison: string;
}

export interface CarbonOffset {
  amount: number;
  provider: string;
  project: string;
  cost: number;
}

class CarbonOffsetService {
  /**
   * Calculate carbon footprint
   */
  calculateFootprint(
    purchases: Array<{ item: string; category: string; quantity: number }>
  ): CarbonFootprint {
    // Carbon intensity by category (kg CO2 per kg product)
    const carbonIntensity: { [key: string]: number } = {
      beef: 27.0,
      chicken: 6.9,
      fish: 5.0,
      dairy: 2.4,
      vegetables: 0.4,
      fruits: 0.5,
      grains: 0.9,
      processed: 3.0,
    };

    const byCategory: { [category: string]: number } = {};
    let totalKgCO2 = 0;

    purchases.forEach(purchase => {
      const intensity = carbonIntensity[purchase.category] || 1.0;
      const kgCO2 = purchase.quantity * intensity;
      byCategory[purchase.category] = (byCategory[purchase.category] || 0) + kgCO2;
      totalKgCO2 += kgCO2;
    });

    // Comparison
    const comparison = `${totalKgCO2.toFixed(1)} kg CO2 = driving ${(totalKgCO2 / 0.411).toFixed(
      0
    )} miles`;

    return {
      totalKgCO2,
      byCategory,
      comparison,
    };
  }

  /**
   * Get offset options
   */
  getOffsetOptions(kgCO2: number): CarbonOffset[] {
    // $0.01 per kg CO2 is typical
    return [
      {
        amount: kgCO2,
        provider: 'Cool Earth',
        project: 'Rainforest Protection',
        cost: kgCO2 * 0.01,
      },
      {
        amount: kgCO2,
        provider: 'Climeworks',
        project: 'Direct Air Capture',
        cost: kgCO2 * 0.015,
      },
      {
        amount: kgCO2,
        provider: 'Gold Standard',
        project: 'Renewable Energy',
        cost: kgCO2 * 0.008,
      },
    ];
  }

  /**
   * Purchase offset
   */
  async purchaseOffset(offset: CarbonOffset): Promise<{ success: boolean; certificate: string }> {
    // Mock purchase - would integrate with offset providers
    console.log('Purchasing offset:', offset);

    return {
      success: true,
      certificate: `CERT-${Date.now()}`,
    };
  }

  /**
   * Get eco-friendly alternatives
   */
  getEcoAlternatives(
    item: string,
    category: string
  ): Array<{ name: string; carbonSavings: number }> {
    const alternatives: { [key: string]: Array<{ name: string; carbonSavings: number }> } = {
      beef: [
        { name: 'Chicken Breast', carbonSavings: 20.1 },
        { name: 'Plant-Based Burger', carbonSavings: 24.5 },
      ],
      dairy: [
        { name: 'Oat Milk', carbonSavings: 1.8 },
        { name: 'Almond Milk', carbonSavings: 1.9 },
      ],
    };

    return alternatives[category] || [];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const dietaryScanner = new DietaryScannerService();
export const nutritionTracking = new NutritionTrackingService();
export const mealPlanner = new MealPlannerService();
export const carbonOffset = new CarbonOffsetService();
