# Command Reference - React Native iOS Build Fixes

Quick reference for all commands used in the build fix process.

---

## Quick Navigation

- [Environment Setup](#environment-setup)
- [Package Management](#package-management)
- [CocoaPods](#cocoapods)
- [Cleaning](#cleaning)
- [Building](#building)
- [Xcode](#xcode)
- [Troubleshooting](#troubleshooting)
- [Verification](#verification)

---

## Environment Setup

### Check Tool Versions

```bash
# Node.js version
node -v

# npm version
npm -v

# CocoaPods version
pod --version

# Xcode version
xcodebuild -version

# Ruby version (for CocoaPods)
ruby -v

# Check which node binary is being used
which node

# Check all node installations
which -a node
```

### Install Missing Tools

```bash
# Install Node.js (if missing) - using Homebrew
brew install node

# Install CocoaPods
sudo gem install cocoapods

# Update CocoaPods repository
pod setup

# Install xcodeproj gem (for Ruby scripts)
gem install xcodeproj
```

### Environment Variables

```bash
# Check Node path
echo $NODE_BINARY

# Check PATH
echo $PATH

# Set Node binary manually (if needed)
export NODE_BINARY=$(which node)

# Add common paths
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin"
```

---

## Package Management

### npm Commands

```bash
# Install dependencies from package.json
npm install

# Install with legacy peer deps (if conflicts)
npm install --legacy-peer-deps

# Install specific package
npm install package-name@version --save

# Update geolocation package
npm install @react-native-community/geolocation@^3.3.0 --save

# Check outdated packages
npm outdated

# Update all packages (use cautiously)
npm update

# Audit for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Clean npm cache
npm cache clean --force

# List installed packages
npm list --depth=0

# Check package version
npm list package-name
```

### package.json Verification

```bash
# View geolocation version
grep "geolocation" package.json

# View all dependencies
cat package.json | grep -A 100 "dependencies"

# Pretty print package.json
cat package.json | jq .
```

---

## CocoaPods

### Basic Commands

```bash
# Navigate to iOS directory
cd ios

# Install pods from Podfile
pod install

# Install with repository update
pod install --repo-update

# Update existing pods to latest versions
pod update

# Update specific pod
pod update PodName

# Check pod versions
pod outdated

# Remove all pods
pod deintegrate

# Reinstall pods
rm -rf Pods Podfile.lock
pod install

# Validate Podfile syntax
pod spec lint

# Search for a pod
pod search PodName
```

### Podfile Verification

```bash
# Check Podfile for C++17 setting
grep -n "CLANG_CXX_LANGUAGE_STANDARD" ios/Podfile

# Check iOS platform version
grep -n "platform :ios" ios/Podfile

# View entire Podfile
cat ios/Podfile

# Count installed pods
cat ios/Podfile.lock | grep -c "  - "

# Check specific pod version
grep "gRPC-Core" ios/Podfile.lock -A 2
```

### Advanced CocoaPods

```bash
# Verbose output for debugging
pod install --verbose

# Don't integrate with project (just download)
pod install --no-integrate

# Force clean install
pod install --clean-install

# Use specific Ruby version (via rbenv)
rbenv local 2.7.0
pod install
```

---

## Cleaning

### Complete Clean (Nuclear Option)

```bash
# Clean everything - use when stuck
rm -rf node_modules package-lock.json
rm -rf ios/Pods ios/Podfile.lock
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
npm cache clean --force
npm install
cd ios && pod install
```

### Selective Cleaning

```bash
# Clean only npm
rm -rf node_modules package-lock.json
npm install

# Clean only CocoaPods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Clean only Xcode build artifacts
rm -rf ios/build

# Clean DerivedData (all projects)
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean DerivedData (specific project)
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*

# Clean Metro bundler cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clean Watchman (if installed)
watchman watch-del-all
```

### Cache Cleaning

```bash
# npm cache
npm cache clean --force
npm cache verify

# CocoaPods cache
pod cache clean --all

# Homebrew cache (if used)
brew cleanup
```

---

## Building

### React Native CLI

```bash
# Build and run on iOS simulator (default)
npx react-native run-ios

# Specify simulator
npx react-native run-ios --simulator="iPhone 15"

# Build for specific device
npx react-native run-ios --device="Cody's iPhone"

# List available simulators
npx react-native run-ios --help

# Build release version
npx react-native run-ios --configuration Release

# Skip bundler startup
npx react-native run-ios --no-packager
```

### Start Metro Bundler

```bash
# Start Metro bundler
npx react-native start

# Start with reset cache
npx react-native start --reset-cache

# Start on specific port
npx react-native start --port 8088
```

### Direct Xcode Build

```bash
# Build from command line
cd ios
xcodebuild -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  build

# Build and show only errors
xcodebuild ... build 2>&1 | grep error:

# Build and show only warnings
xcodebuild ... build 2>&1 | grep warning:

# Clean build
xcodebuild ... clean

# Clean then build
xcodebuild ... clean build
```

### Build Scripts

```bash
# Run automated fix script
chmod +x fix-build-issues.sh
./fix-build-issues.sh

# Run Ruby build outputs script
gem install xcodeproj
ruby add-build-outputs.rb

# Run interactive start script
chmod +x START_HERE.sh
./START_HERE.sh
```

---

## Xcode

### Open Projects

```bash
# Open workspace (CORRECT for React Native)
open ios/MobileTodoList.xcworkspace

# Open project directly (DON'T USE with CocoaPods)
open ios/MobileTodoList.xcodeproj

# Open in Xcode from anywhere
xed ios/
```

### Simulator Management

```bash
# List all simulators
xcrun simctl list devices

# List available simulators (names only)
xcrun simctl list devices available | grep iPhone

# Boot simulator
xcrun simctl boot "iPhone 15"

# Shutdown simulator
xcrun simctl shutdown "iPhone 15"

# Erase simulator
xcrun simctl erase "iPhone 15"

# Delete and recreate simulator
xcrun simctl delete "iPhone 15"
xcrun simctl create "iPhone 15" "iPhone 15" "iOS16.0"

# Open simulator app
open -a Simulator

# Install app on simulator
xcrun simctl install booted path/to/App.app

# Uninstall app from simulator
xcrun simctl uninstall booted com.yourcompany.MobileTodoList
```

### Build Settings

```bash
# Show all build settings
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -showBuildSettings

# Show specific setting (e.g., C++ standard)
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -showBuildSettings | grep CXX_LANGUAGE

# Show deployment target
xcodebuild -showBuildSettings | grep IPHONEOS_DEPLOYMENT_TARGET
```

### Code Signing

```bash
# List signing identities
security find-identity -v -p codesigning

# Show provisioning profiles
ls -la ~/Library/MobileDevice/Provisioning\ Profiles/

# Check if app is properly signed
codesign -vv -d path/to/App.app
```

---

## Troubleshooting

### Diagnostics

```bash
# Check React Native setup
npx react-native doctor

# Check if Metro is running
lsof -i :8081

# Kill Metro bundler
lsof -ti :8081 | xargs kill

# Check Node processes
ps aux | grep node

# Check Ruby processes (CocoaPods)
ps aux | grep pod

# Check disk space
df -h

# Check iOS deployment targets
grep -r "IPHONEOS_DEPLOYMENT_TARGET" ios/*.xcodeproj/project.pbxproj
```

### Error Logs

```bash
# View React Native logs
npx react-native log-ios

# View system logs for simulator
xcrun simctl spawn booted log stream --level debug

# View build log in detail
xcodebuild ... 2>&1 | tee build.log

# Search build log for errors
grep "error:" build.log

# Search for specific error
xcodebuild ... 2>&1 | grep -i "geolocation"
```

### Network Issues

```bash
# Test npm registry
npm ping

# Use different registry
npm install --registry https://registry.npmjs.org/

# Check for proxy issues
echo $HTTP_PROXY
echo $HTTPS_PROXY

# Bypass proxy (if needed)
unset HTTP_PROXY
unset HTTPS_PROXY
```

### File Permissions

```bash
# Fix ownership of node_modules
sudo chown -R $(whoami) node_modules

# Fix permissions for npm global
sudo chown -R $(whoami) ~/.npm

# Fix permissions for CocoaPods
sudo chown -R $(whoami) ~/Library/Caches/CocoaPods
```

---

## Verification

### Check Installation

```bash
# Verify node_modules exists
ls -la node_modules | head

# Verify Pods directory
ls -la ios/Pods | head

# Verify .xcode.env exists
cat ios/.xcode.env

# Verify Podfile has C++17
grep "c++17" ios/Podfile

# Check geolocation version in node_modules
cat node_modules/@react-native-community/geolocation/package.json | grep version

# Count installed npm packages
ls node_modules | wc -l

# Count installed pods
ls ios/Pods | wc -l
```

### Validate Configuration

```bash
# Check for .gitignore
cat .gitignore | grep -E "node_modules|Pods|build"

# Verify iOS deployment target in Podfile
grep "platform :ios" ios/Podfile

# Check for hardcoded paths
grep -r "/Users/" ios/Podfile

# Validate package.json syntax
cat package.json | jq empty

# Check for native module linking
grep -r "react-native link" .
```

### Test Build

```bash
# Test build without running
cd ios
xcodebuild -workspace MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  build | grep -E "(BUILD SUCCEEDED|BUILD FAILED|error:)"

# Time the build
time npx react-native run-ios
```

---

## Common One-Liners

```bash
# Quick fix for most issues
rm -rf node_modules ios/Pods && npm install && cd ios && pod install && cd ..

# Update geolocation and rebuild
npm install @react-native-community/geolocation@latest --save && cd ios && pod install && cd ..

# Clean build and run
rm -rf ios/build && npx react-native run-ios --simulator="iPhone 15"

# Check if build will succeed (without running)
cd ios && xcodebuild -workspace MobileTodoList.xcworkspace -scheme MobileTodoList -sdk iphonesimulator build | tail -1

# Find largest directories (troubleshoot space issues)
du -sh node_modules ios/Pods ios/build ~/Library/Developer/Xcode/DerivedData

# Create backup before changes
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz package.json ios/Podfile ios/Podfile.lock
```

---

## Script Shortcuts

Create aliases in your `~/.zshrc` or `~/.bashrc`:

```bash
# Add these to your shell config
alias rn-clean="rm -rf node_modules ios/Pods && npm install && cd ios && pod install && cd .."
alias rn-build="npx react-native run-ios --simulator='iPhone 15'"
alias rn-reset="npm start -- --reset-cache"
alias rn-logs="npx react-native log-ios"
alias xc-open="open ios/*.xcworkspace"
alias xc-clean="rm -rf ios/build ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*"
```

Then use:
```bash
rn-clean  # Clean and reinstall
rn-build  # Build and run
xc-open   # Open Xcode workspace
```

---

## Environment Variables

### Useful React Native Env Vars

```bash
# Skip CocoaPods installation
export SKIP_BUNDLING=1

# Use Hermes engine
export USE_HERMES=1

# Disable Flipper (if causing issues)
export NO_FLIPPER=1

# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Enable verbose logging
export RCT_METRO_PORT=8081
export DEBUG=*
```

---

## For CI/CD

### GitHub Actions / CI Setup

```bash
# Install dependencies (CI)
npm ci  # Uses package-lock.json exactly

# Install pods with no user interaction
cd ios && pod install --silent && cd ..

# Build without code signing
xcodebuild -workspace ios/MobileTodoList.xcworkspace \
  -scheme MobileTodoList \
  -sdk iphonesimulator \
  -configuration Release \
  CODE_SIGNING_ALLOWED=NO \
  build
```

---

## Quick Reference Table

| Task | Command |
|------|---------|
| Clean everything | `rm -rf node_modules ios/Pods && npm i && cd ios && pod install` |
| Run on simulator | `npx react-native run-ios --simulator="iPhone 15"` |
| Open workspace | `open ios/MobileTodoList.xcworkspace` |
| Start Metro | `npx react-native start` |
| Reset Metro cache | `npx react-native start --reset-cache` |
| List simulators | `xcrun simctl list devices` |
| Clean Xcode build | `rm -rf ios/build` |
| Update geolocation | `npm install @react-native-community/geolocation@^3.3.0` |
| Run fix script | `./fix-build-issues.sh` |
| Add build outputs | `ruby add-build-outputs.rb` |

---

For detailed explanations, see [DETAILED_FIX_GUIDE.md](DETAILED_FIX_GUIDE.md).  
For troubleshooting, see [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md).
