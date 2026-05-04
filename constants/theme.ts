export const COLORS = {
  // Greens
  green50: '#F0F7EE',
  green100: '#DCF0D9',
  green200: '#B8DEBA',
  green300: '#8DC98F',
  green400: '#5CAF60',
  green500: '#3D9142',
  green600: '#2C7030',

  // Beige / Warm neutrals
  beige50: '#FDFAF4',
  beige100: '#F7F1E3',
  beige200: '#EDE3CC',
  beige300: '#DCCFB0',

  // Browns (earth tones)
  brown300: '#C4A882',
  brown400: '#A8845A',
  brown500: '#7B5B38',

  // Sky blues
  sky100: '#E0EEF8',
  sky200: '#C4DFEF',
  sky300: '#A0C8E4',
  sky400: '#75AECE',

  // Accent
  yellow100: '#FFF3CC',
  yellow400: '#FFCC44',
  yellow500: '#F5A623',
  pink200: '#FFD6D6',
  pink400: '#F0828C',

  // Semantic
  success: '#5CAF60',
  warning: '#F5A623',
  error: '#E07070',

  // Text
  text: '#3A3830',
  textSecondary: '#7A7668',
  textLight: '#ABA9A0',
  textInverse: '#FFFFFF',

  // Surfaces
  white: '#FFFFFF',
  surface: '#FDFAF4',
  glass: 'rgba(255,255,255,0.68)',
  glassBorder: 'rgba(255,255,255,0.85)',
  overlay: 'rgba(58,56,48,0.35)',

  // Shadows
  shadow: 'rgba(90,75,50,0.14)',
  shadowDeep: 'rgba(90,75,50,0.22)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;

export const TYPOGRAPHY = {
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  subheading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.3 },
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadowDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

export const Colors = {
  light: {
    text: COLORS.text,
    background: COLORS.surface,
    tint: COLORS.green500,
    icon: COLORS.textSecondary,
    tabIconDefault: COLORS.textLight,
    tabIconSelected: COLORS.green500,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#5CAF60',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#5CAF60',
  },
};