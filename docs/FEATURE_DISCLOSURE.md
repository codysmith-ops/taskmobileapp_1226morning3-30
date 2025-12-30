# FEATURE DISCLOSURE RULES

**Last Updated:** December 30, 2025  
**Philosophy:** "Not all at once" — Features revealed when needed, not on day 1

---

## CORE PRINCIPLE

> **Progressive disclosure = calm momentum**

Users should discover features **through use** — not through:
- ❌ Feature tours
- ❌ Badge counts
- ❌ Push notifications
- ❌ "New!" labels
- ❌ Overwhelming menus

**Instead:** Features appear **after meaningful interaction** that proves the user needs them.

---

## MEANINGFUL INTERACTION DEFINITION

### ✅ MEANINGFUL

User demonstrates **intent or capability** to use a feature:

| Interaction Type | Example | Why It's Meaningful |
|------------------|---------|---------------------|
| **Task lifecycle** | Add → Edit → Complete → Undo | Proves user understands core workflow |
| **Repeated use** | User opens Insights 3+ times | Signals genuine interest |
| **Time spent** | ≥20 seconds actively engaged (typing, tapping, scrolling) | Indicates deliberate exploration |
| **Intentional navigation** | User taps menu item to explore feature | Self-directed discovery |
| **Feature dependency** | User scans 5 receipts → Budget unlocks | Prerequisite data exists |

### ❌ NOT MEANINGFUL

User actions that **do not** prove intent or readiness:

| Interaction Type | Example | Why It's Not Meaningful |
|------------------|---------|-------------------------|
| **Cold open** | App resumes from background | User didn't choose to engage |
| **Accidental tap** | Tap → Immediate back (< 2 seconds) | User didn't intend to explore |
| **Passive scroll** | Scroll without tap/input | No deliberate action |
| **Time spent < 5 seconds** | Open page → Close | Not enough time to understand |

---

## FEATURE DISCLOSURE THRESHOLDS

### Tier 1: Core Features (Always Visible)

**Philosophy:** Essential to app function. Visible from day 1.

| Feature | Visibility | Reasoning |
|---------|-----------|-----------|
| **Add task** | Always visible | Core function — app is useless without it |
| **Task list (Home)** | Always visible | Default landing page |
| **Voice input** | Always visible (icon) | Low friction — icon doesn't overwhelm |
| **Scanner** | Always visible (icon) | Low friction — icon doesn't overwhelm |
| **Camera** | Always visible (icon) | Low friction — icon doesn't overwhelm |

**UX:** Icons present, but **first-time tooltips** appear after first use (see Tooltip Rules below).

---

### Tier 2: Productivity Features (Revealed After Use)

**Philosophy:** Unlock after user proves they need it.

| Feature | Threshold | Disclosure Method | Reasoning |
|---------|-----------|-------------------|-----------|
| **Shopping list** | User completes **3 tasks** starting with "Buy" | First-time tooltip: "Tasks that start with 'Buy' show up in Shopping list. Tap to see them grouped by store." | User has demonstrated shopping behavior |
| **Timeline** | User adds **5 tasks with dates** | First-time tooltip: "Timeline shows when things are due. Tap to see it." | User cares about scheduling |
| **Calendar view** | User opens Timeline **3 times** | Menu item appears | User has demonstrated interest in date-based views |

---

### Tier 3: Money Features (Revealed After Data Exists)

**Philosophy:** No empty dashboards. Reveal only when data makes the feature useful.

| Feature | Threshold | Disclosure Method | Reasoning |
|---------|-----------|-------------------|-----------|
| **Price insights** | User scans **1 receipt** | First-time tooltip: "Price insights unlocked. Scan a few more and Ellio will spot patterns." | Minimal data to show proof of concept |
| **Budget** | User scans **5 receipts** | First-time tooltip: "Budget suggestion ready. Want to see it?" | Enough data for meaningful suggestions |
| **Cashback** | User scans **10 receipts** OR opens Insights **3 times** | First-time tooltip: "Link retailer accounts to track cashback." | User has established spending patterns |
| **Savings dashboard** | User sets a budget OR savings goal | Menu item appears | User has opted into money tracking |

