import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Affiliate } from '../types';
import {
  getAffiliateScore,
  getDisplayName,
  getHighlightPlayersOnline,
  getLegalFooter,
  getPlayersOnline,
  getRtp,
  getStarRating,
  getVoteCount,
} from '../utils/affiliateDisplay';
import { openAffiliateUrl } from '../utils/affiliateLinks';
import { stripHtml } from '../utils/html';
import { colors } from '../utils/theme';
import { StarRating } from './StarRating';

type Props = {
  affiliate: Affiliate;
  rank: number;
  variant?: 'default' | 'highlight';
  embedded?: boolean;
};

function formatCountSpaced(value: number, plain = false) {
  return plain ? String(value) : value.toLocaleString('en-US');
}

function orderPaymentLogos(logos: string[]) {
  const preferred = ['sofort', 'visa', 'master', 'giro', 'paysafe'];
  return [...logos].sort((a, b) => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
    const indexA = lowerA.includes('trustly')
      ? preferred.length + 1
      : preferred.findIndex((key) => lowerA.includes(key));
    const indexB = lowerB.includes('trustly')
      ? preferred.length + 1
      : preferred.findIndex((key) => lowerB.includes(key));
    return (indexA === -1 ? preferred.length : indexA) - (indexB === -1 ? preferred.length : indexB);
  });
}

