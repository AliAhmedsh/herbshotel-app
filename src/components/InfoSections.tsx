import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { PageMeta } from '../types';
import { extractImageUrls, stripHtml } from '../utils/html';
import { colors } from '../utils/theme';

type Props = {
  pageMeta: PageMeta;
};

const SECTIONS = [
  { headingKey: 'section_1_heading', contentKey: 'section_1_content' },
  { headingKey: 'section_2_heading', contentKey: 'section_2_content' },
  { headingKey: 'section_3_heading', contentKey: 'section_3_content' },
  { headingKey: 'section_4_heading', contentKey: 'section_4_content' },
] as const;

function parseSectionContent(html: string) {
  const paragraphs: string[] = [];
  const paragraphRegex = /<p\b[^>]*>([\s\S]*?)(?:<\/p>|$)/gi;
  let match: RegExpExecArray | null;

  while ((match = paragraphRegex.exec(html)) !== null) {
    const paragraph = stripHtml(match[1]);
    if (paragraph) paragraphs.push(paragraph);
  }

  const introMatch = html.match(/<\/p>\s*([^<]*?Die folgenden[\s\S]*?enthalten:)\s*<\/p>/i);
  const intro = introMatch ? stripHtml(introMatch[1]) : '';
  if (intro && !paragraphs.includes(intro)) paragraphs.push(intro);

  const checklist = Array.from(html.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/gi))
    .map((item) => stripHtml(item[1]))
    .filter(Boolean);

  if (paragraphs.length === 0) {
    paragraphs.push(stripHtml(html));
  }

  const paymentImages = extractImageUrls(html);

  return { paragraphs, checklist, paymentImages };
}

export function InfoSections({ pageMeta }: Props) {
  const blocks = SECTIONS.map((section) => {
    const headingKey = 'headingKey' in section ? section.headingKey : undefined;
    const { contentKey } = section;
    const heading = headingKey ? String(pageMeta[headingKey] ?? '').trim() : '';
    const content = String(pageMeta[contentKey] ?? '').trim();
    const { paragraphs, checklist, paymentImages } = parseSectionContent(content);

    if (paragraphs.length === 0) return null;

    return (
      <View key={contentKey} style={styles.block}>
        {heading ? (
          <View style={styles.headingBar}>
            <Text style={styles.heading}>{heading}</Text>
          </View>
        ) : null}
        {paragraphs.map((paragraph, index) => (
          <Text
            key={`${contentKey}-${index}`}
            style={[
              styles.paragraph,
              index === paragraphs.length - 1 && checklist.length > 0 && styles.intro,
              index === paragraphs.length - 1 && paymentImages.length > 0 && styles.paragraphBeforePayments,
            ]}
          >
            {paragraph}
          </Text>
        ))}
        {checklist.length > 0 ? (
          <View style={styles.checklist}>
            {checklist.map((item) => (
              <View key={item} style={styles.checkRow}>
                <Ionicons name="checkmark" size={18} color={colors.gold} style={styles.checkIcon} />
                <Text style={styles.checkText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {paymentImages.length > 0 ? (
          <View style={styles.paymentGrid}>
            {paymentImages.map((uri) => (
              <View key={uri} style={styles.paymentChip}>
                <Image source={{ uri }} style={styles.paymentLogo} contentFit="contain" />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    );
  }).filter(Boolean);

  if (blocks.length === 0) return null;

  return <View style={styles.container}>{blocks}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    gap: 18,
  },
  block: {
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: colors.cardBody,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingBottom: 16,
  },
  headingBar: {
    backgroundColor: '#3a2057',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  heading: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 27,
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  intro: {
    color: colors.text,
    marginBottom: 16,
  },
  paragraphBeforePayments: {
    marginBottom: 8,
  },
  checklist: {
    gap: 14,
    paddingHorizontal: 24,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    marginTop: 2,
  },
  checkText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 23,
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingHorizontal: 24,
    marginTop: 4,
  },
  paymentChip: {
    width: 64,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  paymentLogo: {
    width: 52,
    height: 22,
  },
});
