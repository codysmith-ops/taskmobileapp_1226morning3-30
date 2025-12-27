# iOS Build Fix - Quick Guide

## What This Fixes

- ❌ gRPC-Core template error (CRITICAL)
- ⚠️ Run script warnings (3 total)
- ⚠️ Firebase @_implementationOnly warning
- ⚠️ fmt and leveldb warnings

## Quick Fix

```bash
chmod +x fix_ios_build.sh
./fix_ios_build.sh
```

Then open Xcode:

```bash
open ios/MobileTodoList.xcworkspace
```

## What the Script Does

1. **Cleans CocoaPods cache** - Removes cached pod data
2. **Removes old artifacts** - Deletes Pods/, build/, Podfile.lock
3. **Updates Podfile** - Applies compatibility fixes (backs up original)
4. **Updates pod repo** - Gets latest pod specifications
5. **Installs pods** - Reinstalls with fixed versions
6. **Cleans Xcode data** - Removes DerivedData and build folders

## Manual Steps (if script fails)

### 1. Update Podfile

Replace `ios/Podfile` with the contents from `Podfile_FIXED`:

```bash
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
cp Podfile_FIXED ios/Podfile
```

### 2. Clean and Reinstall

```bash
cd ios
rm -rf Pods Podfile.lock build
pod cache clean --all
pod install --repo-update
```

### 3. Clean Xcode

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
```

### 4. Build in Xcode

- Open workspace (not .xcodeproj)
- Product → Clean Build Folder (⌘⇧K)
- Product → Build (⌘B)

## Key Changes in Podfile_FIXED

### gRPC-Core Fix
```ruby
pod 'gRPC-Core', '1.44.0', :modular_headers => false
pod 'gRPC-C++', '1.44.0', :modular_headers => false
```

### Firebase Version Lock
```ruby
pod 'Firebase/Core', '~> 10.20.0'
```

### Build Settings
- C++ standard: c++17 / gnu++17
- Deployment target: iOS 13.0
- Warning suppressions for third-party code

### Run Script Output Paths
Adds output paths to prevent "run during every build" warnings:
- Bundle React Native code
- RNFB Core Configuration
- Hermes replacement

## Verification

After running the fix:

1. **Build should succeed** without errors
2. **Warnings reduced** from many to near-zero
3. **gRPC-Core error** should be gone

## Troubleshooting

### Script Permission Error
```bash
chmod +x fix_ios_build.sh
```

### Pod Install Fails
Update CocoaPods:
```bash
sudo gem install cocoapods
pod repo update
```

### Still Getting Errors?
1. Check Xcode version (should be 14.0+)
2. Check Ruby version: `ruby --version` (should be 2.6+)
3. Try manual steps above

## Next Steps After Fix

1. ✅ Build succeeds in Xcode
2. 🚀 Run on simulator
3. 📱 Test all features
4. 🎉 Deploy to TestFlight

---

**Questions?** Check the main README or open an issue.
