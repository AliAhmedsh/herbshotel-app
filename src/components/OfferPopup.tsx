import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Affiliate } from '../types';
import { formatBonusOffer } from '../utils/affiliateDisplay';
import { openAffiliateUrl } from '../utils/affiliateLinks';
import { stripHtml } from '../utils/html';
import { CONTENT_PADDING } from '../utils/layout';
import { colors } from '../utils/theme';

const GIFT_BOXES_URL = 'https://playslotsuk.com/wp-content/uploads/2026/03/presents.png';

type Props = {
  affiliates: Affiliate[];
  /** Wait until splash is hidden before showing the modal. */
  canShow: boolean;
  onVisibilityChange?: (visible: boolean) => void;
};

export function OfferPopup({ affiliates, canShow, onVisibilityChange }: Props) {
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

  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [onVisibilityChange, visible]);

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

            <Image source={{ uri: GIFT_BOXES_URL }} style={styles.gifts} contentFit="contain" />

            <View style={styles.headerRow}>
              <Ionicons name="stopwatch-outline" size={38} color="#ffffff" />
              <Text style={styles.headerTitle}>ZEITLICH BEGRENZTES{'\n'}ANGEBOT</Text>
            </View>
          </View>

          <View style={styles.leafBadge}>
            <Text style={styles.leaf}>🍁</Text>
          </View>

          <View style={styles.body}>
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
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.cardBody,
    borderWidth: 1,
    borderColor: colors.border,
  },
  purpleSection: {
    backgroundColor: '#7e31b1',
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    minHeight: 146,
  },
  closeBtn: {
    position: 'absolute',
    top: 23,
    right: 23,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeText: {
    color: colors.primary,
    fontSize: 27,
    lineHeight: 28,
    fontWeight: '400',
  },
  gifts: {
    width: 128,
    height: 110,
    marginTop: -2,
    marginBottom: -10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'flex-start',
    marginLeft: -2,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
    lineHeight: 21,
  },
  leafBadge: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    zIndex: 3,
    borderWidth: 0,
  },
  leaf: {
    fontSize: 24,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 16,
    gap: 10,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 26,
  },
  logo: {
    width: 128,
    height: 64,
    flexShrink: 0,
  },
  offer: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    textAlign: 'center',
  },
  ctaPrimary: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  ctaSubtext: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  ctaSecondary: {
    backgroundColor: '#7e31b1',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  ctaSecondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
