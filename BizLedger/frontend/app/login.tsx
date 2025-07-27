import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useFonts } from 'expo-font';
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import ComponentStyles from '../constants/ComponentStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    // Check if a password has been set
    checkPassword();
  }, []);

  const checkPassword = async () => {
    try {
      const storedPassword = await AsyncStorage.getItem("appPassword");
      if (storedPassword) {
        setHasPassword(true);
      } else {
        // No password set, redirect to settings to set one
        router.replace("/(tabs)/settings");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking password:", error);
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const storedPassword = await AsyncStorage.getItem("appPassword");

      if (password === storedPassword) {
        // Password is correct, navigate to home
        router.replace("/(tabs)/home");
      } else {
        // Password is incorrect
        Alert.alert("Error", "Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    router.push("/(tabs)/settings");
  };

  if (!fontsLoaded || isLoading) {
    return (
      <ImageBackground
        source={require("../assets/images/passwordbg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!hasPassword) {
    return (
      <ImageBackground
        source={require("../assets/images/passwordbg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No password set. Redirecting to settings...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/passwordbg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logowithouttext.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.bizledgerTitle}>BIZLEDGER</Text>
          </View>

          {/* Main Login Container */}
            <View style={styles.loginContent}>
              {/* Enter Password Header */}
              <Text style={styles.enterPasswordTitle}>ENTER PASSWORD</Text>

              {/* PIN Input Field */}
              <ImageBackground
                source={require("../assets/images/enterpinbg.png")}
                style={styles.pinInputContainer}
                resizeMode="contain"
              >
                <Text style={styles.pinInputText}>
                  {password ? password.split('').map(() => '•').join('') : 'Enter Pin'}
                </Text>
              </ImageBackground>

              {/* Numpad */}
              <View style={styles.numpadContainer}>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '1' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>1</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '2' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>2</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '3' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>3</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '4' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>4</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '5' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>5</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '6' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>6</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '7' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>7</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '8' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>8</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '9' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>9</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  {/* Back/Delete Button */}
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.slice(0, -1))}
                    activeOpacity={0.8}
                    style={styles.actionButton}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.actionButtonText}>⌫</Text>
                    </ImageBackground>
                  </TouchableOpacity>

                  {/* Zero Button */}
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '0' : prev)}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={styles.numpadButtonText}>0</Text>
                    </ImageBackground>
                  </TouchableOpacity>

                  {/* Check/Submit Button */}
                  <TouchableOpacity
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    style={[styles.actionButton, password.length !== 4 && styles.disabledButton]}
                    disabled={password.length !== 4}
                  >
                    <ImageBackground
                      source={require("../assets/images/number-button.png")}
                      style={styles.numpadButton}
                      resizeMode="cover"
                    >
                      <Text style={[styles.actionButtonText, password.length !== 4 && styles.disabledButtonText]}>✓</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotButtonText}>Forgot password?</Text>
              </TouchableOpacity>

              {/* Reset Password Button */}
              <TouchableOpacity
                onPress={() => {
                  // Force reset by clearing the password and going to settings
                  AsyncStorage.removeItem("appPassword")
                    .then(() => {
                      router.replace("/(tabs)/settings");
                    })
                    .catch(error => {
                      console.error("Error clearing password:", error);
                      Alert.alert("Error", "Failed to reset password. Please try again.");
                    });
                }}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={require("../assets/images/reset-password-button.png")}
                  style={styles.resetButton}
                  resizeMode="contain"
                >
                </ImageBackground>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const { spacing, fontSize, button, navigation, logo, numpad } = ResponsiveDimensions;
const layout = getResponsiveLayout();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    ...ComponentStyles.loadingContainer,
  },
  loadingText: {
    ...ComponentStyles.loadingText,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  logoContainer: {
    ...ComponentStyles.logoContainer,
  },
  logo: {
    ...ComponentStyles.logoImage,
    width: logo.large,
    height: logo.large,
    marginBottom: spacing.md,
  },
  bizledgerTitle: {
    ...ComponentStyles.logoText,
  },
  loginContent: {
    width: '85%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  enterPasswordTitle: {
    ...Typography.h5,
    color: AppColors.white,
    marginBottom: spacing.sm,
    marginTop: -spacing.sm,
    letterSpacing: 1,
  },
  pinInputContainer: {
    width: scale(280),
    height: scale(55),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pinInputText: {
    ...Typography.body1,
    color: AppColors.white,
    letterSpacing: 3,
  },
  numpadContainer: {
    ...ComponentStyles.numpadContainer,
    width: "90%",
    marginBottom: spacing.sm,
  },
  numpadRow: {
    ...ComponentStyles.numpadRow,
    gap: spacing.xs,
    marginBottom: -spacing.sm,
  },
  numpadButton: {
    ...ComponentStyles.numpadButton,
  },
  numpadButtonText: {
    ...ComponentStyles.numpadButtonText,
  },
  actionButton: {
    // Same as numpadButton but for action buttons
  },
  actionButtonText: {
    ...ComponentStyles.actionButtonText,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    opacity: 0.5,
  },
  forgotButton: {
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  forgotButtonText: {
    ...Typography.body1,
    color: AppColors.white,
    textAlign: 'center',
  },
  resetButton: {
    width: scale(500),
    height: scale(60),
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    ...Typography.button,
    color: AppColors.white,
  },
});
