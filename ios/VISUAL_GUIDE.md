# iOS Build Fix - Visual Decision Tree

```
START HERE
    |
    v
┌─────────────────────────────────────────────┐
│  Do you want to just fix it quickly?        │
└─────────────────────────────────────────────┘
         |                         |
         v YES                     v NO
┌──────────────────┐         ┌──────────────────┐
│ Run automated    │         │ Want to diagnose │
│ script:          │         │ first?           │
│                  │         └──────────────────┘
│ chmod +x *.sh    │               |           |
│ ./fix_all_      │               v YES       v NO
│  build_issues.sh │         ┌──────────────────┐
└──────────────────┘         │ Run checker:     │
         |                   │ ./check_         │
         |                   │  environment.sh  │
         |                   └──────────────────┘
         |                            |
         v                            v
┌──────────────────────────────────────────────┐
│  Script completed?                            │
└──────────────────────────────────────────────┘
         |                         |
         v YES                     v NO (ERRORS)
┌──────────────────┐         ┌──────────────────┐
│ Open Xcode:      │         │ Check:           │
│                  │         │ - Permission?    │
│ open ios/*.xcw..│         │ - Tools install? │
│                  │         │ - Internet ok?   │
│ Clean: ⇧⌘K      │         │                  │
│ Build: ⌘B       │         │ See TROUBLESHOOT │
└──────────────────┘         └──────────────────┘
         |
         v
┌──────────────────────────────────────────────┐
│  Build succeeded?                             │
└──────────────────────────────────────────────┘
         |                         |
         v YES                     v NO
┌──────────────────┐         ┌──────────────────┐
│   SUCCESS! 🎉    │         │ Still failing?   │
│                  │         │                  │
│ Your app builds! │         │ Check error type:│
└──────────────────┘         └──────────────────┘
                                      |
                      ┌───────────────┼───────────────┐
                      v               v               v
              ┌────────────┐  ┌────────────┐  ┌────────────┐
              │ Sandbox    │  │ Duplicate  │  │ Other      │
              │ errors     │  │ -lc++      │  │ errors     │
              └────────────┘  └────────────┘  └────────────┘
                      |               |               |
                      v               v               v
              ┌────────────┐  ┌────────────┐  ┌────────────┐
              │ Add to     │  │ Run:       │  │ Read       │
              │ Podfile:   │  │ python3    │  │ FIX_BUILD_ │
              │            │  │ fix_dup... │  │ ERRORS.md  │
              │ ENABLE_..  │  │ .py        │  │            │
              │ SANDBOXING │  │            │  │ Search for │
              │ = 'NO'     │  │ Then       │  │ your error │
              │            │  │ rebuild    │  │            │
              │ pod install│  └────────────┘  └────────────┘
              └────────────┘
                      |
                      v
              ┌────────────────┐
              │ Rebuild        │
              │                │
              │ Still failing? │
              │ Nuclear option:│
              └────────────────┘
                      |
                      v
              ┌─────────────────────────────────┐
              │ rm -rf ~/Library/Developer/     │
              │        Xcode/DerivedData        │
              │ rm -rf ios/Pods ios/build       │
              │ rm -rf node_modules             │
              │ npm install                     │
              │ cd ios && pod install && cd ..  │
              │ RESTART MAC                     │
              └─────────────────────────────────┘
```

---

## 🎯 Quick Reference Commands

### Essential Commands (Copy-Paste Ready)

```bash
# Full automated fix
chmod +x fix_all_build_issues.sh && ./fix_all_build_issues.sh

# Check environment
chmod +x check_environment.sh && ./check_environment.sh

# Fix duplicate -lc++ only
python3 fix_duplicate_lc++.py

# Clean build artifacts
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build ios/Pods ios/Podfile.lock

# Reinstall dependencies
rm -rf node_modules && npm install
cd ios && pod install && cd ..

# Nuclear option (last resort)
killall Xcode
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build ios/Pods ios/Podfile.lock
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
cd ios && pod deintegrate && pod cache clean --all && pod install && cd ..
```

---

## 🚦 Error Type Quick Guide

| Error Message | Quick Fix | File Reference |
|---------------|-----------|----------------|
| `Sandbox: rsync deny` | Add `ENABLE_USER_SCRIPT_SANDBOXING = 'NO'` to Podfile | Podfile.recommended |
| `Ignoring duplicate libraries: '-lc++'` | Run `python3 fix_duplicate_lc++.py` | fix_duplicate_lc++.py |
| `Search path ... not found` | Safe to ignore (cosmetic) | FIX_BUILD_ERRORS.md |
| `Cannot find protocol definition` | Clean reinstall: `rm -rf ios/Pods && cd ios && pod install` | QUICK_FIX.md |
| `Update to recommended settings` | Click "Perform Changes" in Xcode | README.md |

---

## 📊 Time Estimates

