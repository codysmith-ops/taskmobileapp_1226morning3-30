# iCloud Storage Optimization Guide

## 📊 Current Storage Usage

Your project is using approximately **894MB** of space, with the largest components being:

- **node_modules**: 519MB (iOS project)
- **ios build files**: 371MB
- Source code and docs: ~4MB

## 🎯 Optimization Strategy

### What Gets Optimized (Not Synced to iCloud)

The `.nosync` suffix tells iCloud to keep files locally but NOT sync them to the cloud:

1. **node_modules/** - Can be regenerated with `npm install`
2. **ios/Pods/** - Can be regenerated with `pod install`
3. **ios/build/** - Build outputs, regenerated on each build
4. **android/build/** - Build outputs, regenerated on each build
5. **ios/DerivedData/** - Xcode caches

### What Stays Synced

- Source code (src/)
- Configuration files (package.json, app.json, etc.)
- Documentation
- Assets and resources

## 🚀 Quick Start

### Option 1: Automated Optimization (Recommended)

Run the optimization script:

```bash
chmod +x .nosync-optimize.sh
./.nosync-optimize.sh
```

This will:
- Move large directories to `.nosync` versions
- Create symlinks so your projects work normally
- Free up **~890MB** of iCloud storage

### Option 2: Manual Optimization

If you prefer manual control:

```bash
cd MobileTodoList-iOS

# Move and symlink node_modules
mv node_modules node_modules.nosync
ln -s node_modules.nosync node_modules

# Move and symlink iOS Pods
cd ios
mv Pods Pods.nosync
ln -s Pods.nosync Pods
```

## 💡 How It Works

### The .nosync Suffix

Any folder with `.nosync` in its name is **excluded from iCloud sync**:

- ✅ Stays on your local Mac
- ❌ Does NOT sync to iCloud
- ❌ Does NOT count against iCloud storage quota
- ❌ Does NOT sync to other devices

### Symlinks

Symlinks (symbolic links) are shortcuts that point to the real location:

```
node_modules → node_modules.nosync
```

Your code sees `node_modules/` but it actually points to `node_modules.nosync/`, which isn't synced.

## 🔄 After Optimization

### Normal Development Continues

Everything works exactly the same:
- `npm install` - Works normally
- `npm start` - Works normally
- Xcode builds - Work normally

### Switching Computers

If you open this project on another Mac:

1. Clone/download the source code (it syncs via iCloud)
2. Run setup commands:
   ```bash
   cd MobileTodoList-iOS
   npm install
   cd ios && pod install
   ```

The `.nosync` folders get recreated locally on each machine.

## 📈 Expected Savings

| Item | Size | iCloud Impact |
|------|------|---------------|
| node_modules | 519MB | ❌ Not synced |
| iOS builds | 371MB | ❌ Not synced |
| Source code | ~4MB | ✅ Synced |
| **Total Saved** | **890MB** | **Free!** |

## 🔧 Additional Mac Storage Tips

### 1. Enable iCloud Storage Optimization

System Settings → Apple ID → iCloud → Optimize Mac Storage

This automatically keeps older/larger files in iCloud only.

### 2. Clean Xcode Derived Data

```bash
# Remove all Xcode derived data (can free several GB)
rm -rf ~/Library/Developer/Xcode/DerivedData
```

### 3. Clean npm/yarn cache

```bash
npm cache clean --force
yarn cache clean
```

### 4. Clean CocoaPods cache

```bash
pod cache clean --all
```

### 5. Remove old simulators

Open Xcode → Window → Devices and Simulators → Delete unused simulators

## ⚠️ Important Notes

1. **Backup First**: The script moves folders. While safe, consider backing up first.

2. **Git Ignore**: The `.gitignore` file has been updated to exclude `.nosync` folders from version control.

3. **CI/CD**: Your CI/CD systems will run `npm install` and `pod install` anyway, so this doesn't affect builds.

4. **Disk Space**: Files stay on your local disk. This optimizes iCloud storage, not local disk space.

## 🆘 Troubleshooting

### "Module not found" errors

Run:
```bash
cd MobileTodoList-iOS
npm install
```

### "Pod not found" errors

Run:
```bash
cd MobileTodoList-iOS/ios
pod install
```

### Restore original setup

```bash
# Remove symlinks and restore from .nosync
rm -rf node_modules
mv node_modules.nosync node_modules
```

## 📚 Learn More

- [Apple: iCloud Drive and .nosync](https://support.apple.com/en-us/HT201104)
- [Optimize Mac Storage](https://support.apple.com/en-us/HT206996)

---

**Last Updated**: December 31, 2025
**Storage Saved**: ~890MB from iCloud
**Projects Optimized**: MobileTodoList-iOS, MobileTodoList
