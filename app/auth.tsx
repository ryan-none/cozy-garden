import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { RelativePathString, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const leafScale = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.spring(leafScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particle1, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(particle1, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(particle2, { toValue: 1, duration: 3500, useNativeDriver: true }),
        Animated.timing(particle2, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(particle3, { toValue: 1, duration: 2800, useNativeDriver: true }),
        Animated.timing(particle3, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => {
      router.replace('/auth' as RelativePathString);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const particle1TranslateY = particle1.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
  const particle1Opacity = particle1.interpolate({ inputRange: [0, 0.3, 0.8, 1], outputRange: [0, 1, 0.8, 0] });
  const particle2TranslateY = particle2.interpolate({ inputRange: [0, 1], outputRange: [0, -100] });
  const particle2Opacity = particle2.interpolate({ inputRange: [0, 0.3, 0.8, 1], outputRange: [0, 1, 0.6, 0] });
  const particle3TranslateY = particle3.interpolate({ inputRange: [0, 1], outputRange: [0, -140] });
  const particle3Opacity = particle3.interpolate({ inputRange: [0, 0.3, 0.8, 1], outputRange: [0, 1, 0.7, 0] });

  return (
    <LinearGradient colors={['#E8F5E3', '#C8E6D0', '#A8D4B8']} style={styles.container}>
      <View style={styles.particles}>
        <Animated.Text style={[styles.particle, { left: '28%', opacity: particle1Opacity, transform: [{ translateY: particle1TranslateY }] }]}>🍃</Animated.Text>
        <Animated.Text style={[styles.particle, { left: '55%', opacity: particle2Opacity, transform: [{ translateY: particle2TranslateY }] }]}>🌿</Animated.Text>
        <Animated.Text style={[styles.particle, { left: '70%', opacity: particle3Opacity, transform: [{ translateY: particle3TranslateY }] }]}>🍃</Animated.Text>
      </View>

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={styles.logoCircle}>
          <Animated.Text style={[styles.leafEmoji, { transform: [{ scale: leafScale }] }]}>🌱</Animated.Text>
        </View>
        <Text style={styles.logoText}>Cozy Garden</Text>
        <Text style={styles.logoSub}>Life</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        Grow. Harvest. Relax.
      </Animated.Text>

      <View style={styles.groundDeco}>
        <Text style={styles.groundEmoji}>🌼</Text>
        <Text style={styles.groundEmoji}>🌸</Text>
        <Text style={styles.groundEmoji}>🌻</Text>
        <Text style={styles.groundEmoji}>🌸</Text>
        <Text style={styles.groundEmoji}>🌼</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particles: {
    position: 'absolute',
    bottom: height * 0.35,
    width: '100%',
    height: 160,
  },
  particle: {
    position: 'absolute',
    fontSize: 24,
    bottom: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.glass,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  leafEmoji: {
    fontSize: 48,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.green600,
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.green500,
    letterSpacing: 6,
    marginTop: -6,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.green500,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  groundDeco: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 12,
  },
  groundEmoji: {
    fontSize: 28,
  },
});
