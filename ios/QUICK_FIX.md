# Quick Fix Guide - iOS Build Errors

## 🚀 Fast Track Solution (5 minutes)

If you want to fix everything quickly, run this:

```bash
# Make the script executable
chmod +x fix_all_build_issues.sh

# Run it
./fix_all_build_issues.sh
```

This script automatically:
- Closes Xcode
- Cleans all build artifacts
- Fixes duplicate -lc++ warnings
- Reinstalls dependencies
- Reinstalls CocoaPods
- Provides next steps

---

## 📋 Manual Fix (If Script Doesn't Work)

### 1. Clean Everything (Required)

```bash
# Close Xcode
killall Xcode

# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean project
cd /Users/codysmith/taskmobileapp_1226morning/MobileTodoList-iOS
rm -rf ios/build ios/Pods ios/Podfile.lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
cd ios && pod install && cd ..
```

### 2. Update Podfile (Critical for Hermes Sandbox Errors)

Add this to your `ios/Podfile` in the `post_install` block:

```ruby
post_install do |installer|
  # Standard React Native post install
  react_native_post_install(installer, config[:reactNativePath], :mac_catalyst_enabled => false)
  
  # Fix sandbox errors
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    end
  end
end
```

### 3. Fix Duplicate -lc++ Warning

```bash
# Run the Python fixer
python3 fix_duplicate_lc++.py

# OR manually in Xcode:
# 1. Open ios/MobileTodoList.xcworkspace
# 2. Select project → Target → Build Settings
# 3. Search "Other Linker Flags"
# 4. Remove duplicate -lc++ entries
```

### 4. Open Xcode and Build

```bash
open ios/MobileTodoList.xcworkspace
```

Then in Xcode:
1. Product → Clean Build Folder (⇧⌘K)
2. If you see "Update to recommended settings" → Click it
3. Product → Build (⌘B)

---

## 🎯 What Each Error Means

### Sandbox: rsync deny(1) errors
**Cause**: Xcode's build script sandbox blocking file access to Hermes framework  
**Fix**: Add `ENABLE_USER_SCRIPT_SANDBOXING = 'NO'` to Podfile post_install

### Duplicate -lc++ warning
**Cause**: C++ standard library linked multiple times in build settings  
**Fix**: Run `python3 fix_duplicate_lc++.py` or manually remove duplicates

### Search path not found (Metal toolchain)
**Cause**: Xcode looking for development toolchain that doesn't exist  
**Fix**: Safe to ignore - it's cosmetic and won't affect builds

### Cannot find protocol definition for 'RCTBridgeDelegate'
**Cause**: Incorrect pod installation or missing React Native headers  
**Fix**: Clean reinstall of pods (step 1 above)

### Update to recommended settings
**Cause**: Pods project using outdated Xcode build settings  
**Fix**: Click "Perform Changes" when Xcode shows the warning

---

## 🔍 Troubleshooting

### Still Getting Sandbox Errors?

**Option 1**: Disable Hermes temporarily

Edit `ios/Podfile`:
```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => false,  # ← Change this
)
```

Then: `cd ios && pod install && cd ..`

**Option 2**: Grant full disk access
1. System Settings → Privacy & Security → Full Disk Access
2. Add Xcode
3. Add Terminal
4. Restart Mac

### Build Still Failing?

Try the nuclear option:

```bash
# 1. Close Xcode
killall Xcode

# 2. Delete EVERYTHING
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build ios/Pods ios/Podfile.lock
rm -rf node_modules package-lock.json

# 3. Clear caches
npm cache clean --force
pod cache clean --all
pod repo update

# 4. Reinstall
npm install
cd ios && pod deintegrate && pod install && cd ..

# 5. Restart Mac (yes, really)
sudo shutdown -r now
```

### Check Your Xcode Version

```bash
xcodebuild -version
```

Required:
- Xcode 14.0+ for React Native 0.72+
- Xcode 15.0+ for React Native 0.73+
- Xcode 15.1+ recommended

Update via App Store if needed.

---

## 📦 Files Created

This fix package includes:

1. **`fix_all_build_issues.sh`** - Automated fix script (recommended)
2. **`fix_duplicate_lc++.py`** - Python script to fix duplicate linker flags
3. **`fix_duplicate_lc++.sh`** - Shell script alternative
4. **`Podfile.recommended`** - Complete Podfile with all fixes
5. **`FIX_BUILD_ERRORS.md`** - Detailed documentation
6. **`QUICK_FIX.md`** - This file

---

## ✅ Success Checklist

After applying fixes, verify:

- [ ] `./fix_all_build_issues.sh` completed without errors
- [ ] `open ios/MobileTodoList.xcworkspace` opens in Xcode
- [ ] No red errors in Xcode navigator
- [ ] Product → Build (⌘B) succeeds
- [ ] App runs in simulator
- [ ] No sandbox/rsync errors in build log
- [ ] No duplicate -lc++ warning

---

## 💡 Prevention Tips

To avoid these issues in the future:

1. **Always use `.xcworkspace`**, never `.xcodeproj` when using CocoaPods
2. **Clean before pod install**: `rm -rf ios/Pods ios/Podfile.lock`
3. **Keep Xcode updated** via App Store
4. **Use the recommended Podfile configuration** from `Podfile.recommended`
5. **After updating React Native**, always run:
   ```bash
   rm -rf node_modules ios/Pods
   npm install
   cd ios && pod install && cd ..
   ```

---

## 🆘 Still Need Help?

1. Check the detailed guide: `FIX_BUILD_ERRORS.md`
2. Check your specific error in the build log
3. Search React Native issues: https://github.com/facebook/react-native/issues
4. Check CocoaPods issues: https://github.com/CocoaPods/CocoaPods/issues

---

**Good luck! 🍀**
