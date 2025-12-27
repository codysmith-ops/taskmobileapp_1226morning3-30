# Xcode Build Configuration Protocol - Implementation Guide

## 📋 Overview

This protocol enables VS Code to automatically detect, audit, and fix Xcode build issues in React Native projects. It addresses common problems including:

- ✅ Missing build phase outputs
- ✅ Compiler API compatibility issues (CallSeqFactory, etc.)
- ✅ Dependency management
- ✅ Code quality standards

## 🚀 Quick Start

### 1. Make Scripts Executable

```bash
chmod +x fix_build_phases.sh
```

### 2. Run Quick Fix (Recommended First Step)

```bash
./fix_build_phases.sh
```

This will:
- Create a backup of your `project.pbxproj`
- Add output file specifications to problematic build phases
- Fix the warnings immediately

### 3. Run Full Audit

```bash
python3 xcode_auditor.py --audit-only
```

This will scan your entire project for issues and generate a report.

### 4. Apply All Fixes

```bash
python3 xcode_auditor.py --fix
```

This will automatically fix all detected issues.

## 📁 Files Created

### Protocol Configuration
- **`.vscode/xcode-build-protocol.json`** - Main protocol definition
- **`.vscode/tasks.json`** - VS Code tasks for running audits and builds
- **`.vscode/settings.json`** - Project-specific VS Code settings
- **`.vscode/launch.json`** - Debug configurations

### Automation Scripts
- **`xcode_auditor.py`** - Comprehensive Python auditor (industry-standard)
- **`fix_build_phases.sh`** - Quick bash script for immediate fixes

## 🔧 VS Code Integration

### Available Tasks (Cmd+Shift+P → "Tasks: Run Task")

1. **Xcode: Run Full Audit** - Scan for issues without making changes
2. **Xcode: Audit and Fix All Issues** - Scan and automatically fix
3. **Xcode: Quick Fix Build Phases** - Fast fix for build phase warnings
4. **Xcode: Clean and Build (iOS)** - Full Xcode build with problem detection
5. **React Native: Start Metro** - Start the Metro bundler
6. **CocoaPods: Update** - Update pods

### Keyboard Shortcuts

You can add these to your keybindings (Cmd+K Cmd+S):

```json
{
  "key": "cmd+shift+a",
  "command": "workbench.action.tasks.runTask",
  "args": "Xcode: Audit and Fix All Issues"
}
```

## 📊 Protocol Rules

### Build Phase Rules (BP)

| Rule ID | Description | Fix |
|---------|-------------|-----|
| BP001 | React Native Bundle Script | Adds `main.jsbundle` output |
| BP002 | Firebase Core Configuration | Adds config stamp output |
| BP003 | Generic CocoaPods Scripts | Adds stamp file outputs |

### Compiler Rules (CC)

| Rule ID | Description | Fix |
|---------|-------------|-----|
| CC001 | CallSeqFactory API Issue | Replaces with `callInvoker_->invokeAsync` |
| CC002 | Bridge Compatibility | Ensures proper React Native bridge usage |

### Dependency Rules (DM)

| Rule ID | Description | Fix |
|---------|-------------|-----|
| DM001 | CocoaPods Build Phase | Preserves modifications after `pod install` |

## 🔍 Audit Report

After running an audit, you'll get `xcode-audit-report.json` with:

```json
{
  "audit": {
    "timestamp": "2025-12-26T...",
    "total_issues": 3,
    "issues_by_severity": {
      "error": 1,
      "warning": 2
    },
    "issues": [...]
  },
  "fixes": {
    "fixes_applied": 3,
    "fixes": [...]
  },
  "backup_location": ".xcode_backup/20251226_..."
}
```

## 🛡️ Safety Features

### Automatic Backups

All modifications create timestamped backups in `.xcode_backup/`:

```
.xcode_backup/
  └── 20251226_143022/
      └── ios/
          └── MobileTodoList.xcodeproj/
              └── project.pbxproj
```

### Restore from Backup

```bash
cp .xcode_backup/TIMESTAMP/ios/*.xcodeproj/project.pbxproj ios/*.xcodeproj/
```

## 🔄 Workflow Integration

### Pre-Build Audit

Add to your `package.json`:

```json
{
  "scripts": {
    "prebuild:ios": "python3 xcode_auditor.py --fix",
    "build:ios": "cd ios && xcodebuild ..."
  }
}
```

### Git Hooks (Recommended)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
python3 xcode_auditor.py --audit-only
if [ $? -ne 0 ]; then
    echo "Xcode audit failed. Run: python3 xcode_auditor.py --fix"
    exit 1
