#!/bin/bash
# ONE-LINE FIX - Use only if you're 100% confident
# This will replace your Podfile, clean everything, and reinstall

echo "⚡ ONE-LINE iOS BUILD FIX ⚡"
echo "This will:"
echo "  • Replace your Podfile"
echo "  • Clean all caches"
echo "  • Reinstall all pods"
echo ""
read -p "Continue? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "🚀 Starting fix..."
    cp ios/Podfile ios/Podfile.backup 2>/dev/null && \
    cp Podfile_FIXED ios/Podfile && \
    cd ios && \
    rm -rf Pods build Podfile.lock && \
    pod cache clean --all && \
    pod install --repo-update && \
    cd .. && \
    rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-* && \
    echo "" && \
    echo "✅ Fix complete! Now open Xcode:" && \
    echo "   open ios/MobileTodoList.xcworkspace" && \
    echo "" && \
    echo "Then clean (Cmd+Shift+K) and build (Cmd+B)"
else
    echo "Cancelled. Run fix_ios_build.sh for a guided experience."
fi
