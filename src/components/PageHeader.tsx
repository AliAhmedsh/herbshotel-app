import { StyleSheet, Text, View } from 'react-native';
import type { PageMeta } from '../types';
import { stripHtml } from '../utils/html';
import { renderStyledPageTitle } from '../utils/parseTitle';
import { colors } from '../utils/theme';

type Props = {
  pageMeta: PageMeta;
};

export function PageHeader({ pageMeta }: Props) {
  const titleHtml = String(pageMeta.custom_page_title ?? '');
  const description = stripHtml(
    String(pageMeta.banner_description_readmore ?? pageMeta.banner_description ?? ''),
  );

  if (!titleHtml && !description) return null;

  return (
    <View style={styles.container}>
      {titleHtml ? (
        renderStyledPageTitle(titleHtml)
      ) : (
        <Text style={styles.fallbackTitle}>
          Am besten bewertete Online-Casinos für Echtgeld in Deutschland!
        </Text>
      )}
      {description ? (
        <Text style={styles.description} numberOfLines={5}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    paddingTop: 8,
    alignItems: 'center',
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
  },
  description: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
    textAlign: 'center',
  },
});
