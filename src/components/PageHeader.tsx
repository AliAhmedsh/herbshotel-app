import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PageMeta } from '../types';
import { stripHtml } from '../utils/html';
import { renderStyledPageTitle } from '../utils/parseTitle';
import { HERO_BACKGROUND_URL, colors } from '../utils/theme';

type Props = {
  pageMeta: PageMeta;
  contentPadding: number;
};

type PillIcon = ComponentProps<typeof Ionicons>['name'];

const HERO_PILLS: { icon: PillIcon; label: string; dynamicDate?: boolean }[] = [
  { icon: 'calendar-outline', label: 'Letztes Bonus-Update', dynamicDate: true },
  { icon: 'shield-checkmark-outline', label: 'Sofortige und sichere Auszahlungen' },
  { icon: 'people-outline', label: 'Von Experten geschätzt' },
  { icon: 'desktop-outline', label: 'Mobilfreundlich und KYC-konform' },
];

function formatBonusUpdateDate(date: Date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${days[date.getDay()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function PageHeader({ pageMeta, contentPadding }: Props) {
  const titleHtml = String(pageMeta.custom_page_title ?? '');
  const description = stripHtml(
    String(pageMeta.banner_description_readmore ?? pageMeta.banner_description ?? ''),
  );

  if (!titleHtml && !description) return null;

  return (
    <ImageBackground
      source={{ uri: HERO_BACKGROUND_URL }}
      resizeMode="cover"
      imageStyle={styles.heroImage}
      style={[
        styles.container,
        {
          marginHorizontal: -contentPadding,
          paddingHorizontal: contentPadding,
        },
      ]}
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        {titleHtml ? (
          renderStyledPageTitle(titleHtml)
        ) : (
          <Text style={styles.fallbackTitle}>
            Am besten bewertete Online-Casinos für Echtgeld in Deutschland!
          </Text>
        )}
        {description ? (
          <Text style={styles.description} numberOfLines={4}>
            {description}
            <Text style={styles.readMore}>Mehr lesen</Text>
          </Text>
        ) : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
          style={styles.pillsScroller}
        >
          {HERO_PILLS.map((pill) => {
            const label = pill.dynamicDate
              ? `${pill.label}: ${formatBonusUpdateDate(new Date())}`
              : pill.label;

            return (
              <View key={pill.label} style={styles.pill}>
                <Ionicons name={pill.icon} size={17} color={colors.gold} />
                <Text style={styles.pillText} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 260,
    marginBottom: 8,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  heroImage: {
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(25, 13, 38, 0.62)',
  },
  content: {
    flex: 1,
    paddingTop: 18,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
  },
  description: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 0,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  readMore: {
    color: colors.primary,
  },
  pillsScroller: {
    marginTop: 24,
    width: '100%',
  },
  pills: {
    gap: 8,
    paddingRight: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(20, 20, 28, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pillText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '700',
  },
});
