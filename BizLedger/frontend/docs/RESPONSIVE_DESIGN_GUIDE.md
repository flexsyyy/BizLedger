# Responsive Design System Guide

This guide explains how to use the comprehensive responsive design system implemented in the BizLedger React Native app.

## Overview

The responsive design system consists of several key files:
- `constants/Responsive.ts` - Core responsive utilities and dimensions
- `constants/Typography.ts` - Typography system with responsive font scaling
- `constants/ComponentStyles.ts` - Pre-built responsive component styles
- `constants/Colors.ts` - Color palette and theme colors
- `hooks/useResponsive.ts` - React hooks for responsive behavior

## Quick Start

### 1. Import the Responsive System

```typescript
import { ResponsiveDimensions, getResponsiveLayout, scale } from '../constants/Responsive';
import { AppColors } from '../constants/Colors';
import { Typography, TextStyles } from '../constants/Typography';
import ComponentStyles from '../constants/ComponentStyles';
```

### 2. Use Responsive Dimensions

```typescript
const { spacing, fontSize, button, logo } = ResponsiveDimensions;
const layout = getResponsiveLayout();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
    paddingHorizontal: layout.containerPadding,
  },
  title: {
    ...TextStyles.whiteH1,
    marginBottom: spacing.xl,
  },
  button: {
    width: button.width.xl,
    height: button.height.lg,
    borderRadius: button.borderRadius.lg,
  },
});
```

## Core Concepts

### Scaling Functions

- `scale(size)` - Scales width-based dimensions
- `verticalScale(size)` - Scales height-based dimensions  
- `moderateScale(size, factor)` - Balanced scaling with custom factor
- `fontScale(size)` - Scales fonts with device-specific adjustments

### Device Detection

```typescript
import { isTablet, isSmallDevice, isLargeDevice } from '../constants/Responsive';

// Conditional styling based on device type
const buttonWidth = isTablet() ? scale(400) : scale(280);
```

### Responsive Dimensions Object

```typescript
ResponsiveDimensions = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  fontSize: { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 20, title: 24, largeTitle: 32 },
  button: {
    height: { sm: 40, md: 50, lg: 60, xl: 70 },
    width: { sm: 120, md: 160, lg: 200, xl: 280 },
    borderRadius: { sm: 8, md: 12, lg: 16, xl: 20 }
  },
  // ... more dimensions
}
```

## Typography System

### Using Typography Styles

```typescript
import { Typography, TextStyles } from '../constants/Typography';

const styles = StyleSheet.create({
  // Pre-defined text styles with colors
  title: TextStyles.whiteH1,
  subtitle: TextStyles.whiteH3,
  body: TextStyles.whiteBody,
  
  // Custom typography with manual color
  customText: {
    ...Typography.h2,
    color: AppColors.primary,
  },
});
```

### Available Typography Variants

- **Headings**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- **Body**: `body1`, `body2`, `body3`
- **UI Elements**: `button`, `caption`, `label`, `input`
- **Special**: `numpad`, `logo`, `navigation`

## Component Styles

### Pre-built Component Styles

```typescript
import ComponentStyles from '../constants/ComponentStyles';

const styles = StyleSheet.create({
  // Use pre-built styles
  container: ComponentStyles.screenContainer,
  card: ComponentStyles.card,
  button: ComponentStyles.primaryButton,
  input: ComponentStyles.textInput,
  
  // Extend pre-built styles
  customButton: {
    ...ComponentStyles.primaryButton,
    backgroundColor: AppColors.secondary,
  },
});
```

### Available Component Styles

- **Containers**: `screenContainer`, `safeAreaContainer`, `contentContainer`, `centeredContainer`
- **Cards**: `card`, `cardLight`
- **Buttons**: `primaryButton`, `secondaryButton`, `outlineButton`
- **Inputs**: `textInput`, `textInputLight`
- **Navigation**: `bottomNavigation`, `navItem`, `activeNavItem`
- **Numpad**: `numpadContainer`, `numpadRow`, `numpadButton`
- **Shadows**: `shadowSmall`, `shadowMedium`, `shadowLarge`

## Using Hooks

### useResponsive Hook

```typescript
import { useResponsive } from '../hooks/useResponsive';

const MyComponent = () => {
  const {
    screenWidth,
    screenHeight,
    isTablet,
    isSmallDevice,
    layout,
    dimensions,
    scale
  } = useResponsive();

  return (
    <View style={{
      width: isTablet ? scale(600) : '100%',
      padding: layout.containerPadding,
    }}>
      {/* Component content */}
    </View>
  );
};
```

### useResponsiveStyles Hook

```typescript
import { useResponsiveStyles } from '../hooks/useResponsive';

const MyComponent = () => {
  const { getResponsiveStyle } = useResponsiveStyles();

  const buttonStyle = getResponsiveStyle(
    { width: 200, height: 50 }, // base style
    { width: 300, height: 60 }, // tablet style
    { width: 150, height: 40 }, // small device style
    { width: 250, height: 45 }  // landscape style
  );

  return <TouchableOpacity style={buttonStyle} />;
};
```

## Color System

### Using App Colors

```typescript
import { AppColors } from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background,
  },
  text: {
    color: AppColors.white,
  },
  button: {
    backgroundColor: AppColors.primary,
  },
  error: {
    color: AppColors.error,
  },
});
```

### Available Colors

- **Primary**: `primary`, `secondary`
- **Neutrals**: `white`, `black`, `gray`, `lightGray`, `darkGray`
- **Semantic**: `success`, `warning`, `error`
- **UI**: `background`, `overlay`

## Best Practices

### 1. Always Use Responsive Scaling

```typescript
// ❌ Don't use fixed values
width: 280,
fontSize: 16,
marginTop: 20,

// ✅ Use responsive scaling
width: button.width.xl,
fontSize: fontSize.lg,
marginTop: spacing.lg,
```

### 2. Leverage Pre-built Styles

```typescript
// ❌ Don't recreate common patterns
container: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  borderRadius: 20,
  padding: 30,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

// ✅ Use pre-built component styles
container: ComponentStyles.card,
```

### 3. Use Typography System

```typescript
// ❌ Don't define typography manually
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFFFFF',
  fontFamily: 'Poppins-Bold',
},

// ✅ Use typography system
title: TextStyles.whiteH3,
```

### 4. Handle Different Device Types

```typescript
const { isTablet, isSmallDevice } = useResponsive();

const getColumns = () => {
  if (isTablet) return 2;
  if (isSmallDevice) return 1;
  return 1;
};
```

## Migration Guide

To migrate existing screens to the responsive system:

1. **Import the responsive system**
2. **Replace fixed dimensions with responsive ones**
3. **Use pre-built component styles**
4. **Apply typography system**
5. **Use app color palette**
6. **Test on different screen sizes**

### Example Migration

```typescript
// Before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  button: {
    width: 280,
    height: 70,
    backgroundColor: '#377DFF',
    borderRadius: 35,
  },
});

// After
const { spacing, button } = ResponsiveDimensions;
const layout = getResponsiveLayout();

const styles = StyleSheet.create({
  container: {
    ...ComponentStyles.screenContainer,
    paddingHorizontal: layout.containerPadding,
  },
  title: {
    ...TextStyles.whiteH1,
    marginBottom: spacing.xxl,
  },
  button: {
    ...ComponentStyles.primaryButton,
    width: button.width.xl,
    height: button.height.xl,
  },
});
```

This responsive design system ensures your app looks great on all device sizes while maintaining consistency and reducing code duplication.
