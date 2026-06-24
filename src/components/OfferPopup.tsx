import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_DISPLAY_NAME } from '../config';
import type { Affiliate } from '../types';
import { formatBonusOffer } from '../utils/affiliateDisplay';
import { openAffiliateUrl } from '../utils/affiliateLinks';
import { stripHtml } from '../utils/html';
import { CONTENT_PADDING } from '../utils/layout';
import { colors } from '../utils/theme';

type Props = {
  affiliates: Affiliate[];
  /** Wait until splash is hidden before showing the modal. */
  canShow: boolean;
};

export function OfferPopup({ affiliates, canShow }: Props) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const affiliate = affiliates[0];

  const horizontal = Math.max(CONTENT_PADDING, insets.left, insets.right);

  useEffect(() => {
    if (!canShow || !affiliate || dismissed) return;

    const timer = setTimeout(() => setVisible(true), 350);
    return () => clearTimeout(timer);
  }, [canShow, affiliate, dismissed]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  const openAffiliate = () => {
    if (!affiliate) return;
    openAffiliateUrl(affiliate.meta, stripHtml(affiliate.title));
    dismiss();
  };

  if (!affiliate) return null;

  const { meta, thumbnail } = affiliate;
  const offer = formatBonusOffer(
    stripHtml(meta.bonus_title ?? ''),
    stripHtml(meta.free_spins ?? ''),
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View
        style={[
          styles.overlay,
          {
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
            paddingHorizontal: horizontal,
          },
        ]}
      >
        <View style={styles.modal}>
          <View style={styles.purpleSection}>
            <Pressable style={styles.closeBtn} onPress={dismiss} hitSlop={12}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>

            <View style={styles.giftFrame}>
              <Ionicons name="gift-outline" size={72} color="#ffffff" />
            </View>

            <View style={styles.headerRow}>
              <Ionicons name="time-outline" size={16} color="#ffffff" />
              <Text style={styles.headerTitle}>{APP_DISPLAY_NAME}</Text>
            </View>
          </View>

          <View style={styles.leafBadge}>
            <Text style={styles.leaf}>🍁</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.exclusive}>EXKLUSIVER BONUS FÜR DEUTSCHE!</Text>

            <View style={styles.offerRow}>
              <Image source={{ uri: thumbnail }} style={styles.logo} contentFit="contain" />
              <Text style={styles.offer}>{offer}</Text>
            </View>

            <Pressable style={styles.ctaPrimary} onPress={openAffiliate}>
              <Text style={styles.ctaPrimaryText}>JETZT SPIELEN</Text>
              <Text style={styles.ctaSubtext}>Wartezeit: 0–15 Min.</Text>
            </Pressable>

            <Pressable style={styles.ctaSecondary} onPress={dismiss}>
              <Text style={styles.ctaSecondaryText}>Nicht jetzt.</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
  },
  modal: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBody,
  },
  purpleSection: {
    backgroundColor: '#7e31b1',
    paddingTop: 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 200,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeText: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '700',
  },
  giftFrame: {
    width: 150,
    height: 120,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.85)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  leafBadge: {
    alignSelf: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    zIndex: 3,
    borderWidth: 2,
    borderColor: colors.cardBody,
  },
  leaf: {
    fontSize: 16,
  },
  body: {
    padding: 20,
    paddingTop: 12,
    gap: 14,
  },
  exclusive: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 100,
    height: 48,
    flexShrink: 0,
  },
  offer: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  ctaPrimary: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ctaSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  ctaSecondary: {
    backgroundColor: '#7e31b1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
