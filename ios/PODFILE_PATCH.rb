# ==============================================================================
# PODFILE POST_INSTALL FIXES
# ==============================================================================
# Copy this entire section into your existing Podfile's post_install block
# Replace or merge with your existing post_install configuration
# ==============================================================================

post_install do |installer|
  # Keep your existing react_native_post_install call if you have it
  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false
  )
  
  # ==============================================================================
  # FIX 1: gRPC-Core Template Error & C++ Compilation Issues
  # ==============================================================================
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # Set C++17 as the standard (required for modern template syntax)
      config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
      config.build_settings['CLANG_CXX_LIBRARY'] = 'libc++'
      
      # Ensure consistent deployment target
      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      
      # Suppress warnings from third-party code we can't control
      config.build_settings['GCC_WARN_INHIBIT_ALL_WARNINGS'] = 'YES'
      config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
      
      # Special handling for gRPC pods (fixes template keyword error)
      if target.name == 'gRPC-Core' || target.name == 'gRPC-C++'
        # Use GNU C++17 for better template support
        config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++17'
        
        # Fix protobuf framework imports
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['$(inherited)']
        config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] << 'GPB_USE_PROTOBUF_FRAMEWORK_IMPORTS=0'
      end
      
      # Fix for fmt library deprecation warnings
      if target.name.include?('fmt')
        config.build_settings['CLANG_WARN_DEPRECATED_OBJC_IMPLEMENTATIONS'] = 'NO'
      end
      
      # Fix for Firebase and other warnings
      if target.name.include?('Firebase')
        config.build_settings['OTHER_CFLAGS'] ||= ['$(inherited)']
        config.build_settings['OTHER_CFLAGS'] << '-Wno-deprecated-declarations'
      end
    end
  end
  
  # ==============================================================================
  # FIX 2: Run Script Build Phase Warnings
  # ==============================================================================
  # This fixes "will be run during every build" warnings by adding output files
  installer.pods_project.targets.each do |target|
    target.build_phases.each do |phase|
      if phase.is_a?(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
        # Fix "Bundle React Native code and images" warning
        if phase.name&.include?('Bundle React Native code')
          if phase.output_paths.empty?
            phase.output_paths = [
              '$(DERIVED_FILE_DIR)/main.jsbundle',
              '$(DERIVED_FILE_DIR)/main.jsbundle.map'
            ]
          end
        end
        
        # Fix "[RNFB] Core Configuration" warning
        if phase.name&.include?('[RNFB] Core Configuration')
          if phase.output_paths.empty?
            phase.output_paths = [
              '$(DERIVED_FILE_DIR)/rnfb-config-output.txt'
            ]
          end
        end
        
        # Fix "Hermes" warning
        if phase.name&.include?('Hermes')
          if phase.output_paths.empty?
            phase.output_paths = [
              '$(DERIVED_FILE_DIR)/hermes-replacement-output.txt'
            ]
          end
        end
      end
    end
  end
  
  # Keep any other post_install customizations you may have below this line
  # ...
  
end

# ==============================================================================
# ADDITIONAL REQUIRED CHANGES (add to the main target block)
# ==============================================================================
# Add these lines INSIDE your target 'MobileTodoList' do block:
#
#   # Fix gRPC-Core template error by forcing compatible version
#   pod 'gRPC-Core', '1.44.0', :modular_headers => false
#   pod 'gRPC-C++', '1.44.0', :modular_headers => false
#   
#   # Ensure compatible Firebase versions
#   pod 'Firebase/Core', '~> 10.20.0'
#
# ==============================================================================
# BEFORE target block, add:
#
#   $RNFirebaseAsStaticFramework = true
#
# ==============================================================================
