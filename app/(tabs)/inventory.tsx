import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { SHOP_ITEMS, PLANTS, RARITY_COLORS } from '@/lib/gameData';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'decorations', label: 'Decor' },
  { id: 'themes', label: 'Themes' },
  { id: 'pets', label: 'Pets' },
] as const;

type FilterTab = typeof FILTER_TABS[number]['id'];

const getItemMeta = (itemId: string) => {
  return SHOP_ITEMS.find((i) => i.id === itemId) ?? null;
};

export default function InventoryScreen() {
  const { state } = useGame();
  const [filter, setFilter] = useState<FilterTab>('all');

  const filtered = state.inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.item_type === filter;
  });

  const grouped = {
    seeds: filtered.filter((i) => i.item_type === 'seeds'),
    decorations: filtered.filter((i) => i.item_type === 'decorations'),
    themes: filtered.filter((i) => i.item_type === 'themes'),
    pets: filtered.filter((i) => i.item_type === 'pets'),
  };

  const renderItem = (item: typeof state.inventory[number]) => {
    const meta = getItemMeta(item.item_id);
    if (!meta) return null;
    return (
      <View key={item.item_id} style={styles.card}>
        <View style={[styles.rarityStripe, { backgroundColor: RARITY_COLORS[meta.rarity] }]} />
        <Text style={styles.itemEmoji}>{meta.emoji}</Text>
        <Text style={styles.itemName}>{meta.name}</Text>
        <Text style={styles.itemDesc} numberOfLines={2}>{meta.description}</Text>
        {item.quantity > 1 && (
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyText}>x{item.quantity}</Text>
          </View>
        )}
      </View>
    );
  };

  const totalItems = state.inventory.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#F0F7EE', '#E4F0E0', '#D4E8D0']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>My Inventory</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalItems} items</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterTab, filter === tab.id && styles.filterTabActive]}
              onPress={() => setFilter(tab.id)}
            >
              <Text style={[styles.filterLabel, filter === tab.id && styles.filterLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎒</Text>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptyDesc}>Visit the shop to get seeds and decorations!</Text>
            </View>
          ) : (
            <>
              {filter === 'all' ? (
                <>
                  {(['seeds', 'decorations', 'themes', 'pets'] as const).map((type) => {
                    const items = grouped[type];
                    if (items.length === 0) return null;
                    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
                    return (
                      <View key={type} style={styles.section}>
                        <Text style={styles.sectionTitle}>
                          {type === 'seeds' ? '🌱' : type === 'decorations' ? '⛲' : type === 'themes' ? '🎨' : '🐾'} {typeLabel}
                        </Text>
                        <View style={styles.grid}>
                          {items.map(renderItem)}
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View style={styles.grid}>
                  {filtered.map(renderItem)}
                </View>
              )}
            </>
          )}

          {/* Harvest summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Garden Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🧺</Text>
                <Text style={styles.summaryValue}>{state.plots.reduce((s, p) => s + p.harvestedCount, 0)}</Text>
                <Text style={styles.summaryLabel}>Total Harvests</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>⭐</Text>
                <Text style={styles.summaryValue}>Lv {state.level}</Text>
                <Text style={styles.summaryLabel}>Your Level</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryEmoji}>🪙</Text>
                <Text style={styles.summaryValue}>{state.coins}</Text>
                <Text style={styles.summaryLabel}>Coins</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: { ...TYPOGRAPHY.heading, color: COLORS.green600 },
  countBadge: {
    backgroundColor: COLORS.green100,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.green200,
  },
  countText: { ...TYPOGRAPHY.label, color: COLORS.green600 },
  filterRow: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md, gap: SPACING.sm },
  filterTab: {
    paddingHorizontal: SPACING.base,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.beige100,
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
  },
  filterTabActive: {
    backgroundColor: COLORS.green500,
    borderColor: COLORS.green500,
  },
  filterLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  filterLabelActive: { color: COLORS.white },
  scroll: { paddingHorizontal: SPACING.base },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, marginBottom: SPACING.sm, paddingLeft: SPACING.xs },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  card: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
    overflow: 'hidden',
    gap: 4,
    position: 'relative',
  },
  rarityStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  itemEmoji: { fontSize: 38, marginTop: 6 },
  itemName: { ...TYPOGRAPHY.label, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  itemDesc: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 16 },
  qtyBadge: {
    backgroundColor: COLORS.green100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginTop: 2,
  },
  qtyText: { fontSize: 11, fontWeight: '700', color: COLORS.green600 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  emptyDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary, textAlign: 'center' },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  summaryTitle: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, marginBottom: SPACING.md, textAlign: 'center' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', gap: 4 },
  summaryEmoji: { fontSize: 26 },
  summaryValue: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  summaryLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
});
