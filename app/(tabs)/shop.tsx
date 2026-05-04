import { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { useGame } from '@/context/GameContext';
import CurrencyBar from '../../components/custom/CurrencyBar';
import { SHOP_ITEMS, RARITY_COLORS, ShopItem } from '@/lib/gameData';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';

const CATEGORIES = [
  { id: 'seeds', label: 'Seeds', emoji: '🌱' },
  { id: 'decorations', label: 'Decor', emoji: '⛲' },
  { id: 'themes', label: 'Themes', emoji: '🎨' },
  { id: 'pets', label: 'Pets', emoji: '🐰' },
] as const;

type Category = typeof CATEGORIES[number]['id'];

export default function ShopScreen() {
  const { state, purchaseItem, getInventoryCount } = useGame();
  const [activeCategory, setActiveCategory] = useState<Category>('seeds');
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);
  const [successItem, setSuccessItem] = useState<ShopItem | null>(null);
  const successAnim = useRef(new Animated.Value(0)).current;

  const filteredItems = SHOP_ITEMS.filter((item) => item.category === activeCategory);

  const handleBuy = (item: ShopItem) => {
    const costCoins = item.costCoins ?? 0;
    const costGems = item.costGems ?? 0;
    if (costCoins > state.coins || costGems > state.gems) return;
    setConfirmItem(item);
  };

  const confirmPurchase = () => {
    if (!confirmItem) return;
    const success = purchaseItem(
      confirmItem.id,
      confirmItem.category,
      confirmItem.costCoins ?? 0,
      confirmItem.costGems ?? 0
    );
    setConfirmItem(null);
    if (success) {
      setSuccessItem(confirmItem);
      successAnim.setValue(0);
      Animated.sequence([
        Animated.spring(successAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setSuccessItem(null));
    }
  };

  const canAfford = (item: ShopItem) => {
    if (item.costCoins && item.costCoins > state.coins) return false;
    if (item.costGems && item.costGems > state.gems) return false;
    return true;
  };

  const owned = (item: ShopItem) => getInventoryCount(item.id) > 0;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#E8F5E3', '#D0EBD6', '#BBDFCA']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Garden Shop</Text>
            <Text style={styles.subtitle}>Beautify your world 🌸</Text>
          </View>
          <CurrencyBar coins={state.coins} gems={state.gems} />
        </View>

        {/* Category tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catTab, activeCategory === cat.id && styles.catTabActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, activeCategory === cat.id && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
          {filteredItems.map((item) => {
            const isOwned = owned(item);
            const affordable = canAfford(item);
            return (
              <View key={item.id} style={[styles.card, !affordable && !isOwned && styles.cardDim]}>
                {item.isNew && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </View>
                )}
                {isOwned && (
                  <View style={styles.ownedBadge}>
                    <CheckCircle size={14} color={COLORS.green500} />
                  </View>
                )}

                <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>

                <TouchableOpacity
                  style={[
                    styles.buyBtn,
                    isOwned && styles.ownedBtn,
                    !affordable && !isOwned && styles.cantAffordBtn,
                  ]}
                  onPress={() => !isOwned && handleBuy(item)}
                  activeOpacity={isOwned ? 1 : 0.75}
                >
                  {isOwned ? (
                    <Text style={styles.ownedBtnText}>Owned</Text>
                  ) : (
                    <Text style={[styles.buyBtnText, !affordable && styles.cantAffordText]}>
                      {item.costGems ? `💎 ${item.costGems}` : `🪙 ${item.costCoins}`}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Confirm modal */}
      <Modal visible={!!confirmItem} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmEmoji}>{confirmItem?.emoji}</Text>
            <Text style={styles.confirmTitle}>Buy {confirmItem?.name}?</Text>
            <Text style={styles.confirmDesc}>{confirmItem?.description}</Text>
            <Text style={styles.confirmCost}>
              Cost: {confirmItem?.costGems ? `💎 ${confirmItem.costGems} gems` : `🪙 ${confirmItem?.costCoins} coins`}
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setConfirmItem(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmPurchase}>
                <LinearGradient colors={['#5CAF60', '#3D9142']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.confirmBtnGrad}>
                  <Text style={styles.confirmBtnText}>Buy Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success popup */}
      {successItem && (
        <Animated.View
          style={[styles.successPopup, { opacity: successAnim, transform: [{ scale: successAnim }] }]}
          pointerEvents="none"
        >
          <Text style={styles.successEmoji}>{successItem.emoji}</Text>
          <Text style={styles.successText}>Added to inventory!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  title: { ...TYPOGRAPHY.heading, color: COLORS.green600 },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.green500, marginTop: 2 },
  catScroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md, gap: SPACING.sm },
  catTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.beige100,
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
  },
  catTabActive: {
    backgroundColor: COLORS.green500,
    borderColor: COLORS.green500,
  },
  catEmoji: { fontSize: 15 },
  catLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  catLabelActive: { color: COLORS.white },
  grid: {
    paddingHorizontal: SPACING.base,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
    position: 'relative',
    overflow: 'hidden',
    gap: 4,
  },
  cardDim: { opacity: 0.65 },
  rarityDot: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.yellow400,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  newBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.brown500 },
  ownedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  itemEmoji: { fontSize: 42, marginTop: SPACING.xs },
  itemName: { ...TYPOGRAPHY.label, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  itemDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 16 },
  buyBtn: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.base,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.green100,
    borderWidth: 1.5,
    borderColor: COLORS.green200,
  },
  ownedBtn: { backgroundColor: COLORS.beige100, borderColor: COLORS.beige200 },
  cantAffordBtn: { backgroundColor: COLORS.beige100, borderColor: COLORS.beige200 },
  buyBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.green600 },
  ownedBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  cantAffordText: { color: COLORS.textLight },
  modalBg: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  confirmCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: SPACING.sm,
    ...SHADOWS.lg,
  },
  confirmEmoji: { fontSize: 52 },
  confirmTitle: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  confirmDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center' },
  confirmCost: { ...TYPOGRAPHY.label, color: COLORS.brown500, fontWeight: '700' },
  confirmBtns: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, width: '100%' },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.beige100,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
  },
  cancelBtnText: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, fontWeight: '600' },
  confirmBtn: { flex: 1, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOWS.md },
  confirmBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  confirmBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  successPopup: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: COLORS.green50,
    borderRadius: RADIUS.xxl,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: COLORS.green200,
    ...SHADOWS.lg,
  },
  successEmoji: { fontSize: 36 },
  successText: { ...TYPOGRAPHY.label, color: COLORS.green600, fontWeight: '700' },
});
