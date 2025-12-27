/**
 * All Advanced Features - Comprehensive Service
 * Includes: Store Crowding, Social Proof, Subscriptions, Store Layout, Family Allowance, and more
 */

// ============================================================================
// STORE CROWDING PREDICTOR
// ============================================================================

export interface StoreCrowdingData {
  store: string;
  currentCapacity: number; // 0-100%
  prediction: {
    hour: number;
    capacity: number;
  }[];
  bestTimes: string[];
  peakTimes: string[];
  liveUserCount?: number;
}

class StoreCrowdingService {
  /**
   * Predict store crowding
   */
  async predictCrowding(store: string, date = new Date()): Promise<StoreCrowdingData> {
    // Mock data - would use real-time data from users + historical patterns
    const dayOfWeek = date.getDay();
    const hour = date.getHours();

    // Typical patterns
    const patterns: { [key: number]: number[] } = {
      0: [
        20, 15, 10, 10, 15, 30, 50, 60, 55, 50, 45, 40, 40, 45, 50, 60, 70, 75, 60, 40, 30, 25, 20,
        15,
      ], // Sunday
      6: [
        30, 25, 20, 15, 20, 35, 55, 70, 75, 80, 75, 70, 65, 60, 65, 75, 85, 90, 75, 55, 40, 35, 30,
        25,
      ], // Saturday
    };

    const todayPattern = patterns[dayOfWeek] || [
      30, 25, 20, 15, 20, 30, 45, 60, 65, 60, 55, 50, 50, 55, 60, 70, 80, 75, 60, 45, 35, 30, 25,
      20,
    ];

    const prediction = todayPattern.map((capacity, h) => ({
      hour: h,
      capacity,
    }));

    // Find best times (capacity < 50%)
    const bestTimes = prediction
      .filter(p => p.capacity < 50)
      .map(p => `${p.hour}:00`)
      .slice(0, 3);

    // Find peak times (capacity > 70%)
    const peakTimes = prediction.filter(p => p.capacity > 70).map(p => `${p.hour}:00`);

    return {
      store,
      currentCapacity: todayPattern[hour],
      prediction,
      bestTimes,
      peakTimes,
      liveUserCount: Math.floor((todayPattern[hour] / 100) * 150), // Assume 150 capacity
    };
  }

  /**
   * Get recommendation
   */
  getRecommendation(crowding: StoreCrowdingData): string {
    if (crowding.currentCapacity > 80) {
      return `Very busy now (${crowding.currentCapacity}%). Best time: ${crowding.bestTimes[0]}`;
    } else if (crowding.currentCapacity > 60) {
      return `Moderately busy (${crowding.currentCapacity}%). Wait 1-2 hours for less crowds`;
    } else {
      return `Good time to shop (${crowding.currentCapacity}% full)`;
    }
  }
}

// ============================================================================
// SOCIAL PROOF & REVIEWS
// ============================================================================

export interface SocialReview {
  productId: string;
  productName: string;
  reviewer: {
    id: string;
    name: string;
    relationship: 'friend' | 'family' | 'following';
  };
  rating: number;
  review?: string;
  purchaseDate: Date;
  recommended: boolean;
}

export interface SocialProof {
  friendsBought: number;
  friendsRecommend: number;
  alternativeSuggestions: Array<{
    product: string;
    friendCount: number;
    avgRating: number;
  }>;
  reviews: SocialReview[];
}

class SocialProofService {
  /**
   * Get social proof for product
   */
  async getSocialProof(productId: string): Promise<SocialProof> {
    // Mock data - would fetch from social graph
    const friends = [
      { id: '1', name: 'Sarah', relationship: 'friend' as const },
      { id: '2', name: 'Mom', relationship: 'family' as const },
      { id: '3', name: 'John', relationship: 'following' as const },
    ];

    const reviews: SocialReview[] = friends.map(friend => ({
      productId,
      productName: 'Organic Whole Milk',
      reviewer: friend,
      rating: Math.random() > 0.5 ? 5 : 4,
      review: Math.random() > 0.5 ? 'Great quality!' : undefined,
      purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      recommended: Math.random() > 0.3,
    }));

    const friendsBought = reviews.length;
    const friendsRecommend = reviews.filter(r => r.recommended).length;

    return {
      friendsBought,
      friendsRecommend,
      alternativeSuggestions: [{ product: 'Horizon Organic Milk', friendCount: 2, avgRating: 4.5 }],
      reviews,
    };
  }

