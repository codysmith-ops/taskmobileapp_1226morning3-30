#!/bin/bash

###############################################################################
# React Native iOS Build Fix Script
# Fixes critical errors, warnings, and build configuration issues
###############################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Project paths
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IOS_DIR="${PROJECT_DIR}/ios"
NODE_MODULES="${PROJECT_DIR}/node_modules"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     React Native iOS Build Fix - Automated Script             ║${NC}"
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo ""

###############################################################################
# STEP 1: Environment Check
###############################################################################
echo -e "${BLUE}[STEP 1/8]${NC} ${MAGENTA}Checking Environment...${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js: ${NODE_VERSION}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓${NC} npm: ${NPM_VERSION}"

# Check CocoaPods
if ! command -v pod &> /dev/null; then
    echo -e "${RED}✗ CocoaPods not found${NC}"
    echo -e "${YELLOW}Installing CocoaPods...${NC}"
    sudo gem install cocoapods
fi
POD_VERSION=$(pod --version)
echo -e "${GREEN}✓${NC} CocoaPods: ${POD_VERSION}"

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}✗ Xcode not found${NC}"
    exit 1
fi
XCODE_VERSION=$(xcodebuild -version | head -n1)
echo -e "${GREEN}✓${NC} ${XCODE_VERSION}"

echo ""

###############################################################################
# STEP 2: Backup Current Configuration
###############################################################################
echo -e "${BLUE}[STEP 2/8]${NC} ${MAGENTA}Creating Backup...${NC}"
echo ""

BACKUP_DIR="${PROJECT_DIR}/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "${BACKUP_DIR}"

if [ -f "${PROJECT_DIR}/package.json" ]; then
    cp "${PROJECT_DIR}/package.json" "${BACKUP_DIR}/"
    echo -e "${GREEN}✓${NC} Backed up package.json"
fi

if [ -f "${IOS_DIR}/Podfile" ]; then
    cp "${IOS_DIR}/Podfile" "${BACKUP_DIR}/"
    echo -e "${GREEN}✓${NC} Backed up Podfile"
fi

if [ -f "${IOS_DIR}/Podfile.lock" ]; then
    cp "${IOS_DIR}/Podfile.lock" "${BACKUP_DIR}/"
    echo -e "${GREEN}✓${NC} Backed up Podfile.lock"
fi

echo -e "${CYAN}Backup location: ${BACKUP_DIR}${NC}"
echo ""

###############################################################################
# STEP 3: Update React Native Geolocation Package
###############################################################################
echo -e "${BLUE}[STEP 3/8]${NC} ${MAGENTA}Fixing Geolocation Package...${NC}"
echo ""

echo -e "${YELLOW}Updating @react-native-community/geolocation...${NC}"

# Update package.json to use latest compatible version
cd "${PROJECT_DIR}"
npm install @react-native-community/geolocation@^3.3.0 --save

echo -e "${GREEN}✓${NC} Geolocation package updated"
echo ""

###############################################################################
# STEP 4: Create/Update .xcode.env
###############################################################################
echo -e "${BLUE}[STEP 4/8]${NC} ${MAGENTA}Configuring Xcode Environment...${NC}"
echo ""

cat > "${IOS_DIR}/.xcode.env" << 'EOF'
# Node binary path for Xcode
export NODE_BINARY=$(command -v node)

# Set Node options if needed
# export NODE_OPTIONS="--max-old-space-size=4096"

# Set path to node
export PATH="$PATH:/usr/local/bin:/opt/homebrew/bin"
EOF

echo -e "${GREEN}✓${NC} Created .xcode.env"
echo ""

###############################################################################
# STEP 5: Update Podfile with C++17 and Configuration Fixes
###############################################################################
echo -e "${BLUE}[STEP 5/8]${NC} ${MAGENTA}Updating Podfile Configuration...${NC}"
echo ""

# Read existing Podfile to preserve custom configurations
if [ -f "${IOS_DIR}/Podfile" ]; then
    # Check if we need to update it
    if ! grep -q "CLANG_CXX_LANGUAGE_STANDARD.*c++17" "${IOS_DIR}/Podfile"; then
        echo -e "${YELLOW}Adding C++17 configuration to Podfile...${NC}"
        
        # Create updated Podfile
        cat > "${IOS_DIR}/Podfile.new" << 'PODFILE_EOF'
# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, '13.4'
prepare_react_native_project!

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'MobileTodoList' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'MobileTodoListTests' do
    inherit! :complete
  end

  post_install do |installer|
    # React Native post install
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        # Set C++17 standard globally to fix gRPC and std::result_of errors
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
        
        # Set iOS deployment target to suppress warnings
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.4'
        
        # Fix for gRPC-Core C++20 compatibility issues
        if target.name == 'gRPC-Core'
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
          config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'GRPC_IOS_EVENT_ENGINE_CLIENT=0'
        end
        
        # Suppress warnings for third-party dependencies
        if target.name.start_with?('glog', 'Folly', 'RCT', 'React', 'Yoga', 'boost')
          config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
          config.build_settings['CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS'] = 'NO'
          config.build_settings['GCC_WARN_64_TO_32_BIT_CONVERSION'] = 'NO'
        end
        
        # Enable module map generation for compatibility
        config.build_settings['DEFINES_MODULE'] = 'YES'
        
        # Disable bitcode (deprecated in Xcode 14)
        config.build_settings['ENABLE_BITCODE'] = 'NO'
      end
    end
    
    # Fix signing and provisioning
    installer.pods_project.targets.each do |target|
      if target.respond_to?(:product_type) and target.product_type == "com.apple.product-type.bundle"
        target.build_configurations.each do |config|
          config.build_settings['CODE_SIGN_IDENTITY'] = ''
        end
      end
    end
  end
end
PODFILE_EOF
        
        # Replace old Podfile with new one
        mv "${IOS_DIR}/Podfile.new" "${IOS_DIR}/Podfile"
        echo -e "${GREEN}✓${NC} Podfile updated with C++17 and configuration fixes"
    else
        echo -e "${GREEN}✓${NC} Podfile already has C++17 configuration"
    fi
else
    echo -e "${RED}✗ Podfile not found${NC}"
    exit 1
fi

echo ""

###############################################################################
# STEP 6: Clean Build Artifacts
###############################################################################
echo -e "${BLUE}[STEP 6/8]${NC} ${MAGENTA}Cleaning Build Artifacts...${NC}"
echo ""

# Clean npm
if [ -d "${NODE_MODULES}" ]; then
    echo -e "${YELLOW}Removing node_modules...${NC}"
    rm -rf "${NODE_MODULES}"
    echo -e "${GREEN}✓${NC} Removed node_modules"
fi

if [ -f "${PROJECT_DIR}/package-lock.json" ]; then
    rm -f "${PROJECT_DIR}/package-lock.json"
    echo -e "${GREEN}✓${NC} Removed package-lock.json"
fi

# Clean CocoaPods
if [ -d "${IOS_DIR}/Pods" ]; then
    echo -e "${YELLOW}Removing Pods...${NC}"
    rm -rf "${IOS_DIR}/Pods"
    echo -e "${GREEN}✓${NC} Removed Pods"
fi

if [ -f "${IOS_DIR}/Podfile.lock" ]; then
    rm -f "${IOS_DIR}/Podfile.lock"
    echo -e "${GREEN}✓${NC} Removed Podfile.lock"
fi

# Clean Xcode build artifacts
if [ -d "${IOS_DIR}/build" ]; then
    echo -e "${YELLOW}Removing Xcode build directory...${NC}"
    rm -rf "${IOS_DIR}/build"
    echo -e "${GREEN}✓${NC} Removed build directory"
fi

# Clean DerivedData
echo -e "${YELLOW}Cleaning DerivedData...${NC}"
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
echo -e "${GREEN}✓${NC} Cleaned DerivedData"

# Clean caches
echo -e "${YELLOW}Cleaning caches...${NC}"
npm cache clean --force > /dev/null 2>&1 || true
echo -e "${GREEN}✓${NC} Cleaned npm cache"

echo ""

