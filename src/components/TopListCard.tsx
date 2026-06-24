import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Affiliate } from '../types';
import {
  getAffiliateScore,
  getDisplayName,
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
};

function formatCountSpaced(value: number) {
  return value.toLocaleString('de-DE').replace(/\./g, ' ');
}

export function TopListCard({ affiliate, rank }: Props) {
  const { meta, thumbnail } = affiliate;
  const bgColor = meta.ausi_background_color ?? colors.purpleHeader;
  const bonusTitle = stripHtml(meta.bonus_title ?? '');
  const freeSpins = stripHtml(meta.free_spins ?? '');
  const label = stripHtml(meta.ttvalue ?? 'Welcome bonus');
  const displayName = getDisplayName(affiliate);
  const score = getAffiliateScore(meta, rank);
  const starRating = getStarRating(meta, rank);
  const votes = getVoteCount(meta, rank);
  const players = getPlayersOnline(meta, rank);
  const rtp = getRtp(meta);
  const allPayments = Object.values(meta.payment_logos ?? {});
  const visiblePayments = allPayments.slice(0, 5);
  const extraPayments = allPayments.length - visiblePayments.length;
  const legal = getLegalFooter(meta);
  const isTop = rank === 1;

  const openAffiliate = () => openAffiliateUrl(meta, displayName);

  return (
    <View style={[styles.cardGlow, isTop && styles.cardGlowTop]}>
      <View style={styles.card}>
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
            <Text style={styles.votes} numberOfLines={1}>
              {votes} Votes
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.bonusLabel} numberOfLines={1}>
            {label}
          </Text>
          <Text style={styles.bonusTitle} numberOfLines={2}>
            {bonusTitle}
          </Text>
          {freeSpins ? (
            <Text style={styles.freeSpins} numberOfLines={2}>
              + {freeSpins}
            </Text>
          ) : null}

          <Pressable style={styles.cta} onPress={openAffiliate}>
            <Text style={styles.ctaText}>Bonus erhalten →</Text>
          </Pressable>

          <View style={styles.divider} />

          <Text style={styles.status} numberOfLines={2}>
            <Text style={styles.statusGreen}>{formatCountSpaced(players)} Spielt gerade</Text>
            <Text style={styles.statusMuted}> | Auszahlungsdauer: </Text>
            <Text style={styles.statusGreen}>Sofort</Text>
          </Text>

          {visiblePayments.length > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.payments}>
                {visiblePayments.map((uri) => (
                  <View key={uri} style={styles.paymentWrap}>
                    <Image source={{ uri }} style={styles.paymentIcon} contentFit="contain" />
                  </View>
                ))}
                {extraPayments > 0 && (
                  <View style={styles.paymentWrap}>
                    <Text style={styles.paymentMore}>+{extraPayments}</Text>
                  </View>
                )}
              </View>
            </>
          )}

          <View style={styles.divider} />
          <Text style={styles.legal} numberOfLines={2}>
            {legal}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardGlow: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: colors.cardBody,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    shadowColor: '#a855f7',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  cardGlowTop: {
    borderColor: 'rgba(168, 85, 247, 0.9)',
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBody,
  },
  headerRow: {
    flexDirection: 'row',
    minHeight: 112,
  },
  logoPanel: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rank: {
    position: 'absolute',
    top: 10,
    left: 14,
    color: '#ffffff',
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
    width: 150,
    height: 54,
    marginTop: 2,
  },
  ratingPanel: {
    width: 96,
    backgroundColor: colors.cardBody,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 4,
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
    paddingTop: 16,
    paddingBottom: 14,
    alignItems: 'center',
    backgroundColor: colors.cardBody,
  },
  bonusLabel: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bonusTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
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
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  paymentWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
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
