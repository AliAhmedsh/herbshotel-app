import { Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { Affiliate } from '../types';
import { colors } from '../utils/theme';
import { TopListCard } from './TopListCard';

type Props = {
  affiliate: Affiliate | undefined;
};

/**
 * Website markup:
 * <div class="py-12"><h2 class="text-center mb-8">
 *   <span class="inline-block bg-primary px-6 py-2 text-2xl font-extrabold uppercase tracking-wider">
 *     Das Highlight der Woche
 *   </span>
 * </h2>
 */
export function WeeklyHighlight({ affiliate }: Props) {
  const { width } = useWindowDimensions();

  if (!affiliate) return null;

  return (
    <View style={styles.section}>
      <View style={[styles.titleBar, { width }]}>
        <Text style={styles.titleText}>Das Highlight der{'\n'}Woche</Text>
      </View>
      <View style={styles.cardWrap}>
        <TopListCard affiliate={affiliate} rank={1} variant="highlight" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginTop: 48,
    alignItems: 'center',
  },
  titleBar: {
    marginHorizontal: -16,
    alignSelf: 'stretch',
    backgroundColor: '#7b2fc7',
    minHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 32,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textAlign: 'center',
    ...Platform.select({
      android: { includeFontPadding: false },
      default: {},
    }),
  },
  cardWrap: {
    width: '100%',
  },
});
