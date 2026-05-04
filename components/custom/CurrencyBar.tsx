import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';

type Props = {
  coins: number;
  gems: number;
};

export default function CurrencyBar({ coins, gems }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.icon}>🪙</Text>
        <Text style={styles.value}>{coins.toLocaleString()}</Text>
      </View>
      <View style={[styles.pill, styles.gemPill]}>
        <Text style={styles.icon}>💎</Text>
        <Text style={[styles.value, styles.gemValue]}>{gems}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    gap: 5,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  gemPill: {
    backgroundColor: 'rgba(220,230,255,0.82)',
    borderColor: 'rgba(180,200,255,0.8)',
  },
  icon: { fontSize: 14 },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.brown500,
  },
  gemValue: {
    color: '#5A6DA8',
  },
});
