import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Image, ImageBackground } from "react-native";
import { Audio } from "expo-av";
import { uploadAudioForTranscription, testBackendConnection } from "../../services/api";
import SidePanel from "../../components/SidePanel";
import BottomNavigation from "../../components/BottomNavigation";
import { useFonts } from 'expo-font';
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../../constants/Responsive';
import { AppColors } from '../../constants/Colors';
import { Typography, TextStyles } from '../../constants/Typography';
import ComponentStyles from '../../constants/ComponentStyles';

export default function AndroidMediumScreen() {
  const router = useRouter();
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingType, setRecordingType] = useState<string | null>(null);
  const recording = useRef<any>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
  });

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        await testBackendConnection();
        console.log('✅ Backend connection successful');
      } catch (error: any) {
        console.error('❌ Backend connection failed:', error.message);
        Alert.alert(
          'Connection Error',
          'Could not connect to the backend server. Please make sure it is running.',
          [{ text: 'OK' }]
        );
      }
    };

    checkBackendConnection();
  }, []);

  const startRecording = async (type: string) => {
    try {
      console.log(`🎤 Button pressed! Starting ${type} recording...`);
      setRecordingType(type);
      setIsRecording(true);

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("❌ Permission to record audio was denied");
        Alert.alert("Permission Required", "Please allow microphone access to record audio.");
        setIsRecording(false);
        return;
      }

      console.log("✅ Audio permission granted");

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.current = newRecording;
      console.log(`🔴 Recording started for ${type}`);
    } catch (err) {
      console.error("❌ Failed to start recording:", err);
      Alert.alert("Recording Error", "Failed to start recording. Please try again.");
      setIsRecording(false);
      setRecordingType(null);
    }
  };

  const stopRecording = async () => {
    console.log("🛑 Button released! Stopping recording...");

    if (!recording.current) {
      console.log("⚠️ No active recording to stop");
      setIsRecording(false);
      setRecordingType(null);
      return;
    }

    try {
      setIsProcessing(true);
      console.log("⏹️ Stopping and processing recording...");

      await recording.current.stopAndUnloadAsync();

      const status = await recording.current.getStatusAsync();
      console.log(`📊 Recording duration: ${status.durationMillis}ms`);

      if (status.durationMillis < 500) {
        console.warn("⚠️ Recording too short, ignoring.");
        Alert.alert("Recording Too Short", "Please hold the button longer to record audio.");
        setIsRecording(false);
        setIsProcessing(false);
        recording.current = null;
        setRecordingType(null);
        return;
      }

      const uri = recording.current.getURI();
      console.log(`📁 ${recordingType?.toUpperCase()} audio recorded at:`, uri);

      // Upload to backend
      console.log("🚀 Uploading to backend...");
      const result = await uploadAudioForTranscription(uri, recordingType || 'unknown');
      console.log("✅ Transcription result:", result);

      setLastTransaction({
        type: recordingType,
        timestamp: new Date().toLocaleTimeString(),
        result,
      });

      recording.current = null;
    } catch (err) {
      console.error("❌ Failed to stop recording:", err);
      Alert.alert("Processing Error", "Failed to process recording. Please try again.");
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      setRecordingType(null);
    }
  };

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#377DFF" />
        <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
        <SafeAreaView style={styles.safeArea}>
          <SidePanel
            isVisible={isSidePanelVisible}
            onClose={() => setIsSidePanelVisible(false)}
          />

          {/* Top Navigation */}
          <View style={styles.topBar}>
            <Text style={styles.navLabel}>top nav bar</Text>
            <Image
              source={require("../../assets/images/splash.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Home Title */}
          <Text style={styles.homeTitle}>Home</Text>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Background Ellipses for Buttons */}
            <Image
              source={require("../../assets/images/Ellipse 30.png")}
              style={styles.ellipseButton1}
            />
            <Image
              source={require("../../assets/images/Ellipse 33.png")}
              style={styles.ellipseButton2}
            />

            {/* Recording Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPressIn={() => startRecording('debit')}
                onPressOut={stopRecording}
                disabled={isProcessing}
              >
                <ImageBackground
                  source={require("../../assets/images/debit-button-bg.png")}
                  style={styles.button}
                  imageStyle={styles.buttonImageStyle}
                >
                  {isProcessing && recordingType === 'debit' ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Hold for Debit</Text>
                  )}
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonWrapper}
                onPressIn={() => startRecording('credit')}
                onPressOut={stopRecording}
                disabled={isProcessing}
              >
                <ImageBackground
                  source={require("../../assets/images/credit-button-bg.png")}
                  style={styles.button}
                  imageStyle={styles.buttonImageStyle}
                >
                  {isProcessing && recordingType === 'credit' ? (
                    <ActivityIndicator color="#000" size="small" />
                  ) : (
                    <Text style={styles.buttonText}>Hold for Credit</Text>
                  )}
                </ImageBackground>
              </TouchableOpacity>
            </View>

            {/* Last Transaction Display */}
            {lastTransaction && (
              <View style={styles.lastTransactionContainer}>
                <Text style={styles.lastTransactionTitle}>Last Transaction</Text>
                <Text style={styles.lastTransactionText}>
                  Type: <Text style={styles.highlightText}>{lastTransaction.type?.toUpperCase()}</Text>
                </Text>
                {lastTransaction.result?.ledger_info?.amount && (
                  <Text style={styles.lastTransactionText}>
                    Amount: <Text style={styles.highlightText}>{lastTransaction.result.ledger_info.amount}</Text>
                  </Text>
                )}
                <Text style={styles.lastTransactionText}>
                  Time: <Text style={styles.highlightText}>{lastTransaction.timestamp}</Text>
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Navigation */}
          <BottomNavigation onProfilePress={() => setIsSidePanelVisible(true)} />
        </SafeAreaView>
    </ImageBackground>
  );
}

const { spacing, fontSize, button, navigation, logo } = ResponsiveDimensions;
const layout = getResponsiveLayout();
const safeArea = getSafeAreaPadding();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  navLabel: {
    ...Typography.caption,
    color: AppColors.gray,
  },
  logoImage: {
    position: 'absolute',
    top: spacing.lg,
    right: 1,
    width: logo.medium,
    height: logo.medium,
    zIndex: 10,
  },
  homeTitle: {
    ...TextStyles.whiteH1,
    marginBottom: spacing.xxl,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  buttonWrapper: {
    ...ComponentStyles.shadowLarge,
  },
  button: {
    width: button.width.xl,
    height: button.height.xl,
    borderRadius: button.height.xl / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.buttonLarge,
    color: AppColors.black,
  },
  lastTransactionContainer: {
    width: "90%",
    backgroundColor: "rgba(245, 245, 245, 0.95)",
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.primary,
    ...ComponentStyles.shadowMedium,
  },
  lastTransactionTitle: {
    ...Typography.h5,
    marginBottom: spacing.md,
    color: "#002D72",
  },
  lastTransactionText: {
    ...Typography.body1,
    marginBottom: spacing.sm,
    color: AppColors.darkGray,
  },
  highlightText: {
    ...Typography.body1,
    fontWeight: "bold",
    color: AppColors.primary,
  },

  ellipseButton1: {
    position: 'absolute',
    width: scale(200),
    height: scale(200),
    top: scale(50),
    left: scale(-50),
    zIndex: -1,
    opacity: 0.6,
  },
  ellipseButton2: {
    position: 'absolute',
    width: scale(180),
    height: scale(180),
    top: scale(200),
    right: scale(-40),
    zIndex: -1,
    opacity: 0.5,
  },
  buttonImageStyle: {
    borderRadius: button.height.xl / 2,
  },
});
