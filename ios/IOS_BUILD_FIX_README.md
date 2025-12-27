# iOS Build Fixes for MobileTodoList

## Issues Fixed

This solution addresses the following build errors and warnings:

1. ❌ **ERROR**: gRPC-Core template argument list error
2. ⚠️ Run script build phase warnings (React Native bundler, RNFB Config, Hermes)
3. ⚠️ Firebase `@_implementationOnly` warning
4. ⚠️ fmt library `char_traits` deprecation warning
5. ⚠️ leveldb `mmap` argument warning

---

## Automatic Fix (Recommended)

### Option 1: Run the Fix Script

1. Make the script executable:
   ```bash
   chmod +x fix_ios_build.sh
   ```

2. Run the script:
   ```bash
   ./fix_ios_build.sh
   ```

3. Open Xcode and rebuild:
   - Open `ios/MobileTodoList.xcworkspace` (NOT .xcodeproj)
   - Press `Cmd + Shift + K` to clean
   - Press `Cmd + B` to build

---

## Manual Fix Instructions

If the automatic script doesn't work, follow these steps:

### Step 1: Update Podfile

Replace your `ios/Podfile` with the content from `Podfile_FIXED`, or manually add these changes:

#### Add before `target 'MobileTodoList' do`:
```ruby
$RNFirebaseAsStaticFramework = true
```

#### Add after `use_react_native!` block:
```ruby
# Fix gRPC-Core template error by forcing compatible version
pod 'gRPC-Core', '1.44.0', :modular_headers => false
pod 'gRPC-C++', '1.44.0', :modular_headers => false

# Ensure compatible Firebase versions
pod 'Firebase/Core', '~> 10.20.0'
pod 'Firebase/Auth'
pod 'Firebase/Firestore'
pod 'Firebase/Storage'
```

#### Update `post_install` block:

Add this inside the `post_install do |installer|` block:

```ruby
# Fix for gRPC-Core and other C++ compilation issues
installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
    # Fix C++ language standard
    config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
    config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
    
    # Fix deployment target warnings
    config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
    
    # Disable some warnings for third-party code
    config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
    config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
    
    # Fix for template issues in gRPC
    if target.name == 'gRPC-Core' || target.name == 'gRPC-C++'
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++17'
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS=0'
    end
  end
end

# Fix Run Script warnings by adding output files
installer.pods_project.targets.each do |target|
  target.build_phases.each do |phase|
    if phase.is_a?(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
      if phase.name&.include?('Bundle React Native code')
        phase.output_paths = [
          '$(DERIVED_FILE_DIR)/main.jsbundle',
          '$(DERIVED_FILE_DIR)/main.jsbundle.map'
        ] if phase.output_paths.empty?
      elsif phase.name&.include?('[RNFB] Core Configuration')
        phase.output_paths = [
          '$(DERIVED_FILE_DIR)/rnfb-config-output.txt'
        ] if phase.output_paths.empty?
      elsif phase.name&.include?('Hermes')
        phase.output_paths = [
          '$(DERIVED_FILE_DIR)/hermes-replacement-output.txt'
        ] if phase.output_paths.empty?
      end
    end
  end
end
```

### Step 2: Clean and Reinstall Pods

```bash
cd ios
pod cache clean --all
rm -rf Pods
rm -rf build
rm Podfile.lock
pod install --repo-update
cd ..
```

### Step 3: Clean Xcode Build

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/MobileTodoList-*
rm -rf ios/build
```

### Step 4: Rebuild in Xcode

1. Open `ios/MobileTodoList.xcworkspace`
2. Product → Clean Build Folder (Cmd + Shift + K)
3. Product → Build (Cmd + B)

---

## What Each Fix Does

### 1. gRPC-Core Version Lock
**Problem**: The latest gRPC-Core has template syntax incompatible with your Xcode/C++ compiler version.

**Solution**: Forces gRPC-Core to use version 1.44.0, which is stable and compatible.

```ruby
pod 'gRPC-Core', '1.44.0', :modular_headers => false
```

### 2. C++ Language Standard
**Problem**: Template code requires specific C++ standard support.

**Solution**: Sets C++17 standard with GNU extensions for gRPC:

```ruby
config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++17'
```

### 3. Run Script Output Paths
**Problem**: Xcode doesn't know when to re-run build scripts.

**Solution**: Adds output file paths so Xcode can track dependencies:

```ruby
phase.output_paths = ['$(DERIVED_FILE_DIR)/main.jsbundle']
```

### 4. Firebase Static Framework
**Problem**: `@_implementationOnly` causes instability without library evolution.

**Solution**: Builds Firebase as static framework:

```ruby
$RNFirebaseAsStaticFramework = true
```

### 5. Warning Suppression
**Problem**: Third-party libraries have deprecation warnings you can't fix.

**Solution**: Disables warnings for pods you don't control:

```ruby
config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
```

---

## Troubleshooting

### If you still get the gRPC error:

Try an alternative version:
```bash
cd ios
pod update gRPC-Core
pod install
```

Or try version 1.50.0:
```ruby
pod 'gRPC-Core', '1.50.0', :modular_headers => false
```

### If Firebase warnings persist:

Update to the latest:
```bash
cd ios
pod update Firebase
pod install
```

### If build still fails:

1. Check your Xcode version (requires Xcode 14.0+)
2. Verify your macOS version
3. Make sure you're opening `.xcworkspace`, not `.xcodeproj`
4. Try deleting derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```

---

## Testing the Fix

After applying the fixes, your build should:

- ✅ Compile without template errors
- ✅ Show no run script warnings
- ✅ Have minimal Firebase warnings (safe to ignore)
- ✅ Successfully create the app bundle

---

## Questions?

If you encounter any issues:

1. Check that `Podfile_FIXED` was properly copied to `ios/Podfile`
2. Ensure you ran `pod install` after updating the Podfile
3. Verify you're building the right scheme in Xcode
4. Check that node_modules is properly installed (`npm install` or `yarn install`)

---

**Created**: December 26, 2025
**Project**: MobileTodoList-iOS
