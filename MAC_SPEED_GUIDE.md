# 🚀 Mac Speed Optimization Guide

## Quick Clean (Run This Now!)

```bash
cd "/Users/codysmith/Library/Mobile Documents/com~apple~CloudDocs/Projects/taskmobileapp_1226morning"
chmod +x speed-up-mac.sh
./speed-up-mac.sh
```

**Expected Result**: Free up 1-2GB instantly, possibly 10-50GB from Xcode caches!

## What Gets Cleaned

### In Your Project (~900MB)
- ✅ node_modules (519MB) - Reinstall with `npm install`
- ✅ iOS build outputs (371MB) - Regenerated on next build
- ✅ Android builds - Regenerated on next build
- ✅ CocoaPods - Reinstall with `pod install`

### System-Wide Caches (10-50GB potential!)
- ✅ Xcode DerivedData - Xcode's build cache
- ✅ Xcode Archives - Old app archives
- ✅ npm cache - Can be several GB
- ✅ yarn cache - Package manager cache
- ✅ CocoaPods cache - iOS dependencies
- ✅ Old iOS simulators - Unused simulator data
- ✅ System trash - Empty trash

## Why This Makes Your Mac Faster

### 1. Free Disk Space = Speed
- macOS slows down when disk is >80% full
- Needs space for virtual memory (swap)
- Spotlight indexing is faster with less files

### 2. Less to Index
- Fewer files for Spotlight to index
- Faster file searches
- Lower CPU usage in background

### 3. Cleaner Builds
- Fresh builds without old cache conflicts
- Xcode runs faster without huge DerivedData

## After Running the Script

### Restore Your Development Environment

```bash
# For MobileTodoList-iOS
cd MobileTodoList-iOS
npm install
cd ios && pod install && cd ..

# For MobileTodoList
cd ../MobileTodoList
npm install
cd ios && pod install && cd ..
```

### Check Your Results

```bash
# See how much space you have now
df -h /

# See what's still using space
du -sh ~/* | sort -hr | head -20
```

## Additional Mac Speed Tips

### 1. System Storage Management

Go to: **Apple Menu → About This Mac → Storage → Manage**

- Enable "Store in iCloud" (since you have plenty of iCloud space!)
- Enable "Optimize Storage" (downloads only when needed)
- Empty Trash Automatically
- Review Large Files

### 2. Disable Startup Items

System Settings → General → Login Items

Disable apps you don't need at startup.

### 3. Clean Up Downloads

```bash
# See what's in Downloads
du -sh ~/Downloads/*

# Archive or delete old files
```

### 4. Monitor Activity

Open Activity Monitor (Cmd+Space, type "Activity Monitor"):
- Check CPU tab - what's using CPU?
- Check Memory tab - memory pressure should be green
- Check Disk tab - what's writing to disk?

### 5. Rebuild Spotlight Index (if slow searches)

```bash
sudo mdutil -E /
```

### 6. Clean Browser Caches

Safari/Chrome/Firefox settings → Clear browsing data/cache

### 7. Update macOS

Ensure you're on the latest macOS version for performance improvements.

### 8. Check for Malware

Download Malwarebytes for Mac (free) and run a scan.

## Monthly Maintenance Routine

```bash
# Clean project files
./speed-up-mac.sh

# Clean browser cache
# (Use browser settings)

# Empty trash
rm -rf ~/.Trash/*

# Update everything
brew update && brew upgrade
npm update -g
```

## What NOT to Delete

❌ Don't delete:
- Your actual source code (src/, App.tsx, etc.)
- Configuration files (package.json, app.json, etc.)
- Git repositories (.git/)
- Documents and photos
- System files

✅ Safe to delete:
- node_modules (regenerate with npm install)
- Build outputs (build/, ios/build/, android/build/)
- Caches (DerivedData, npm cache, etc.)
- Old archives and backups you don't need

## Expected Performance Gains

### Before
- Disk: 80-90% full → Slow
- Spotlight: Indexing 1M+ files → Slow
- Xcode: Huge DerivedData → Slow builds
- RAM: Swapping to slow disk → Slow

### After
- Disk: 60-70% full → Fast ✨
- Spotlight: Fewer files → Fast ✨
- Xcode: Clean cache → Fast builds ✨
- RAM: More space for swap → Fast ✨

## Troubleshooting

### "Command not found" errors

The script handles missing commands gracefully. If you don't have npm, pod, etc., those steps are skipped.

### "Permission denied"

Run:
```bash
chmod +x speed-up-mac.sh
```

### Need to restore everything quickly

```bash
cd MobileTodoList-iOS
npm install && cd ios && pod install
```

### Xcode won't build after cleaning

Clean build folder in Xcode:
- Product → Clean Build Folder (Cmd+Shift+K)
- Then rebuild

## Pro Tips

### Use Time Machine

Before major cleanups, ensure Time Machine backup is current:
- System Settings → General → Time Machine
- Back up now

### Monitor Disk Space

Add to your shell profile (~/.zshrc):
```bash
alias diskspace='df -h / && echo "" && du -sh ~/* | sort -hr | head -10'
```

Then just type `diskspace` anytime.

### Automate Monthly Cleanup

Add to Calendar or Reminders:
"Run speed-up-mac.sh - Monthly cleanup"

---

**Last Updated**: December 31, 2025  
**Script Location**: [speed-up-mac.sh](speed-up-mac.sh)  
**Expected Cleanup**: 1-50GB depending on system state