fi
```

## 🎯 Specific Issue Fixes

### Fix: "No matching function for call to 'CallSeqFactory'"

**Cause:** Using deprecated/incorrect React Native JSI API

**Automatic Fix:**
```bash
python3 xcode_auditor.py --fix
```

**Manual Fix:**
Replace:
```cpp
CallSeqFactory(...)
```

With:
```cpp
callInvoker_->invokeAsync([=]() {
    // Your code
});
```

### Fix: Build Phase Warnings

**Cause:** Missing output file specifications

**Automatic Fix:**
```bash
./fix_build_phases.sh
```

**Manual Fix in Xcode:**
1. Open Xcode project
2. Select target → Build Phases
3. Expand problematic script phase
4. Add to "Output Files":
   - For React Native: `$(DERIVED_FILE_DIR)/main.jsbundle`
   - For RNFB: `$(DERIVED_FILE_DIR)/rnfb-config-generated.stamp`

## 📝 Extending the Protocol

### Add Custom Rules

Edit `.vscode/xcode-build-protocol.json`:

```json
{
  "compilerConfiguration": {
    "rules": [
      {
        "id": "CC003",
        "name": "Your Custom Rule",
        "description": "Description of the rule",
        "affectedFileTypes": [".mm"],
        "commonIssues": [
          {
            "error": "Pattern to match",
            "solution": "How to fix it",
            "searchPattern": "regex",
            "replacementPattern": "replacement"
          }
        ]
      }
    ]
  }
}
```

### Add Custom Audit Check

Edit `xcode_auditor.py` and add a method:

```python
def audit_custom_check(self) -> List[Dict]:
    """Your custom audit check"""
    issues = []
    # Your audit logic
    return issues
```

Then add it to `run_full_audit()`:

```python
all_issues.extend(self.audit_custom_check())
```

## 🐛 Troubleshooting

### Issue: Python script fails

**Solution:** Ensure Python 3.6+ is installed:
```bash
python3 --version
```

### Issue: Permission denied on scripts

**Solution:**
```bash
chmod +x fix_build_phases.sh
chmod +x xcode_auditor.py
```

### Issue: Changes don't persist after `pod install`

**Solution:** Add a post_install hook to your `Podfile`:

```ruby
post_install do |installer|
  # Run the auditor after pod install
  system("python3 ../xcode_auditor.py --fix")
end
```

### Issue: Xcode still shows warnings

**Solution:**
1. Clean build folder (Cmd+Shift+K in Xcode)
2. Close Xcode
3. Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
4. Reopen Xcode and rebuild

## 📚 Best Practices

1. **Run audit before committing:**
   ```bash
   python3 xcode_auditor.py --audit-only
   ```

2. **Keep backups for 30 days:**
   ```bash
   find .xcode_backup -mtime +30 -delete
   ```

3. **Review audit report regularly:**
   ```bash
   cat xcode-audit-report.json | python3 -m json.tool
   ```

4. **Update protocol as needed:**
   - Add new rules when you discover patterns
   - Document fixes in the protocol
   - Share with team

## 🤝 Team Collaboration

### Share Configuration

Commit these files to git:
```
.vscode/
├── xcode-build-protocol.json
├── tasks.json
├── settings.json
└── launch.json

xcode_auditor.py
fix_build_phases.sh
XCODE_PROTOCOL_GUIDE.md
```

### Do NOT Commit

Add to `.gitignore`:
```
.xcode_backup/
xcode-audit-report.json
*.pbxproj.backup.*
```

## 📞 Support

For issues or questions:
1. Check `xcode-audit-report.json` for details
2. Review `.xcode_backup/` for recent changes
3. Restore from backup if needed
4. Run with `--audit-only` first to preview changes

## 🎓 Advanced Usage

### CI/CD Integration

```yaml
# .github/workflows/ios-build.yml
- name: Audit Xcode Configuration
  run: |
    python3 xcode_auditor.py --fix --no-backup
    
- name: Build iOS
  run: |
    cd ios
    xcodebuild clean build -workspace *.xcworkspace -scheme MyApp
```

### Custom Output Format

The auditor can be extended to output in different formats (JUnit, JSON, etc.) for CI integration.

## 📈 Version History

- **v1.0.0** (2025-12-26) - Initial protocol release
  - Build phase output fixes
  - CallSeqFactory compiler error fix
  - Full audit system
  - VS Code integration

---

**Protocol Maintained By:** Xcode Build Automation Team  
**Last Updated:** December 26, 2025  
**Status:** Active ✅
