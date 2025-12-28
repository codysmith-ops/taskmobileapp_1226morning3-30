#!/bin/bash

# Fix duplicate -lc++ linker flag warning in Xcode projects
# This script removes duplicate -lc++ entries from OTHER_LDFLAGS

set -e

echo "🔧 Fixing duplicate -lc++ linker flag warning..."
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Find the Xcode project
XCODEPROJ=$(find ios -name "*.xcodeproj" -maxdepth 1 2>/dev/null | head -n 1)

if [ -z "$XCODEPROJ" ]; then
    XCODEPROJ=$(find . -name "*.xcodeproj" -maxdepth 1 2>/dev/null | head -n 1)
fi

if [ -z "$XCODEPROJ" ]; then
    echo -e "${RED}❌ Error: No .xcodeproj found${NC}"
    exit 1
fi

echo -e "${BLUE}📱 Found project: $(basename "$XCODEPROJ")${NC}"

PBXPROJ="$XCODEPROJ/project.pbxproj"

if [ ! -f "$PBXPROJ" ]; then
    echo -e "${RED}❌ Error: project.pbxproj not found${NC}"
    exit 1
fi

# Create backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP="$PBXPROJ.backup_$TIMESTAMP"
cp "$PBXPROJ" "$BACKUP"
echo -e "${GREEN}📋 Created backup: $(basename "$BACKUP")${NC}"
echo ""

# Check for duplicates and fix them
echo "🔍 Scanning for duplicate -lc++ flags..."

# Method 1: Fix duplicates in array format: OTHER_LDFLAGS = ("-lc++", "-lc++", ...);
# Method 2: Fix duplicates in string format: OTHER_LDFLAGS = "$(inherited) -lc++ -lc++";

# Use Python for complex text processing
python3 - "$PBXPROJ" <<'PYTHON_SCRIPT'
import sys
import re

pbxproj_path = sys.argv[1]

with open(pbxproj_path, 'r') as f:
    content = f.read()

original_content = content
fixes_applied = 0

# Pattern 1: Array format
def remove_dup_array(match):
    global fixes_applied
    full = match.group(0)
    flags_str = match.group(1)
    
    flags = [f.strip() for f in flags_str.split(',')]
    lc_count = sum(1 for f in flags if '"-lc++"' in f or "'-lc++'" in f)
    
    if lc_count > 1:
        seen = set()
        unique = []
        for flag in flags:
            f = flag.strip()
            if f and f not in seen:
                seen.add(f)
                unique.append(flag)
        
        fixes_applied += 1
        return f"OTHER_LDFLAGS = ({', '.join(unique)});"
    
    return full

content = re.sub(r'OTHER_LDFLAGS\s*=\s*\(([^)]+)\);', remove_dup_array, content)

# Pattern 2: String format
def remove_dup_string(match):
    global fixes_applied
    full = match.group(0)
    flags_str = match.group(1)
    
    flags = flags_str.split()
    lc_count = sum(1 for f in flags if f == '-lc++')
    
    if lc_count > 1:
        seen = set()
        unique = []
        for flag in flags:
            if flag.startswith('$(') or flag not in seen:
                if not flag.startswith('$('):
                    seen.add(flag)
                unique.append(flag)
        
        fixes_applied += 1
        return f'OTHER_LDFLAGS = "{" ".join(unique)}";'
    
    return full

content = re.sub(r'OTHER_LDFLAGS\s*=\s*"([^"]+)";', remove_dup_string, content)

if content != original_content:
    with open(pbxproj_path, 'w') as f:
        f.write(content)
    print(f"✅ Removed duplicate -lc++ flags ({fixes_applied} location(s))")
    sys.exit(0)
else:
    print("✅ No duplicate -lc++ flags found")
    sys.exit(1)

PYTHON_SCRIPT

PYTHON_EXIT=$?

echo ""

# Check Podfile
if [ -f "ios/Podfile" ] || [ -f "Podfile" ]; then
    echo "=================================================="
    echo "🔍 Checking Podfile for -lc++ references..."
    echo ""
    
    PODFILE="ios/Podfile"
    [ ! -f "$PODFILE" ] && PODFILE="Podfile"
    
    if grep -q "\-lc++" "$PODFILE" 2>/dev/null; then
        echo -e "${YELLOW}⚠️  Found -lc++ in Podfile${NC}"
        echo "Check your post_install hook for duplicate additions:"
        echo ""
        grep -n "\-lc++" "$PODFILE" || true
        echo ""
        echo -e "${YELLOW}Consider removing manual -lc++ additions${NC}"
        echo "The C++ library is usually linked automatically by Xcode."
    else
        echo -e "${GREEN}✓ No -lc++ references in Podfile${NC}"
    fi
fi

echo ""
echo "=================================================="

if [ $PYTHON_EXIT -eq 0 ]; then
    echo -e "${GREEN}✅ DUPLICATE -lc++ FLAGS REMOVED${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Close Xcode if open"
    echo "2. Open your workspace/project"
    echo "3. Clean: Cmd+Shift+K"
    echo "4. Build: Cmd+B"
    echo ""
    echo "If using CocoaPods:"
    echo "5. cd ios && pod install && cd .."
else
    echo "ℹ️  Your project appears clean!"
    echo ""
    echo "If you still see the warning:"
    echo "1. Manually check Build Settings in Xcode"
    echo "2. Search for 'Other Linker Flags'"
    echo "3. Look for duplicate -lc++ entries"
    echo "4. Check .xcconfig files"
fi

echo "=================================================="
