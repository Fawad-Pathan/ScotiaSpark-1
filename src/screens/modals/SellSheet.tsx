import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { colors, spacing, radii } from '../../theme';
import type { Holding } from '../../store/DemoContext';
import type { Quote } from '../../lib/quotes';

interface Props {
  visible: boolean;
  onClose: () => void;
  holding: Holding | null;
  quote: Quote | null;
  onConfirm: (sharesAmount: number) => void;
}

const QUICK_PERCENTS = [10, 25, 50, 100];

export function SellSheet({ visible, onClose, holding, quote, onConfirm }: Props) {
  const [mode, setMode] = useState<'dollars' | 'shares'>('dollars');
  const [amount, setAmount] = useState('');

  if (!holding || !quote) return null;

  const maxShares = holding.shares;
  const currentValue = maxShares * quote.price;

  const getSharesFromInput = () => {
    const val = parseFloat(amount) || 0;
    if (mode === 'shares') return Math.min(val, maxShares);
    return Math.min(val / quote.price, maxShares);
  };

  const sharesToSell = getSharesFromInput();
  const proceeds = Math.round(sharesToSell * quote.price * 100) / 100;
  const isTooHigh = sharesToSell > maxShares;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.kicker}>SELL · {holding.ticker}</Text>
      <Text style={styles.title}>How much to sell?</Text>
      <Text style={styles.subtitle}>You own {maxShares.toFixed(4)} shares · ${currentValue.toFixed(2)}</Text>

      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'dollars' && styles.modeBtnActive]}
          onPress={() => { setMode('dollars'); setAmount(''); }}
        >
          <Text style={[styles.modeBtnText, mode === 'dollars' && styles.modeBtnTextActive]}>By dollars</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'shares' && styles.modeBtnActive]}
          onPress={() => { setMode('shares'); setAmount(''); }}
        >
          <Text style={[styles.modeBtnText, mode === 'shares' && styles.modeBtnTextActive]}>By shares</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrap}>
        {mode === 'dollars' && <Text style={styles.prefix}>$</Text>}
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder={mode === 'dollars' ? '0.00' : '0.0000'}
          placeholderTextColor={colors.mute}
          selectTextOnFocus
        />
      </View>

      <View style={styles.quickRow}>
        {QUICK_PERCENTS.map(p => (
          <TouchableOpacity
            key={p}
            style={styles.quickPill}
            onPress={() => {
              const sh = Math.round(maxShares * (p / 100) * 10000) / 10000;
              if (mode === 'shares') setAmount(sh.toString());
              else setAmount((sh * quote.price).toFixed(2));
            }}
          >
            <Text style={styles.quickText}>{p === 100 ? 'All' : `${p}%`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.calcRow}>
        <Text style={styles.calcText}>You'll sell {sharesToSell.toFixed(4)} shares · ${proceeds.toFixed(2)} to chequing</Text>
      </View>

      <Button
        title="Confirm sell"
        onPress={() => { if (sharesToSell > 0 && !isTooHigh) onConfirm(sharesToSell); }}
        disabled={sharesToSell <= 0 || isTooHigh}
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
  modeToggle: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  modeBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  modeBtnActive: { backgroundColor: colors.terraTint },
  modeBtnText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
  modeBtnTextActive: { color: colors.terra },
  inputWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  prefix: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink },
  amountInput: { fontFamily: 'RobotoMono_500Medium', fontSize: 28, color: colors.ink, minWidth: 100, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl, justifyContent: 'center' },
  quickPill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.warmTint, minHeight: 44, justifyContent: 'center' },
  quickText: { fontFamily: 'RobotoMono_500Medium', fontSize: 14, color: colors.ink },
  calcRow: { backgroundColor: colors.warmTint, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.xl },
  calcText: { fontFamily: 'RobotoMono_400Regular', fontSize: 14, color: colors.ink },
  confirmBtn: { marginBottom: spacing.md },
  cancelWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
});