  /**
   * Share purchase with friends
   */
  async sharePurchase(productId: string, rating: number, review?: string) {
    console.log('Sharing purchase:', { productId, rating, review });
    // Would save to social graph
  }
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

export interface Subscription {
  id: string;
  service: string;
  type: 'grocery' | 'meal_kit' | 'delivery' | 'other';
  amount: number;
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextBilling: Date;
  autoRenew: boolean;
  items?: string[];
}

class SubscriptionManagerService {
  private subscriptions: Subscription[] = [];

  /**
   * Add subscription
   */
  addSubscription(sub: Omit<Subscription, 'id'>): Subscription {
    const subscription: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`,
    };
    this.subscriptions.push(subscription);
    return subscription;
  }

  /**
   * Get all subscriptions
   */
  getAllSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  /**
   * Get total monthly cost
   */
  getMonthlyTotal(): number {
    return this.subscriptions.reduce((total, sub) => {
      const multiplier = {
        weekly: 4.33,
        monthly: 1,
        yearly: 1 / 12,
      };
      return total + sub.amount * multiplier[sub.frequency];
    }, 0);
  }

  /**
   * Get upcoming renewals
   */
  getUpcomingRenewals(days = 7): Subscription[] {
    const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    return this.subscriptions.filter(sub => sub.nextBilling <= futureDate);
  }

  /**
   * Cancel subscription
   */
  cancelSubscription(id: string) {
    const sub = this.subscriptions.find(s => s.id === id);
    if (sub) {
      sub.autoRenew = false;
    }
  }

  /**
   * Compare with in-store
   */
  compareWithInStore(subscriptionId: string): {
    subscriptionCost: number;
    inStoreCost: number;
    savings: number;
    recommendation: string;
  } {
    const sub = this.subscriptions.find(s => s.id === subscriptionId);
    if (!sub || !sub.items) {
      throw new Error('Subscription not found or no items');
    }

    // Mock calculation
    const subscriptionCost = sub.amount;
    const inStoreCost = subscriptionCost * 0.85; // Assume in-store is 15% cheaper
    const savings = subscriptionCost - inStoreCost;

    return {
      subscriptionCost,
      inStoreCost,
      savings,
      recommendation:
        savings > 5
          ? `Cancel subscription and buy in-store to save $${savings.toFixed(2)}/month`
          : `Subscription saves time, worth the $${Math.abs(savings).toFixed(2)} premium`,
    };
  }
}

// ============================================================================
// STORE LAYOUT MEMORY
// ============================================================================

export interface StoreLayout {
  store: string;
  location: string;
  items: {
    [itemName: string]: {
      aisle: number;
      section: string;
      position: string;
      lastSeen: Date;
      confidence: number;
    };
  };
}

class StoreLayoutService {
  private layouts: { [storeId: string]: StoreLayout } = {};

  /**
   * Save item location
   */
  saveItemLocation(
    storeId: string,
    storeName: string,
    itemName: string,
    aisle: number,
    section: string,
    position: string
  ) {
    if (!this.layouts[storeId]) {
      this.layouts[storeId] = {
        store: storeName,
        location: storeId,
        items: {},
      };
    }

    this.layouts[storeId].items[itemName] = {
      aisle,
      section,
      position,
      lastSeen: new Date(),
      confidence: 1.0,
    };
  }

  /**
   * Get item location
   */
  getItemLocation(storeId: string, itemName: string): string | null {
    const layout = this.layouts[storeId];
    if (!layout || !layout.items[itemName]) {
      return null;
    }

    const item = layout.items[itemName];
    return `Aisle ${item.aisle}, ${item.section}, ${item.position}`;
  }

  /**
   * Get shopping route
   */
  getOptimalRoute(storeId: string, items: string[]): string[] {
    const layout = this.layouts[storeId];
    if (!layout) {
      return items;
    }

    // Sort by aisle number
    return items.sort((a, b) => {
      const aisleA = layout.items[a]?.aisle || 999;
      const aisleB = layout.items[b]?.aisle || 999;
      return aisleA - aisleB;
    });
  }

  /**
   * Estimate shopping time
   */
  estimateShoppingTime(storeId: string, items: string[]): number {
    const layout = this.layouts[storeId];
    if (!layout) {
      return items.length * 2; // 2 minutes per item
    }

    const route = this.getOptimalRoute(storeId, items);
    const uniqueAisles = new Set(
      route.map(item => layout.items[item]?.aisle).filter(a => a !== undefined)
    ).size;

    // 1 minute per aisle + 30 seconds per item
    return uniqueAisles * 1 + items.length * 0.5;
  }
}

// ============================================================================
// FAMILY ALLOWANCE SYSTEM
// ============================================================================

export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'partner';
  monthlyAllowance: number;
  currentSpent: number;
}

export interface PurchaseRequest {
  id: string;
  memberId: string;
  item: string;
  amount: number;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: Date;
}

class FamilyAllowanceService {
  private members: FamilyMember[] = [];
  private requests: PurchaseRequest[] = [];

  /**
   * Add family member
   */
  addMember(member: Omit<FamilyMember, 'id' | 'currentSpent'>): FamilyMember {
    const newMember: FamilyMember = {
      ...member,
      id: `member-${Date.now()}`,
      currentSpent: 0,
    };
    this.members.push(newMember);
    return newMember;
  }

  /**
   * Set monthly allowance
   */
  setAllowance(memberId: string, amount: number) {
    const member = this.members.find(m => m.id === memberId);
    if (member) {
      member.monthlyAllowance = amount;
    }
  }

  /**
   * Request purchase approval
   */
  requestPurchase(
    memberId: string,
    item: string,
    amount: number,
    reason?: string
  ): PurchaseRequest {
    const request: PurchaseRequest = {
      id: `req-${Date.now()}`,
      memberId,
      item,
      amount,
      reason,
      status: 'pending',
      requestedAt: new Date(),
    };
    this.requests.push(request);
    return request;
  }

  /**
   * Approve/deny request
   */
  respondToRequest(requestId: string, approved: boolean) {
    const request = this.requests.find(r => r.id === requestId);
    if (!request) {
      return;
    }

    request.status = approved ? 'approved' : 'denied';

    if (approved) {
      const member = this.members.find(m => m.id === request.memberId);
      if (member) {
        member.currentSpent += request.amount;
      }
    }
  }

  /**
   * Get pending requests
   */
  getPendingRequests(): PurchaseRequest[] {
    return this.requests.filter(r => r.status === 'pending');
  }

  /**
   * Get member status
   */
  getMemberStatus(memberId: string): {
    remaining: number;
    spent: number;
    allowance: number;
    percentUsed: number;
  } | null {
    const member = this.members.find(m => m.id === memberId);
    if (!member) {
      return null;
    }

    const remaining = member.monthlyAllowance - member.currentSpent;
    const percentUsed = (member.currentSpent / member.monthlyAllowance) * 100;

    return {
      remaining,
      spent: member.currentSpent,
      allowance: member.monthlyAllowance,
      percentUsed,
    };
  }

  /**
   * Reset monthly (call on 1st of month)
   */
  resetMonthly() {
    this.members.forEach(member => {
      member.currentSpent = 0;
    });
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const storeCrowding = new StoreCrowdingService();
export const socialProof = new SocialProofService();
export const subscriptionManager = new SubscriptionManagerService();
export const storeLayout = new StoreLayoutService();
export const familyAllowance = new FamilyAllowanceService();
