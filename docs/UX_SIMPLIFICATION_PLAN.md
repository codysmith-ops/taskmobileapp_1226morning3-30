# UX SIMPLIFICATION PLAN

**Last Updated:** December 30, 2025  
**Status:** Implementation Required  
**Goal:** Transform app from "functionally solid" (53/100 UX) to "world-class everyday app" (90+ UX)

---

## EXECUTIVE SUMMARY

**Current State:** App violates its own "Not all at once" philosophy  
**Root Causes:**
1. Too many visible options (30-item menu)
2. Too many fields (9-field add-task form)
3. Too many unexplained metrics ($0.00 without tooltips)
4. Too little progressive disclosure

**Target State:** Calm, focused, explainable  
**Implementation:** 10 UX simplifications (Priority 1-3) across 7 days

---

## THE 10 SIMPLIFICATIONS

---

### SIMPLIFICATION 1: Progressive Add-Task Form

**Priority:** 1 (Critical UX Violation)  
**Impact:** High (used multiple times per session)

#### Current State (❌ VIOLATES "NOT ALL AT ONCE")

```
Add New Task
┌─────────────────────────────────┐
│ Task Name (required)*           │
│ [_________________________]     │
│                                 │
│ Description                     │
│ [_________________________]     │
│                                 │
│ Due Date (required)*            │
│ [__/__/____]                    │
│                                 │
│ Assign To                       │
│ [_________________________]     │
│                                 │
│ Priority                        │
│ [ ] Low [ ] Medium [ ] High     │
│                                 │
│ Category                        │
│ [Dropdown]                      │
│                                 │
│ Store/Location                  │
│ [_________________________]     │
│                                 │
│ [Cancel]        [Submit Task]   │
└─────────────────────────────────┘
```

**Problems:**
- 9 fields visible (overwhelming)
- 2 marked "required" (pressure)
- "Submit Task" button (corporate)
- User must fill/skip 9 fields to add 1 task

#### Target State (✅ CALM, SIMPLE)

**Default View:**
```
What do you need?
┌─────────────────────────────────┐
│ [_________________________]     │
│                       [Add]     │
│                                 │
│ → Add details (optional)        │
└─────────────────────────────────┘
```

**Expanded View (if user taps "Add details"):**
```
Buy milk ✓
┌─────────────────────────────────┐
│ Notes (optional)                │
│ [_________________________]     │
│                                 │
│ When (optional)                 │
│ [Today] [Tomorrow] [Pick date]  │
│                                 │
│ Category (optional)             │
│ [Shopping] [Household] [Other]  │
│                                 │
│ [Add]                           │
└─────────────────────────────────┘
```

#### Implementation

**File:** `App.tsx` (lines ~200-350)

**Changes:**
1. **Default state:** Show only task name input + "Add" button
2. **Progressive disclosure:** "Add details" link below input (collapsed by default)
3. **Expanded state:** Show optional fields:
   - Notes (text area)
   - When (date chips: Today, Tomorrow, Pick date)
   - Category (chips: Shopping, Household, Work, Other)
4. **Remove entirely:**
   - "Assign To" field (not fully supported)
   - "Priority" field (use natural language instead: "urgent", "important")
   - "Store/Location" field (use task name: "Buy milk at Kroger")
5. **Button label:** "Add" (not "Submit Task")
6. **No "required" markers** (only task name is required, enforced by disabled button state)

