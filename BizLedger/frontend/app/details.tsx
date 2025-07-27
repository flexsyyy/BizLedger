import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import BottomNavigation from '../components/BottomNavigation';
import { scale, getSafeAreaPadding } from '../constants/Responsive';
import { TextStyles, Typography } from '../constants/Typography';
import { AppColors } from '../constants/Colors';

// TypeScript interface for transaction data
interface TransactionData {
  id: number;
  date: string;
  description: string;
  credit: string;
  debit: string;
  type: 'credit' | 'debit';
}

// Dummy transaction data
const dummyTransactions: TransactionData[] = [
  {
    id: 1,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 2,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 3,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 4,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 5,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 6,
    date: '12/05/2025',
    description: 'Bills',
    credit: '10/-',
    debit: '-',
    type: 'credit',
  },
  {
    id: 7,
    date: '11/05/2025',
    description: 'Groceries',
    credit: '-',
    debit: '25/-',
    type: 'debit',
  },
  {
    id: 8,
    date: '10/05/2025',
    description: 'Salary',
    credit: '500/-',
    debit: '-',
    type: 'credit',
  },
];

export default function DetailsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require('../assets/images/detailsbg.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Transaction details</Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.contentContainer}>
          <View style={styles.mainContainer}>
            {/* Table Header Bar */}
            <View style={styles.tableHeaderBar}>
              <Text style={styles.headerText}>S.no</Text>
              <Text style={styles.headerText}>Date</Text>
              <Text style={styles.headerText}>Description</Text>
              <Text style={styles.headerText}>Credit</Text>
              <Text style={styles.headerText}>Debit</Text>
            </View>

            {/* Transaction Table */}
            <ScrollView
              style={styles.tableScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tableContent}
            >
              {dummyTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.tableRow}>
                  <Text style={styles.cellText}>{transaction.id}.</Text>
                  <Text style={styles.cellText}>{transaction.date}</Text>
                  <Text style={styles.cellText}>{transaction.description}</Text>
                  <Text style={[styles.cellText, styles.creditText]}>
                    {transaction.credit}
                  </Text>
                  <Text style={[styles.cellText, styles.debitText]}>
                    {transaction.debit}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </SafeAreaView>
    </ImageBackground>
    </>
  );
}

const safeArea = getSafeAreaPadding();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 393,
    alignSelf: 'center',
  },
  header: {
    paddingTop: scale(20),
    paddingBottom: scale(16),
    paddingHorizontal: scale(20),
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scale(24),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    letterSpacing: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(11),
    paddingBottom: scale(120), // Space for bottom navigation
  },
  mainContainer: {
    width: scale(371),
    height: scale(524),
    backgroundColor: 'rgba(0, 229, 255, 0.11)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(16),
    // Box shadow (inset)
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
    // Backdrop filter simulation
    overflow: 'hidden',
  },
  tableHeaderBar: {
    backgroundColor: 'rgba(52, 90, 250, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(12),
    paddingVertical: scale(4),
    paddingHorizontal: scale(9),
    marginHorizontal: scale(10),
    marginTop: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(15),
    width: scale(351),
    alignSelf: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
  },
  tableScrollView: {
    flex: 1,
    marginTop: scale(8),
  },
  tableContent: {
    paddingHorizontal: scale(10),
    paddingBottom: scale(20),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(8),
    paddingHorizontal: scale(9),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    gap: scale(15),
  },
  cellText: {
    color: '#FFFFFF',
    fontSize: scale(11),
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    flex: 1,
  },
  creditText: {
    color: '#00FF88', // Green for credit
  },
  debitText: {
    color: '#FF4444', // Red for debit
  },
});
