# Podfile Post-Install Hook
# Add this to your ios/Podfile to preserve build phase fixes after pod install

post_install do |installer|
  # React Native and Firebase specific configurations
  react_native_post_install(
    installer,
    # Set platform version to minimum supported
    :mac_catalyst_enabled => false
  )
  
  # Fix build phases to include output files (prevents warnings)
  installer.pods_project.targets.each do |target|
    target.build_phases.each do |phase|
      if phase.is_a?(Xcode::Project::Object::PBXShellScriptBuildPhase)
        
        # Fix React Native bundler script
        if phase.name && phase.name.include?("Bundle React Native code and images")
          unless phase.output_paths.include?("$(DERIVED_FILE_DIR)/main.jsbundle")
            phase.output_paths = [
              "$(DERIVED_FILE_DIR)/main.jsbundle",
              "$(DERIVED_FILE_DIR)/main.jsbundle.map"
            ]
            puts "✓ Fixed outputs for: #{phase.name}"
          end
        end
        
        # Fix Firebase configuration script
        if phase.name && phase.name.include?("[RNFB] Core Configuration")
          unless phase.output_paths.include?("$(DERIVED_FILE_DIR)/rnfb-config-generated.stamp")
            phase.output_paths = ["$(DERIVED_FILE_DIR)/rnfb-config-generated.stamp"]
            puts "✓ Fixed outputs for: #{phase.name}"
          end
        end
        
        # Fix generic CocoaPods scripts with no outputs
        if phase.name && phase.name.match?(/\[CP.*\]/) && phase.output_paths.empty?
          safe_name = phase.name.gsub(/[^a-zA-Z0-9]/, '_')
          phase.output_paths = ["$(DERIVED_FILE_DIR)/#{safe_name}.stamp"]
          puts "✓ Fixed outputs for: #{phase.name}"
        end
      end
    end
  end
  
  # Save the modified project
  installer.pods_project.save
  
  # Optionally run the full auditor for comprehensive checks
  if File.exist?("../xcode_auditor.py")
    puts "\n🔍 Running Xcode configuration audit..."
    system("python3 ../xcode_auditor.py --fix --no-backup")
  end
  
  puts "\n✅ Post-install configuration complete!"
end

# Example of a complete Podfile with the post_install hook:
=begin

# ios/Podfile

require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

platform :ios, '13.0'
install! 'cocoapods', :deterministic_uuids => false

target 'MobileTodoList' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => true,
    :fabric_enabled => false,
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  # Firebase
  pod 'Firebase/Analytics'
  pod 'Firebase/Auth'
  pod 'Firebase/Firestore'

  target 'MobileTodoListTests' do
    inherit! :complete
  end

  # Add the post_install hook here (see above)
  post_install do |installer|
    # ... (insert the post_install code from above)
  end
end

=end
