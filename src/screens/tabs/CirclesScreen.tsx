import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '../../theme';
import { Card, Button, ProgressBar } from '../../components';
import { useDemo } from '../../store/DemoContext';

const ENCOURAGEMENTS = [
  'Way to hit your monthly contribution',
  'Proud of you',
  'Steady wins',
  'One step closer',
];

const CIRCLE_MEMBERS = [
  { name: 'Aria M.', avatar: 'A' },
  { name: 'Priya K.', avatar: 'P' },
  { name: 'Jordan L.', avatar: 'J' },
  { name: 'Sam T.', avatar: 'S' },
];

export function CirclesScreen() {
  const demo = useDemo();
  const formatMoney = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Circles</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Privacy Badge */}
        <View style={styles.privacyBadge}>
          <Text style={styles.privacyText}>🔒 Goal progress only · Holdings stay private</Text>
        </View>

        {/* Active Circle */}
        <Card style={styles.card}>
          <Text style={styles.circleType}>SHARED GOAL</Text>
          <Text style={styles.circleName}>{demo.circleGoal}</Text>
          <Text style={styles.circleProgress}>
            ${formatMoney(demo.circleProgress)} toward ${formatMoney(demo.circleGoalTarget)}
          </Text>
          <ProgressBar
            progress={demo.circleProgress / demo.circleGoalTarget}
            color={colors.sage}
          />
          <Text style={styles.circlePercent}>
            {Math.round((demo.circleProgress / demo.circleGoalTarget) * 100)}% of goal
          </Text>

          {/* Members */}
          <View style={styles.membersRow}>
            {CIRCLE_MEMBERS.map((m, i) => (
              <View key={i} style={styles.memberAvatar}>
                <Text style={styles.memberAvatarText}>{m.avatar}</Text>
              </View>
            ))}
            <Text style={styles.membersCount}>{CIRCLE_MEMBERS.length} members</Text>
          </View>

          {/* Encouragement Chips */}
          <View style={styles.chipsRow}>
            {ENCOURAGEMENTS.slice(0, 3).map((chip, i) => (
              <TouchableOpacity key={i} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Circle Types */}
        <Text style={styles.sectionTitle}>Start a new circle</Text>

        <Card variant="soft" style={styles.card}>
          <Text style={styles.circleOptionIcon}>🏠</Text>
          <Text style={styles.circleOptionTitle}>First Home Fund</Text>
          <Text style={styles.circleOptionDesc}>Save toward a down payment together with friends.</Text>
        </Card>

        <Card variant="soft" style={styles.card}>
          <Text style={styles.circleOptionIcon}>🎯</Text>
          <Text style={styles.circleOptionTitle}>First $10K Invested</Text>
          <Text style={styles.circleOptionDesc}>Hit your first investing milestone as a group.</Text>
        </Card>

        <Card variant="soft" style={styles.card}>
          <Text style={styles.circleOptionIcon}>📚</Text>
          <Text style={styles.circleOptionTitle}>Learning Group</Text>
          <Text style={styles.circleOptionDesc}>Work through Scotia Basics together.</Text>
        </Card>

        <Card variant="soft" style={styles.card}>
          <Text style={styles.circleOptionIcon}>👨‍👩‍👧</Text>
          <Text style={styles.circleOptionTitle}>Family Goal</Text>
          <Text style={styles.circleOptionDesc}>Parents & grandparents contribute to your FHSA or RESP.</Text>
        </Card>

        {/* Invite */}
        <Card style={styles.card}>
          <Text style={styles.inviteTitle}>Invite by code</Text>
          <Text style={styles.inviteDesc}>
            Circles are invite-only. Share your code with people you trust.
          </Text>
          <View style={styles.inviteCodeBox}>
            <Text style={styles.inviteCode}>SPARK-ARIA-2026</Text>
          </View>
          <Button title="Copy invite code" variant="secondary" onPress={() => {}} style={{ marginTop: spacing.md }} />
        </Card>

        {/* Advisor Bridge */}
        <Text style={styles.sectionTitle}>Need human help?</Text>
        <Card style={styles.card}>
          <Text style={styles.advisorTitle}>Advisor Bridge</Text>
          <Text style={styles.advisorDesc}>
            Book a 15-minute video call or in-branch consultation with a Scotia advisor.
          </Text>
          <Button title="Book a consultation" onPress={() => {}} style={{ marginTop: spacing.md }} />
          <Text style={styles.advisorMeta}>+500 Scene+ when you book and attend</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.h1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  // Privacy
  privacyBadge: {
    backgroundColor: colors.scotiaRedSoft,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  privacyText: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 12,
    color: colors.scotiaRed,
  },
  // Circle card
  circleType: {
    ...typography.label,
    color: colors.sage,
    marginBottom: spacing.sm,
  },
  circleName: {
    ...typography.h2,
    marginBottom: 4,
  },
  circleProgress: {
    ...typography.metadata,
    marginBottom: spacing.md,
  },
  circlePercent: {
    ...typography.metadata,
    marginTop: spacing.sm,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryText,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
    borderWidth: 2,
    borderColor: colors.cardSurface,
  },
  memberAvatarText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: 'NunitoSans_500Medium',
  },
  membersCount: {
    ...typography.metadata,
    marginLeft: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.softCard,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipText: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 13,
    color: colors.secondaryText,
  },
  // Circle options
  circleOptionIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  circleOptionTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 4,
  },
  circleOptionDesc: {
    ...typography.smallBody,
  },
  // Invite
  inviteTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 4,
  },
  inviteDesc: {
    ...typography.smallBody,
    marginBottom: spacing.md,
  },
  inviteCodeBox: {
    backgroundColor: colors.softCard,
    borderRadius: radii.button,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  inviteCode: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 16,
    color: colors.primaryText,
    letterSpacing: 1,
  },
  // Advisor
  advisorTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: 4,
  },
  advisorDesc: {
    ...typography.smallBody,
  },
  advisorMeta: {
    ...typography.metadata,
    fontSize: 12,
    color: colors.sage,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
