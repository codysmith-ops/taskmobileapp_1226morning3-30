import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { palette, spacing, radius, typography } from '../theme';
import { LocationIcon, CameraIcon, CheckmarkIcon } from '../components/Icons';
import {
  calculateReceiptSavings,
  getWeeklySavings,
  getSavingsExplanation,
  type SavingsLog,
  type WeeklySavings,
  type PriceComparison,
} from '../services/priceAccuracy.service';

interface ReceiptItem {
  name: string;
  price: number;
  category: string;
}

interface ScannedReceipt {
  id: string;
  date: string;
  storeName: string;
  total: number;
  items: ReceiptItem[];
  imageUri?: string;
  location?: string;
  estimatedRewards: {
    card: string;
    amount: number;
    percentage: number;
  }[];
  savingsLog?: SavingsLog;
  priceComparisons?: PriceComparison[];
}

export const ReceiptScannerPage: React.FC = () => {
  const [receipts, setReceipts] = useState<ScannedReceipt[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000).toISOString(),
      storeName: 'Whole Foods',
      total: 127.45,
      items: [
        { name: 'Organic Vegetables', price: 23.5, category: 'Groceries' },
        { name: 'Chicken Breast', price: 18.99, category: 'Groceries' },
        { name: 'Milk & Eggs', price: 12.5, category: 'Groceries' },
      ],
      location: '123 Main St',
      estimatedRewards: [
        { card: 'Chase Sapphire', amount: 6.37, percentage: 5 },
        { card: 'Amex Gold', amount: 5.1, percentage: 4 },
      ],
    },
  ]);
  const [scanning, setScanning] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ScannedReceipt | null>(null);
  const [weeklySavings, setWeeklySavings] = useState<WeeklySavings | null>(null);

  useEffect(() => {
    loadWeeklySavings();
  }, [receipts]);

  const loadWeeklySavings = async () => {
    const savings = await getWeeklySavings();
    setWeeklySavings(savings);
  };

  const handleTakePhoto = async () => {
    try {
      console.log('📸 Attempting to launch camera...');
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        saveToPhotos: false,
        includeBase64: false,
      });

      console.log('📸 Camera result:', result);

      if (result.didCancel) {
        console.log('📸 User cancelled camera');
        return;
      }

      if (result.errorCode) {
        console.error('📸 Camera error:', result.errorCode, result.errorMessage);
        Alert.alert(
          'Camera Error',
          result.errorMessage || 'Unable to open camera. Please check permissions in Settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (result.assets && result.assets[0]) {
        console.log('📸 Photo captured successfully:', result.assets[0].uri);
        processReceipt(result.assets[0].uri);
      } else {
        console.log('📸 No image captured');
        Alert.alert('No Image', 'No photo was captured. Please try again.');
      }
    } catch (error) {
      console.error('📸 Camera exception:', error);
      Alert.alert(
        'Camera Error',
        'Failed to open camera. Please ensure camera permissions are granted in Settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleChoosePhoto = async () => {
    try {
      console.log('🖼️ Attempting to launch photo library...');
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      });

      console.log('🖼️ Photo library result:', result);

      if (result.didCancel) {
        console.log('🖼️ User cancelled photo selection');
        return;
      }

      if (result.errorCode) {
        console.error('🖼️ Photo library error:', result.errorCode, result.errorMessage);
        Alert.alert(
          'Photo Library Error',
          result.errorMessage || 'Unable to access photo library.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (result.assets && result.assets[0]) {
        console.log('🖼️ Photo selected successfully:', result.assets[0].uri);
        processReceipt(result.assets[0].uri);
      }
    } catch (error) {
      console.error('🖼️ Photo library exception:', error);
      Alert.alert('Photo Library Error', 'Failed to access photo library.');
    }
  };

  const processReceipt = async (imageUri?: string) => {
    setScanning(true);

    // Simulate OCR processing
    setTimeout(async () => {
      const mockItems = [
        { name: 'Household Items', price: 45.5, category: 'Home' },
        { name: 'Electronics', price: 44.49, category: 'Electronics' },
      ];
      
      const mockStoreName = 'Target';
      const mockTotal = mockItems.reduce((sum, item) => sum + item.price, 0);
      
      // Calculate price accuracy and savings
      const savingsLog = await calculateReceiptSavings(
        `receipt_${Date.now()}`,
        mockStoreName,
        mockItems,
        'Target\n123 Main St\nSan Francisco, CA 94102' // Mock receipt text with location
      );
      
      const mockReceipt: ScannedReceipt = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        storeName: mockStoreName,
        total: mockTotal,
        items: mockItems,
        imageUri,
        location: savingsLog.location.storeAddress || 'Current Location',
        estimatedRewards: [
          { card: 'Chase Freedom', amount: 4.5, percentage: 5 },
          { card: 'Citi Double Cash', amount: 1.8, percentage: 2 },
        ],
        savingsLog,
        priceComparisons: savingsLog.itemComparisons,
      };

      setReceipts([mockReceipt, ...receipts]);
      setScanning(false);
      
      const savingsText = savingsLog.totalSavings > 0
        ? `You saved $${savingsLog.totalSavings.toFixed(2)} vs. area average!`
        : savingsLog.totalSavings < -1
        ? `Price was $${Math.abs(savingsLog.totalSavings).toFixed(2)} above area average`
        : 'Prices match area average';
      
      Alert.alert(
        'Receipt Scanned!',
        `Total: $${mockReceipt.total.toFixed(2)}\n${savingsText}\nEstimated Rewards: $${mockReceipt.estimatedRewards[0].amount.toFixed(2)}`,
        [
          { text: 'View Details', onPress: () => setSelectedReceipt(mockReceipt) },
          { text: 'OK' },
        ]
      );
    }, 2000);
  };

  const calculateTotalRewards = () => {
    return receipts.reduce((sum, receipt) => {
      const bestReward = receipt.estimatedRewards[0]?.amount || 0;
      return sum + bestReward;
    }, 0);
  };

  if (selectedReceipt) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedReceipt(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receipt Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.detailsScroll}>
          {selectedReceipt.imageUri && (
            <Image source={{ uri: selectedReceipt.imageUri }} style={styles.receiptImage} />
          )}

          <View style={styles.detailsCard}>
            <Text style={styles.storeName}>{selectedReceipt.storeName}</Text>
            <Text style={styles.receiptDate}>
              {new Date(selectedReceipt.date).toLocaleDateString()}
            </Text>
            {selectedReceipt.location && (
              <View style={styles.locationRow}>
                <LocationIcon size={14} color={palette.textSecondary} />
                <Text style={styles.location}>{selectedReceipt.location}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Items</Text>
            {selectedReceipt.items.map((item, index) => {
              const comparison = selectedReceipt.priceComparisons?.find(
                c => c.itemName === item.name
              );
              return (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    {comparison && (
                      <View style={styles.priceComparisonRow}>
                        {comparison.savings > 0.25 ? (
                          <View style={styles.savingsBadge}>
                            <CheckmarkIcon size={12} color={palette.success} />
                            <Text style={styles.savingsText}>
                              Saved ${comparison.savings.toFixed(2)} vs. avg
                            </Text>
                          </View>
                        ) : comparison.savings < -0.25 ? (
                          <Text style={styles.overpaidText}>
                            ${Math.abs(comparison.savings).toFixed(2)} above avg
                          </Text>
                        ) : (
                          <Text style={styles.fairPriceText}>Fair price</Text>
                        )}
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
              );
            })}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${selectedReceipt.total.toFixed(2)}</Text>
            </View>
            {selectedReceipt.savingsLog && (
              <View style={styles.savingsSummaryRow}>
                {selectedReceipt.savingsLog.totalSavings > 0 ? (
                  <>
                    <Text style={styles.savingsSummaryLabel}>
                      💰 You saved vs. area average
                    </Text>
                    <Text style={styles.savingsSummaryAmount}>
                      ${selectedReceipt.savingsLog.totalSavings.toFixed(2)}
                    </Text>
                  </>
                ) : selectedReceipt.savingsLog.totalSavings < -1 ? (
                  <>
                    <Text style={styles.overpaidSummaryLabel}>
                      ⚠️ Paid above area average
                    </Text>
                    <Text style={styles.overpaidSummaryAmount}>
                      ${Math.abs(selectedReceipt.savingsLog.totalSavings).toFixed(2)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.fairPriceSummary}>
                    ✓ Prices match area average
                  </Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Estimated Rewards</Text>
            {selectedReceipt.estimatedRewards.map((reward, index) => (
              <View key={index} style={styles.rewardRow}>
                <View style={styles.rewardInfo}>
                  <Text style={styles.cardName}>{reward.card}</Text>
                  <Text style={styles.rewardPercentage}>{reward.percentage}% cashback</Text>
                </View>
                <Text style={styles.rewardAmount}>+${reward.amount.toFixed(2)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Receipt Scanner</Text>
        <View style={styles.rewardsBadge}>
          <Text style={styles.rewardsText}>
            ${weeklySavings ? weeklySavings.totalSaved.toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.rewardsLabel}>
            {weeklySavings && weeklySavings.receiptsCount > 0
              ? `Saved This Week (${weeklySavings.receiptsCount} receipts)`
              : 'Scan receipts to see savings'}
          </Text>
          {weeklySavings && weeklySavings.receiptsCount >= 3 && (
            <TouchableOpacity
              style={styles.howCalculatedButton}
              onPress={() => {
                Alert.alert(
                  '💡 How We Calculate Savings',
                  `Ellio compares your receipt prices to:\n\n1. Average prices in your area (county + ZIP)\n2. Prices at other stores you've shopped\n3. Historical prices for the same items\n\nThis week: ${weeklySavings.receiptsCount} receipts analyzed\nTotal saved: $${weeklySavings.totalSaved.toFixed(2)}\n\nData source: Your receipts + aggregated pricing data from your area (no GPS).`,
                  [{ text: 'Got it' }]
                );
              }}
            >
              <Text style={styles.howCalculatedText}>How is this calculated?</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.scanButtons}>
        <TouchableOpacity
          style={[styles.scanButton, styles.cameraButton]}
          onPress={handleTakePhoto}
          disabled={scanning}
        >
          <CameraIcon size={32} color={palette.surface} />
          <Text style={styles.scanButtonText}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.scanButton, styles.galleryButton]}
          onPress={handleChoosePhoto}
          disabled={scanning}
        >
          <CameraIcon size={32} color={palette.surface} />
          <Text style={styles.scanButtonText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      {scanning && (
        <View style={styles.scanningOverlay}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={styles.scanningText}>Scanning receipt...</Text>
          <Text style={styles.scanningSubtext}>Processing with OCR</Text>
        </View>
      )}

      <ScrollView style={styles.receiptsList}>
        <Text style={styles.listTitle}>Recent Receipts ({receipts.length})</Text>
        {receipts.map(receipt => (
          <TouchableOpacity
            key={receipt.id}
            style={styles.receiptCard}
            onPress={() => setSelectedReceipt(receipt)}
          >
            <View style={styles.receiptIcon}>
              <CameraIcon size={24} color={palette.primary} />
            </View>
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptStoreName}>{receipt.storeName}</Text>
              <Text style={styles.receiptDateSmall}>
                {new Date(receipt.date).toLocaleDateString()}
              </Text>
              {receipt.location && (
                <View style={styles.receiptLocationRow}>
                  <LocationIcon size={11} color={palette.textTertiary} />
                  <Text style={styles.receiptLocation}>{receipt.location}</Text>
                </View>
              )}
            </View>
            <View style={styles.receiptAmounts}>
              <Text style={styles.receiptTotal}>${receipt.total.toFixed(2)}</Text>
              <Text style={styles.receiptReward}>
                +${receipt.estimatedRewards[0]?.amount.toFixed(2) || '0.00'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.sm,
  },
  backButton: {
    ...typography.body,
    color: palette.primary,
    marginBottom: spacing.sm,
  },
  headerSpacer: {
    width: 60,
  },
  rewardsBadge: {
    backgroundColor: palette.successLight,
    padding: spacing.md,
    borderRadius: radius.card,
    alignItems: 'center',
  },
  rewardsText: {
    ...typography.h2,
    color: palette.success,
    fontWeight: '700',
  },
  rewardsLabel: {
    ...typography.secondary,
    color: palette.success,
  },
  howCalculatedButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  howCalculatedText: {
    ...typography.secondary,
    color: palette.primary,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  scanButtons: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  scanButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.card,
    alignItems: 'center',
    gap: spacing.sm,
  },
  cameraButton: {
    backgroundColor: palette.primary,
  },
  galleryButton: {
    backgroundColor: palette.info,
  },
  scanIcon: {
    fontSize: 32,
  },
  scanButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  scanningText: {
    ...typography.h3,
    color: palette.surface,
    marginTop: spacing.lg,
  },
  scanningSubtext: {
    ...typography.body,
    color: palette.textInverse,
    marginTop: spacing.sm,
  },
  receiptsList: {
    flex: 1,
  },
  listTitle: {
    ...typography.bodyBold,
    color: palette.text,
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  receiptCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  receiptIcon: {
    width: 48,
    height: 48,
    backgroundColor: palette.background,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  receiptIconText: {
    fontSize: 24,
  },
  receiptInfo: {
    flex: 1,
  },
  receiptStoreName: {
    ...typography.bodyBold,
    color: palette.text,
  },
  receiptDateSmall: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 12,
  },
  receiptLocation: {
    ...typography.secondary,
    color: palette.textTertiary,
    fontSize: 11,
  },
  receiptAmounts: {
    alignItems: 'flex-end',
  },
  receiptTotal: {
    ...typography.bodyBold,
    color: palette.text,
  },
  receiptReward: {
    ...typography.secondary,
    color: palette.success,
    fontWeight: '600',
  },
  detailsScroll: {
    flex: 1,
  },
  receiptImage: {
    width: '100%',
    height: 300,
    backgroundColor: palette.background,
  },
  detailsCard: {
    margin: spacing.md,
    padding: spacing.lg,
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  storeName: {
    ...typography.h3,
    color: palette.text,
    marginBottom: spacing.xs,
  },
  receiptDate: {
    ...typography.body,
    color: palette.textSecondary,
  },
  location: {
    ...typography.secondary,
    color: palette.textTertiary,
    marginTop: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  receiptLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: palette.text,
    marginBottom: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: palette.text,
  },
  itemCategory: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 12,
  },
  priceComparisonRow: {
    marginTop: spacing.xs,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  savingsText: {
    ...typography.secondary,
    color: palette.success,
    fontSize: 12,
    fontWeight: '600',
  },
  overpaidText: {
    ...typography.secondary,
    color: palette.warning,
    fontSize: 12,
  },
  fairPriceText: {
    ...typography.secondary,
    color: palette.textSecondary,
    fontSize: 12,
  },
  savingsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 2,
    borderTopColor: palette.successLight,
    backgroundColor: palette.successLight,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  savingsSummaryLabel: {
    ...typography.bodyBold,
    color: palette.success,
    flex: 1,
  },
  savingsSummaryAmount: {
    ...typography.h3,
    color: palette.success,
    fontWeight: '700',
  },
  overpaidSummaryLabel: {
    ...typography.bodyBold,
    color: palette.warning,
    flex: 1,
  },
  overpaidSummaryAmount: {
    ...typography.h3,
    color: palette.warning,
    fontWeight: '700',
  },
  fairPriceSummary: {
    ...typography.bodyBold,
    color: palette.textSecondary,
  },
  itemPrice: {
    ...typography.body,
    color: palette.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: palette.text,
    fontSize: 18,
  },
  totalAmount: {
    ...typography.h3,
    color: palette.text,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  rewardInfo: {
    flex: 1,
  },
  cardName: {
    ...typography.bodyBold,
    color: palette.text,
  },
  rewardPercentage: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  rewardAmount: {
    ...typography.bodyBold,
    color: palette.success,
    fontSize: 16,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
