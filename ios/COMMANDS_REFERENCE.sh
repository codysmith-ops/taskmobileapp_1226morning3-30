#!/bin/bash

# MobileTodoList - Commands Cheat Sheet
# Quick reference for all fix commands

echo "═══════════════════════════════════════════════════════════"
echo "  MobileTodoList iOS Build Fixes - Command Reference"
echo "═══════════════════════════════════════════════════════════"
echo ""

cat << 'EOF'

📋 QUICK FIX COMMANDS
═══════════════════════════════════════════════════════════

1️⃣  AUTOMATED FIX (Run from project root)
─────────────────────────────────────────────────────────
chmod +x fix-ios-build.sh
./fix-ios-build.sh


2️⃣  MANUAL FIX COMMANDS
─────────────────────────────────────────────────────────

# Fix Geolocation Error
npm install @react-native-community/geolocation@latest

# Copy updated Podfile
cp Podfile.new ios/Podfile

# Copy Xcode environment file
cp .xcode.env ios/.xcode.env

# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock build
pod install
cd ..

# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*


3️⃣  XCODE MANUAL STEPS
─────────────────────────────────────────────────────────

1. Open ios/MobileTodoList.xcworkspace (NOT .xcodeproj)
2. Click on MobileTodoList.xcodeproj in navigator
3. Click "Update to recommended settings" if shown
4. Repeat for Pods.xcodeproj
5. Go to target → Build Phases
6. Find "Bundle React Native code and images"
7. Add Output Files:
   ${DERIVED_FILE_DIR}/main.jsbundle
   ${DERIVED_FILE_DIR}/main.jsbundle.map
8. Clean Build Folder (⌘⇧K)
9. Build (⌘B)


4️⃣  OPTIONAL: AUTOMATED BUILD PHASE FIX
─────────────────────────────────────────────────────────

# Install xcodeproj gem if needed
gem install xcodeproj

# Run the build phase fixer
ruby fix-xcode-build-phases.rb


5️⃣  NUCLEAR OPTION (If nothing else works)
─────────────────────────────────────────────────────────

# Complete clean and reset
rm -rf node_modules
rm -rf ios/Pods ios/Podfile.lock ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData/*
npm cache clean --force
npm install
cd ios
pod deintegrate
pod cache clean --all
pod install
cd ..


6️⃣  VERIFICATION COMMANDS
─────────────────────────────────────────────────────────

# Check Node version
node --version

# Check npm packages
npm list @react-native-community/geolocation

# Check CocoaPods version
pod --version

# Check installed pods
cd ios && pod list && cd ..

# Build from command line
cd ios
xcodebuild -workspace MobileTodoList.xcworkspace \
           -scheme MobileTodoList \
           -configuration Debug \
           build
cd ..


7️⃣  COMMON TROUBLESHOOTING
─────────────────────────────────────────────────────────

# If pods fail to install
cd ios
pod repo update
pod install --repo-update
cd ..

# If geolocation still fails
npm uninstall @react-native-community/geolocation
npm install @react-native-community/geolocation@3.2.1
cd ios && pod install && cd ..

# If C++ errors persist
# Verify ios/Podfile contains:
# config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'

# Clear watchman cache
watchman watch-del-all

# Reset Metro bundler
npx react-native start --reset-cache


═══════════════════════════════════════════════════════════

📚 Documentation Files:
   • README_IOS_FIXES.md - Quick start guide
   • IOS_BUILD_FIX_GUIDE.md - Comprehensive manual
   • package-updates.json - Dependency info

🛠️ Tool Files:
   • fix-ios-build.sh - Main automated fix
   • fix-xcode-build-phases.rb - Build phase fixer
   • Podfile.new - Updated Podfile
   • .xcode.env - Xcode environment config

═══════════════════════════════════════════════════════════

EOF
