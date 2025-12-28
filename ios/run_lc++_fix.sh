#!/bin/bash

# Make the duplicate lc++ fix scripts executable and run the fix

echo "🔧 Setting up duplicate -lc++ fix..."
echo ""

# Make scripts executable
chmod +x fix_duplicate_lc++.sh 2>/dev/null || true
chmod +x fix_duplicate_lc++.py 2>/dev/null || true

echo "✅ Scripts are now executable"
echo ""
echo "Choose your fix method:"
echo ""
echo "1. Run Shell Script (Recommended)"
echo "   ./fix_duplicate_lc++.sh"
echo ""
echo "2. Run Python Script"
echo "   ./fix_duplicate_lc++.py"
echo ""
echo "3. Read Instructions"
echo "   cat FIX_DUPLICATE_LC++_README.md"
echo ""

read -p "Enter your choice (1-3, or press Enter to run option 1): " choice

case $choice in
    2)
        echo ""
        echo "Running Python script..."
        python3 fix_duplicate_lc++.py
        ;;
    3)
        echo ""
        cat FIX_DUPLICATE_LC++_README.md | less
        ;;
    *)
        echo ""
        echo "Running shell script..."
        ./fix_duplicate_lc++.sh
        ;;
esac
