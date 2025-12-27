# iOS Build Issues - Complete Fix Guide

This guide provides automated scripts to fix all iOS build issues including:
- ❌ `No matching function for call to 'CallSeqFactory'` error
- ⚠️ Build phase warnings for React Native and Firebase scripts
- ⚠️ Other compilation warnings

## 🚀 Quick Fix (Recommended)

Run the comprehensive fix script:

```bash
chmod +x fix_all_ios_issues.sh
./fix_all_ios_issues.sh
```

This script will:
1. ✅ Update your Podfile with all necessary fixes
2. ✅ Clean CocoaPods cache
3. ✅ Reinstall dependencies
4. ✅ Clean Xcode derived data
5. ✅ Fix the CallSeqFactory error
6. ✅ Fix gRPC-Core compilation issues
7. ✅ Fix Firebase warnings
8. ⚠️ Provide instructions for build phase warnings (requires manual step in Xcode)

## 🔧 Fixing Build Phase Warnings

After running the main fix script, you have two options for the build phase warnings:

### Option A: Automatic Fix (Python)

```bash
python3 fix_build_phase_warnings.py
```

This script will automatically add output files to your Xcode project to eliminate the warnings.

### Option B: Automatic Fix (Ruby - requires xcodeproj gem)

```bash
gem install xcodeproj
ruby fix_xcode_build_phases.rb
```

### Option C: Manual Fix (5 minutes)

If the automatic scripts don't work for your project structure:

1. Open your workspace in Xcode:
   ```bash
   open ios/MobileTodoList.xcworkspace
   ```

2. Select your app target (MobileTodoList)

3. Click on the **Build Phases** tab

4. Find **"Bundle React Native code and images"** script phase
   - Expand the **"Output Files"** section at the bottom
   - Click the **+** button
   - Add: `$(DERIVED_FILE_DIR)/main.jsbundle`
   - Add another: `$(DERIVED_FILE_DIR)/main.jsbundle.map`

5. Find **"[CP-User] [RNFB] Core Configuration"** script phase
   - Expand the **"Output Files"** section
   - Click the **+** button
   - Add: `$(DERIVED_FILE_DIR)/rnfb-config-generated.log`

6. Clean and rebuild:
   - Clean: `Cmd + Shift + K`
   - Build: `Cmd + B`

## 📋 What Each Script Does

### `fix_all_ios_issues.sh` (Main Script)
- Comprehensive fix for all build errors and most warnings
- Updates Podfile with compatibility fixes
- Cleans and reinstalls CocoaPods dependencies
- **Fixes:**
  - CallSeqFactory error
  - gRPC-Core template errors
  - Firebase @_implementationOnly warnings
  - C++ standard library issues
  - Deployment target warnings
  - leveldb mmap warnings
  - fmt char_traits deprecation warnings

### `fix_build_phase_warnings.py` (Python)
- Automatically modifies Xcode project file
- Adds output file paths to build phases
- No external dependencies required
- Creates automatic backups

### `fix_xcode_build_phases.rb` (Ruby)
- Same functionality as Python script
- Requires `xcodeproj` gem
- More robust parsing of Xcode project structure

## 🎯 Step-by-Step Process

1. **Run the main fix script:**
   ```bash
   chmod +x fix_all_ios_issues.sh
   ./fix_all_ios_issues.sh
   ```
   This fixes the CallSeqFactory error and most warnings.

2. **Fix build phase warnings (choose one):**
   ```bash
   # Option A: Python
   python3 fix_build_phase_warnings.py
   
   # Option B: Ruby
   gem install xcodeproj && ruby fix_xcode_build_phases.rb
   
   # Option C: Manual (see instructions above)
   ```

3. **Open and build in Xcode:**
   ```bash
   open ios/MobileTodoList.xcworkspace
   ```
   Then: Clean (Cmd+Shift+K) → Build (Cmd+B)

## ⚠️ Troubleshooting

### If you still get the CallSeqFactory error:

```bash
cd ios
rm -rf Pods build DerivedData
pod cache clean --all
pod install --repo-update
cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
```

Then rebuild in Xcode.

### If build phase warnings persist:

The warnings are cosmetic and won't prevent your app from building, but to fully eliminate them:

1. Make sure you've added the output files correctly (check for typos)
2. Try the alternative approach: Uncheck "Based on dependency analysis" for each script phase
3. Clean derived data and rebuild

### If pods fail to install:

```bash
cd ios
pod repo update
pod install --repo-update
cd ..
```

### Nuclear option (last resort):

```bash
# Clean everything
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData
rm package-lock.json  # or yarn.lock

# Reinstall everything
npm install
cd ios
pod install --repo-update
cd ..

# Then run fix script again
./fix_all_ios_issues.sh
```

## ✅ Verification

After applying fixes, you should see:

- ✅ Project builds successfully in Xcode
- ✅ No CallSeqFactory errors
- ✅ No build phase warnings
- ✅ Minimal or no compilation warnings

## 📝 Notes

- The Podfile changes are permanent and safe
- Build phase changes are made to your `.xcodeproj` file
- Backup files are created automatically
- These fixes are compatible with React Native and Firebase
- Changes will persist through future `pod install` runs for the Podfile
- Build phase changes may need to be reapplied if you regenerate your Xcode project

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check that you're using compatible versions:
   - iOS deployment target: 13.4 or higher
   - React Native: Check your package.json
   - CocoaPods: 1.11.0 or higher

2. Make sure you're opening the `.xcworkspace` file, not `.xcodeproj`

3. Try building from command line to see detailed errors:
   ```bash
   cd ios
   xcodebuild -workspace MobileTodoList.xcworkspace \
     -scheme MobileTodoList \
     -configuration Debug \
     clean build
   ```

## 📚 What Changed?

### In Podfile:
- Added gRPC-Core preprocessor definitions
- Fixed C++ language standard to C++17
- Disabled warnings as errors for pods
- Fixed Firebase Swift compiler flags
- Added leveldb platform definition
- Fixed fmt library template args

### In Xcode Project:
- Added output file paths to build script phases
- This allows Xcode to track dependencies properly
- Enables incremental builds (faster!)
- Eliminates unnecessary script re-runs

---

**Created:** December 26, 2025  
**For:** React Native iOS projects with Firebase
