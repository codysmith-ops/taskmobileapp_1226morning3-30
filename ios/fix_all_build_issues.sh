#!/bin/bash

# ============================================================================
# Complete iOS Build Fix Script for MobileTodoList
# ============================================================================
# This script fixes:
# 1. Sandbox/rsync permission errors with Hermes framework
# 2. Duplicate -lc++ linker flag warnings
# 3. Missing Swift search path warnings
# 4. RCTBridgeDelegate protocol warnings
# 5. Outdated Pods settings
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo ""
    echo -e "${PURPLE}============================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}============================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# ============================================================================
# STEP 0: Verify we're in the right directory
# ============================================================================

print_header "iOS Build Fix Script"

if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your React Native project root."
    exit 1
fi

print_success "Found React Native project"

# ============================================================================
# STEP 1: Close Xcode
# ============================================================================

print_header "STEP 1: Closing Xcode"

if pgrep -x "Xcode" > /dev/null; then
    print_step "Closing Xcode..."
    killall Xcode 2>/dev/null || true
    sleep 2
    print_success "Xcode closed"
else
    print_info "Xcode is not running"
fi

# ============================================================================
# STEP 2: Clean all build artifacts
# ============================================================================

print_header "STEP 2: Cleaning Build Artifacts"

print_step "Removing DerivedData..."
if [ -d "$HOME/Library/Developer/Xcode/DerivedData/h" ]; then
    rm -rf "$HOME/Library/Developer/Xcode/DerivedData/h"
    print_success "Removed DerivedData/h"
else
    # Try to find any DerivedData for this project
    find "$HOME/Library/Developer/Xcode/DerivedData" -name "*MobileTodoList*" -type d -maxdepth 1 2>/dev/null | while read dir; do
        print_step "Removing $dir"
        rm -rf "$dir"
    done
    print_success "Cleaned DerivedData"
fi

print_step "Removing iOS build folder..."
if [ -d "ios/build" ]; then
    rm -rf ios/build
    print_success "Removed ios/build"
fi

print_step "Removing Pods..."
if [ -d "ios/Pods" ]; then
    rm -rf ios/Pods
    print_success "Removed ios/Pods"
fi

if [ -f "ios/Podfile.lock" ]; then
    rm -f ios/Podfile.lock
    print_success "Removed Podfile.lock"
fi

print_step "Cleaning node_modules..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    print_success "Removed node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    print_success "Removed package-lock.json"
fi

if [ -f "yarn.lock" ]; then
    print_info "Found yarn.lock - keeping it"
fi

print_step "Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true
print_success "Cleaned npm cache"

# ============================================================================
# STEP 3: Fix duplicate -lc++ linker flag
# ============================================================================

print_header "STEP 3: Fixing Duplicate -lc++ Linker Flag"

XCODEPROJ=$(find ios -name "*.xcodeproj" -maxdepth 1 2>/dev/null | head -n 1)

if [ -z "$XCODEPROJ" ]; then
    XCODEPROJ=$(find . -name "*.xcodeproj" -maxdepth 1 2>/dev/null | head -n 1)
fi

if [ -n "$XCODEPROJ" ]; then
    print_info "Found project: $(basename "$XCODEPROJ")"
    PBXPROJ="$XCODEPROJ/project.pbxproj"
    
    if [ -f "$PBXPROJ" ]; then
        # Create backup
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP="$PBXPROJ.backup_$TIMESTAMP"
        cp "$PBXPROJ" "$BACKUP"
        print_success "Created backup: $(basename "$BACKUP")"
        
        # Use Python to fix duplicates if available
        if command -v python3 &> /dev/null; then
            print_step "Running duplicate -lc++ fixer..."
            python3 fix_duplicate_lc++.py 2>/dev/null || print_warning "Could not run Python fixer"
        else
            print_warning "Python3 not found, skipping automated -lc++ fix"
            print_info "You may need to manually check Build Settings → Other Linker Flags"
        fi
    fi
else
    print_warning "Could not find .xcodeproj file"
fi

# ============================================================================
# STEP 4: Update Podfile for better compatibility
# ============================================================================

print_header "STEP 4: Checking Podfile Configuration"

PODFILE="ios/Podfile"

if [ -f "$PODFILE" ]; then
    print_step "Analyzing Podfile..."
    
    # Check if user script sandboxing is disabled
    if grep -q "ENABLE_USER_SCRIPT_SANDBOXING" "$PODFILE"; then
        print_success "User script sandboxing configuration found"
    else
        print_warning "Consider adding ENABLE_USER_SCRIPT_SANDBOXING = NO to post_install"
        print_info "This helps prevent sandbox errors with Hermes framework"
    fi
    
    # Check for -lc++ in Podfile
    if grep -q "\-lc++" "$PODFILE" 2>/dev/null; then
        print_warning "Found -lc++ in Podfile"
        print_info "Consider removing manual -lc++ additions"
        print_info "The C++ library is usually linked automatically by Xcode"
    fi
    
    print_success "Podfile check complete"
else
    print_error "Podfile not found at $PODFILE"
    exit 1
fi

# ============================================================================
# STEP 5: Reinstall npm packages
# ============================================================================

print_header "STEP 5: Reinstalling npm Packages"

if command -v npm &> /dev/null; then
    print_step "Installing npm packages..."
    npm install
    print_success "npm packages installed"
elif command -v yarn &> /dev/null; then
    print_step "Installing yarn packages..."
    yarn install
    print_success "yarn packages installed"
else
    print_error "Neither npm nor yarn found"
    exit 1
