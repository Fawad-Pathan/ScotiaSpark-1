import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { colors, spacing, radii, typography } from '../../theme';
import type { Quote } from '../../lib/quotes';
import type { Account } from '../../store/DemoContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  quote: Quote | null;
  accounts: Account[];
  onConfirm: (dollarAmount: number, fromAccountId: string) => void;
}

const QUICK_AMOUNTS = [25, 50, 100, 250];

export function BuySheet({ visible, onClose, quote, accounts, onConfirm }: Props) {
  const [amount, setAmount] = useState('50');
  const [fromAccountId, setFromAccountId] = useState('cheq');

  const dollarAmount = parseFloat(amount) || 0;
  const shares = quote && quote.price > 0 ? Math.round((dollarAmount / quote.price) * 10000) / 10000 : 0;
  const isBelowMin = dollarAmount > 0 && dollarAmount < 1;
  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const insufficient = fromAccount ? dollarAmount > fromAccount.balance : false;

  const asOfTime = quote ? new Date(quote.asOf).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }) : '';

  if (!quote) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.kicker}>BUY · {quote.ticker}</Text>
      <Text style={styles.title}>How much?</Text>
      <Text style={styles.priceCallout}>
        Currently ${quote.price.toFixed(2)} · as of {asOfTime}
      </Text>

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.stepBtn} onPress={() => setAmount(String(Math.max(1, dollarAmount - 5)))}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            selectTextOnFocus
          />
        </View>
        <TouchableOpacity style={styles.stepBtn} onPress={() => setAmount(String(dollarAmount + 5))}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        {QUICK_AMOUNTS.map(q => (
          <TouchableOpacity key={q} style={[styles.quickPill, dollarAmount === q && styles.quickPillActive]} onPress={() => setAmount(String(q))}>
            <Text style={[styles.quickText, dollarAmount === q && styles.quickTextActive]}>${q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isBelowMin && <Text style={styles.warning}>Minimum buy is $1</Text>}
      {insufficient && <Text style={styles.warning}>Insufficient balance</Text>}

      <View style={styles.calcRow}>
        <Text style={styles.calcText}>You'll get: {shares.toFixed(4)} shares of {quote.ticker}</Text>
      </View>

      <TouchableOpacity style={styles.accountPicker}>
        <Text style={styles.accountLabel}>From: {fromAccount?.name ?? 'Chequing'} (${fromAccount?.balance.toFixed(2)})</Text>
      </TouchableOpacity>

      <Text style={styles.microcopy}>
        Worth researching, not a recommendation. Fractional shares supported. CDIC-eligible deposits, investments held by Scotia iTRADE.
      </Text>

      <Button
        title="Confirm buy"
        onPress={() => { if (!isBelowMin && !insufficient && dollarAmount >= 1) onConfirm(dollarAmount, fromAccountId); }}
        disabled={isBelowMin || insufficient || dollarAmount < 1}
        style={styles.confirmBtn}
      />
      <TouchableOpacity onPress={onClose} style={styles.cancelWrap}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  kicker: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, letterSpacing: 0.6, color: colors.slate, textTransform: 'uppercase', marginBottom: spacing.sm },
  title: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 22, color: colors.ink, marginBottom: spacing.sm },
  priceCallout: { fontFamily: 'RobotoMono_400Regular', fontSize: 13, color: colors.slate, marginBottom: spacing.xl },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  stepBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.warmTint, alignItems: 'center', justifyContent: 'center' },
  stepBtnText: { fontSize: 24, color: colors.ink, fontFamily: 'NunitoSans_400Regular' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.lg },
  dollarSign: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink },
  amountInput: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink, minWidth: 80, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, justifyContent: 'center' },
  quickPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  quickPillActive: { backgroundColor: colors.sageTint },
  quickText: { fontFamily: 'RobotoMono_500Medium', fontSize: 14, color: colors.ink },
  quickTextActive: { color: colors.sage },
  warning: { fontFamily: 'NunitoSans_400Regular', fontSize: 13, color: colors.terra, marginBottom: spacing.sm, textAlign: 'center' },
  calcRow: { backgroundColor: colors.warmTint, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.lg },
  calcText: { fontFamily: 'RobotoMono_400Regular', fontSize: 14, color: colors.ink },
  accountPicker: { paddingVertical: spacing.md, marginBottom: spacing.md },
  accountLabel: { fontFamily: 'RobotoMono_400Regular', fontSize: 13, color: colors.slate },
  microcopy: { fontFamily: 'NunitoSans_400Regular', fontSize: 11, color: colors.mute, lineHeight: 16, marginBottom: spacing.xl },
  confirmBtn: { marginBottom: spacing.md },
  cancelWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
});
