/**
 * Dev E-Commerce design tokens.
 * Every screen and component reads from here — change the brand in one place.
 */

export const colors = {
  // Brand
  ink: '#0E0E16',
  inkSoft: '#1C1C28',
  primary: '#5B4CF0',
  primarySoft: '#EEEBFF',
  accent: '#FF6B4A',

  // Surfaces
  background: '#F6F6F9',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F0F5',
  border: '#E6E6EE',
  borderStrong: '#D3D3DE',

  // Text
  text: '#0E0E16',
  textSecondary: '#5E6072',
  textMuted: '#9A9CAE',
  textInverse: '#FFFFFF',

  // Feedback
  success: '#12A150',
  successSoft: '#E5F6EC',
  danger: '#E5484D',
  dangerSoft: '#FDECEC',
  warning: '#B25E09',
  warningSoft: '#FFF3E0',
  info: '#1D63D8',
  infoSoft: '#E8F0FE',
  star: '#F5A524',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 17, lineHeight: 22, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 1.2 },
} as const;

// boxShadow works on iOS, Android (new architecture) and web
export const shadows = {
  sm: { boxShadow: '0px 1px 2px rgba(14, 14, 22, 0.06)' },
  md: { boxShadow: '0px 6px 20px rgba(14, 14, 22, 0.08)' },
  lg: { boxShadow: '0px 16px 40px rgba(14, 14, 22, 0.14)' },
} as const;

export const layout = {
  // Content never stretches wider than this on large web screens
  maxContentWidth: 1200,
  tabletBreakpoint: 768,
  desktopBreakpoint: 1024,
} as const;
