import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { SITE_LOGO_URL, colors } from '../utils/theme';

type Props = {
  contentPadding: number;
};

export function SiteHeader({ contentPadding }: Props) {
  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: -contentPadding,
          paddingHorizontal: contentPadding,
        },
      ]}
    >
      <Image source={{ uri: SITE_LOGO_URL }} style={styles.logo} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.headerBg,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 200,
    height: 40,
  },
});
