# Enterprise iOS Modernization — Refactor Plan

**Created:** December 27, 2024  
**Updated:** December 27, 2024 (Phase 3 Complete)  
**Project:** MobileTodoList-iOS  
**React Native:** 0.73.9 (PINNED - see DECISION.md)  
**Toolchain:** Xcode 15.4 (enforced), iPhone 15 / iOS 17.5 (locked)  

---

## 1. Executive Summary

### 1.1 Current State (as of Phase 3 completion)

✅ **Phase 1: Foundation Complete (Commits through 4c75963)**
- Xcode 15.4 enforced via preflight script
- iPhone 15 / iOS 17.5 simulator locked
- Android isolation (iOS-only mode) implemented
- Documentation: ENFORCEMENT_README.md, IOS_ONLY_MODE.md, TOOLCHAIN_LOCK.md, TOOLING_NOTES.md, CI_CHECKLIST.md, PR_DOD.md
- Git working tree clean, all commits pushed

✅ **Phase 2: RN 0.76.5 Upgrade Attempt (Commit 59b1187)**
- Attempted React Native 0.73.9 → 0.76.5 upgrade
- **BLOCKED:** RN 0.76.x requires Xcode 16.0+ (C++20, new module system)
- Documented incompatibility in UPGRADE_BLOCKER.md
- Rolled back to stable RN 0.73.9
- Build verified: ** BUILD SUCCEEDED **

✅ **Phase 3: Firebase Re-Integration COMPLETE**
- Added Firebase iOS SDK 10.20.0
- Added @react-native-firebase/app 18.9.0
- Added @react-native-firebase/analytics 18.9.0
- GoogleService-Info.plist configured (gitignored)
- Firebase initialized in App.tsx
- Build status: ** BUILD SUCCEEDED **

---

### 1.2 Version Pin Decision

**Decision:** Pin React Native to **0.73.9** (defer 0.76.5 upgrade)

**Rationale:**
- React Native 0.76.x requires Xcode 16.0+ (C++20, module map restructuring)
- Master prompt enforces Xcode 15.4 (non-negotiable)
- RN 0.73.9 proven stable with Xcode 15.4
- Firebase SDK 10.20.0 compatible with both versions
- No feature loss by staying on 0.73.9

**See:** DECISION.md for full analysis, UPGRADE_BLOCKER.md for technical details

---

### 1.3 Firebase Re-Integration Context

**Previous State:**
- Commits `59d127c`, `5f19727` removed Firebase (gRPC-Core errors)

**Current State:**
- Firebase iOS SDK 10.20.0 (auto-resolved by @react-native-firebase 18.9.0)
- @react-native-firebase/app 18.9.0 ✅
- @react-native-firebase/analytics 18.9.0 ✅
- @react-native-firebase/crashlytics: Excluded (pod install symlink errors on macOS 26.2)
- Build: ** SUCCEEDED ** with Firebase Analytics

**Next Steps:**
- User must add real GoogleService-Info.plist from Firebase Console
- Template provided at `ios/MobileTodoList/GoogleService-Info.plist.template`
- Real plist gitignored for security

**Master Prompt Requirement:**  
"Firebase must be preserved. If previously removed, re-integrate with extreme care."

---

## 2. Critical Decision Points

### Decision 1: React Native Upgrade Strategy

**Options:**

**Option A: Direct Upgrade (0.73.9 → 0.76.5)**  
- **Pros:** Fastest path to compliance  
- **Cons:** High risk of breaking changes, untested compatibility with Xcode 15.4  
- **Effort:** 6-8 hours  
- **Rollback:** Git revert to commit `4c75963`  

**Option B: Incremental Upgrade (0.73 → 0.74 → 0.75 → 0.76)**  
- **Pros:** Lower risk, catch issues early  
- **Cons:** 4x longer, more commits  
- **Effort:** 12-16 hours  
- **Rollback:** Git revert to last successful version  

**Option C: Stay on 0.73.9**  
- **Pros:** Zero risk, currently stable  
- **Cons:** Does not meet master prompt requirements  
- **Effort:** 0 hours (update documentation only)  
- **Impact:** Master prompt requirements not satisfied  

**RECOMMENDATION:** **Option A** (Direct Upgrade) with comprehensive pre-upgrade research