**Code Snippet:**
```typescript
const [showDetails, setShowDetails] = useState(false);

// Default view
<View>
  <Text style={styles.label}>What do you need?</Text>
  <TextInput
    placeholder="e.g., Buy milk"
    value={taskName}
    onChangeText={setTaskName}
    style={styles.input}
  />
  <Button
    title="Add"
    onPress={handleAddTask}
    disabled={!taskName.trim()}
  />
  
  {!showDetails && (
    <TouchableOpacity onPress={() => setShowDetails(true)}>
      <Text style={styles.link}>→ Add details (optional)</Text>
    </TouchableOpacity>
  )}
  
  {showDetails && (
    <View style={styles.detailsSection}>
      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        placeholder="Any extra info"
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      
      <Text style={styles.label}>When (optional)</Text>
      <View style={styles.chipRow}>
        <Chip label="Today" onPress={() => setDueDate(today)} />
        <Chip label="Tomorrow" onPress={() => setDueDate(tomorrow)} />
        <Chip label="Pick date" onPress={() => setShowDatePicker(true)} />
      </View>
      
      <Text style={styles.label}>Category (optional)</Text>
      <View style={styles.chipRow}>
        <Chip label="Shopping" onPress={() => setCategory('Shopping')} />
        <Chip label="Household" onPress={() => setCategory('Household')} />
        <Chip label="Work" onPress={() => setCategory('Work')} />
        <Chip label="Other" onPress={() => setCategory('Other')} />
      </View>
    </View>
  )}
</View>
```

**Testing:**
- [ ] Default: Only name + Add button visible
- [ ] "Add details" expands to show Notes, When, Category
- [ ] "Add" button disabled when name is empty
- [ ] Optional fields do not block task creation

---

### SIMPLIFICATION 2: Remove/Relocate "Assign To"

**Priority:** 1 (Critical UX Violation)  
**Impact:** Medium (confuses users, not fully functional)

#### Current State (❌ CONFUSING)

- "Assign To" field in add-task form
- Field is visible but **not fully supported** (no collaboration features implemented)
- Users expect team features (Family, Team pages) to work
- Creates false expectations

#### Target State (✅ CLEAR)

**Option 1: Remove entirely** (Recommended)
- Delete "Assign To" field
- Add collaboration features later (Family/Team pages) with proper progressive disclosure

**Option 2: Relocate to "With" (Optional)**
- Only show if user has ≥2 family members added
- Label: "With" (instead of "Assign To")
- Chips: Family member names (not text input)

#### Implementation

**File:** `App.tsx` (lines ~250-270)

**Changes:**
1. **Remove "Assign To" field** from add-task form
2. **Optional:** Add "With" field in expanded details section (only if family members exist)

**Code Snippet:**
```typescript
// Remove this:
<Text style={styles.label}>Assign To</Text>
<TextInput
  placeholder="Who's handling this?"
  value={assignedTo}
  onChangeText={setAssignedTo}
/>

// Optional replacement (only if family members exist):
{familyMembers.length > 0 && showDetails && (
  <>
    <Text style={styles.label}>With (optional)</Text>
    <View style={styles.chipRow}>
      {familyMembers.map(member => (
        <Chip
          key={member.id}
          label={member.name}
          onPress={() => setAssignedTo(member.id)}
        />
      ))}
    </View>
  </>
)}
```

**Testing:**
- [ ] "Assign To" field no longer visible
- [ ] "With" field only appears if family members exist
- [ ] No confusion about collaboration features

---

### SIMPLIFICATION 3: Replace Raw Date Input with Chips/Picker

**Priority:** 1 (Critical UX Violation)  
**Impact:** High (dates are common, current UX is frustrating)

#### Current State (❌ FRICTION)

- Raw text input for date: `[__/__/____]`
- User must type or use keyboard date picker
- Formatting errors ("12/1/24" vs "12/01/2024")
- No quick access to common dates (Today, Tomorrow)

#### Target State (✅ EFFORTLESS)

**Chips for common dates + picker for custom:**
```
When (optional)
┌─────────────────────────────────┐
│ [Today] [Tomorrow] [Pick date]  │
└─────────────────────────────────┘
```

**If "Pick date" tapped:**
```
When (optional)
┌─────────────────────────────────┐
│ [Today] [Tomorrow] [Pick date]  │
│                                 │
│ [Calendar picker UI]            │
│  S  M  T  W  T  F  S            │
│        1  2  3  4  5            │
│  6  7  8  9 10 11 12            │
│ 13 14 15 16 17 18 19            │
│ 20 21 22 23 24 25 26            │
│ 27 28 29 30 31                  │
│                                 │
│ [Clear]             [Set]       │
└─────────────────────────────────┘
```

#### Implementation

**File:** `App.tsx` (lines ~270-290)

