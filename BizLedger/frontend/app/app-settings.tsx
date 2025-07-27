import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Switch,
  StatusBar,
  ImageBackground
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ResponsiveDimensions, scale } from '../constants/Responsive';

interface SettingToggleProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ title, value, onValueChange }) => {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingText}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3C', true: '#53D1FF' }}
        thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        ios_backgroundColor="#3A3A3C"
        style={styles.switch}
      />
    </View>
  );
};

export default function AppSettingsScreen() {
  const router = useRouter();

  // Settings state
  const [backupReminder, setBackupReminder] = useState(true);
  const [hapticTouch, setHapticTouch] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [chronological, setChronological] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />

        <ImageBackground
          source={require('../assets/images/app-settingsbg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Image
              source={require('../assets/images/arrows.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Settings Content */}
        <View style={styles.settingsContainer}>
          <SettingToggle
            title="Backup reminder"
            value={backupReminder}
            onValueChange={setBackupReminder}
          />

          <SettingToggle
            title="Haptic Touch"
            value={hapticTouch}
            onValueChange={setHapticTouch}
          />

          <SettingToggle
            title="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />

          <SettingToggle
            title="Chronological"
            value={chronological}
            onValueChange={setChronological}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
    </>
  );
}

const { spacing } = ResponsiveDimensions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    zIndex: 1,
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
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scale(28),
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  headerSpacer: {
    width: scale(40),
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    zIndex: 1,
  },
  settingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: scale(20),
    paddingVertical: scale(20),
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(23, 99, 240, 0.2)',
  },
  settingText: {
    color: '#FFFFFF',
    fontSize: scale(18),
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  switch: {
    transform: [{ scaleX: scale(1.2) }, { scaleY: scale(1.2) }],
  },
});
