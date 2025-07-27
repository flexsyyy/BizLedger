import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, SafeAreaView, ImageBackground, Image, StatusBar } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import BottomNavigation from '../components/BottomNavigation';
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import ComponentStyles from '../constants/ComponentStyles';
import {
  getTransactionSummary,
  getProfitLoss,
  getCashFlowTrend,
  getTopSpendingCategories,
  getTopIncomeCategories,
  getBiggestTransaction,
  getSpendingRatio
} from '../services/api';

const AnalyticsScreen = () => {
  const router = useRouter();
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ credit: 0, debit: 0 });
  const [profitLoss, setProfitLoss] = useState(0);
  const [cashFlow, setCashFlow] = useState<any[]>([]);
  const [topSpending, setTopSpending] = useState<any[]>([]);
  const [topIncome, setTopIncome] = useState<any[]>([]);
  const [biggestTransaction, setBiggestTransaction] = useState<any>(null);
  const [spendingRatio, setSpendingRatio] = useState<string | number>('N/A');
  const [previousRatio, setPreviousRatio] = useState<string | number>('N/A');
  const [error, setError] = useState<string | null>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Re-fetch data when period changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch transaction summary
      const summaryData = await getTransactionSummary(period);
      console.log('Summary data:', summaryData);

      // Extract credit and debit from monthly summary data
      let creditAmount = 0;
      let debitAmount = 0;

      if (summaryData && Array.isArray(summaryData)) {
        // summaryData is an array of monthly summaries
        summaryData.forEach((item: any) => {
          creditAmount += item.total_income || 0;
          debitAmount += item.total_expense || 0;
        });
      }

      setSummary({
        credit: creditAmount || 0,
        debit: debitAmount || 0
      });

      // Calculate profit/loss from summary data
      const profitLoss = creditAmount - debitAmount;
      console.log('Profit/Loss calculated:', profitLoss);
      setProfitLoss(profitLoss);

      // Fetch cash flow trend (period-based)
      const cashFlowData = await getCashFlowTrend(period);
      console.log('Cash flow data:', cashFlowData);
      setCashFlow(cashFlowData || []);

      // Fetch top spending categories (period-based)
      const topSpendingData = await getTopSpendingCategories(period);
      console.log('Top spending data:', topSpendingData);
      setTopSpending(topSpendingData || []);

      // Fetch top income categories (period-based)
      const topIncomeData = await getTopIncomeCategories(period);
      console.log('Top income data:', topIncomeData);
      setTopIncome(topIncomeData || []);

      // Fetch biggest transaction
      const biggestTxData = await getBiggestTransaction();
      console.log('Biggest transaction data:', biggestTxData);
      setBiggestTransaction(biggestTxData || null);

      // Calculate spending ratio from summary data
      const ratio = creditAmount > 0 ? debitAmount / creditAmount : 0;
      console.log('Spending ratio calculated:', ratio);
      setSpendingRatio(ratio);

      // Set a mock previous ratio for comparison (in a real app, you'd fetch historical data)
      const mockPreviousRatio = ratio * 1.15;
      setPreviousRatio(mockPreviousRatio);

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
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
      <ImageBackground
        source={require("../assets/images/analyticsbg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Image
              source={require('../assets/images/arrows.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.headerSpacer} />
        </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['day', 'week', 'month', 'year'].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setPeriod(item)}
            style={[styles.tabButton, period === item && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, period === item && styles.activeTabText]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#53D1FF" />
          <Text style={styles.loadingText}>Loading analytics data...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAnalyticsData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Credit</Text>
              <Text style={styles.summaryValue}>₹{summary.credit.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Debit</Text>
              <Text style={styles.summaryValue}>₹{summary.debit.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Profit</Text>
              <Text style={[styles.summaryValue, profitLoss >= 0 ? styles.profit : styles.loss]}>
                ₹{Math.abs(profitLoss).toFixed(2)}
              </Text>
            </View>
          </View>
          {/* Categories */}
          <View style={styles.row}>
            <View style={styles.categoryBox}>
              <Text style={styles.sectionTitle}>Top Spending Categories</Text>
              {topSpending && topSpending.length > 0 ? (
                topSpending.map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryText}>• {item.category || 'Unknown'}</Text>
                    <Text style={styles.categoryAmount}>₹{parseFloat(item.total_spent || 0).toFixed(2)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No spending data available</Text>
              )}
            </View>
            <View style={styles.categoryBox}>
              <Text style={styles.sectionTitle}>Top Income Categories</Text>
              {topIncome && topIncome.length > 0 ? (
                topIncome.map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <Text style={styles.categoryText}>• {item.category || 'Unknown'}</Text>
                    <Text style={styles.categoryAmount}>₹{parseFloat(item.total_spent || 0).toFixed(2)}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No income data available</Text>
              )}
            </View>
          </View>

          {/* Biggest Transaction & Cash Flow */}
          <View style={styles.row}>
            <View style={styles.boxContainer}>
              <Text style={styles.sectionTitle}>Biggest Transaction</Text>
              {biggestTransaction ? (
                <View>
                  <Text style={styles.bold}>
                    ₹{biggestTransaction.amount && biggestTransaction.amount !== '0'
                      ? parseFloat(biggestTransaction.amount.toString()).toFixed(2)
                      : '0.00'}
                  </Text>
                  <Text style={styles.transactionDetails}>
                    {biggestTransaction.type === 'credit' ? 'Income' : 'Expense'}
                  </Text>
                  <Text style={styles.transactionDetails}>
                    {biggestTransaction.description || 'No description'}
                  </Text>
                  <Text style={styles.transactionDetails}>
                    Customer: {biggestTransaction.customer || 'Unknown'}
                  </Text>
                  <Text style={styles.transactionDetails}>
                    Category: {biggestTransaction.category || 'Unknown'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {biggestTransaction.date || 'No date'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.emptyText}>No transaction data</Text>
              )}
            </View>
            <View style={styles.boxContainer}>
              <Text style={styles.sectionTitle}>Cash Flow</Text>
              <View style={styles.barGraph}>
                {cashFlow && cashFlow.length > 0 ? (
                  cashFlow.slice(-5).map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: Math.max(6, Math.min(28, Math.abs(item.total_spent || 0) / 100)),
                            backgroundColor: '#dd0000' // Always red for spending
                          }
                        ]}
                      />
                      <Text style={styles.barLabel}>{item.date ? item.date.slice(-5) : 'N/A'}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { height: 12, backgroundColor: '#555' }]} />
                      <Text style={styles.barLabel}>No data</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { height: 20, backgroundColor: '#666' }]} />
                      <Text style={styles.barLabel}>No data</Text>
                    </View>
                    <View style={styles.barContainer}>
                      <View style={[styles.bar, { height: 16, backgroundColor: '#777' }]} />
                      <Text style={styles.barLabel}>No data</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          {/* Monthly Comparison */}
          <View style={styles.comparisonBox}>
            <Text style={styles.sectionTitle}>Spending to Income Ratio</Text>
            {spendingRatio !== 'N/A' ? (
              <View>
                <Text style={styles.ratioText}>
                  Current: <Text style={styles.bold}>{typeof spendingRatio === 'number' ? (spendingRatio * 100).toFixed(1) : parseFloat(spendingRatio).toFixed(1)}%</Text>
                </Text>
                <Text style={styles.ratioText}>
                  Previous: <Text style={styles.bold}>{typeof previousRatio === 'number' ? (previousRatio * 100).toFixed(1) : parseFloat(previousRatio).toFixed(1)}%</Text>
                </Text>
                <Text style={[
                  styles.ratioImprovement,
                  typeof spendingRatio === 'number' && typeof previousRatio === 'number' && spendingRatio < previousRatio ? styles.profit : styles.loss
                ]}>
                  {typeof spendingRatio === 'number' && typeof previousRatio === 'number'
                    ? spendingRatio < previousRatio
                      ? `Improved by ${((previousRatio - spendingRatio) * 100).toFixed(1)}%`
                      : `Worsened by ${((spendingRatio - previousRatio) * 100).toFixed(1)}%`
                    : 'No comparison available'}
                </Text>
              </View>
            ) : (
              <Text style={styles.emptyText}>No ratio data available</Text>
            )}
          </View>

          {/* Add some padding at the bottom for scrolling past the navbar */}
          <View style={{ height: scale(80) }} />
        </ScrollView>
      )}

        {/* Bottom Navigation */}
        <BottomNavigation />
      </SafeAreaView>
    </ImageBackground>
    </>
  );
};

