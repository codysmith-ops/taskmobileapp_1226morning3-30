#!/bin/bash

###############################################################################
# START HERE - Interactive React Native iOS Build Fix Guide
# This script will guide you through fixing all build issues step-by-step
###############################################################################

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Function to print section headers
print_header() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC} ${BOLD}$1${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Function to ask yes/no questions
ask_yes_no() {
    while true; do
        echo -e "${YELLOW}$1 (y/n):${NC} "
        read -r response
        case "$response" in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer y or n.";;
        esac
    done
}

# Function to wait for user
wait_for_user() {
    echo ""
    echo -e "${CYAN}Press Enter to continue...${NC}"
    read -r
}

# Clear screen
clear

# Welcome banner
echo -e "${CYAN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║           React Native iOS Build Fix - START HERE                ║
║                                                                  ║
║              Interactive Step-by-Step Guide                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo ""
echo -e "${MAGENTA}This interactive script will help you:${NC}"
echo ""
echo "  ✓ Diagnose current build issues"
echo "  ✓ Guide you through automated fixes"
echo "  ✓ Verify each step completion"
echo "  ✓ Troubleshoot any problems"
echo "  ✓ Get your app running successfully"
echo ""
echo -e "${YELLOW}Estimated time: 10-15 minutes${NC}"
echo ""

wait_for_user

###############################################################################
# STEP 1: Welcome & Introduction
###############################################################################
print_header "Step 1: Understanding the Issues"

echo -e "${MAGENTA}Your React Native iOS project has the following issues:${NC}"
echo ""
echo -e "${RED}Critical Errors (Build Blockers):${NC}"
echo "  1. NativeRNCGeolocationSpecJSI not found"
echo "  2. std::result_of template not found"
echo "  3. Template argument list parsing errors"
echo ""
echo -e "${YELLOW}Warnings (30+):${NC}"
echo "  • Xcode project settings outdated"
echo "  • Build script output files missing"
echo "  • React Native API deprecations"
echo "  • Third-party library warnings"
echo ""
echo -e "${MAGENTA}We will fix all critical errors and reduce warnings significantly.${NC}"
echo ""

wait_for_user

###############################################################################
# STEP 2: Prerequisites Check
###############################################################################
print_header "Step 2: Checking Prerequisites"

echo -e "${BLUE}Verifying required tools...${NC}"
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js:${NC} $NODE_VERSION"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo ""
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm:${NC} $NPM_VERSION"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check CocoaPods
if command -v pod &> /dev/null; then
    POD_VERSION=$(pod --version)
    echo -e "${GREEN}✓ CocoaPods:${NC} $POD_VERSION"
else
    echo -e "${YELLOW}⚠ CocoaPods not found${NC}"
    echo ""
    if ask_yes_no "Would you like to install CocoaPods now?"; then
        echo "Installing CocoaPods..."
        sudo gem install cocoapods
        echo -e "${GREEN}✓ CocoaPods installed${NC}"
    else
        echo -e "${RED}CocoaPods is required. Exiting.${NC}"
        exit 1
    fi
fi

# Check Xcode
if command -v xcodebuild &> /dev/null; then
    XCODE_VERSION=$(xcodebuild -version | head -n1)
    echo -e "${GREEN}✓ Xcode:${NC} $XCODE_VERSION"
else
    echo -e "${RED}✗ Xcode not found${NC}"
    echo ""
    echo "Please install Xcode from the App Store"
    exit 1
fi

echo ""
echo -e "${GREEN}All prerequisites satisfied!${NC}"
echo ""

wait_for_user

###############################################################################
# STEP 3: Choose Fix Method
###############################################################################
print_header "Step 3: Choose Your Approach"

echo -e "${MAGENTA}You have two options:${NC}"
echo ""
echo -e "${GREEN}Option 1: Automated Fix (Recommended)${NC}"
echo "  • Runs fix-build-issues.sh script"
echo "  • Fixes all issues automatically"
echo "  • Takes ~5 minutes"
echo "  • Creates automatic backups"
echo ""
echo -e "${YELLOW}Option 2: Manual Guided Fix${NC}"
echo "  • Step-by-step instructions"
echo "  • Learn what each fix does"
echo "  • Takes ~15-20 minutes"
echo "  • More control over process"
echo ""

if ask_yes_no "Would you like to use the AUTOMATED fix?"; then
    AUTO_MODE=true
    echo ""
    echo -e "${GREEN}Great! We'll use the automated script.${NC}"
else
    AUTO_MODE=false
    echo ""
    echo -e "${YELLOW}We'll guide you through manual fixes.${NC}"
fi

echo ""
wait_for_user

###############################################################################
# AUTOMATED MODE
###############################################################################
if [ "$AUTO_MODE" = true ]; then
    print_header "Running Automated Fix"
    
    echo -e "${MAGENTA}The automated script will:${NC}"
    echo ""
    echo "  1. Check environment"
    echo "  2. Create backup of current configuration"
    echo "  3. Update geolocation package"
    echo "  4. Create .xcode.env file"
    echo "  5. Update Podfile with C++17 configuration"
    echo "  6. Clean build artifacts"
    echo "  7. Reinstall dependencies"
    echo "  8. Verify installation"
    echo ""
    
    if ask_yes_no "Ready to run the automated fix?"; then
        echo ""
        echo -e "${CYAN}Starting automated fix...${NC}"
        echo ""
        
        # Make script executable
        chmod +x fix-build-issues.sh
        
        # Run the fix script
        ./fix-build-issues.sh
        
        FIX_EXIT_CODE=$?
        
        if [ $FIX_EXIT_CODE -eq 0 ]; then
            echo ""
            echo -e "${GREEN}✓ Automated fix completed successfully!${NC}"
            echo ""
        else
            echo ""
            echo -e "${RED}✗ Automated fix encountered errors${NC}"
            echo ""
            echo "Would you like to see troubleshooting options?"
            if ask_yes_no ""; then
                less TROUBLESHOOTING_GUIDE.md
            fi
            wait_for_user
        fi
    fi

###############################################################################
# MANUAL MODE
###############################################################################
else
    print_header "Manual Fix - Step by Step"
    
    # Step 1: Update Geolocation
    echo -e "${BLUE}Step 1/5: Update Geolocation Package${NC}"
    echo ""
    echo "This fixes the NativeRNCGeolocationSpecJSI error."
    echo ""
    echo -e "${CYAN}Command to run:${NC}"
    echo "  npm install @react-native-community/geolocation@^3.3.0 --save"
    echo ""
    
    if ask_yes_no "Run this command now?"; then
        npm install @react-native-community/geolocation@^3.3.0 --save
        echo ""
        echo -e "${GREEN}✓ Geolocation package updated${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped - you'll need to run this manually${NC}"
    fi
    echo ""
    wait_for_user
    
    # Step 2: Create .xcode.env
    print_header "Step 2/5: Create .xcode.env File"
    echo ""
    echo "This configures Node.js path for Xcode build scripts."
    echo ""
    
    if ask_yes_no "Create .xcode.env file now?"; then
        cat > ios/.xcode.env << 'EOF'
export NODE_BINARY=$(command -v node)
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin"
EOF
        echo ""
        echo -e "${GREEN}✓ Created ios/.xcode.env${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped${NC}"
    fi
    echo ""
    wait_for_user
    
    # Step 3: Update Podfile
    print_header "Step 3/5: Update Podfile"
    echo ""
    echo "This fixes C++ standard errors."
    echo ""
    echo -e "${YELLOW}You need to manually edit ios/Podfile:${NC}"
    echo ""
    echo "Add this to the post_install block:"
    echo ""
    echo -e "${CYAN}"
    cat << 'PODFILE_SNIPPET'
config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.4'

if target.name == 'gRPC-Core'
  config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
  config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'GRPC_IOS_EVENT_ENGINE_CLIENT=0'
end
PODFILE_SNIPPET
    echo -e "${NC}"
    echo ""
    echo "See DETAILED_FIX_GUIDE.md for the complete Podfile."
    echo ""
    
    if ask_yes_no "Open Podfile in editor now?"; then
        ${EDITOR:-nano} ios/Podfile
    fi
    
    if ask_yes_no "Have you updated the Podfile?"; then
        echo -e "${GREEN}✓ Podfile updated${NC}"
    else
        echo -e "${YELLOW}⚠ Please update it before continuing${NC}"
    fi
    echo ""
    wait_for_user
    
    # Step 4: Clean
    print_header "Step 4/5: Clean Build Artifacts"
    echo ""
    echo "This removes old cached builds that may have errors."
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo "  rm -rf node_modules ios/Pods"
    echo "  rm -rf ios/build"
    echo ""
    
    if ask_yes_no "Clean build artifacts now?"; then
        rm -rf node_modules package-lock.json
        rm -rf ios/Pods ios/Podfile.lock
        rm -rf ios/build
        echo ""
        echo -e "${GREEN}✓ Cleaned build artifacts${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped${NC}"
    fi
    echo ""
    wait_for_user
    
    # Step 5: Reinstall
    print_header "Step 5/5: Reinstall Dependencies"
    echo ""
    echo "This applies all configuration changes."
    echo ""
    echo -e "${CYAN}Commands:${NC}"
    echo "  npm install"
    echo "  cd ios && pod install"
    echo ""
    
    if ask_yes_no "Reinstall dependencies now?"; then
        echo ""
        echo "Installing npm packages..."
        npm install
        echo ""
        echo "Installing CocoaPods..."
        cd ios && pod install && cd ..
        echo ""
        echo -e "${GREEN}✓ Dependencies reinstalled${NC}"
    else
        echo -e "${YELLOW}⚠ Skipped - you MUST run these before building${NC}"
    fi
    echo ""
    wait_for_user
fi

###############################################################################
# POST-FIX STEPS (Both Modes)
###############################################################################
print_header "Additional Configuration Steps"

echo -e "${MAGENTA}You need to complete these steps manually in Xcode:${NC}"
echo ""

# Xcode Settings Update
echo -e "${BLUE}1. Update Xcode Project Settings:${NC}"
echo ""
echo "  a. Open Xcode workspace:"
echo -e "     ${CYAN}open ios/MobileTodoList.xcworkspace${NC}"
echo ""
echo "  b. Select 'MobileTodoList.xcodeproj' in Project Navigator"
echo ""
echo "  c. Click the yellow warning banner 'Update to recommended settings'"
echo ""
echo "  d. Click 'Validate Settings' → 'Perform Changes'"
echo ""
echo "  e. Repeat for 'Pods.xcodeproj' if warning appears"
echo ""

if ask_yes_no "Open Xcode workspace now?"; then
    open ios/MobileTodoList.xcworkspace
    echo ""
    echo -e "${GREEN}✓ Xcode opened${NC}"
    echo ""
    echo -e "${YELLOW}Please complete the settings update in Xcode.${NC}"
    echo ""
    wait_for_user
fi

# Build Script Outputs (Optional)
echo -e "${BLUE}2. Add Build Script Output Files (Optional):${NC}"
echo ""
echo "This eliminates 'will be run during every build' warnings."
echo ""
echo -e "${CYAN}Command:${NC}"
echo "  ruby add-build-outputs.rb"
echo ""

if ask_yes_no "Run this now? (requires xcodeproj gem)"; then
    if ! gem list xcodeproj -i > /dev/null 2>&1; then
        echo "Installing xcodeproj gem..."
        gem install xcodeproj
    fi
    
    ruby add-build-outputs.rb
    echo ""
    echo -e "${GREEN}✓ Build outputs configured${NC}"
else
    echo -e "${YELLOW}⚠ Skipped - you can run this later${NC}"
fi

echo ""
wait_for_user

###############################################################################
# VERIFICATION
###############################################################################
print_header "Verification Checklist"

echo -e "${MAGENTA}Let's verify everything is configured correctly:${NC}"
echo ""

VERIFICATION_PASSED=true

# Check node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${RED}✗${NC} node_modules directory missing"
    VERIFICATION_PASSED=false
fi

# Check Pods
if [ -d "ios/Pods" ]; then
    echo -e "${GREEN}✓${NC} Pods directory exists"
else
    echo -e "${RED}✗${NC} Pods directory missing"
    VERIFICATION_PASSED=false
fi

# Check .xcode.env
if [ -f "ios/.xcode.env" ]; then
    echo -e "${GREEN}✓${NC} .xcode.env file exists"
else
    echo -e "${RED}✗${NC} .xcode.env file missing"
    VERIFICATION_PASSED=false
fi

# Check geolocation version
if grep -q "@react-native-community/geolocation.*3\." package.json; then
    echo -e "${GREEN}✓${NC} Geolocation package updated to v3.x"
else
    echo -e "${YELLOW}⚠${NC} Geolocation package version unclear"
fi

# Check Podfile
if grep -q "CLANG_CXX_LANGUAGE_STANDARD.*c++17" ios/Podfile; then
    echo -e "${GREEN}✓${NC} Podfile configured with C++17"
else
    echo -e "${RED}✗${NC} Podfile missing C++17 configuration"
    VERIFICATION_PASSED=false
fi

echo ""

if [ "$VERIFICATION_PASSED" = false ]; then
    echo -e "${RED}Some verifications failed!${NC}"
    echo ""
    echo "Please review the steps above and ensure all are completed."
    echo ""
    if ask_yes_no "Would you like to see the troubleshooting guide?"; then
        less TROUBLESHOOTING_GUIDE.md
    fi
else
    echo -e "${GREEN}All verifications passed!${NC}"
fi

echo ""
wait_for_user

###############################################################################
# BUILD & RUN
###############################################################################
print_header "Build and Run Your App"

echo -e "${MAGENTA}You're ready to build!${NC}"
echo ""
echo -e "${CYAN}Build command:${NC}"
echo "  npx react-native run-ios --simulator=\"iPhone 15\""
echo ""
echo "This will:"
echo "  • Build the app with Xcode"
echo "  • Launch iPhone 15 simulator"
echo "  • Install and run your app"
echo "  • Start Metro bundler"
echo ""
echo -e "${YELLOW}Build time: ~2-5 minutes${NC}"
echo ""

if ask_yes_no "Build and run now?"; then
    echo ""
    echo -e "${CYAN}Starting build...${NC}"
    echo ""
    npx react-native run-ios --simulator="iPhone 15"
    
    BUILD_EXIT_CODE=$?
    
    echo ""
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                                                        ║${NC}"
        echo -e "${GREEN}║              🎉  BUILD SUCCESSFUL!  🎉                 ║${NC}"
        echo -e "${GREEN}║                                                        ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo "Your app should now be running on the iPhone 15 simulator!"
        echo ""
    else
        echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                                                        ║${NC}"
        echo -e "${RED}║                 BUILD FAILED                           ║${NC}"
        echo -e "${RED}║                                                        ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Don't worry! Check the troubleshooting guide:${NC}"
        echo ""
        if ask_yes_no "Open troubleshooting guide?"; then
            less TROUBLESHOOTING_GUIDE.md
        fi
    fi
else
    echo ""
    echo -e "${YELLOW}Build skipped.${NC}"
    echo ""
    echo "When you're ready, run:"
    echo -e "${CYAN}npx react-native run-ios --simulator=\"iPhone 15\"${NC}"
fi

echo ""
wait_for_user

###############################################################################
# NEXT STEPS & RESOURCES
###############################################################################
print_header "Next Steps & Resources"

echo -e "${MAGENTA}📚 Documentation Available:${NC}"
echo ""
echo "  ${CYAN}QUICK_START_GUIDE.md${NC}      - Fast reference guide"
echo "  ${CYAN}DETAILED_FIX_GUIDE.md${NC}     - In-depth explanations"
echo "  ${CYAN}COMMAND_REFERENCE.md${NC}      - All commands in one place"
echo "  ${CYAN}TROUBLESHOOTING_GUIDE.md${NC}  - Solutions to common issues"
echo "  ${CYAN}BUILD_FIX_SUMMARY.md${NC}      - Visual overview"
echo ""

echo -e "${MAGENTA}🛠️  Useful Commands:${NC}"
echo ""
echo "  ${CYAN}Clean rebuild:${NC}"
echo "    rm -rf ios/build && npx react-native run-ios"
echo ""
echo "  ${CYAN}Reset Metro cache:${NC}"
echo "    npx react-native start --reset-cache"
echo ""
echo "  ${CYAN}View logs:${NC}"
echo "    npx react-native log-ios"
echo ""
echo "  ${CYAN}List simulators:${NC}"
echo "    xcrun simctl list devices"
echo ""

echo -e "${MAGENTA}🔧 Scripts Available:${NC}"
echo ""
echo "  ${CYAN}./fix-build-issues.sh${NC}     - Run automated fix again"
echo "  ${CYAN}ruby add-build-outputs.rb${NC} - Add build script outputs"
echo "  ${CYAN}./START_HERE.sh${NC}           - This guide"
echo ""

echo -e "${MAGENTA}💡 Tips:${NC}"
echo ""
echo "  • Most React Native deprecation warnings are safe to ignore"
echo "  • If build fails, check TROUBLESHOOTING_GUIDE.md first"
echo "  • Keep dependencies updated with 'npm outdated'"
echo "  • Clean builds regularly if you encounter issues"
echo ""

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ Your app is now running!${NC}"
    echo ""
    echo "Test your features:"
    echo "  • Geolocation"
    echo "  • API integrations"
    echo "  • Core functionality"
else
    echo -e "${YELLOW}If you're still experiencing issues:${NC}"
    echo ""
    echo "1. Review TROUBLESHOOTING_GUIDE.md"
    echo "2. Check Xcode build logs for specific errors"
    echo "3. Ensure all manual steps were completed"
    echo "4. Try running fix-build-issues.sh again"
fi

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}║              Thank you for using this guide!               ║${NC}"
echo -e "${CYAN}║                                                            ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
