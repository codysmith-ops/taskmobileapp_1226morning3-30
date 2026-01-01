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
import { palette, spacing, radius, typography, shadow } from '../theme';

interface InfoTooltipProps {
  title: string;
  content: string;
  size?: number;
  color?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  content,
  size = 20,
  color = palette.primary,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { width: size, height: size }]}
        onPress={() => setVisible(true)}
        accessibilityLabel={`Info: ${title}`}
        accessibilityRole="button"
      >
        <Text style={[styles.buttonText, { fontSize: size * 0.7, color }]}>?</Text>
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
              onPress={e => e.stopPropagation()}
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
                  <Text style={styles.content}>{content}</Text>
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
    ...shadow.lg,
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
  content: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 24,
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
