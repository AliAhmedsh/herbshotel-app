import { StyleSheet, Text } from 'react-native';
import { colors } from './theme';

const PRIMARY_CLASS = 'text-primary';

export function renderStyledPageTitle(html: string) {
  const parts: { text: string; primary: boolean }[] = [];
  const regex = /<span class="([^"]*)">([\s\S]*?)<\/span>|([^<]+)|<br\s*\/?>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    if (match[1] !== undefined) {
      parts.push({
        text: match[2].replace(/\s+/g, ' '),
        primary: match[1].includes(PRIMARY_CLASS),
      });
    } else if (match[3]) {
      parts.push({ text: match[3].replace(/\s+/g, ' '), primary: false });
    } else {
      parts.push({ text: '\n', primary: false });
    }
  }

  if (parts.length === 0) {
    return <Text style={styles.title}>{html.replace(/<[^>]+>/g, '')}</Text>;
  }

  return (
    <Text style={styles.title}>
      {parts.map((part, index) =>
        part.text === '\n' ? (
          '\n'
        ) : (
          <Text key={`${part.text}-${index}`} style={part.primary ? styles.titlePrimary : styles.title}>
            {part.text}
          </Text>
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
    textAlign: 'center',
  },
  titlePrimary: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 29,
  },
});
