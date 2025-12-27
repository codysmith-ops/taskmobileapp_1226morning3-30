# Xcode & Simulator Enforcement Infrastructure

## Overview

This project uses **strict enforcement** to ensure all builds and tests use the exact same environment across local development, CI/CD, and all team members.

## Requirements (LOCKED)

| Component | Required Version | Enforcement |
|-----------|-----------------|-------------|
| **Xcode** | 15.4 (Build 15F31d) | Hard-fail preflight |
| **Simulator** | iPhone 15 | Hard-fail preflight |
| **iOS Runtime** | 17.5 | Hard-fail preflight |
| **Node.js** | ≥18 | Preflight warning |
| **CocoaPods** | Latest | Preflight check |

## Enforcement Mechanisms

### 1. Preflight Script (`scripts/preflight.sh`)

**Purpose:** Validates environment before builds/tests  
**Location:** `scripts/preflight.sh`  
**Usage:**
```bash
./scripts/preflight.sh
```

**Checks:**
- ✅ Xcode 15.4 is the active selected Xcode
- ✅ Xcode command line tools point to 15.4
- ✅ iOS 17.5 runtime is installed
- ✅ iPhone 15 simulator with iOS 17.5 exists
- ✅ CocoaPods is installed
- ✅ Node.js ≥18 is installed

**Exit Codes:**
- `0` = All checks passed
- `1` = One or more checks failed (blocks build)

### 2. VS Code Tasks (`.vscode/tasks.json`)

All build/test tasks run preflight checks automatically:

| Task | Command | Preflight |
|------|---------|-----------|
| `iOS: Preflight Check` | Runs preflight only | N/A |
| `iOS: Clean Build (ENFORCED)` | Clean + Build with locked destination | ✅ |
| `iOS: Build (ENFORCED)` | Build with locked destination | ✅ |
| `iOS: Test (ENFORCED)` | Test with locked destination | ✅ |
| `iOS: Run on Simulator (ENFORCED)` | Launch app on iPhone 15 | ✅ |

**Access:** `Cmd+Shift+P` → "Tasks: Run Task"

### 3. GitHub Actions (`.github/workflows/ios-build.yml`)

CI/CD pipeline enforces the same requirements:

```yaml
- name: Select Xcode 15.4
  run: sudo xcode-select -s /Applications/Xcode_15.4.app/Contents/Developer

- name: Run Preflight Checks (ENFORCED)
  run: ./scripts/preflight.sh

- name: Build iOS app (ENFORCED: iPhone 15 / iOS 17.5)
  run: |
    xcodebuild build \
      -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**Triggers:**
- Push to `main`
- Pull requests to `main`

## Locked Build Destination

All builds MUST use this exact destination:

```bash
-destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

**Why locked?**
- Prevents SDK version drift
- Ensures consistent test results
- Catches iOS version-specific bugs early
- Matches production target (iOS 16.0+)

## Quick Start

### First-Time Setup

1. **Switch to Xcode 15.4:**
   ```bash
   sudo xcode-select -s /Applications/Xcode-15.4.app
   xcodebuild -version  # Verify: Xcode 15.4
   ```

2. **Install iOS 17.5 Runtime (if missing):**
   - Open Xcode
   - Settings → Platforms
   - Download "iOS 17.5"

3. **Create iPhone 15 Simulator (if missing):**
   ```bash
   xcrun simctl create "iPhone 15" \
     com.apple.CoreSimulator.SimDeviceType.iPhone-15 \
     com.apple.CoreSimulator.SimRuntime.iOS-17-5
   ```

4. **Run Preflight:**
   ```bash
   ./scripts/preflight.sh
   ```

5. **Install Dependencies:**
   ```bash
   npm install
   cd ios && pod install
   ```

### Daily Workflow

```bash
# Always run preflight first
./scripts/preflight.sh

# Build (via VS Code task or command line)
cd ios && xcodebuild build \
  -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.5'
```

## Troubleshooting

### ❌ "Wrong Xcode selected"

