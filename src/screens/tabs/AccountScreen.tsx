import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '../../theme';
import { Card, Button, ProgressBar, MiniChart, TypePill } from '../../components';
import { Toast } from '../../components/Toast';
import { BottomSheet } from '../../components/BottomSheet';
import { DepositSheet } from '../modals/DepositSheet';
import { WithdrawSheet } from '../modals/WithdrawSheet';
import { useDemo } from '../../store/DemoContext';
import * as Haptics from 'expo-haptics';

export function AccountScreen() {
  const demo = useDemo();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const formatMoney = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleMoveIdleCash = () => {
    setShowConfirm(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const toasts = demo.moveIdleCash();
    if (toasts.length > 0) {
      setToastMsg(toasts[toasts.length - 1].message);
    } else {
      setToastMsg('Idle cash moved to FHSA');
    }
    setShowToast(true);
  };

  const investableAccounts = demo.accounts.filter(a => a.type !== 'Chequing' && a.type !== 'Savings');

  return (
    <SafeAreaView style={styles.container}>
      <Toast message={toastMsg} visible={showToast} onHide={() => setShowToast(false)} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Block */}
        <View style={styles.heroBlock}>
          <Text style={styles.heroLabel}>TOTAL INVESTABLE</Text>
          <Text style={styles.heroBalance}>${formatMoney(demo.totalInvestable)}</Text>
          <Text style={styles.heroSub}>across {investableAccounts.length} Scotia accounts</Text>
          <View style={styles.cdicPill}>
            <Text style={styles.cdicText}>CDIC Protected</Text>
          </View>
        </View>

        {/* Deposit / Withdraw row */}
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroActionBtn} onPress={() => setShowDeposit(true)}>
            <Text style={styles.heroActionText}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.heroActionBtn, styles.heroActionOutline]} onPress={() => setShowWithdraw(true)}>
            <Text style={[styles.heroActionText, { color: colors.ink }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Idle Cash Strip */}
        {!demo.hasDismissedIdleCash && demo.idleCashAmount > 0 && (
          <Card variant="hero" heroColor={colors.terra} style={styles.card}>
            <View style={styles.idleRow}>
              <View style={styles.idleInfo}>
                <Text style={styles.idleLabel}>IDLE CASH</Text>
                <Text style={styles.idleAmount}>${formatMoney(demo.idleCashAmount)} sitting in chequing</Text>
                <Text style={styles.idleDays}>{demo.idleCashDays} days idle</Text>
              </View>
              <TouchableOpacity onPress={() => setShowConfirm(true)}>
                <Text style={styles.idleAction}>Move it forward →</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Accounts */}
        <Text style={styles.sectionTitle}>Your accounts</Text>
        {investableAccounts.map((acct, i) => (
          <Card key={acct.id} style={styles.card}>
            <View style={styles.accountHeader}>
              <TypePill
                type={acct.type}
                color={acct.type === 'FHSA' ? colors.sage : colors.infoTeal}
                bgColor={acct.type === 'FHSA' ? colors.sageTint : colors.infoTealTint}
              />
            </View>
            <Text style={styles.accountName}>{acct.name}</Text>
            <Text style={styles.accountBalance}>${formatMoney(acct.balance)}</Text>
            {acct.goal && (
              <>
                <ProgressBar
                  progress={acct.balance / acct.goal}
                  color={acct.type === 'FHSA' ? colors.sage : colors.infoTeal}
                />
                <Text style={styles.goalText}>
                  {Math.round((acct.balance / acct.goal) * 100)}% of ${formatMoney(acct.goal)} goal
                </Text>
              </>
            )}
            <View style={styles.allocationRow}>
              {acct.allocation.map((a, j) => (
                <View key={j} style={styles.allocationDot}>
                  <View style={[styles.dot, { backgroundColor: j === 0 ? colors.sage : colors.softAmber }]} />
                  <Text style={styles.allocationText}>{a}</Text>
                </View>
              ))}
            </View>
          </Card>
        ))}

        {/* Compounding Time Machine */}
        <Card style={[styles.card, { backgroundColor: colors.sageTint }]}>
          <Text style={styles.timeMachineTitle}>Compounding Time Machine</Text>
          <Text style={styles.timeMachineBody}>What could your investments become in 5, 10, 20 years?</Text>
          <MiniChart color={colors.sage} data={[10, 12, 15, 19, 24, 30, 38, 47, 58, 72, 88, 107]} width={280} height={50} />
          <TouchableOpacity style={styles.timeMachineLink}>
            <Text style={styles.timeMachineLinkText}>Explore projections →</Text>
          </TouchableOpacity>
        </Card>

        {/* Recurring Contributions */}
        <Text style={styles.sectionTitle}>Recurring contributions</Text>
        {demo.recurringEnabled ? (
          <Card style={styles.card}>
            <Text style={styles.recurringText}>
              ${demo.recurringAmount} {demo.recurringFrequency} → FHSA
            </Text>
            <Text style={styles.recurringMeta}>Next contribution in 12 days</Text>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.recurringText}>No recurring contributions set up yet.</Text>
            <Button
              title="Set up recurring"
              variant="secondary"
              onPress={() => {
                const toasts = demo.setupRecurring(50, 'Biweekly');
                if (toasts.length > 0) {
                  setToastMsg(toasts[toasts.length - 1].message);
                } else {
                  setToastMsg('Recurring contributions set up');
                }
                setShowToast(true);
              }}
              style={{ marginTop: spacing.md }}
            />
          </Card>
        )}

        {/* Paycheque Investing */}
        <Card variant="hero" heroColor={colors.sage} style={styles.card}>
          <Text style={styles.paychequelabel}>PAYCHEQUE INVESTING</Text>
          <Text style={styles.paychequeTitle}>Your paycheque landed 2 days ago.</Text>
          <Text style={styles.paychequeBody}>Send $50 to your FHSA?</Text>
          <View style={styles.paychequeActions}>
            <Button title="Send $50" onPress={() => {
              demo.deposit(50, 'fhsa');
              setToastMsg('$50 sent to FHSA');
              setShowToast(true);
            }} style={{ flex: 1, marginRight: spacing.sm }} />
            <Button title="Not now" variant="tertiary" onPress={() => {}} style={{ flex: 1 }} />
          </View>
        </Card>

        {/* Advisor */}
        <TouchableOpacity style={styles.advisorBar}>
          <Text style={styles.advisorText}>Talk to a Scotia advisor · 15 min · video or branch</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Move Idle Cash — Bottom Sheet */}
      <BottomSheet visible={showConfirm} onClose={() => setShowConfirm(false)}>
        <Text style={styles.confirmTitle}>Move ${formatMoney(demo.idleCashAmount)} forward?</Text>
        <Text style={styles.confirmBody}>
          This will move your idle cash from chequing into your FHSA Essentials Portfolio.
        </Text>
        <Button title={`Move $${formatMoney(demo.idleCashAmount)} to FHSA`} onPress={handleMoveIdleCash} style={{ marginBottom: spacing.md }} />
        <Button title="Not yet" variant="tertiary" onPress={() => setShowConfirm(false)} />
      </BottomSheet>

      {/* Deposit Sheet */}
      <DepositSheet
        visible={showDeposit}
        onClose={() => setShowDeposit(false)}
        accounts={demo.accounts}
        onConfirm={(amount, toId) => {
          const toast = demo.deposit(amount, toId);
          setShowDeposit(false);
          setToastMsg(toast.message);
          setShowToast(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />

      {/* Withdraw Sheet */}
      <WithdrawSheet
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        accounts={demo.accounts}
        onConfirm={(amount, fromId) => {
          const toast = demo.withdraw(amount, fromId);
          setShowWithdraw(false);
          setToastMsg(toast.message);
          setShowToast(true);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  // Hero
  heroBlock: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  heroLabel: {
    ...typography.kicker,
    marginBottom: spacing.sm,
  },
  heroBalance: {
    ...typography.monoHero,
    marginBottom: 4,
  },
  heroSub: {
    ...typography.micro,
    marginBottom: spacing.md,
  },
  cdicPill: {
    backgroundColor: colors.scotiaRedSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  cdicText: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 11,
    color: colors.scotia,
  },
  heroActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  heroActionBtn: {
    flex: 1,
    backgroundColor: colors.sage,
    borderRadius: radii.button,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  heroActionOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.ink,
  },
  heroActionText: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 16,
    color: colors.white,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleScreen,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  // Idle cash
  idleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idleInfo: {
    flex: 1,
  },
  idleLabel: {
    ...typography.kicker,
    color: colors.terra,
    marginBottom: 4,
  },
  idleAmount: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 15,
    color: colors.ink,
  },
  idleDays: {
    ...typography.micro,
  },
  idleAction: {
    fontFamily: 'NunitoSans_500Medium',
    color: colors.scotia,
    fontSize: 14,
  },
  // Account card
  accountHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  accountName: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 15,
    color: colors.ink,
    marginBottom: 4,
  },
  accountBalance: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 24,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  goalText: {
    ...typography.micro,
    marginTop: spacing.sm,
  },
  allocationRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  allocationDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  allocationText: {
    ...typography.micro,
  },
  // Time Machine
  timeMachineTitle: {
    ...typography.titleCard,
    marginBottom: 4,
  },
  timeMachineBody: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 14,
    color: colors.slate,
    marginBottom: spacing.md,
  },
  timeMachineLink: {
    marginTop: spacing.md,
  },
  timeMachineLinkText: {
    fontFamily: 'NunitoSans_500Medium',
    color: colors.sage,
    fontSize: 14,
  },
  // Recurring
  recurringText: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 15,
    color: colors.ink,
  },
  recurringMeta: {
    ...typography.micro,
    marginTop: 4,
  },
  // Paycheque
  paychequelabel: {
    ...typography.kicker,
    color: colors.sage,
    marginBottom: spacing.sm,
  },
  paychequeTitle: {
    ...typography.titleCard,
    marginBottom: 4,
  },
  paychequeBody: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 15,
    color: colors.slate,
    marginBottom: spacing.lg,
  },
  paychequeActions: {
    flexDirection: 'row',
  },
  // Advisor
  advisorBar: {
    backgroundColor: colors.warmTint,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  advisorText: {
    ...typography.micro,
    color: colors.ink,
  },
  // Confirm bottom sheet content
  confirmTitle: {
    ...typography.titleCard,
    marginBottom: spacing.md,
  },
  confirmBody: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 15,
    color: colors.slate,
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
});