**Changes:**
1. Replace text input with chip row
2. Chips: "Today", "Tomorrow", "Pick date"
3. "Pick date" → Show calendar picker modal
4. Store date as ISO8601 string (not user-formatted text)

**Code Snippet:**
```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

const [dueDate, setDueDate] = useState<string | null>(null);
const [showDatePicker, setShowDatePicker] = useState(false);

// Chip row
<Text style={styles.label}>When (optional)</Text>
<View style={styles.chipRow}>
  <Chip
    label="Today"
    selected={dueDate === getTodayISO()}
    onPress={() => setDueDate(getTodayISO())}
  />
  <Chip
    label="Tomorrow"
    selected={dueDate === getTomorrowISO()}
    onPress={() => setDueDate(getTomorrowISO())}
  />
  <Chip
    label="Pick date"
    onPress={() => setShowDatePicker(true)}
  />
</View>

{/* Calendar picker modal */}
{showDatePicker && (
  <DateTimePicker
    value={dueDate ? new Date(dueDate) : new Date()}
    mode="date"
    display="spinner"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setDueDate(selectedDate.toISOString());
      }
    }}
  />
)}
```

**Testing:**
- [ ] "Today" chip sets date to today's ISO8601 string
- [ ] "Tomorrow" chip sets date to tomorrow's ISO8601 string
- [ ] "Pick date" opens calendar picker
- [ ] Selected chip is visually highlighted
- [ ] Date stored in ISO8601 format (e.g., "2025-12-30T00:00:00.000Z")

---

### SIMPLIFICATION 4: Prioritize "Scan Receipt" Over SKU Entry

**Priority:** 2 (Important UX)  
**Impact:** Medium (receipt scanning is core feature, should be obvious)

#### Current State (❌ HIDDEN)

- Scanner icon in quick actions (small, easy to miss)
- Add-task form has "Store/Location" text input (manual entry prioritized)
- Receipt scanning not emphasized as primary path

#### Target State (✅ OBVIOUS)

**Home quick actions:**
```
Quick actions
┌─────────────────────────────────┐
│  📷        🎤        🛒          │
│ Scan    Voice   Shopping        │
│ receipt  input   list           │
└─────────────────────────────────┘
```

**Empty Receipts page:**
```
Receipts unlock price insights.
Tap here to scan your first one.

[Scan receipt]
```

#### Implementation

**File:** `HomePage.tsx` (lines ~150-200)

**Changes:**
1. Reorder quick actions: Scanner first, Voice second, Shopping list third
2. Scanner label: "Scan receipt" (not just "Scanner")
3. Emphasize Scanner icon (larger, colored)

**File:** `src/pages/ReceiptScannerPage.tsx`

**Changes:**
1. Empty state: "Receipts unlock price insights. Tap here to scan your first one."
2. Primary action: [Scan receipt] button (large, centered)

**Code Snippet:**
```typescript
// HomePage.tsx
<View style={styles.quickActions}>
  <QuickActionButton
    icon="📷"
    label="Scan receipt"
    onPress={() => navigation.navigate('ReceiptScanner')}
    variant="primary" // Emphasize
  />
  <QuickActionButton
    icon="🎤"
    label="Voice input"
    onPress={handleVoiceInput}
  />
  <QuickActionButton
    icon="🛒"
    label="Shopping list"
    onPress={() => navigation.navigate('ShoppingList')}
  />
</View>
```

**Testing:**
- [ ] Scanner is first quick action (leftmost)
- [ ] Label reads "Scan receipt" (not "Scanner")
- [ ] Empty Receipts page emphasizes scanning
- [ ] Scanner icon is visually prominent

---

### SIMPLIFICATION 5: Calm Activity Log (Max 3 Items, Expandable)

**Priority:** 2 (Important UX)  
**Impact:** Medium (reduces clutter on Home)

#### Current State (❌ OVERWHELMING)

- Audit Log page exists (enterprise feature)
- No activity log on Home
- Users don't know what Ellio automated

#### Target State (✅ CALM)

**Home: Recent activity (collapsed):**
```
Recent activity
┌─────────────────────────────────┐
│ • Added "Buy milk" to Shopping  │
│ • Marked "Return shirt" done    │
│ • Scanned receipt from Kroger   │
│                                 │
│ → View all                      │
└─────────────────────────────────┘
```