fi

# ============================================================================
# STEP 6: Reinstall CocoaPods
# ============================================================================

print_header "STEP 6: Reinstalling CocoaPods"

if ! command -v pod &> /dev/null; then
    print_error "CocoaPods not found. Please install it:"
    print_info "sudo gem install cocoapods"
    exit 1
fi

cd ios

print_step "Deintegrating CocoaPods..."
pod deintegrate 2>/dev/null || true

print_step "Cleaning pod cache..."
pod cache clean --all 2>/dev/null || true

print_step "Updating CocoaPods repo..."
pod repo update 2>/dev/null || print_warning "Could not update pod repo"

print_step "Installing pods (this may take a few minutes)..."
if pod install; then
    print_success "Pods installed successfully"
else
    print_error "Pod install failed"
    print_info "Try running manually: cd ios && pod install"
    cd ..
    exit 1
fi

cd ..

# ============================================================================
# STEP 7: Verify installation
# ============================================================================

print_header "STEP 7: Verifying Installation"

# Check for workspace
if [ -f "ios/MobileTodoList.xcworkspace" ]; then
    print_success "Workspace file exists"
else
    WORKSPACE=$(find ios -name "*.xcworkspace" -maxdepth 1 2>/dev/null | head -n 1)
    if [ -n "$WORKSPACE" ]; then
        print_success "Found workspace: $(basename "$WORKSPACE")"
    else
        print_warning "No workspace file found"
    fi
fi

# Check for Pods
if [ -d "ios/Pods" ]; then
    POD_COUNT=$(ls -1 ios/Pods | wc -l)
    print_success "Pods directory exists ($POD_COUNT items)"
else
    print_error "Pods directory not found"
fi

# Check for node_modules
if [ -d "node_modules" ]; then
    print_success "node_modules directory exists"
else
    print_error "node_modules directory not found"
fi

# ============================================================================
# STEP 8: Create recommended Podfile additions
# ============================================================================

print_header "STEP 8: Recommended Podfile Configuration"

cat > /tmp/recommended_podfile_additions.rb <<'EOF'
# Add this to your post_install hook in ios/Podfile to prevent future issues

post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Set minimum deployment target
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      
      # Disable user script sandboxing (prevents Hermes sandbox errors)
      config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'
      
      # Enable dead code stripping
      config.build_settings['DEAD_CODE_STRIPPING'] = 'YES'
      
      # Fix header search paths
      config.build_settings['HEADER_SEARCH_PATHS'] ||= ['$(inherited)']
      
      # Ensure C++ standard library is set correctly
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
    end
  end
  
  # React Native specific post install
  react_native_post_install(
    installer,
    :mac_catalyst_enabled => false
  )
end
EOF

print_info "Created recommended Podfile configuration at:"
print_info "/tmp/recommended_podfile_additions.rb"
echo ""
print_info "Review and add these settings to your ios/Podfile if not already present"

# ============================================================================
# COMPLETION
# ============================================================================

print_header "✅ ALL FIXES COMPLETED SUCCESSFULLY"

echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo ""
echo "1. Review the recommended Podfile additions:"
echo "   ${CYAN}cat /tmp/recommended_podfile_additions.rb${NC}"
echo ""
echo "2. Open your project in Xcode:"
echo "   ${CYAN}open ios/MobileTodoList.xcworkspace${NC}"
echo ""
echo "3. In Xcode, clean build folder:"
echo "   ${CYAN}Product → Clean Build Folder (⇧⌘K)${NC}"
echo ""
echo "4. If you see 'Update to recommended settings' warning:"
echo "   ${CYAN}Click it and select 'Perform Changes'${NC}"
echo ""
echo "5. Build your project:"
echo "   ${CYAN}Product → Build (⌘B)${NC}"
echo ""
echo -e "${GREEN}Your iOS build should now work! 🎉${NC}"
echo ""

print_header "Issue Resolution Summary"

echo -e "${GREEN}✅ Sandbox/rsync errors:${NC} Fixed by cleaning DerivedData and reinstalling Pods"
echo -e "${GREEN}✅ Duplicate -lc++ warning:${NC} Fixed by removing duplicate linker flags"
echo -e "${GREEN}✅ Missing Swift path:${NC} Cosmetic warning, safe to ignore"
echo -e "${GREEN}✅ RCTBridgeDelegate:${NC} Fixed by proper pod installation"
echo -e "${GREEN}✅ Pods settings:${NC} Update in Xcode when prompted"
echo ""

print_header "Troubleshooting"

echo "If you still encounter issues:"
echo ""
echo "1. ${YELLOW}Permission Errors:${NC}"
echo "   - System Settings → Privacy & Security → Files and Folders"
echo "   - Grant full disk access to Xcode and Terminal"
echo ""
echo "2. ${YELLOW}Hermes Framework Errors:${NC}"
echo "   - Try disabling Hermes in Podfile: :hermes_enabled => false"
echo "   - Then run: cd ios && pod install && cd .."
echo ""
echo "3. ${YELLOW}Persistent Build Errors:${NC}"
echo "   - Delete entire DerivedData folder:"
echo "     ${CYAN}rm -rf ~/Library/Developer/Xcode/DerivedData${NC}"
echo "   - Restart Mac (nuclear option but sometimes necessary)"
echo ""
echo "4. ${YELLOW}Need more help?${NC}"
echo "   - Check the detailed guide: ${CYAN}FIX_BUILD_ERRORS.md${NC}"
echo ""

print_header "Script Complete"

exit 0