export function TopListCard({ affiliate, rank, variant = 'default', embedded = false }: Props) {
  const { meta, thumbnail } = affiliate;
  const bgColor = meta.ausi_background_color ?? colors.purpleHeader;
  const bonusTitle = stripHtml(meta.bonus_title ?? '');
  const freeSpinsRaw = stripHtml(meta.free_spins ?? '');
  const label = stripHtml(meta.ttvalue ?? 'Welcome bonus');
  const displayName = getDisplayName(affiliate);
  const score = getAffiliateScore(meta, rank);
  const starRating = getStarRating(meta, rank);
  const votes = getVoteCount(meta, rank);
  const isHighlight = variant === 'highlight';
  const players = isHighlight ? getHighlightPlayersOnline() : getPlayersOnline(meta, rank);
  const rtp = rank === 1 ? 98.69 : getRtp(meta);
  const allPayments = orderPaymentLogos(Object.values(meta.payment_logos ?? {}));
  const visiblePayments = allPayments.slice(0, 5);
  const extraPayments = allPayments.length - visiblePayments.length;
  const legal = getLegalFooter(meta, { trimEdgePipes: true });
  const isTopGlow = rank === 1 && !isHighlight;
  const dividerColor = isTopGlow || isHighlight ? colors.cardDivider : colors.cardDividerSubtle;
  const freeSpins = isHighlight
    ? freeSpinsRaw.replace(/^\+\s*/, '').trim()
    : freeSpinsRaw || '0 Freispiele';

  const openAffiliate = () => openAffiliateUrl(meta, displayName);

  const cardContent = (
    <View style={[styles.card, embedded && styles.cardEmbedded, isHighlight && styles.cardHighlight]}>
        <View style={styles.headerRow}>
          <View style={[styles.logoPanel, { backgroundColor: bgColor }]}>
            <Text style={styles.rank} numberOfLines={1}>
              {rank}
            </Text>
            {rtp != null && (
              <View style={styles.rtpBadge}>
                <Text style={styles.rtpText} numberOfLines={1}>
                  {rtp.toFixed(2)}% RTP
                </Text>
              </View>
            )}
            <Image source={{ uri: thumbnail }} style={styles.logo} contentFit="contain" />
          </View>

          <View style={styles.ratingPanel}>
            <Text style={styles.score} numberOfLines={1}>
              {score}
            </Text>
            <StarRating rating={starRating} size={13} />
            {!isHighlight ? (
              <Text style={styles.votes} numberOfLines={1}>
                {votes} Votes
              </Text>
            ) : null}
          </View>
        </View>

        <View style={[styles.headerDivider, { backgroundColor: dividerColor }]} />

        <View style={[styles.body, isHighlight && styles.bodyHighlight]}>
          <Text style={styles.bonusLabel} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.bonusTitle} numberOfLines={2}>
            {bonusTitle}
          </Text>
          <Text style={styles.freeSpins} numberOfLines={2}>
            {isHighlight ? `+${freeSpins}` : `+ ${freeSpins}`}
          </Text>

          <Pressable style={styles.cta} onPress={openAffiliate}>
            <Text style={styles.ctaText}>Bonus erhalten →</Text>
          </Pressable>

          <View style={[styles.divider, { backgroundColor: dividerColor }, isHighlight && styles.dividerHighlight]} />

          <Text style={styles.status} numberOfLines={2}>
            <Text style={styles.statusGreen}>{formatCountSpaced(players, isHighlight)}</Text>
            <Text style={styles.statusMuted}>
              {isHighlight ? ' spielt gerade | Wartezeit: ' : ' Spielt gerade | Auszahlungsdauer: '}
            </Text>
            <Text style={styles.statusGreen}>Sofort</Text>
          </Text>

          {visiblePayments.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: dividerColor }, isHighlight && styles.dividerHighlight]} />
              <View style={styles.payments}>
                {visiblePayments.map((uri) => (
                  <View key={uri} style={[styles.paymentWrap, isHighlight && styles.paymentWrapHighlight]}>
                    <Image
                      source={{ uri }}
                      style={[styles.paymentIcon, isHighlight && styles.paymentIconHighlight]}
                      contentFit="contain"
                    />
                  </View>
                ))}
                {extraPayments > 0 && (
                  <View style={[styles.paymentWrap, isHighlight && styles.paymentWrapHighlight]}>
                    <Text style={styles.paymentMore}>+{extraPayments}</Text>
                  </View>
                )}
              </View>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: dividerColor }, isHighlight && styles.dividerHighlight]} />
          <Text style={styles.legal} numberOfLines={2}>
            {legal}
          </Text>
        </View>
      </View>
  );

  if (embedded) return cardContent;

  const cardOuterStyle = isHighlight
    ? styles.cardOuterHighlight
    : isTopGlow
      ? styles.cardOuterTop
      : styles.cardOuterStandard;

  return (
    <View style={[styles.cardOuter, cardOuterStyle]}>
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.cardBody,
  },
  cardOuterTop: {
    shadowColor: colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  cardOuterStandard: {
    shadowColor: '#000000',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardOuterHighlight: {
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBody,
  },
  cardHighlight: {
    borderRadius: 12,
  },
  cardEmbedded: {
    borderRadius: 0,
  },
  headerRow: {
    flexDirection: 'row',
    minHeight: 106,
  },
  headerDivider: {
    height: 1,
  },
  logoPanel: {
    flex: 2,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rank: {
    position: 'absolute',
    top: 10,
    left: 14,
    color: colors.text,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 38,
  },
  rtpBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 10,
    alignSelf: 'center',
  },
  rtpText: {
    color: '#111827',
    fontSize: 9,
    fontWeight: '800',
  },
  logo: {
    width: 142,
    height: 50,
    marginTop: 2,
  },
  ratingPanel: {
    flex: 1,
    minWidth: 88,
    maxWidth: 108,
    backgroundColor: colors.cardBody,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 4,
    borderLeftWidth: 1,
    borderLeftColor: colors.cardDividerSubtle,
  },
  score: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  votes: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    alignItems: 'center',
    backgroundColor: colors.cardBody,
  },
  bodyHighlight: {
    paddingTop: 12,
    paddingBottom: 10,
  },
  bonusLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bonusTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
  },
  freeSpins: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  cta: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  ctaText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 10,
  },
  dividerHighlight: {
    marginVertical: 8,
  },
  status: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    width: '100%',
  },
  statusGreen: {
    color: colors.green,
    fontWeight: '600',
  },
  statusMuted: {
    color: colors.textMuted,
  },
  payments: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    gap: 4,
    width: '100%',
  },
  paymentWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 4,
    minWidth: 46,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIcon: {
    width: 42,
    height: 18,
  },
  paymentWrapHighlight: {
    minWidth: 40,
    width: 40,
    height: 26,
    paddingHorizontal: 3,
    paddingVertical: 3,
  },
  paymentIconHighlight: {
    width: 34,
    height: 16,
  },
  paymentMore: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '700',
  },
  legal: {
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 14,
    width: '100%',
  },
});
