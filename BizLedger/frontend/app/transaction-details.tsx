import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import SidePanel from "../components/SidePanel";

export default function TransactionDetailsScreen(): JSX.Element {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract parameters from the route
  const { 
    type, 
    name = "Unknown", 
    amount = "10", 
    date = new Date().toLocaleDateString(), 
    time = new Date().toLocaleTimeString(),
    mode = "Cash",
    from = "Unknown"
  } = params;

  // Determine background color based on transaction type
  const headerColor = type === "debit" ? "#0cbf00" : "#dd0000";
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Details</Text>
      </View>

      {/* Transaction Card */}
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Category/Name */}
          <Text style={styles.category}>{name}</Text>
          
          {/* Amount */}
          <View style={styles.amountBox}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <Text style={styles.amountText}>{amount}</Text>
          </View>

          {/* Date & Time */}
          <Text style={styles.dateTime}>{date} {time}</Text>

          {/* Transaction Mode */}
          <Text style={styles.transactionLabel}>Mode of Transaction -</Text>
          <Text style={styles.cashOnline}>{mode}</Text>

          {/* From/To */}
          <Text style={styles.fromName}>
            {type === "debit" ? "From: " : "To: "}{from}
          </Text>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        {/* Profile/Settings Button (Left) */}
        <TouchableOpacity
          style={styles.navIconContainer}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Image
            source={require("../assets/images/icon-profile.png")}
            style={[styles.navIcon, { opacity: 0.5 }]}
          />
          <Text style={[styles.navText, { opacity: 0.5 }]}>Profile</Text>
        </TouchableOpacity>

        {/* Home Button (Center) */}
        <TouchableOpacity
          style={styles.navIconContainer}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Image
            source={require("../assets/images/icon-home.png")}
            style={[styles.navIcon, { opacity: 0.5 }]}
          />
          <Text style={[styles.navText, { opacity: 0.5 }]}>Home</Text>
        </TouchableOpacity>

        {/* History Button (Right) */}
        <TouchableOpacity 
          style={styles.navIconContainer}
          onPress={() => router.push("/(tabs)/history")}
        >
          <Image 
            source={require("../assets/images/icon-history.png")} 
            style={styles.navIcon} 
          />
          <Text style={[styles.navText, styles.activeNavText]}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 96,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "500",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60, // Space for bottom nav
  },
  card: {
    backgroundColor: "#d9d9d9",
    borderRadius: 26,
    height: 492,
    width: 333,
    padding: 20,
    position: "relative",
  },
  amountBox: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    height: 104,
    width: 236,
    position: "absolute",
    top: 89,
    left: 47,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  rupeeSymbol: {
    fontSize: 38,
    fontWeight: "500",
    marginRight: 5,
  },
  amountText: {
    fontSize: 40,
    fontWeight: "500",
    color: "#000000",
  },
  transactionLabel: {
    position: "absolute",
    top: 239,
    left: 40,
    fontSize: 24,
    fontWeight: "600",
    color: "#000000",
  },
  dateTime: {
    position: "absolute",
    top: 205,
    left: 86,
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
  },
  fromName: {
    position: "absolute",
    top: 361,
    left: 40,
    fontSize: 32,
    fontWeight: "500",
    color: "#000000",
  },
  category: {
    position: "absolute",
    top: 42,
    left: 90,
    fontSize: 32,
    fontWeight: "500",
    color: "#000000",
  },
  cashOnline: {
    position: "absolute",
    top: 294,
    left: 40,
    fontSize: 20,
    fontWeight: "500",
    color: "#000000",
  },
  bottomBar: {
    width: "100%",
    height: 60,
    backgroundColor: "#002D72",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
  },
  navIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
    marginBottom: 4,
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  activeNavText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
