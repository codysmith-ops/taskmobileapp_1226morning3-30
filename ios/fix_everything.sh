#!/bin/bash

# One-command fix for all iOS issues
# Run this single script to fix everything automatically

echo "🚀 Starting automated iOS build fix..."
echo ""

# Make scripts executable
chmod +x fix_all_ios_issues.sh 2>/dev/null || true
chmod +x fix_build_phase_warnings.py 2>/dev/null || true
chmod +x fix_xcode_build_phases.rb 2>/dev/null || true

# Run main fix
echo "Step 1: Fixing Podfile and dependencies..."
./fix_all_ios_issues.sh

# Try to automatically fix build phases with Python
echo ""
echo "Step 2: Attempting to fix build phase warnings automatically..."
if command -v python3 &> /dev/null; then
    python3 fix_build_phase_warnings.py
else
    echo "⚠️  Python3 not found, skipping automatic build phase fix"
    echo "You'll need to fix build phase warnings manually (see guide)"
fi

echo ""
echo "=========================================="
echo "✅ All automated fixes completed!"
echo "=========================================="
echo ""
echo "Final step: Open Xcode and build"
echo ""
echo "  open ios/*.xcworkspace"
echo ""
echo "Then: Clean (Cmd+Shift+K) and Build (Cmd+B)"
echo ""
echo "If you still see build phase warnings, see:"
echo "  IOS_FIX_COMPLETE_GUIDE.md"
echo ""
