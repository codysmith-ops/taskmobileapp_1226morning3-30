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

export type NavigationPage = 'home' | 'account' | 'preferences' | 'integrations' | 'help';

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

  const menuItems = [
    { icon: '🏠', label: 'Home', page: 'home' as NavigationPage },
    { icon: '👤', label: 'Account', page: 'account' as NavigationPage },
    { icon: '⚙️', label: 'Preferences', page: 'preferences' as NavigationPage },
    { icon: '🔌', label: 'Integrations', page: 'integrations' as NavigationPage },
    { icon: '❓', label: 'Help & Support', page: 'help' as NavigationPage },
  ];

  return (
    <>
      {/* Header with Menu Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Manager</Text>
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
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
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
    fontSize: 24,
    width: 32,
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
