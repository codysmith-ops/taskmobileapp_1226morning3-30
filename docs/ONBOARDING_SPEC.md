# ONBOARDING SPECIFICATION

**Last Updated:** December 30, 2025  
**Status:** Implementation Required

---

## CORE PRINCIPLE

> **First impression = calm competence**

New users must feel:
1. **Welcomed** — warm, not corporate
2. **Guided** — clear next steps, no overwhelm
3. **Trusted** — transparent about data, automation, permissions
4. **In control** — features revealed when needed, not all at once

---

## FIRST LAUNCH FLOW

### Screen 1: Welcome

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│          [Ellio logo]           │
│                                 │
│      Welcome to Ellio           │
│                                 │
│   One next step at a time.      │
│   Add what you need—            │
│   Ellio keeps it calm.          │
│                                 │
│                                 │
│        [Get started]            │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `Welcome to Ellio`
- Body: `One next step at a time.\nAdd what you need—Ellio keeps it calm.`
- Button: `Get started`

**Interaction:**
- Tap anywhere or button → Screen 2
- No skip option (only 3 screens total)

---

### Screen 2: Not All at Once

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│     [Illustration: Single       │
│      highlighted task in        │
│      a list of faded tasks]     │
│                                 │
│      Not all at once            │
│                                 │
│   Ellio focuses on what's next. │
│   Everything else can wait.     │
│                                 │
│                                 │
│         [Continue]              │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `Not all at once`
- Body: `Ellio focuses on what's next.\nEverything else can wait.`
- Button: `Continue`

**Interaction:**
- Tap anywhere or button → Screen 3

**Design Notes:**
- Illustration shows 1 task highlighted, 3-4 faded tasks below
- Visual reinforcement of "one thing matters"

---

### Screen 3: Features Overview

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│   A few things Ellio can do     │
│                                 │
│   • Scan receipts to track      │
│     spending                    │
│                                 │
│   • Voice-add tasks naturally   │
│                                 │
│   • Suggest what's next         │
│                                 │
│                                 │
│                                 │
│     [Start using Ellio]         │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `A few things Ellio can do`
- Items:
  1. `Scan receipts to track spending`
  2. `Voice-add tasks naturally`
  3. `Suggest what's next`
- Button: `Start using Ellio`

**Interaction:**
- Tap button → Home (first session begins)

**Design Notes:**
- No feature overload (3 items max)
- No "Learn more" links — features revealed progressively

---

## POST-ONBOARDING STATE

After completing onboarding:

1. **AsyncStorage flag set:**
   ```typescript
   AsyncStorage.setItem('@ellio_onboarding_complete', 'true');
   AsyncStorage.setItem('@ellio_first_session_date', new Date().toISOString());
   ```

2. **User lands on Home:**
   - Empty state shown: "All clear. Add one thing you'd like to handle next."
   - Add task form visible (simple version: name + Add button only)
   - Quick actions available (Voice, Scanner, Camera)

3. **Progressive disclosure begins:**
   - Features revealed based on thresholds (see Progressive Disclosure Rules below)

---

## PROGRESSIVE DISCLOSURE RULES

**Philosophy:** Features are revealed **only after meaningful interaction** — not on cold open.

### Meaningful Interaction Defined

✅ **MEANINGFUL:**
- Task lifecycle: Add → Edit → Complete → Undo
- Intentional navigation: User taps menu item to explore
- Feature use: Scanner, Voice, Camera
- Time spent: ≥20 seconds actively engaged
- Return visits: ≥3 uses of a feature

❌ **NOT MEANINGFUL:**
- Cold app open (resume from background)
- Accidental tap (tap + immediate back)
- Passive scroll (no tap/input)
- Time spent <5 seconds

---

### Feature Disclosure Thresholds

| Feature | Revealed After | Method |
|---------|----------------|--------|
| **Shopping list** | User completes 3 tasks starting with "Buy" | First-time tooltip: "Tasks that start with 'Buy' show up in Shopping list." |
| **Budget** | User scans 5 receipts | First-time tooltip: "Budget suggestion ready. Want to see it?" |
| **Price insights** | User scans 1 receipt | First-time tooltip: "Price insights unlocked. Scan a few more and Ellio will spot patterns." |
| **Cashback** | User scans 10 receipts OR opens Insights 3 times | First-time tooltip: "Link retailer accounts to track cashback." |
| **Timeline** | User adds 5 tasks with dates | First-time tooltip: "Timeline shows when things are due. Tap to see it." |
| **Voice input** | Always available (no threshold) | First-time tooltip after 1st use: "That's it. Voice works from anywhere." |
| **Scanner** | Always available (no threshold) | First-time tooltip before 1st use (if permissions granted) |
| **Family** | User adds 10 tasks OR explicitly navigates to Family | First-time tooltip: "Invite family members to share tasks." |
| **Admin/Compliance** | **NEVER** (remove from menu, move to Preferences) | N/A |

