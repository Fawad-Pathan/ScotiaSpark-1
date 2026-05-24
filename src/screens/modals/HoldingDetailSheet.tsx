import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
  onBuy: () => void;
  onSell: () => void;
}

export function HoldingDetailSheet({ visible, onClose, holding, quote, onBuy, onSell }: Props) {
  if (!holding || !quote) return null;

  const currentValue = holding.shares * quote.price;
  const costBasis = holding.shares * holding.avgCostBasis;
  const unrealizedPnL = currentValue - costBasis;
  const unrealizedPercent = costBasis > 0 ? (unrealizedPnL / costBasis) * 100 : 0;
  const isUp = quote.change >= 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.ticker}>{quote.ticker}</Text>
      <Text style={styles.name}>{quote.name}</Text>
      <Text style={[styles.price, { color: isUp ? colors.sage : colors.terra }]}>
        ${quote.price.toFixed(2)} {isUp ? '▲' : '▼'} {Math.abs(quote.change).toFixed(2)} ({isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%)
      </Text>

      {/* AI Summary sections */}
      {quote.type === 'etf' && (quote as any).oneLiner && (
        <View style={styles.aiSection}>
          <Text style={styles.aiKicker}>AI SUMMARY</Text>
          <Text style={styles.aiBody}>{(quote as any).oneLiner}</Text>
          <View style={styles.aiMeta}>
            {(quote as any).risk && <Text style={styles.aiTag}>Risk: {(quote as any).risk}</Text>}
            {(quote as any).horizon && <Text style={styles.aiTag}>Horizon: {(quote as any).horizon}</Text>}
          </View>
        </View>
      )}

      {/* Your Position */}
      <View style={styles.positionCard}>
        <Text style={styles.sectionKicker}>YOUR POSITION</Text>
        <View style={styles.posRow}>
          <Text style={styles.posLabel}>Shares</Text>
          <Text style={styles.posValue}>{holding.shares.toFixed(4)}</Text>
        </View>
        <View style={styles.posRow}>
          <Text style={styles.posLabel}>Market value</Text>
          <Text style={styles.posValue}>${currentValue.toFixed(2)}</Text>
        </View>
        <View style={styles.posRow}>
          <Text style={styles.posLabel}>Avg cost</Text>
          <Text style={styles.posValue}>${holding.avgCostBasis.toFixed(2)}</Text>
        </View>
        <View style={styles.posRow}>
          <Text style={styles.posLabel}>Unrealized P&L</Text>
          <Text style={[styles.posValue, { color: unrealizedPnL >= 0 ? colors.sage : colors.terra }]}>
            {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)} ({unrealizedPercent >= 0 ? '+' : ''}{unrealizedPercent.toFixed(1)}%)
          </Text>
        </View>
        <View style={styles.posRow}>
          <Text style={styles.posLabel}>Held since</Text>
          <Text style={styles.posValue}>{holding.heldSince}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Button title="Buy more" onPress={onBuy} style={styles.actionBtn} />
        <TouchableOpacity style={styles.sellBtn} onPress={onSell}>
          <Text style={styles.sellBtnText}>Sell</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.cancelWrap}>
        <Text style={styles.cancelText}>Close</Text>
      </TouchableOpacity>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  ticker: { fontFamily: 'RobotoMono_500Medium', fontSize: 22, color: colors.ink, marginBottom: 2 },
  name: { fontFamily: 'LibreBaskerville_400Regular', fontSize: 16, color: colors.ink, marginBottom: spacing.sm },
  price: { fontFamily: 'RobotoMono_400Regular', fontSize: 15, marginBottom: spacing.xl },
  aiSection: { backgroundColor: colors.warmTint, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.lg },
  aiKicker: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, letterSpacing: 0.6, color: colors.slate, marginBottom: spacing.sm },
  aiBody: { fontFamily: 'NunitoSans_400Regular', fontSize: 14, color: colors.ink, lineHeight: 20, marginBottom: spacing.sm },
  aiMeta: { flexDirection: 'row', gap: spacing.md },
  aiTag: { fontFamily: 'RobotoMono_400Regular', fontSize: 12, color: colors.slate },
  positionCard: { backgroundColor: colors.card, borderRadius: radii.card, borderWidth: 0.5, borderColor: colors.border, padding: spacing.xl, marginBottom: spacing.xl },
  sectionKicker: { fontFamily: 'NunitoSans_500Medium', fontSize: 10, letterSpacing: 0.6, color: colors.slate, marginBottom: spacing.md },
  posRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border },
  posLabel: { fontFamily: 'NunitoSans_400Regular', fontSize: 14, color: colors.slate },
  posValue: { fontFamily: 'RobotoMono_500Medium', fontSize: 14, color: colors.ink },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  actionBtn: { flex: 1 },
  sellBtn: { flex: 1, borderWidth: 1, borderColor: colors.terra, borderRadius: radii.button, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  sellBtnText: { fontFamily: 'NunitoSans_500Medium', fontSize: 16, color: colors.terra },
  cancelWrap: { alignItems: 'center', paddingVertical: spacing.sm },
  cancelText: { fontFamily: 'NunitoSans_500Medium', fontSize: 14, color: colors.slate },
});
