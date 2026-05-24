import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { colors, spacing, radii } from '../../theme';
import type { Account } from '../../store/DemoContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  accounts: Account[];
  onConfirm: (amount: number, toAccountId: string) => void;
}

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export function DepositSheet({ visible, onClose, accounts, onConfirm }: Props) {
  const [amount, setAmount] = useState('250');
  const [toAccountId, setToAccountId] = useState('fhsa');

  const dollarAmount = parseFloat(amount) || 0;
  const investableAccounts = accounts.filter(a => a.type !== 'Chequing' && a.type !== 'Savings');
  const toAccount = accounts.find(a => a.id === toAccountId);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.kicker}>DEPOSIT</Text>
      <Text style={styles.title}>Add funds</Text>
      <Text style={styles.subtitle}>From external bank → {toAccount?.name ?? 'account'}</Text>

      <View style={styles.inputWrap}>
        <Text style={styles.prefix}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          selectTextOnFocus
        />
      </View>

      <View style={styles.quickRow}>
        {QUICK_AMOUNTS.map(q => (
          <TouchableOpacity key={q} style={[styles.quickPill, dollarAmount === q && styles.quickPillActive]} onPress={() => setAmount(String(q))}>
            <Text style={[styles.quickText, dollarAmount === q && styles.quickTextActive]}>${q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.accountLabel}>To account:</Text>
      <View style={styles.accountRow}>
        {investableAccounts.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.accountPill, toAccountId === a.id && styles.accountPillActive]}
            onPress={() => setToAccountId(a.id)}
          >
            <Text style={[styles.accountPillText, toAccountId === a.id && styles.accountPillTextActive]}>{a.type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Confirm deposit"
        onPress={() => { if (dollarAmount >= 1) onConfirm(dollarAmount, toAccountId); }}
        disabled={dollarAmount < 1}
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
  title: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 22, color: colors.ink, marginBottom: 4 },
  subtitle: { fontFamily: 'RobotoMono_400Regular', fontSize: 13, color: colors.slate, marginBottom: spacing.xl },
  inputWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  prefix: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink },
  amountInput: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink, minWidth: 100, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, justifyContent: 'center' },
  quickPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  quickPillActive: { backgroundColor: colors.sageTint },
  quickText: { fontFamily: 'RobotoMono_500Medium', fontSize: 14, color: colors.ink },
  quickTextActive: { color: colors.sage },
  accountLabel: { fontFamily: 'NunitoSans_500Medium', fontSize: 13, color: colors.slate, marginBottom: spacing.sm },
  accountRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  accountPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  accountPillActive: { backgroundColor: colors.sageTint, borderWidth: 1, borderColor: colors.sage },
  accountPillText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.ink },
  accountPillTextActive: { color: colors.sage },
  confirmBtn: { marginBottom: spacing.md },
  cancelWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
});
