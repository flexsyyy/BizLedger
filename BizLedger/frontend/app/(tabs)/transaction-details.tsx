import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ImageBackground, ScrollView } from "react-native";
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../../constants/Responsive';
import BottomNavigation from '../../components/BottomNavigation';
import { AppColors } from '../../constants/Colors';
import { Typography, TextStyles } from '../../constants/Typography';
import ComponentStyles from '../../constants/ComponentStyles';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Extract parameters from the route
  const {
    type,
    name,
    amount = "10",
    date = new Date().toLocaleDateString(),
    time = new Date().toLocaleTimeString(),
    mode = "Cash",
    from = "Unknown"
  } = params;

  const { spacing } = ResponsiveDimensions;
  const layout = getResponsiveLayout();

  return (
    <ImageBackground
      source={require("../../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/(tabs)/history")}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/images/arrows.png")}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Transaction Details Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailsContainer}>

            {/* Transaction Type Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Transaction Type</Text>
              <Text style={styles.cardValue}>{type === 'debit' ? 'Money Received' : 'Money Sent'}</Text>
            </View>

            {/* Item/Description Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Item/Description</Text>
              <Text style={styles.cardValue}>{name || 'N/A'}</Text>
            </View>

            {/* Amount Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Amount</Text>
              <Text style={[styles.cardValue, styles.amountValue]}>₹{amount || '0'}</Text>
            </View>

            {/* To/From Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>{type === 'debit' ? 'Received From' : 'Sent To'}</Text>
              <Text style={styles.cardValue}>{from || 'N/A'}</Text>
            </View>

            {/* Date Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Date</Text>
              <Text style={styles.cardValue}>{date || new Date().toLocaleDateString()}</Text>
            </View>

            {/* Time Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Time</Text>
              <Text style={styles.cardValue}>{time || new Date().toLocaleTimeString()}</Text>
            </View>

            {/* Payment Mode Card */}
            <View style={styles.detailCard}>
              <Text style={styles.cardTitle}>Payment Mode</Text>
              <Text style={styles.cardValue}>{mode || 'Cash'}</Text>
            </View>

          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation onProfilePress={() => router.push("/(tabs)/settings")} />

      </SafeAreaView>
    </ImageBackground>
  );
}

const { spacing } = ResponsiveDimensions;
const layout = getResponsiveLayout();
const safeArea = getSafeAreaPadding();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: layout.containerPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  backIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: AppColors.white,
  },
  headerTitle: {
    ...TextStyles.whiteH2,
    flex: 1,
  },
  headerSpacer: {
    width: scale(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(120), // Extra padding to account for bottom navigation
  },
  detailsContainer: {
    paddingBottom: spacing.xl,
  },
  detailCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(15),
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    ...Typography.body2,
    color: AppColors.lightGray,
    marginBottom: spacing.xs,
  },
  cardValue: {
    ...Typography.h4,
    color: AppColors.white,
    fontWeight: 'bold',
  },
  amountValue: {
    ...Typography.h3,
    color: AppColors.primary,
  },

});