---

### First-Time Tooltip Rules

**Display Logic:**
1. Feature must meet threshold (see table above)
2. Tooltip shown **once per feature** (tracked in AsyncStorage: `@ellio_tooltip_seen_[feature]`)
3. Max **1 tooltip per session** (no stacking)
4. Never show during:
   - Active typing (keyboard visible)
   - Active camera/scanner use
   - Active alert/modal display
5. Tooltip dismissed = 7-day suppression (no re-prompt)

**Tooltip Format:**
```
┌─────────────────────────────────┐
│ [Title] (2-4 words)             │
│                                 │
│ [Body] (1-2 sentences)          │
│                                 │
│ [Footnote] (optional privacy)   │
│                                 │
│  [Show me]     [Not now]        │
└─────────────────────────────────┘
```

**Example (Budget reveal):**
```
Budget suggestion ready

Ellio can suggest a budget based on
your spending. Want to see it?

[Show me]  [Not now]
```

**Interaction:**
- "Show me" → Navigate to feature page + mark tooltip seen
- "Not now" → Dismiss + mark tooltip seen + suppress for 7 days

---

## PERMISSION REQUESTS

**Philosophy:** Explain **before** OS prompt. Never surprise users.

### Microphone Permission

**When:** User taps Voice Input icon for the first time

**Pre-Prompt Screen:**
```
┌─────────────────────────────────┐
│                                 │
│        Voice input              │
│                                 │
│  Voice input lets you add tasks │
│  by speaking.                   │
│                                 │
│  Ellio uses your device's       │
│  speech recognition.            │
│  No audio is stored.            │
│                                 │
│                                 │
│   [Continue]      [Not now]     │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `Voice input`
- Body: `Voice input lets you add tasks by speaking.\n\nEllio uses your device's speech recognition.\nNo audio is stored.`
- Buttons: `Continue` / `Not now`

**Interaction:**
- "Continue" → OS permission prompt → (if granted) → Voice input activated
- "Not now" → Return to Home, Voice icon remains (user can try again later)

---

### Camera Permission

**When:** User taps Scanner or Camera icon for the first time

**Pre-Prompt Screen:**
```
┌─────────────────────────────────┐
│                                 │
│          Camera                 │
│                                 │
│  Barcode scanning and photo     │
│  recognition help you add       │
│  tasks faster.                  │
│                                 │
│  Camera is only used when       │
│  you tap the icons.             │
│                                 │
│                                 │
│   [Continue]      [Not now]     │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `Camera`
- Body: `Barcode scanning and photo recognition help you add tasks faster.\n\nCamera is only used when you tap the icons.`
- Buttons: `Continue` / `Not now`

**Interaction:**
- "Continue" → OS permission prompt → (if granted) → Camera/Scanner activated
- "Not now" → Return to Home, icons remain (user can try again later)

---

### Location Permission (Receipt OCR Only)

**When:** User scans first receipt (if OCR extracts store name/address)

**Pre-Prompt Screen:**
```
┌─────────────────────────────────┐
│                                 │
│   Location (receipts only)      │
│                                 │
│  Ellio finds your approximate   │
│  area (county, ZIP) from store  │
│  info printed on receipts.      │
│                                 │
│  No GPS.                        │
│  No location tracking.          │
│  No history.                    │
│                                 │
│                                 │
│   [Continue]      [Not now]     │
│                                 │
└─────────────────────────────────┘
```

**Copy:**
- Title: `Location (receipts only)`
- Body: `Ellio finds your approximate area (county, ZIP) from store info printed on receipts.\n\nNo GPS. No location tracking. No history.`
- Buttons: `Continue` / `Not now`

**Interaction:**
- "Continue" → OS permission prompt → (if granted) → Receipt OCR uses location for price comparison
- "Not now" → Receipt saved without price insights

**Important:** Location is **never used for real-time tracking**. Only for:
- Extracting county/ZIP from receipt text
- Matching to public price databases

---

## ANTI-NAG RULES

**Philosophy:** Never pressure users. Respect "Not now" decisions.

### Suppression Policy

| Scenario | Suppression | Re-prompt Allowed |
|----------|-------------|-------------------|
| User taps "Not now" on feature tooltip | 7 days | Yes, after 7 days OR 10 more tasks added |
| User taps "Not now" on permission pre-prompt | Forever for that session | Yes, if user explicitly taps icon again |
| User dismisses onboarding tooltip | Forever | No (tooltip shown once per feature) |
| User skips feature disclosure | 7 days | Yes, after 7 days OR threshold met again |

### Max Reveals Per Session

**Rule:** Max **1 feature reveal** per session (tooltip or disclosure)

**Implementation:**
```typescript
// AsyncStorage tracking
const REVEAL_TRACKING_KEY = '@ellio_last_reveal_date';
const MAX_REVEALS_PER_SESSION = 1;

