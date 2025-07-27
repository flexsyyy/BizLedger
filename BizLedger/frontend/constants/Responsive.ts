import { Dimensions, PixelRatio, Platform } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Device type detection
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      (adjustedWidth >= 1920 && adjustedHeight >= 1080) ||
      (adjustedWidth >= 1080 && adjustedHeight >= 1920)
    );
  }
};

export const isSmallDevice = () => SCREEN_WIDTH < 375;
export const isLargeDevice = () => SCREEN_WIDTH > 414;

// Responsive scaling functions
export const scale = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleRatio));
};

export const verticalScale = (size: number): number => {
  const scaleRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleRatio));
};

export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

// Font scaling
export const fontScale = (size: number): number => {
  const scaleRatio = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scaleRatio;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  if (isTablet()) {
    return Math.round(newSize * 0.9); // Slightly smaller on tablets
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive dimensions
export const ResponsiveDimensions = {
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  
  // Common spacing
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },
  
  // Font sizes
  fontSize: {
    xs: fontScale(10),
    sm: fontScale(12),
    md: fontScale(14),
    lg: fontScale(16),
    xl: fontScale(18),
    xxl: fontScale(20),
    title: fontScale(24),
    largeTitle: fontScale(32),
  },
  
  // Icon sizes
  iconSize: {
    xs: scale(16),
    sm: scale(20),
    md: scale(24),
    lg: scale(28),
    xl: scale(32),
    xxl: scale(40),
  },
  
  // Button dimensions
  button: {
    height: {
      sm: verticalScale(40),
      md: verticalScale(50),
      lg: verticalScale(60),
      xl: verticalScale(70),
    },
    width: {
      sm: scale(120),
      md: scale(160),
      lg: scale(200),
      xl: scale(280),
    },
    borderRadius: {
      sm: scale(8),
      md: scale(12),
      lg: scale(16),
      xl: scale(20),
    },
  },
  
  // Input dimensions
  input: {
    height: verticalScale(50),
    borderRadius: scale(12),
    padding: scale(16),
  },
  
  // Container dimensions
  container: {
    padding: scale(20),
    margin: scale(16),
    borderRadius: scale(16),
  },
  
  // Navigation
  navigation: {
    height: verticalScale(80),
    iconSize: scale(24),
    activeIconSize: scale(28),
  },
  
  // Logo and images
  logo: {
    small: scale(60),
    medium: scale(80),
    large: scale(100),
  },
  
  // Numpad (for login/settings)
  numpad: {
    buttonSize: scale(75),
    buttonSpacing: scale(8),
    fontSize: fontScale(30),
  },
  
  // Cards and panels
  card: {
    borderRadius: scale(15),
    padding: scale(20),
    margin: scale(10),
  },
};

// Responsive styles helper
export const createResponsiveStyle = (baseStyle: any, tabletStyle?: any, smallDeviceStyle?: any) => {
  if (isTablet() && tabletStyle) {
    return { ...baseStyle, ...tabletStyle };
  }
  
  if (isSmallDevice() && smallDeviceStyle) {
    return { ...baseStyle, ...smallDeviceStyle };
  }
  
  return baseStyle;
};

// Layout helpers
export const getResponsiveLayout = () => {
  const isTab = isTablet();
  const isSmall = isSmallDevice();
  
  return {
    isTablet: isTab,
    isSmallDevice: isSmall,
    isLargeDevice: isLargeDevice(),
    columns: isTab ? 2 : 1,
    containerPadding: isTab ? scale(40) : scale(20),
    maxWidth: isTab ? scale(600) : '100%',
  };
};

// Safe area helpers
export const getSafeAreaPadding = () => {
  const layout = getResponsiveLayout();
  
  return {
    paddingTop: Platform.OS === 'ios' ? (layout.isTablet ? scale(20) : scale(10)) : scale(10),
    paddingBottom: Platform.OS === 'ios' ? scale(20) : scale(10),
    paddingHorizontal: layout.containerPadding,
  };
};

// Export commonly used values
export const {
  spacing,
  fontSize,
  iconSize,
  button,
  input,
  container,
  navigation,
  logo,
  numpad,
  card,
} = ResponsiveDimensions;
