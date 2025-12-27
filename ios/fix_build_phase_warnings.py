#!/usr/bin/env python3

"""
Xcode Build Phase Fixer
Automatically fixes build phase warnings by adding output files
Works without external dependencies
"""

import os
import sys
import re
import glob
from datetime import datetime

def find_xcodeproj():
    """Find the .xcodeproj file in the ios directory"""
    projects = glob.glob('ios/*.xcodeproj')
    if not projects:
        print("❌ Error: No .xcodeproj found in ios directory")
        sys.exit(1)
    return projects[0]

def backup_file(filepath):
    """Create a backup of the file"""
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{filepath}.backup_{timestamp}"
    with open(filepath, 'r') as f:
        content = f.read()
    with open(backup_path, 'w') as f:
        f.write(content)
    print(f"📋 Created backup: {os.path.basename(backup_path)}")
    return backup_path

def fix_build_phases(pbxproj_path):
    """Fix build phase warnings by adding output files"""
    
    print(f"📝 Reading: {pbxproj_path}")
    
    with open(pbxproj_path, 'r') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = 0
    
    # Pattern to find shell script build phases
    # We need to find the section and add outputPaths if missing
    
    # Fix 1: Bundle React Native code and images
    pattern1 = r'(shellScript = ".*?Bundle React Native code and images.*?";)'
    matches1 = re.finditer(pattern1, content, re.DOTALL)
    
    for match in matches1:
        # Find the enclosing PBXShellScriptBuildPhase section
        start_pos = match.start()
        
        # Search backwards for the beginning of this build phase
        section_start = content.rfind('Begin PBXShellScriptBuildPhase section', 0, start_pos)
        if section_start == -1:
            section_start = 0
            
        # Find the build phase object that contains this script
        # Look for patterns like: 00DD1BFF1BD5951E006B06BC /* Bundle React Native code and images */ = {
        phase_match = re.search(
            r'([A-F0-9]{24}) /\* Bundle React Native code and images \*/ = \{([^}]+)\}',
            content[section_start:start_pos + 1000],
            re.DOTALL
        )
        
        if phase_match:
            phase_id = phase_match.group(1)
            phase_content = phase_match.group(2)
            
            # Check if outputPaths already exists
            if 'outputPaths' not in phase_content:
                # Find where to insert outputPaths (before shellScript)
                insert_pos = content.find('shellScript', start_pos)
                if insert_pos != -1:
                    # Add outputPaths
                    output_paths_entry = '\t\t\toutputPaths = (\n\t\t\t\t"$(DERIVED_FILE_DIR)/main.jsbundle",\n\t\t\t\t"$(DERIVED_FILE_DIR)/main.jsbundle.map",\n\t\t\t);\n\t\t\t'
                    content = content[:insert_pos] + output_paths_entry + content[insert_pos:]
                    fixes_applied += 1
                    print("✓ Fixed: Bundle React Native code and images")
    
    # Fix 2: [CP-User] [RNFB] Core Configuration
    pattern2 = r'(shellScript = ".*?\[CP-User\] \[RNFB\] Core Configuration.*?";)'
    matches2 = re.finditer(pattern2, content, re.DOTALL)
    
    for match in matches2:
        start_pos = match.start()
        
        section_start = content.rfind('Begin PBXShellScriptBuildPhase section', 0, start_pos)
        if section_start == -1:
            section_start = 0
            
        phase_match = re.search(
            r'([A-F0-9]{24}) /\* \[CP-User\] \[RNFB\] Core Configuration \*/ = \{([^}]+)\}',
            content[section_start:start_pos + 1000],
            re.DOTALL
        )
        
        if phase_match:
            phase_id = phase_match.group(1)
            phase_content = phase_match.group(2)
            
            if 'outputPaths' not in phase_content:
                insert_pos = content.find('shellScript', start_pos)
                if insert_pos != -1:
                    output_paths_entry = '\t\t\toutputPaths = (\n\t\t\t\t"$(DERIVED_FILE_DIR)/rnfb-config-generated.log",\n\t\t\t);\n\t\t\t'
                    content = content[:insert_pos] + output_paths_entry + content[insert_pos:]
                    fixes_applied += 1
                    print("✓ Fixed: [CP-User] [RNFB] Core Configuration")
    
    # If no fixes were applied using the complex method, try a simpler approach
    if fixes_applied == 0:
        print("\n⚠️  Could not automatically fix build phases.")
        print("This might be because:")
        print("  - The build phases have different names")
        print("  - The project structure is different than expected")
        print("  - The fixes were already applied")
        print("\n📖 Manual fix instructions:")
        print_manual_instructions()
        return False
    
    # Save the modified content
    if content != original_content:
        backup_file(pbxproj_path)
        
        with open(pbxproj_path, 'w') as f:
            f.write(content)
        
        print(f"\n✅ Successfully applied {fixes_applied} fix(es) to project file")
        return True
    
    return False

def print_manual_instructions():
    """Print manual fix instructions"""
    print("\n" + "="*60)
    print("MANUAL FIX INSTRUCTIONS")
    print("="*60)
    print("\n1. Open your project in Xcode:")
    print("   open ios/*.xcworkspace")
    print("\n2. Select your app target")
    print("\n3. Go to 'Build Phases' tab")
    print("\n4. For 'Bundle React Native code and images':")
    print("   - Find the script phase")
    print("   - Expand 'Output Files'")
    print("   - Add: $(DERIVED_FILE_DIR)/main.jsbundle")
    print("\n5. For '[CP-User] [RNFB] Core Configuration':")
    print("   - Find the script phase")
    print("   - Expand 'Output Files'")
    print("   - Add: $(DERIVED_FILE_DIR)/rnfb-config-generated.log")
    print("\n6. Clean and rebuild (Cmd+Shift+K, then Cmd+B)")
    print("="*60 + "\n")

def main():
    print("🔧 Xcode Build Phase Warning Fixer")
    print("="*60)
    print()
    
    # Check if we're in the right directory
    if not os.path.exists('package.json'):
        print("❌ Error: package.json not found")
        print("Please run this script from your project root directory")
        sys.exit(1)
    
    if not os.path.exists('ios'):
        print("❌ Error: ios directory not found")
        sys.exit(1)
    
    # Find the Xcode project
    xcodeproj = find_xcodeproj()
    print(f"📱 Found project: {os.path.basename(xcodeproj)}")
    
    # Find the project.pbxproj file
    pbxproj_path = os.path.join(xcodeproj, 'project.pbxproj')
    
    if not os.path.exists(pbxproj_path):
        print(f"❌ Error: project.pbxproj not found at {pbxproj_path}")
        sys.exit(1)
    
    print()
    
    # Apply fixes
    success = fix_build_phases(pbxproj_path)
    
    if success:
        print("\n" + "="*60)
        print("✅ BUILD PHASE FIXES APPLIED SUCCESSFULLY")
        print("="*60)
        print("\nNext steps:")
        print("1. Open your workspace: open ios/*.xcworkspace")
        print("2. Clean build folder: Cmd+Shift+K")
        print("3. Build project: Cmd+B")
        print("\nThe warnings should now be resolved!")
        print("="*60 + "\n")
    else:
        print("\n⚠️  Automatic fix could not be completed.")
        print("Please follow the manual instructions above.\n")

if __name__ == '__main__':
    main()
