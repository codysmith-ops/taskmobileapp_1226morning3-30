# Troubleshooting Guide - React Native iOS Build Issues

Comprehensive troubleshooting for common and uncommon build issues.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Critical Errors](#critical-errors)
3. [Build Failures](#build-failures)
4. [CocoaPods Issues](#cocoapods-issues)
5. [npm/Node Issues](#npmnode-issues)
6. [Xcode Issues](#xcode-issues)
7. [Simulator Issues](#simulator-issues)
8. [Runtime Errors](#runtime-errors)
9. [Performance Issues](#performance-issues)
10. [Advanced Debugging](#advanced-debugging)

---

## Quick Diagnostics

### Run Health Check

```bash
# Check React Native setup
npx react-native doctor

# Check versions
echo "Node: $(node -v)"
echo "npm: $(npm -v)"
echo "CocoaPods: $(pod --version)"
echo "Xcode: $(xcodebuild -version | head -n1)"

# Check disk space
df -h | grep -E "Filesystem|/$"

# Check if Metro is running
lsof -i :8081
```

### Common Quick Fixes

```bash
# Fix 1: Clean everything
rm -rf node_modules ios/Pods && npm i && cd ios && pod install && cd ..

# Fix 2: Reset Metro cache
npx react-native start --reset-cache

# Fix 3: Clean Xcode
rm -rf ios/build ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*

# Fix 4: Kill Metro
lsof -ti :8081 | xargs kill

# Fix 5: Reinstall geolocation
npm install @react-native-community/geolocation@^3.3.0
cd ios && pod install && cd ..
```

---

## Critical Errors

### Error: No member named 'NativeRNCGeolocationSpecJSI'

**Full Error:**
```
ios/Pods/RNCGeolocation/ios/RNCGeolocation.mm:559:45:
error: No member named 'NativeRNCGeolocationSpecJSI' in namespace 'facebook::react'
```

**Root Cause:**  
Outdated geolocation package incompatible with your React Native version.

**Solution 1 (Recommended):**
```bash
npm install @react-native-community/geolocation@^3.3.0 --save
cd ios && pod install && cd ..
npx react-native run-ios
```

**Solution 2 (If v3.3.0 doesn't work):**
```bash
# Try latest version
npm install @react-native-community/geolocation@latest --save
cd ios && pod install && cd ..
```

**Solution 3 (Nuclear option):**
```bash
# Remove and reinstall
npm uninstall @react-native-community/geolocation
rm -rf node_modules ios/Pods
npm install @react-native-community/geolocation@^3.3.0 --save
npm install
cd ios && pod install && cd ..
```

**Verification:**
```bash
# Check installed version
cat package.json | grep geolocation
# Should show: "@react-native-community/geolocation": "^3.3.0" or higher

# Verify native spec generation
ls -la ios/Pods/RNCGeolocation/ios/ | grep RNCGeolocationSpec
```

---

### Error: No template named 'result_of' in namespace 'std'

**Full Error:**
```
promise_like.h:74:17: error: No template named 'result_of' in namespace 'std'
```

**Root Cause:**  
Pods compiled with C++20 standard, but code uses deprecated `std::result_of`.

**Solution 1 (Primary Fix):**

Update Podfile to enforce C++17:

```ruby
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
    end
  end
end
```

Then:
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

**Solution 2 (If Podfile already updated):**

```bash
# Completely clean and reinstall
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..
```

**Solution 3 (Manual Xcode fix):**

1. Open Xcode: `open ios/MobileTodoList.xcworkspace`
2. Select `Pods` project
3. Select `gRPC-Core` target
4. Build Settings → Search "C++ Language Standard"
5. Set to "C++17"
6. Clean build folder (Cmd+Shift+K)
7. Build (Cmd+B)

**Verification:**
```bash
# Check Podfile
grep "CLANG_CXX_LANGUAGE_STANDARD" ios/Podfile
# Should show: config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'

# Check actual build settings
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -showBuildSettings | grep CXX_LANGUAGE
# Should show: CLANG_CXX_LANGUAGE_STANDARD = c++17
```

---

### Error: A template argument list is expected after a name prefixed by template keyword

**Full Error:**
```
basic_seq.h:103:XX: error: A template argument list is expected after a name prefixed by the template keyword
```

**Root Cause:**  
Same as `result_of` error - C++20 incompatibility.

**Solution:**  
Same as `result_of` fix above - enforce C++17 in Podfile.

---

## Build Failures

### Build Failed: Exit Code 65

**Symptoms:**
```
** BUILD FAILED **
The following build commands failed:
...
(1 failure)
Command failed with exit code 65
```

**Diagnosis:**
```bash
# Build with verbose output
cd ios
xcodebuild -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -sdk iphonesimulator \
  build 2>&1 | tee build.log

# Search for actual error
grep "error:" build.log | head -10
```

**Common Causes & Fixes:**

1. **Code signing issue:**
   ```bash
   # Set code signing to manual/automatic in Xcode
   # Or build for simulator without code signing
   xcodebuild ... CODE_SIGNING_ALLOWED=NO
   ```

2. **Missing files:**
   ```bash
   # Reinstall pods
   cd ios && pod install && cd ..
   ```

3. **Compilation errors:**
   - See specific error message in build log
   - Usually solved by package updates or Podfile fixes

---

### Build Hangs / Takes Forever

**Symptoms:**
- Build starts but never finishes
- Gets stuck at specific step
- CPU usage low

**Diagnosis:**
```bash
# Check what process is stuck
ps aux | grep xcodebuild
ps aux | grep Metro
ps aux | grep node

# Check if Metro bundler is hung
curl http://localhost:8081/status
```

**Solutions:**

1. **Kill and restart:**
   ```bash
   killall -9 node Metro Xcode xcodebuild
   npx react-native start --reset-cache
   npx react-native run-ios
   ```

2. **Disable Flipper (common cause):**
   
   In `ios/Podfile`, add:
   ```ruby
   use_flipper!({ 'Flipper' => '0.0.1' })  # Effectively disables
   # Or completely remove use_flipper! line
   ```

3. **Reduce build processes:**
   ```bash
   # Build with fewer parallel jobs
   xcodebuild -jobs 1 ...
   ```

---

### Build Succeeds But App Doesn't Launch

**Symptoms:**
```
BUILD SUCCEEDED
info Installing "MobileTodoList.app"
(nothing happens)
```

**Diagnosis:**
```bash
# Check if app installed
xcrun simctl list apps | grep MobileTodoList

# Check simulator status
xcrun simctl list devices | grep Booted
```

**Solutions:**

1. **Reset simulator:**
   ```bash
   xcrun simctl shutdown all
   xcrun simctl erase all
   npx react-native run-ios
   ```

2. **Uninstall and reinstall:**
   ```bash
   xcrun simctl uninstall booted org.reactjs.native.example.MobileTodoList
   npx react-native run-ios
   ```

3. **Check Metro bundler:**
   ```bash
   # Start Metro separately
   npx react-native start
   
   # In another terminal
   npx react-native run-ios --no-bundler
   ```

---

## CocoaPods Issues

### Error: Unable to find a specification for [Pod]

**Error:**
```
[!] Unable to find a specification for `RNCGeolocation`
```

**Solutions:**

1. **Update CocoaPods repo:**
   ```bash
   pod repo update
   cd ios && pod install
   ```

2. **Clear CocoaPods cache:**
   ```bash
   pod cache clean --all
   rm -rf ~/Library/Caches/CocoaPods
   pod install
   ```

3. **Reset CocoaPods completely:**
   ```bash
   sudo gem uninstall cocoapods
   sudo gem install cocoapods
   pod setup
   cd ios && pod install
   ```

---

### Error: CocoaPods could not find compatible versions

**Error:**
```
[!] CocoaPods could not find compatible versions for pod "Firebase/CoreOnly"
```

**Solutions:**

1. **Update Podfile.lock:**
   ```bash
   cd ios
   rm -rf Podfile.lock
   pod install --repo-update
   ```

2. **Update specific pod:**
   ```bash
   cd ios
   pod update Firebase
   ```

3. **Check for version conflicts:**
   ```bash
   cat ios/Podfile.lock | grep -A 5 Firebase
   ```

---

### Error: ffi_c.bundle LoadError

**Error:**
```
LoadError - cannot load such file -- ffi_c
```

**Root Cause:**  
Ruby FFI gem architecture mismatch (Intel vs ARM on Apple Silicon).

**Solutions:**

1. **Reinstall ffi gem:**
   ```bash
   sudo gem uninstall ffi
   sudo gem install ffi
   ```

2. **For Apple Silicon Macs:**
   ```bash
   sudo arch -x86_64 gem install ffi
   cd ios && arch -x86_64 pod install
   ```

3. **Use system Ruby:**
   ```bash
   # Check Ruby version
   ruby -v
   
   # If using rbenv/rvm, switch to system Ruby
   rbenv global system
   # or
   rvm use system
   ```

---

## npm/Node Issues

### Error: Cannot find module 'metro'

**Error:**
```
Error: Cannot find module 'metro'
```

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Install Metro explicitly:**
   ```bash
   npm install metro metro-core --save-dev
   ```

3. **Check for corruption:**
   ```bash
   npm cache verify
   npm cache clean --force
   npm install
   ```

---

### Error: EACCES permission denied

**Error:**
```
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules/...'
```

**Solutions:**

1. **Fix npm permissions (recommended):**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **Fix ownership:**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /usr/local/lib/node_modules
   ```

3. **Use sudo (not recommended but quick):**
   ```bash
   sudo npm install
   ```

---

### Error: Package version conflict

**Error:**
```
npm ERR! Could not resolve dependency:
npm ERR! peer react@"17.0.2" from react-native@0.68.0
```

**Solutions:**

1. **Use legacy peer deps:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Use force:**
   ```bash
   npm install --force
   ```

3. **Update package.json:**
   ```json
   {
     "overrides": {
       "react": "18.2.0"
     }
   }
   ```

---

## Xcode Issues

### Error: Unable to boot simulator

**Error:**
```
Unable to boot the Simulator.
Domain: NSPOSIXErrorDomain
Code: 60
```

**Solutions:**

1. **Restart CoreSimulator:**
   ```bash
   sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
   xcrun simctl shutdown all
   xcrun simctl erase all
   ```

2. **Delete and recreate simulator:**
   ```bash
   xcrun simctl delete "iPhone 15"
   xcrun simctl create "iPhone 15" "com.apple.CoreSimulator.SimDeviceType.iPhone-15" "com.apple.CoreSimulator.SimRuntime.iOS-16-0"
   ```

3. **Restart Xcode and Mac:**
   ```bash
   killall Xcode
   # Then restart Xcode
   # If still failing, restart Mac
   ```

---

### Error: .xcode.env file not found

**Error:**
```
error: .xcode.env file not found
```

**Solution:**

Create `ios/.xcode.env`:

```bash
cat > ios/.xcode.env << 'EOF'
export NODE_BINARY=$(command -v node)
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin"
EOF
```

**Verification:**
```bash
ls -la ios/.xcode.env
cat ios/.xcode.env
```

---

### Error: Developer directory not found

**Error:**
```
xcode-select: error: tool 'xcodebuild' requires Xcode
```

**Solutions:**

1. **Set Xcode path:**
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

2. **Install Command Line Tools:**
   ```bash
   xcode-select --install
   ```

3. **Verify installation:**
   ```bash
   xcode-select -p
   # Should show: /Applications/Xcode.app/Contents/Developer
   ```

---

### Warning: Multiple Xcode installations

**Issue:**  
Multiple Xcode versions causing confusion.

**Diagnosis:**
```bash
mdfind "kMDItemCFBundleIdentifier == 'com.apple.dt.Xcode'"
```

**Solution:**
```bash
# Set the correct Xcode
sudo xcode-select --switch /Applications/Xcode.app

# Verify
xcodebuild -version
```

---

## Simulator Issues

### Simulator Not Showing in List

**Diagnosis:**
```bash
xcrun simctl list devices
```

**Solutions:**

1. **Create missing simulator:**
   ```bash
   xcrun simctl create "iPhone 15" "com.apple.CoreSimulator.SimDeviceType.iPhone-15" "com.apple.CoreSimulator.SimRuntime.iOS-16-0"
   ```

2. **Install additional simulators:**
   - Open Xcode
   - Preferences → Components
   - Download iOS simulators

3. **Reset simulator service:**
   ```bash
   sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
   ```

---

### Simulator Boots But Shows Black Screen

**Solutions:**

1. **Erase simulator:**
   ```bash
   xcrun simctl erase "iPhone 15"
   ```

2. **Restart simulator:**
   ```bash
   killall Simulator
   open -a Simulator
   ```

3. **Check graphics acceleration:**
   - Simulator → File → GPU Selection → Auto

---

### App Crashes Immediately on Launch

**Diagnosis:**
```bash
# View crash logs
xcrun simctl spawn booted log stream --level debug | grep MobileTodoList
```

**Solutions:**

1. **Check bundler connection:**
   ```bash
   # Ensure Metro is running
   npx react-native start
   ```

2. **Check for JavaScript errors:**
   ```bash
   npx react-native log-ios
   ```

3. **Rebuild app:**
   ```bash
   rm -rf ios/build
   npx react-native run-ios
   ```

---

## Runtime Errors

### Red Screen: Unable to connect to Metro

**Error:**
```
Unable to load script. Make sure you're either running Metro or that your bundle is correctly configured for release builds.
```

**Solutions:**

1. **Start Metro:**
   ```bash
   npx react-native start
   ```

2. **Reset Metro cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Check port 8081:**
   ```bash
   lsof -i :8081
   # If occupied, kill it:
   lsof -ti :8081 | xargs kill
   ```

---

### Red Screen: Module not found

**Error:**
```
Error: Unable to resolve module @react-native-community/geolocation
```

**Solutions:**

1. **Install missing module:**
   ```bash
   npm install @react-native-community/geolocation
   ```

2. **Reset Metro cache:**
   ```bash
   npx react-native start --reset-cache
   ```

3. **Reinstall all dependencies:**
   ```bash
   rm -rf node_modules && npm install
   ```

---

### Yellow Box: Deprecation Warnings

**Issue:**  
Many yellow warning boxes at runtime.

**Solutions:**

1. **Suppress specific warnings:**
   ```javascript
   // In App.tsx or index.js
   import { LogBox } from 'react-native';
   
   LogBox.ignoreLogs([
     'ViewPropTypes will be removed',
     'ColorPropType will be removed',
   ]);
   ```

2. **Suppress all warnings (not recommended):**
   ```javascript
   console.warn = () => {};
   ```

3. **Update packages** causing warnings:
   ```bash
   npm outdated
   npm update
   ```

---

## Performance Issues

### Slow Build Times

**Diagnosis:**
```bash
# Time your build
time npx react-native run-ios
```

**Solutions:**

1. **Disable Flipper:**
   ```ruby
   # In ios/Podfile, comment out:
   # use_flipper!()
   ```

2. **Use incremental builds:**
   - Don't clean unless necessary
   - Use `npx react-native run-ios` instead of rebuilding in Xcode

3. **Optimize DerivedData:**
   ```bash
   # Set custom location
   defaults write com.apple.dt.Xcode IDECustomDerivedDataLocation -string ~/XcodeDerivedData
   ```

4. **Add build outputs** to scripts (see add-build-outputs.rb)

---

### App Launch is Slow

**Solutions:**

1. **Disable development mode:**
   ```bash
   # Build release version
   npx react-native run-ios --configuration Release
   ```

2. **Check for synchronous API calls** in app startup

3. **Profile with Instruments:**
   - Xcode → Product → Profile
   - Use Time Profiler to find bottlenecks

---

### High Memory Usage

**Diagnosis:**
```bash
# Monitor processes
top -pid $(pgrep -f Metro)
top -pid $(pgrep -f node)
```

**Solutions:**

1. **Increase Node memory:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   ```

2. **Check for memory leaks** in JavaScript code

3. **Restart Metro periodically:**
   ```bash
   lsof -ti :8081 | xargs kill
   npx react-native start
   ```

---

## Advanced Debugging

### Enable Verbose Logging

```bash
# React Native verbose
npx react-native run-ios --verbose

# CocoaPods verbose
cd ios && pod install --verbose

# Xcode verbose
xcodebuild ... -verbose
```

### Examine Build Process

```bash
# Show build settings
xcodebuild -showBuildSettings

# Show SDK info
xcodebuild -showsdks

# Show targets
xcodebuild -list -workspace ios/MobileTodoList.xcworkspace
```

### Debug Metro Bundler

```bash
# Start with debugging
DEBUG=* npx react-native start

# Check Metro config
cat metro.config.js

# Test bundle endpoint
curl http://localhost:8081/index.bundle?platform=ios
```

### Check for Conflicts

```bash
# Check for duplicate packages
npm ls @react-native-community/geolocation

# Check for peer dependency issues
npm ls 2>&1 | grep "peer"

# Check pod dependencies
cd ios && pod outdated
```

---

## Nuclear Options

### Complete Reset (When Nothing Works)

```bash
# 1. Close all apps
killall Xcode Simulator node Metro

# 2. Clean project completely
rm -rf node_modules package-lock.json
rm -rf ios/Pods ios/Podfile.lock
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf $TMPDIR/metro-* $TMPDIR/haste-*

# 3. Clear all caches
npm cache clean --force
pod cache clean --all
watchman watch-del-all  # if installed

# 4. Reinstall everything
npm install
cd ios && pod install && cd ..

# 5. Rebuild
npx react-native start --reset-cache &
sleep 5
npx react-native run-ios
```

### Reinstall React Native

```bash
# Only if project is severely broken
rm -rf node_modules
npm uninstall react-native
npm install react-native@latest
npm install
cd ios && pod install && cd ..
```

### Reinstall Xcode Command Line Tools

```bash
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

---

## Getting Help

### Collect Diagnostic Info

```bash
# Create diagnostic report
cat > diagnostic_report.txt << EOF
Project: MobileTodoList
Date: $(date)

=== Versions ===
Node: $(node -v)
npm: $(npm -v)
CocoaPods: $(pod --version)
Xcode: $(xcodebuild -version | head -n1)
Ruby: $(ruby -v)

=== Paths ===
Node binary: $(which node)
npm prefix: $(npm config get prefix)
Xcode path: $(xcode-select -p)

=== React Native ===
$(cat package.json | grep '"version"' | head -n1)
$(cat package.json | grep 'react-native' | head -n5)

=== Pods ===
$(cat ios/Podfile.lock | grep 'PODFILE CHECKSUM' || echo "No Podfile.lock")

=== Errors ===
$(tail -100 ios/build.log 2>/dev/null || echo "No build.log")
EOF

cat diagnostic_report.txt
```

### Resources

- **React Native Docs:** https://reactnative.dev/docs/troubleshooting
- **CocoaPods Docs:** https://guides.cocoapods.org/using/troubleshooting
- **Stack Overflow:** Tag with `react-native` and `ios`
- **GitHub Issues:** https://github.com/facebook/react-native/issues

---

## Cheat Sheet

| Issue | Quick Fix |
|-------|-----------|
| Build error | `rm -rf ios/build && npx react-native run-ios` |
| Metro stuck | `lsof -ti :8081 \| xargs kill && npx react-native start` |
| Geolocation error | `npm i @react-native-community/geolocation@^3.3.0 && cd ios && pod install` |
| C++ error | Add `config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'` to Podfile |
| Pod error | `cd ios && rm -rf Pods && pod install` |
| Simulator crash | `xcrun simctl erase "iPhone 15"` |
| Can't find Xcode | `sudo xcode-select --switch /Applications/Xcode.app` |
| Permission error | `sudo chown -R $(whoami) ~/.npm` |

---

**Still stuck?** Run the automated fix script:
```bash
./fix-build-issues.sh
```

For detailed explanations, see [DETAILED_FIX_GUIDE.md](DETAILED_FIX_GUIDE.md).