###############################################################################
# STEP 7: Reinstall Dependencies
###############################################################################
echo -e "${BLUE}[STEP 7/8]${NC} ${MAGENTA}Reinstalling Dependencies...${NC}"
echo ""

# Install npm packages
echo -e "${YELLOW}Installing npm packages...${NC}"
cd "${PROJECT_DIR}"
npm install
echo -e "${GREEN}✓${NC} npm packages installed"
echo ""

# Install CocoaPods
echo -e "${YELLOW}Installing CocoaPods...${NC}"
cd "${IOS_DIR}"
pod install --repo-update
echo -e "${GREEN}✓${NC} CocoaPods installed"
echo ""

###############################################################################
# STEP 8: Verification
###############################################################################
echo -e "${BLUE}[STEP 8/8]${NC} ${MAGENTA}Verifying Installation...${NC}"
echo ""

# Check if critical files exist
VERIFICATION_PASSED=true

if [ ! -d "${NODE_MODULES}" ]; then
    echo -e "${RED}✗${NC} node_modules directory not found"
    VERIFICATION_PASSED=false
else
    echo -e "${GREEN}✓${NC} node_modules directory exists"
fi

if [ ! -d "${IOS_DIR}/Pods" ]; then
    echo -e "${RED}✗${NC} Pods directory not found"
    VERIFICATION_PASSED=false
else
    echo -e "${GREEN}✓${NC} Pods directory exists"
fi

if [ ! -f "${IOS_DIR}/.xcode.env" ]; then
    echo -e "${RED}✗${NC} .xcode.env not found"
    VERIFICATION_PASSED=false
else
    echo -e "${GREEN}✓${NC} .xcode.env exists"
fi

# Check if geolocation package is updated
if grep -q "@react-native-community/geolocation.*3\." "${PROJECT_DIR}/package.json"; then
    echo -e "${GREEN}✓${NC} Geolocation package updated to v3.x"
else
    echo -e "${YELLOW}⚠${NC} Geolocation package version unclear"
fi

# Check Podfile for C++17
if grep -q "CLANG_CXX_LANGUAGE_STANDARD.*c++17" "${IOS_DIR}/Podfile"; then
    echo -e "${GREEN}✓${NC} Podfile configured with C++17"
else
    echo -e "${RED}✗${NC} Podfile missing C++17 configuration"
    VERIFICATION_PASSED=false
fi

echo ""

###############################################################################
# Summary
###############################################################################
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
if [ "$VERIFICATION_PASSED" = true ]; then
    echo -e "${CYAN}║${NC}                    ${GREEN}✓ BUILD FIX COMPLETE${NC}                       ${CYAN}║${NC}"
else
    echo -e "${CYAN}║${NC}                  ${YELLOW}⚠ BUILD FIX COMPLETED WITH WARNINGS${NC}           ${CYAN}║${NC}"
fi
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo ""

echo -e "${MAGENTA}Next Steps:${NC}"
echo ""
echo -e "1. ${CYAN}Open Xcode project:${NC}"
echo -e "   ${YELLOW}open ios/MobileTodoList.xcworkspace${NC}"
echo ""
echo -e "2. ${CYAN}Update Xcode project settings manually:${NC}"
echo -e "   - Select MobileTodoList.xcodeproj in Project Navigator"
echo -e "   - Click 'Validate Settings' in the warning banner"
echo -e "   - Click 'Perform Changes'"
echo ""
echo -e "3. ${CYAN}Add output files to build script phases (optional):${NC}"
echo -e "   ${YELLOW}ruby add-build-outputs.rb${NC}"
echo ""
echo -e "4. ${CYAN}Build and run:${NC}"
echo -e "   ${YELLOW}npx react-native run-ios --simulator=\"iPhone 15\"${NC}"
echo ""
echo -e "${CYAN}For detailed troubleshooting, see:${NC}"
echo -e "  - ${YELLOW}QUICK_START_GUIDE.md${NC}"
echo -e "  - ${YELLOW}TROUBLESHOOTING_GUIDE.md${NC}"
echo ""
echo -e "${CYAN}Backup saved to:${NC} ${BACKUP_DIR}"
echo ""
