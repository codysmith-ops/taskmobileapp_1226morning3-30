# ELLIO VOICE & TONE GUIDE

**Last Updated:** December 30, 2025  
**For:** Product, Design, Engineering, Content teams

---

## CORE PRINCIPLE

> **"Calm momentum. One next step."**

Ellio helps people move forward without feeling behind.

Every word we write, every message we show, every label we choose must reinforce this feeling:

**"It's already handled."**

---

## THE ELLIO PERSONALITY

### What Ellio Is

- **Warm** — Friendly, human, like a thoughtful friend
- **Steady** — Never urgent, never scolding, always measured
- **Competent** — Feels "handled" — automation works quietly in the background
- **Quietly clever** — Witty but not jokey, smart but not showing off
- **Non-judgmental** — No shame, no pressure, no "you should have"
- **Trustworthy** — Explains data sources, automation, privacy plainly

### What Ellio Is Not

- ❌ **Not urgent** — Never "Do this now!" or "You're running out of time!"
- ❌ **Not demanding** — No exclamation points, all caps, or pressure
- ❌ **Not noisy** — No badges, no red dots, no constant notifications
- ❌ **Not corporate** — No jargon like "workflow", "audit trail", "compliance"
- ❌ **Not AI-hype** — Never "AI-powered!" unless we explain exactly how
- ❌ **Not condescending** — No "Great job!" for basic tasks, no gamification

---

## SIGNATURE PHRASES

Use these throughout the app:

- "You're good."
- "Not all at once."
- "Next up."
- "When you're ready."
- "Want help with that?"
- "All set."
- "We'll keep it simple."
- "Already handled."
- "One thing at a time."

---

## WORDS WE LOVE

**Positive, calm, human:**

- Add, start, begin
- Next, later, someday
- Optional, if you want, when you're ready
- Helps you, keeps track of, remembers for you
- Simple, easy, quick
- Preview, example, see how it works

---

## WORDS WE AVOID

**Urgent, corporate, judgmental:**

- ❌ Hurry, ASAP, urgent, now
- ❌ Overdue, late, behind, missed
- ❌ You failed, you should have, you need to
- ❌ Workflow, audit trail, compliance, SLA
- ❌ AI-powered (unless we explain it)
- ❌ Must, required, mandatory (use "needed for [reason]" instead)
- ❌ Maximize, optimize, leverage (corporate jargon)

---

## LABEL GUIDELINES

### Rename for Calm

| ❌ Stressful | ✅ Calm | Why |
|-------------|--------|-----|
| Due Date | When | "Due" implies pressure |
| Assign To | With | "Assign" is corporate |
| Tasks | Next / List | "Tasks" feels like work |
| Submit | Add / Save | "Submit" is formal |
| Delete | Remove | "Delete" is harsh |
| Cancel | Not now | "Cancel" is negative |

### Button Text

| Context | ❌ Avoid | ✅ Use |
|---------|---------|-------|
| Add task | "Submit Task" | "Add" |
| Save changes | "Save Changes" | "Save" |
| Dismiss modal | "Cancel" | "Not now" |
| Skip onboarding | "Skip" | "Maybe later" |
| Delete task | "Delete" | "Remove" |
| Confirm action | "OK" / "Yes" | "Got it" / "Continue" |

---

## MESSAGING PATTERNS

### Empty States

**Purpose:** Guide without pressure

**Bad Examples:**
- ❌ "No tasks yet. Add your first task to get started!"
- ❌ "You haven't set a budget. Set one now!"
- ❌ "0 receipts scanned. Start scanning!"

**Good Examples:**
- ✅ "All clear."
  "Add one thing you'd like to handle next."
- ✅ "No budget set yet."
  "Scan a few receipts and Ellio will suggest one."
- ✅ "Receipts unlock price insights."
  "Tap here to scan your first one."

---

### Tooltips (ⓘ)

**Pattern:**
```
Title: [2-4 words]
Body: [1-2 short sentences — what it does + why it matters]
Footnote (optional): [Privacy/data source]
Buttons: "Got it" or "Show me" / "Not now"
```

**Example (Home — Next up):**
```
Title: Next up
Body: This is the one thing Ellio thinks matters most right now.
Footnote: Not all at once—everything else can wait.
Buttons: [Got it]
```

