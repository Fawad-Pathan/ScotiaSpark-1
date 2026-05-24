import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '../../theme';
import { Card, RiskPill, TimeHorizonPill } from '../../components';

interface AskScotiaAIProps {
  symbol: string;
  name: string;
  onClose: () => void;
  onAddWatchlist: () => void;
  isOnWatchlist: boolean;
}

export function AskScotiaAI({ symbol, name, onClose, onAddWatchlist, isOnWatchlist }: AskScotiaAIProps) {
  const [showExplain, setShowExplain] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.handle} />
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.symbol}>{symbol}</Text>
        <Text style={styles.name}>{name}</Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHAT THIS IS</Text>
          <Text style={styles.sectionBody}>
            XEQT is an all-in-one equity ETF managed by BlackRock (iShares). It holds approximately 9,000 stocks across 
            North America, Europe, Asia Pacific, and emerging markets. A single purchase provides broad global equity 
            diversification.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW PEOPLE OFTEN USE IT</Text>
          <Text style={styles.sectionBody}>
            XEQT tends to be considered a core long-term holding for investors comfortable with equity-only exposure. 
            It is commonly used as a complete portfolio in a TFSA or FHSA, or as the equity component of a broader 
            allocation that includes fixed income.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RISK AND TIME HORIZON</Text>
          <View style={styles.pillRow}>
            <RiskPill level="medium" />
            <TimeHorizonPill horizon="5+ years recommended" />
          </View>
          <Text style={styles.sectionBody}>
            As a 100% equity fund, XEQT historically experiences larger short-term fluctuations than balanced funds. 
            Over longer periods (5+ years), global equity portfolios have historically tended to grow, though past 
            performance is not indicative of future results.
          </Text>
        </View>

        {/* Section 4 - Personalized */}
        <View style={[styles.section, styles.personalizedSection]}>
          <Text style={styles.sectionLabel}>HOW IT MIGHT FIT YOU</Text>
          <Text style={styles.sectionBody}>
            Based on your First Home goal with a 5-year time horizon, XEQT may fit as a growth-oriented component 
            of your FHSA. Investors like you who are in the early years of long-term saving often research global 
            equity ETFs as a way to participate in broad market growth.
          </Text>
          <Text style={styles.personalizedNote}>
            This is worth researching further. Consider how this fits alongside your existing holdings and risk comfort.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onAddWatchlist} style={styles.actionBtn}>
            <Text style={[styles.actionText, isOnWatchlist && { color: colors.sage }]}>
              {isOnWatchlist ? '✓ On watchlist' : '+ Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Compliance Footer */}
        <View style={styles.complianceFooter}>
          <Text style={styles.disclaimer}>Worth researching, not financial advice</Text>
          <TouchableOpacity onPress={() => setShowExplain(!showExplain)}>
            <Text style={styles.explainLink}>Explain this →</Text>
          </TouchableOpacity>
        </View>

        {/* Explain This Surface */}
        {showExplain && (
          <Card style={styles.explainCard}>
            <Text style={styles.explainTitle}>How this response was generated</Text>
            
            <Text style={styles.explainLabel}>SCOTIA SOURCE DOCUMENTS</Text>
            <Text style={styles.explainItem}>• iShares Core Equity ETF Portfolio — Product Overview (v2026-Q1, reviewed Jan 15 2026)</Text>
            <Text style={styles.explainItem}>• Scotia Global Asset Management — ETF Risk Classification Guide (v2025-Q4)</Text>
            <Text style={styles.explainItem}>• Scotia iTRADE — XEQT Market Data Feed (real-time, as of {new Date().toLocaleTimeString()})</Text>

            <Text style={[styles.explainLabel, { marginTop: spacing.lg }]}>MODEL VERSION</Text>
            <Text style={styles.explainItem}>Scotia AI Content Engine v2.1 · Response generated {new Date().toLocaleString()}</Text>

            <Text style={[styles.explainLabel, { marginTop: spacing.lg }]}>WHAT WE DID NOT DO</Text>
            <Text style={styles.explainItem}>• No external commentary or social media content was used</Text>
            <Text style={styles.explainItem}>• No AI-generated dollar figures appear in this response</Text>
            <Text style={styles.explainItem}>• No buy or sell recommendation was made</Text>
            <Text style={styles.explainItem}>• All market data sourced from Scotia iTRADE structured feed with timestamps</Text>
          </Card>
        )}

        {/* Advisor Handoff */}
        <TouchableOpacity style={styles.advisorBar}>
          <Text style={styles.advisorText}>Talk to a Scotia advisor · 15 min · video or branch</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardSurface,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardBorder,
    marginBottom: spacing.md,
  },
  closeBtn: {
    position: 'absolute',
    right: spacing.xl,
    top: spacing.md,
  },
  closeText: {
    ...typography.bodyMedium,
    color: colors.scotiaRed,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 60,
  },
  symbol: {
    fontFamily: 'RobotoMono_500Medium',
    fontSize: 28,
    color: colors.primaryText,
    marginTop: spacing.lg,
  },
  name: {
    ...typography.smallBody,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
    paddingBottom: spacing.xxl,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.cardBorder,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  sectionBody: {
    ...typography.body,
    color: colors.secondaryText,
    fontSize: 15,
    lineHeight: 24,
  },
  pillRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  personalizedSection: {
    backgroundColor: colors.sageTint,
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    borderBottomWidth: 0,
  },
  personalizedNote: {
    ...typography.metadata,
    fontStyle: 'italic',
    marginTop: spacing.md,
    color: colors.sage,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xxl,
    marginTop: spacing.lg,
  },
  actionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.pill,
  },
  actionText: {
    ...typography.bodyMedium,
    fontSize: 14,
    color: colors.primaryText,
  },
  complianceFooter: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  disclaimer: {
    ...typography.metadata,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.tertiaryText,
    marginBottom: spacing.sm,
  },
  explainLink: {
    ...typography.bodyMedium,
    color: colors.scotiaRed,
    fontSize: 14,
  },
  explainCard: {
    marginBottom: spacing.xxl,
    backgroundColor: colors.softCard,
  },
  explainTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  explainLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  explainItem: {
    ...typography.smallBody,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  advisorBar: {
    backgroundColor: colors.softCard,
    borderRadius: radii.button,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  advisorText: {
    ...typography.metadata,
    color: colors.primaryText,
  },
});
