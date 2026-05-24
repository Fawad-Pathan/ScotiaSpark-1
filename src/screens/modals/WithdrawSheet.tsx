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
  onConfirm: (amount: number, fromAccountId: string) => void;
}

export function WithdrawSheet({ visible, onClose, accounts, onConfirm }: Props) {
  const [amount, setAmount] = useState('');
  const [fromAccountId, setFromAccountId] = useState('fhsa');

  const dollarAmount = parseFloat(amount) || 0;
  const investableAccounts = accounts.filter(a => a.type !== 'Chequing' && a.type !== 'Savings');
  const fromAccount = accounts.find(a => a.id === fromAccountId);
  const insufficient = fromAccount ? dollarAmount > fromAccount.balance : false;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.kicker}>WITHDRAW</Text>
      <Text style={styles.title}>Withdraw funds</Text>
      <Text style={styles.subtitle}>{fromAccount?.name ?? 'Account'} → external bank</Text>

      <View style={styles.inputWrap}>
        <Text style={styles.prefix}>$</Text>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.mute}
          selectTextOnFocus
        />
      </View>

      {insufficient && <Text style={styles.warning}>Exceeds balance (${fromAccount?.balance.toFixed(2)})</Text>}

      <Text style={styles.accountLabel}>From account:</Text>
      <View style={styles.accountRow}>
        {investableAccounts.map(a => (
          <TouchableOpacity
            key={a.id}
            style={[styles.accountPill, fromAccountId === a.id && styles.accountPillActive]}
            onPress={() => setFromAccountId(a.id)}
          >
            <Text style={[styles.accountPillText, fromAccountId === a.id && styles.accountPillTextActive]}>
              {a.type} · ${a.balance.toFixed(0)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Confirm withdraw"
        onPress={() => { if (dollarAmount >= 1 && !insufficient) onConfirm(dollarAmount, fromAccountId); }}
        disabled={dollarAmount < 1 || insufficient}
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
  warning: { fontFamily: 'NunitoSans_400Regular', fontSize: 13, color: colors.terra, textAlign: 'center', marginBottom: spacing.md },
  accountLabel: { fontFamily: 'NunitoSans_500Medium', fontSize: 13, color: colors.slate, marginBottom: spacing.sm },
  accountRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, flexWrap: 'wrap' },
  accountPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  accountPillActive: { backgroundColor: colors.terraTint, borderWidth: 1, borderColor: colors.terra },
  accountPillText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.ink },
  accountPillTextActive: { color: colors.terra },
  confirmBtn: { marginBottom: spacing.md },
  cancelWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
});
