import { Alert, Linking } from 'react-native';
import type { AffiliateMeta } from '../types';

/** Prefer tracking URL used on the WordPress site; fall back to safe redirect page. */
export function getAffiliateUrl(meta: AffiliateMeta): string | null {
  const url = meta.url?.trim();
  const affLink = meta.aff_link?.trim();
  return affLink || url || null;
}

export async function openAffiliateUrl(meta: AffiliateMeta, casinoName?: string) {
  const url = getAffiliateUrl(meta);

  if (!url) {
    Alert.alert('Link unavailable', 'No affiliate URL was returned for this casino.');
    return;
  }

  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Link unavailable', `Cannot open: ${url}`);
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert(
      'Could not open link',
      casinoName
        ? `The link for ${casinoName} could not be opened. The casino URL may be misconfigured on the website.`
        : 'The casino link could not be opened. The URL may be misconfigured on the website.',
    );
  }
}