**If "View all" tapped:**
```
Recent activity
┌─────────────────────────────────┐
│ Today                           │
│ • Added "Buy milk" to Shopping  │
│ • Marked "Return shirt" done    │
│ • Scanned receipt from Kroger   │
│                                 │
│ Yesterday                       │
│ • Added "Pay bills" to Next     │
│ • Scanned receipt from Target   │
│                                 │
│ This week                       │
│ • Completed 12 tasks            │
│ • Scanned 8 receipts            │
│ • Saved $14 on groceries        │
│                                 │
│ → Show less                     │
└─────────────────────────────────┘
```

#### Implementation

**File:** `HomePage.tsx` (new section)

**Changes:**
1. Add "Recent activity" section (below "Next up", above stats)
2. Show max 3 items by default (most recent)
3. "View all" expands to show full activity log
4. Track events in AsyncStorage: `@ellio_activity_log` (array of events)

**Code Snippet:**
```typescript
const [showAllActivity, setShowAllActivity] = useState(false);
const activityLog = [
  { type: 'task_added', text: 'Added "Buy milk" to Shopping', date: new Date() },
  { type: 'task_completed', text: 'Marked "Return shirt" done', date: new Date() },
  { type: 'receipt_scanned', text: 'Scanned receipt from Kroger', date: new Date() },
];

<View style={styles.activitySection}>
  <Text style={styles.sectionTitle}>Recent activity</Text>
  {activityLog.slice(0, showAllActivity ? activityLog.length : 3).map((item, i) => (
    <Text key={i} style={styles.activityItem}>• {item.text}</Text>
  ))}
  <TouchableOpacity onPress={() => setShowAllActivity(!showAllActivity)}>
    <Text style={styles.link}>
      {showAllActivity ? '→ Show less' : '→ View all'}
    </Text>
  </TouchableOpacity>
</View>
```

**Testing:**
- [ ] Default: 3 most recent items visible
- [ ] "View all" expands to show full log
- [ ] "Show less" collapses back to 3 items
- [ ] Activity log persists across sessions (AsyncStorage)

---

### SIMPLIFICATION 6: Replace Alert.alert() Stack with Queue/Toast System

**Priority:** 2 (Important UX)  
**Impact:** High (current alerts stack, block UI)

#### Current State (❌ STACKING ALERTS)

- Multiple `Alert.alert()` calls stack (iOS allows stacking)
- Blocks UI (modal)
- Corporate tone ("Error: Failed to save task. Please try again.")

#### Target State (✅ TOAST QUEUE)

**Toast (bottom of screen, non-blocking):**
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│          [Main UI]              │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ ✓ Added.                        │
└─────────────────────────────────┘
```

**Toast auto-dismisses after 2 seconds (no tap required).**

**If multiple toasts triggered:**
- Queue them (show 1 at a time)
- Each displays for 2 seconds
- User can swipe to dismiss early

#### Implementation

**File:** `src/components/Toast.tsx` (new file)

**Changes:**
1. Create `Toast` component (slide-up animation, auto-dismiss)
2. Create `ToastQueue` manager (global queue, max 1 visible at a time)
3. Replace all `Alert.alert()` calls with `Toast.show()`

**Code Snippet:**
```typescript
// src/components/Toast.tsx
import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

export const Toast = ({ message, duration = 2000, onDismiss }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    // Slide up + fade in
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 50, duration: 150, useNativeDriver: true }),
      ]).start(() => onDismiss());
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: palette.neutral[800],
    padding: spacing.medium,
    borderRadius: radius.medium,
    alignItems: 'center',
  },
  message: {
    color: palette.neutral[50],
    fontSize: typography.sizes.body,
  },
});
```

**Usage:**
```typescript
// Replace this:
Alert.alert('Success', 'Task added successfully!');

