import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import BottomNavigation from '../components/BottomNavigation';
import { ResponsiveDimensions, getResponsiveLayout, getSafeAreaPadding, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import { sendMCPAudioQuery } from '../services/api';

const FinanceAssistantScreen = () => {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  const startRecording = async () => {
    try {
      setError(null);
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      setError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      console.log('Stopping recording..');
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);

      if (uri) {
        await sendAudioToAssistant(uri);
      }

      setRecording(null);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setError('Failed to stop recording.');
    }
  };

  const sendAudioToAssistant = async (audioUri: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Sending audio to finance assistant...');

      const response = await sendMCPAudioQuery(audioUri);
      console.log('Finance assistant response:', response);

      // Extract the response text from the API response
      const responseText = response.answer || response.response || response.result || 'No response received';
      setAssistantResponse(responseText);

    } catch (err) {
      console.error('Failed to get response from finance assistant:', err);
      setError('Failed to get response from finance assistant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const clearResponse = () => {
    setAssistantResponse('');
    setError(null);
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
            <Text style={styles.headerTitle}>Finance Assistant</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Ask Your Finance Assistant</Text>
              <Text style={styles.instructionsText}>
                Tap the microphone button below to record your financial question.
                The AI assistant will analyze your query and provide helpful insights.
              </Text>
            </View>

            {/* Record Button */}
            <View style={styles.recordContainer}>
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && styles.recordingButton,
                  isLoading && styles.disabledButton
                ]}
                onPress={handleRecordPress}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FFFFFF" />
                ) : (
                  <Text style={[
                    styles.micIconText,
                    isRecording && styles.recordingMicIconText
                  ]}>
                    🎤
                  </Text>
                )}
              </TouchableOpacity>

              <Text style={styles.recordButtonText}>
                {isLoading
                  ? 'Processing...'
                  : isRecording
                    ? 'Tap to Stop Recording'
                    : 'Tap to Start Recording'
                }
              </Text>
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.clearButton} onPress={() => setError(null)}>
                  <Text style={styles.clearButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Response Container */}
            <View style={styles.responseContainer}>
              <View style={styles.responseHeader}>
                <Text style={styles.responseTitle}>Assistant Response</Text>
                {assistantResponse && (
                  <TouchableOpacity style={styles.clearButton} onPress={clearResponse}>
                    <Text style={styles.clearButtonText}>Clear</Text>
                  </TouchableOpacity>
                )}
              </View>

              <ScrollView
                style={styles.responseScrollView}
                contentContainerStyle={styles.responseContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <Text style={styles.responseText}>
                  {assistantResponse || 'Your finance assistant response will appear here...'}
                </Text>
              </ScrollView>
            </View>

            {/* Add some padding at the bottom for scrolling past the navbar */}
            <View style={{ height: scale(80) }} />
          </ScrollView>

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
  scrollContainer: {
    flex: 1,
    paddingBottom: scale(120),
  },
  instructionsContainer: {
    backgroundColor: 'rgba(83, 209, 255, 0.1)',
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(8),
    marginBottom: spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
  },
  instructionsTitle: {
    ...TextStyles.whiteH2,
    color: '#53D1FF',
    marginBottom: scale(8),
    fontSize: scale(18),
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    textAlign: 'center',
    lineHeight: scale(20),
  },
  recordContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    paddingHorizontal: scale(16),
  },
  recordButton: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: '#53D1FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 8,
    marginBottom: scale(16),
  },
  recordingButton: {
    backgroundColor: '#FF4444',
    transform: [{ scale: 1.1 }],
  },
  disabledButton: {
    backgroundColor: '#666666',
    transform: [{ scale: 1 }],
  },
  micIcon: {
    width: scale(40),
    height: scale(40),
    tintColor: AppColors.white,
  },
  recordingMicIcon: {
    tintColor: AppColors.white,
  },
  micIconText: {
    fontSize: scale(40),
    color: AppColors.white,
  },
  recordingMicIconText: {
    fontSize: scale(40),
    color: AppColors.white,
  },
  recordButtonText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    textAlign: 'center',
    fontSize: scale(14),
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(8),
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
  },
  errorText: {
    ...TextStyles.whiteBody,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: scale(8),
  },
  responseContainer: {
    backgroundColor: 'rgba(2, 164, 223, 0.1)',
    borderRadius: scale(12),
    marginHorizontal: scale(8),
    marginBottom: spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(4),
    elevation: 8,
    minHeight: scale(200),
    maxHeight: scale(400),
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  responseTitle: {
    ...TextStyles.whiteH2,
    color: '#53D1FF',
    fontSize: scale(16),
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(6),
  },
  clearButtonText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    fontSize: scale(12),
    fontWeight: '500',
  },
  responseScrollView: {
    flex: 1,
    maxHeight: scale(300),
  },
  responseContent: {
    padding: scale(16),
    paddingTop: scale(12),
  },
  responseText: {
    ...TextStyles.whiteBody,
    color: AppColors.white,
    lineHeight: scale(22),
    fontSize: scale(14),
  },
});

export default FinanceAssistantScreen;