// Get responsive layout and safe area padding
const layout = getResponsiveLayout();
const safeArea = getSafeAreaPadding();
const { spacing } = ResponsiveDimensions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: scale(8),
    paddingTop: safeArea.paddingTop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: AppColors.white,
  },
  headerTitle: {
    ...TextStyles.whiteH1,
    color: AppColors.white,
  },
  headerSpacer: {
    width: scale(40),
    height: scale(40),
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    paddingHorizontal: scale(8),
    // Enhanced glassmorphism background to simulate backdrop blur
    backgroundColor: 'rgba(83, 209, 255, 0.15)',
    borderRadius: scale(12),
    marginHorizontal: 0,
    marginBottom: spacing.lg,
    // Drop shadow effect with exact specifications
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: scale(4), // Android shadow
    // Additional styling for glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: scale(20),
    // Subtle glassmorphism for inactive buttons
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Individual button shadow for enhanced depth
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: scale(2), // Android shadow
  },
  activeTabButton: {
    backgroundColor: '#53D1FF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Enhanced shadow for active state with exact specifications
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: scale(6), // Higher elevation for active state
  },
  tabText: {
    ...TextStyles.whiteBody,
    color: AppColors.gray,
  },
  activeTabText: {
    ...TextStyles.whiteBody,
    color: AppColors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    gap: scale(6),
  },
  label: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    textAlign: 'center',
  },
  bold: {
    ...TextStyles.whiteH2,
    color: AppColors.white,
  },
  profit: {
    color: AppColors.success,
  },
  loss: {
    color: AppColors.error,
  },
  sectionTitle: {
    ...TextStyles.whiteH2,
    color: '#53D1FF',
    marginBottom: scale(8),
    fontSize: scale(14),
    lineHeight: scale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  barGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    gap: scale(4),
    flex: 1,
    paddingHorizontal: scale(4),
    paddingBottom: scale(3),
    overflow: 'hidden',
  },
  bar: {
    width: scale(12),
    borderRadius: scale(3),
    maxHeight: scale(28),
    minHeight: scale(6),
  },
  comparisonBox: {
    backgroundColor: 'rgba(0, 140, 190, 0.1)',
    padding: scale(16),
    borderRadius: scale(12),
    marginHorizontal: 0,
    marginTop: spacing.md,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...TextStyles.whiteBody,
    color: AppColors.gray,
    marginTop: spacing.md,
  },
  errorContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    ...TextStyles.whiteBody,
    color: AppColors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: '#53D1FF',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: scale(8),
  },
  retryButtonText: {
    ...TextStyles.whiteBody,
    color: AppColors.background,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: scale(120), // Add padding to account for navbar
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    gap: scale(6),
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(83, 209, 255, 0.1)',
    borderRadius: scale(12),
    padding: scale(12),
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(90),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
  },
  summaryLabel: {
    ...TextStyles.whiteBody,
    color: AppColors.gray,
    textAlign: 'center',
    marginBottom: scale(4),
    fontSize: scale(11),
    lineHeight: scale(14),
    fontWeight: '400',
  },
  summaryValue: {
    ...TextStyles.whiteH2,
    color: AppColors.white,
    textAlign: 'center',
    fontSize: scale(18),
    lineHeight: scale(22),
    fontWeight: '600',
  },
  categoryBox: {
    flex: 1,
    padding: scale(12),
    backgroundColor: 'rgba(2, 164, 223, 0.1)',
    borderRadius: scale(12),
    marginHorizontal: 0,
    minHeight: scale(110),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: scale(4),
    paddingVertical: scale(2),
  },
  categoryText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    flex: 1,
    fontSize: scale(12),
    lineHeight: scale(16),
    marginRight: scale(8),
    fontWeight: '400',
  },
  categoryAmount: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '600',
    textAlign: 'right',
    minWidth: scale(60),
  },
  emptyText: {
    ...TextStyles.whiteBody,
    color: AppColors.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  boxContainer: {
    flex: 1,
    padding: scale(12),
    backgroundColor: 'rgba(52, 196, 248, 0.1)',
    borderRadius: scale(12),
    marginHorizontal: 0,
    minHeight: scale(110),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
  },
  transactionDetails: {
    ...TextStyles.mutedBody,
    color: AppColors.gray,
    marginTop: spacing.xs,
  },
  transactionDate: {
    ...TextStyles.mutedBody,
    color: AppColors.gray,
    marginTop: spacing.xs,
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: scale(50),
    paddingBottom: scale(18),
  },
  barLabel: {
    ...TextStyles.mutedBody,
    color: AppColors.gray,
    marginTop: scale(2),
    fontSize: scale(10),
    lineHeight: scale(12),
  },
  ratioText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    marginVertical: spacing.xs,
  },
  ratioImprovement: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    marginTop: spacing.md,
  },

});

export default AnalyticsScreen;
