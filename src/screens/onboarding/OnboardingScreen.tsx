import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  ScrollView, Animated, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Rect, Line } from 'react-native-svg';
import { colors, spacing, typography, radii } from '../../theme';
import { Button, Card, ProgressBar } from '../../components';
import { useDemo } from '../../store/DemoContext';
import * as Haptics from 'expo-haptics';

const sparkLogoSource = require('../../../assets/logos/spark-logo.jpeg');

const { width } = Dimensions.get('window');

// Minimalist red SVG icons
function HomeIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10.5Z" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9 21V13H15V21" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function RetirementIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="12" cy="12" r="9" stroke={colors.scotia} strokeWidth={1.8} />
      <Path d="M12 7V12L15 15" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function EducationIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 10L12 5L22 10L12 15L2 10Z" stroke={colors.scotia} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M6 12V17C6 17 8 20 12 20C16 20 18 17 18 17V12" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FlexibilityIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2V8L15 5" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 8L9 5" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M5 12C5 16.4 8.6 20 13 20C15.2 20 17.2 19.1 18.6 17.6" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M19 12C19 7.6 15.4 4 11 4" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function ShieldIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" stroke={colors.scotia} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M9 12L11 14L15 10" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BalanceIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="3" x2="12" y2="21" stroke={colors.scotia} strokeWidth={1.8} />
      <Path d="M5 7L12 5L19 7" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M3 14L5 7L8 14" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 14L19 7L21 14" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function GrowthIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 20L9 14L13 18L21 8" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 8H21V13" stroke={colors.scotia} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const GOAL_ICONS: Record<string, React.ReactNode> = {
  'first-home': <HomeIcon />,
  'retirement': <RetirementIcon />,
  'education': <EducationIcon />,
  'flexibility': <FlexibilityIcon />,
};

const RISK_ICON_MAP: Record<string, React.ReactNode> = {
  'steady': <ShieldIcon />,
  'balanced': <BalanceIcon />,
  'growth': <GrowthIcon />,
};

const GOALS = [
  { key: 'first-home', title: 'First Home', desc: 'Save for a down payment' },
  { key: 'retirement', title: 'Retirement', desc: 'Build long-term wealth' },
  { key: 'education', title: 'Education', desc: 'Fund learning goals' },
  { key: 'flexibility', title: 'Flexibility', desc: 'Grow your money freely' },
];

const RISK_OPTIONS = [
  { key: 'steady', title: 'Steady', desc: 'I prefer stability over high returns' },
  { key: 'balanced', title: 'Balanced', desc: 'A mix of growth and stability' },
  { key: 'growth', title: 'Long-term growth', desc: 'I\'m comfortable with ups and downs' },
];

const TIME_LABELS = ['This year', '2–3 years', '5 years', '10 years', '20+ years'];

