import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../theme';
import type { Holding } from '../store/DemoContext';
import type { Quote } from '../lib/quotes';

interface Props {
  holdings: Holding[];
  quotes: Record<string, Quote>;
  onHoldingPress: (ticker: string) => void;
  onGoToSpark: () => void;
}

export function InvestmentPortfolio({ holdings, quotes, onHoldingPress, onGoToSpark }: Props) {
  if (holdings.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.kicker}>YOUR PORTFOLIO</Text>
        <Text style={styles.emptyTitle}>Your portfolio starts here.</Text>
        <Text style={styles.emptyBody}>Tap any ETF on Spark to buy your first.</Text>
        <TouchableOpacity style={styles.goBtn} onPress={onGoToSpark}>
          <Text style={styles.goBtnText}>Go to Spark →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getHoldingValue = (h: Holding) => {
    const q = quotes[h.ticker];
    return q ? h.shares * q.price : h.shares * h.avgCostBasis;
  };

  const getHoldingChange = (h: Holding) => {
    const q = quotes[h.ticker];
    if (!q) return { change: 0, percent: 0 };
    return { change: h.shares * q.change, percent: q.changePercent };
  };

  const totalValue = holdings.reduce((sum, h) => sum + getHoldingValue(h), 0);
  const totalChange = holdings.reduce((sum, h) => sum + getHoldingChange(h).change, 0);
  const totalPercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
  const isUp = totalChange >= 0;

  const groups: { label: string; type: string; items: Holding[] }[] = [
    { label: 'ETFs', type: 'etf', items: holdings.filter(h => h.type === 'etf') },
    { label: 'Stocks', type: 'stock', items: holdings.filter(h => h.type === 'stock') },
    { label: 'Bonds', type: 'bond', items: holdings.filter(h => h.type === 'bond') },
  ].filter(g => g.items.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>YOUR PORTFOLIO</Text>
      <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
      <Text style={[styles.changeRow, { color: isUp ? colors.sage : colors.terra }]}>
        {isUp ? '▲' : '▼'} ${Math.abs(totalChange).toFixed(2)} today · {isUp ? '+' : ''}{totalPercent.toFixed(2)}%
      </Text>

      {groups.map(group => {
        const groupTotal = group.items.reduce((s, h) => s + getHoldingValue(h), 0);
        return (
          <View key={group.type} style={styles.groupCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupTitle}>{group.label}</Text>
              <Text style={styles.groupCount}>{group.items.length}</Text>
            </View>
            <Text style={styles.groupTotal}>${groupTotal.toFixed(2)}</Text>
            <View style={styles.groupDivider} />
            {group.items.map((h, i) => {
              const val = getHoldingValue(h);
              const chg = getHoldingChange(h);
              const up = chg.change >= 0;
              return (
                <TouchableOpacity
                  key={h.ticker}
                  style={[styles.holdingRow, i < group.items.length - 1 && styles.holdingRowBorder]}
                  onPress={() => onHoldingPress(h.ticker)}
                  activeOpacity={0.7}
                >
                  <View style={styles.holdingLeft}>
                    <View style={styles.tickerPill}>
                      <Text style={styles.tickerText}>{h.ticker}</Text>
                    </View>
                    <Text style={styles.holdingName} numberOfLines={1}>{h.name}</Text>
                  </View>
                  <Text style={styles.holdingDetail}>
                    {h.type === 'bond'
                      ? `$${val.toFixed(2)} par`
                      : `${h.shares.toFixed(4)} shares · $${val.toFixed(2)}`}
                    {' · '}
                    <Text style={{ color: up ? colors.sage : colors.terra }}>
                      {up ? '▲' : '▼'} ${Math.abs(chg.change).toFixed(2)} ({up ? '+' : ''}{chg.percent.toFixed(2)}%)
                    </Text>
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  kicker: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mute,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  totalValue: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 28,
    color: colors.ink,
  },
  changeRow: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 13,
    marginBottom: spacing.lg,
  },
  groupCard: {
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.md,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTitle: {
    fontFamily: 'LibreBaskerville_400Regular',
    fontSize: 16,
    color: colors.ink,
  },
  groupCount: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 13,
    color: colors.slate,
  },
  groupTotal: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 16,
    color: colors.ink,
    marginTop: 4,
  },
  groupDivider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  holdingRow: {
    paddingVertical: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  holdingRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tickerPill: {
    backgroundColor: colors.warmTint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
    marginRight: 8,
  },
  tickerText: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 12,
    color: colors.ink,
  },
  holdingName: {
    fontFamily: 'LibreBaskerville_400Regular',
    fontSize: 14,
    color: colors.ink,
    flex: 1,
  },
  holdingDetail: {
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 12,
    color: colors.slate,
  },
  emptyTitle: {
    fontFamily: 'LibreBaskerville_400Regular',
    fontSize: 16,
    color: colors.ink,
    marginBottom: 4,
  },
  emptyBody: {
    fontFamily: 'NunitoSans_400Regular',
    fontSize: 13,
    color: colors.slate,
    marginBottom: spacing.lg,
  },
  goBtn: {
    borderWidth: 0.5,
    borderColor: colors.ink,
    borderRadius: radii.button,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  goBtnText: {
    fontFamily: 'NunitoSans_500Medium',
    fontSize: 14,
    color: colors.ink,
  },
});
