import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';

export type NavPreference = 'apple' | 'google' | 'waze';

export type UserGoal =
  | 'save-money'
  | 'credit-points'
  | 'budget'
  | 'collaborate'
  | 'organize'
  | 'efficiency';

export type TaskCategory =
  | 'groceries'
  | 'hardware'
  | 'errands'
  | 'medical'
  | 'shopping'
  | 'returns'
  | 'dental'
  | 'chiropractic'
  | 'automotive'
  | 'home-maintenance'
  | 'pet-care'
  | 'fitness'
  | 'pharmacy'
  | 'beauty';

export type CustomCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type UserPreferences = {
  goals: UserGoal[];
  budgetAmount?: number;
  budgetPeriod?: 'weekly' | 'monthly';
  weeklySavingsGoal?: number;
  automatedShoppingEnabled?: boolean;
  creditCards?: Array<{ name: string; rewardsType: string }>;
  collaborators?: Array<{ id: string; name: string; email: string }>;
  customCategories?: CustomCategory[];
  aiSuggestionsEnabled: boolean;
  dealAlertsEnabled: boolean;
  priceComparisonEnabled: boolean;
  loyaltyProgramsEnabled: boolean;
  autoReceiptUploadEnabled: boolean;
  geofencingEnabled: boolean;
  autoCompleteRadius: number; // meters
};

export type Comment = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
};

export type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  category?: TaskCategory | string; // TaskCategory or custom category ID
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  imageUri?: string;
  productBrand?: string;
  productDetails?: string;
  quantity?: number;
  dueDate?: number;
  priority?: 'low' | 'medium' | 'high';
  createdBy?: string;
  sharedWith?: string[];
  comments?: Comment[];
  lastModified?: number;
  createdAt?: number;
  needsReimbursement?: boolean;
  receiptUri?: string;
  storeName?: string;
  storeLatitude?: number;
  storeLongitude?: number;
  completedAt?: number;
};

type AddTaskInput = {
  title: string;
  note?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  imageUri?: string;
  productBrand?: string;
  productDetails?: string;
  quantity?: number;
  dueDate?: number;
  priority?: 'low' | 'medium' | 'high';
};

type TodoStore = {
  tasks: Task[];
  navPreference: NavPreference;
  currentUserId?: string;
  currentUserName?: string;
  storePreferences: Record<string, string[]>; // category -> store IDs
  categoriesWithStorePrefs: Set<string>;
  userPreferences?: UserPreferences;
  addTask: (input: AddTaskInput) => void;
  toggleComplete: (id: string) => void;
  removeTask: (id: string) => void;
  setNavPreference: (value: NavPreference) => void;
  updateTaskLocation: (
    id: string,
    location: { locationLabel?: string; latitude?: number; longitude?: number }
  ) => void;
  addComment: (taskId: string, text: string) => void;
  shareTask: (taskId: string, appleId: string) => void;
  setCurrentUser: (userId: string, userName: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setStorePreferences: (category: string, stores: string[]) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  attachReceipt: (taskId: string, receiptUri: string) => void;
  getTasksNearLocation: (lat: number, lon: number) => Task[];
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  navPreference: 'apple',
  currentUserId: undefined,
  currentUserName: undefined,
  storePreferences: {},
  categoriesWithStorePrefs: new Set(),
  userPreferences: undefined,
  addTask: input => {
    const state = get();
    const task: Task = {
      id: nanoid(),
      title: input.title,
      note: input.note,
      locationLabel: input.locationLabel,
      latitude: input.latitude,
      longitude: input.longitude,
      imageUri: input.imageUri,
      productBrand: input.productBrand,
      productDetails: input.productDetails,
      quantity: input.quantity,
      dueDate: input.dueDate,
      priority: input.priority || 'medium',
      completed: false,
      createdBy: state.currentUserId,
      sharedWith: [],
      comments: [],
      lastModified: Date.now(),
      createdAt: Date.now(),
    };
    set(state => ({ tasks: [task, ...state.tasks] }));
  },
  toggleComplete: id => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed, lastModified: Date.now() } : task
      ),
    }));
  },
  removeTask: id => {
    set(state => ({ tasks: state.tasks.filter(task => task.id !== id) }));
  },
  setNavPreference: value => set({ navPreference: value }),
  updateTaskLocation: (id, location) => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === id ? { ...task, ...location, lastModified: Date.now() } : task
      ),
    }));
  },
  addComment: (taskId, text) => {
    const state = get();
    set({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              comments: [
                ...(task.comments || []),
                {
                  id: nanoid(),
                  userId: state.currentUserId || 'anonymous',
                  userName: state.currentUserName || 'Anonymous',
                  text,
                  timestamp: Date.now(),
                },
              ],
              lastModified: Date.now(),
            }
          : task
      ),
    });
  },
  shareTask: (taskId, appleId) => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              sharedWith: [...(task.sharedWith || []), appleId],
              lastModified: Date.now(),
            }
          : task
      ),
    }));
  },
  setCurrentUser: (userId, userName) => {
    set({ currentUserId: userId, currentUserName: userName });
  },
  updateTask: (taskId, updates) => {
    set(state => ({
      tasks: state.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates, lastModified: Date.now() } : task
      ),
    }));
  },
  setStorePreferences: (category, stores) => {
    set(state => {
      const newCategoriesWithStorePrefs = new Set(state.categoriesWithStorePrefs);
      newCategoriesWithStorePrefs.add(category);
      return {
        storePreferences: {
          ...state.storePreferences,
          [category]: stores,
        },
        categoriesWithStorePrefs: newCategoriesWithStorePrefs,
      };
    });
  },
  setUserPreferences: preferences => {
    set({ userPreferences: preferences });
  },
  attachReceipt: (taskId, receiptUri) => {
    set(state => ({
      tasks: state.tasks.map(task => (task.id === taskId ? { ...task, receiptUri } : task)),
    }));
  },
  getTasksNearLocation: (lat, lon) => {
    const state = get();
    const tasksNearby: Task[] = [];
    const radius = state.userPreferences?.autoCompleteRadius || 100;

    state.tasks.forEach(task => {
      if (!task.completed && task.storeLatitude && task.storeLongitude) {
        const distance = getDistance(lat, lon, task.storeLatitude, task.storeLongitude);

        if (distance <= radius) {
          tasksNearby.push(task);
        }
      }
    });

    return tasksNearby;
  },
}));

// Haversine formula for distance calculation
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