export function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [timeHorizon, setTimeHorizon] = useState(2);
  const [riskComfort, setRiskComfort] = useState<string | null>(null);
  const demo = useDemo();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (next: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setStep(next);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const nextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    animateTransition(step + 1);
  };

  const finishOnboarding = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    demo.completeOnboarding(selectedGoal || 'flexibility', timeHorizon, riskComfort || 'balanced');
  };

  const formatMoney = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderStep = () => {
    switch (step) {
      case 0: // Welcome
        return (
          <View style={styles.centerContent}>
            <Image source={sparkLogoSource} style={styles.welcomeLogo} />
            <Text style={styles.heroTitle}>Scotia Spark</Text>
            <Text style={styles.heroSubtitle}>
              Your money shouldn't sit still.{'\n'}Let's make it work for your future.
            </Text>
            <Button title="Get started" onPress={nextStep} style={styles.ctaButton} />
          </View>
        );
      case 1: // Sign in
        return (
          <View style={styles.centerContent}>
            <Image source={sparkLogoSource} style={styles.scotiaLogoImg} />
            <Text style={styles.stepTitle}>Sign in with Scotia</Text>
            <Text style={styles.stepBody}>
              Your identity is already verified through your Scotia banking account. No new paperwork needed.
            </Text>
            <Button title="Sign in with Scotiabank" onPress={nextStep} style={styles.ctaButton} />
            <Text style={styles.microcopy}>KYC already complete · CDIC protected</Text>
          </View>
        );
      case 2: // Goal selection
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What brings you here?</Text>
            <Text style={styles.stepBody}>Pick the goal that matters most right now. You can always change this later.</Text>
            <View style={styles.optionsGrid}>
              {GOALS.map(g => (
                <TouchableOpacity
                  key={g.key}
                  style={[styles.goalCard, selectedGoal === g.key && styles.goalCardSelected]}
                  onPress={() => { setSelectedGoal(g.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  <View style={styles.goalIconWrap}>{GOAL_ICONS[g.key]}</View>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  <Text style={styles.goalDesc}>{g.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Continue" onPress={nextStep} disabled={!selectedGoal} style={styles.ctaButton} />
          </View>
        );
      case 3: // Time horizon
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>When do you need this money?</Text>
            <Text style={styles.stepBody}>This helps us suggest investments that match your timeline.</Text>
            <View style={styles.timelineContainer}>
              {TIME_LABELS.map((label, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.timeOption, timeHorizon === i && styles.timeOptionSelected]}
                  onPress={() => { setTimeHorizon(i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                >
                  <Text style={[styles.timeText, timeHorizon === i && styles.timeTextSelected]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Continue" onPress={nextStep} style={styles.ctaButton} />
          </View>
        );
      case 4: // Risk comfort
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How do you feel about ups and downs?</Text>
            <Text style={styles.stepBody}>There's no wrong answer. This helps us find the right balance for you.</Text>
            {RISK_OPTIONS.map(r => (
              <TouchableOpacity
                key={r.key}
                style={[styles.riskCard, riskComfort === r.key && styles.riskCardSelected]}
                onPress={() => { setRiskComfort(r.key); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              >
                <View style={styles.riskIconWrap}>{RISK_ICON_MAP[r.key]}</View>
                <View style={styles.riskTextWrap}>
                  <Text style={styles.riskTitle}>{r.title}</Text>
                  <Text style={styles.riskDesc}>{r.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Button title="Continue" onPress={nextStep} disabled={!riskComfort} style={styles.ctaButton} />
          </View>
        );
      case 5: // Money picture (THE MAGIC MOMENT)
        return (
          <View style={styles.stepContent}>
            <View style={styles.magicCard}>
              <View style={styles.magicStrip} />
              <View style={styles.magicContent}>
                <Text style={styles.magicLabel}>YOUR MONEY PICTURE</Text>
                <Text style={styles.magicTitle}>
                  You've kept ${formatMoney(demo.idleCashAmount)} in chequing for {demo.idleCashDays} days.
                </Text>
                <Text style={styles.magicBody}>
                  In a Scotia FHSA Essentials Portfolio, that could grow to roughly $5,300 in 5 years.
                </Text>
                <View style={styles.projectionRow}>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>Today</Text>
                    <Text style={styles.projectionValue}>${formatMoney(demo.idleCashAmount)}</Text>
                  </View>
                  <Text style={styles.projectionArrow}>→</Text>
                  <View style={styles.projectionItem}>
                    <Text style={styles.projectionLabel}>In 5 years</Text>
                    <Text style={[styles.projectionValue, { color: colors.sage }]}>$5,300.00</Text>
                  </View>
                </View>
                <Text style={styles.projectionDisclaimer}>Projection based on historical average. Not guaranteed.</Text>
              </View>
            </View>
            <Button title="See what it could become" onPress={nextStep} style={styles.ctaButton} />
          </View>
        );
      case 6: // Starting plan
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Your starting plan</Text>
            <Text style={styles.stepBody}>Based on your answers, here's what we suggest.</Text>
            <Card style={styles.planCard}>
              <Text style={styles.planLabel}>RECOMMENDED ACCOUNT</Text>
              <Text style={styles.planValue}>FHSA — First Home Savings Account</Text>
              <View style={styles.planDivider} />
              <Text style={styles.planLabel}>PORTFOLIO</Text>
              <Text style={styles.planValue}>Scotia Essentials Balanced Portfolio</Text>
              <View style={styles.planDivider} />
              <Text style={styles.planLabel}>START WITH</Text>
              <View style={styles.planOptionsRow}>
                <TouchableOpacity style={[styles.planOption, styles.planOptionSelected]}>
                  <Text style={styles.planOptionText}>$25 one-time</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.planOption}>
                  <Text style={styles.planOptionTextInactive}>$50 biweekly</Text>
                </TouchableOpacity>
              </View>
            </Card>
            <Button title="Set up my plan" onPress={nextStep} style={styles.ctaButton} />
            <TouchableOpacity onPress={nextStep}>
              <Text style={styles.skipText}>I'll set this up later</Text>
            </TouchableOpacity>
          </View>
        );
      case 7: // Confirmation
        return (
          <View style={styles.centerContent}>
            <Image source={sparkLogoSource} style={styles.welcomeLogo} />
            <Text style={styles.heroTitle}>You're set up</Text>
            <Text style={styles.heroSubtitle}>
              Your first briefing arrives tomorrow.{'\n'}Welcome to investing with Scotia.
            </Text>
            <View style={styles.sceneReward}>
              <Text style={styles.sceneRewardText}>+250 Scene+ points earned</Text>
            </View>
            <Button title="Open Scotia Spark" onPress={finishOnboarding} style={styles.ctaButton} />
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {renderStep()}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  stepContent: {
    flex: 1,
    paddingTop: 60,
  },
  sparkIcon: {
    fontSize: 48,
    color: colors.scotiaRed,
    marginBottom: spacing.xxl,
  },
  welcomeLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: spacing.xxl,
  },
  heroTitle: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: spacing.huge,
  },
  ctaButton: {
    width: '100%',
    marginTop: spacing.xxl,
  },
  stepTitle: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  stepBody: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: spacing.xxxl,
    lineHeight: 26,
  },
  scotiaLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: colors.scotiaRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  scotiaLogoImg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: spacing.xxl,
  },
  scotiaLogoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  microcopy: {
    ...typography.metadata,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  goalCard: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
    backgroundColor: colors.cardSurface,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.card,
    padding: spacing.xl,
    alignItems: 'center',
  },
  goalCardSelected: {
    borderColor: colors.scotiaRed,
    borderWidth: 1.5,
    backgroundColor: colors.scotiaRedSoft,
  },
  goalIconWrap: {
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  goalTitle: {
    ...typography.h3,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  goalDesc: {
    ...typography.metadata,
    textAlign: 'center',
    fontSize: 12,
  },
  timelineContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  timeOption: {
    backgroundColor: colors.cardSurface,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.button,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  timeOptionSelected: {
    borderColor: colors.scotiaRed,
    borderWidth: 1.5,
    backgroundColor: colors.scotiaRedSoft,
  },
  timeText: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
  },
  timeTextSelected: {
    color: colors.scotiaRed,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSurface,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.card,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  riskCardSelected: {
    borderColor: colors.scotiaRed,
    borderWidth: 1.5,
    backgroundColor: colors.scotiaRedSoft,
  },
  riskIconWrap: {
    marginRight: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskTextWrap: {
    flex: 1,
  },
  riskTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 2,
  },
  riskDesc: {
    ...typography.smallBody,
  },
  // Magic moment
  magicCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardSurface,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  magicStrip: {
    width: 3,
    backgroundColor: colors.terracotta,
  },
  magicContent: {
    flex: 1,
    padding: spacing.xxl,
  },
  magicLabel: {
    ...typography.label,
    color: colors.terracotta,
    marginBottom: spacing.sm,
  },
  magicTitle: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  magicBody: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: spacing.xxl,
    lineHeight: 26,
  },
  projectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  projectionItem: {
    flex: 1,
  },
  projectionLabel: {
    ...typography.metadata,
    marginBottom: 4,
  },
  projectionValue: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 22,
    color: colors.primaryText,
  },
  projectionArrow: {
    fontSize: 20,
    color: colors.tertiaryText,
    marginHorizontal: spacing.md,
  },
  projectionDisclaimer: {
    ...typography.metadata,
    fontSize: 11,
    color: colors.tertiaryText,
  },
  // Plan
  planCard: {
    marginBottom: spacing.sm,
  },
  planLabel: {
    ...typography.label,
    marginBottom: 6,
  },
  planValue: {
    ...typography.bodyMedium,
    marginBottom: spacing.lg,
  },
  planDivider: {
    height: 0.5,
    backgroundColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  planOptionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  planOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.button,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  planOptionSelected: {
    borderColor: colors.scotiaRed,
    borderWidth: 1.5,
    backgroundColor: colors.scotiaRedSoft,
  },
  planOptionText: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.scotiaRed,
  },
  planOptionTextInactive: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.secondaryText,
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  // Confirmation
  confirmIcon: {
    fontSize: 48,
    color: colors.sage,
    marginBottom: spacing.xxl,
  },
  sceneReward: {
    backgroundColor: colors.softCard,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: spacing.xxxl,
  },
  sceneRewardText: {
    ...typography.metadata,
    color: colors.sage,
  },
});
