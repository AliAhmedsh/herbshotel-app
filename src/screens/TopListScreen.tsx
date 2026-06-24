import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchToplist } from '../api/fetchToplist';
import type { Affiliate, PageMeta } from '../types';
import { colors } from '../utils/theme';
import { useContentInsets } from '../utils/layout';
import { OfferPopup } from '../components/OfferPopup';
import { AppFooter } from '../components/AppFooter';
import { InfoSections } from '../components/InfoSections';
import { PageHeader } from '../components/PageHeader';
import { SiteHeader } from '../components/SiteHeader';
import { StickyFooterBar } from '../components/StickyFooterBar';
import { TopListCard } from '../components/TopListCard';

type Props = {
  onReady?: () => void;
  showOfferPopup?: boolean;
};

export function TopListScreen({ onReady, showOfferPopup = false }: Props) {
  const { top, horizontal, listBottomPadding } = useContentInsets();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [footerVisible, setFooterVisible] = useState(true);
  const [footerDismissed, setFooterDismissed] = useState(false);
  const lastOffset = useRef(0);
  const readyNotified = useRef(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await fetchToplist();
      setAffiliates(Array.isArray(data.affiliates) ? data.affiliates : []);
      setPageMeta(data.page_meta ?? {});
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load data';
      setError(message);
      console.error('Toplist load failed:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (!isRefresh && !readyNotified.current) {
        readyNotified.current = true;
        onReady?.();
      }
    }
  }, [onReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 600);
    return () => clearTimeout(timer);
  }, [load]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const delta = y - lastOffset.current;
    if (Math.abs(delta) > 8) {
      setFooterVisible(delta < 0 || y < 40);
      lastOffset.current = y;
    }
  };

  const listStyle = {
    paddingTop: top,
    paddingHorizontal: horizontal,
    paddingBottom: footerDismissed ? horizontal : listBottomPadding,
  };

  if (loading) {
    if (!onReady) {
      return (
        <View style={[styles.center, { paddingTop: top, paddingHorizontal: horizontal }]}>
          <ActivityIndicator size="large" color={colors.green} />
          <Text style={styles.loadingText}>Lade Toplist...</Text>
        </View>
      );
    }
    return null;
  }

  if (error) {
    return (
      <View style={[styles.center, { paddingTop: top, paddingHorizontal: horizontal }]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retry} onPress={() => load()}>
          Erneut versuchen
        </Text>
      </View>
    );
  }

  if (affiliates.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: top, paddingHorizontal: horizontal }]}>
        <Text style={styles.loadingText}>Keine Casinos gefunden.</Text>
        <Text style={styles.retry} onPress={() => load()}>
          Erneut laden
        </Text>
      </View>
    );
  }

  const footerAffiliate = affiliates[0];

  return (
    <View style={styles.screen}>
      <FlatList
        data={affiliates}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={listStyle}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.green} />
        }
        ListHeaderComponent={
          <>
            <SiteHeader contentPadding={horizontal} />
            <PageHeader pageMeta={pageMeta} />
          </>
        }
        renderItem={({ item, index }) => <TopListCard affiliate={item} rank={index + 1} />}
        ListFooterComponent={
          <>
            <InfoSections pageMeta={pageMeta} />
            <AppFooter />
          </>
        }
      />

      <OfferPopup affiliates={affiliates} canShow={showOfferPopup} />

      {!footerDismissed && footerAffiliate ? (
        <StickyFooterBar
          affiliate={footerAffiliate}
          visible={footerVisible}
          onClose={() => setFooterDismissed(true)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 12,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    color: colors.green,
    fontWeight: '700',
  },
});
