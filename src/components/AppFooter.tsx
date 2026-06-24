import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

const LEGAL_LINKS = [
  { label: 'Impressum', url: 'https://www.theherbshotel.com/de/impressum/' },
  { label: 'Datenschutz', url: 'https://www.theherbshotel.com/de/datenschutz/' },
  { label: 'AGB', url: 'https://www.theherbshotel.com/de/agb/' },
];

export function AppFooter() {
  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.links}>
        {LEGAL_LINKS.map((link, index) => (
          <View key={link.label} style={styles.linkRow}>
            {index > 0 ? <Text style={styles.separator}>·</Text> : null}
            <Pressable onPress={() => openUrl(link.url)}>
              <Text style={styles.link}>{link.label}</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>18+</Text>
        </View>
        <Text style={styles.badgeLabel}>BeGambleAware</Text>
        <Text style={styles.badgeLabel}>Spielen Sie verantwortungsvoll</Text>
      </View>

      <Text style={styles.copyright}>© {new Date().getFullYear()} Top10 DE Casino</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
    gap: 16,
    paddingBottom: 8,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    color: colors.text,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  separator: {
    color: colors.textMuted,
    fontSize: 12,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '800',
  },
  badgeLabel: {
    color: colors.textMuted,
    fontSize: 11,
  },
  copyright: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
});