**Example (Money Saved):**
```
Title: Money saved
Body: Ellio compares prices on your receipts to typical prices in your area.
Footnote: Location comes from store info printed on receipts—not GPS.
Buttons: [Got it] [How it works]
```

---

### Error Messages

**Purpose:** Calm, helpful, blame-free

**Bad Examples:**
- ❌ "Error: Failed to save task. Please try again."
- ❌ "Invalid input. Fix and resubmit."
- ❌ "Permission denied. Enable in Settings."

**Good Examples:**
- ✅ "Couldn't save."
  "Nothing was lost. Try again in a moment."
- ✅ "Microphone permission is needed."
  "Enable it in Settings whenever you're ready."
- ✅ "Didn't catch that."
  "Try again?"

**Pattern:**
```
[What happened] (1-2 words, no blame)
[What's next] (calm, actionable)
```

---

### Success Messages (Toasts)

**Purpose:** Quick confirmation without celebration overload

**Bad Examples:**
- ❌ "Task added successfully! Great work! 🎉"
- ❌ "Goal completed! You're crushing it! 💪"
- ❌ "Receipt scanned. 1/100 towards your goal!"

**Good Examples:**
- ✅ "Added."
- ✅ "Saved."
- ✅ "All set."
- ✅ "Receipt saved." (no count pressure)

**Rule:** 1-2 words max. No emojis unless it's a genuine milestone (e.g., 50 receipts scanned).

---

### Progress/Goal Messages

**Purpose:** Encourage without pressure

**Bad Examples:**
- ❌ "You're behind on your budget!"
- ❌ "Only 2 days left to hit your goal!"
- ❌ "You've only completed 3/20 tasks this week."

**Good Examples:**
- ✅ "You're on track."
  "At this rate, you'll hit your goal by Friday."
- ✅ "Halfway there." (when 50% of goal reached)
- ✅ "Almost there." (when 90% of goal reached)
- ✅ If goal missed: "This week: $12. Last week: $18."
  (Just the facts, no judgment)

---

### Onboarding Copy

**Screen 1:**
```
Welcome to Ellio

One next step at a time.
Add what you need—Ellio keeps it calm.

[Get started]
```

**Screen 2:**
```
Not all at once

Ellio focuses on what's next.
Everything else can wait.

[Continue]
```

**Screen 3:**
```
A few things Ellio can do

• Scan receipts to track spending
• Voice-add tasks naturally
• Suggest what's next

[Start using Ellio]
```

---

### Permission Requests (Before OS Prompt)

**Microphone:**
```
Voice input lets you add tasks by speaking.

Ellio uses your device's speech recognition.
No audio is stored.

[Continue] [Not now]
```

**Camera:**
```
Barcode scanning and photo recognition
help you add tasks faster.

Camera is only used when you tap the icons.

[Continue] [Not now]
```

**Location (Receipt OCR only):**
```
Ellio finds your approximate area (county, ZIP)
from store info printed on receipts.

No GPS. No location tracking. No history.

[Continue] [Not now]
```

---

### Data Transparency

**Budget Sources:**
```
Budget suggestions are based on your past
spending from receipts you've scanned.

You can edit any category anytime.
```

**Cashback Calculations:**
```
Cashback is estimated based on retailer
programs and your purchase history.

Actual amounts may vary by store and date.
```

**Price Insights:**
```
Price comparisons use typical prices in your
area (county and ZIP) from public data sources.

Estimates are updated monthly.
```

**Automation Behavior:**
```
Ellio groups and summarizes tasks to reduce
effort—not add pressure.

You can adjust automation in Settings.
```

---

## TONE GUIDELINES BY CONTEXT

### First-Time User

- **Tone:** Welcoming, patient, non-assuming
- **Voice:** "Let me show you how this works"
- **Example:** "Tap the microphone to try voice input. Say something like: 'Buy milk at Kroger tomorrow.'"

### Returning User

- **Tone:** Familiar, efficient, no hand-holding
- **Voice:** "Here's what's next"
- **Example:** "Next up: Return shirt to Target"

### Error State

- **Tone:** Calm, blame-free, actionable
- **Voice:** "Here's what happened, here's what to do"
- **Example:** "Couldn't connect. Check your internet and try again."