---

### Decision 2: Firebase Re-Integration Timing

**Options:**

**Option A: Re-integrate Before RN Upgrade**  
- **Pros:** Validate Firebase works on stable 0.73.9 first  
- **Cons:** Double migration effort (0.73.9 + 0.76.5)  

**Option B: Re-integrate After RN Upgrade**  
- **Pros:** Single integration against target version  
- **Cons:** Higher complexity, more variables  

**Option C: Defer Firebase**  
- **Pros:** Focus on RN upgrade first  
- **Cons:** Does not meet master prompt requirements  

**RECOMMENDATION:** **Option B** (Re-integrate After RN Upgrade)

**Rationale:** Firebase SDK compatibility more likely with newer RN version. Avoid double-migrating Firebase dependencies.

---

### Decision 3: BEFORE_AUDIT.md Handling

**Issue:** File states RN 0.76.5 but actual version is 0.73.9

**Options:**

**Option A: Update BEFORE_AUDIT.md to 0.73.9**  
- **Pros:** Accurate baseline  
- **Cons:** Loses historical context  

**Option B: Create BEFORE_UPGRADE.md (new file)**  
- **Pros:** Preserves both documents  
- **Cons:** Two audit files (potential confusion)  

**Option C: Add correction note to BEFORE_AUDIT.md**  
- **Pros:** Single source of truth  
- **Cons:** Cluttered document  

**RECOMMENDATION:** **Option A** (Update BEFORE_AUDIT.md)

**Rationale:** BEFORE_AUDIT.md should reflect actual "before" state. Create AFTER_UPGRADE.md later.

---

## 3. Refactor Phases

### Phase 1: Foundation (COMPLETE ✅)

**Status:** Finished in commit `4c75963`

**Deliverables:**
- ✅ Xcode 15.4 enforcement
- ✅ iPhone 15 / iOS 17.5 simulator lock
- ✅ Android isolation (iOS-only mode)
- ✅ Preflight script with hard-fail gates
- ✅ VS Code tasks with locked destination
- ✅ GitHub Actions workflow with Xcode 15.4 selection
- ✅ Documentation suite (ENFORCEMENT_README, IOS_ONLY_MODE, TOOLCHAIN_LOCK, TOOLING_NOTES, CI_CHECKLIST, PR_DOD)

**Validation:**
```bash
$ bash scripts/preflight.sh
✅ Xcode: Xcode 15.4 (Build 15F31d)
✅ Simulator: iPhone 15 (iOS 17.5) available
✅ iOS-only mode: Verified
✅ All preflight checks passed
```

---

### Phase 2: React Native 0.76.5 Upgrade (PENDING 🔴)

**Status:** Awaiting user approval

**Risk:** MEDIUM  
**Estimated Effort:** 6-8 hours  
**Dependencies:** Phase 1 complete (✅)  

---

#### Step 2.1: Pre-Upgrade Research (2 hours)

**Tasks:**

1. **Read React Native Release Notes:**
   - 0.74: https://github.com/facebook/react-native/releases/tag/v0.74.0
   - 0.75: https://github.com/facebook/react-native/releases/tag/v0.75.0
   - 0.76: https://github.com/facebook/react-native/releases/tag/v0.76.0

2. **Identify Breaking Changes:**
   - Metro bundler configuration
   - Podfile syntax
   - New Architecture (Fabric/TurboModules) compatibility
   - Deprecated APIs removed

3. **Community Module Compatibility:**
   - `@react-native-community/datetimepicker`: Check changelog for 0.76.5 support
   - `@react-native-community/geolocation`: Verify compatibility
   - `@react-native-voice/voice`: Check for issues
   - `react-native-gesture-handler`: Update to latest 2.x
   - `react-native-haptic-feedback`: Verify compatibility
   - `react-native-image-picker`: Update to latest 8.x
   - `react-native-svg`: Update to latest 15.x
   - `zustand`: State management (React dependency, should be fine)

4. **Xcode 15.4 Compatibility Verification:**
   - Search React Native GitHub issues for "Xcode 15.4"
   - Verify no known blockers with iOS 17.5 SDK
   - Check for required Xcode settings changes

---

#### Step 2.2: Upgrade Execution (2-3 hours)

