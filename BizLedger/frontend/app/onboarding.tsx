import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import ComponentStyles from '../constants/ComponentStyles';

export default function OnboardingScreen() {
  const router = useRouter();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const hasPassword = await AsyncStorage.getItem('appPassword');

      if (hasSeenOnboarding && hasPassword) {
        // User has seen onboarding and has password, go to login
        router.replace('/login');
      } else if (hasSeenOnboarding && !hasPassword) {
        // User has seen onboarding but no password, go to settings to set password
        router.replace('/(tabs)/settings');
      } else {
        // First time user, show onboarding
        setIsFirstTime(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error checking first time user:', error);
      setIsLoading(false);
    }
  };

  const handleGetStarted = async () => {
    try {
      // Mark that user has seen onboarding
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');

      // Check if password exists
      const hasPassword = await AsyncStorage.getItem('appPassword');

      if (hasPassword) {
        // Password exists, go to login
        router.replace('/login');
      } else {
        // No password, go to settings to set one
        router.replace('/(tabs)/settings');
      }
    } catch (error) {
      console.error('Error handling get started:', error);
      // Fallback to settings
      router.replace('/(tabs)/settings');
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <ImageBackground
        source={require("../assets/images/bg2.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.content, styles.loadingContainer]}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/bg2.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logowithouttext.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>BIZLEDGER</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Bharat's first voice based ledger</Text>

          {/* Spacer to push button to bottom */}
          <View style={styles.spacer} />

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={require("../assets/images/getstartedbutton.png")}
              style={styles.button}
              imageStyle={styles.buttonImage}
            >
              
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { spacing, fontSize, button, logo } = ResponsiveDimensions;
const layout = getResponsiveLayout();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.containerPadding,
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    marginBottom: scale(80),
  },
  logo: {
    width: logo.large + spacing.lg,
    height: logo.large + spacing.lg,
  },
  title: {
    ...TextStyles.whiteH1,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    color: AppColors.lightGray,
    textAlign: 'center',
    lineHeight: scale(24),
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  button: {
    width: '100%',
    height: button.height.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    borderRadius: button.height.lg / 2,
  },
  buttonText: {
    ...Typography.buttonLarge,
    color: AppColors.white,
  },
  loadingContainer: {
    ...ComponentStyles.loadingContainer,
  },
});
