# 🚀 Quick iCloud Storage Optimization

## TL;DR - Run This Now

```bash
cd "/Users/codysmith/Library/Mobile Documents/com~apple~CloudDocs/Projects/taskmobileapp_1226morning"
./.nosync-optimize.sh
```

**Result**: Free up ~890MB of iCloud storage instantly! 🎉

## What This Does

Moves these large folders to `.nosync` versions (excluded from iCloud):
- ✅ node_modules (519MB)
- ✅ iOS build files (371MB)  
- ✅ Android builds
- ✅ Pods and caches

Your code keeps working normally via symlinks!

## Why This Works

**The .nosync Trick**: Any folder ending in `.nosync` stays on your Mac but doesn't sync to iCloud.

```
Before: node_modules/ → syncs to iCloud (519MB used)
After:  node_modules/ → symlink to node_modules.nosync/ (0MB used in iCloud!)
```

## Additional Mac Storage Tips

### 1. Enable iCloud Optimize Storage
System Settings → Apple ID → iCloud → ☑️ Optimize Mac Storage

### 2. Clean Xcode Junk (can free 10-50GB!)
```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 3. Clean npm/CocoaPods caches
```bash
npm cache clean --force
pod cache clean --all
```

### 4. Check what's using space
```bash
# See largest files in home directory
du -sh ~/* | sort -hr | head -20
```

## Need More Help?

See [ICLOUD_OPTIMIZATION_GUIDE.md](ICLOUD_OPTIMIZATION_GUIDE.md) for complete details.

---

**Pro Tip**: Enable "Optimize Mac Storage" in iCloud settings to automatically keep older files in the cloud only!
