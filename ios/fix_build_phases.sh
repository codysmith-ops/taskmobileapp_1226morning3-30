#!/bin/bash

# Xcode Build Phase Fix Script
# This script fixes the build phase warnings by adding output file specifications

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Xcode Build Phase Quick Fix${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Find the Xcode project
if [ -d "ios" ]; then
    PROJECT_DIR="ios"
elif [ -f "*.xcodeproj" ]; then
    PROJECT_DIR="."
else
    echo -e "${RED}Error: Could not find Xcode project${NC}"
    exit 1
fi

# Find .xcodeproj file
XCODEPROJ=$(find "$PROJECT_DIR" -name "*.xcodeproj" -maxdepth 1 | head -n 1)

if [ -z "$XCODEPROJ" ]; then
    echo -e "${RED}Error: No .xcodeproj file found${NC}"
    exit 1
fi

PBXPROJ="$XCODEPROJ/project.pbxproj"

if [ ! -f "$PBXPROJ" ]; then
    echo -e "${RED}Error: project.pbxproj not found${NC}"
    exit 1
fi

echo -e "${GREEN}Found project:${NC} $XCODEPROJ"
echo ""

# Create backup
BACKUP_FILE="${PBXPROJ}.backup.$(date +%Y%m%d_%H%M%S)"
cp "$PBXPROJ" "$BACKUP_FILE"
echo -e "${GREEN}✓${NC} Created backup: $BACKUP_FILE"
echo ""

# Function to add output file to a build phase
add_output_to_phase() {
    local phase_name="$1"
    local output_file="$2"
    local pbx_file="$3"
    
    # Check if phase exists and doesn't have outputs
    if grep -q "$phase_name" "$pbx_file"; then
        # Find the phase and check if it has empty or no outputPaths
        if perl -0777 -ne "print if /\/\* $phase_name \*\/.*?isa = PBXShellScriptBuildPhase;.*?(?:outputPaths = \(\s*\);|(?!outputPaths))/s" "$pbx_file" | grep -q "$phase_name"; then
            echo -e "${YELLOW}→${NC} Processing phase: $phase_name"
            
            # Use Perl to modify the file in place
            perl -i -0777 -pe "
                s{
                    (\/\* $phase_name \*\/ = \{[^\}]*?isa = PBXShellScriptBuildPhase;.*?)
                    (outputPaths = \(\s*\);)
                }{
                    \$1outputPaths = (\n\t\t\t\t\"$output_file\",\n\t\t\t);
                }gsx
                or
                s{
                    (\/\* $phase_name \*\/ = \{[^\}]*?isa = PBXShellScriptBuildPhase;[^\}]*?)
                    (?=\s*\};)
                }{
                    \$1\n\t\t\toutputPaths = (\n\t\t\t\t\"$output_file\",\n\t\t\t);
                }gsx
            " "$pbx_file"
            
            echo -e "   ${GREEN}✓${NC} Added output: $output_file"
            return 0
        else
            echo -e "${BLUE}ℹ${NC} Phase '$phase_name' already has outputs"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠${NC} Phase '$phase_name' not found"
        return 1
    fi
}

# Fix React Native bundle phase
echo -e "${BLUE}Fixing Build Phases...${NC}"
echo ""

add_output_to_phase \
    "Bundle React Native code and images" \
    "\$(DERIVED_FILE_DIR)/main.jsbundle" \
    "$PBXPROJ"

add_output_to_phase \
    "\[CP-User\] \[RNFB\] Core Configuration" \
    "\$(DERIVED_FILE_DIR)/rnfb-config-generated.stamp" \
    "$PBXPROJ"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Fix Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Next steps:"
echo -e "1. Clean build folder in Xcode (Cmd+Shift+K)"
echo -e "2. Rebuild your project"
echo -e "3. If issues persist, restore from backup: $BACKUP_FILE"
echo ""