// Check before showing tooltip
const lastRevealDate = await AsyncStorage.getItem(REVEAL_TRACKING_KEY);
const today = new Date().toDateString();

if (lastRevealDate === today) {
  // Already showed 1 reveal today — suppress
  return;
}

// Show tooltip
showTooltip(feature);
await AsyncStorage.setItem(REVEAL_TRACKING_KEY, today);
```

---

## ASYNCSTORAGE SCHEMA

All onboarding/disclosure state tracked in AsyncStorage:

```typescript
// Onboarding completion
@ellio_onboarding_complete: 'true' | null

// First session tracking
@ellio_first_session_date: ISO8601 timestamp

// Tooltip tracking (per feature)
@ellio_tooltip_seen_shopping_list: 'true' | null
@ellio_tooltip_seen_budget: 'true' | null
@ellio_tooltip_seen_price_insights: 'true' | null
@ellio_tooltip_seen_cashback: 'true' | null
@ellio_tooltip_seen_timeline: 'true' | null
@ellio_tooltip_seen_voice: 'true' | null
@ellio_tooltip_seen_scanner: 'true' | null
@ellio_tooltip_seen_family: 'true' | null

// Suppression tracking
@ellio_tooltip_suppressed_[feature]: ISO8601 timestamp (+ 7 days)

// Reveal tracking (max 1 per session)
@ellio_last_reveal_date: 'YYYY-MM-DD'

// Permission tracking (user declined)
@ellio_permission_declined_microphone: 'true' | null
@ellio_permission_declined_camera: 'true' | null
@ellio_permission_declined_location: 'true' | null