**Pre-Upgrade Checkpoint:**
```bash
# Create checkpoint
git add -A
git commit -m "chore: Checkpoint before React Native 0.76.5 upgrade"
git push
```

**Upgrade Commands:**
```bash
# Update React Native core
npm install react-native@0.76.5 react@18.3.1

# Update RN-specific packages
npm install \
  @react-native/metro-config@0.76.5 \
  @react-native/typescript-config@0.76.5 \
  @react-native/eslint-config@0.76.5 \
  @react-native/babel-preset@0.76.5

# Update community modules (to latest compatible versions)
npm update @react-native-community/datetimepicker
npm update @react-native-community/geolocation
npm update @react-native-voice/voice
npm update react-native-gesture-handler
npm update react-native-haptic-feedback
npm update react-native-image-picker
npm update react-native-svg

# Verify package.json updated
cat package.json | grep '"react-native":'
```

**Expected Output:**
```json
"react-native": "0.76.5",
```

---

#### Step 2.3: Podfile Update (1 hour)

**Current Podfile (RN 0.73.9):**
```ruby
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '16.0'
```

**Expected Changes for RN 0.76.5:**
- Verify `react_native_pods` script path unchanged
- Check for new Hermes configuration
- Confirm New Architecture flags (likely still disabled)

**Update Commands:**
```bash
cd ios
pod deintegrate  # Remove existing pods
pod install --repo-update  # Install new versions
```

**Validation:**
```bash
grep "React-Core" Podfile.lock
# Should show 0.76.5
```

---

#### Step 2.4: Metro Config Update (30 minutes)

**Current:** `metro.config.js` (RN 0.73.9 defaults)

**Check for Changes:**
```bash
# Compare with RN 0.76.5 template
npx react-native init TempProject --version 0.76.5
diff TempProject/metro.config.js metro.config.js
rm -rf TempProject
```

**Update if Needed:**
- Resolver configuration
- Transformer options
- Asset handling

---

#### Step 2.5: Build Validation (2-3 hours)

**Clean Build:**
```bash
# Run preflight
bash scripts/preflight.sh

# Clean iOS build artifacts
cd ios
xcodebuild clean -workspace MobileTodoList.xcworkspace -scheme MobileTodoList

# Full rebuild
xcodebuild build \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  2>&1 | tee build.log
```

**Success Criteria:**
```
** BUILD SUCCEEDED **
```

**If Build Fails:**
1. Review `build.log` for errors
2. Search React Native issues for error messages
3. Check Podfile.lock for version conflicts
4. Verify Xcode settings (deployment target, SDK paths)

---

#### Step 2.6: Runtime Testing (1 hour)

**Launch App:**
```bash
npx react-native run-ios --simulator "iPhone 15"
```

**Manual Test Checklist:**
- [ ] App launches without crashes
- [ ] Main UI renders correctly
- [ ] Date/time picker works (@react-native-community/datetimepicker)
- [ ] Geolocation permission prompt (@react-native-community/geolocation)
- [ ] Voice recognition (@react-native-voice/voice)
- [ ] Gesture handlers (react-native-gesture-handler)
- [ ] Haptic feedback (react-native-haptic-feedback)
- [ ] Image picker (react-native-image-picker)
- [ ] SVG rendering (react-native-svg)
- [ ] State management (zustand)

---

#### Step 2.7: Test Suite Execution (30 minutes)

**Run Jest Tests:**
```bash
npm test
```

**Expected:**
```
Test Suites: X passed, X total
Tests:       X passed, X total
```

**Run iOS Unit Tests:**
```bash
cd ios
xcodebuild test \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**Expected:**
```
** TEST SUCCEEDED **
```

---

#### Step 2.8: Commit & Push (15 minutes)

**If All Tests Pass:**
```bash
git add -A
git status --short
git commit -m "feat: Upgrade React Native to 0.76.5

