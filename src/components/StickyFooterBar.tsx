import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Affiliate } from '../types';
import { formatBonusOffer } from '../utils/affiliateDisplay';
import { openAffiliateUrl } from '../utils/affiliateLinks';
import { stripHtml } from '../utils/html';
import { useContentInsets } from '../utils/layout';
import { colors } from '../utils/theme';

type Props = {
  affiliate: Affiliate;
  visible: boolean;
  onClose: () => void;
};

export function StickyFooterBar({ affiliate, visible, onClose }: Props) {
  const { bottom } = useContentInsets();

  if (!visible || !affiliate) return null;

  const { meta, thumbnail } = affiliate;
  const offer = formatBonusOffer(
    stripHtml(meta.bonus_title ?? ''),
    stripHtml(meta.free_spins ?? ''),
  );
  const rtp = meta.detcasino_section01_2_detcasino_value_section1;

  const openAffiliate = () => openAffiliateUrl(meta);

  return (
    <View style={[styles.wrapper, { paddingBottom: bottom }]}>
      <View style={styles.bar}>
        <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
        <View style={styles.logoWrap}>
          <Image source={{ uri: thumbnail }} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.offerWrap}>
          {rtp ? <Text style={styles.rtp}>Gewinnrate: {Number(rtp).toFixed(2)}%</Text> : null}
          <Text style={styles.offer} numberOfLines={2}>
            {offer}
          </Text>
        </View>
        <Pressable style={styles.cta} onPress={openAffiliate}>
          <Text style={styles.ctaText}>Bonus erhalten</Text>
        </Pressable>
      </View>

      <View style={styles.legal}>
        <Text style={styles.legalText}>18+ · Terms & Conditions · Play Responsibly · Be Gamble Aware</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  closeBtn: {
    padding: 2,
  },
  closeText: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '700',
  },
  logoWrap: {
    backgroundColor: colors.purpleHeader,
    borderRadius: 6,
    padding: 4,
    width: 64,
    height: 34,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  offerWrap: {
    flex: 1,
  },
  rtp: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    marginBottom: 2,
  },
  offer: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 11,
  },
  cta: {
    backgroundColor: colors.ctaYellow,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ctaText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 11,
  },
  legal: {
    backgroundColor: colors.greenDark,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  legalText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 8,
    textAlign: 'center',
  },
});
