/**
 * Savings Goals Service
 * Track and manage grocery savings goals (weekly/monthly)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavingsGoal {
  id: string;
  type: 'weekly' | 'monthly';
  targetAmount: number;
  currentSaved: number;
  startDate: string;
  endDate: string;
  category: 'groceries' | 'all';
  isActive: boolean;
}

export interface GoalProgress {
  goal: SavingsGoal;
  percentComplete: number;
  daysRemaining: number;
  onTrack: boolean;
  projectedSavings: number;
  averageDailySavings: number;
}

const STORAGE_KEY_GOALS = 'ellio_savings_goals';

/**
 * Create a new savings goal
 */
export async function createSavingsGoal(
  type: 'weekly' | 'monthly',
  targetAmount: number,
  category: 'groceries' | 'all' = 'groceries'
): Promise<SavingsGoal> {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  if (type === 'weekly') {
    endDate.setDate(startDate.getDate() + 7);
  } else {
    endDate.setMonth(startDate.getMonth() + 1);
  }
  
  const goal: SavingsGoal = {
    id: `goal_${Date.now()}`,
    type,
    targetAmount,
    currentSaved: 0,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    category,
    isActive: true,
  };
  
  await saveGoal(goal);
  return goal;
}

/**
 * Update goal progress with new savings
 */
export async function updateGoalProgress(goalId: string, additionalSavings: number): Promise<void> {
  const goals = await getAllGoals();
  const goal = goals.find(g => g.id === goalId);
  
  if (goal) {
    goal.currentSaved += additionalSavings;
    await saveGoal(goal);
  }
}

/**
 * Get current active goal
 */
export async function getActiveGoal(): Promise<SavingsGoal | null> {
  const goals = await getAllGoals();
  const now = new Date();
  
  // Find active goal that hasn't expired
  const activeGoal = goals.find(
    g => g.isActive && new Date(g.endDate) > now
  );
  
  return activeGoal || null;
}

/**
 * Calculate goal progress
 */
export async function calculateGoalProgress(goal: SavingsGoal): Promise<GoalProgress> {
  const now = new Date();
  const endDate = new Date(goal.endDate);
  const startDate = new Date(goal.startDate);
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  
  const percentComplete = (goal.currentSaved / goal.targetAmount) * 100;
  const averageDailySavings = daysElapsed > 0 ? goal.currentSaved / daysElapsed : 0;
  const projectedSavings = averageDailySavings * totalDays;
  const onTrack = projectedSavings >= goal.targetAmount;
  
  return {
    goal,
    percentComplete: Math.min(100, percentComplete),
    daysRemaining,
    onTrack,
    projectedSavings,
    averageDailySavings,
  };
}

/**
 * Get goal status message
 */
export function getGoalStatusMessage(progress: GoalProgress): string {
  if (progress.percentComplete >= 100) {
    return `🎉 Goal achieved! You saved $${progress.goal.currentSaved.toFixed(2)}!`;
  }
  
  if (progress.onTrack) {
    return `You're on track! At this rate, you'll hit your goal by ${new Date(progress.goal.endDate).toLocaleDateString()}`;
  }
  
  if (progress.daysRemaining === 0) {
    return `Goal period ended. You saved $${progress.goal.currentSaved.toFixed(2)} of $${progress.goal.targetAmount.toFixed(2)}`;
  }
  
  const amountNeeded = progress.goal.targetAmount - progress.goal.currentSaved;
  const dailyNeeded = amountNeeded / progress.daysRemaining;
  return `Need $${dailyNeeded.toFixed(2)}/day to reach goal (${progress.daysRemaining} days left)`;
}

/**
 * Save goal to storage
 */
async function saveGoal(goal: SavingsGoal): Promise<void> {
  try {
    const goals = await getAllGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    
    await AsyncStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save savings goal:', error);
  }
}

/**
 * Get all goals
 */
async function getAllGoals(): Promise<SavingsGoal[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY_GOALS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load savings goals:', error);
    return [];
  }
}

/**
 * Delete goal
 */
export async function deleteGoal(goalId: string): Promise<void> {
  try {
    const goals = await getAllGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    await AsyncStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete goal:', error);
  }
}
