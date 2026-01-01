/**
 * Receipt Database Page
 * Central hub for all physical and digital receipts
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import {
  getAllReceipts,
  filterReceipts,
  getReceiptStats,
  addReceipt,
  deleteReceipt,
  updateReceipt,
  Receipt,
  ReceiptType,
  ReceiptCategory,
  ReceiptFilter,
  ReceiptStats,
} from '../services/receiptDatabase.service';

const ReceiptDatabasePage: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [stats, setStats] = useState<ReceiptStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ReceiptType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ReceiptCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'store'>('date');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, [searchTerm, selectedType, selectedCategory, sortBy]);

  const loadReceipts = async () => {
    try {
      const filter: ReceiptFilter = {
        searchTerm: searchTerm || undefined,
        type: selectedType === 'all' ? undefined : [selectedType],
        category: selectedCategory === 'all' ? undefined : [selectedCategory],
      };

      const filtered = await filterReceipts(filter);
      
      // Sort
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortBy === 'amount') {
          return b.total - a.total;
        } else {
          return a.storeName.localeCompare(b.storeName);
        }
      });

      setReceipts(sorted);

      // Load stats
      const receiptStats = await getReceiptStats();
      setStats(receiptStats);
    } catch (error) {
      console.error('Failed to load receipts:', error);
    }
  };

  const handleDeleteReceipt = (receiptId: string) => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteReceipt(receiptId);
            loadReceipts();
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async (receipt: Receipt) => {
    await updateReceipt(receipt.id, { isFavorite: !receipt.isFavorite });
    loadReceipts();
  };

  const getReceiptIcon = (type: ReceiptType) => {
    switch (type) {
      case 'physical': return '📄';
      case 'email': return '📧';
      case 'digital': return '💳';
      default: return '📄';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Receipt Database</Text>
        {stats && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalReceipts}</Text>
              <Text style={styles.statLabel}>Receipts</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${stats.totalSpent.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>${stats.totalSaved.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search receipts..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>🔍 Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedType('all')}
            >
              <Text style={styles.filterChipText}>All Types</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'physical' && styles.filterChipActive]}
              onPress={() => setSelectedType('physical')}
            >
              <Text style={styles.filterChipText}>📄 Physical</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'email' && styles.filterChipActive]}
              onPress={() => setSelectedType('email')}
            >
              <Text style={styles.filterChipText}>📧 Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedType === 'digital' && styles.filterChipActive]}
              onPress={() => setSelectedType('digital')}
            >
              <Text style={styles.filterChipText}>💳 Digital</Text>
            </TouchableOpacity>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilters}>
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === 'all' && styles.filterChipActive]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text style={styles.filterChipText}>All Categories</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === 'groceries' && styles.filterChipActive]}
              onPress={() => setSelectedCategory('groceries')}
            >
              <Text style={styles.filterChipText}>🛒 Groceries</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === 'dining' && styles.filterChipActive]}
              onPress={() => setSelectedCategory('dining')}
            >
              <Text style={styles.filterChipText}>🍽️ Dining</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, selectedCategory === 'shopping' && styles.filterChipActive]}
              onPress={() => setSelectedCategory('shopping')}
            >
              <Text style={styles.filterChipText}>🛍️ Shopping</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortBy('date')}>
          <Text style={[styles.sortOption, sortBy === 'date' && styles.sortOptionActive]}>
            Date
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('amount')}>
          <Text style={[styles.sortOption, sortBy === 'amount' && styles.sortOptionActive]}>
            Amount
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('store')}>
          <Text style={[styles.sortOption, sortBy === 'store' && styles.sortOptionActive]}>
            Store
          </Text>
        </TouchableOpacity>
      </View>

      {/* Receipts List */}
      <ScrollView style={styles.receiptsList}>
        {receipts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📭 No receipts found</Text>
            <Text style={styles.emptyStateSubtext}>
              Scan a receipt to get started!
            </Text>
          </View>
        ) : (
          receipts.map((receipt) => (
            <View key={receipt.id} style={styles.receiptCard}>
              <View style={styles.receiptHeader}>
                <View style={styles.receiptHeaderLeft}>
                  <Text style={styles.receiptIcon}>{getReceiptIcon(receipt.type)}</Text>
                  <View>
                    <Text style={styles.receiptStore}>{receipt.storeName}</Text>
                    <Text style={styles.receiptDate}>
                      {new Date(receipt.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.receiptHeaderRight}>
                  <Text style={styles.receiptAmount}>${receipt.total.toFixed(2)}</Text>
                  {receipt.savingsLog && receipt.savingsLog.totalSavings > 0 && (
                    <Text style={styles.receiptSavings}>
                      Saved ${receipt.savingsLog.totalSavings.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>

              {receipt.imageUri && (
                <Image source={{ uri: receipt.imageUri }} style={styles.receiptImage} />
              )}

              <View style={styles.receiptItems}>
                <Text style={styles.itemsLabel}>
                  {receipt.items.length} items
                </Text>
                {receipt.items.slice(0, 3).map((item, idx) => (
                  <Text key={idx} style={styles.itemText}>
                    • {item.name} - ${item.price.toFixed(2)}
                  </Text>
                ))}
                {receipt.items.length > 3 && (
                  <Text style={styles.moreItems}>
                    +{receipt.items.length - 3} more items
                  </Text>
                )}
              </View>

              <View style={styles.receiptActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleFavorite(receipt)}
                >
                  <Text style={styles.actionButtonText}>
                    {receipt.isFavorite ? '⭐' : '☆'} Favorite
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteReceipt(receipt.id)}
                >
                  <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                    🗑️ Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#8B5CF6',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#e9d5ff',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 5,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryFilters: {
    marginTop: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sortLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 10,
  },
  sortOption: {
    fontSize: 14,
    color: '#374151',
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  sortOptionActive: {
    color: '#8B5CF6',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  receiptsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyStateText: {
    fontSize: 20,
    color: '#6b7280',
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  receiptCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  receiptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  receiptStore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  receiptDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  receiptHeaderRight: {
    alignItems: 'flex-end',
  },
  receiptAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  receiptSavings: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  receiptImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
  },
  receiptItems: {
    marginVertical: 10,
  },
  itemsLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
    marginVertical: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginTop: 5,
  },
  receiptActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  deleteButton: {},
  deleteButtonText: {
    color: '#ef4444',
  },
});

export default ReceiptDatabasePage;
