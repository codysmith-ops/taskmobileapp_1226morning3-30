#!/bin/bash

# =============================================================================
# Enterprise iOS Compliance Pipeline - Preflight Checks
# =============================================================================
# Purpose: Hard-fail enforcement of toolchain, simulator, and scope isolation
# Author: Enterprise iOS Engineering Org
# Date: December 27, 2025
# =============================================================================

set -e  # Exit immediately on any error
set -u  # Exit on undefined variables

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Exit codes
EXIT_SUCCESS=0
EXIT_XCODE_VERSION_MISMATCH=1
EXIT_IOS_RUNTIME_MISSING=2
EXIT_SIMULATOR_MISSING=3
EXIT_ANDROID_REFS_FOUND=4
EXIT_WORKING_TREE_DIRTY=5
EXIT_ORIGIN_REMOTE_MISSING=6
EXIT_XCODE_SELECT_WRONG=7
EXIT_NODE_VERSION_MISMATCH=8

# =============================================================================
# HARD CONSTRAINTS (NON-NEGOTIABLE)
# =============================================================================
REQUIRED_XCODE_VERSION="15.4"
REQUIRED_XCODE_BUILD="15F31d"
REQUIRED_IOS_VERSION="17.5"
REQUIRED_SIMULATOR_NAME="iPhone 15"
REQUIRED_XCODE_PATH="/Applications/Xcode-15.4.app"
REQUIRED_NODE_MAJOR="18"

# =============================================================================
# Helper Functions
# =============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_fatal() {
    echo -e "${RED}[FATAL]${NC} $1"
    exit "$2"
}

# =============================================================================
# CHECK 1: Xcode Version (Hard Pin to 15.4)
# =============================================================================

check_xcode_version() {
    log_info "Checking Xcode version..."
    
    # Check xcode-select path
    local xcode_path
    xcode_path=$(xcode-select -p 2>/dev/null || echo "")
    
    if [[ ! "$xcode_path" =~ Xcode-15.4 ]]; then
        log_fatal "xcode-select not pointing to Xcode 15.4\\n  Current: $xcode_path\\n  Required: $REQUIRED_XCODE_PATH/Contents/Developer\\n  Fix: sudo xcode-select -s $REQUIRED_XCODE_PATH" $EXIT_XCODE_SELECT_WRONG
    fi
    
    # Check xcodebuild version
    local xcode_version
    xcode_version=$(xcodebuild -version 2>/dev/null | head -1 | awk '{print $2}' || echo "")
    
    if [[ "$xcode_version" != "$REQUIRED_XCODE_VERSION" ]]; then
        log_fatal "Xcode version mismatch\\n  Current: $xcode_version\\n  Required: $REQUIRED_XCODE_VERSION\\n  Fix: Install Xcode 15.4 and run: sudo xcode-select -s $REQUIRED_XCODE_PATH" $EXIT_XCODE_VERSION_MISMATCH
    fi
    
    # Check build version
    local build_version
    build_version=$(xcodebuild -version 2>/dev/null | grep "Build version" | awk '{print $3}' || echo "")
    
    if [[ "$build_version" != "$REQUIRED_XCODE_BUILD" ]]; then
        log_fatal "Xcode build version mismatch\\n  Current: $build_version\\n  Required: $REQUIRED_XCODE_BUILD" $EXIT_XCODE_VERSION_MISMATCH
    fi
    
    log_info "✅ Xcode $xcode_version (Build $build_version) verified"
}

# =============================================================================
# CHECK 2: iOS 17.5 Runtime
# =============================================================================

check_ios_runtime() {
    log_info "Checking iOS $REQUIRED_IOS_VERSION runtime..."
    
    local runtime_check
    runtime_check=$(xcrun simctl list runtimes | grep "iOS $REQUIRED_IOS_VERSION" || echo "")
    
    if [[ -z "$runtime_check" ]]; then
        log_fatal "iOS $REQUIRED_IOS_VERSION runtime not found\\n  Available runtimes:\\n$(xcrun simctl list runtimes | grep iOS)\\n  Fix: Download iOS $REQUIRED_IOS_VERSION runtime via Xcode > Settings > Platforms" $EXIT_IOS_RUNTIME_MISSING
    fi
    
    log_info "✅ iOS $REQUIRED_IOS_VERSION runtime verified"
}

# =============================================================================
# CHECK 3: iPhone 15 Simulator with iOS 17.5
# =============================================================================

check_simulator() {
    log_info "Checking $REQUIRED_SIMULATOR_NAME simulator with iOS $REQUIRED_IOS_VERSION..."
    
    # Check if device exists by parsing section after iOS version header
    local simulator_check
    simulator_check=$(xcrun simctl list devices | grep -A15 "^-- iOS $REQUIRED_IOS_VERSION --\$" | grep "    $REQUIRED_SIMULATOR_NAME (" || echo "")
    
    if [[ -z "$simulator_check" ]]; then
        log_fatal "$REQUIRED_SIMULATOR_NAME with iOS $REQUIRED_IOS_VERSION not found\\n  Available devices:\\n$(xcrun simctl list devices | grep '$REQUIRED_SIMULATOR_NAME')\\n  Fix: Create simulator via Xcode > Window > Devices and Simulators" $EXIT_SIMULATOR_MISSING
    fi
    
    log_info "✅ $REQUIRED_SIMULATOR_NAME (iOS $REQUIRED_IOS_VERSION) verified"
}

