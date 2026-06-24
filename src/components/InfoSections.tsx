import { StyleSheet, Text, View } from 'react-native';
import type { PageMeta } from '../types';
import { splitHtmlParagraphs } from '../utils/html';
import { colors } from '../utils/theme';

type Props = {
  pageMeta: PageMeta;
};

const SECTIONS = [
  { contentKey: 'section_1_content' },
  { headingKey: 'section_2_heading', contentKey: 'section_2_content' },
  { headingKey: 'section_3_heading', contentKey: 'section_3_content' },
  { headingKey: 'section_4_heading', contentKey: 'section_4_content' },
] as const;

export function InfoSections({ pageMeta }: Props) {
  const blocks = SECTIONS.map((section) => {
    const headingKey = 'headingKey' in section ? section.headingKey : undefined;
    const { contentKey } = section;
    const heading = headingKey ? String(pageMeta[headingKey] ?? '').trim() : '';
    const content = String(pageMeta[contentKey] ?? '').trim();
    const paragraphs = splitHtmlParagraphs(content);

    if (paragraphs.length === 0) return null;

    return (
      <View key={contentKey} style={styles.block}>
        {heading ? (
          <View style={styles.headingBar}>
            <Text style={styles.heading}>{heading}</Text>
          </View>
        ) : null}
        {paragraphs.map((paragraph, index) => (
          <Text key={`${contentKey}-${index}`} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    );
  }).filter(Boolean);

  if (blocks.length === 0) return null;

  return <View style={styles.container}>{blocks}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 20,
  },
  block: {
    gap: 10,
  },
  headingBar: {
    backgroundColor: colors.purple,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 21,
  },
});
