import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import SidePanel from "../../components/SidePanel";
import BottomNavigation from "../../components/BottomNavigation";
import { getAllTransactions } from "../../services/api";
import { ResponsiveDimensions, scale } from '../../constants/Responsive';
import { Dimensions } from 'react-native';

type TransactionCardProps = {
  type: "sent" | "received";
  itemName: string;
  amount?: string | number;
  to?: string;
  from?: string;
  cardType?: "dark" | "blue";
  onDropdownPress?: () => void;
};

const TransactionCard = ({
  type,
  itemName,
  amount,
  to,
  from,
  cardType = "dark",
  onDropdownPress
}: TransactionCardProps) => {
  const router = useRouter();
  const { spacing } = ResponsiveDimensions;

  // Determine card background based on type and cardType
  const getCardBackground = () => {
    if (cardType === "blue") {
      return require("../../assets/images/transaction-card-blue.png");
    }
    return require("../../assets/images/transaction-card-dark.png");
  };

  // Determine amount field background
  const getAmountFieldBackground = () => {
    if (cardType === "blue") {
      return require("../../assets/images/amount-field-dark.png");
    }
    return require("../../assets/images/amount-field-white.png");
  };

  const handleDropdownPress = () => {
    if (onDropdownPress) {
      onDropdownPress();
    } else {
      // Navigate to transaction details with proper params
      console.log(`Navigating to transaction details for: ${itemName}`);
      router.push({
        pathname: "/(tabs)/transaction-details" as any,
        params: {
          type: type === "sent" ? "credit" : "debit", // Convert to old format for details page
          name: itemName,
          amount: amount?.toString() || "0",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          mode: type === "sent" ? "Cash" : "Online",
          from: type === "sent" ? (to || "Unknown") : (from || "Unknown")
        }
      });
    }
  };

  return (
    <TouchableOpacity
      style={styles.transactionContainer}
      onPress={handleDropdownPress}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={getCardBackground()}
        style={styles.transactionCard}
        imageStyle={styles.transactionCardImage}
      >
        <View style={styles.cardContent}>
          {/* Item Name */}
          <View style={styles.itemNameContainer}>
            <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
              {itemName}
            </Text>
          </View>

          {/* Transaction Details */}
          <View style={styles.transactionDetails}>
            <View style={styles.leftSection}>
              <Text style={styles.transactionLabel}>
                {type === "sent" ? "Sent:" : "Received :"}
              </Text>
              <View style={styles.amountFieldContainer}>
                <ImageBackground
                  source={getAmountFieldBackground()}
                  style={styles.amountField}
                  imageStyle={styles.amountFieldImage}
                >
                  <Text style={[
                    styles.amountText,
                    { color: cardType === "blue" ? '#ffffff' : '#000000' }
                  ]} numberOfLines={1}>
                    {amount ? `₹${amount}` : ""}
                  </Text>
                </ImageBackground>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.directionText} numberOfLines={2} ellipsizeMode="tail">
                {type === "sent"
                  ? `To - ${to || "Unknown"}`
                  : `from - ${from || "Unknown"}`
                }
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default function HistoryScreen() {
  const router = useRouter();
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleDetailsNavigation = () => {
    setIsDropdownVisible(false);
    router.push('/details');
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors

      const data = await getAllTransactions();
      console.log('Fetched transactions:', data);

      if (data && data.length > 0) {
        console.log('First transaction:', data[0]);
        setTransactions(data);
      } else {
        console.log('No transactions found or empty data');
        setTransactions([]);

        // Check if this might be a connection error
        if (data.length === 0) {
          setError('Could not connect to the database server. Make sure the server is running and accessible.');
        }
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/images/historybg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Side Panel */}
        <SidePanel
          isVisible={isSidePanelVisible}
          onClose={() => setIsSidePanelVisible(false)}
        />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>

          {/* Dropdown Menu */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={handleDropdownToggle}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/dropdown-arrow.png')}
                style={styles.dropdownIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {isDropdownVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={handleDetailsNavigation}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownItemText}>Details</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Transaction List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onTouchStart={() => setIsDropdownVisible(false)}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#002D72']}
              tintColor={'#ffffff'}
            />
          }
        >
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading transactions...</Text>
            </View>
          ) : transactions.length > 0 ? (
            <View style={styles.transactionsContainer}>
              {transactions.map((transaction: any, index: number) => {
                // Map database transaction to component props using the new data structure
                const transactionType = transaction.transaction_type === 'credit' ? "received" : "sent";
                const cardType = transactionType === "received" ? "blue" : "dark";

                // Smart amount extraction: First check amount field, then fallback to credit/debit, then extract from description
                let amount = '0';
                if (transaction.amount && transaction.amount > 0) {
                  // Use the amount field if it has a valid value
                  amount = transaction.amount.toString();
                } else {
                  // Fallback to credit/debit fields
                  const isCredit = transaction.credit && transaction.credit !== '-';
                  const isDebit = transaction.debit && transaction.debit !== '-';
                  const rawAmount = isCredit ? transaction.credit : transaction.debit;
                  const extractedAmount = rawAmount && rawAmount !== '-'
                    ? rawAmount.toString().replace('/-', '').replace('/', '')
                    : '0';

                  if (extractedAmount !== '0') {
                    amount = extractedAmount;
                  } else {
                    // Last resort: try to extract amount from description using regex
                    const description = transaction.description || '';
                    const amountMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:rupees?|rs\.?|\/-)/i);
                    if (amountMatch) {
                      amount = amountMatch[1];
                    }
                  }
                }

                // Use customer name from the database
                const customerName = transaction.customer_name || "Unknown";

                // For credit transactions, the customer is the sender (we received from them)
                // For debit transactions, the customer is the recipient (we sent to them)
                const recipientName = transactionType === "sent" ? customerName : "Me";
                const senderName = transactionType === "received" ? customerName : "Me";

                return (
                  <TransactionCard
                    key={transaction.id || transaction.s_no || `transaction-${index}`}
                    type={transactionType}
                    itemName={transaction.description || "Transaction"}
                    amount={amount}
                    to={recipientName}
                    from={senderName}
                    cardType={cardType}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              {error ? (
                <>
                  <Text style={styles.errorText}>Connection Error</Text>
                  <Text style={styles.emptyText}>{error}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchTransactions}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.emptyText}>No transactions found</Text>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation onProfilePress={() => setIsSidePanelVisible(true)} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const { spacing } = ResponsiveDimensions;
const screenWidth = Dimensions.get('window').width;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: 0,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdownButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dropdownIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: '#FFFFFF',
  },
  dropdownMenu: {
    position: 'absolute',
    top: scale(45),
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minWidth: scale(120),
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(120), // Space for bottom navigation
  },
  loadingContainer: {
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    padding: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: "center",
    marginBottom: 15,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#002D72",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionsContainer: {
    paddingHorizontal: scale(16),
    paddingTop: scale(20),
  },
  transactionContainer: {
    marginBottom: scale(16),
    paddingHorizontal: scale(4),
  },
  transactionCard: {
    width: '100%',
    height: scale(140),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  transactionCardImage: {
    borderRadius: scale(12),
  },
  cardContent: {
    flex: 1,
    padding: scale(16),
    justifyContent: 'space-between',
  },
  itemNameContainer: {
    marginBottom: scale(8),
  },
  itemName: {
    color: '#ffffff',
    fontSize: scale(18),
    fontWeight: 'bold',
    lineHeight: scale(22),
  },
  transactionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flex: 1,
  },
  leftSection: {
    flex: 1,
    maxWidth: '60%',
  },
  transactionLabel: {
    color: '#ffffff',
    fontSize: scale(14),
    marginBottom: scale(6),
    lineHeight: scale(16),
  },
  amountFieldContainer: {
    alignItems: 'flex-start',
  },
  amountField: {
    backgroundColor: '#000000',
    minWidth: scale(80),
    maxWidth: scale(120),
    height: scale(36),
    borderRadius: scale(8),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(8),
  },
  amountFieldImage: {
    borderRadius: scale(8),
  },
  amountText: {
    color: '#ffffff',
    fontSize: scale(15),
    fontWeight: "600",
    textAlign: 'center',
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    maxWidth: '35%',
    minWidth: '30%',
  },
  directionText: {
    color: '#ffffff',
    fontSize: scale(12),
    textAlign: "right",
    lineHeight: scale(15),
    flexWrap: 'wrap',
  },

});
