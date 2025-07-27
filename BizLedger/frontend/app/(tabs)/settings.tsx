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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../../constants/Responsive';
import { AppColors } from '../../constants/Colors';
import { Typography, TextStyles } from '../../constants/Typography';
import ComponentStyles from '../../constants/ComponentStyles';

export default function SettingsScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [securityQuestion1, setSecurityQuestion1] = useState("");
  const [securityAnswer1, setSecurityAnswer1] = useState("");
  const [securityQuestion2, setSecurityQuestion2] = useState("");
  const [securityAnswer2, setSecurityAnswer2] = useState("");
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [existingPassword, setExistingPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1 = password, 2 = security questions

  // Sample security questions
  const securityQuestions = [
    "What was your first pet's name?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite book?",
    "In what city were you born?",
  ];

  useEffect(() => {
    checkExistingPassword();
  }, []);

  const checkExistingPassword = async () => {
    try {
      const storedPassword = await AsyncStorage.getItem("appPassword");
      if (storedPassword) {
        setExistingPassword(storedPassword);
        // Load existing security questions if available
        const q1 = await AsyncStorage.getItem("securityQuestion1");
        const a1 = await AsyncStorage.getItem("securityAnswer1");
        const q2 = await AsyncStorage.getItem("securityQuestion2");
        const a2 = await AsyncStorage.getItem("securityAnswer2");

        if (q1) setSecurityQuestion1(q1);
        if (a1) setSecurityAnswer1(a1);
        if (q2) setSecurityQuestion2(q2);
        if (a2) setSecurityAnswer2(a2);
      }
    } catch (error) {
      console.error("Error checking existing password:", error);
    }
  };

  const handlePasswordNext = () => {
    if (password.length !== 4) {
      Alert.alert("Error", "Password must be exactly 4 digits long.");
      return;
    }
    setCurrentStep(2);
  };

  const handleSave = async () => {
    if (!securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
      Alert.alert("Error", "Please complete all security questions and answers.");
      return;
    }

    try {
      await AsyncStorage.setItem("appPassword", password);
      await AsyncStorage.setItem("securityQuestion1", securityQuestion1);
      await AsyncStorage.setItem("securityAnswer1", securityAnswer1);
      await AsyncStorage.setItem("securityQuestion2", securityQuestion2);
      await AsyncStorage.setItem("securityAnswer2", securityAnswer2);

      Alert.alert(
        "Success",
        "Password and security questions set successfully!",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error) {
      console.error("Error saving password:", error);
      Alert.alert("Error", "Failed to save password. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await AsyncStorage.removeItem("appPassword");
      await AsyncStorage.removeItem("securityQuestion1");
      await AsyncStorage.removeItem("securityAnswer1");
      await AsyncStorage.removeItem("securityQuestion2");
      await AsyncStorage.removeItem("securityAnswer2");

      setPassword("");
      setSecurityQuestion1("");
      setSecurityAnswer1("");
      setSecurityQuestion2("");
      setSecurityAnswer2("");
      setCurrentStep(1);

      Alert.alert("Success", "Password reset successfully!");
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/splash.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.bizledgerTitle}>BIZLEDGER</Text>
          </View>

          {currentStep === 1 ? (
            // Step 1: Set Password
            <View style={styles.settingsContainer}>
              <Text style={styles.headerText}>SET PASSWORD</Text>

              <View style={styles.pinInputContainer}>
                <Text style={styles.pinInputText}>
                  {password ? password.split('').map(() => '•').join('') : 'Enter 4-digit pin'}
                </Text>
              </View>

              {/* Numpad */}
              <View style={styles.numpadContainer}>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '1' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>1</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '2' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>2</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '3' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>3</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '4' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>4</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '5' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>5</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '6' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>6</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '7' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>7</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '8' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>8</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '9' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>9</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.numpadRow}>
                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.slice(0, -1))}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.actionButtonText}>✕</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Zero Button */}
                  <TouchableOpacity
                    onPress={() => setPassword(prev => prev.length < 4 ? prev + '0' : prev)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.numpadButton}>
                      <Text style={styles.numpadButtonText}>0</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Check Button */}
                  <TouchableOpacity
                    onPress={handlePasswordNext}
                    activeOpacity={0.8}
                    disabled={password.length !== 4}
                  >
                    <View style={[styles.numpadButton, password.length !== 4 && styles.disabledButton]}>
                      <Text style={[styles.actionButtonText, password.length !== 4 && styles.disabledButtonText]}>✓</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            // Step 2: Security Questions
            <View style={styles.settingsContainer}>
              <Text style={styles.headerText}>Security Questions</Text>

              {/* Question 1 */}
              <View style={styles.questionContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown1(!showDropdown1)}
                >
                  <Text style={securityQuestion1 ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {securityQuestion1 || "Security Question 1"}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {showDropdown1 && (
                  <View style={styles.dropdownMenu}>
                    {securityQuestions.map((question, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSecurityQuestion1(question);
                          setShowDropdown1(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{question}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Answer*"
                  placeholderTextColor="#999"
                  value={securityAnswer1}
                  onChangeText={setSecurityAnswer1}
                />
              </View>

              {/* Question 2 */}
              <View style={styles.questionContainer}>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDropdown2(!showDropdown2)}
                >
                  <Text style={securityQuestion2 ? styles.dropdownText : styles.dropdownPlaceholder}>
                    {securityQuestion2 || "Security Question 2"}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                {showDropdown2 && (
                  <View style={styles.dropdownMenu}>
                    {securityQuestions.map((question, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSecurityQuestion2(question);
                          setShowDropdown2(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{question}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Answer*"
                  placeholderTextColor="#999"
                  value={securityAnswer2}
                  onChangeText={setSecurityAnswer2}
                />
              </View>

              <Text style={styles.forgotPasswordText}>Forgot password?</Text>

              <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
                <Text style={styles.resetButtonText}>Reset password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          )}
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
  content: {
    flex: 1,
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.xxl,
  },
  logoContainer: {
    ...ComponentStyles.logoContainer,
  },
  logo: {
    ...ComponentStyles.logoImage,
  },
  bizledgerTitle: {
    ...ComponentStyles.logoText,
  },
  settingsContainer: {
    ...ComponentStyles.card,
    alignItems: "center",
    marginHorizontal: spacing.md,
  },
  headerText: {
    ...Typography.h4,
    color: AppColors.white,
    marginBottom: spacing.xl,
  },
  pinInputContainer: {
    backgroundColor: AppColors.overlay,
    borderRadius: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    minWidth: scale(200),
    alignItems: "center",
  },
  pinInputText: {
    ...Typography.body1,
    color: AppColors.white,
  },
  numpadContainer: {
    ...ComponentStyles.numpadContainer,
  },
  numpadRow: {
    ...ComponentStyles.numpadRow,
    marginBottom: spacing.md,
  },
  numpadButton: {
    width: numpad.buttonSize,
    height: numpad.buttonSize,
    borderRadius: numpad.buttonSize / 2,
    backgroundColor: AppColors.white,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: spacing.md,
    ...ComponentStyles.shadowMedium,
  },
  numpadButtonText: {
    ...ComponentStyles.numpadButtonText,
  },
  actionButtonText: {
    ...ComponentStyles.actionButtonText,
  },
  disabledButton: {
    backgroundColor: AppColors.lightGray,
  },
  disabledButtonText: {
    color: AppColors.gray,
  },
  questionContainer: {
    width: "100%",
    marginBottom: spacing.lg,
    position: "relative",
  },
  dropdown: {
    ...ComponentStyles.dropdown,
  },
  dropdownText: {
    ...ComponentStyles.dropdownText,
  },
  dropdownPlaceholder: {
    ...ComponentStyles.dropdownPlaceholder,
  },
  dropdownArrow: {
    ...ComponentStyles.dropdownArrow,
  },
  dropdownMenu: {
    ...ComponentStyles.dropdownMenu,
  },
  dropdownItem: {
    ...ComponentStyles.dropdownItem,
  },
  dropdownItemText: {
    ...ComponentStyles.dropdownItemText,
  },
  input: {
    ...ComponentStyles.textInputLight,
  },
  forgotPasswordText: {
    ...Typography.body2,
    color: AppColors.white,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  resetButton: {
    ...ComponentStyles.secondaryButton,
    marginBottom: spacing.lg,
  },
  resetButtonText: {
    ...Typography.button,
    color: AppColors.white,
  },
  saveButton: {
    ...ComponentStyles.secondaryButton,
  },
  saveButtonText: {
    ...Typography.button,
    color: AppColors.white,
  },
});
