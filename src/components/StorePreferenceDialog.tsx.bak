import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface StorePreferenceDialogProps {
  visible: boolean;
  category: string;
  onSubmit: (selectedStores: string[]) => void;
  onSkip: () => void;
}

// Store options by category
const STORE_OPTIONS: Record<string, Array<{ id: string; name: string; icon: string }>> = {
  groceries: [
    { id: 'whole-foods', name: 'Whole Foods', icon: '🥬' },
    { id: 'trader-joes', name: "Trader Joe's", icon: '🛒' },
    { id: 'safeway', name: 'Safeway', icon: '🏪' },
    { id: 'costco', name: 'Costco', icon: '📦' },
    { id: 'target', name: 'Target', icon: '🎯' },
    { id: 'walmart', name: 'Walmart', icon: '🏬' },
    { id: 'kroger', name: 'Kroger', icon: '🛍️' },
    { id: 'sprouts', name: 'Sprouts', icon: '🌿' },
  ],
  hardware: [
    { id: 'home-depot', name: 'Home Depot', icon: '🔨' },
    { id: 'lowes', name: "Lowe's", icon: '🔧' },
    { id: 'ace-hardware', name: 'Ace Hardware', icon: '⚒️' },
    { id: 'harbor-freight', name: 'Harbor Freight', icon: '🛠️' },
    { id: 'menards', name: 'Menards', icon: '🏗️' },
    { id: 'tractor-supply', name: 'Tractor Supply', icon: '🚜' },
  ],
  retail: [
    { id: 'target', name: 'Target', icon: '🎯' },
    { id: 'walmart', name: 'Walmart', icon: '🏬' },
    { id: 'amazon', name: 'Amazon', icon: '📦' },
    { id: 'best-buy', name: 'Best Buy', icon: '💻' },
    { id: 'kohls', name: "Kohl's", icon: '👔' },
    { id: 'macys', name: "Macy's", icon: '🏪' },
    { id: 'tj-maxx', name: 'TJ Maxx', icon: '🛍️' },
    { id: 'marshalls', name: 'Marshalls', icon: '👗' },
  ],
  medical: [
    { id: 'cvs', name: 'CVS', icon: '⚕️' },
    { id: 'walgreens', name: 'Walgreens', icon: '💊' },
    { id: 'rite-aid', name: 'Rite Aid', icon: '🏥' },
    { id: 'walmart-pharmacy', name: 'Walmart Pharmacy', icon: '💉' },
    { id: 'costco-pharmacy', name: 'Costco Pharmacy', icon: '📋' },
    { id: 'kroger-pharmacy', name: 'Kroger Pharmacy', icon: '🩺' },
  ],
  home: [
    { id: 'bed-bath-beyond', name: 'Bed Bath & Beyond', icon: '🛏️' },
    { id: 'container-store', name: 'Container Store', icon: '📦' },
    { id: 'ikea', name: 'IKEA', icon: '🪑' },
    { id: 'target', name: 'Target', icon: '🎯' },
    { id: 'homegoods', name: 'HomeGoods', icon: '🏠' },
    { id: 'wayfair', name: 'Wayfair', icon: '🛋️' },
  ],
  returns: [
    { id: 'amazon', name: 'Amazon', icon: '📦' },
    { id: 'target', name: 'Target', icon: '🎯' },
    { id: 'walmart', name: 'Walmart', icon: '🏬' },
    { id: 'costco', name: 'Costco', icon: '🔄' },
    { id: 'best-buy', name: 'Best Buy', icon: '💻' },
    { id: 'kohls', name: "Kohl's", icon: '↩️' },
  ],
  other: [
    { id: 'amazon', name: 'Amazon', icon: '📦' },
    { id: 'target', name: 'Target', icon: '🎯' },
    { id: 'walmart', name: 'Walmart', icon: '🏬' },
    { id: 'local-store', name: 'Local Store', icon: '🏪' },
  ],
};

const getCategoryTitle = (category: string): string => {
  const titles: Record<string, string> = {
    groceries: 'Grocery Stores',
    hardware: 'Hardware Stores',
    retail: 'Retail Stores',
    medical: 'Pharmacies',
    home: 'Home Stores',
    returns: 'Return Locations',
    other: 'Stores',
  };
  return titles[category] || 'Stores';
};

export const StorePreferenceDialog: React.FC<StorePreferenceDialogProps> = ({
  visible,
  category,
  onSubmit,
  onSkip,
}) => {
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set());

  const stores = STORE_OPTIONS[category] || STORE_OPTIONS.other;

  const toggleStore = (storeId: string) => {
    const newSelected = new Set(selectedStores);
    if (newSelected.has(storeId)) {
      newSelected.delete(storeId);
    } else {
      newSelected.add(storeId);
    }
    setSelectedStores(newSelected);
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedStores));
    setSelectedStores(new Set());
  };

  const handleSkip = () => {
    setSelectedStores(new Set());
    onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleSkip}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Your Preferred {getCategoryTitle(category)}</Text>
            <Text style={styles.subtitle}>
              Choose the stores you prefer to shop at for {category} items
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.storeGrid}>
              {stores.map(store => {
                const isSelected = selectedStores.has(store.id);
                return (
                  <TouchableOpacity
                    key={store.id}
                    style={[styles.storeCard, isSelected && styles.storeCardSelected]}
                    onPress={() => toggleStore(store.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.storeIcon}>{store.icon}</Text>
                    <Text
                      style={[styles.storeName, isSelected && styles.storeNameSelected]}
                      numberOfLines={2}
                    >
                      {store.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                We'll use these preferences to help you find the best deals and optimize your
                shopping trips!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                selectedStores.size === 0 && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={selectedStores.size === 0}
            >
              <Text style={styles.submitButtonText}>
                Save {selectedStores.size > 0 ? `(${selectedStores.size})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: palette.background,
    borderTopLeftRadius: radius.card * 2,
    borderTopRightRadius: radius.card * 2,
    maxHeight: '90%',
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
  },
  content: {
    padding: spacing.lg,
  },
  storeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  storeCard: {
    width: '47%',
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: palette.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    position: 'relative',
  },
  storeCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  checkbox: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  storeIcon: {
    fontSize: 32,
    marginTop: spacing.sm,
  },
  storeName: {
    ...typography.bodyBold,
    color: palette.text,
    textAlign: 'center',
    fontSize: 14,
  },
  storeNameSelected: {
    color: palette.primary,
  },
  tipBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: palette.infoLight,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.primary,
    marginBottom: spacing.md,
  },
  tipIcon: {
    fontSize: 20,
  },
  tipText: {
    ...typography.secondary,
    color: palette.primary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  skipButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skipButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  submitButtonDisabled: {
    backgroundColor: palette.border,
  },
  submitButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
});
