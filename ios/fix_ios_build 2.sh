#!/bin/bash

# Script to fix React Native iOS build errors and warnings
# Created: December 26, 2025

set -e

echo "🔧 Starting iOS Build Fix Process..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found!${NC}"
    echo "Please run this script from your project root directory."
    exit 1
fi

# Check if ios directory exists
if [ ! -d "ios" ]; then
    echo -e "${RED}Error: ios directory not found!${NC}"
    exit 1
fi

# Navigate to iOS directory
cd ios

echo ""
echo "📦 Step 1: Cleaning CocoaPods cache..."
echo "--------------------------------------"
pod cache clean --all
echo -e "${GREEN}✓ Cache cleaned${NC}"

echo ""
echo "🗑️  Step 2: Removing old Pods and build artifacts..."
echo "----------------------------------------------------"
rm -rf Pods
rm -rf build
rm -f Podfile.lock
echo -e "${GREEN}✓ Old files removed${NC}"

echo ""
echo "📝 Step 3: Updating Podfile with fixes..."
echo "------------------------------------------"
if [ -f "../Podfile_FIXED" ]; then
    # Backup existing Podfile
    if [ -f "Podfile" ]; then
        cp Podfile Podfile.backup
        echo -e "${GREEN}✓ Backed up existing Podfile to Podfile.backup${NC}"
    fi
    
    cp ../Podfile_FIXED Podfile
    echo -e "${GREEN}✓ Podfile updated with compatibility fixes${NC}"
else
    echo -e "${YELLOW}⚠ Podfile_FIXED not found. Keeping existing Podfile.${NC}"
    echo -e "${YELLOW}  You may need to manually update your Podfile.${NC}"
fi

echo ""
echo "🔄 Step 4: Updating CocoaPods repo..."
echo "--------------------------------------"
pod repo update
echo -e "${GREEN}✓ Repo updated${NC}"

echo ""
echo "📥 Step 5: Installing pods with fixed versions..."
echo "--------------------------------------------------"
pod install --repo-update
echo -e "${GREEN}✓ Pods installed${NC}"

echo ""
echo "🧹 Step 6: Cleaning Xcode derived data..."
echo "------------------------------------------"
cd ..
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
rm -rf ios/build
echo -e "${GREEN}✓ Derived data cleaned${NC}"

echo ""
echo "=================================="
echo -e "${GREEN}✅ Fix process completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Open your project in Xcode:"
echo "   open ios/MobileTodoList.xcworkspace"
echo ""
echo "2. Clean the build folder (Cmd + Shift + K)"
echo "3. Rebuild your project (Cmd + B)"
echo ""
echo "The following issues should now be fixed:"
echo "  ✓ gRPC-Core template error"
echo "  ✓ Firebase @_implementationOnly warning"
echo "  ✓ Run script build phase warnings"
echo "  ✓ fmt char_traits deprecation warnings"
echo "  ✓ leveldb mmap warnings"
echo ""
