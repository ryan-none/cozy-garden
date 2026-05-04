import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import { PLANTS } from '@/lib/gameData';
import { X } from 'lucide-react-native';

const { height } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (plantType: string) => void;
  getInventoryCount: (itemId: string) => number;
};

export default function PlantPickerModal({ visible, onClose, onSelect, getInventoryCount }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(bgAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const bgOpacity = bgAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: bgOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Choose a Seed</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {Object.values(PLANTS).map((plant) => {
            const count = getInventoryCount(`seed_${plant.id}`);
            const hasSeeds = count > 0;
            return (
              <TouchableOpacity
                key={plant.id}
                style={[styles.plantOption, !hasSeeds && styles.plantOptionDisabled]}
                onPress={() => hasSeeds && onSelect(plant.id)}
                activeOpacity={hasSeeds ? 0.75 : 1}
              >
                <Text style={styles.plantEmoji}>{plant.emoji[plant.emoji.length - 1]}</Text>
                <Text style={[styles.plantName, !hasSeeds && styles.disabledText]}>{plant.name}</Text>
                <View style={[styles.countBadge, !hasSeeds && styles.countBadgeEmpty]}>
                  <Text style={[styles.countText, !hasSeeds && styles.countTextEmpty]}>
                    {hasSeeds ? `x${count}` : 'None'}
                  </Text>
                </View>
                <View style={styles.rewardRow}>
                  <Text style={styles.rewardText}>🪙 +{plant.harvestCoins}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    paddingBottom: 40,
    maxHeight: height * 0.7,
    ...SHADOWS.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.beige300,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.base,
  },
  sheetTitle: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.beige100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.base,
    gap: SPACING.sm,
  },
  plantOption: {
    width: '47%',
    backgroundColor: COLORS.beige50,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
    gap: 4,
  },
  plantOptionDisabled: {
    opacity: 0.45,
    backgroundColor: COLORS.beige100,
  },
  plantEmoji: { fontSize: 36, marginBottom: 2 },
  plantName: { ...TYPOGRAPHY.label, color: COLORS.text, fontWeight: '600' },
  disabledText: { color: COLORS.textLight },
  countBadge: {
    backgroundColor: COLORS.green100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  countBadgeEmpty: { backgroundColor: COLORS.beige200 },
  countText: { fontSize: 11, fontWeight: '700', color: COLORS.green600 },
  countTextEmpty: { color: COLORS.textLight },
  rewardRow: { marginTop: 2 },
  rewardText: { fontSize: 11, color: COLORS.brown400, fontWeight: '500' },
});