### Empty State

- **Tone:** Encouraging, patient, no urgency
- **Voice:** "It's quiet here—add something when you're ready"
- **Example:** "All clear. Add one thing you'd like to handle next."

### Achievement/Milestone

- **Tone:** Warm, understated (no confetti)
- **Voice:** "Nice work" not "Amazing!!!"
- **Example:** "50 receipts scanned. Price insights are getting sharper."

---

## MICROCOPY REFERENCE

### Navigation Labels

| Page | Label |
|------|-------|
| Home | Home |
| Task list | List |
| Timeline | Timeline |
| Budget | Budget |
| Insights | Insights |
| Receipts | Receipts |
| Family | Family |
| Messages | Messages |
| Settings | Preferences |

### Action Labels

| Action | Label |
|--------|-------|
| Add task | Add |
| Edit task | Edit |
| Delete task | Remove |
| Mark complete | Done |
| Undo | Undo |
| Expand details | Add details |
| Collapse | Show less |
| View all | View all |

### Feedback Labels

| Context | Label |
|---------|-------|
| Save success | Saved |
| Add success | Added |
| Delete success | Removed |
| No changes | All set |
| Loading | One moment... |

---

## CONTENT CHECKLIST

Before publishing any user-facing copy, verify:

- [ ] Uses calm, everyday language (no jargon)
- [ ] No urgency or pressure words
- [ ] No unexplained metrics or automation
- [ ] Follows "Not all at once" principle
- [ ] Includes data source/privacy context where relevant
- [ ] Buttons use calm labels (Add, Save, Not now)
- [ ] Tooltips available for complex features
- [ ] Empty states guide without demanding

---

## EXAMPLES: BEFORE & AFTER

### Example 1: Add Task

**Before:**
```
┌─────────────────────────────────┐
│ Create New Task                 │
│                                 │
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
│ Priority Level                  │
│ [ ] Low [ ] Medium [ ] High     │
│                                 │
│ [Cancel]        [Submit Task]   │
└─────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────┐
│ What do you need?               │
│                                 │
│ [_________________________]     │
│                       [Add]     │
│                                 │
│ → Add details (optional)        │
└─────────────────────────────────┘

(If expanded):
┌─────────────────────────────────┐
│ Buy milk ✓                      │
│                                 │
│ Notes (optional)                │
│ [_________________________]     │
│                                 │
│ When (optional)                 │
│ [Today] [Tomorrow] [Pick date]  │
│                                 │
│ [Add]                           │
└─────────────────────────────────┘
```

### Example 2: Empty Budget

**Before:**
```
Budget Dashboard

You have not set any budgets yet.
Click "Add Budget" to create your first
budget category and start tracking!

[Add Budget]
```

**After:**
```
Budget

Scan a few receipts and Ellio will
suggest budget categories based on
your spending.

[Scan receipt]
```

### Example 3: Error

**Before:**
```
ERROR: Network request failed
Status code: 500
Please check your internet connection
and try again later.

[Retry] [Cancel]
```

**After:**
```
Couldn't connect

Check your internet and try again.

[Try again] [Not now]
```

---

## VOICE & TONE REFERENCE CARD

**Print this and keep it visible:**

```
┌───────────────────────────────────────┐
│ ELLIO VOICE QUICK REFERENCE           │
├───────────────────────────────────────┤
│ ✅ DO                                 │
│ • Warm, friendly, patient             │
│ • Simple, everyday language           │
│ • Explain automation transparently    │
│ • "When you're ready" not "Now!"      │
│ • "Add details" not "Fill all fields" │
│ • "Not now" not "Cancel"              │
│                                       │
│ ❌ DON'T                              │
│ • Urgent, pressuring, scolding        │
│ • Corporate jargon, tech-speak        │
│ • Unexplained metrics or AI           │
│ • Overdue, late, you should have      │
│ • Multiple exclamation points!!!      │
│ • Gamification (badges, streaks)      │
│                                       │
│ 🎯 CORE PRINCIPLE                     │
│ "Not all at once."                    │
│ One next step is enough.              │
└───────────────────────────────────────┘
```

---

**Questions?**  
Refer to `src/content/ellioCopy.ts` for canonical copy strings.

