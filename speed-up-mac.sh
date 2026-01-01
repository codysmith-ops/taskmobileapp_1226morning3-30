#!/bin/bash

# Mac Speed Optimization Script
# Removes regenerable files, caches, and build artifacts to free up local disk space

set -e

echo "🚀 Mac Speed Optimization Tool"
echo "=============================="
echo ""

PROJECT_ROOT="/Users/codysmith/Library/Mobile Documents/com~apple~CloudDocs/Projects/taskmobileapp_1226morning"

# Function to safely remove directory and show space saved
remove_and_report() {
    local dir_path="$1"
    local description="$2"
    
    if [ -d "$dir_path" ]; then
        local size=$(du -sh "$dir_path" 2>/dev/null | cut -f1)
        echo "🗑️  Removing: $description ($size)"
        rm -rf "$dir_path"
        echo "✅ Freed: $size"
        echo ""
    else
        echo "⏭️  Not found: $description"
        echo ""
    fi
}

echo "📊 Analyzing current disk usage..."
df -h / | grep -v Filesystem

echo ""
echo "🎯 Step 1: Removing node_modules (can reinstall with npm install)..."
echo "--------------------------------------------------------------------"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/node_modules" "iOS project node_modules"
remove_and_report "$PROJECT_ROOT/MobileTodoList/node_modules" "Main project node_modules"

echo "🎯 Step 2: Removing iOS build artifacts..."
echo "------------------------------------------"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/ios/build" "iOS build folder"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/ios/Pods" "CocoaPods"
remove_and_report "$PROJECT_ROOT/MobileTodoList/ios/build" "Main iOS build folder"
remove_and_report "$PROJECT_ROOT/MobileTodoList/ios/Pods" "Main CocoaPods"

echo "🎯 Step 3: Removing Android build artifacts..."
echo "----------------------------------------------"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/android/build" "Android build"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/android/app/build" "Android app build"
remove_and_report "$PROJECT_ROOT/MobileTodoList-iOS/android/.gradle" "Gradle cache"
remove_and_report "$PROJECT_ROOT/MobileTodoList/android/build" "Main Android build"
remove_and_report "$PROJECT_ROOT/MobileTodoList/android/app/build" "Main Android app build"

echo "🎯 Step 4: Cleaning Xcode derived data (system-wide)..."
echo "-------------------------------------------------------"
if [ -d ~/Library/Developer/Xcode/DerivedData ]; then
    size=$(du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null | cut -f1)
    echo "🗑️  Removing: Xcode DerivedData ($size)"
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    echo "✅ Freed: $size"
else
    echo "⏭️  No Xcode derived data found"
fi
echo ""

echo "🎯 Step 5: Cleaning Xcode archives..."
echo "-------------------------------------"
if [ -d ~/Library/Developer/Xcode/Archives ]; then
    size=$(du -sh ~/Library/Developer/Xcode/Archives 2>/dev/null | cut -f1)
    echo "🗑️  Removing: Old Xcode archives ($size)"
    rm -rf ~/Library/Developer/Xcode/Archives/*
    echo "✅ Freed: $size"
else
    echo "⏭️  No Xcode archives found"
fi
echo ""

echo "🎯 Step 6: Cleaning npm cache..."
echo "--------------------------------"
echo "🗑️  Running: npm cache clean --force"
npm cache clean --force 2>/dev/null || echo "⏭️  npm not available"
echo ""

echo "🎯 Step 7: Cleaning yarn cache..."
echo "---------------------------------"
if command -v yarn &> /dev/null; then
    echo "🗑️  Running: yarn cache clean"
    yarn cache clean 2>/dev/null || true
else
    echo "⏭️  yarn not installed"
fi
echo ""

echo "🎯 Step 8: Cleaning CocoaPods cache..."
echo "--------------------------------------"
if command -v pod &> /dev/null; then
    echo "🗑️  Running: pod cache clean --all"
    pod cache clean --all 2>/dev/null || true
else
    echo "⏭️  CocoaPods not installed"
fi
echo ""

echo "🎯 Step 9: Cleaning iOS simulator data..."
echo "-----------------------------------------"
if command -v xcrun &> /dev/null; then
    echo "🗑️  Removing old simulator data..."
    xcrun simctl delete unavailable 2>/dev/null || true
    echo "✅ Cleaned up old simulators"
else
    echo "⏭️  Xcode tools not available"
fi
echo ""

echo "🎯 Step 10: Emptying system trash..."
echo "------------------------------------"
echo "🗑️  Emptying trash..."
rm -rf ~/.Trash/* 2>/dev/null || true
echo "✅ Trash emptied"
echo ""

echo "✨ Optimization Complete!"
echo "========================"
echo ""
echo "📊 New disk usage:"
df -h / | grep -v Filesystem
echo ""
echo "🔄 To restore your development environment:"
echo ""
echo "   cd MobileTodoList-iOS"
echo "   npm install"
echo "   cd ios && pod install"
echo ""
echo "💡 Additional tips to keep your Mac fast:"
echo "   1. Empty trash regularly"
echo "   2. Run this script monthly"
echo "   3. Uninstall unused apps"
echo "   4. Use 'About This Mac > Storage > Manage' for more options"
echo ""
echo "⚡ Your Mac should be noticeably faster now!"
