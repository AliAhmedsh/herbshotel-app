import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AnimatedSplash } from './src/components/AnimatedSplash';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { TopListScreen } from './src/screens/TopListScreen';
import { colors } from './src/utils/theme';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const MIN_SPLASH_MS = 4000;

export default function App() {
  const [splashVisible, setSplashVisible] = useState(true);
  const splashStartedAt = useRef(Date.now());
  const dataReady = useRef(false);
  const assetsReady = useRef(false);

  const tryHideSplash = useCallback(() => {
    if (!dataReady.current || !assetsReady.current) return;

    const elapsed = Date.now() - splashStartedAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);

    setTimeout(() => {
      setSplashVisible(false);
    }, remaining);
  }, []);

  const handleDataReady = useCallback(() => {
    dataReady.current = true;
    tryHideSplash();
  }, [tryHideSplash]);

  const handleAssetsReady = useCallback(() => {
    assetsReady.current = true;
    tryHideSplash();
  }, [tryHideSplash]);

  return (
    <SafeAreaProvider>
      <View style={[styles.root, splashVisible && styles.rootSplash]}>
        <StatusBar style="light" />
        <ErrorBoundary>
          <TopListScreen onReady={handleDataReady} showOfferPopup={!splashVisible} />
        </ErrorBoundary>
        {splashVisible ? <AnimatedSplash onReady={handleAssetsReady} /> : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rootSplash: {
    backgroundColor: '#1a4a9e',
  },
});
