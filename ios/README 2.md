# iOS Build Error Fix Package - README

## 📦 What's Included

This package contains everything you need to fix the iOS build errors for your MobileTodoList React Native project.

### Files in This Package

| File | Purpose |
|------|---------|
| **QUICK_FIX.md** | Fast-track solution - start here! |
| **FIX_BUILD_ERRORS.md** | Detailed documentation of all issues and solutions |
| **fix_all_build_issues.sh** | Automated script to fix everything (recommended) |
| **check_environment.sh** | Diagnostic script to check your system setup |
| **fix_duplicate_lc++.py** | Python script to fix duplicate linker flags |
| **fix_duplicate_lc++.sh** | Shell script alternative for linker flag fix |
| **Podfile.recommended** | Complete Podfile configuration with all fixes |
| **README.md** | This file |

---

## 🚀 Quick Start (Choose One Method)

### Method 1: Automated Fix (Recommended)

```bash
# Make scripts executable
chmod +x fix_all_build_issues.sh check_environment.sh

# Run the fix script
./fix_all_build_issues.sh

# Follow the instructions it provides
```

### Method 2: Manual Fix

```bash
# 1. Check your environment first
./check_environment.sh

# 2. Follow the steps in QUICK_FIX.md
cat QUICK_FIX.md
```

---

## 🎯 What Gets Fixed

Your build errors included:

### 1. ✅ Sandbox/rsync Permission Errors (CRITICAL)
```
error:Sandbox: rsync(28959) deny(1) file-read-data
error:Sandbox: rsync(28959) deny(1) file-write*
```
**Fix**: Disables user script sandboxing in Podfile and cleans corrupted build cache

### 2. ✅ Duplicate Library Warning
```
warning:Ignoring duplicate libraries: '-lc++'
```
**Fix**: Removes duplicate `-lc++` entries from build settings

### 3. ✅ Missing Swift Search Path
```
warning:Search path '/var/run/.../MetalToolchain.../iphonesimulator' not found
```
**Fix**: Cleans invalid search paths from build settings

### 4. ✅ React Native Bridge Issue
```
warning:Cannot find protocol definition for 'RCTBridgeDelegate'
```
**Fix**: Proper pod installation with correct header search paths

### 5. ✅ Outdated Pods Settings
```
warning:Update to recommended settings
```
**Fix**: Updates Pods project to modern Xcode build settings

---

## 📊 Success Metrics

After applying fixes, you should see:

- ✅ Build completes without errors
- ✅ No sandbox/rsync errors in build log
- ✅ No duplicate -lc++ warnings
- ✅ App launches in iOS Simulator
- ✅ App launches on physical device

---

## 🔧 What the Scripts Do

### `fix_all_build_issues.sh`

This is the main fix script that:

1. Closes Xcode safely
2. Removes all corrupted build artifacts:
   - DerivedData folder
   - iOS build folder
   - Pods installation
   - node_modules
3. Fixes duplicate `-lc++` linker flags
4. Reinstalls npm packages
5. Reinstalls CocoaPods with proper configuration
6. Provides clear next steps

**Runtime**: ~5-10 minutes depending on internet speed

### `check_environment.sh`

This diagnostic script checks:

- Xcode installation and version
- Command line tools
- CocoaPods installation
- Node.js and npm versions
- Ruby and gem versions
- Disk space
- System permissions
- Project structure
- Common issues

**Use this first** if you want to diagnose issues before applying fixes.

### `fix_duplicate_lc++.py` / `fix_duplicate_lc++.sh`

These scripts specifically fix the duplicate `-lc++` linker flag warning by:

1. Finding your Xcode project
2. Backing up project.pbxproj
3. Scanning for duplicate `-lc++` entries in OTHER_LDFLAGS
4. Removing duplicates while preserving other flags
5. Checking Podfile for manual additions

---

## 📝 Using the Recommended Podfile

The `Podfile.recommended` file contains a complete, production-ready Podfile with:

### Key Fixes Included

```ruby
post_install do |installer|
  # Prevents sandbox/rsync errors
  config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'
  
  # Removes duplicate -lc++ flags
  # Automatically deduplicates linker flags
  
  # Cleans invalid search paths
  # Removes cryptexd/MetalToolchain paths
  
  # Sets proper C++ standard
  config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
  config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
  
  # Additional modernization settings
  config.build_settings['DEAD_CODE_STRIPPING'] = 'YES'
  config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
end
```

### How to Use

**Option 1**: Replace your entire Podfile
```bash
cp ios/Podfile ios/Podfile.backup
cp Podfile.recommended ios/Podfile
cd ios && pod install && cd ..
```

**Option 2**: Merge the `post_install` hook
- Open both files
- Copy the `post_install` section from `Podfile.recommended`
- Merge it with your existing `post_install` in `ios/Podfile`

---

## 🎓 Understanding the Issues

### Why Did These Errors Occur?