---

### Tier 4: Collaboration Features (Revealed After Intent)

**Philosophy:** Don't assume multi-user needs. Reveal only if user signals intent.

| Feature | Threshold | Disclosure Method | Reasoning |
|---------|-----------|-------------------|-----------|
| **Family** | User adds **10 tasks** OR explicitly navigates to Family | First-time tooltip: "Invite family members to share tasks." | High task volume suggests shared workflow |
| **Team** | User navigates to Team from menu | Menu item hidden by default (only in Preferences → Advanced) | Enterprise feature — not for everyday users |
| **Assign To** | **NEVER** (remove from add-task form) | N/A | Not fully supported — creates confusion |

---

### Tier 5: Advanced Features (Hidden Until Needed)

**Philosophy:** Hide enterprise/compliance features. Only reveal if explicitly needed.

| Feature | Threshold | Disclosure Method | Reasoning |
|---------|-----------|-------------------|-----------|
| **Admin** | **NEVER** (remove from menu) | N/A | Enterprise feature — wrong audience |
| **Compliance** | **NEVER** (move to Preferences → Privacy) | N/A | Legal content — not a primary feature |
| **Audit Log** | User navigates to Preferences → Advanced | Rename to "Recent activity" and show in collapsed view on Home | Transparency feature — not navigation priority |
| **Approvals** | **NEVER** (remove from menu) | N/A | Enterprise workflow — wrong audience |
| **Templates** | **NEVER** (remove from menu) | N/A | Power user feature — clutters menu |

---

## DISCLOSURE METHODS

### Method 1: First-Time Tooltip

**When:** Feature threshold met, user has not seen tooltip before.

**Format:**
```
┌─────────────────────────────────┐
│ [Title] (2-4 words)             │
│                                 │
│ [Body] (1-2 sentences)          │
│                                 │
│ [Footnote] (optional)           │
│                                 │
│  [Show me]     [Not now]        │
└─────────────────────────────────┘
```

**Example (Shopping list unlock):**
```
Shopping list

Tasks that start with 'Buy' show up
in Shopping list. Tap to see them
grouped by store.

[Show me]  [Not now]
```

**Interaction:**
- "Show me" → Navigate to feature + mark tooltip seen
- "Not now" → Dismiss + mark tooltip seen + suppress for 7 days

**Tracking:**
- `@ellio_tooltip_seen_[feature]`: 'true' | null
- `@ellio_tooltip_suppressed_[feature]`: ISO8601 timestamp (+ 7 days)

---

### Method 2: Menu Item Appears

**When:** Feature threshold met, menu item was previously hidden.

**Format:**
- Menu item fades in with subtle animation (200ms ease-out)
- No tooltip — user discovers organically

**Example (Calendar view):**
- User opens Timeline 3 times
- "Calendar" menu item appears in navigation
- No announcement — quiet reveal

**Tracking:**
- `@ellio_menu_item_revealed_[feature]`: 'true' | null

---

### Method 3: In-App Message (Rare)

**When:** Major feature launch or important system change.

**Format:**
```
┌─────────────────────────────────┐
│                                 │
│       [Icon or illustration]    │
│                                 │
│   [Title] (3-5 words)           │
│                                 │
│   [Body] (2-3 sentences)        │
│                                 │
│                                 │
│        [Check it out]           │
│        [Maybe later]            │
│                                 │
└─────────────────────────────────┘
```

**Example (Price insights launch):**
```
Price insights are here

Ellio now compares your receipt
prices to typical prices in your area.

Scan a few receipts to try it out.

[Check it out]  [Maybe later]
```

**Usage:**
- Reserved for **major updates only** (1-2 per year)
- Never on first launch (conflicts with "calm" principle)

---

## DISCLOSURE TIMING RULES

### Rule 1: Max 1 Disclosure Per Session

