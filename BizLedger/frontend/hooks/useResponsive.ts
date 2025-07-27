import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { 
  ResponsiveDimensions, 
  getResponsiveLayout, 
  getSafeAreaPadding,
  isTablet,
  isSmallDevice,
  isLargeDevice,
  scale,
  verticalScale,
  moderateScale,
  fontScale
} from '../constants/Responsive';

interface ResponsiveHookReturn {
  // Screen dimensions
  screenWidth: number;
  screenHeight: number;
  
  // Device type flags
  isTablet: boolean;
  isSmallDevice: boolean;
  isLargeDevice: boolean;
  
  // Layout information
  layout: ReturnType<typeof getResponsiveLayout>;
  safeArea: ReturnType<typeof getSafeAreaPadding>;
  
  // Responsive dimensions
  dimensions: typeof ResponsiveDimensions;
  
  // Scaling functions
  scale: typeof scale;
  verticalScale: typeof verticalScale;
  moderateScale: typeof moderateScale;
  fontScale: typeof fontScale;
  
  // Orientation
  isLandscape: boolean;
  isPortrait: boolean;
}

export const useResponsive = (): ResponsiveHookReturn => {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = screenData;
  const isLandscapeOrientation = screenWidth > screenHeight;
  const isPortraitOrientation = screenHeight > screenWidth;

  return {
    // Screen dimensions
    screenWidth,
    screenHeight,
    
    // Device type flags
    isTablet: isTablet(),
    isSmallDevice: isSmallDevice(),
    isLargeDevice: isLargeDevice(),
    
    // Layout information
    layout: getResponsiveLayout(),
    safeArea: getSafeAreaPadding(),
    
    // Responsive dimensions
    dimensions: ResponsiveDimensions,
    
    // Scaling functions
    scale,
    verticalScale,
    moderateScale,
    fontScale,
    
    // Orientation
    isLandscape: isLandscapeOrientation,
    isPortrait: isPortraitOrientation,
  };
};

// Hook for getting responsive styles based on device type
export const useResponsiveStyles = () => {
  const responsive = useResponsive();
  
  const getResponsiveStyle = (
    baseStyle: any,
    tabletStyle?: any,
    smallDeviceStyle?: any,
    landscapeStyle?: any
  ) => {
    let style = { ...baseStyle };
    
    if (responsive.isTablet && tabletStyle) {
      style = { ...style, ...tabletStyle };
    }
    
    if (responsive.isSmallDevice && smallDeviceStyle) {
      style = { ...style, ...smallDeviceStyle };
    }
    
    if (responsive.isLandscape && landscapeStyle) {
      style = { ...style, ...landscapeStyle };
    }
    
    return style;
  };
  
  return {
    ...responsive,
    getResponsiveStyle,
  };
};

// Hook for responsive text sizing
export const useResponsiveText = () => {
  const { fontScale, isTablet, isSmallDevice } = useResponsive();
  
  const getTextSize = (baseSize: number) => {
    let size = fontScale(baseSize);
    
    if (isTablet) {
      size = size * 1.1; // Slightly larger on tablets
    } else if (isSmallDevice) {
      size = size * 0.9; // Slightly smaller on small devices
    }
    
    return Math.round(size);
  };
  
  return {
    getTextSize,
    fontScale,
  };
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
  const { scale, isTablet, isSmallDevice } = useResponsive();
  
  const getSpacing = (baseSpacing: number) => {
    let spacing = scale(baseSpacing);
    
    if (isTablet) {
      spacing = spacing * 1.2; // More spacing on tablets
    } else if (isSmallDevice) {
      spacing = spacing * 0.8; // Less spacing on small devices
    }
    
    return Math.round(spacing);
  };
  
  return {
    getSpacing,
    scale,
  };
};

// Hook for responsive component sizing
export const useResponsiveComponent = () => {
  const { scale, verticalScale, isTablet, isSmallDevice } = useResponsive();
  
  const getComponentSize = (width: number, height: number) => {
    let componentWidth = scale(width);
    let componentHeight = verticalScale(height);
    
    if (isTablet) {
      componentWidth = componentWidth * 1.1;
      componentHeight = componentHeight * 1.1;
    } else if (isSmallDevice) {
      componentWidth = componentWidth * 0.9;
      componentHeight = componentHeight * 0.9;
    }
    
    return {
      width: Math.round(componentWidth),
      height: Math.round(componentHeight),
    };
  };
  
  return {
    getComponentSize,
    scale,
    verticalScale,
  };
};

export default useResponsive;
