#!/bin/bash

# MobileTodoList iOS Build Fixes
# This script fixes the React Native iOS build errors and warnings
# Run this from the root of your React Native project

set -e

echo "🔧 Starting MobileTodoList iOS Build Fixes..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the root of your React Native project.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating npm dependencies...${NC}"
# Update the problematic geolocation package
npm install @react-native-community/geolocation@latest

echo ""
echo -e "${YELLOW}Step 2: Cleaning iOS build artifacts...${NC}"
cd ios

# Remove old build artifacts
rm -rf build
rm -rf Pods
rm -rf Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*

echo ""
echo -e "${YELLOW}Step 3: Updating Podfile with C++ fixes...${NC}"

# Backup original Podfile
if [ -f "Podfile" ]; then
    cp Podfile Podfile.backup
    echo -e "${GREEN}✅ Original Podfile backed up to Podfile.backup${NC}"
fi

# Check if we have the new Podfile
if [ -f "../Podfile.new" ]; then
    cp ../Podfile.new Podfile
    echo -e "${GREEN}✅ Updated Podfile copied${NC}"
else
    echo -e "${YELLOW}⚠️  Podfile.new not found, keeping existing Podfile${NC}"
    echo -e "${YELLOW}   You may need to manually update your Podfile with C++17 settings${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4: Installing CocoaPods dependencies...${NC}"
pod install

echo ""
echo -e "${YELLOW}Step 5: Cleaning Xcode build...${NC}"
xcodebuild clean -workspace MobileTodoList.xcworkspace -scheme MobileTodoList || true

cd ..

echo ""
echo -e "${GREEN}✅ All fixes applied successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Open ios/MobileTodoList.xcworkspace in Xcode (not .xcodeproj)"
echo "2. Go to Product → Clean Build Folder (Cmd+Shift+K)"
echo "3. Update project settings:"
echo "   - Click on MobileTodoList.xcodeproj in the navigator"
echo "   - Click 'Update to recommended settings' if prompted"
echo "   - Do the same for Pods.xcodeproj"
echo "4. Build the project (Cmd+B)"
echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
