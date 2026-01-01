#!/bin/bash

# Advanced Mac Cleanup - Additional space optimization
# Run this for deeper cleaning (safe but more aggressive)

set -e

echo "🧹 Advanced Mac Cleanup"
echo "======================="
echo ""

echo "📊 Current disk usage:"
df -h / | grep -v Filesystem
echo ""

# Calculate space before
BEFORE=$(df -k / | tail -1 | awk '{print $3}')

echo "🎯 Step 1: Cleaning browser caches (Google Chrome/etc)..."
echo "----------------------------------------------------------"
if [ -d ~/Library/Caches/Google ]; then
    SIZE=$(du -sh ~/Library/Caches/Google 2>/dev/null | cut -f1)
    echo "🗑️  Removing: Google Chrome cache ($SIZE)"
    rm -rf ~/Library/Caches/Google/*
    echo "✅ Freed: $SIZE"
else
    echo "⏭️  No Google cache found"
fi
echo ""

echo "🎯 Step 2: Cleaning Homebrew cache..."
echo "-------------------------------------"
if [ -d ~/Library/Caches/Homebrew ]; then
    SIZE=$(du -sh ~/Library/Caches/Homebrew 2>/dev/null | cut -f1)
    echo "🗑️  Removing: Homebrew cache ($SIZE)"
    rm -rf ~/Library/Caches/Homebrew/*
    echo "✅ Freed: $SIZE"
else
    echo "⏭️  No Homebrew cache found"
fi
echo ""

echo "🎯 Step 3: Cleaning node-gyp cache..."
echo "-------------------------------------"
if [ -d ~/Library/Caches/node-gyp ]; then
    SIZE=$(du -sh ~/Library/Caches/node-gyp 2>/dev/null | cut -f1)
    echo "🗑️  Removing: node-gyp cache ($SIZE)"
    rm -rf ~/Library/Caches/node-gyp/*
    echo "✅ Freed: $SIZE"
else
    echo "⏭️  No node-gyp cache found"
fi
echo ""

echo "🎯 Step 4: Cleaning old iOS Simulators (keeping current ones)..."
echo "----------------------------------------------------------------"
if command -v xcrun &> /dev/null; then
    echo "🗑️  Listing old simulators..."
    
    # Delete unavailable simulators
    xcrun simctl delete unavailable 2>/dev/null || true
    
    # Show remaining simulators
    echo ""
    echo "Current simulators (keeping these):"
    xcrun simctl list devices | grep "iPhone\|iPad" | head -5
    
    echo ""
    echo "✅ Removed unavailable simulators"
    echo ""
    echo "💡 To remove ALL simulators and free ~6GB:"
    echo "   xcrun simctl delete all"
    echo "   (You can re-download them in Xcode when needed)"
else
    echo "⏭️  Xcode tools not available"
fi
echo ""

echo "🎯 Step 5: Cleaning Downloads folder (files older than 30 days)..."
echo "------------------------------------------------------------------"
if [ -d ~/Downloads ]; then
    echo "📁 Files in Downloads folder older than 30 days:"
    find ~/Downloads -type f -mtime +30 2>/dev/null | head -10
    
    echo ""
    echo "💡 To manually clean Downloads:"
    echo "   open ~/Downloads"
    echo "   (Review and delete old files)"
else
    echo "⏭️  No Downloads folder"
fi
echo ""

echo "🎯 Step 6: System cache cleanup..."
echo "-----------------------------------"
echo "🗑️  Cleaning DNS cache..."
sudo dscacheutil -flushcache 2>/dev/null || true
sudo killall -HUP mDNSResponder 2>/dev/null || true
echo "✅ DNS cache cleared"
echo ""

# Calculate space after
AFTER=$(df -k / | tail -1 | awk '{print $3}')
FREED=$(( ($BEFORE - $AFTER) / 1024 ))

echo "✨ Advanced Cleanup Complete!"
echo "============================="
echo ""
echo "📊 New disk usage:"
df -h / | grep -v Filesystem
echo ""
echo "💾 Approximate space freed: ${FREED}MB"
echo ""
echo "🚀 Performance Tips:"
echo "   1. Restart your Mac for best results"
echo "   2. Run Disk Utility > First Aid on your drive"
echo "   3. Check Activity Monitor for memory-hungry apps"
echo "   4. Consider upgrading to SSD if on HDD (10x faster!)"
echo ""
echo "💡 Optional - Delete ALL iOS simulators to free ~6GB:"
echo "   xcrun simctl delete all"
echo ""
