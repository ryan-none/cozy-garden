import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, RADIUS, SHADOWS } from '@/constants/theme';
import { PLANTS } from '@/lib/gameData';
import type { Plot } from '@/context/GameContext';

type Props = {
  plot: Plot;
  progress: number;
  onPress: () => void;
  size: number;
};

export default function GardenPlot({ plot, progress, onPress, size }: Props) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(plot.plantType ? 1 : 0.85)).current;
  const isReady = plot.growthStage === 3;
  const isEmpty = !plot.plantType;
  const plant = plot.plantType ? PLANTS[plot.plantType] : null;

  useEffect(() => {
    if (isReady) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [isReady]);

  useEffect(() => {
    if (plot.plantType && plot.growthStage > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(swayAnim, { toValue: -1, duration: 1800, useNativeDriver: true }),
          Animated.timing(swayAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [plot.plantType, plot.growthStage]);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: plot.plantType ? 1 : 0.85,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [plot.plantType]);

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.9] });
  const swayRotate = swayAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-6deg', '0deg', '6deg'] });

  const getEmoji = () => {
    if (!plant) return null;
    return plant.emoji[Math.min(plot.growthStage, plant.emoji.length - 1)];
  };

  const getEmojiSize = () => {
    if (plot.growthStage <= 1) return size * 0.32;
    if (plot.growthStage === 2) return size * 0.42;
    return size * 0.52;
  };

  const plotStyle = [
    styles.plot,
    { width: size, height: size },
    isEmpty ? styles.plotEmpty : styles.plotFilled,
    isReady && styles.plotReady,
  ];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.wrapper}>
      <Animated.View style={[...plotStyle, { transform: [{ scale: scaleAnim }] }]}>
        {isReady && (
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
        )}

        {isEmpty ? (
          <View style={styles.emptyContent}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
        ) : (
          <Animated.Text
            style={[
              styles.plantEmoji,
              { fontSize: getEmojiSize(), transform: [{ rotate: swayRotate }] },
            ]}
          >
            {getEmoji()}
          </Animated.Text>
        )}

        {!isEmpty && plot.growthStage < 3 && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        )}

        {isReady && (
          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { margin: 5 },
  plot: {
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
  },
  plotEmpty: {
    backgroundColor: COLORS.beige200,
    borderColor: COLORS.beige300,
    borderStyle: 'dashed',
  },
  plotFilled: {
    backgroundColor: COLORS.green50,
    borderColor: COLORS.green100,
    ...SHADOWS.sm,
  },
  plotReady: {
    backgroundColor: '#EEF8EE',
    borderColor: COLORS.green300,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#B8F0B8',
    borderRadius: RADIUS.xl,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 22,
    color: COLORS.brown300,
    fontWeight: '300',
    lineHeight: 26,
  },
  plantEmoji: {
    textAlign: 'center',
  },
  progressBar: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: COLORS.beige200,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.green400,
    borderRadius: RADIUS.full,
  },
  readyBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readyText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