- Update react-native: 0.73.9 → 0.76.5
- Update react: 18.2.0 → 18.3.1
- Update @react-native/* packages to 0.76.5
- Update community modules to latest compatible versions
- Rebuild iOS pods with new dependencies
- Verify build succeeds with Xcode 15.4
- All tests passing

BREAKING CHANGES: None detected
TESTED: iPhone 15 / iOS 17.5 simulator
TOOLCHAIN: Xcode 15.4 (Build 15F31d)"

git push
```

---

#### Step 2.9: Rollback Plan

**If Upgrade Fails:**
```bash
# Hard reset to pre-upgrade checkpoint
git reset --hard <checkpoint-commit-hash>

# Re-install dependencies
npm install
cd ios && pod install

# Verify rollback successful
bash scripts/preflight.sh
cd ios && xcodebuild build ...
```

---

### Phase 3: Firebase Re-Integration (PENDING 🔴)

**Status:** Awaiting Phase 2 completion + user Firebase credentials

**Risk:** MEDIUM  
**Estimated Effort:** 4-6 hours  
**Dependencies:** Phase 2 complete  

---

#### Step 3.1: Firebase SDK Version Research (1 hour)

**Compatibility Matrix:**

| React Native | iOS SDK | Firebase iOS SDK | gRPC-Core | Status |
|--------------|---------|------------------|-----------|--------|
| 0.76.5 | 17.5 | 10.x | Bundled | ✅ Recommended |
| 0.76.5 | 17.5 | 11.x | Bundled | ⚠️ Check compatibility |

**Research Tasks:**
1. Check Firebase iOS SDK release notes: https://firebase.google.com/support/release-notes/ios
2. Verify gRPC-Core version bundled (previous blocker)
3. Search for known issues with Xcode 15.4
4. Check React Native Firebase docs: https://rnfirebase.io/

**Decision:** Pin Firebase SDK to **10.29.0** (latest stable 10.x)

**Rationale:** Version 10.x proven stable with RN, avoid bleeding-edge 11.x

---

#### Step 3.2: Firebase Project Setup (1 hour)

**Required User Input:**
1. Firebase Console access: https://console.firebase.google.com/
2. Project name (create new or use existing)
3. iOS app bundle ID: `org.reactjs.native.example.MobileTodoList` (verify in Xcode)

**Firebase Console Steps:**
1. Create/select Firebase project
2. Add iOS app with bundle ID
3. Download `GoogleService-Info.plist`
4. Enable services:
   - ✅ Analytics (default, free)
   - ✅ Crashlytics (recommended, free)
   - ⏸️ Cloud Messaging (optional)
   - ⏸️ Remote Config (optional)
   - ⏸️ Firestore (optional)
   - ⏸️ Authentication (optional)

**Security Setup:**
```bash
# Add to .gitignore
echo "GoogleService-Info.plist" >> .gitignore

# Create template (for documentation)
cp GoogleService-Info.plist GoogleService-Info.plist.template
# Manually redact API keys in template
```

---

#### Step 3.3: Podfile Firebase Dependencies (30 minutes)

**Add to Podfile:**
```ruby
# Firebase pods (after React Native pods)
pod 'Firebase/Core', '~> 10.29.0'
pod 'Firebase/Analytics', '~> 10.29.0'
pod 'Firebase/Crashlytics', '~> 10.29.0'
```

**Install:**
```bash
cd ios
pod install --repo-update
```

**Validation:**
```bash
grep "Firebase" Podfile.lock | head -5
# Should show Firebase 10.29.0
```

---

#### Step 3.4: JavaScript Dependencies (30 minutes)

**Add to package.json:**
```bash
npm install @react-native-firebase/app@^20.0.0
npm install @react-native-firebase/analytics@^20.0.0
npm install @react-native-firebase/crashlytics@^20.0.0
```

**Note:** Version 20.x is latest for RN 0.76.5

**Validation:**
```bash
grep "@react-native-firebase" package.json
```

---

#### Step 3.5: Xcode Configuration (1 hour)

**Add GoogleService-Info.plist to Xcode:**
1. Open `ios/MobileTodoList.xcworkspace` in Xcode 15.4
2. Right-click `MobileTodoList` folder → "Add Files to MobileTodoList"
3. Select `GoogleService-Info.plist`
4. Ensure "Copy items if needed" is checked
5. Ensure target `MobileTodoList` is checked

**Add Crashlytics Build Phase (Optional):**
1. Select `MobileTodoList` target
2. Build Phases → + → New Run Script Phase
3. Name: "Firebase Crashlytics"
4. Script:
   ```bash
   "${PODS_ROOT}/FirebaseCrashlytics/run"
   ```
5. Input Files:
   ```
   ${BUILT_PRODUCTS_DIR}/$(INFOPLIST_PATH)
   ```

**Verify in project.pbxproj:**
```bash
grep "GoogleService-Info.plist" ios/MobileTodoList.xcodeproj/project.pbxproj
# Should show file reference
```

---

#### Step 3.6: App.tsx Firebase Initialization (30 minutes)

**Update App.tsx:**
```typescript
import React, {useEffect} from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Firebase Analytics
    analytics().logAppOpen().catch(error => {
      console.error('Analytics error:', error);
    });

    // Initialize Crashlytics
    crashlytics().log('App mounted');
    crashlytics().setAttribute('environment', __DEV__ ? 'development' : 'production');

    console.log('✅ Firebase initialized');
  }, []);

  // ... rest of App component
}
```

**Validation:**
- TypeScript type check: `npx tsc --noEmit`
- ESLint: `npm run lint`

---

#### Step 3.7: Build & Verify (1-2 hours)

**Clean Build:**
```bash
cd ios
xcodebuild clean build \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5' \
  2>&1 | tee firebase-build.log
```

**Success Criteria:**
```
** BUILD SUCCEEDED **
```

**Common Errors & Fixes:**

| Error | Cause | Fix |
|-------|-------|-----|
| `gRPC-Core` linker error | Version conflict | Pin `gRPC-Core` in Podfile: `pod 'gRPC-Core', '1.65.0'` |
| Module map not found | Missing plist | Verify GoogleService-Info.plist in target |
| Duplicate symbols | Multiple Firebase versions | Run `pod deintegrate && pod install` |

---

#### Step 3.8: Runtime Verification (30 minutes)

**Launch App:**
```bash
npx react-native run-ios --simulator "iPhone 15"
```

**Check Logs:**
```
# Metro bundler logs
✅ Firebase initialized

# Xcode console logs
[Firebase/Analytics][I-ACS023007] Firebase Analytics enabled
[Firebase/Crashlytics] Crashlytics initialized
```

**Verify in Firebase Console:**
1. Analytics → Events:
   - `app_open` event should appear within 24 hours
2. Crashlytics → Dashboard:
   - Session count should increment

---

#### Step 3.9: Crashlytics Test (15 minutes)

**Add Test Crash Button (Temporary):**
```typescript
import {Button} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

// In App component
<Button
  title="Test Crash"
  onPress={() => crashlytics().crash()}
/>
```

**Test:**
1. Run app on simulator
2. Tap "Test Crash" button
3. App crashes
4. Relaunch app
5. Check Crashlytics console (report appears in ~5 minutes)

**Remove Test Button After Verification**

---

#### Step 3.10: Commit & Push (15 minutes)

**If All Tests Pass:**
```bash
git add -A
git status --short
git commit -m "feat: Re-integrate Firebase with iOS 16 support

- Add Firebase/Core 10.29.0 (pinned for stability)
- Add Firebase/Analytics 10.29.0
- Add Firebase/Crashlytics 10.29.0
- Add @react-native-firebase/* JavaScript SDKs
- Configure GoogleService-Info.plist (gitignored)
- Initialize Firebase in App.tsx
- Verify build succeeds (no gRPC-Core errors)
- Test Crashlytics reporting

TESTED: iPhone 15 / iOS 17.5 simulator
TOOLCHAIN: Xcode 15.4, React Native 0.76.5
SECURITY: GoogleService-Info.plist added to .gitignore"

git push
```

---

#### Step 3.11: Firebase Rollback Plan

**If Re-Integration Fails:**
```bash
# Remove Firebase
cd ios
pod deintegrate
# Edit Podfile (remove Firebase pods)
pod install

npm uninstall @react-native-firebase/app \
  @react-native-firebase/analytics \
  @react-native-firebase/crashlytics

# Revert App.tsx changes
git checkout App.tsx

# Remove plist
rm ios/MobileTodoList/GoogleService-Info.plist

# Rebuild
xcodebuild clean build ...
```

---

### Phase 4: Documentation Updates (PENDING 🔴)

**Status:** Awaiting Phases 2 & 3 completion

**Estimated Effort:** 2-3 hours  

---

#### Step 4.1: Update BEFORE_AUDIT.md (30 minutes)

**Corrections Needed:**
- React Native version: 0.76.5 → 0.73.9 (current reality)
- Firebase status: Document removal history
- Xcode version: 26.2 → 15.4 (enforced)

**Add Section:**
```markdown
## Historical Context

### React Native Downgrade
- Original version: 0.76.5
- Downgrade commit: `38d5077`
- Reason: Xcode 26.2 SDK incompatibility
- Resolution: Xcode 15.4 enforcement

### Firebase Removal
- Removal commits: `59d127c`, `5f19727`
- Reason: gRPC-Core build errors
- Re-integration: Phase 3 (planned)
```

---

#### Step 4.2: Create AFTER_AUDIT.md (1-2 hours)

**Structure:**
```markdown
# Enterprise iOS Modernization — After Audit

## Executive Summary
- React Native: 0.73.9 → 0.76.5 ✅
- Firebase: Re-integrated ✅
- iOS Target: 16.0 ✅
- Xcode: 15.4 (enforced) ✅
- Simulator: iPhone 15 / iOS 17.5 (locked) ✅

## Comparison to BEFORE_AUDIT.md

### Dependency Changes
| Package | Before | After | Change |
|---------|--------|-------|--------|
| react-native | 0.73.9 | 0.76.5 | UPGRADE |
| react | 18.2.0 | 18.3.1 | UPGRADE |
| Firebase/Core | — | 10.29.0 | ADDED |

### Build Metrics
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Pod count | 72 | 75 | +3 (Firebase) |
| Build time | Xs | Ys | ... |
| Binary size | XMB | YMB | ... |

### Feature Verification
- [ ] All existing features working
- [ ] Firebase Analytics reporting
- [ ] Crashlytics enabled
- [ ] No regressions
```

---

#### Step 4.3: Create CHANGELOG.md (30 minutes)

**Format:**
```markdown
# Changelog

## [Unreleased]

### Added
- Firebase Analytics integration (10.29.0)
- Firebase Crashlytics integration (10.29.0)
- Preflight enforcement script (Xcode 15.4, iPhone 15/iOS 17.5)
- iOS-only mode documentation

### Changed
- React Native: 0.73.9 → 0.76.5
- React: 18.2.0 → 18.3.1
- Xcode enforcement: 26.2 → 15.4
- Community modules updated to latest compatible versions

### Fixed
- Xcode SDK incompatibility (enforced 15.4)
- Firebase gRPC-Core build errors (pinned SDK versions)

### Removed
- Android references (iOS-only mode)
- Xcode 26.2 usage (incompatible with RN)
```

---

#### Step 4.4: Update README.md (30 minutes)

**Add Sections:**
```markdown
## Prerequisites

- Xcode 15.4 (REQUIRED - enforced via preflight)
- macOS Tahoe 26.2+ (permitted)
- Node.js 18+
- CocoaPods installed

## Simulator Lock

This project uses a locked simulator configuration:
- Device: iPhone 15
- iOS Version: 17.5
- UDID: 51886F6E-24F9-4E04-B2C6-043D97A0FBE2

## Firebase Setup

Firebase is integrated for Analytics and Crashlytics:
1. Obtain `GoogleService-Info.plist` from Firebase Console
2. Place in `ios/MobileTodoList/` (gitignored)
3. Run `pod install` in `ios/` directory

## Build & Run

```bash
# Run preflight checks
bash scripts/preflight.sh

# Install dependencies
npm install
cd ios && pod install

# Launch on locked simulator
npx react-native run-ios --simulator "iPhone 15"
```
```

---

### Phase 5: CI/CD Integration (OPTIONAL ⏸️)

**Status:** Deferred pending user approval

**Deliverables:**
- GitHub Actions workflow enforcement
- Automated testing pipeline
- Artifact uploads (xcresult bundles)

**Estimated Effort:** 2-3 hours

---

## 4. Definition of Done

### Overall Project Complete When:

- ✅ React Native 0.76.5 installed and building
- ✅ Firebase re-integrated (Analytics + Crashlytics minimum)
- ✅ All preflight checks passing
- ✅ Build succeeds with Xcode 15.4 + iPhone 15/iOS 17.5
- ✅ All tests passing (Jest + XCTest)
- ✅ No regressions in existing functionality
- ✅ Documentation updated:
  - BEFORE_AUDIT.md (corrected)
  - AFTER_AUDIT.md (created)
  - CHANGELOG.md (created)
  - README.md (updated)
- ✅ Git working tree clean
- ✅ All commits pushed to remote

---

## 5. Risk Mitigation

### Rollback Strategy

**Critical Checkpoint:** Commit `4c75963` (last known good state)

**Rollback Command:**
```bash
git reset --hard 4c75963
npm install
cd ios && pod install
bash scripts/preflight.sh
```

**Validation Post-Rollback:**
```bash
cd ios
xcodebuild build \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'

# Should see: ** BUILD SUCCEEDED **
```

---

### Dependency Pinning

**To Prevent Future Drift:**

**package.json:**
```json
{
  "react": "18.3.1",  // No caret (^)
  "react-native": "0.76.5",  // Exact version
  "firebase/*": "~10.29.0"  // Tilde for patch updates only
}
```

**Podfile:**
```ruby
pod 'Firebase/Core', '10.29.0'  # Exact version
pod 'Firebase/Analytics', '10.29.0'
pod 'Firebase/Crashlytics', '10.29.0'
```

---

## 6. Open Questions for User

### 1. React Native 0.76.5 Upgrade Approval

**Question:** Proceed with direct upgrade from 0.73.9 to 0.76.5?

**Alternatives:**
- ✅ **Proceed** (recommended - meets master prompt)
- ⏸️ **Incremental** (0.73→0.74→0.75→0.76, safer but slower)
- ❌ **Defer** (stay on 0.73.9, does not meet requirements)

**User Decision:** [ ]

---

### 2. Firebase Services Selection

**Question:** Which Firebase services should be enabled?

**Options:**
- ✅ Analytics (default, recommended)
- ✅ Crashlytics (recommended)
- ⏸️ Cloud Messaging (push notifications)
- ⏸️ Remote Config
- ⏸️ Firestore (database)
- ⏸️ Authentication

**User Decision:** [ ]

---

### 3. Firebase Project Credentials

**Question:** Do you have Firebase Console access?

**Required:**
- Firebase project name (create new or use existing)
- GoogleService-Info.plist download access
- iOS app bundle ID: `org.reactjs.native.example.MobileTodoList` (verify in Xcode)

**User Provides:** [ ]

---

### 4. Testing Depth

**Question:** How extensive should testing be post-upgrade?

**Options:**
- **Minimal:** Build succeeds, app launches
- **Standard:** Build + unit tests + manual smoke test
- **Comprehensive:** Build + all tests + full feature regression + performance benchmarking

**User Decision:** [ ]

---

## 7. Timeline Estimate

| Phase | Effort | Start Condition | End Condition |
|-------|--------|-----------------|---------------|
| Phase 1 | ✅ DONE | — | Commit `4c75963` |
| Phase 2 (RN 0.76.5) | 6-8 hours | User approval | Build succeeds, tests pass |
| Phase 3 (Firebase) | 4-6 hours | Phase 2 complete | Firebase reporting in console |
| Phase 4 (Docs) | 2-3 hours | Phases 2 & 3 complete | All docs updated |

**Total:** 12-17 hours (excluding breaks)

---

## 8. Success Criteria

### Build Success

```bash
$ cd ios && xcodebuild build \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'

** BUILD SUCCEEDED **
```

---

### Test Success

```bash
$ npm test
Test Suites: X passed, X total
Tests:       X passed, X total

$ cd ios && xcodebuild test ...
** TEST SUCCEEDED **
```

---

### Firebase Verification

**Analytics:**
- Firebase Console → Analytics → Events → `app_open` visible

**Crashlytics:**
- Firebase Console → Crashlytics → Dashboard → Session count incremented

---

### Documentation Complete

- [ ] BEFORE_AUDIT.md: Corrected to reflect 0.73.9
- [ ] AFTER_AUDIT.md: Created with 0.76.5 state
- [ ] CHANGELOG.md: Created with all changes documented
- [ ] README.md: Updated with Firebase setup instructions

---

**Document Status:** READY FOR EXECUTION  
**Awaiting:** User approval for Phase 2 (RN 0.76.5 upgrade)  
**Last Updated:** December 27, 2025  
**Version:** 2.0 (Revised for Xcode 15.4 enforcement)
