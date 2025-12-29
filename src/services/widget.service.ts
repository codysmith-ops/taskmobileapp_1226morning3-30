/**
 * Native Widget Integration
 * Syncs shopping list data with iOS Widget
 */

import { NativeModules } from 'react-native';

const { WidgetBridge } = NativeModules;

interface ShoppingItem {
  id: string;
  title: string;
  completed: boolean;
}

interface WidgetData {
  items: ShoppingItem[];
}

export const WidgetService = {
  /**
   * Update widget with latest shopping list
   */
  async updateWidget(items: ShoppingItem[]): Promise<void> {
    try {
      const widgetData: WidgetData = { items: items.slice(0, 10) }; // Limit to 10 items
      await WidgetBridge.updateWidgetData(widgetData);
      console.log('✅ Widget updated successfully');
    } catch (error) {
      console.error('❌ Failed to update widget:', error);
    }
  },

  /**
   * Get current widget data
   */
  async getWidgetData(): Promise<WidgetData | null> {
    try {
      const data = await WidgetBridge.getWidgetData();
      return data;
    } catch (error) {
      console.error('❌ Failed to get widget data:', error);
      return null;
    }
  },
};