# =============================================================================
# CHECK 4: Android References in iOS Scope (ZERO TOLERANCE)
# =============================================================================

check_android_references() {
    log_info "Scanning for Android references in iOS scope files..."
    
    local ios_scope_files=(
        ".github/workflows"
        ".vscode"
        "scripts"
        "ios"
    )
    
    local android_violations=()
    
    for scope in "${ios_scope_files[@]}"; do
        if [[ -d "$scope" ]] || [[ -f "$scope" ]]; then
            # Search for Android-specific keywords (case-insensitive)
            local matches
            matches=$(rg -i --files-with-matches \
                -g '!*.lock' \
                -g '!*.log' \
                -g '!node_modules/*' \
                -g '!Pods/*' \
                '(run-android|android/|\.gradle|AndroidManifest|android\s*{|com\.android)' \
                "$scope" 2>/dev/null || echo "")
            
            if [[ -n "$matches" ]]; then
                android_violations+=("$scope: $matches")
            fi
        fi
    done
    
    if [[ ${#android_violations[@]} -gt 0 ]]; then
        log_error "Android references detected in iOS scope:"
        for violation in "${android_violations[@]}"; do
            log_error "  - $violation"
        done
        log_fatal "ZERO TOLERANCE: Remove all Android references from iOS scope files" $EXIT_ANDROID_REFS_FOUND
    fi
    
    log_info "✅ No Android references in iOS scope"
}

# =============================================================================
# CHECK 5: Working Tree Clean
# =============================================================================

check_working_tree() {
    log_info "Checking git working tree..."
    
    if [[ ! -d .git ]]; then
        log_fatal "Not a git repository. Run from project root." $EXIT_WORKING_TREE_DIRTY
    fi
    
    local status
    status=$(git status --porcelain 2>/dev/null || echo "ERROR")
    
    if [[ "$status" == "ERROR" ]]; then
        log_fatal "Git command failed. Ensure git is installed and working." $EXIT_WORKING_TREE_DIRTY
    fi
    
    if [[ -n "$status" ]]; then
        # In CI, enforce strictly. Locally, warn but allow.
        if [[ "${CI:-false}" == "true" ]] || [[ "${GITHUB_ACTIONS:-false}" == "true" ]]; then
            log_error "Working tree is dirty in CI environment:"
            git status --short
            log_fatal "CI requires clean working tree for reproducibility" $EXIT_WORKING_TREE_DIRTY
        else
            log_warn "Working tree has uncommitted changes (allowed locally):"
            git status --short | head -10
            log_warn "For reproducible builds, commit changes before audit"
        fi
    else
        log_info "✅ Working tree clean"
    fi
}

# =============================================================================
# CHECK 6: Node.js Version (Hard Pin to v18)
# =============================================================================

check_node_version() {
    log_info "Checking Node.js version..."
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        log_fatal "Node.js not found\\n  Fix: Install Node.js $REQUIRED_NODE_MAJOR (use nvm or volta)" $EXIT_NODE_VERSION_MISMATCH
    fi
    
    # Get node version
    local node_version
    node_version=$(node -v 2>/dev/null | sed 's/v//' || echo "")
    
    # Extract major version
    local node_major
    node_major=$(echo "$node_version" | cut -d. -f1)
    
    if [[ "$node_major" != "$REQUIRED_NODE_MAJOR" ]]; then
        log_fatal "Node.js version mismatch\\n  Current: v$node_version (major: $node_major)\\n  Required: v$REQUIRED_NODE_MAJOR.x\\n  Fix: Use 'nvm use' or 'volta pin node@18' to switch to Node 18" $EXIT_NODE_VERSION_MISMATCH
    fi
    
    # Get npm version for info
    local npm_version
    npm_version=$(npm -v 2>/dev/null || echo "unknown")
    
    log_info "✅ Node.js v$node_version (npm v$npm_version) verified"
}

# =============================================================================
# CHECK 7: Origin Remote Exists
# =============================================================================

check_origin_remote() {
    log_info "Checking origin remote..."
    
    local origin
    origin=$(git remote get-url origin 2>/dev/null || echo "")
    
    if [[ -z "$origin" ]]; then
        log_fatal "Origin remote not configured\\n  Fix: git remote add origin <URL>" $EXIT_ORIGIN_REMOTE_MISSING
    fi
    
    # Redact URL to avoid exposing credentials
    local safe_origin
    safe_origin=$(echo "$origin" | sed -E 's|(https?://)[^@]+@|\1***@|')
    
    log_info "✅ Origin remote: $safe_origin"
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    echo ""
    echo "========================================================================="
    echo "  Enterprise iOS Compliance Pipeline - Preflight Checks"
    echo "========================================================================="
    echo ""
    
    check_xcode_version
    check_ios_runtime
    check_simulator
    check_android_references
    check_working_tree
    check_node_version
    check_origin_remote
    
    echo ""
    echo "========================================================================="
    log_info "✅ ALL PREFLIGHT CHECKS PASSED"
    echo "========================================================================="
    echo ""
    
    exit $EXIT_SUCCESS
}

# Run main function
main "$@"

