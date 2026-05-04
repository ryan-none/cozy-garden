import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Leaf } from 'lucide-react-native';
import { useGame } from '@/context/GameContext';
import GardenPlot from '../../components/custom/GardenPlot';
import CurrencyBar from '../../components/custom/CurrencyBar';
import PlantPickerModal from '../../components/custom/PlantPickerModal';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import { PLANTS } from '@/lib/gameData';


const { width, height } = Dimensions.get('window');
const COLS = 3;
const PLOT_GAP = 10;
const PLOT_SIZE = Math.floor((Math.min(width, 500) - SPACING.xl * 2 - PLOT_GAP * (COLS + 1)) / COLS);

const CLOUDS = [
  { left: '5%', top: 24, delay: 0, duration: 18000 },
  { left: '40%', top: 14, delay: 4000, duration: 22000 },
  { left: '65%', top: 32, delay: 8000, duration: 20000 },
];

const DECORATION_EMOJIS = ['🦋', '🐝', '🐞'];

export default function GardenScreen() {
  const { state, plantSeed, harvestPlot, getPlotGrowthProgress, getInventoryCount } = useGame();
  const [selectedPlot, setSelectedPlot] = useState<number | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [harvestEffect, setHarvestEffect] = useState<{ plotIndex: number; coins: number } | null>(null);

  const cloud0Anim = useRef(new Animated.Value(0)).current;
  const cloud1Anim = useRef(new Animated.Value(0)).current;
  const cloud2Anim = useRef(new Animated.Value(0)).current;
  const cloudAnims = [cloud0Anim, cloud1Anim, cloud2Anim];
  const float0Anim = useRef(new Animated.Value(0)).current;
  const float1Anim = useRef(new Animated.Value(0)).current;
  const float2Anim = useRef(new Animated.Value(0)).current;
  const floatAnims = [float0Anim, float1Anim, float2Anim];
  const harvestAnim = useRef(new Animated.Value(0)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    CLOUDS.forEach((cloud, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(cloud.delay),
          Animated.timing(cloudAnims[i], { toValue: 1, duration: cloud.duration, useNativeDriver: true }),
          Animated.timing(cloudAnims[i], { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    });

    DECORATION_EMOJIS.forEach((_, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 1500),
          Animated.timing(floatAnims[i], { toValue: 1, duration: 2500, useNativeDriver: true }),
          Animated.timing(floatAnims[i], { toValue: 0, duration: 2500, useNativeDriver: true }),
        ])
      ).start();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(sunAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(sunAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePlotPress = (index: number) => {
    const plot = state.plots[index];
    if (!plot.plantType) {
      setSelectedPlot(index);
      setPickerVisible(true);
    } else if (plot.growthStage === 3) {
      const plant = PLANTS[plot.plantType];
      harvestPlot(index);
      setHarvestEffect({ plotIndex: index, coins: plant?.harvestCoins ?? 10 });
      harvestAnim.setValue(0);
      Animated.sequence([
        Animated.spring(harvestAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(harvestAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setHarvestEffect(null));
    }
  };

  const handlePlantSelect = (plantType: string) => {
    if (selectedPlot !== null) {
      plantSeed(selectedPlot, plantType);
      setPickerVisible(false);
      setSelectedPlot(null);
    }
  };

  const readyCount = state.plots.filter((p) => p.growthStage === 3).length;
  const sunScale = sunAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  const cloudTranslateXFn = (i: number) => cloudAnims[i].interpolate({ inputRange: [0, 1], outputRange: [-60, width + 60] });
  const floatTranslateY = (i: number) => floatAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#C5E8F5', '#D8EFF0', '#E8F5E8']} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />

      {/* Sky decorations */}
      <View style={styles.skyLayer} pointerEvents="none">
        <Animated.Text style={[styles.sun, { transform: [{ scale: sunScale }] }]}>☀️</Animated.Text>
        {CLOUDS.map((cloud, i) => (
          <Animated.Text
            key={i}
            style={[styles.cloud, { top: cloud.top, transform: [{ translateX: cloudTranslateXFn(i) }] }]}
          >☁️</Animated.Text>
        ))}
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>🌿 My Garden</Text>
            <Text style={styles.levelText}>Level {state.level} · {state.experience % 50}/50 XP</Text>
          </View>
          <CurrencyBar coins={state.coins} gems={state.gems} />
        </View>

        {/* XP Bar */}
        <View style={styles.xpBarContainer}>
          <View style={styles.xpBarBg}>
            <Animated.View style={[styles.xpBarFill, { width: `${(state.experience % 50) * 2}%` as any }]} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          bounces
        >
          {/* Ready to harvest banner */}
          {readyCount > 0 && (
            <View style={styles.harvestBanner}>
              <Sparkles size={16} color={COLORS.yellow500} />
              <Text style={styles.harvestBannerText}>
                {readyCount} {readyCount === 1 ? 'plant is' : 'plants are'} ready to harvest!
              </Text>
            </View>
          )}

          {/* Garden Ground */}
          <View style={styles.gardenArea}>
            {/* Ground gradient */}
            <LinearGradient
              colors={['#C8A87A', '#B8956A', '#A07850']}
              style={styles.groundGradient}
            />

            {/* Grass strip */}
            <View style={styles.grassStrip}>
              {Array.from({ length: 14 }).map((_, i) => (
                <Text key={i} style={styles.grassBlade}>🌿</Text>
              ))}
            </View>

            {/* Floating decorations */}
            {DECORATION_EMOJIS.map((emoji, i) => (
              <Animated.Text
                key={i}
                style={[
                  styles.deco,
                  {
                    left: `${20 + i * 28}%`,
                    transform: [{ translateY: floatTranslateY(i) }],
                  },
                ]}
                pointerEvents="none"
              >
                {emoji}
              </Animated.Text>
            ))}

            {/* Plot grid */}
            <View style={styles.plotGrid}>
              {state.plots.map((plot, i) => (
                <GardenPlot
                  key={i}
                  plot={plot}
                  progress={getPlotGrowthProgress(plot)}
                  onPress={() => handlePlotPress(i)}
                  size={PLOT_SIZE}
                />
              ))}
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🌱</Text>
              <Text style={styles.statValue}>{state.plots.filter((p) => p.plantType && p.growthStage < 3).length}</Text>
              <Text style={styles.statLabel}>Growing</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>✨</Text>
              <Text style={styles.statValue}>{state.plots.filter((p) => p.growthStage === 3).length}</Text>
              <Text style={styles.statLabel}>Ready</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🧺</Text>
              <Text style={styles.statValue}>{state.plots.reduce((sum, p) => sum + p.harvestedCount, 0)}</Text>
              <Text style={styles.statLabel}>Harvested</Text>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipCard}>
            <Leaf size={16} color={COLORS.green500} />
            <Text style={styles.tipText}>
              Tap an empty plot to plant · Tap a glowing plant to harvest
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Harvest popup */}
      {harvestEffect && (
        <Animated.View
          style={[
            styles.harvestPopup,
            {
              opacity: harvestAnim,
              transform: [
                { translateY: harvestAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -20] }) },
                { scale: harvestAnim },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.harvestPopupText}>+{harvestEffect.coins} 🪙</Text>
        </Animated.View>
      )}

      <PlantPickerModal
        visible={pickerVisible}
        onClose={() => { setPickerVisible(false); setSelectedPlot(null); }}
        onSelect={handlePlantSelect}
        getInventoryCount={getInventoryCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skyLayer: { position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.35 },
  sun: { position: 'absolute', top: 60, right: 30, fontSize: 36 },
  cloud: { position: 'absolute', fontSize: 32 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  greeting: { ...TYPOGRAPHY.heading, color: COLORS.green600 },
  levelText: { ...TYPOGRAPHY.caption, color: COLORS.green500, marginTop: 2 },
  xpBarContainer: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  xpBarBg: {
    height: 5,
    backgroundColor: COLORS.green100,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.green400,
    borderRadius: RADIUS.full,
  },
  scroll: { paddingTop: SPACING.sm },
  harvestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.yellow100,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.yellow400,
  },
  harvestBannerText: { ...TYPOGRAPHY.caption, color: COLORS.brown500, fontWeight: '600', flex: 1 },
  gardenArea: {
    marginHorizontal: SPACING.xl,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.lg,
    backgroundColor: COLORS.brown400,
  },
  groundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  grassStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
    backgroundColor: 'rgba(80,140,60,0.4)',
  },
  grassBlade: { fontSize: 12 },
  deco: {
    position: 'absolute',
    top: 16,
    fontSize: 18,
    zIndex: 2,
  },
  plotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.base,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  statEmoji: { fontSize: 22 },
  statValue: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  statLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    backgroundColor: COLORS.green50,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.green100,
  },
  tipText: { ...TYPOGRAPHY.caption, color: COLORS.green600, flex: 1 },
  harvestPopup: {
    position: 'absolute',
    top: '45%',
    alignSelf: 'center',
    backgroundColor: COLORS.yellow100,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.yellow400,
    ...SHADOWS.md,
  },
  harvestPopupText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.brown500,
  },
});
