// Removed unused imports
import { useRouter } from "expo-router";
import React from "react";
import {
    Animated,
    Image,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import { ResponsiveDimensions, getResponsiveLayout, scale, verticalScale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import ComponentStyles from '../constants/ComponentStyles';
import { useResponsive } from '../hooks/useResponsive';

interface SidePanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isVisible, onClose }) => {
  const router = useRouter();
  const { isTablet, screenWidth } = useResponsive();
  // Much smaller panel width
  const panelWidth = isTablet ? 220 : 200;
  const translateX = React.useRef(new Animated.Value(-panelWidth)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: -panelWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route);
  };

  if (!isVisible) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateX }], width: panelWidth }
        ]}
      >
        <ImageBackground
          source={require('../assets/images/sidepanel.png')}
          style={styles.panelBackground}
          resizeMode="cover"
        >
          {/* Blue tone overlay */}
          <View style={styles.blueOverlay}>
            {/* Header with Logo */}
            <View style={styles.header}>
            <Image
              source={require('../assets/images/splash.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Separation line below logo */}
          <View style={styles.separationLine} />

          {/* Menu Items */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Home */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/(tabs)/home")}
          >
            <Image
              source={require('../assets/images/Home.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>

          {/* Ledger */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose(); // Close the side panel
              router.push("/ledger" as any);
            }}
          >
            <Image
              source={require('../assets/images/icon-history.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Ledger</Text>
          </TouchableOpacity>

          {/* Analytics */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose(); // Close the side panel
              router.push("/analytics" as any);
            }}
          >
            <Image
              source={require('../assets/images/analytics.png')}
              style={styles.menuIcon}
            />
            <View style={styles.analyticsTextContainer}>
              <Text style={styles.menuText}>Analytics</Text>
            </View>
          </TouchableOpacity>

          {/* Finance Assistant */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose(); // Close the side panel
              router.push("/finance-assistant" as any);
            }}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIconText}>🎤</Text>
            </View>
            <Text style={styles.menuText}>Finance Assistant</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose(); // Close the side panel
              router.push("/app-settings" as any);
            }}
          >
            <Image
              source={require('../assets/images/Settings.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/(tabs)/settings")}
          >
            <Image
              source={require('../assets/images/Adobe Express - file 1.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Change password</Text>
          </TouchableOpacity>

          {/* Change Security Questions */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/(tabs)/settings")}
          >
            <Image
              source={require('../assets/images/WhatsApp_Image_2025-05-18_at_02.23.33_701e6ac5-removebg-preview 1.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Change Security questions</Text>
          </TouchableOpacity>

          {/* Backup */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/(tabs)/history")}
          >
            <Image
              source={require('../assets/images/backup.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Backup</Text>
          </TouchableOpacity>

          {/* Rate the App */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {}}
          >
            <Image
              source={require('../assets/images/Star.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Rate the App</Text>
          </TouchableOpacity>

          {/* FAQs */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onClose(); // Close the side panel
              router.push("/faq" as any);
            }}
          >
            <Image
              source={require('../assets/images/Faqs.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>FAQs</Text>
          </TouchableOpacity>

          {/* Share the App */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {}}
          >
            <Image
              source={require('../assets/images/Share.png')}
              style={styles.menuIcon}
            />
            <Text style={styles.menuText}>Share the App</Text>
          </TouchableOpacity>
          </ScrollView>
          </View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  panelBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blueOverlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Subtle blue tint
  },
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 150,
    height: 150,
    tintColor: "#FFFFFF",
  },
  separationLine: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    // Removed border for cleaner look
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: "#FFFFFF", // Changed to white

  },
  menuText: {
    fontSize: 15,
    color: "#FFFFFF", // Changed to white
    fontWeight: "500",
  },
  analyticsTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumText: {
    fontSize: 12,
    color: "#FFFFFF", // Changed to white
    marginLeft: 5,
    fontStyle: "italic",
  },
  menuIconContainer: {
    width: 24,
    height: 24,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default SidePanel;
