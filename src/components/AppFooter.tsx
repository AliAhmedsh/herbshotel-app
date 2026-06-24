import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import type { PageMeta } from '../types';
import { extractImageUrl, stripHtml } from '../utils/html';
import { colors } from '../utils/theme';

type Props = {
  pageMeta: PageMeta;
};

const FEATURE_IMAGE_KEYS = [
  'responsible_gambling_features_1_img',
  'responsible_gambling_features_2_img',
  'responsible_gambling_features_3_img',
  'responsible_gambling_features_4_img',
  'responsible_gambling_features_5_img',
  'responsible_gambling_features_6_img',
] as const;

export function AppFooter({ pageMeta }: Props) {
  const title = stripHtml(String(pageMeta.responsible_gambling_title ?? ''));
  const content = stripHtml(String(pageMeta.responsible_gambling_content ?? ''));
  const copyrightLine = stripHtml(String(pageMeta.copyright_content_1 ?? ''));
  const rights = stripHtml(String(pageMeta.copyright_content_2 ?? ''));
  const badgeUrls = FEATURE_IMAGE_KEYS.map((key) => extractImageUrl(String(pageMeta[key] ?? '')))
    .filter((url): url is string => Boolean(url));

  if (!title && !content && badgeUrls.length === 0) return null;

  return (
    <View style={styles.root}>
      <View style={styles.responsibleSection}>
        <LinearGradient
          colors={[
            colors.footerResponsibleTop,
            colors.footerResponsibleMid,
            colors.footerResponsibleBottom,
          ]}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.responsibleTopLine} />

        <View style={styles.responsibleContent}>
          <View style={styles.iconBadge}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
          </View>

          {title ? <Text style={styles.title}>{title}</Text> : null}
          {content ? <Text style={styles.copy}>{content}</Text> : null}

          {badgeUrls.length > 0 ? (
            <View style={styles.badgeGrid}>
              {badgeUrls.map((url) => (
                <View key={url} style={styles.badgeTile}>
                  <Image source={{ uri: url }} style={styles.badgeImage} contentFit="contain" />
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>

      <LinearGradient
        colors={[colors.footerCopyrightTop, colors.footerCopyrightBottom]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.copyrightSection}
      >
        <View style={styles.copyrightTopLine} />
        {copyrightLine ? <Text style={styles.ageLine}>{copyrightLine}</Text> : null}
        {rights ? (
          <Text style={styles.rights}>
            © {new Date().getFullYear()} {rights}
          </Text>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginHorizontal: -16,
    marginTop: 48,
  },
  responsibleSection: {
    position: 'relative',
    overflow: 'hidden',
    paddingVertical: 96,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  responsibleTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(166, 76, 255, 0.5)',
  },
  responsibleContent: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(166, 76, 255, 0.3)',
    backgroundColor: 'rgba(166, 76, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  copy: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 48,
  },
  badgeGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  badgeTile: {
    width: '30%',
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  copyrightSection: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  copyrightTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(166, 76, 255, 0.4)',
  },
  ageLine: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
    marginBottom: 4,
  },
  rights: {
    color: 'rgba(156, 163, 175, 0.4)',
    fontSize: 11,
    textAlign: 'center',
  },
});
