import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { getAllTransactions } from '../services/api.js';
import { ResponsiveDimensions, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography } from '../constants/Typography';

const LedgerScreen = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTransactions();
      console.log('Fetched ledger transactions:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setError('Failed to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#53D1FF" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Table Container */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.snoColumn]}>S.no</Text>
            <Text style={[styles.headerCell, styles.dateColumn]}>Date</Text>
            <Text style={[styles.headerCell, styles.descriptionColumn]}>Description</Text>
            <Text style={[styles.headerCell, styles.creditColumn]}>Credit</Text>
            <Text style={[styles.headerCell, styles.debitColumn]}>Debit</Text>
          </View>

          {/* Table Content */}
          <ScrollView
            style={styles.tableContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#53D1FF']}
                tintColor={'#53D1FF'}
              />
            }
          >
            {loading && !refreshing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#53D1FF" />
                <Text style={styles.loadingText}>Loading transactions...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchTransactions}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : transactions.length > 0 ? (
              transactions.map((transaction: any, index: number) => {
                // Format the date to match the UI design
                const formatDate = (dateStr: string) => {
                  if (!dateStr) return 'N/A';
                  try {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/\//g, '/');
                  } catch {
                    return dateStr;
                  }
                };

                return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.cell, styles.snoColumn]}>{index + 1}.</Text>
                    <Text style={[styles.cell, styles.dateColumn]}>
                      {formatDate(transaction.date)}
                    </Text>
                    <Text style={[styles.cell, styles.descriptionColumn]} numberOfLines={2}>
                      {transaction.description || transaction.item || 'No description'}
                    </Text>
                    <Text style={[styles.cell, styles.creditColumn, styles.creditText]}>
                      {transaction.credit && transaction.credit !== '-' ? transaction.credit : '-'}
                    </Text>
                    <Text style={[styles.cell, styles.debitColumn, styles.debitText]}>
                      {transaction.debit && transaction.debit !== '-' ? transaction.debit : '-'}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

const { spacing } = ResponsiveDimensions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(20),
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: scale(20),
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scale(24),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(40),
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 45, 114, 0.3)',
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 45, 114, 0.8)',
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
  },
  headerCell: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableContent: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: scale(10),
    paddingHorizontal: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cell: {
    color: '#FFFFFF',
    fontSize: scale(11),
    textAlign: 'center',
    paddingHorizontal: scale(2),
  },
  snoColumn: {
    flex: 0.8,
  },
  dateColumn: {
    flex: 1.5,
  },
  descriptionColumn: {
    flex: 2,
    textAlign: 'left',
  },
  creditColumn: {
    flex: 1.2,
  },
  debitColumn: {
    flex: 1.2,
  },
  creditText: {
    color: '#10B981', // Green for credit
  },
  debitText: {
    color: '#EF4444', // Red for debit
  },
  loadingContainer: {
    padding: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: scale(16),
    marginTop: scale(10),
  },
  errorContainer: {
    padding: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: scale(16),
    textAlign: 'center',
    marginBottom: scale(20),
  },
  retryButton: {
    backgroundColor: '#53D1FF',
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: scale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: scale(18),
    textAlign: 'center',
  },
});

export default LedgerScreen;