// With this:
Toast.show('Added.');
```

**Testing:**
- [ ] Toast slides up from bottom, fades in
- [ ] Toast auto-dismisses after 2 seconds
- [ ] Multiple toasts queue (show 1 at a time)
- [ ] Toast does not block UI (non-modal)

---

### SIMPLIFICATION 7: Every Page Must Have Meaningful Mock Content

**Priority:** 3 (Polish)  
**Impact:** High (empty pages undermine competence)

#### Current State (❌ EMPTY PLACEHOLDERS)

- 12 pages show generic "Coming Soon" messages
- Users question if app works
- No examples to understand feature value

#### Target State (✅ PREVIEW CONTENT)

**Every placeholder page shows:**
1. **Example data** (labeled "Preview" or "Example")
2. **Clear description** of what the page will show when real data exists
3. **Call to action** to generate real data

**Example: Export Page (current):**
```
Export Data
[Empty placeholder]
```

**Example: Export Page (target):**
```
Export data

Download tasks, receipts, and
spending as CSV or PDF.

Example exports:
• Tasks (last 30 days) → CSV
• Receipts (December) → PDF
• Budget summary → PDF

[Export tasks]  [Export receipts]
```

#### Implementation

**Files:** 12 placeholder pages (Account, Admin, Approvals, Calendar, Documents, Export, Help, Preferences, Search, Templates, etc.)

**Changes:**
1. Replace "Coming Soon" with feature description + example data
2. Add mock screenshots or example lists
3. Label all mock content: "(Preview)" or "(Example)"

**Template:**
```typescript
// src/pages/ExportPage.tsx
export const ExportPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Export data</Text>
      <Text style={styles.description}>
        Download tasks, receipts, and spending as CSV or PDF.
      </Text>
      
      <View style={styles.exampleSection}>
        <Text style={styles.sectionTitle}>Example exports:</Text>
        <Text style={styles.exampleItem}>• Tasks (last 30 days) → CSV</Text>
        <Text style={styles.exampleItem}>• Receipts (December) → PDF</Text>
        <Text style={styles.exampleItem}>• Budget summary → PDF</Text>
      </View>
      
      <View style={styles.actions}>
        <Button title="Export tasks" onPress={handleExportTasks} />
        <Button title="Export receipts" onPress={handleExportReceipts} />
      </View>
      
      <Text style={styles.note}>
        This is a preview. Real exports will include your data.
      </Text>
    </View>
  );
};
```

**Testing:**
- [ ] All 12 placeholder pages have meaningful mock content
- [ ] Mock content is labeled "(Preview)" or "(Example)"
- [ ] Users can understand feature value without real data

---

### SIMPLIFICATION 8: Create Reusable Details/Source Screen

**Priority:** 2 (Important UX)  
**Impact:** High (transparency builds trust)

#### Current State (❌ UNEXPLAINED METRICS)

- Budget page shows "$50 Food" with no explanation
- Cashback page shows "$12 pending" with no source
- Price insights show "You saved $3" with no context

#### Target State (✅ TRANSPARENT)

**Every metric has "ⓘ" tooltip:**
```
Budget
┌─────────────────────────────────┐
│ Food               $50  ⓘ       │
│ Transport          $30  ⓘ       │
│ Household          $20  ⓘ       │
└─────────────────────────────────┘
```

**Tap "ⓘ" → Details/Source screen:**
```
Food budget
┌─────────────────────────────────┐
│ What this means                 │
│ Ellio suggests spending no more │
│ than $50 per week on food.      │
│                                 │
│ Where from                      │
│ Based on your past spending     │
│ from 12 receipts scanned.       │
│                                 │
│ Last updated                    │
│ Today                           │
│                                 │
│ [Edit]              [Got it]    │
└─────────────────────────────────┘
```

#### Implementation

**File:** `src/components/DetailsSourceScreen.tsx` (new file)

**Changes:**
1. Create reusable `DetailsSourceScreen` component
2. Props: `title`, `sections` (array of { label, value }), `buttons`
3. Use across Budget, Cashback, Price Insights, etc.

**Code Snippet:**
```typescript
// src/components/DetailsSourceScreen.tsx
export const DetailsSourceScreen = ({ title, sections, buttons }) => {
  return (
    <View style={styles.modal}>
      <Text style={styles.title}>{title}</Text>
      
      {sections.map((section, i) => (
        <View key={i} style={styles.section}>
          <Text style={styles.label}>{section.label}</Text>
          <Text style={styles.value}>{section.value}</Text>
        </View>
      ))}
      
      <View style={styles.buttons}>
        {buttons.primary && (
          <Button title={buttons.primary.label} onPress={buttons.primary.onPress} />
        )}
        {buttons.secondary && (
          <Button title={buttons.secondary.label} onPress={buttons.secondary.onPress} />
        )}
      </View>
    </View>
  );
};
```

**Usage:**
```typescript
// BudgetPage.tsx
<TouchableOpacity onPress={() => setShowDetails(true)}>
  <Text style={styles.infoIcon}>ⓘ</Text>
