#!/usr/bin/env python3

"""
Fix duplicate -lc++ linker flag warning
Automatically removes duplicate -lc++ entries from Xcode project
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
        # Try current directory
        projects = glob.glob('*.xcodeproj')
    if not projects:
        print("❌ Error: No .xcodeproj found")
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

def fix_duplicate_lc_plusplus(pbxproj_path):
    """Remove duplicate -lc++ entries from OTHER_LDFLAGS"""
    
    print(f"📝 Reading: {pbxproj_path}")
    
    with open(pbxproj_path, 'r') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = 0
    
    # Pattern 1: Find OTHER_LDFLAGS with duplicate -lc++
    # Example: OTHER_LDFLAGS = ("-lc++", "-lc++", ...);
    pattern1 = r'OTHER_LDFLAGS\s*=\s*\(([^)]+)\);'
    
    def remove_duplicate_lc_plusplus(match):
        nonlocal fixes_applied
        full_match = match.group(0)
        flags_content = match.group(1)
        
        # Split by comma and clean up
        flags = [f.strip() for f in flags_content.split(',')]
        
        # Count -lc++ occurrences
        lc_plusplus_count = sum(1 for flag in flags if '"-lc++"' in flag or "'-lc++'" in flag)
        
        if lc_plusplus_count > 1:
            # Remove duplicates while preserving order
            seen = set()
            unique_flags = []
            for flag in flags:
                flag_clean = flag.strip()
                if flag_clean and flag_clean not in seen:
                    seen.add(flag_clean)
                    unique_flags.append(flag)
            
            fixes_applied += 1
            print(f"✓ Removed {lc_plusplus_count - 1} duplicate -lc++ flag(s)")
            
            # Reconstruct OTHER_LDFLAGS
            return f"OTHER_LDFLAGS = ({', '.join(unique_flags)});"
        
        return full_match
    
    content = re.sub(pattern1, remove_duplicate_lc_plusplus, content)
    
    # Pattern 2: Find inherited OTHER_LDFLAGS with duplicate -lc++
    # Example: OTHER_LDFLAGS = "$(inherited) -lc++ -lc++";
    pattern2 = r'OTHER_LDFLAGS\s*=\s*"([^"]+)";'
    
    def remove_duplicate_lc_plusplus_string(match):
        nonlocal fixes_applied
        full_match = match.group(0)
        flags_content = match.group(1)
        
        # Split by space and clean up
        flags = flags_content.split()
        
        # Count -lc++ occurrences
        lc_plusplus_count = sum(1 for flag in flags if flag == '-lc++')
        
        if lc_plusplus_count > 1:
            # Remove duplicates while preserving order and keeping $(inherited)
            seen = set()
            unique_flags = []
            for flag in flags:
                # Always keep $(inherited) and other $(...) variables
                if flag.startswith('$(') or flag not in seen:
                    if not flag.startswith('$('):
                        seen.add(flag)
                    unique_flags.append(flag)
            
            fixes_applied += 1
            print(f"✓ Removed {lc_plusplus_count - 1} duplicate -lc++ flag(s) from string format")
            
            # Reconstruct OTHER_LDFLAGS
            return f'OTHER_LDFLAGS = "{" ".join(unique_flags)}";'
        
        return full_match
    
    content = re.sub(pattern2, remove_duplicate_lc_plusplus_string, content)
    
    if fixes_applied == 0:
        print("\n✅ No duplicate -lc++ flags found. Your project is already clean!")
        return False
    
    # Save the modified content
    if content != original_content:
        backup_file(pbxproj_path)
        
        with open(pbxproj_path, 'w') as f:
            f.write(content)
        
        print(f"\n✅ Successfully removed {fixes_applied} duplicate -lc++ flag(s)")
        return True
    
    return False

def check_podfile():
    """Check if Podfile has duplicate -lc++ in post_install"""
    podfile_paths = []
    
    if os.path.exists('ios/Podfile'):
        podfile_paths.append('ios/Podfile')
    if os.path.exists('Podfile'):
        podfile_paths.append('Podfile')
    
    for podfile_path in podfile_paths:
        print(f"\n📝 Checking: {podfile_path}")
        
        with open(podfile_path, 'r') as f:
            content = f.read()
        
        # Check for -lc++ in Podfile
        if "-lc++" in content or "'-lc++'" in content or '"-lc++"' in content:
            print(f"⚠️  Found -lc++ reference in {podfile_path}")
            print("    Check your post_install hook for duplicate linker flag additions")
            print("    Consider removing manual -lc++ additions as it's usually linked automatically")
            
            # Show the relevant lines
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                if '-lc++' in line:
                    print(f"    Line {i}: {line.strip()}")
        else:
            print(f"✓ No -lc++ references found in {podfile_path}")

def main():
    print("🔧 Duplicate -lc++ Linker Flag Fixer")
    print("="*60)
    print()
    
    # Check Podfile first
    check_podfile()
    
    print("\n" + "="*60)
    print()
    
    # Find and fix project.pbxproj
    try:
        xcodeproj = find_xcodeproj()
        print(f"📱 Found project: {os.path.basename(xcodeproj)}")
        
        pbxproj_path = os.path.join(xcodeproj, 'project.pbxproj')
        
        if not os.path.exists(pbxproj_path):
            print(f"❌ Error: project.pbxproj not found at {pbxproj_path}")
            sys.exit(1)
        
        print()
        
        # Apply fixes
        success = fix_duplicate_lc_plusplus(pbxproj_path)
        
        if success:
            print("\n" + "="*60)
            print("✅ DUPLICATE -lc++ FLAGS REMOVED SUCCESSFULLY")
            print("="*60)
            print("\nNext steps:")
            print("1. Close Xcode if it's open")
            print("2. Open your workspace/project in Xcode")
            print("3. Clean build folder: Cmd+Shift+K")
            print("4. Build project: Cmd+B")
            print("\nIf using CocoaPods, you may also want to:")
            print("5. cd ios && pod install && cd ..")
            print("\nThe warning should now be resolved!")
            print("="*60 + "\n")
        else:
            print("\n" + "="*60)
            print("ℹ️  Additional Tips")
            print("="*60)
            print("\nIf you still see the warning after this script:")
            print("1. Check your Xcode project's Build Settings manually:")
            print("   - Open project in Xcode")
            print("   - Select your target")
            print("   - Go to Build Settings tab")
            print("   - Search for 'Other Linker Flags'")
            print("   - Look for duplicate -lc++ entries")
            print("\n2. Check any .xcconfig files for duplicate entries")
            print("\n3. If using CocoaPods, check if any pod is adding -lc++:")
            print("   - Look in ios/Pods/Target Support Files/")
            print("   - Check the .xcconfig files there")
            print("="*60 + "\n")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
