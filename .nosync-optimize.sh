#!/bin/bash

# iCloud Storage Optimization Script
# This script moves large development files to .nosync folders to prevent iCloud syncing
# while keeping them locally accessible

set -e

echo "🔧 iCloud Storage Optimization Tool"
echo "===================================="
echo ""

PROJECT_ROOT="/Users/codysmith/Library/Mobile Documents/com~apple~CloudDocs/Projects/taskmobileapp_1226morning"

cd "$PROJECT_ROOT"

# Function to move directory to .nosync version
optimize_directory() {
    local dir_path="$1"
    local dir_name=$(basename "$dir_path")
    local parent_dir=$(dirname "$dir_path")
    local nosync_path="${parent_dir}/${dir_name}.nosync"
    
    if [ -d "$dir_path" ] && [ ! -L "$dir_path" ]; then
        echo "📦 Optimizing: $dir_path"
        
        # Move to .nosync version
        mv "$dir_path" "$nosync_path"
        
        # Create symlink
        ln -s "$nosync_path" "$dir_path"
        
        echo "✅ Created: $nosync_path ($(du -sh "$nosync_path" | cut -f1))"
        echo "✅ Symlinked: $dir_path -> $nosync_path"
        echo ""
    elif [ -L "$dir_path" ]; then
        echo "⏭️  Already optimized: $dir_path"
        echo ""
    else
        echo "⚠️  Not found: $dir_path"
        echo ""
    fi
}

# Optimize node_modules directories
echo "🎯 Step 1: Optimizing node_modules..."
echo "------------------------------------"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/node_modules"
optimize_directory "$PROJECT_ROOT/MobileTodoList/node_modules"

# Optimize iOS build directories
echo "🎯 Step 2: Optimizing iOS build directories..."
echo "----------------------------------------------"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/ios/build"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/ios/Pods"
optimize_directory "$PROJECT_ROOT/MobileTodoList/ios/build"
optimize_directory "$PROJECT_ROOT/MobileTodoList/ios/Pods"

# Optimize Android build directories
echo "🎯 Step 3: Optimizing Android build directories..."
echo "--------------------------------------------------"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/android/build"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/android/app/build"
optimize_directory "$PROJECT_ROOT/MobileTodoList/android/build"
optimize_directory "$PROJECT_ROOT/MobileTodoList/android/app/build"

# Optimize derived data and caches
echo "🎯 Step 4: Optimizing caches..."
echo "------------------------------"
optimize_directory "$PROJECT_ROOT/MobileTodoList-iOS/ios/DerivedData"

# Calculate space saved
echo "📊 Calculating space optimization..."
echo "===================================="
total_nosync_size=$(find "$PROJECT_ROOT" -name "*.nosync" -type d -exec du -sh {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')

echo ""
echo "✨ Optimization Complete!"
echo "========================"
echo ""
echo "📦 The following directories are now excluded from iCloud sync:"
echo "   - node_modules (both projects)"
echo "   - iOS build outputs and Pods"
echo "   - Android build outputs"
echo "   - Derived data and caches"
echo ""
echo "💾 These files remain on your Mac but won't sync to iCloud,"
echo "   freeing up your iCloud storage quota."
echo ""
echo "🔄 To restore these directories, simply run:"
echo "   npm install (for node_modules)"
echo "   pod install (for iOS Pods)"
echo ""
echo "⚡ Your projects will continue to work normally via symlinks!"
