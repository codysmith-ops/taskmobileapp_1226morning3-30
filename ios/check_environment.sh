#!/bin/bash

# ============================================================================
# System Permissions and Environment Checker
# ============================================================================
# This script checks your macOS setup for common issues that cause build failures
# ============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

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

# ============================================================================
# Check Xcode
# ============================================================================

print_header "Checking Xcode Installation"

if command -v xcodebuild &> /dev/null; then
    XCODE_VERSION=$(xcodebuild -version | head -n 1)
    print_success "Xcode installed: $XCODE_VERSION"
    
    # Check Xcode version
    XCODE_VERSION_NUMBER=$(xcodebuild -version | head -n 1 | awk '{print $2}' | cut -d. -f1)
    if [ "$XCODE_VERSION_NUMBER" -ge 14 ]; then
        print_success "Xcode version is sufficient (14.0+)"
    else
        print_warning "Xcode version may be too old. React Native requires Xcode 14.0+"
        print_info "Update via App Store"
    fi
    
    # Check command line tools
    if xcode-select -p &> /dev/null; then
        print_success "Command line tools installed: $(xcode-select -p)"
    else
        print_error "Command line tools not installed"
        print_info "Install with: xcode-select --install"
    fi
else
    print_error "Xcode not found"
    print_info "Install from App Store"
fi

# ============================================================================
# Check CocoaPods
# ============================================================================

print_header "Checking CocoaPods"

if command -v pod &> /dev/null; then
    POD_VERSION=$(pod --version)
    print_success "CocoaPods installed: $POD_VERSION"
    
    # Check if pod repo exists
    if [ -d "$HOME/.cocoapods/repos/trunk" ]; then
        print_success "CocoaPods trunk repo exists"
    else
        print_warning "CocoaPods trunk repo not found"
        print_info "Run: pod repo update"
    fi
else
    print_error "CocoaPods not installed"
    print_info "Install with: sudo gem install cocoapods"
fi

# ============================================================================
# Check Node.js and npm
# ============================================================================

print_header "Checking Node.js and npm"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
    
    # Check Node version (React Native requires 14+)
    NODE_VERSION_NUMBER=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION_NUMBER" -ge 14 ]; then
        print_success "Node.js version is sufficient (14+)"
    else
        print_warning "Node.js version may be too old. React Native requires Node 14+"
        print_info "Update via nvm or nodejs.org"
    fi
else
    print_error "Node.js not installed"
    print_info "Install from nodejs.org or use nvm"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not installed"
fi

# Check for yarn
if command -v yarn &> /dev/null; then
    YARN_VERSION=$(yarn --version)
    print_success "Yarn installed: $YARN_VERSION"
fi

# ============================================================================
# Check Ruby and Gems
# ============================================================================

print_header "Checking Ruby Environment"

if command -v ruby &> /dev/null; then
    RUBY_VERSION=$(ruby --version | awk '{print $2}')
    print_success "Ruby installed: $RUBY_VERSION"
else
    print_error "Ruby not installed"
fi

if command -v gem &> /dev/null; then
    GEM_VERSION=$(gem --version)
    print_success "RubyGems installed: $GEM_VERSION"
else
    print_error "RubyGems not installed"
fi

# ============================================================================
# Check Disk Space
# ============================================================================

print_header "Checking Disk Space"

AVAILABLE_SPACE=$(df -h ~ | tail -1 | awk '{print $4}')
print_info "Available space: $AVAILABLE_SPACE"

# Check DerivedData size
if [ -d "$HOME/Library/Developer/Xcode/DerivedData" ]; then
    DERIVED_DATA_SIZE=$(du -sh "$HOME/Library/Developer/Xcode/DerivedData" 2>/dev/null | awk '{print $1}')
    print_info "DerivedData size: $DERIVED_DATA_SIZE"
    print_info "Consider cleaning: rm -rf ~/Library/Developer/Xcode/DerivedData"
fi

# Check CocoaPods cache size
if [ -d "$HOME/Library/Caches/CocoaPods" ]; then
    PODS_CACHE_SIZE=$(du -sh "$HOME/Library/Caches/CocoaPods" 2>/dev/null | awk '{print $1}')
    print_info "CocoaPods cache size: $PODS_CACHE_SIZE"
fi

# ============================================================================
# Check System Permissions
# ============================================================================

print_header "Checking System Permissions"

# Check if we can write to project directory
if [ -w "." ]; then
    print_success "Current directory is writable"
else
    print_error "Current directory is not writable"
    print_info "Check permissions: ls -la"
fi

# Check for Full Disk Access (indirectly)
if [ -r "$HOME/Library/Application Support" ]; then
    print_success "Can read Application Support directory"
else
    print_warning "Cannot read Application Support - may need Full Disk Access"
fi

# Suggest checking Full Disk Access
print_info "To grant Full Disk Access:"
print_info "  1. System Settings → Privacy & Security"
print_info "  2. Full Disk Access → Add Xcode and Terminal"

# ============================================================================
# Check for Common Issues
# ============================================================================

print_header "Checking for Common Issues"

# Check if Xcode is running
if pgrep -x "Xcode" > /dev/null; then
    print_warning "Xcode is currently running"
    print_info "Close Xcode before running build fix scripts"
else
    print_success "Xcode is not running"
fi

