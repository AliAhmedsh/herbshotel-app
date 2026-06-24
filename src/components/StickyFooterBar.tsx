import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { Affiliate } from '../types';
import { getLegalFooter } from '../utils/affiliateDisplay';
import { openAffiliateUrl } from '../utils/affiliateLinks';
import { stripHtml } from '../utils/html';
import { useContentInsets } from '../utils/layout';
import { colors } from '../utils/theme';

type Props = {
  affiliate: Affiliate;
  visible: boolean;
  onClose: () => void;
};

const STICKY_LEGAL_ITEMS = ['18+', 'Terms & Conditions', 'Play Responsibly', 'Be Gamble Aware'];

function getStickyFooterLegalItems(meta: Affiliate['meta']): string[] {
  const raw = getLegalFooter(meta, { trimEdgePipes: true })
    .replace(/\s*\|\s*/g, '|')
    .replace(/\bT&C\b/gi, 'Terms & Conditions')
    .trim();

  if (!raw) return STICKY_LEGAL_ITEMS;

  const items = raw
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : STICKY_LEGAL_ITEMS;
}

export function StickyFooterBar({ affiliate, visible, onClose }: Props) {
  const { bottom } = useContentInsets();
  const { width: screenWidth } = useWindowDimensions();

  if (!visible || !affiliate) return null;

  const { meta, thumbnail } = affiliate;
  const bonusTitle = stripHtml(meta.bonus_title ?? '');
  const freeSpins = stripHtml(meta.free_spins ?? '').replace(/^\+\s*/, '');
  const legalItems = getStickyFooterLegalItems(meta);
  const openAffiliate = () => openAffiliateUrl(meta);

  return (
    <View style={[styles.wrapper, { width: screenWidth }]}>
      <LinearGradient
        colors={['#22c55e', '#15803d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.bar}>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <View style={styles.logoWrap}>
            <Image source={{ uri: thumbnail }} style={styles.logo} contentFit="contain" />
          </View>
          <View style={styles.offerWrap}>
            <Text style={styles.offer} numberOfLines={2}>
              {bonusTitle}
              {freeSpins ? `\n+ ${freeSpins}` : ''}
            </Text>
          </View>
          <Pressable style={styles.cta} onPress={openAffiliate}>
            <Text style={styles.ctaText}>Bonus erhalten →</Text>
          </Pressable>
        </View>

        <View style={[styles.legal, bottom > 0 && { paddingBottom: 4 + bottom }]}>
          <View style={styles.legalRow}>
            {legalItems.map((item) => (
              <Text key={item} style={styles.legalText}>
                {item}
              </Text>
            ))}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    elevation: 20,
  },
  gradient: {
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 8,
    gap: 6,
  },
  closeBtn: {
    width: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
    lineHeight: 20,
    fontWeight: '400',
  },
  logoWrap: {
    backgroundColor: colors.primaryDark,
    borderRadius: 6,
    width: 96,
    height: 48,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  offerWrap: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offer: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
  cta: {
    backgroundColor: colors.ctaYellow,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexShrink: 0,
  },
  ctaText: {
    color: '#111',
    fontWeight: '800',
    fontSize: 11,
  },
  legal: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingTop: 4,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  legalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  legalText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 10,
    lineHeight: 13,
  },
});
