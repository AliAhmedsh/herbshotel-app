import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CONTENT_PADDING = 16;

/** Sticky footer bar height excluding safe-area bottom inset. */
export const STICKY_FOOTER_HEIGHT = 96;

export function useContentInsets() {
  const insets = useSafeAreaInsets();

  const horizontal = Math.max(CONTENT_PADDING, insets.left, insets.right);

  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    horizontal,
    listBottomPadding: STICKY_FOOTER_HEIGHT + insets.bottom + CONTENT_PADDING,
  };
}
