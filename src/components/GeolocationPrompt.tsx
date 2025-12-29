import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { palette, spacing, radius, typography, shadow } from '../theme';
import { LocationIcon, ReceiptIcon, CameraIcon } from './Icons';

interface GeolocationPromptProps {
  visible: boolean;
  storeName?: string;
  onUploadReceipt: (imageUri?: string) => void;
  onDismiss: () => void;
}

export const GeolocationPrompt: React.FC<GeolocationPromptProps> = ({
  visible,
  storeName = 'this location',
  onUploadReceipt,
  onDismiss,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
    });

    if (result.assets && result.assets[0]) {
      onUploadReceipt(result.assets[0].uri);
    }
    onDismiss();
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={handleSkip}>
        <Animated.View
          style={[
            styles.promptCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconGroup}>
              <LocationIcon size={28} color={palette.primary} />
              <ReceiptIcon size={28} color={palette.primary} />
            </View>
          </View>
          <Text style={styles.title}>Leaving {storeName}?</Text>
          <Text style={styles.message}>
            Did you make a purchase? Upload your receipt to track spending and maximize cashback
            rewards!
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
              <View style={styles.uploadButtonContent}>
                <CameraIcon size={18} color={palette.surface} />
                <Text style={styles.uploadButtonText}>Upload Receipt</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>No Thanks</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  promptCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...shadow.large,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    ...typography.h3,
    color: palette.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  uploadButton: {
    backgroundColor: palette.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  uploadButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  uploadButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
    fontSize: 16,
  },
  skipButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    alignItems: 'center',
  },
  skipButtonText: {
    ...typography.body,
    color: palette.textSecondary,
  },
});
