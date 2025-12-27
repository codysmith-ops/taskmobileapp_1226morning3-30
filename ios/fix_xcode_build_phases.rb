#!/usr/bin/env ruby

# Script to fix Xcode build phase warnings for React Native
# This script adds output files to build phases to eliminate warnings
# Created: December 26, 2025

require 'xcodeproj'

puts "🔧 Fixing Xcode Build Phase Warnings..."
puts "========================================"

# Find the Xcode project
project_path = Dir.glob('ios/*.xcodeproj').first

unless project_path
  puts "❌ Error: Could not find .xcodeproj file in ios directory"
  puts "Please make sure you're running this from your project root."
  exit 1
end

puts "📱 Found project: #{File.basename(project_path)}"

# Open the project
project = Xcodeproj::Project.open(project_path)

# Get the main app target
main_target = project.targets.find { |t| t.name.include?('MobileTodoList') && !t.name.include?('Tests') }

unless main_target
  # Try to find any target that isn't a test target
  main_target = project.targets.find { |t| !t.name.include?('Tests') && t.is_a?(Xcodeproj::Project::Object::PBXNativeTarget) }
end

unless main_target
  puts "❌ Error: Could not find main app target"
  exit 1
end

puts "🎯 Target: #{main_target.name}"
puts ""

fixed_count = 0

# Fix React Native bundle script phase
main_target.shell_script_build_phases.each do |phase|
  if phase.name && phase.name.include?('Bundle React Native code and images')
    puts "🔨 Fixing: #{phase.name}"
    
    # Add output files
    phase.output_paths = [
      '$(DERIVED_FILE_DIR)/main.jsbundle',
      '$(DERIVED_FILE_DIR)/main.jsbundle.map'
    ] unless phase.output_paths.include?('$(DERIVED_FILE_DIR)/main.jsbundle')
    
    puts "   ✓ Added output files for React Native bundle"
    fixed_count += 1
  end
  
  # Fix Firebase RNFB Core Configuration script phase
  if phase.name && phase.name.include?('[CP-User] [RNFB] Core Configuration')
    puts "🔨 Fixing: #{phase.name}"
    
    # Add output file
    phase.output_paths = [
      '$(DERIVED_FILE_DIR)/rnfb-config-generated.log'
    ] unless phase.output_paths.include?('$(DERIVED_FILE_DIR)/rnfb-config-generated.log')
    
    puts "   ✓ Added output file for RNFB configuration"
    fixed_count += 1
  end
end

# Save the project
if fixed_count > 0
  project.save
  puts ""
  puts "========================================"
  puts "✅ Successfully fixed #{fixed_count} build phase(s)!"
  puts ""
  puts "Next steps:"
  puts "1. Clean your build folder in Xcode (Cmd + Shift + K)"
  puts "2. Rebuild your project (Cmd + B)"
  puts ""
  puts "The warnings should now be resolved."
else
  puts ""
  puts "⚠️  No build phases found to fix."
  puts "The warnings may have already been resolved or the script phases"
  puts "have different names than expected."
  puts ""
  puts "You can manually fix this in Xcode:"
  puts "1. Open your project in Xcode"
  puts "2. Select your target → Build Phases"
  puts "3. Find the script phase with the warning"
  puts "4. Add output files or uncheck 'Based on dependency analysis'"
end

puts "========================================"