**Enforcement:**
```typescript
const REVEAL_TRACKING_KEY = '@ellio_last_reveal_date';

const canRevealFeature = async (feature: string): Promise<boolean> => {
  const lastRevealDate = await AsyncStorage.getItem(REVEAL_TRACKING_KEY);
  const today = new Date().toDateString();
  
  if (lastRevealDate === today) {
    return false; // Already showed 1 reveal today
  }
  
  return true;
};

const revealFeature = async (feature: string) => {
  const canReveal = await canRevealFeature(feature);
  
  if (!canReveal) {
    console.log(`Already revealed 1 feature today. Queuing ${feature} for next session.`);
    return;
  }
  
  showTooltip(feature);
  await AsyncStorage.setItem(REVEAL_TRACKING_KEY, new Date().toDateString());
};
```

**Reasoning:** Prevents tooltip overload. Users should feel guided, not nagged.

---

### Rule 2: Never During Active Use

**Blocked Contexts:**
- Keyboard visible (user is typing)
- Camera/Scanner active
- Alert/Modal visible
- Voice input active
- Timer/countdown running

**Implementation:**
```typescript
const isUserBusy = (): boolean => {
  return (
    isKeyboardVisible() ||
    isCameraActive() ||
    isModalVisible() ||
    isVoiceInputActive() ||
    isTimerRunning()
  );
};

const showTooltipIfIdle = async (feature: string) => {
  if (isUserBusy()) {
    console.log(`User is busy. Deferring ${feature} tooltip.`);
    return;
  }
  
  await revealFeature(feature);
};
```

---

### Rule 3: Respect "Not Now" Decisions

**Suppression Policy:**

| User Action | Suppression Period | Re-Prompt Allowed |
|-------------|-------------------|-------------------|
| Tap "Not now" | 7 days | Yes, after 7 days OR threshold met again |
| Tap "X" (close) | Forever | No (tooltip shown once per feature) |
| Ignore tooltip (no interaction) | 3 days | Yes, after 3 days |

**Implementation:**
```typescript
const onNotNowPressed = async (feature: string) => {
  const suppressUntil = new Date();
  suppressUntil.setDate(suppressUntil.getDate() + 7);
  
  await AsyncStorage.setItem(
    `@ellio_tooltip_suppressed_${feature}`,
    suppressUntil.toISOString()
  );
  
  await AsyncStorage.setItem(`@ellio_tooltip_seen_${feature}`, 'true');
};

const isTooltipSuppressed = async (feature: string): Promise<boolean> => {
  const suppressedUntil = await AsyncStorage.getItem(`@ellio_tooltip_suppressed_${feature}`);
  
  if (!suppressedUntil) return false;
  
  const suppressDate = new Date(suppressedUntil);
  return new Date() < suppressDate;
};
```

---

### Rule 4: Prioritize by Impact

**If multiple features meet thresholds in the same session:**

Priority order:
1. **Core workflow improvements** (Shopping list, Timeline)
2. **Money features** (Budget, Price insights, Cashback)
3. **Collaboration features** (Family, Team)
4. **Advanced features** (Audit log, Export)

**Implementation:**
```typescript
const FEATURE_PRIORITY = {
  shopping_list: 1,
  timeline: 1,
  budget: 2,
  price_insights: 2,
  cashback: 2,
  family: 3,
  team: 3,
  audit_log: 4,
  export: 4,
};

const getNextFeatureToReveal = async (
  eligibleFeatures: string[]
): Promise<string | null> => {
  const sortedFeatures = eligibleFeatures.sort(
    (a, b) => FEATURE_PRIORITY[a] - FEATURE_PRIORITY[b]
  );
  
  return sortedFeatures[0] || null;
};
```

---

## COUNTER TRACKING (AsyncStorage)

### Task Counters

