/**
 * Info Tooltip Component
 * "?" button that shows helpful explanations
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface InfoTooltipProps {
  title: string;
  body: string;
  footnote?: string;
  iconSize?: number;
  iconColor?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  body,
  footnote,
  iconSize = 16,
  iconColor = palette.textSecondary,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { width: iconSize, height: iconSize }]}
        onPress={() => setVisible(true)}
        accessibilityLabel={`Info: ${title}`}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { fontSize: iconSize * 0.7, color: iconColor }]}>?</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e: any) => e.stopPropagation()}
            >
              <View style={styles.modal}>
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.contentContainer}>
                  <Text style={styles.bodyText}>{body}</Text>
                  {footnote && <Text style={styles.footnote}>{footnote}</Text>}
                </ScrollView>

                <TouchableOpacity
                  style={styles.gotItButton}
                  onPress={() => setVisible(false)}
                >
                  <Text style={styles.gotItButtonText}>Got it!</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: palette.textSecondary,
    fontWeight: '300',
  },
  contentContainer: {
    maxHeight: 400,
  },
  bodyText: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 24,
  },
  footnote: {
    ...typography.secondary,
    color: palette.textTertiary,
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  gotItButton: {
    marginTop: spacing.lg,
    backgroundColor: palette.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  gotItButtonText: {
    ...typography.bodyBold,
    color: '#fff',
  },
});
