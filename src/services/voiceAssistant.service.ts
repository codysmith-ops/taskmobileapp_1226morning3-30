/**
 * Voice Shopping Assistant Service
 * Conversational AI for hands-free shopping
 */

import Voice from '@react-native-voice/voice';

export interface VoiceCommand {
  command: string;
  intent:
    | 'add_item'
    | 'check_deals'
    | 'find_store'
    | 'navigate'
    | 'check_list'
    | 'price_check'
    | 'smart_suggestion';
  entities: {
    item?: string;
    store?: string;
    quantity?: number;
    location?: string;
  };
  confidence: number;
}

export interface VoiceResponse {
  text: string;
  action?: () => void;
  data?: unknown;
}

class VoiceAssistantService {
  private isListening = false;
  private conversationContext: string[] = [];

  async initialize() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechError = this.onSpeechError;
  }

  private onSpeechStart = () => {
    this.isListening = true;
  };

  private onSpeechEnd = () => {
    this.isListening = false;
  };

  private onSpeechResults = (e: { value?: string[] }) => {
    const transcript = e.value?.[0];
    if (transcript) {
      this.processCommand(transcript);
    }
  };

  private onSpeechError = (e: { error?: { message?: string; code?: string } }) => {
    console.error('Voice error:', e.error?.message || e);
    this.isListening = false;
  };

  async startListening() {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Failed to start voice:', error);
    }
  }

  async stopListening() {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Failed to stop voice:', error);
    }
  }

  /**
   * Parse natural language command into structured intent
   */
  parseCommand(text: string): VoiceCommand {
    const lowerText = text.toLowerCase();

    // Add item intent
    if (lowerText.includes('add') || lowerText.includes('put')) {
      return this.parseAddIntent(lowerText);
    }

    // Check deals intent
    if (
      lowerText.includes('sale') ||
      lowerText.includes('deal') ||
      lowerText.includes('discount')
    ) {
      return this.parseDealsIntent(lowerText);
    }

    // Find store intent
    if (lowerText.includes('where') || lowerText.includes('find') || lowerText.includes('locate')) {
      return this.parseFindStoreIntent(lowerText);
    }

    // Navigation intent
    if (
      lowerText.includes('navigate') ||
      lowerText.includes('directions') ||
      lowerText.includes('take me')
    ) {
      return this.parseNavigationIntent(lowerText);
    }

    // Check list intent
    if (
      lowerText.includes("what's on") ||
      lowerText.includes('show list') ||
      lowerText.includes('my list')
    ) {
      return this.parseCheckListIntent(lowerText);
    }

    // Price check intent
    if (
      lowerText.includes('price') ||
      lowerText.includes('cost') ||
      lowerText.includes('how much')
    ) {
      return this.parsePriceCheckIntent(lowerText);
    }

    // Smart suggestion
    if (
      lowerText.includes('suggest') ||
      lowerText.includes('recommend') ||
      lowerText.includes('should i buy')
    ) {
      return this.parseSuggestionIntent(lowerText);
    }

    return {
      command: text,
      intent: 'add_item',
      entities: {},
      confidence: 0.3,
    };
  }

  private parseAddIntent(text: string): VoiceCommand {
    // Extract item name
    const addPatterns = [/add (.*?) to/i, /put (.*?) on/i, /add (.*)/i];

    let item = '';
    let store = '';
    let quantity = 1;

    for (const pattern of addPatterns) {
      const match = text.match(pattern);
      if (match) {
        item = match[1];
        break;
      }
    }

    // Extract quantity
    const quantityMatch = text.match(/(\d+)\s+/);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[1]);
      item = item.replace(quantityMatch[0], '');
    }

    // Extract store
    const storeMatch = text.match(/(?:at|from)\s+(\w+)/i);
    if (storeMatch) {
      store = storeMatch[1];
    }

    return {
      command: text,
      intent: 'add_item',
      entities: { item, store, quantity },
      confidence: item ? 0.9 : 0.5,
    };
  }

  private parseDealsIntent(text: string): VoiceCommand {
    const storeMatch = text.match(/(?:at|from)\s+(\w+)/i);
    const store = storeMatch ? storeMatch[1] : '';

    return {
      command: text,
      intent: 'check_deals',
      entities: { store },
      confidence: 0.85,
    };
  }

  private parseFindStoreIntent(text: string): VoiceCommand {
    const storeMatch = text.match(/(?:find|where|locate)\s+(?:a\s+)?(\w+)/i);
    const store = storeMatch ? storeMatch[1] : '';

    return {
      command: text,
      intent: 'find_store',
      entities: { store },
      confidence: store ? 0.9 : 0.6,
    };
  }

  private parseNavigationIntent(text: string): VoiceCommand {
    const storeMatch = text.match(/(?:to|navigate to)\s+(\w+)/i);
    const store = storeMatch ? storeMatch[1] : '';

    return {
      command: text,
      intent: 'navigate',
      entities: { store },
      confidence: store ? 0.9 : 0.6,
    };
  }

  private parseCheckListIntent(text: string): VoiceCommand {
    return {
      command: text,
      intent: 'check_list',
      entities: {},
      confidence: 0.95,
    };
  }

  private parsePriceCheckIntent(text: string): VoiceCommand {
    const itemMatch = text.match(/(?:price of|cost of|how much is)\s+(.*?)(?:\s+at|\s+cost|$)/i);
    const item = itemMatch ? itemMatch[1] : '';

    const storeMatch = text.match(/(?:at|from)\s+(\w+)/i);
    const store = storeMatch ? storeMatch[1] : '';

    return {
      command: text,
      intent: 'price_check',
      entities: { item, store },
      confidence: item ? 0.85 : 0.5,
    };
  }

  private parseSuggestionIntent(text: string): VoiceCommand {
    return {
      command: text,
      intent: 'smart_suggestion',
      entities: {},
      confidence: 0.8,
    };
  }

  /**
   * Process command and generate response
   */
  async processCommand(text: string): Promise<VoiceResponse> {
    const command = this.parseCommand(text);
    this.conversationContext.push(text);

    switch (command.intent) {
      case 'add_item':
        return this.handleAddItem(command);

      case 'check_deals':
        return this.handleCheckDeals(command);

      case 'find_store':
        return this.handleFindStore(command);

      case 'navigate':
        return this.handleNavigation(command);

      case 'check_list':
        return this.handleCheckList(command);

      case 'price_check':
        return this.handlePriceCheck(command);

      case 'smart_suggestion':
        return this.handleSmartSuggestion(command);

      default:
        return {
          text: "I'm not sure what you mean. Try saying 'add milk' or 'what's on sale at Target?'",
        };
    }
  }

  private async handleAddItem(command: VoiceCommand): Promise<VoiceResponse> {
    const { item, store, quantity } = command.entities;

    if (!item) {
      return { text: 'What would you like to add?' };
    }

    const quantityText = quantity && quantity > 1 ? `${quantity} ` : '';
    const storeText = store ? ` at ${store}` : '';

    return {
      text: `Added ${quantityText}${item}${storeText} to your list`,
      action: () => {
        // Hook to add item to store
        console.log('Adding item:', { item, store, quantity });
      },
      data: { item, store, quantity },
    };
  }

  private async handleCheckDeals(command: VoiceCommand): Promise<VoiceResponse> {
    const { store } = command.entities;

    if (!store) {
      return {
        text: "Here are today's best deals: Milk $2.99 at Safeway, Eggs $3.49 at Target, Bread $1.99 at Walmart",
      };
    }

    // Mock deals - would fetch from deals service
    const deals = {
      target: '20% off groceries, $5 off $50 purchase',
      safeway: 'Buy one get one free on select items',
      walmart: 'Rollback prices on dairy products',
    };

    const storeDeal = deals[store.toLowerCase() as keyof typeof deals] || 'No current deals';

    return {
      text: `At ${store}: ${storeDeal}`,
      data: { store, deals: storeDeal },
    };
  }

  private async handleFindStore(command: VoiceCommand): Promise<VoiceResponse> {
    const { store } = command.entities;

    if (!store) {
      return { text: 'Which store are you looking for?' };
    }

    return {
      text: `The nearest ${store} is 2.3 miles away on Main Street. Would you like directions?`,
      data: { store, distance: 2.3 },
    };
  }

  private async handleNavigation(command: VoiceCommand): Promise<VoiceResponse> {
    const { store } = command.entities;

    if (!store) {
      return { text: 'Where would you like to go?' };
    }

    return {
      text: `Starting navigation to ${store}. It's 8 minutes away`,
      action: () => {
        // Open maps navigation
        console.log('Navigate to:', store);
      },
      data: { store },
    };
  }

  private async handleCheckList(command: VoiceCommand): Promise<VoiceResponse> {
    // Mock list - would fetch from store
    const items = ['milk', 'eggs', 'bread', 'chicken'];

    return {
      text: `You have ${items.length} items on your list: ${items.join(', ')}`,
      data: { items },
    };
  }

  private async handlePriceCheck(command: VoiceCommand): Promise<VoiceResponse> {
    const { item, store } = command.entities;

    if (!item) {
      return { text: 'What item do you want to check?' };
    }

    const storeText = store ? ` at ${store}` : ' at nearby stores';

    return {
      text: `${item}${storeText}: $3.99 at Target, $4.49 at Safeway, $3.79 at Walmart. Best price is at Walmart`,
      data: {
        item,
        prices: [
          { store: 'Target', price: 3.99 },
          { store: 'Safeway', price: 4.49 },
          { store: 'Walmart', price: 3.79 },
        ],
      },
    };
  }

  private async handleSmartSuggestion(command: VoiceCommand): Promise<VoiceResponse> {
    return {
      text: "Based on your shopping history, you usually buy milk and eggs on Thursdays. You're also running low on coffee",
      data: { suggestions: ['milk', 'eggs', 'coffee'] },
    };
  }

  /**
   * Common commands for quick access
   */
  getCommonCommands() {
    return [
      'Add milk to my list',
      "What's on sale at Target?",
      "Where's the nearest Safeway?",
      'Take me to Whole Foods',
      "What's on my list?",
      'How much is milk at Walmart?',
      'What should I buy?',
      'Add 2 dozen eggs at Costco',
      'Find organic bananas',
      'Navigate to Target',
    ];
  }

  /**
   * Context-aware follow-up
   */
  async handleFollowUp(text: string): Promise<VoiceResponse> {
    const lastCommand = this.conversationContext[this.conversationContext.length - 1];

    if (text.toLowerCase().includes('yes') || text.toLowerCase().includes('sure')) {
      // Confirm previous action
      return { text: "Great! I've done that for you" };
    }

    if (text.toLowerCase().includes('no') || text.toLowerCase().includes('cancel')) {
      // Cancel previous action
      return { text: "Okay, I've cancelled that" };
    }

    // Regular command processing
    return this.processCommand(text);
  }

  cleanup() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
}

export const voiceAssistant = new VoiceAssistantService();