#### Sandbox/rsync Errors
Modern versions of Xcode (15+) enable "User Script Sandboxing" by default. This security feature restricts what build scripts can access. Unfortunately, React Native's Hermes framework build process uses rsync to copy files, which the sandbox blocks.

**Solution**: Disable sandboxing for build scripts (safe because these are your own build scripts)

#### Duplicate -lc++
Multiple sources can add the C++ standard library to linker flags:
- Xcode automatic detection
- CocoaPods configurations
- Manual additions in build settings
- .xcconfig files

Since Xcode links it automatically, duplicates just create warnings.

**Solution**: Remove explicit additions since Xcode handles it

#### Missing Search Paths
Xcode looks for development toolchains in ephemeral mount points (`/var/run/com.apple.security.cryptexd/...`). These paths change between Xcode versions and system updates.

**Solution**: Remove invalid paths; they're not needed for your build

#### RCTBridgeDelegate Not Found
This happens when React Native's header files aren't properly exposed to the compiler, usually from:
- Corrupted pod installation
- Missing header search paths
- Incorrect framework linking

**Solution**: Clean reinstall of pods with proper configuration

---

## 🆘 Troubleshooting

### Script Fails with "Permission Denied"

```bash
chmod +x fix_all_build_issues.sh
chmod +x check_environment.sh
```

### Still Getting Sandbox Errors After Fix

Try disabling Hermes temporarily:

Edit `ios/Podfile`:
```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => false,
)
```

Then:
```bash
cd ios && pod install && cd ..
```

### "Command Not Found" Errors

Install missing tools:

```bash
# CocoaPods
sudo gem install cocoapods

# Node.js
# Download from https://nodejs.org

# Xcode Command Line Tools
xcode-select --install
```

### Script Hangs on Pod Install

This usually means network issues downloading pods:

1. Check your internet connection
2. Try using a VPN (some regions have slow access to GitHub)
3. Update pod repos first: `pod repo update`

### Build Still Fails After Everything

Nuclear option:

```bash
# Close Xcode
killall Xcode

# Delete EVERYTHING
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build ios/Pods ios/Podfile.lock
rm -rf node_modules package-lock.json

# Clear all caches
npm cache clean --force
pod cache clean --all
pod repo update
rm -rf $TMPDIR/metro-* $TMPDIR/haste-*

# Fresh install
npm install
cd ios && pod deintegrate && pod install && cd ..

# Restart Mac
sudo shutdown -r now
```

---

## 📱 Platform Requirements

### Minimum Versions

| Tool | Minimum | Recommended |
|------|---------|-------------|
| Xcode | 14.0 | 15.1+ |
| macOS | 12.0 (Monterey) | 14.0+ (Sonoma) |
| Node.js | 14.0 | 18.0+ LTS |
| CocoaPods | 1.12 | 1.14+ |
| iOS Deployment | 13.0 | 15.0+ |

### Check Your Versions

```bash
xcodebuild -version
sw_vers
node --version
pod --version
```

---

## 📚 Additional Resources

### Documentation
- [React Native Documentation](https://reactnative.dev/docs/environment-setup)
- [CocoaPods Guides](https://guides.cocoapods.org/)
- [Xcode Release Notes](https://developer.apple.com/documentation/xcode-release-notes)

### Common Issues
- [React Native Issues on GitHub](https://github.com/facebook/react-native/issues)
- [CocoaPods Issues on GitHub](https://github.com/CocoaPods/CocoaPods/issues)

### Getting Help
1. Check the error in the detailed build log
2. Search for the error message in GitHub issues
3. Ask on React Native Community Discord
4. Check Stack Overflow

---

## 🎉 Success Stories

After applying these fixes, you should be able to:

- ✅ Build your iOS app without errors
- ✅ Run on iOS Simulator
- ✅ Deploy to physical devices
- ✅ Archive for App Store submission
- ✅ Build in CI/CD environments

---

## 🔄 Maintenance

### After Updating React Native

```bash
rm -rf node_modules ios/Pods ios/Podfile.lock
npm install
cd ios && pod install && cd ..
```

### After Updating Xcode

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ios && pod install && cd ..
```

### Regular Cleanup (Monthly)

```bash
# Clean Xcode caches
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean CocoaPods cache
pod cache clean --all

# Clean npm cache
npm cache clean --force

# Clean Metro cache
rm -rf $TMPDIR/metro-* $TMPDIR/haste-*
```

---

## 📄 License

These scripts and documentation are provided as-is for fixing common React Native iOS build issues. Feel free to modify them for your specific needs.

---

## 🙏 Acknowledgments

These fixes address common issues encountered by the React Native community. Based on solutions from:
- React Native GitHub issues
- CocoaPods troubleshooting guides
- Apple developer forums
- Stack Overflow discussions

---

## ✨ Final Notes

Remember:
1. **Always backup** before running fix scripts
2. **Close Xcode** before cleaning build artifacts
3. **Use .xcworkspace** not .xcodeproj when opening in Xcode
4. **Be patient** - pod install can take several minutes

**Good luck with your build! 🚀**

---

*Last updated: December 28, 2025*