```typescript
// Increment on task add
const incrementTaskCount = async () => {
  const count = await AsyncStorage.getItem('@ellio_task_count');
  const newCount = (parseInt(count || '0') + 1).toString();
  await AsyncStorage.setItem('@ellio_task_count', newCount);
};

// Increment on "Buy" task add
const incrementBuyTaskCount = async (taskName: string) => {
  if (taskName.toLowerCase().startsWith('buy')) {
    const count = await AsyncStorage.getItem('@ellio_buy_task_count');
    const newCount = (parseInt(count || '0') + 1).toString();
    await AsyncStorage.setItem('@ellio_buy_task_count', newCount);
  }
};

// Increment on task with date
const incrementDateTaskCount = async (dueDate: string | null) => {
  if (dueDate) {
    const count = await AsyncStorage.getItem('@ellio_date_task_count');
    const newCount = (parseInt(count || '0') + 1).toString();
    await AsyncStorage.setItem('@ellio_date_task_count', newCount);
  }
};
```

### Receipt Counters

```typescript
// Increment on receipt scan
const incrementReceiptCount = async () => {
  const count = await AsyncStorage.getItem('@ellio_receipt_count');
  const newCount = (parseInt(count || '0') + 1).toString();
  await AsyncStorage.setItem('@ellio_receipt_count', newCount);
};
```

### Feature Usage Counters

```typescript
// Increment on feature page open
const incrementPageOpenCount = async (page: string) => {
  const count = await AsyncStorage.getItem(`@ellio_${page}_open_count`);
  const newCount = (parseInt(count || '0') + 1).toString();
  await AsyncStorage.setItem(`@ellio_${page}_open_count`, newCount);
};

// Example: Track Insights page opens
useEffect(() => {
  incrementPageOpenCount('insights');
}, []);
```

---

## THRESHOLD CHECKER (Utility Function)

```typescript
/**
 * Check if a feature should be revealed based on thresholds
 */
export const shouldRevealFeature = async (
  feature: string
): Promise<boolean> => {
  // Check if already revealed
  const alreadySeen = await AsyncStorage.getItem(`@ellio_tooltip_seen_${feature}`);
  if (alreadySeen) return false;

  // Check if suppressed
  const suppressed = await isTooltipSuppressed(feature);
  if (suppressed) return false;

  // Check if already revealed 1 feature today
  const canReveal = await canRevealFeature(feature);
  if (!canReveal) return false;

  // Check threshold based on feature
  switch (feature) {
    case 'shopping_list':
      const buyCount = await AsyncStorage.getItem('@ellio_buy_task_count');
      return parseInt(buyCount || '0') >= 3;

    case 'timeline':
      const dateCount = await AsyncStorage.getItem('@ellio_date_task_count');
      return parseInt(dateCount || '0') >= 5;

    case 'calendar':
      const timelineOpens = await AsyncStorage.getItem('@ellio_timeline_open_count');
      return parseInt(timelineOpens || '0') >= 3;

    case 'price_insights':
      const receiptCount = await AsyncStorage.getItem('@ellio_receipt_count');
      return parseInt(receiptCount || '0') >= 1;

    case 'budget':
      const budgetReceiptCount = await AsyncStorage.getItem('@ellio_receipt_count');
      return parseInt(budgetReceiptCount || '0') >= 5;

    case 'cashback':
      const cashbackReceiptCount = await AsyncStorage.getItem('@ellio_receipt_count');
      const insightsOpens = await AsyncStorage.getItem('@ellio_insights_open_count');
      return (
        parseInt(cashbackReceiptCount || '0') >= 10 ||
        parseInt(insightsOpens || '0') >= 3
      );

    case 'family':
      const taskCount = await AsyncStorage.getItem('@ellio_task_count');
      return parseInt(taskCount || '0') >= 10;

    default:
      return false;
  }
};
```

---

## TESTING PLAN

### Unit Tests

