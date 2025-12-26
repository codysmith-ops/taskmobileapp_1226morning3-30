#!/usr/bin/env ruby

###############################################################################
# Xcode Build Phase Output Files Script
# Automatically adds output file specifications to build script phases
# to suppress "will be run during every build" warnings
###############################################################################

require 'xcodeproj'

# Colors for terminal output
class String
  def red; "\e[31m#{self}\e[0m" end
  def green; "\e[32m#{self}\e[0m" end
  def yellow; "\e[33m#{self}\e[0m" end
  def blue; "\e[34m#{self}\e[0m" end
  def cyan; "\e[36m#{self}\e[0m" end
end

puts "╔════════════════════════════════════════════════════════════════╗".cyan
puts "║   Xcode Build Phase Output Files Configuration Script         ║".cyan
puts "╚════════════════════════════════════════════════════════════════╝".cyan
puts ""

# Find the Xcode project
project_path = Dir.glob('ios/*.xcodeproj').first

unless project_path
  puts "✗ Error: No Xcode project found in ios/ directory".red
  exit 1
end

puts "Found project: #{project_path}".green
puts ""

begin
  # Open the project
  project = Xcodeproj::Project.open(project_path)
  
  # Find the main target
  target = project.targets.find { |t| t.name == 'MobileTodoList' }
  
  unless target
    puts "✗ Error: Could not find MobileTodoList target".red
    exit 1
  end
  
  puts "Processing target: #{target.name}".blue
  puts ""
  
  modified = false
  
  # Process shell script build phases
  target.shell_script_build_phases.each do |phase|
    phase_name = phase.name || "Unnamed Phase"
    
    case phase_name
    when /Bundle React Native code and images/
      if phase.output_paths.empty?
        puts "✓ Adding output files to: #{phase_name}".yellow
        phase.output_paths = [
          "$(DERIVED_FILE_DIR)/Pods-MobileTodoList-checkManifestLockResult.txt",
          "$(DERIVED_FILE_DIR)/MobileTodoList-generated.js"
        ]
        modified = true
        puts "  → Added 2 output paths".green
      else
        puts "✓ Output files already configured: #{phase_name}".green
      end
      
    when /\[CP-User\] \[RN\]Check rncore/
      if phase.output_paths.empty?
        puts "✓ Adding output files to: #{phase_name}".yellow
        phase.output_paths = [
          "$(DERIVED_FILE_DIR)/rncore_check.txt"
        ]
        modified = true
        puts "  → Added 1 output path".green
      else
        puts "✓ Output files already configured: #{phase_name}".green
      end
      
    when /\[CP-User\] \[Hermes\] Replace Hermes/
      if phase.output_paths.empty?
        puts "✓ Adding output files to: #{phase_name}".yellow
        phase.output_paths = [
          "$(PODS_ROOT)/hermes-engine/destroot/bin/hermesc"
        ]
        modified = true
        puts "  → Added 1 output path".green
      else
        puts "✓ Output files already configured: #{phase_name}".green
      end
      
    else
      puts "ℹ Skipping: #{phase_name}".blue
    end
    
    puts ""
  end
  
  if modified
    # Save the project
    project.save
    puts "╔════════════════════════════════════════════════════════════════╗".cyan
    puts "║                    ✓ CHANGES SAVED                             ║".cyan
    puts "╚════════════════════════════════════════════════════════════════╝".cyan
    puts ""
    puts "Build script warnings should now be resolved!".green
    puts ""
    puts "Next steps:".yellow
    puts "  1. Clean build folder in Xcode (Cmd+Shift+K)".yellow
    puts "  2. Build the project (Cmd+B)".yellow
    puts ""
  else
    puts "╔════════════════════════════════════════════════════════════════╗".cyan
    puts "║              ℹ NO CHANGES NEEDED                               ║".cyan
    puts "╚════════════════════════════════════════════════════════════════╝".cyan
    puts ""
    puts "All build script phases already have output files configured.".green
    puts ""
  end
  
rescue => e
  puts ""
  puts "✗ Error: #{e.message}".red
  puts ""
  puts "Make sure you have the xcodeproj gem installed:".yellow
  puts "  gem install xcodeproj".yellow
  puts ""
  exit 1
end