// Threshold counters
@ellio_task_count: number
@ellio_receipt_count: number
@ellio_buy_task_count: number
@ellio_voice_use_count: number
@ellio_insights_open_count: number
```

---

## IMPLEMENTATION CHECKLIST

- [ ] **Create FeatureOnboarding.tsx component**
  - [ ] Screen 1: Welcome
  - [ ] Screen 2: Not all at once
  - [ ] Screen 3: Features overview
  - [ ] AsyncStorage flag tracking
  - [ ] Navigation to Home after completion

- [ ] **Create PermissionPrePrompt.tsx component**
  - [ ] Microphone pre-prompt
  - [ ] Camera pre-prompt
  - [ ] Location pre-prompt
  - [ ] AsyncStorage declination tracking

- [ ] **Create FirstTimeTooltip.tsx component**
  - [ ] Tooltip UI (title, body, footnote, buttons)
  - [ ] Threshold logic (check counters)
  - [ ] Max 1 reveal per session enforcement
  - [ ] Suppression logic (7 days)
  - [ ] AsyncStorage seen tracking

- [ ] **Update App.tsx**
  - [ ] Check `@ellio_onboarding_complete` on launch
  - [ ] Show FeatureOnboarding if null
  - [ ] Navigate to Home if complete

- [ ] **Update feature pages** (Shopping list, Budget, Insights, etc.)
  - [ ] Check threshold counters
  - [ ] Trigger FirstTimeTooltip if threshold met
  - [ ] Increment AsyncStorage counters after meaningful interaction

- [ ] **Update VoiceInput.tsx**
  - [ ] Show PermissionPrePrompt before OS prompt
  - [ ] Track declination in AsyncStorage
  - [ ] Show FirstTimeTooltip after 1st successful use

- [ ] **Update BarcodeScanner.tsx**
  - [ ] Show PermissionPrePrompt before OS prompt
  - [ ] Track declination in AsyncStorage
  - [ ] Show FirstTimeTooltip after 1st scan (if permissions granted)

- [ ] **Update HomePage.tsx**
  - [ ] Increment task counter after add/complete
  - [ ] Check for feature disclosure triggers
  - [ ] Show FirstTimeTooltip if eligible

---

## TESTING PLAN

### Manual Testing

1. **Fresh install:**
   - [ ] Onboarding screens appear in order
   - [ ] "Get started" → "Continue" → "Start using Ellio" flow works
   - [ ] Home appears after onboarding complete
   - [ ] Onboarding does not repeat on app relaunch

2. **Permission prompts:**
   - [ ] Tap Voice icon → Pre-prompt appears
   - [ ] "Continue" → OS prompt appears
   - [ ] "Not now" → Pre-prompt dismissed, icon still available
   - [ ] Same flow for Scanner/Camera

3. **Feature disclosure:**
   - [ ] Add 3 "Buy" tasks → Shopping list tooltip appears
   - [ ] Scan 5 receipts → Budget tooltip appears
   - [ ] Max 1 tooltip per session enforced
   - [ ] "Not now" → 7-day suppression works

4. **Anti-nag:**
   - [ ] Tooltip dismissed → Does not re-appear same session
   - [ ] Tooltip dismissed → Re-appears after 7 days
   - [ ] Permission declined → Does not re-prompt same session

### Automated Testing (Unit Tests)

```typescript
// test/onboarding.test.ts
describe('Onboarding', () => {
  it('shows onboarding on first launch', async () => {
    await AsyncStorage.clear();
    const { getByText } = render(<App />);
    expect(getByText('Welcome to Ellio')).toBeTruthy();
  });

  it('skips onboarding if already complete', async () => {
    await AsyncStorage.setItem('@ellio_onboarding_complete', 'true');
    const { queryByText } = render(<App />);
    expect(queryByText('Welcome to Ellio')).toBeNull();
  });

  it('enforces max 1 reveal per session', async () => {
    await AsyncStorage.setItem('@ellio_last_reveal_date', new Date().toDateString());
    const shouldReveal = await canRevealFeature('budget');
    expect(shouldReveal).toBe(false);
  });

  it('suppresses tooltip for 7 days after dismissal', async () => {
    const suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + 7);
    await AsyncStorage.setItem('@ellio_tooltip_suppressed_budget', suppressUntil.toISOString());
    const shouldShow = await shouldShowTooltip('budget');
    expect(shouldShow).toBe(false);
  });
});
```

---

## DESIGN NOTES

### Visual Style

- **Onboarding screens:**
  - Simple illustrations (line art, 2-color max)
  - Generous whitespace (60% screen empty)
  - Typography: Title (typography.sizes.h2), Body (typography.sizes.body)
  - Colors: palette.primary.main (illustrations), palette.neutral[700] (text)

- **Tooltips:**
  - Modal overlay (50% opacity black)
  - Card: white background, shadow.medium, radius.large
  - Max width: 320px (centered)
  - Padding: spacing.large
  - Buttons: spacing.medium apart

- **Permission pre-prompts:**
  - Full-screen modal (palette.neutral[50] background)
  - Icon at top (microphone, camera, location)
  - Centered content
  - Buttons: spacing.medium apart

### Animation

- **Onboarding transitions:**
  - Slide left (400ms ease-out)
  - No back button (forward-only flow)

- **Tooltip entrance:**
  - Fade in + scale (0.95 → 1.0, 200ms ease-out)
  - Overlay fade in (150ms)

- **Tooltip exit:**
  - Fade out + scale (1.0 → 0.95, 150ms ease-in)

---

## FUTURE ENHANCEMENTS

**Version 2.0 (Post-Launch):**
- [ ] Contextual help (? icon in nav bar → help overlay)
- [ ] Feature tour (optional re-walkthrough in Preferences)
- [ ] Progressive feature recommendations ("Try scanning receipts to unlock Budget")
- [ ] Celebration milestones (50 tasks completed, 100 receipts scanned)

**Not Planned:**
- ❌ Gamification (badges, streaks, leaderboards)
- ❌ Push notification onboarding
- ❌ Social sharing prompts
- ❌ Review/rating requests

---

**Questions?**  
Refer to `src/content/ellioCopy.ts` for exact copy strings.
