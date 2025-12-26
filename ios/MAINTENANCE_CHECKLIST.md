# MobileTodoList - Maintenance Checklist

## Weekly Tasks ✅

- [ ] Check for npm package updates: `npm outdated`
- [ ] Review and merge dependabot PRs
- [ ] Check error tracking dashboard (Sentry/Bugsnag)
- [ ] Review app performance metrics
- [ ] Check build status on CI/CD

## Monthly Tasks 📅

- [ ] Update React Native to latest patch version
- [ ] Update CocoaPods dependencies: `cd ios && pod update`
- [ ] Run security audit: `npm audit`
- [ ] Review and update deprecated APIs
- [ ] Check Xcode for new recommended settings
- [ ] Update iOS deployment target if needed
- [ ] Review app size and performance metrics

## Quarterly Tasks 🗓️

- [ ] Consider React Native minor version upgrade
- [ ] Review and update third-party dependencies
- [ ] Update Xcode to latest stable version
- [ ] Review and optimize bundle size
- [ ] Update documentation
- [ ] Review and update error boundaries
- [ ] Performance audit and optimization

## Before Each Release 🚀

- [ ] Run full test suite
- [ ] Test on physical devices (multiple iOS versions)
- [ ] Check for memory leaks
- [ ] Verify all environment configs
- [ ] Test deep links and notifications
- [ ] Review crash reports from previous version
- [ ] Update version numbers
- [ ] Generate release notes
- [ ] Create Git tag
- [ ] Archive build for TestFlight/App Store

## Emergency Checklist 🆘

If build suddenly breaks:

1. [ ] Check recent commits: `git log --oneline -10`
2. [ ] Try clean build: `npm run clean-all`
3. [ ] Check Node version: `node --version`
4. [ ] Check Xcode version and command line tools
5. [ ] Clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
6. [ ] Check for iOS SDK updates
7. [ ] Review recent package updates
8. [ ] Check GitHub issues for known problems
9. [ ] Try fresh clone and setup
10. [ ] Restore to last working commit if needed

## Dependency Update Strategy 📦

### Safe to update immediately:
- Patch versions (1.2.3 → 1.2.4)
- Development dependencies
- Documentation packages

### Test before updating:
- Minor versions (1.2.0 → 1.3.0)
- UI component libraries
- Navigation libraries

### Plan carefully:
- Major versions (1.x.x → 2.0.0)
- React Native core
- Native modules with breaking changes

## Health Indicators 🏥

Your project is healthy if:
- ✅ Builds complete in < 2 minutes (after first build)
- ✅ < 10 warnings in Xcode
- ✅ 0 critical errors
- ✅ All tests passing
- ✅ Bundle size < 50MB
- ✅ App startup < 3 seconds
- ✅ Crash rate < 1%
- ✅ Dependencies < 6 months old

## Useful Commands 💻

```bash
# Check bundle size
npx react-native-bundle-visualizer

# Analyze dependencies
npm ls --depth=0
npm list --depth=0 --dev

# Check for duplicate dependencies
npm dedupe

# Clean everything
npm run clean-all

# Update selective package
npm update @react-native-community/geolocation

# Check React Native info
npx react-native info

# iOS specific
cd ios && pod outdated
cd ios && pod update [POD_NAME]

# Clear watchman
watchman watch-del-all

# Reset Metro cache
npx react-native start --reset-cache
```

## Documentation to Maintain 📚

- [ ] README.md - Setup and basic usage
- [ ] CONTRIBUTING.md - Contribution guidelines
- [ ] CHANGELOG.md - Version history
- [ ] API.md - API documentation
- [ ] TROUBLESHOOTING.md - Common issues
- [ ] DEPLOYMENT.md - Release process
- [ ] ARCHITECTURE.md - Technical decisions

## Monitoring Dashboards 📊

Set up and regularly check:
- Error tracking (Sentry/Bugsnag)
- Analytics (Firebase/Mixpanel)
- Performance monitoring
- App Store ratings and reviews
- CI/CD build status
- Dependency security alerts

---

**Last Updated:** December 26, 2025  
**Review:** Every 3 months
