export const palette = {
  // Primary brand colors - per design system
  primary: '#5159B0', // Primary Indigo
  primaryLight: '#818CF8', // Indigo Light
  primaryDark: '#3d4389', // Primary hover state

  // Backgrounds - per design system
  background: '#FFFFFF', // White background
  backgroundDark: '#1E293B', // Dark Slate (NOT pure black)
  surface: '#FFFFFF',
  surfaceElevated: '#F1F5F9',

  // Text colors - per design system hierarchy
  text: '#0F172A', // Primary text on light
  textSecondary: '#64748B', // Muted Gray - secondary/tertiary
  textTertiary: '#94A3B8', // Slate Gray - descriptions
  textInverse: '#F1F5F9', // White on dark backgrounds

  // Text on dark backgrounds - per design system
  textOnDark: '#F1F5F9', // Primary text on dark (#F1F5F9)
  textOnDarkSecondary: '#94A3B8', // Secondary text on dark
  textOnDarkTertiary: '#64748B', // Tertiary text on dark

  // Alert colors - ONLY for notifications per design system
  alertCritical: '#DC2626', // Red - critical alerts only
  alertWarning: '#D97706', // Orange - warning alerts only
  alertSuccess: '#059669', // Green - success alerts only
  alertInfo: '#818CF8', // Light Indigo - info alerts only

  // Semantic colors (legacy - prefer alert colors above)
  success: '#059669',
  successLight: 'rgba(5, 150, 105, 0.05)',
  warning: '#D97706',
  warningLight: 'rgba(217, 119, 6, 0.05)',
  error: '#DC2626',
  errorLight: 'rgba(220, 38, 38, 0.05)',
  info: '#818CF8',
  infoLight: 'rgba(129, 140, 248, 0.05)',

  // Priority colors
  priorityHigh: '#DC2626',
  priorityMedium: '#D97706',
  priorityLow: '#059669',

  // Borders - per design system (always 1px)
  border: '#E5E7EB', // Standard border
  borderDark: '#334155', // Border on dark backgrounds
  divider: '#F1F5F9',

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.6)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',

  // Labels on dark backgrounds
  labelOnDark: '#818CF8', // Light indigo for labels on dark
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  badge: 6, // 6px - Badges, pills per design system
  button: 8, // 8px - Buttons, small cards per design system
  card: 12, // 12px - Cards, containers per design system
  input: 8, // 8px - Input fields
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
  small: 8,
  medium: 12,
  large: 16,
};

export const typography = {
  // Typography hierarchy per design system
  h1: { fontSize: 42, fontWeight: '700' as const, lineHeight: 48, fontFamily: 'Montserrat-Bold' },
  h2: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40, fontFamily: 'Montserrat-Bold' },
  h3: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32, fontFamily: 'Montserrat-Bold' },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, fontFamily: 'Inter-Regular' },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
  },
  secondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  label: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

// Shadow system per design system specifications
export const shadow = {
  // Light shadow: 0 2px 8px rgba(15, 23, 42, 0.04)
  light: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  // Elevated shadow: 0 4px 16px rgba(15, 23, 42, 0.15)
  elevated: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  // Featured shadow: 0 8px 32px rgba(81, 89, 176, 0.2)
  featured: {
    shadowColor: '#5159B0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 8,
  },
  // Large shadow for modals and overlays
  large: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  // Legacy support
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 2,
  card: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
};

export const shadowLarge = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
  elevation: 6,
};

export const animations = { fast: 200, normal: 300, slow: 500 };
