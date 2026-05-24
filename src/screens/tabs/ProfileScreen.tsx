import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { colors, spacing, typography, radii } from '../../theme';
import { Card, Button } from '../../components';
import { Logo } from '../../components/Logo';
import { InvestmentPortfolio } from '../../components/InvestmentPortfolio';
import { HoldingDetailSheet } from '../modals/HoldingDetailSheet';
import { BuySheet } from '../modals/BuySheet';
import { SellSheet } from '../modals/SellSheet';
import { Toast } from '../../components/Toast';
import { useDemo } from '../../store/DemoContext';
import { getQuotesSync } from '../../lib/quotes';
import type { Quote } from '../../lib/quotes';
import * as Haptics from 'expo-haptics';

export function ProfileScreen({ navigation }: any) {
  const demo = useDemo();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);

  const formatMoney = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const holdingTickers = demo.holdings.map(h => h.ticker);
  const quotes = useMemo(() => {
    const q: Record<string, Quote> = {};
    if (holdingTickers.length > 0) {
      getQuotesSync(holdingTickers).forEach(quote => { q[quote.ticker] = quote; });
    }
    return q;
  }, [holdingTickers.join(',')]);

  const selectedHolding = selectedTicker ? demo.holdings.find(h => h.ticker === selectedTicker) ?? null : null;
  const selectedQuote = selectedTicker ? quotes[selectedTicker] ?? null : null;

  const sceneValueCAD = (demo.scenePoints * 0.01).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <Toast message={toastMsg} visible={showToast} onHide={() => setShowToast(false)} />

      <View style={styles.headerRow}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={colors.scotia} strokeWidth={1.8} />
            <Path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1656 17.2551 20.3766 17.7642 20.3766 18.295C20.3766 18.8258 20.1656 19.3349 19.79 19.71C19.4149 20.0856 18.9058 20.2966 18.375 20.2966C17.8442 20.2966 17.3351 20.0856 16.96 19.71L16.9 19.65C16.4178 19.1783 15.6971 19.0477 15.08 19.32C14.4755 19.5791 14.0826 20.1724 14.08 20.83V21C14.08 22.1046 13.1846 23 12.08 23C10.9754 23 10.08 22.1046 10.08 21V20.91C10.0642 20.2327 9.63587 19.6339 9 19.4C8.38291 19.1277 7.66219 19.2583 7.18 19.73L7.12 19.79C6.74494 20.1656 6.23584 20.3766 5.705 20.3766C5.17416 20.3766 4.66506 20.1656 4.29 19.79C3.91445 19.4149 3.70343 18.9058 3.70343 18.375C3.70343 17.8442 3.91445 17.3351 4.29 16.96L4.35 16.9C4.82167 16.4178 4.95233 15.6971 4.68 15.08C4.42093 14.4755 3.82764 14.0826 3.17 14.08H3C1.89543 14.08 1 13.1846 1 12.08C1 10.9754 1.89543 10.08 3 10.08H3.09C3.76727 10.0642 4.36613 9.63587 4.6 9C4.87233 8.38291 4.74167 7.66219 4.27 7.18L4.21 7.12C3.83445 6.74494 3.62343 6.23584 3.62343 5.705C3.62343 5.17416 3.83445 4.66506 4.21 4.29C4.58506 3.91445 5.09416 3.70343 5.625 3.70343C6.15584 3.70343 6.66494 3.91445 7.04 4.29L7.1 4.35C7.58219 4.82167 8.30291 4.95233 8.92 4.68H9C9.60447 4.42093 9.99738 3.82764 10 3.17V3C10 1.89543 10.8954 1 12 1C13.1046 1 14 1.89543 14 3V3.09C14.0026 3.74764 14.3955 4.34093 15 4.6C15.6171 4.87233 16.3378 4.74167 16.82 4.27L16.88 4.21C17.2551 3.83445 17.7642 3.62343 18.295 3.62343C18.8258 3.62343 19.3349 3.83445 19.71 4.21C20.0856 4.58506 20.2966 5.09416 20.2966 5.625C20.2966 6.15584 20.0856 6.66494 19.71 7.04L19.65 7.1C19.1783 7.58219 19.0477 8.30291 19.32 8.92V9C19.5791 9.60447 20.1724 9.99738 20.83 10H21C22.1046 10 23 10.8954 23 12C23 13.1046 22.1046 14 21 14H20.91C20.2524 14.0026 19.6591 14.3955 19.4 15Z" stroke={colors.scotia} strokeWidth={1.8} />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={styles.profileBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{demo.userName[0]}</Text>
          </View>
          <Text style={styles.userName}>{demo.userName}</Text>
          {demo.investingSince && (
            <Text style={styles.investingSince}>Investing since {demo.investingSince}</Text>
          )}
          <View style={styles.privacyPill}>
            <Text style={styles.privacyText}>🔒 Private profile</Text>
          </View>
        </View>

        {/* Scene+ Summary - simplified */}
        <Card style={styles.card}>
          <Text style={styles.sceneSectionTitle}>Scene+ Points</Text>
          <Text style={styles.sceneBalance}>{formatMoney(demo.scenePoints)}</Text>
          <Text style={styles.sceneValue}>≈ ${sceneValueCAD} CAD value</Text>

          <View style={styles.redemptionRow}>
            <View style={styles.redemptionTile}>
              <Text style={styles.redemptionIcon}>🛒</Text>
              <Text style={styles.redemptionLabel}>Groceries</Text>
            </View>
            <View style={styles.redemptionTile}>
              <Text style={styles.redemptionIcon}>🎬</Text>
              <Text style={styles.redemptionLabel}>Movies</Text>
            </View>
            <View style={styles.redemptionTile}>
              <Text style={styles.redemptionIcon}>📈</Text>
              <Text style={styles.redemptionLabel}>Reinvest</Text>
            </View>
          </View>
        </Card>

        {/* Investment Portfolio */}
        <InvestmentPortfolio
          holdings={demo.holdings}
          quotes={quotes}
          onHoldingPress={(ticker) => {
            setSelectedTicker(ticker);
            setShowDetail(true);
          }}
          onGoToSpark={() => navigation?.navigate?.('Spark')}
        />

        {/* Recent Milestones */}
        <Text style={styles.sectionTitle}>Recent milestones</Text>
        {demo.milestones.length === 0 ? (
          <Card variant="soft" style={styles.card}>
            <Text style={styles.emptyText}>Complete onboarding to earn your first milestone.</Text>
          </Card>
        ) : (
          demo.milestones.slice(0, 10).map((m, i) => (
            <View key={i} style={styles.milestoneRow}>
              <Text style={styles.milestoneIcon}>{m.icon}</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text style={styles.milestoneDate}>{m.date}</Text>
              </View>
              {m.points > 0 && <Text style={styles.milestonePoints}>+{m.points}</Text>}
            </View>
          ))
        )}

        {/* What We Don't Reward - THE TRUST CARD */}
        <Card style={[styles.card, styles.trustCard]}>
          <Text style={styles.trustTitle}>What we don't reward</Text>
          <Text style={styles.trustBody}>
            Scotia Spark does not reward trading frequency, portfolio returns, app opens, streaks, status tiers, or daily logins. We reward learning, consistency, and goal progress.
          </Text>
        </Card>

        {/* Logo footer */}
        <View style={styles.footerLogo}>
          <Logo variant="full" size={18} />
        </View>

        {/* Demo Reset */}
        <TouchableOpacity style={styles.resetButton} onPress={demo.resetDemo}>
          <Text style={styles.resetText}>Reset demo</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Holding Detail Sheet */}
      <HoldingDetailSheet
        visible={showDetail}
        onClose={() => { setShowDetail(false); setSelectedTicker(null); }}
        holding={selectedHolding}
        quote={selectedQuote}
        onBuy={() => {
          setShowDetail(false);
          setShowBuy(true);
        }}
        onSell={() => {
          setShowDetail(false);
          setShowSell(true);
        }}
      />

      {/* Buy Sheet (from detail) */}
      <BuySheet
        visible={showBuy}
        onClose={() => { setShowBuy(false); setSelectedTicker(null); }}
        quote={selectedQuote}
        accounts={demo.accounts}
        onConfirm={(amount, fromId) => {
          if (!selectedQuote) return;
          const toast = demo.buyShares(selectedQuote.ticker, amount, fromId, {
            price: selectedQuote.price,
            name: selectedQuote.name,
            type: selectedQuote.type as 'etf' | 'stock' | 'bond',
          });
          setShowBuy(false);
          setSelectedTicker(null);
          setToastMsg(toast.message);
          setShowToast(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      />

      {/* Sell Sheet (from detail) */}
      <SellSheet
        visible={showSell}
        onClose={() => { setShowSell(false); setSelectedTicker(null); }}
        holding={selectedHolding}
        quote={selectedQuote}
        onConfirm={(shares) => {
          if (!selectedQuote || !selectedTicker) return;
          const toast = demo.sellShares(selectedTicker, shares, { price: selectedQuote.price });
          setShowSell(false);
          setSelectedTicker(null);
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.titleHero,
  },
  settingsCog: {
    fontSize: 22,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleScreen,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  // Profile block
  profileBlock: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 26,
    fontFamily: 'Inter_500Medium',
  },
  userName: {
    ...typography.titleScreen,
    marginBottom: 4,
  },
  investingSince: {
    ...typography.micro,
    marginBottom: spacing.sm,
  },
  privacyPill: {
    backgroundColor: colors.warmTint,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
  privacyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.slate,
  },
  // Scene+
  sceneSectionTitle: {
    fontFamily: 'SourceSerifPro_400Regular',
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  sceneBalance: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 28,
    color: colors.ink,
  },
  sceneValue: {
    ...typography.micro,
    marginBottom: spacing.xl,
  },
  redemptionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  redemptionTile: {
    flex: 1,
    backgroundColor: colors.warmTint,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  redemptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  redemptionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: colors.ink,
  },
  // Milestones
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  milestoneIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.ink,
  },
  milestoneDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.slate,
  },
  milestonePoints: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 14,
    color: colors.sage,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: colors.slate,
    fontStyle: 'italic',
  },
  // Trust card
  trustCard: {
    borderColor: colors.scotiaRedSoft,
    borderWidth: 1,
    marginTop: spacing.lg,
  },
  trustTitle: {
    ...typography.titleCard,
    marginBottom: spacing.sm,
  },
  trustBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.slate,
    lineHeight: 22,
  },
  // Footer
  footerLogo: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  // Reset
  resetButton: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.md,
  },
  resetText: {
    fontFamily: 'Inter_500Medium',
    color: colors.mute,
    fontSize: 14,
  },
});
