#!/bin/bash

# Bundle React Native code and images - FIXED VERSION
# This version includes proper output dependencies to silence warnings

set -e

WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"

# Output files - Add these to your Xcode build phase "Output Files" section:
# ${DERIVED_FILE_DIR}/main.jsbundle
# ${DERIVED_FILE_DIR}/main.jsbundle.map

# Instructions for adding in Xcode:
# 1. Open your project in Xcode
# 2. Select your target → Build Phases
# 3. Find "Bundle React Native code and images" script phase
# 4. Expand "Output Files" section
# 5. Add the two output file paths above