</TouchableOpacity>

{showDetails && (
  <DetailsSourceScreen
    title="Food budget"
    sections={[
      {
        label: 'What this means',
        value: 'Ellio suggests spending no more than $50 per week on food.',
      },
      {
        label: 'Where from',
        value: 'Based on your past spending from 12 receipts scanned.',
      },
      {
        label: 'Last updated',
        value: 'Today',
      },
    ]}
    buttons={{
      primary: { label: 'Edit', onPress: handleEditBudget },
      secondary: { label: 'Got it', onPress: () => setShowDetails(false) },
    }}
  />
)}
```

**Testing:**
- [ ] "ⓘ" tooltip visible next to every metric
- [ ] Tap "ⓘ" → Details/Source screen appears
- [ ] Screen explains: What this means, Where from, Last updated
- [ ] "Got it" dismisses modal

---

### SIMPLIFICATION 9: Home Shows Only "Next 3" Tasks (Not All)

**Priority:** 1 (Critical UX Violation)  
**Impact:** High (Home is first impression)

#### Current State (❌ OVERWHELMING)

- Home shows **ALL tasks** in a scrollable list
- No prioritization (user must scan entire list)
- Violates "Not all at once" principle

#### Target State (✅ CALM)

**Home layout:**
```
Good morning, [Name]

┌─────────────────────────────────┐
│ Next up                      ⓘ  │
│ ┌─────────────────────────────┐ │
│ │ Return shirt to Target      │ │
│ │ Today • Shopping            │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

Next 3
┌─────────────────────────────────┐
│ □ Buy milk                      │
│   Tomorrow • Shopping           │
│                                 │
│ □ Pay electricity bill          │
│   Jan 5 • Household             │
│                                 │
│ □ Review insurance docs         │
│   This week • Documents         │
└─────────────────────────────────┘

→ View all tasks

[Progress: 5 of 12 tasks done this week]

Recent activity (collapsed, max 3 items)

Price insight (collapsed, 1 teaser)
```

#### Implementation

**File:** `HomePage.tsx` (major redesign)

**Changes:**
1. **"Next up" section:** Show 1 task (highest priority, soonest due date)
2. **"Next 3" section:** Show next 3 tasks (below "Next up")
3. **"View all tasks" link:** Navigate to full task list
4. **Progress bar:** Quiet strip showing completion percentage
5. **Recent activity:** Collapsed (max 3 items, "View all" to expand)
6. **Price insight:** Collapsed teaser (1 insight, "View all" to expand)
7. **Remove:** Stats grid (move to separate Analytics page)
8. **Remove:** Savings goal input (move to Budget page)

**Code Snippet:**
```typescript
const nextUpTask = tasks
  .filter(t => !t.completed)
  .sort((a, b) => {
    // Sort by: overdue → today → tomorrow → future
    const aDate = a.dueDate ? new Date(a.dueDate) : null;
    const bDate = b.dueDate ? new Date(b.dueDate) : null;
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return aDate.getTime() - bDate.getTime();
  })[0];

const next3Tasks = tasks
  .filter(t => !t.completed && t.id !== nextUpTask?.id)
  .slice(0, 3);

