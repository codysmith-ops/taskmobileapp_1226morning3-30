#!/bin/bash
set -euo pipefail

# FAANG-level preflight checks for iOS builds
# Enforces Xcode 26.2 and iPhone 15 iOS 17.5 simulator

REQUIRED_XCODE_PATH="/Applications/Xcode.app/Contents/Developer"
REQUIRED_XCODE_VERSION="Xcode 26.2"
REQUIRED_XCODE_BUILD="17C52"
REQUIRED_SIMULATOR="iPhone 15"
REQUIRED_IOS_VERSION="17.5"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Running preflight checks..."

# Check Xcode path
CURRENT_XCODE_PATH=$(xcode-select -p)
if [[ "$CURRENT_XCODE_PATH" != "$REQUIRED_XCODE_PATH" ]]; then
    echo -e "${RED}❌ PREFLIGHT FAILED${NC}"
    echo -e "${RED}Wrong Xcode selected:${NC}"
    echo "  Current: $CURRENT_XCODE_PATH"
    echo "  Required: $REQUIRED_XCODE_PATH"
    echo ""
    echo "Fix with:"
    echo "  sudo xcode-select -s $REQUIRED_XCODE_PATH"
    exit 1
fi

# Check Xcode version
CURRENT_XCODE_VERSION=$(xcodebuild -version | head -n 1)
if [[ "$CURRENT_XCODE_VERSION" != "$REQUIRED_XCODE_VERSION" ]]; then
    echo -e "${RED}❌ PREFLIGHT FAILED${NC}"
    echo -e "${RED}Wrong Xcode version:${NC}"
    echo "  Current: $CURRENT_XCODE_VERSION"
    echo "  Required: $REQUIRED_XCODE_VERSION"
    exit 1
fi

# Check Xcode build
CURRENT_XCODE_BUILD=$(xcodebuild -version | grep "Build version" | awk '{print $3}')
if [[ "$CURRENT_XCODE_BUILD" != "$REQUIRED_XCODE_BUILD" ]]; then
    echo -e "${RED}❌ PREFLIGHT FAILED${NC}"
    echo -e "${RED}Wrong Xcode build:${NC}"
    echo "  Current: $CURRENT_XCODE_BUILD"
    echo "  Required: $REQUIRED_XCODE_BUILD"
    exit 1
fi

# Check simulator availability - iPhone 15 exists under iOS 17.5
IOS_17_5_SECTION=$(xcrun simctl list devices 2>/dev/null | grep -A 50 "iOS 17.5")
SIMULATOR_CHECK=$(echo "$IOS_17_5_SECTION" | grep "$REQUIRED_SIMULATOR (" | head -1)

if [[ -z "$SIMULATOR_CHECK" ]]; then
    echo -e "${RED}❌ PREFLIGHT FAILED${NC}"
    echo -e "${RED}Required simulator not found:${NC}"
    echo "  Required: $REQUIRED_SIMULATOR (iOS $REQUIRED_IOS_VERSION)"
    echo ""
    echo "Run this to create it:"
    echo "  xcrun simctl create 'iPhone 15' 'com.apple.CoreSimulator.SimDeviceType.iPhone-15' 'com.apple.CoreSimulator.SimRuntime.iOS-17-5'"
    exit 1
fi

# Check for Android references in iOS workflows (iOS-only mode enforcement)
ANDROID_CHECK=$(grep -r "android" .github/workflows/*.yml .vscode/tasks.json 2>/dev/null || true)
if [[ -n "$ANDROID_CHECK" ]]; then
    echo -e "${YELLOW}⚠️  WARNING: Android references detected in iOS workflows${NC}"
    echo "  This project is iOS-only. Review and remove Android references."
    echo "  Files to check: .github/workflows/*.yml, .vscode/tasks.json"
fi

echo -e "${GREEN}✅ Xcode: $REQUIRED_XCODE_VERSION (Build $REQUIRED_XCODE_BUILD)${NC}"
echo -e "${GREEN}✅ Simulator: $REQUIRED_SIMULATOR (iOS $REQUIRED_IOS_VERSION) available${NC}"
echo -e "${GREEN}✅ iOS-only mode: Verified${NC}"
echo -e "${GREEN}✅ All preflight checks passed${NC}"
exit 0
