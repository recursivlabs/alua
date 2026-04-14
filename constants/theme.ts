// Alua placeholder branding — ocean blues, earth tones, sand
// Swap these when real branding assets land

export const Brand = {
  primary: '#1a3a4a',      // deep ocean
  primaryLight: '#2d6a7a',  // lighter ocean
  primaryDark: '#0f2530',   // dark ocean
  accent: '#c4956a',        // warm sand
  accentLight: '#d4b08a',   // light sand
  sand: '#f5f0eb',          // warm off-white
  seafoam: '#7fb5b0',       // seafoam green
  coral: '#d4806a',         // warm coral
  success: '#4a9a6a',
  warning: '#c49a4a',
  danger: '#c45a4a',
  info: '#4a7ac4',
};

export const Colors = {
  light: {
    text: '#1a1a1a',
    textSecondary: '#5a5a5a',
    textMuted: '#8a8a8a',
    background: '#faf8f5',
    surface: '#ffffff',
    surfaceRaised: '#f5f0eb',
    border: '#e8e0d8',
    borderSubtle: '#f0e8e0',
    tint: Brand.primary,
    icon: '#5a5a5a',
    tabIconDefault: '#8a8a8a',
    tabIconSelected: Brand.primary,
  },
  dark: {
    text: '#f0ece8',
    textSecondary: '#b0a8a0',
    textMuted: '#787068',
    background: '#0f1a20',
    surface: '#1a2830',
    surfaceRaised: '#243840',
    border: '#2a3a42',
    borderSubtle: '#1f2f38',
    tint: Brand.seafoam,
    icon: '#b0a8a0',
    tabIconDefault: '#687068',
    tabIconSelected: Brand.seafoam,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  hero: { fontSize: 36, fontWeight: '700' as const, letterSpacing: -0.8 },
  h1: { fontSize: 28, fontWeight: '600' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  small: { fontSize: 12, fontWeight: '400' as const },
};