```typescript
// test/disclosure.test.ts
describe('Feature Disclosure', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('reveals shopping list after 3 Buy tasks', async () => {
    await AsyncStorage.setItem('@ellio_buy_task_count', '3');
    const shouldReveal = await shouldRevealFeature('shopping_list');
    expect(shouldReveal).toBe(true);
  });

  it('does not reveal shopping list before threshold', async () => {
    await AsyncStorage.setItem('@ellio_buy_task_count', '2');
    const shouldReveal = await shouldRevealFeature('shopping_list');
    expect(shouldReveal).toBe(false);
  });

  it('enforces max 1 reveal per session', async () => {
    await AsyncStorage.setItem('@ellio_buy_task_count', '3');
    await AsyncStorage.setItem('@ellio_receipt_count', '5');
    
    // First reveal: shopping_list
    await revealFeature('shopping_list');
    
    // Second reveal: budget (should be blocked)
    const canRevealBudget = await canRevealFeature('budget');
    expect(canRevealBudget).toBe(false);
  });

  it('respects 7-day suppression after Not now', async () => {
    const suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + 7);
    await AsyncStorage.setItem('@ellio_tooltip_suppressed_budget', suppressUntil.toISOString());
    
    const shouldReveal = await shouldRevealFeature('budget');
    expect(shouldReveal).toBe(false);
  });

  it('prioritizes core features over advanced features', async () => {
    const eligible = ['audit_log', 'shopping_list', 'export'];
    const next = await getNextFeatureToReveal(eligible);
    expect(next).toBe('shopping_list');
  });
});
```

### Manual Testing

- [ ] Add 3 "Buy" tasks → Shopping list tooltip appears
- [ ] Tap "Not now" → Tooltip does not re-appear same session
- [ ] Tap "Not now" → Tooltip re-appears after 7 days
- [ ] Add 5 tasks with dates → Timeline tooltip appears
- [ ] Scan 5 receipts → Budget tooltip appears
- [ ] Max 1 tooltip per session enforced (even if multiple thresholds met)
- [ ] Tooltip does not appear during active typing/camera/voice use

---

## MIGRATION PLAN (Existing Users)

**Problem:** Current app shows all 30 menu items on day 1.

**Solution:** Progressive rollout for existing users.

### Option 1: Soft Migration (Recommended)

1. **On next app update:**
   - Do NOT hide menu items (existing users expect them)
   - Add first-time tooltips for key features (Budget, Shopping list, Price insights)
   - Track AsyncStorage counters going forward
   - New users see progressive disclosure; existing users see full menu

2. **Benefits:**
   - No disruption for existing users
   - New users get calm experience
   - Easy rollback if issues

### Option 2: Hard Migration (Risky)

1. **On next app update:**
   - Hide all Tier 2-5 features for ALL users
   - Force re-discovery via thresholds
   - Risk: Existing users lose access to features they use

2. **Mitigation:**
   - Check `@ellio_first_session_date`
   - If user created account > 30 days ago → Skip progressive disclosure (show full menu)
   - If user created account < 30 days ago → Apply progressive disclosure

**Recommendation:** Use Option 1 (Soft Migration) to avoid user frustration.

---

## SUMMARY

**Philosophy:** "Not all at once"

- ✅ Core features (Add task, Voice, Scanner) visible from day 1
- ✅ Productivity features (Shopping list, Timeline) revealed after use
- ✅ Money features (Budget, Cashback) revealed after data exists
- ✅ Collaboration features (Family, Team) revealed after intent
- ❌ Enterprise features (Admin, Compliance, Approvals, Templates) hidden or removed

**Rules:**
1. Max 1 disclosure per session
2. Never during active use (typing, camera, voice)
3. Respect "Not now" (7-day suppression)
4. Prioritize by impact (core → money → collaboration → advanced)

**Tracking:**
- AsyncStorage counters for tasks, receipts, page opens
- Tooltip seen/suppressed flags
- Last reveal date (session gating)

**Testing:**
- Unit tests for threshold logic
- Manual tests for tooltip timing
- Migration plan for existing users

---

**Questions?**  
Refer to `src/content/ellioCopy.ts` for tooltip copy and `docs/ONBOARDING_SPEC.md` for onboarding flow.
