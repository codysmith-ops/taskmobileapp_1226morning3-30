import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';
import {
  ChartIcon,
  DollarIcon,
  TrendUpIcon,
  LightbulbIcon,
  CreditCardIcon,
  BellIcon,
  UsersIcon,
  CalendarIcon,
  CheckmarkIcon,
  LocationIcon,
  CameraIcon,
} from './Icons';
import { EllioLogo } from './EllioLogo';

export type NavigationPage =
  | 'home'
  | 'account'
  | 'preferences'
  | 'integrations'
  | 'help'
  | 'chat'
  | 'notifications'
  | 'reports'
  | 'team'
  | 'receipts'
  | 'budget'
  | 'family'
  | 'cashback'
  | 'savingsdashboard'
  | 'weeklysummary'
  | 'monthlyreport'
  | 'insights'
  | 'timeline'
  | 'analytics'
  | 'auditlog'
  | 'search'
  | 'export'
  | 'calendar'
  | 'documents'
  | 'approvals'
  | 'templates'
  | 'admin'
  | 'syncstatus'
  | 'compliance'
  | 'shoppinglist';

interface NavigationMenuProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  userName?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  currentPage,
  onNavigate,
  userName = 'User',
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleNavigate = (page: NavigationPage) => {
    closeMenu();
    setTimeout(() => onNavigate(page), 250);
  };

  const getIconForPage = (page: NavigationPage, isActive: boolean) => {
    const color = isActive ? palette.primary : palette.textSecondary;
    const size = 20;

    switch (page) {
      case 'home':
        return <CheckmarkIcon size={size} color={color} />;
      case 'shoppinglist':
        return <CheckmarkIcon size={size} color={color} />;
      case 'timeline':
        return <CalendarIcon size={size} color={color} />;
      case 'analytics':
        return <ChartIcon size={size} color={color} />;
      case 'savingsdashboard':
        return <DollarIcon size={size} color={color} />;
      case 'weeklysummary':
        return <CalendarIcon size={size} color={color} />;
      case 'monthlyreport':
        return <TrendUpIcon size={size} color={color} />;
      case 'insights':
        return <LightbulbIcon size={size} color={color} />;
      case 'receipts':
        return <CameraIcon size={size} color={color} />;
      case 'budget':
        return <DollarIcon size={size} color={color} />;
      case 'family':
        return <UsersIcon size={size} color={color} />;
      case 'cashback':
        return <CreditCardIcon size={size} color={color} />;
      case 'chat':
        return <UsersIcon size={size} color={color} />;
      case 'notifications':
        return <BellIcon size={size} color={color} />;
      case 'team':
        return <UsersIcon size={size} color={color} />;
      case 'account':
        return <CheckmarkIcon size={size} color={color} />;
      case 'preferences':
        return <CheckmarkIcon size={size} color={color} />;
      case 'integrations':
        return <CheckmarkIcon size={size} color={color} />;
      case 'help':
        return <LightbulbIcon size={size} color={color} />;
      default:
        return <CheckmarkIcon size={size} color={color} />;
    }
  };

  const menuItems = [
    { icon: 'home', label: 'Home', page: 'home' as NavigationPage },
    { icon: 'shoppinglist', label: 'Shopping List', page: 'shoppinglist' as NavigationPage },
    { icon: 'timeline', label: 'Timeline', page: 'timeline' as NavigationPage },
    { icon: 'analytics', label: 'Task Analytics', page: 'analytics' as NavigationPage },
    {
      icon: 'savingsdashboard',
      label: 'Savings Dashboard',
      page: 'savingsdashboard' as NavigationPage,
    },
    { icon: 'weeklysummary', label: 'Weekly Summary', page: 'weeklysummary' as NavigationPage },
    { icon: 'monthlyreport', label: 'Monthly Report', page: 'monthlyreport' as NavigationPage },
    { icon: 'insights', label: 'Insights', page: 'insights' as NavigationPage },
    { icon: 'receipts', label: 'Receipts', page: 'receipts' as NavigationPage },
    { icon: 'budget', label: 'Budget', page: 'budget' as NavigationPage },
    { icon: 'family', label: 'Family', page: 'family' as NavigationPage },
    { icon: 'cashback', label: 'Cashback', page: 'cashback' as NavigationPage },
    { icon: 'chat', label: 'Messages', page: 'chat' as NavigationPage },
    { icon: 'notifications', label: 'Notifications', page: 'notifications' as NavigationPage },
    { icon: 'team', label: 'Team', page: 'team' as NavigationPage },
    { icon: 'auditlog', label: 'Audit Log', page: 'auditlog' as NavigationPage },
    { icon: 'search', label: 'Search', page: 'search' as NavigationPage },
    { icon: 'export', label: 'Export', page: 'export' as NavigationPage },
    { icon: 'calendar', label: 'Calendar', page: 'calendar' as NavigationPage },
    { icon: 'documents', label: 'Documents', page: 'documents' as NavigationPage },
    { icon: 'approvals', label: 'Approvals', page: 'approvals' as NavigationPage },
    { icon: 'templates', label: 'Templates', page: 'templates' as NavigationPage },
    { icon: 'admin', label: 'Admin Panel', page: 'admin' as NavigationPage },
    { icon: 'syncstatus', label: 'Sync Status', page: 'syncstatus' as NavigationPage },
    { icon: 'compliance', label: 'Compliance', page: 'compliance' as NavigationPage },
    { icon: 'account', label: 'Account', page: 'account' as NavigationPage },
    { icon: 'preferences', label: 'Preferences', page: 'preferences' as NavigationPage },
    { icon: 'integrations', label: 'Integrations', page: 'integrations' as NavigationPage },
    { icon: 'help', label: 'Help & Support', page: 'help' as NavigationPage },
  ];

  return (
    <>
      {/* Header with Menu Button and Logo */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <EllioLogo size={28} showText={false} />
          <Text style={styles.headerTitle}>ellio</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {/* Dropdown Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="none" onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeMenu}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuUserName}>{userName}</Text>
              <Text style={styles.menuUserEmail}>Signed in</Text>
            </View>

            <View style={styles.menuDivider} />

            <ScrollView style={styles.menuItems}>
              {menuItems.map(item => (
                <TouchableOpacity
                  key={item.page}
                  style={[styles.menuItem, currentPage === item.page && styles.menuItemActive]}
                  onPress={() => handleNavigate(item.page)}
                >
                  <View style={styles.menuItemIcon}>
                    {getIconForPage(item.page, currentPage === item.page)}
                  </View>
                  <Text
                    style={[
                      styles.menuItemLabel,
                      currentPage === item.page && styles.menuItemLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {currentPage === item.page && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  menuButton: {
    padding: spacing.sm,
  },
  menuIcon: {
    gap: 4,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: palette.primary,
    borderRadius: 2,
  },
  headerTitle: {
    ...typography.subtitle,
    color: palette.text,
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    marginLeft: spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: palette.overlay,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: '80%',
  },
  menuHeader: {
    padding: spacing.lg,
    backgroundColor: palette.primary,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  menuUserName: {
    ...typography.subtitle,
    color: palette.surface,
    marginBottom: 4,
  },
  menuUserEmail: {
    ...typography.secondary,
    color: palette.labelOnDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: palette.border,
  },
  menuItems: {
    maxHeight: 400,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  menuItemActive: {
    backgroundColor: palette.infoLight,
  },
  menuItemIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    ...typography.body,
    color: palette.text,
    flex: 1,
  },
  menuItemLabelActive: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.primary,
  },
});
