import { StyleSheet } from 'react-native';
import { ResponsiveDimensions, getSafeAreaPadding, getResponsiveLayout } from './Responsive';
import { AppColors } from './Colors';
import { Typography } from './Typography';

const { spacing, fontSize, button, input, container, navigation, logo, numpad, card } = ResponsiveDimensions;
const layout = getResponsiveLayout();
const safeArea = getSafeAreaPadding();

// Common component styles that can be reused across the app
export const ComponentStyles = StyleSheet.create({
  // Container styles
  screenContainer: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    ...safeArea,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: layout.containerPadding,
    paddingTop: spacing.lg,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layout.containerPadding,
  },
  
  // Card styles
  card: {
    backgroundColor: AppColors.background,
    borderRadius: card.borderRadius,
    padding: card.padding,
    margin: card.margin,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLight: {
    backgroundColor: AppColors.white,
    borderRadius: card.borderRadius,
    padding: card.padding,
    margin: card.margin,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: AppColors.primary,
    borderRadius: button.borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: button.height.md,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: button.borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: button.height.md,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppColors.white,
    borderRadius: button.borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: button.height.md,
  },
  
  // Input styles
  textInput: {
    backgroundColor: AppColors.overlay,
    borderRadius: input.borderRadius,
    paddingVertical: spacing.md,
    paddingHorizontal: input.padding,
    fontSize: fontSize.lg,
    color: AppColors.white,
    minHeight: input.height,
    ...Typography.input,
  },
  textInputLight: {
    backgroundColor: AppColors.white,
    borderRadius: input.borderRadius,
    paddingVertical: spacing.md,
    paddingHorizontal: input.padding,
    fontSize: fontSize.lg,
    color: AppColors.black,
    minHeight: input.height,
    borderWidth: 1,
    borderColor: AppColors.lightGray,
    ...Typography.input,
  },
  
  // Logo styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: logo.medium,
    height: logo.medium,
    marginBottom: spacing.md,
  },
  logoText: {
    ...Typography.logo,
    color: AppColors.white,
  },
  
  // Navigation styles
  bottomNavigation: {
    height: navigation.height,
    borderRadius: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeNavItem: {
    transform: [{ scale: 1.1 }],
  },
  navIcon: {
    width: navigation.iconSize,
    height: navigation.iconSize,
    tintColor: AppColors.white,
  },
  activeNavIcon: {
    width: navigation.activeIconSize,
    height: navigation.activeIconSize,
    tintColor: AppColors.white,
  },
  
  // Numpad styles
  numpadContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: numpad.buttonSpacing,
    marginBottom: spacing.sm,
  },
  numpadButton: {
    width: numpad.buttonSize,
    height: numpad.buttonSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: numpad.buttonSize / 2,
  },
  numpadButtonText: {
    ...Typography.numpad,
    color: AppColors.black,
  },
  actionButtonText: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: AppColors.black,
    textAlign: 'center',
  },
  
  // Text styles
  title: {
    ...Typography.h1,
    color: AppColors.white,
    marginBottom: spacing.xl,
  },
  subtitle: {
    ...Typography.h3,
    color: AppColors.white,
    marginBottom: spacing.lg,
  },
  bodyText: {
    ...Typography.body1,
    color: AppColors.white,
    marginBottom: spacing.md,
  },
  captionText: {
    ...Typography.caption,
    color: AppColors.gray,
    marginBottom: spacing.sm,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    ...Typography.body1,
    color: AppColors.white,
    marginTop: spacing.md,
  },
  
  // Error styles
  errorContainer: {
    backgroundColor: AppColors.error,
    borderRadius: container.borderRadius,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  errorText: {
    ...Typography.error,
    color: AppColors.white,
    textAlign: 'center',
  },
  
  // Success styles
  successContainer: {
    backgroundColor: AppColors.success,
    borderRadius: container.borderRadius,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  successText: {
    ...Typography.success,
    color: AppColors.white,
    textAlign: 'center',
  },
  
  // Dropdown styles
  dropdown: {
    backgroundColor: AppColors.overlay,
    borderRadius: input.borderRadius,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    minHeight: input.height,
  },
  dropdownText: {
    ...Typography.body1,
    color: AppColors.white,
    flex: 1,
  },
  dropdownPlaceholder: {
    ...Typography.body1,
    color: AppColors.lightGray,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: fontSize.sm,
    color: AppColors.white,
  },
  dropdownMenu: {
    position: 'absolute',
    top: input.height + spacing.sm,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: input.borderRadius,
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.overlay,
  },
  dropdownItemText: {
    ...Typography.body1,
    color: AppColors.white,
  },
  
  // Shadow styles
  shadowSmall: {
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  shadowMedium: {
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shadowLarge: {
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default ComponentStyles;