| Task | Time Required |
|------|---------------|
| Run automated script | 5-10 minutes |
| Manual fix | 10-15 minutes |
| Nuclear option | 15-20 minutes |
| Check environment | 1 minute |

---

## 🎓 One-Liner Solutions

### Just Want to Build?
```bash
./fix_all_build_issues.sh && open ios/*.xcworkspace
```

### Want to Check First?
```bash
./check_environment.sh && read -p "Press enter to fix..." && ./fix_all_build_issues.sh
```

### Already Tried Everything?
```bash
killall Xcode; rm -rf ~/Library/Developer/Xcode/DerivedData ios/{build,Pods} node_modules; npm i; cd ios && pod install && cd ..; open ios/*.xcworkspace
```

---

## 🔍 Specific Error Lookups

### "Operation not permitted"
→ System permissions issue  
→ Grant Full Disk Access to Xcode and Terminal  
→ System Settings → Privacy & Security → Full Disk Access

### "rsync exited with status 23"
→ Sandbox blocking file access  
→ Add to Podfile: `config.build_settings['ENABLE_USER_SCRIPT_SANDBOXING'] = 'NO'`  
→ Then: `cd ios && pod install && cd ..`

### "unlinkat: Operation not permitted"
→ Same as rsync issue above  
→ Also try: `rm -rf ~/Library/Developer/Xcode/DerivedData`

### "Cannot find protocol definition for 'RCTBridgeDelegate'"
→ Header search path issue  
→ Clean pods: `cd ios && rm -rf Pods Podfile.lock && pod install && cd ..`

### "child 28959 exited with status 23"
→ Build script failure  
→ Usually sandbox related  
→ Apply Podfile fixes from Podfile.recommended

---

## 📋 Checklist Format

Print this and check off as you go:

```
iOS Build Fix Checklist
========================

Pre-Fix:
□ Read QUICK_FIX.md
□ Backup project (optional but recommended)
□ Close Xcode completely
□ Close iOS Simulator

Automated Fix:
□ chmod +x fix_all_build_issues.sh
□ Run ./fix_all_build_issues.sh
□ Wait for completion (5-10 min)
□ Read the output carefully

Manual Verification:
□ Open workspace: open ios/*.xcworkspace
□ Clean: Product → Clean Build Folder (⇧⌘K)
□ Build: Product → Build (⌘B)
□ Check for errors in Issue Navigator

Success Criteria:
□ No red errors in Xcode
□ Build succeeds
□ App runs in simulator
□ No sandbox warnings in logs
□ No duplicate -lc++ warning

If Still Failing:
□ Run check_environment.sh
□ Check specific error in FIX_BUILD_ERRORS.md
□ Try nuclear option commands
□ Restart Mac if needed

Post-Fix:
□ Test app functionality
□ Commit Podfile changes
□ Document any additional changes made
```

---

## 🎨 Color-Coded Severity

```
🟢 GREEN - Safe to ignore
   - "Search path '/var/run/.../MetalToolchain...' not found"
   - Some deprecation warnings

🟡 YELLOW - Fix recommended
   - "Ignoring duplicate libraries: '-lc++'"
   - "Update to recommended settings"

🔴 RED - Must fix
   - "Sandbox: rsync deny"
   - "Cannot find protocol definition"
   - "Operation not permitted"
   - Build failures
```

---

## 🎯 Success Indicators

You know it's fixed when you see:

```
✅ Build Succeeded
   - Xcode shows green checkmark
   - No errors in Issue Navigator
   - Build time shown (e.g., "Succeeded | 45.3 seconds")

✅ App Launches
   - Simulator opens
   - App icon appears
   - App loads without crash
   - UI is visible

✅ Clean Logs
   - No sandbox warnings
   - No duplicate library warnings
   - No permission errors
   - Only normal React Native logs
```

---

## 📞 When to Ask for Help

Try these solutions first, but seek additional help if:

- ❌ Automated script fails with unexplained errors
- ❌ Nuclear option doesn't work
- ❌ Different errors appear after fixes
- ❌ Can't install CocoaPods or npm packages
- ❌ Xcode won't open the workspace
- ❌ Mac permissions can't be granted

Where to get help:
- React Native Discord
- Stack Overflow (tag: react-native, ios)
- GitHub Issues (for specific packages)

---

## 💡 Pro Tips

1. **Always use .xcworkspace** not .xcodeproj
2. **Clean before pod install**: `rm -rf ios/Pods ios/Podfile.lock`
3. **Close Xcode** before running fix scripts
4. **Restart Mac** if build issues persist after all fixes
5. **Update Xcode** via App Store regularly
6. **Keep backups** of working Podfile configurations

---

*This visual guide is part of the iOS Build Fix Package*  
*For detailed information, see: README.md, QUICK_FIX.md, or FIX_BUILD_ERRORS.md*