# Check for corrupted DerivedData
if [ -d "$HOME/Library/Developer/Xcode/DerivedData" ]; then
    # Count how many derived data folders exist
    DD_COUNT=$(ls -1 "$HOME/Library/Developer/Xcode/DerivedData" 2>/dev/null | wc -l)
    if [ "$DD_COUNT" -gt 10 ]; then
        print_warning "Many DerivedData folders found ($DD_COUNT)"
        print_info "Consider cleaning: rm -rf ~/Library/Developer/Xcode/DerivedData"
    else
        print_success "DerivedData looks reasonable ($DD_COUNT folders)"
    fi
fi

# Check for stale pod installations
if [ -f "ios/Podfile.lock" ] && [ -d "ios/Pods" ]; then
    PODFILE_TIME=$(stat -f %m ios/Podfile 2>/dev/null || echo 0)
    PODFILE_LOCK_TIME=$(stat -f %m ios/Podfile.lock 2>/dev/null || echo 0)
    
    if [ "$PODFILE_TIME" -gt "$PODFILE_LOCK_TIME" ]; then
        print_warning "Podfile is newer than Podfile.lock"
        print_info "Run: cd ios && pod install && cd .."
    else
        print_success "Pod installation is up to date"
    fi
fi

# Check for node_modules
if [ -d "node_modules" ]; then
    print_success "node_modules directory exists"
    
    # Check if package.json is newer than node_modules
    if [ -f "package.json" ]; then
        PKG_TIME=$(stat -f %m package.json 2>/dev/null || echo 0)
        NM_TIME=$(stat -f %m node_modules 2>/dev/null || echo 0)
        
        if [ "$PKG_TIME" -gt "$NM_TIME" ]; then
            print_warning "package.json is newer than node_modules"
            print_info "Run: npm install"
        fi
    fi
else
    print_warning "node_modules directory not found"
    print_info "Run: npm install"
fi

# ============================================================================
# Check Project Structure
# ============================================================================

print_header "Checking Project Structure"

# Check for required files
if [ -f "package.json" ]; then
    print_success "package.json found"
else
    print_error "package.json not found"
fi

if [ -f "ios/Podfile" ]; then
    print_success "ios/Podfile found"
else
    print_error "ios/Podfile not found"
fi

# Check for workspace
WORKSPACE=$(find ios -name "*.xcworkspace" -maxdepth 1 2>/dev/null | head -n 1)
if [ -n "$WORKSPACE" ]; then
    print_success "Workspace found: $(basename "$WORKSPACE")"
else
    print_warning "No .xcworkspace found"
    print_info "You may need to run: cd ios && pod install && cd .."
fi

# Check for xcodeproj
XCODEPROJ=$(find ios -name "*.xcodeproj" -maxdepth 1 2>/dev/null | head -n 1)
if [ -n "$XCODEPROJ" ]; then
    print_success "Project found: $(basename "$XCODEPROJ")"
else
    print_error "No .xcodeproj found"
fi

# ============================================================================
# Check for React Native Issues
# ============================================================================

print_header "Checking React Native Setup"

if [ -f "package.json" ]; then
    # Check React Native version
    if grep -q "react-native" package.json; then
        RN_VERSION=$(grep "react-native" package.json | grep -o '"[0-9.]*"' | head -1 | tr -d '"')
        print_success "React Native version: $RN_VERSION"
    fi
    
    # Check for common problematic packages
    if grep -q "react-native-flipper" package.json; then
        print_info "Flipper detected - may cause build issues if NO_FLIPPER=1"
    fi
fi

# Check for metro bundler cache
if [ -d "$TMPDIR/metro-bundler-cache-*" ] 2>/dev/null; then
    print_info "Metro bundler cache exists"
    print_info "Clean with: rm -rf $TMPDIR/metro-*"
fi

# Check for haste map cache
if [ -d "$TMPDIR/haste-map-*" ] 2>/dev/null; then
    print_info "Haste map cache exists"
    print_info "Clean with: rm -rf $TMPDIR/haste-*"
fi

# ============================================================================
# Summary and Recommendations
# ============================================================================

print_header "Summary and Recommendations"

echo "If you're experiencing build issues, try these steps in order:"
echo ""
echo "1. ${CYAN}Close Xcode${NC}"
echo "   killall Xcode"
echo ""
echo "2. ${CYAN}Clean build artifacts${NC}"
echo "   rm -rf ~/Library/Developer/Xcode/DerivedData"
echo "   rm -rf ios/build ios/Pods ios/Podfile.lock"
echo ""
echo "3. ${CYAN}Clean npm${NC}"
echo "   rm -rf node_modules package-lock.json"
echo "   npm cache clean --force"
echo "   npm install"
echo ""
echo "4. ${CYAN}Reinstall pods${NC}"
echo "   cd ios && pod deintegrate && pod cache clean --all && pod install && cd .."
echo ""
echo "5. ${CYAN}Or run the automated fix script${NC}"
echo "   ./fix_all_build_issues.sh"
echo ""

print_header "Check Complete"

echo "For detailed fixes, see:"
echo "  - ${CYAN}QUICK_FIX.md${NC} - Quick reference"
echo "  - ${CYAN}FIX_BUILD_ERRORS.md${NC} - Detailed guide"
echo "  - ${CYAN}Podfile.recommended${NC} - Updated Podfile with all fixes"
echo ""