**Error:**
```
❌ PREFLIGHT FAILED
Wrong Xcode selected:
  Current: /Applications/Xcode.app/Contents/Developer
  Required: /Applications/Xcode-15.4.app/Contents/Developer
```

**Fix:**
```bash
sudo xcode-select -s /Applications/Xcode-15.4.app
```

### ❌ "Required simulator not found"

**Error:**
```
❌ PREFLIGHT FAILED
Required simulator not found:
  Required: iPhone 15 (iOS 17.5)
```

**Fix:**
```bash
# Option 1: Create via command line
xcrun simctl create "iPhone 15" \
  com.apple.CoreSimulator.SimDeviceType.iPhone-15 \
  com.apple.CoreSimulator.SimRuntime.iOS-17-5

# Option 2: Create via Xcode
# Window → Devices and Simulators → Simulators → + → iPhone 15 / iOS 17.5
```

### ❌ "iOS 17.5 runtime not found"

**Fix:**
1. Open Xcode
2. Settings (Cmd+,)
3. Platforms tab
4. Click "+" to download iOS 17.5

### ⚠️ Build succeeds but app doesn't run

**Check:**
1. Simulator is running: `open -a Simulator`
2. iPhone 15 is selected
3. Metro bundler is running: `npm start`

## Why This Matters

### Problem: "Works on My Machine"™️

Without enforcement:
- Developer A uses Xcode 16.0 → builds succeed
- Developer B uses Xcode 15.4 → builds succeed
- CI uses Xcode 15.4 → builds fail with SDK errors
- App ships with different SDK behaviors → production bugs

### Solution: Locked Environment

With enforcement:
- Everyone uses **exactly** Xcode 15.4
- Everyone uses **exactly** iPhone 15 / iOS 17.5
- Builds are **deterministic** and **reproducible**
- SDK mismatches are **impossible**

## CI/CD Pipeline

### Build Matrix (Intentionally Minimal)

We use a **single** locked configuration instead of a matrix:

| Xcode | Simulator | OS | Why |
|-------|-----------|----|----|
| 15.4 | iPhone 15 | 17.5 | Production parity, stable GA SDK |

**Why not test multiple versions?**
- We deploy to iOS 16.0+ (deployment target)
- Testing on 17.5 catches regressions for newer OS
- Xcode 15.4 is the last stable GA before 16.x beta churn
- Focus on **depth** (thorough testing on one config) over breadth

### Pipeline Stages

```
┌─────────────────────────────────────────────┐
│ 1. Preflight Check (HARD FAIL)             │
│    - Verify Xcode 15.4                      │
│    - Verify iPhone 15 / iOS 17.5 available  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. Install Dependencies                     │
│    - npm install (with lockfile)            │
│    - pod install (with Podfile.lock)        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. Build (ENFORCED DESTINATION)             │
│    -destination 'platform=iOS Simulator,    │
│     name=iPhone 15,OS=17.5'                 │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 4. Test (same locked destination)           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 5. Upload Artifacts (on failure)            │
└─────────────────────────────────────────────┘
```

## Security Notes

### Secrets Handling

- ❌ **Never** commit secrets to git
- ❌ **Never** print secrets in logs/output
- ✅ Use `.env` files (gitignored) for local dev
- ✅ Use GitHub Secrets for CI/CD
- ✅ Use Keychain for sensitive tokens

### Firebase Configuration

- `GoogleService-Info.plist` is **configuration**, not a secret
- Still: do not leak API keys in public logs
- Preflight script redacts config file contents

## References

- [BEFORE_AUDIT.md](BEFORE_AUDIT.md) - Baseline environment audit
- [REFACTOR_PLAN.md](REFACTOR_PLAN.md) - Modernization strategy
- [scripts/preflight.sh](scripts/preflight.sh) - Enforcement script source
- [.vscode/tasks.json](.vscode/tasks.json) - VS Code task definitions
- [.github/workflows/ios-build.yml](.github/workflows/ios-build.yml) - CI/CD pipeline

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-27 | 1.0.0 | Initial enforcement infrastructure |

---

**Maintained by:** GitHub Copilot (Claude Agent)  
**Last Updated:** December 27, 2025
