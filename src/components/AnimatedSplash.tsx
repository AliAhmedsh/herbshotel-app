import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTENT_PADDING } from '../utils/layout';

const ASSET_READY_FALLBACK_MS = 2500;

type Props = {
  onReady?: () => void;
};

export function AnimatedSplash({ onReady }: Props) {
  const insets = useSafeAreaInsets();
  const bgReady = useRef(false);
  const gifReady = useRef(false);
  const notified = useRef(false);

  const notifyReady = () => {
    if (notified.current) return;
    if (!bgReady.current || !gifReady.current) return;
    notified.current = true;
    onReady?.();
  };

  // Native splash sits above React until hidden — reveal the GIF splash immediately.
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);

    const fallback = setTimeout(() => {
      bgReady.current = true;
      gifReady.current = true;
      notifyReady();
    }, ASSET_READY_FALLBACK_MS);

    return () => clearTimeout(fallback);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/splashbackground.png')}
        style={styles.background}
        resizeMode="cover"
        onLoadEnd={() => {
          bgReady.current = true;
          notifyReady();
        }}
      >
        <Image source={require('../../assets/rays.png')} style={styles.rays} contentFit="contain" />
        <Image source={require('../../assets/stars.png')} style={styles.stars} contentFit="contain" />
        <View style={[styles.center, { paddingTop: insets.top + 24 }]}>
          <Image
            source={require('../../assets/slot_machine.gif')}
            style={styles.slotMachine}
            contentFit="contain"
            autoplay
            onLoadEnd={() => {
              gifReady.current = true;
              notifyReady();
            }}
          />
        </View>
        <View
          style={[
            styles.footer,
            {
              bottom: insets.bottom + CONTENT_PADDING,
              paddingHorizontal: Math.max(CONTENT_PADDING, insets.left, insets.right),
            },
          ]}
        >
          <View style={styles.ageBadge}>
            <Text style={styles.ageText}>18+</Text>
          </View>
          <Text style={styles.footerText}>BE GAMBLE AWARE</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
    elevation: 1000,
    backgroundColor: '#1a4a9e',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  rays: {
    position: 'absolute',
    width: '130%',
    height: '58%',
    top: '16%',
    left: '-15%',
    opacity: 0.9,
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '28%',
    top: '8%',
    opacity: 0.85,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingBottom: 88,
  },
  slotMachine: {
    width: '98%',
    height: 400,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ageBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
