import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

type Props = {
  rating: number;
  max?: number;
  size?: number;
};

export function StarRating({ rating, max = 5, size = 14 }: Props) {
  const filled = Math.round(rating);

  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, index) => (
        <Text
          key={index}
          style={[styles.star, { fontSize: size }, index < filled && styles.starFilled]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 1,
  },
  star: {
    color: '#4b5563',
  },
  starFilled: {
    color: colors.gold,
  },
});
