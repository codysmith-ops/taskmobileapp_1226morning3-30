import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface BrandPreferenceDialogProps {
  visible: boolean;
  itemName: string;
  category: string;
  onSelect: (brandPreference: BrandPreference) => void;
  onCancel: () => void;
}

export interface BrandPreference {
  preferredBrand?: string;
  acceptAlternatives: boolean;
  specificDetails?: string;
}

// Common brands by category
const BRAND_SUGGESTIONS: Record<string, string[]> = {
  groceries: [
    'Kirkland',
    'Great Value',
    'Whole Foods 365',
    "Trader Joe's",
    'Private Selection',
    'No Preference',
  ],
  hardware: ['DeWalt', 'Milwaukee', 'Craftsman', 'Ryobi', 'Husky', 'No Preference'],
  medical: ['Generic', 'Brand Name Only', 'Equate', 'CVS Health', 'Walgreens', 'No Preference'],
  retail: ['Any Brand', 'Store Brand Preferred', 'Premium Only', 'No Preference'],
  returns: ['Original Brand', 'No Preference'],
  home: ['Method', 'Seventh Generation', 'Lysol', 'Clorox', 'Store Brand', 'No Preference'],
  other: ['No Preference'],
};

export const BrandPreferenceDialog: React.FC<BrandPreferenceDialogProps> = ({
  visible,
  itemName,
  category,
  onSelect,
  onCancel,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [acceptAlternatives, setAcceptAlternatives] = useState(true);
  const [customBrand, setCustomBrand] = useState('');
  const [specificDetails, setSpecificDetails] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const brands = BRAND_SUGGESTIONS[category] || BRAND_SUGGESTIONS.other;

  const handleConfirm = () => {
    const brand = showCustomInput ? customBrand : selectedBrand;
    onSelect({
      preferredBrand: brand === 'No Preference' ? undefined : brand,
      acceptAlternatives,
      specificDetails: specificDetails.trim() || undefined,
    });

    // Reset state
    setSelectedBrand('');
    setCustomBrand('');
    setSpecificDetails('');
    setShowCustomInput(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Brand Preference</Text>
            <Text style={styles.subtitle}>for "{itemName}"</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Do you have a preferred brand?</Text>

            <View style={styles.brandGrid}>
              {brands.map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.brandOption,
                    selectedBrand === brand && styles.brandOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedBrand(brand);
                    setShowCustomInput(false);
                  }}
                >
                  <Text
                    style={[
                      styles.brandOptionText,
                      selectedBrand === brand && styles.brandOptionTextSelected,
                    ]}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[styles.brandOption, showCustomInput && styles.brandOptionSelected]}
                onPress={() => {
                  setShowCustomInput(true);
                  setSelectedBrand('');
                }}
              >
                <Text
                  style={[
                    styles.brandOptionText,
                    showCustomInput && styles.brandOptionTextSelected,
                  ]}
                >
                  ✏️ Other Brand
                </Text>
              </TouchableOpacity>
            </View>

            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <Text style={styles.label}>Enter brand name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Cascade, Tide"
                  value={customBrand}
                  onChangeText={setCustomBrand}
                  placeholderTextColor={palette.textTertiary}
                  autoFocus
                />
              </View>
            )}

            {(selectedBrand && selectedBrand !== 'No Preference') || showCustomInput ? (
              <View style={styles.alternativesSection}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setAcceptAlternatives(!acceptAlternatives)}
                >
                  <View style={[styles.checkbox, acceptAlternatives && styles.checkboxChecked]}>
                    {acceptAlternatives && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.checkboxLabel}>
                    <Text style={styles.checkboxText}>
                      Accept alternatives if brand unavailable
                    </Text>
                    <Text style={styles.checkboxSubtext}>
                      We'll suggest similar options if your preferred brand isn't found
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.detailsSection}>
              <Text style={styles.label}>Additional details (optional):</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Size, color, specific features..."
                value={specificDetails}
                onChangeText={setSpecificDetails}
                multiline
                numberOfLines={3}
                placeholderTextColor={palette.textTertiary}
              />
            </View>

            <View style={styles.tipBox}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                We'll remember your preference for similar items in the future!
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                !(selectedBrand || customBrand) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!(selectedBrand || customBrand)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
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
    maxHeight: '85%',
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
  sectionTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.md,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  brandOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.button,
    backgroundColor: palette.surface,
    borderWidth: 2,
    borderColor: palette.border,
  },
  brandOptionSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.infoLight,
  },
  brandOptionText: {
    ...typography.body,
    color: palette.textSecondary,
  },
  brandOptionTextSelected: {
    ...typography.bodyBold,
    color: palette.primary,
  },
  customInputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: palette.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  alternativesSection: {
    marginBottom: spacing.lg,
    backgroundColor: palette.surface,
    padding: spacing.md,
    borderRadius: radius.card,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  checkmark: {
    color: palette.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    flex: 1,
  },
  checkboxText: {
    ...typography.body,
    color: palette.text,
    marginBottom: 2,
  },
  checkboxSubtext: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  detailsSection: {
    marginBottom: spacing.lg,
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
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cancelButtonText: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  confirmButton: {
    flex: 2,
    paddingVertical: spacing.md,
    alignItems: 'center',
    backgroundColor: palette.primary,
    borderRadius: radius.button,
  },
  confirmButtonDisabled: {
    backgroundColor: palette.border,
  },
  confirmButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
});
