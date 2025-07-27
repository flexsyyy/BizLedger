/**
 * Voice Recorder Component
 *
 * This component handles voice recording functionality.
 */

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { uploadAudioForTranscription } from "../services/api";

const VoiceRecorder = ({ onRecordingComplete }) => {
  const recording = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingType, setRecordingType] = useState(null);

  const startRecording = async (type) => {
    try {
      setRecordingType(type);
      console.log(`Starting ${type} recording...`);

      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to record audio was denied");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recording.current = newRecording;
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recording.current) {
      setIsRecording(false);
      return;
    }

    try {
      console.log("Stopping recording...");
      setIsProcessing(true);

      await recording.current.stopAndUnloadAsync();

      const status = await recording.current.getStatusAsync();
      if (status.durationMillis < 500) {
        console.warn("Recording too short, ignoring.");
        setIsRecording(false);
        setIsProcessing(false);
        recording.current = null;
        return;
      }

      const uri = recording.current.getURI();
      console.log(`${recordingType.toUpperCase()} audio recorded at:`, uri);
      console.log(`Transaction type: ${recordingType} - Sending to backend...`);

      // Upload to backend
      const result = await uploadAudioForTranscription(uri, recordingType);
      console.log("Transcription result:", result);

      if (result && result.ledger_info) {
        console.log("Amount detected:", result.ledger_info.amount);
        console.log(
          "Description:",
          result.ledger_info.description || "No description"
        );
      }

      // Notify parent component
      if (onRecordingComplete) {
        onRecordingComplete({
          type: recordingType,
          uri,
          result,
        });
      }

      recording.current = null;
    } catch (err) {
      console.error("Failed to stop recording:", err);
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      setRecordingType(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Debit Button */}
      <TouchableOpacity
        style={[
          styles.debitButton,
          isRecording && recordingType === "debit" && styles.activeButton,
        ]}
        onPressIn={() =>
          !isRecording && !isProcessing && startRecording("debit")
        }
        onPressOut={() =>
          isRecording && recordingType === "debit" && stopRecording()
        }
        disabled={isProcessing || (isRecording && recordingType !== "debit")}
      >
        {isProcessing && recordingType === "debit" ? (
          <ActivityIndicator color="#000000" size="small" />
        ) : (
          <Text style={styles.debitText}>
            {isRecording && recordingType === "debit"
              ? "Release to Stop"
              : "Hold for Debit"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Credit Button */}
      <TouchableOpacity
        style={[
          styles.creditButton,
          isRecording && recordingType === "credit" && styles.activeButton,
        ]}
        onPressIn={() =>
          !isRecording && !isProcessing && startRecording("credit")
        }
        onPressOut={() =>
          isRecording && recordingType === "credit" && stopRecording()
        }
        disabled={isProcessing || (isRecording && recordingType !== "credit")}
      >
        {isProcessing && recordingType === "credit" ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.creditText}>
            {isRecording && recordingType === "credit"
              ? "Release to Stop"
              : "Hold for Credit"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  debitButton: {
    width: "80%",
    height: 70,
    backgroundColor: "#E0E0E0", // Light gray for debit button
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  creditButton: {
    width: "80%",
    height: 70,
    backgroundColor: "#002D72", // Dark blue for credit button
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  activeButton: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  debitText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000000",
  },
  creditText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

export default VoiceRecorder;
