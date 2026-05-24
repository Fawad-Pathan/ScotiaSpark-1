export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  card: 18,
  softCard: 14,
  button: 12,
  pill: 999,
  sheet: 28,
  bottomSheet: 28,
};

export const typography = {
  // Libre Baskerville (ITC Century substitute) — screen titles & editorial moments
  titleHero: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 28, lineHeight: 34, color: '#1B1B1B' },
  titleScreen: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 22, lineHeight: 28, color: '#1B1B1B' },
  titleCard: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 17, lineHeight: 22, color: '#1B1B1B' },
  h1: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 32, lineHeight: 40, color: '#1B1B1B' },
  h2: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 22, lineHeight: 30, color: '#1B1B1B' },
  callout: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 15, lineHeight: 22, color: '#1B1B1B' },

  // Nunito Sans (Frutiger substitute) — body, UI, labels
  h3: { fontFamily: 'NunitoSans_600SemiBold', fontSize: 18, lineHeight: 24, color: '#1B1B1B' },
  body: { fontFamily: 'NunitoSans_400Regular', fontSize: 15, lineHeight: 22, color: '#1B1B1B' },
  bodyMedium: { fontFamily: 'NunitoSans_500Medium', fontSize: 15, lineHeight: 22, color: '#1B1B1B' },
  bodyEmphasis: { fontFamily: 'NunitoSans_500Medium', fontSize: 15, lineHeight: 22, color: '#1B1B1B' },
  bodySlate: { fontFamily: 'NunitoSans_400Regular', fontSize: 13, lineHeight: 18, color: '#5C6A7D' },
  smallBody: { fontFamily: 'NunitoSans_400Regular', fontSize: 14, lineHeight: 20, color: '#5C6A7D' },
  micro: { fontFamily: 'NunitoSans_400Regular', fontSize: 11, lineHeight: 15, color: '#8B95A4' },
  metadata: { fontFamily: 'NunitoSans_500Medium', fontSize: 13, lineHeight: 18, color: '#5C6A7D' },
  kicker: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, lineHeight: 13, letterSpacing: 0.6, color: '#5C6A7D', textTransform: 'uppercase' as const },
  label: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase' as const, color: '#5C6A7D' },
  button: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, lineHeight: 18 },
  tabLabel: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, lineHeight: 13 },

  // Roboto Mono — every number
  monoHero: { fontFamily: 'RobotoMono_500Medium', fontSize: 32, lineHeight: 36, color: '#1B1B1B' },
  monoLarge: { fontFamily: 'RobotoMono_500Medium', fontSize: 22, lineHeight: 26, color: '#1B1B1B' },
  monoMedium: { fontFamily: 'RobotoMono_400Regular', fontSize: 15, lineHeight: 20, color: '#1B1B1B' },
  monoSmall: { fontFamily: 'RobotoMono_400Regular', fontSize: 12, lineHeight: 16, color: '#5C6A7D' },

  // Legacy aliases
  numberHero: { fontFamily: 'RobotoMono_500Medium', fontSize: 36, lineHeight: 44, color: '#1B1B1B' },
  numberBody: { fontFamily: 'RobotoMono_400Regular', fontSize: 16, lineHeight: 24, color: '#1B1B1B' },
  numberLarge: { fontFamily: 'RobotoMono_500Medium', fontSize: 34, lineHeight: 42, color: '#1B1B1B' },
};
