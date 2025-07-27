import { Platform } from 'react-native';
import { fontScale } from './Responsive';

// Font families
export const FontFamily = {
  regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
  medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  poppins: 'Poppins-Regular',
  poppinsSemiBold: 'Poppins-SemiBold',
  poppinsBold: 'Poppins-Bold',
  spaceMono: 'SpaceMono-Regular',
};

// Typography scale
export const Typography = {
  // Headings
  h1: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: fontScale(32),
    lineHeight: fontScale(40),
    fontWeight: 'bold' as const,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: fontScale(28),
    lineHeight: fontScale(36),
    fontWeight: 'bold' as const,
    letterSpacing: 0.5,
  },
  h3: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(24),
    lineHeight: fontScale(32),
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  h4: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(20),
    lineHeight: fontScale(28),
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  h5: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(18),
    lineHeight: fontScale(26),
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  h6: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },

  // Body text
  body1: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  body2: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(14),
    lineHeight: fontScale(22),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  body3: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(12),
    lineHeight: fontScale(20),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },

  // Captions and labels
  caption: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(10),
    lineHeight: fontScale(16),
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // Buttons
  button: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  buttonSmall: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  buttonLarge: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: fontScale(18),
    lineHeight: fontScale(26),
    fontWeight: 'bold' as const,
    letterSpacing: 0.5,
  },

  // Special use cases
  numpad: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: fontScale(30),
    lineHeight: fontScale(36),
    fontWeight: 'bold' as const,
    textAlign: 'center' as const,
  },
  logo: {
    fontFamily: FontFamily.poppinsBold,
    fontSize: fontScale(28),
    lineHeight: fontScale(34),
    fontWeight: 'bold' as const,
    letterSpacing: 3,
  },
  navigation: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(12),
    lineHeight: fontScale(16),
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },

  // Input fields
  input: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  inputLabel: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },
  placeholder: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },

  // Error and success messages
  error: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  success: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
  },

  // Links
  link: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    textDecorationLine: 'underline' as const,
  },
  linkSmall: {
    fontFamily: FontFamily.poppins,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
    fontWeight: '400' as const,
    letterSpacing: 0.1,
    textDecorationLine: 'underline' as const,
  },
};

// Helper function to get typography style with color
export const getTypographyStyle = (variant: keyof typeof Typography, color?: string) => {
  const baseStyle = Typography[variant];
  return color ? { ...baseStyle, color } : baseStyle;
};

// Common text color combinations
export const TextColors = {
  primary: '#FFFFFF',
  secondary: '#999999',
  accent: '#377DFF',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  dark: '#000000',
  light: '#FFFFFF',
  muted: '#CCCCCC',
};

// Pre-defined text styles with colors
export const TextStyles = {
  // White text variants
  whiteH1: getTypographyStyle('h1', TextColors.primary),
  whiteH2: getTypographyStyle('h2', TextColors.primary),
  whiteH3: getTypographyStyle('h3', TextColors.primary),
  whiteBody: getTypographyStyle('body1', TextColors.primary),
  whiteCaption: getTypographyStyle('caption', TextColors.primary),
  
  // Dark text variants
  darkH1: getTypographyStyle('h1', TextColors.dark),
  darkH2: getTypographyStyle('h2', TextColors.dark),
  darkH3: getTypographyStyle('h3', TextColors.dark),
  darkBody: getTypographyStyle('body1', TextColors.dark),
  darkCaption: getTypographyStyle('caption', TextColors.dark),
  
  // Accent text variants
  accentButton: getTypographyStyle('button', TextColors.accent),
  accentLink: getTypographyStyle('link', TextColors.accent),
  
  // Muted text
  mutedCaption: getTypographyStyle('caption', TextColors.muted),
  mutedBody: getTypographyStyle('body2', TextColors.muted),
};

export default Typography;
