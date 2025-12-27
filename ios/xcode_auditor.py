#!/usr/bin/env python3
"""
Xcode Build Configuration Auditor
Automatically detects and fixes common Xcode build issues in React Native projects.

This script follows the Xcode Build Configuration Protocol v1.0.0
"""

import os
import re
import sys
import json
import subprocess
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple, Optional

class Colors:
    """Terminal color codes for pretty output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class XcodeAuditor:
    def __init__(self, project_root: str, protocol_path: str):
        self.project_root = Path(project_root)
        self.protocol_path = Path(protocol_path)
        self.protocol = self.load_protocol()
        self.issues_found = []
        self.fixes_applied = []
        self.backup_dir = self.project_root / ".xcode_backup" / datetime.now().strftime("%Y%m%d_%H%M%S")
        
    def load_protocol(self) -> Dict:
        """Load the protocol configuration"""
        try:
            with open(self.protocol_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"{Colors.FAIL}Error loading protocol: {e}{Colors.ENDC}")
            sys.exit(1)
    
    def print_header(self, text: str):
        """Print section header"""
        print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
        print(f"{Colors.HEADER}{Colors.BOLD}{text.center(80)}{Colors.ENDC}")
        print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")
    
    def print_success(self, text: str):
        print(f"{Colors.OKGREEN}✓{Colors.ENDC} {text}")
    
    def print_warning(self, text: str):
        print(f"{Colors.WARNING}⚠{Colors.ENDC} {text}")
    
    def print_error(self, text: str):
        print(f"{Colors.FAIL}✗{Colors.ENDC} {text}")
    
    def print_info(self, text: str):
        print(f"{Colors.OKCYAN}ℹ{Colors.ENDC} {text}")
    
    def backup_file(self, file_path: Path):
        """Create backup of a file before modification"""
        if not self.protocol.get('automationRules', {}).get('backupBeforeFix', True):
            return
        
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        relative_path = file_path.relative_to(self.project_root)
        backup_path = self.backup_dir / relative_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file_path, backup_path)
        self.print_info(f"Backed up: {relative_path}")
    
    def find_xcodeproj(self) -> Optional[Path]:
        """Find the Xcode project file"""
        ios_dir = self.project_root / "ios"
        if ios_dir.exists():
            for item in ios_dir.iterdir():
                if item.suffix == ".xcodeproj":
                    return item
        
        # Search in root if not found in ios/
        for item in self.project_root.iterdir():
            if item.suffix == ".xcodeproj":
                return item
        
        return None
    
    def find_pbxproj(self) -> Optional[Path]:
        """Find the project.pbxproj file"""
        xcodeproj = self.find_xcodeproj()
        if xcodeproj:
            pbxproj = xcodeproj / "project.pbxproj"
            if pbxproj.exists():
                return pbxproj
        return None
    
    def audit_build_phases(self) -> List[Dict]:
        """Audit build script phases for missing outputs [BP001, BP002, BP003]"""
        self.print_header("Auditing Build Script Phases")
        
        pbxproj = self.find_pbxproj()
        if not pbxproj:
            self.print_error("Could not find project.pbxproj file")
            return []
        
        issues = []
        
        with open(pbxproj, 'r') as f:
            content = f.read()
        
        # Find all PBXShellScriptBuildPhase sections
        script_phase_pattern = re.compile(
            r'([A-F0-9]+) /\* (.+?) \*/ = \{[^}]*?isa = PBXShellScriptBuildPhase;[^}]*?\};',
            re.DOTALL
        )
        
        for match in script_phase_pattern.finditer(content):
            phase_id = match.group(1)
            phase_name = match.group(2)
            phase_content = match.group(0)
            
            # Check if this phase has output files
            if 'outputPaths = (' not in phase_content:
                issue = {
                    'id': 'BP_OUTPUT_MISSING',
                    'severity': 'warning',
                    'phase_name': phase_name,
                    'phase_id': phase_id,
                    'file': str(pbxproj),
                    'description': f"Build phase '{phase_name}' missing output files"
                }
                issues.append(issue)
                self.print_warning(f"Phase '{phase_name}' has no output files")
            elif 'outputPaths = (\n\t\t\t);' in phase_content:
                issue = {
                    'id': 'BP_OUTPUT_EMPTY',
                    'severity': 'warning',
                    'phase_name': phase_name,
                    'phase_id': phase_id,
                    'file': str(pbxproj),
                    'description': f"Build phase '{phase_name}' has empty output files"
                }
                issues.append(issue)
                self.print_warning(f"Phase '{phase_name}' has empty output files")
            else:
                self.print_success(f"Phase '{phase_name}' has output files configured")
        
        return issues
    
    def fix_build_phases(self) -> bool:
        """Fix build script phases by adding output files"""
        self.print_header("Fixing Build Script Phases")
        
        pbxproj = self.find_pbxproj()
        if not pbxproj:
            self.print_error("Could not find project.pbxproj file")
            return False
        
        self.backup_file(pbxproj)
        
        with open(pbxproj, 'r') as f:
            content = f.read()
        
        original_content = content
        rules = self.protocol['buildPhaseConfiguration']['scriptPhases']['rules']
        
        for rule in rules:
            script_name = rule.get('scriptName', '')
            outputs = rule.get('requiredOutputs', [])
            
            if not script_name or not outputs:
                continue
            
            # Find the script phase
            pattern = re.compile(
                rf'([A-F0-9]+) /\* {re.escape(script_name)} \*/ = \{{[^}}]*?isa = PBXShellScriptBuildPhase;(.*?)\}};',
                re.DOTALL
            )
            
            match = pattern.search(content)
            if match:
                phase_id = match.group(1)
                phase_body = match.group(2)
                
                # Check if outputPaths already exists
                if 'outputPaths = (' in phase_body:
                    if 'outputPaths = (\n\t\t\t);' in phase_body:
                        # Empty outputPaths, replace it
                        output_lines = '\n\t\t\t\t'.join([f'"{out}",' for out in outputs])
                        new_body = phase_body.replace(
                            'outputPaths = (\n\t\t\t);',
                            f'outputPaths = (\n\t\t\t\t{output_lines}\n\t\t\t);'
                        )
                        content = content.replace(phase_body, new_body)
                        self.print_success(f"Added outputs to '{script_name}'")
                        self.fixes_applied.append({
                            'rule_id': rule['id'],
                            'script_name': script_name,
                            'action': 'added_outputs'
                        })
                else:
                    # No outputPaths, add it before the closing brace
                    output_lines = '\n\t\t\t\t'.join([f'"{out}",' for out in outputs])
                    new_body = phase_body.rstrip() + f'\n\t\t\toutputPaths = (\n\t\t\t\t{output_lines}\n\t\t\t);'
                    content = content.replace(phase_body, new_body)
                    self.print_success(f"Added outputPaths section to '{script_name}'")
                    self.fixes_applied.append({
                        'rule_id': rule['id'],
                        'script_name': script_name,
                        'action': 'created_outputs'
                    })
        
        if content != original_content:
            with open(pbxproj, 'w') as f:
                f.write(content)
            self.print_success("Saved changes to project.pbxproj")
            return True
        else:
            self.print_info("No changes needed for build phases")
            return False
    
    def audit_compiler_errors(self) -> List[Dict]:
        """Audit for common compiler errors [CC001, CC002]"""
        self.print_header("Auditing Compiler Compatibility")
        
        issues = []
        
        # Search for CallSeqFactory usage (deprecated/incorrect API)
        for ext in ['.mm', '.cpp', '.m', '.h']:
            for file_path in self.project_root.rglob(f'*{ext}'):
                if 'Pods' in str(file_path) or 'build' in str(file_path):
                    continue
                
                try:
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    if 'CallSeqFactory' in content:
                        issue = {
                            'id': 'CC001_CALLSEQFACTORY',
                            'severity': 'error',
                            'file': str(file_path),
                            'description': 'Usage of deprecated CallSeqFactory API',
                            'solution': 'Replace with CallInvoker::invokeAsync pattern'
                        }
                        issues.append(issue)
                        self.print_error(f"Found CallSeqFactory in {file_path.name}")
                    
                except Exception as e:
                    self.print_warning(f"Could not read {file_path}: {e}")
        
        if not issues:
            self.print_success("No compiler compatibility issues found")
        
        return issues
    
    def fix_compiler_errors(self) -> bool:
        """Fix common compiler errors"""
        self.print_header("Fixing Compiler Errors")
        
        fixed = False
        
        # Fix CallSeqFactory issues
        for ext in ['.mm', '.cpp', '.m', '.h']:
            for file_path in self.project_root.rglob(f'*{ext}'):
                if 'Pods' in str(file_path) or 'build' in str(file_path):
                    continue
                
                try:
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    if 'CallSeqFactory' in content:
                        self.backup_file(file_path)
                        
                        # Replace CallSeqFactory with proper pattern
                        # This is a simplified fix - actual fix may need more context
                        new_content = content.replace(
                            'CallSeqFactory',
                            'callInvoker_->invokeAsync'
                        )
                        
                        with open(file_path, 'w') as f:
                            f.write(new_content)
                        
                        self.print_success(f"Fixed CallSeqFactory in {file_path.name}")
                        self.fixes_applied.append({
                            'rule_id': 'CC001',
                            'file': str(file_path),
                            'action': 'replaced_callseqfactory'
                        })
                        fixed = True
                    
                except Exception as e:
                    self.print_error(f"Could not fix {file_path}: {e}")
        
        if not fixed:
            self.print_info("No compiler errors to fix")
        
        return fixed
    
    def audit_dependencies(self) -> List[Dict]:
        """Audit dependency management [DM001]"""
        self.print_header("Auditing Dependencies")
        
        issues = []
        
        podfile = self.project_root / "ios" / "Podfile"
        if not podfile.exists():
            podfile = self.project_root / "Podfile"
        
        if podfile.exists():
            self.print_success("Found Podfile")
            
            with open(podfile, 'r') as f:
                content = f.read()
            
            # Check for post_install hook
            if 'post_install' not in content:
                issue = {
                    'id': 'DM001_NO_POST_INSTALL',
                    'severity': 'warning',
                    'file': str(podfile),
                    'description': 'No post_install hook found in Podfile'
                }
                issues.append(issue)
                self.print_warning("No post_install hook in Podfile")
            else:
                self.print_success("Podfile has post_install hook")
        else:
            self.print_error("No Podfile found")
        
        return issues
    
    def run_full_audit(self) -> Dict:
        """Run complete audit of all checks"""
        self.print_header("Starting Full Project Audit")
        self.print_info(f"Project Root: {self.project_root}")
        self.print_info(f"Protocol Version: {self.protocol['version']}")
        self.print_info(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        all_issues = []
        
        # Run all audit checks
        all_issues.extend(self.audit_build_phases())
        all_issues.extend(self.audit_compiler_errors())
        all_issues.extend(self.audit_dependencies())
        
        # Generate report
        report = {
            'timestamp': datetime.now().isoformat(),
            'protocol_version': self.protocol['version'],
            'project_root': str(self.project_root),
            'total_issues': len(all_issues),
            'issues_by_severity': {
                'error': len([i for i in all_issues if i['severity'] == 'error']),
                'warning': len([i for i in all_issues if i['severity'] == 'warning'])
            },
            'issues': all_issues
        }
        
        self.issues_found = all_issues
        
        return report
    
    def apply_all_fixes(self) -> Dict:
        """Apply all automated fixes"""
        self.print_header("Applying Automated Fixes")
        
        if self.protocol.get('automationRules', {}).get('autoFixEnabled', True):
            self.fix_build_phases()
            self.fix_compiler_errors()
            
            return {
                'timestamp': datetime.now().isoformat(),
                'fixes_applied': len(self.fixes_applied),
                'fixes': self.fixes_applied
            }
        else:
            self.print_warning("Auto-fix is disabled in protocol")
            return {'fixes_applied': 0, 'fixes': []}
    
    def generate_report(self, audit_report: Dict, fix_report: Dict):
        """Generate and save comprehensive report"""
        self.print_header("Generating Report")
        
        report_path = self.project_root / "xcode-audit-report.json"
        
        full_report = {
            'audit': audit_report,
            'fixes': fix_report,
            'backup_location': str(self.backup_dir) if self.backup_dir.exists() else None
        }
        
        with open(report_path, 'w') as f:
            json.dump(full_report, f, indent=2)
        
        self.print_success(f"Report saved to: {report_path}")
        
        # Print summary
        self.print_header("Audit Summary")
        print(f"Total Issues Found: {Colors.WARNING}{audit_report['total_issues']}{Colors.ENDC}")
        print(f"  - Errors: {Colors.FAIL}{audit_report['issues_by_severity']['error']}{Colors.ENDC}")
        print(f"  - Warnings: {Colors.WARNING}{audit_report['issues_by_severity']['warning']}{Colors.ENDC}")
        print(f"\nFixes Applied: {Colors.OKGREEN}{fix_report['fixes_applied']}{Colors.ENDC}")
        
        if full_report['backup_location']:
            print(f"\nBackups saved to: {Colors.OKCYAN}{full_report['backup_location']}{Colors.ENDC}")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Xcode Build Configuration Auditor',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python xcode_auditor.py --audit-only
  python xcode_auditor.py --fix
  python xcode_auditor.py --fix --no-backup
        '''
    )
    
    parser.add_argument(
        '--project-root',
        default='.',
        help='Path to project root (default: current directory)'
    )
    
    parser.add_argument(
        '--protocol',
        default='.vscode/xcode-build-protocol.json',
        help='Path to protocol configuration file'
    )
    
    parser.add_argument(
        '--audit-only',
        action='store_true',
        help='Run audit without applying fixes'
    )
    
    parser.add_argument(
        '--fix',
        action='store_true',
        help='Apply automated fixes'
    )
    
    parser.add_argument(
        '--no-backup',
        action='store_true',
        help='Skip backup creation before fixes'
    )
    
    args = parser.parse_args()
    
    # Resolve paths
    project_root = Path(args.project_root).resolve()
    protocol_path = project_root / args.protocol
    
    if not protocol_path.exists():
        print(f"{Colors.FAIL}Error: Protocol file not found: {protocol_path}{Colors.ENDC}")
        sys.exit(1)
    
    # Create auditor
    auditor = XcodeAuditor(str(project_root), str(protocol_path))
    
    # Override backup setting if requested
    if args.no_backup:
        auditor.protocol['automationRules']['backupBeforeFix'] = False
    
    # Run audit
    audit_report = auditor.run_full_audit()
    
    # Apply fixes if requested
    if args.fix and not args.audit_only:
        fix_report = auditor.apply_all_fixes()
    else:
        fix_report = {'fixes_applied': 0, 'fixes': []}
        if audit_report['total_issues'] > 0:
            print(f"\n{Colors.WARNING}Run with --fix to apply automated fixes{Colors.ENDC}")
    
    # Generate report
    auditor.generate_report(audit_report, fix_report)
    
    # Exit with appropriate code
    if audit_report['issues_by_severity']['error'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == '__main__':
    main()