return (
  <ScrollView style={styles.container}>
    <Text style={styles.greeting}>Good morning, {userName}</Text>
    
    {/* Next up */}
    <View style={styles.nextUpCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Next up</Text>
        <TouchableOpacity onPress={() => showTooltip('nextUp')}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>
      {nextUpTask ? (
        <TaskCard task={nextUpTask} variant="featured" />
      ) : (
        <Text style={styles.emptyState}>All clear.</Text>
      )}
    </View>
    
    {/* Next 3 */}
    {next3Tasks.length > 0 && (
      <View style={styles.next3Section}>
        <Text style={styles.sectionTitle}>Next 3</Text>
        {next3Tasks.map(task => (
          <TaskCard key={task.id} task={task} variant="compact" />
        ))}
      </View>
    )}
    
    {/* View all */}
    <TouchableOpacity onPress={() => navigation.navigate('TaskList')}>
      <Text style={styles.link}>→ View all tasks</Text>
    </TouchableOpacity>
    
    {/* Progress */}
    <View style={styles.progressSection}>
      <Text style={styles.progressText}>
        {completedCount} of {totalCount} tasks done this week
      </Text>
      <ProgressBar progress={completedCount / totalCount} />
    </View>
    
    {/* Recent activity */}
    <RecentActivitySection collapsed={true} maxItems={3} />
    
    {/* Price insight teaser */}
    <PriceInsightTeaser />
  </ScrollView>
);
```

**Testing:**
- [ ] "Next up" shows 1 task (highest priority/soonest)
- [ ] "Next 3" shows next 3 tasks
- [ ] "View all tasks" navigates to full list
- [ ] Progress bar shows completion percentage
- [ ] Home does not show ALL tasks (violates "Not all at once")

---

### SIMPLIFICATION 10: Rename Labels for Calm

**Priority:** 3 (Polish)  
**Impact:** Medium (tone matters)

#### Current State (❌ STRESSFUL)

| Current Label | Problem |
|---------------|---------|
| Due Date | "Due" implies pressure, deadlines |
| Assign To | Corporate, formal |
| Tasks | Feels like work |
| Submit | Formal, transactional |
| Delete | Harsh, permanent |
| Cancel | Negative |

#### Target State (✅ CALM)

| ❌ Stressful | ✅ Calm | Reasoning |
|-------------|--------|-----------|
| Due Date | When | "When" is neutral, no pressure |
| Assign To | With | "With" is collaborative, not hierarchical |
| Tasks | Next / List | "Next" focuses on action, "List" is neutral |
| Submit | Add / Save | "Add" is simple, "Save" is clear |
| Delete | Remove | "Remove" is gentler |
| Cancel | Not now | "Not now" preserves option |

#### Implementation

**Files:** All pages (App.tsx, HomePage.tsx, BudgetPage.tsx, etc.)

**Changes:**
1. Find/replace all instances of stressful labels
2. Use `EllioLabels` from `src/content/ellioCopy.ts` (centralized copy)

**Code Snippet:**
```typescript
import { EllioLabels } from '../content/ellioCopy';

// Replace this:
<Text>Due Date</Text>
<Button title="Submit" />
<Button title="Cancel" />
<Button title="Delete" />

// With this:
<Text>{EllioLabels.when}</Text>
<Button title={EllioLabels.add} />
<Button title={EllioLabels.notNow} />
<Button title={EllioLabels.remove} />
```

**Testing:**
- [ ] All "Due Date" replaced with "When"
- [ ] All "Assign To" replaced with "With"
- [ ] All "Submit" replaced with "Add" or "Save"
- [ ] All "Delete" replaced with "Remove"
- [ ] All "Cancel" replaced with "Not now"

---

## IMPLEMENTATION TIMELINE

### Day 1-2: Foundation

- [ ] **Simplification 6:** Toast system (replace Alert.alert stack)
- [ ] **Simplification 8:** Details/Source reusable screen
- [ ] **Simplification 10:** Rename labels (find/replace across all files)

### Day 3: Home Redesign

- [ ] **Simplification 9:** Home shows only "Next up" + "Next 3"
- [ ] Add quiet progress bar
- [ ] Add collapsed recent activity (max 3 items)
- [ ] Add price insight teaser (1 insight, "View all" to expand)

### Day 4: Progressive Forms

- [ ] **Simplification 1:** Progressive add-task form (default: name + Add)
- [ ] **Simplification 2:** Remove "Assign To" field
- [ ] **Simplification 3:** Replace date input with chips/picker

### Day 5: Explanations

- [ ] Add "ⓘ" tooltips to all metrics (Budget, Cashback, Price Insights, Savings)
- [ ] Details/Source screens for all tooltips
- [ ] First-time tooltips (10 required, per master prompt)

### Day 6: Polish

- [ ] **Simplification 4:** Emphasize "Scan receipt" (reorder quick actions)
- [ ] **Simplification 5:** Calm activity log (max 3 items, expandable)
- [ ] **Simplification 7:** Add meaningful mock content to all 12 placeholder pages

### Day 7: Validation

- [ ] Manual tap-through testing (every page, every button, every link)
- [ ] Verify all tooltips work
- [ ] Verify all empty states are explained
- [ ] Verify no "Coming Soon" placeholders remain
- [ ] Git commit + push all changes

---

## TESTING CHECKLIST

### Functional Testing

- [ ] Add task (simple): Name only → "Add" works
- [ ] Add task (detailed): Expand "Add details" → Notes, When, Category work
- [ ] Date picker: "Today", "Tomorrow", "Pick date" all set correct ISO8601 strings
- [ ] Toast system: Multiple toasts queue (1 visible at a time)
- [ ] Details/Source: Tap "ⓘ" on any metric → Modal appears with What/Where/When
- [ ] Home "Next up": Shows 1 highest-priority task
- [ ] Home "Next 3": Shows next 3 tasks
- [ ] "View all tasks" → Navigates to full task list
- [ ] Progress bar: Updates after task completion
- [ ] Recent activity: Shows max 3 items, "View all" expands
- [ ] Mock content: All 12 placeholder pages have examples

### UX Testing

- [ ] Add task feels effortless (no pressure, no required markers)
- [ ] Home feels calm (no overwhelming list)
- [ ] Tooltips explain without nagging (max 1 per session)
- [ ] Labels feel calm ("When" not "Due Date", "Not now" not "Cancel")
- [ ] Empty states guide without demanding ("Add when you're ready")

### Regression Testing

- [ ] Scanner still works (camera permissions, barcode reading)
- [ ] Voice input still works (microphone permissions, speech recognition)
- [ ] Task store still persists (AsyncStorage)
- [ ] Navigation menu still works (30 items → will be simplified later)

---

## BEFORE & AFTER COMPARISON

### Before (Current State)

**UX Score:** 53/100  
**Violations:**
- Home shows ALL tasks (not "Next up")
- 9-field add-task form (overwhelming)
- 30-item menu (too many options)
- Multiple Alert.alert() stacking
- 10 missing tooltips
- 6 unexplained empty states

### After (Target State)

**UX Score:** 90+ / 100  
**Improvements:**
- ✅ Home shows "Next up" + "Next 3" (calm, focused)
- ✅ Progressive add-task form (name + Add by default, expand optional)
- ✅ Toast queue (non-blocking, calm)
- ✅ All tooltips implemented (10 required + more)
- ✅ All empty states explained ("Add when you're ready")
- ✅ Calm labels ("When" not "Due Date", "Not now" not "Cancel")
- ✅ Details/Source for all metrics (transparency)
- ✅ Mock content for all placeholder pages (competence)

---

## SUCCESS METRICS

**User Sentiment:**
- "Feels calm" → ≥80% of beta testers
- "Easy to use" → ≥90% of beta testers
- "I trust it" → ≥85% of beta testers

**Behavioral:**
- Add-task completion rate: ≥95% (vs. current ~70%)
- Time to add task: ≤10 seconds (vs. current ~25 seconds)
- Tooltip engagement: ≥60% tap "Show me" (vs. "Not now")
- Return rate (Day 7): ≥70% of new users

**Technical:**
- No stacking alerts (0 instances of multiple simultaneous modals)
- All tooltips functional (10/10 working)
- All empty states explained (12/12 have meaningful copy)
- Home load time: ≤500ms (show "Next up" immediately)

---

**Questions?**  
Refer to `src/content/ellioCopy.ts` for exact copy and `docs/ELLIO_VOICE.md` for tone guidelines.
