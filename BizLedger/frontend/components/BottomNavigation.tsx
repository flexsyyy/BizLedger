import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, getSafeAreaPadding } from '../constants/Responsive';

interface BottomNavigationProps {
  onProfilePress?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onProfilePress }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine which tab is currently active
  const isHomeActive = pathname === '/(tabs)/home' || pathname === '/home';
  const isHistoryActive = pathname === '/(tabs)/history' || pathname === '/history' || pathname === '/details';
  const isAnalyticsActive = pathname === '/analytics';

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      // Default behavior - navigate to settings or show side panel
      router.push('/(tabs)/settings');
    }
  };

  const handleHomePress = () => {
    router.push('/(tabs)/home');
  };

  const handleHistoryPress = () => {
    router.push('/(tabs)/history');
  };

  return (
    <LinearGradient
      colors={['#1E3A8A', '#1E40AF', '#1D4ED8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.navContent}>
        {/* Profile Icon */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleProfilePress}
        >
          <Image
            source={require('../assets/images/icon-profile.png')}
            style={[
              styles.navIcon,
              {
                opacity: 0.7,
                tintColor: '#FFFFFF'
              }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Home Icon */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleHomePress}
        >
          <Image
            source={require('../assets/images/icon-home.png')}
            style={[
              styles.navIcon,
              {
                opacity: isHomeActive ? 1.0 : 0.5,
                tintColor: '#FFFFFF'
              }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* History Icon */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={handleHistoryPress}
        >
          <Image
            source={require('../assets/images/icon-history.png')}
            style={[
              styles.navIcon,
              {
                opacity: isHistoryActive ? 1.0 : 0.5,
                tintColor: '#FFFFFF'
              }
            ]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const safeArea = getSafeAreaPadding();
const screenWidth = Dimensions.get('window').width;
const parentMaxWidth = 393;
const leftOffset = (screenWidth - parentMaxWidth) / 2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: -leftOffset,
    right: -leftOffset,
    width: screenWidth,
    height: scale(107),
    paddingBottom: safeArea.paddingBottom || scale(20),
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: scale(10),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // Glassmorphism effects
    // Inner shadow (inset effect simulation)
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.50)',
    // Outer shadow effect - exact specifications
    shadowColor: 'rgba(41, 39, 130, 0.10)',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 15,
    // Additional glassmorphism styling
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    // Backdrop blur simulation with overlay
    overflow: 'hidden',
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: scale(15),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(10),
  },
  navIcon: {
    width: scale(24),
    height: scale(24),
  },
});

export default BottomNavigation;
