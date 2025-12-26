#!/usr/bin/env ruby

# Xcode Build Phase Output Fixer
# This script helps add output files to Xcode build phases to eliminate warnings

require 'xcodeproj'

project_path = 'ios/MobileTodoList.xcodeproj'

unless File.exist?(project_path)
  puts "❌ Error: Project not found at #{project_path}"
  puts "   Run this script from your React Native project root"
  exit 1
end

puts "🔧 Opening Xcode project..."
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.find { |t| t.name == 'MobileTodoList' }

unless target
  puts "❌ Error: Could not find MobileTodoList target"
  exit 1
end

puts "✅ Found target: #{target.name}"
puts ""

# Fix React Native bundle script phase
puts "🔍 Looking for build phases to fix..."

target.shell_script_build_phases.each do |phase|
  case phase.name
  when "Bundle React Native code and images", /Bundle React Native/
    puts "📝 Fixing: #{phase.name}"
    phase.output_paths = [
      '$(DERIVED_FILE_DIR)/main.jsbundle',
      '$(DERIVED_FILE_DIR)/main.jsbundle.map'
    ]
    puts "   ✅ Added output paths"
    
  when /\[CP-User\] \[RN\]Check rncore/
    puts "📝 Fixing: #{phase.name}"
    phase.output_paths = ['$(DERIVED_FILE_DIR)/rncore_check.txt']
    puts "   ✅ Added output path"
    
  when /\[CP-User\] \[Hermes\]/
    puts "📝 Fixing: #{phase.name}"
    phase.output_paths = ['$(DERIVED_FILE_DIR)/hermes_check.txt']
    puts "   ✅ Added output path"
  end
end

puts ""
puts "💾 Saving project..."
project.save

puts ""
puts "✅ Done! Build phase warnings should be resolved."
puts ""
puts "Next steps:"
puts "1. Clean build folder in Xcode (Cmd+Shift+K)"
puts "2. Rebuild the project"
