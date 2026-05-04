import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Animated, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = (next: 'login' | 'signup') => {
    Animated.timing(slideAnim, { toValue: next === 'signup' ? 1 : 0, duration: 300, useNativeDriver: true }).start();
    setMode(next);
    setError('');
  };

  const handleAuth = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (!username) { setError('Please choose a username'); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').upsert({ id: data.user.id, username });
        }
      }
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient colors={['#EAF5E6', '#D0EBD6', '#BBDFCA']} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.emoji}>🌱</Text>
            <Text style={styles.title}>Cozy Garden Life</Text>
            <Text style={styles.subtitle}>
              {mode === 'login' ? 'Welcome back, gardener!' : 'Start your garden journey!'}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabRow}>
              <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => switchMode('login')}>
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => switchMode('signup')}>
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. GardenLover42"
                  placeholderTextColor={COLORS.textLight}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {error !== '' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.primaryBtn, loading && styles.btnDisabled]} onPress={handleAuth} disabled={loading}>
              <LinearGradient colors={['#5CAF60', '#3D9142']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGradient}>
                <Text style={styles.primaryBtnText}>{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.guestBtn} onPress={handleGuest}>
              <Text style={styles.guestBtnText}>🌿  Sign in Google</Text>
            </TouchableOpacity>

            {/* <Text style={styles.guestNote}>Your progress won't be saved as a guest</Text> */}
          </View>

          {/* <View style={styles.flowerRow}>
            <Text style={styles.flowerEmoji}>🌸</Text>
            <Text style={styles.flowerEmoji}>🌼</Text>
            <Text style={styles.flowerEmoji}>🌻</Text>
            <Text style={styles.flowerEmoji}>🌼</Text>
            <Text style={styles.flowerEmoji}>🌸</Text>
          </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: SPACING.base },
  header: { alignItems: 'center', marginBottom: SPACING.xxl },
  emoji: { fontSize: 52, marginBottom: SPACING.sm },
  title: { ...TYPOGRAPHY.title, color: COLORS.green600, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.body, color: COLORS.green500, textAlign: 'center' },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.lg,
  },
  tabRow: { flexDirection: 'row', backgroundColor: COLORS.beige100, borderRadius: RADIUS.xl, padding: 4, marginBottom: SPACING.lg },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: RADIUS.lg },
  tabActive: { backgroundColor: COLORS.white, ...SHADOWS.sm },
  tabText: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.green600, fontWeight: '700' },
  inputGroup: { marginBottom: SPACING.md },
  label: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.beige50,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
  },
  errorBox: { backgroundColor: '#FFE8E8', borderRadius: RADIUS.md, padding: SPACING.sm, marginBottom: SPACING.sm },
  errorText: { color: COLORS.error, ...TYPOGRAPHY.caption, textAlign: 'center' },
  primaryBtn: { borderRadius: RADIUS.xl, overflow: 'hidden', marginTop: SPACING.xs, ...SHADOWS.md },
  btnDisabled: { opacity: 0.6 },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  primaryBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.beige200 },
  dividerText: { ...TYPOGRAPHY.caption, color: COLORS.textLight, marginHorizontal: SPACING.sm },
  guestBtn: {
    borderRadius: RADIUS.xl,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: COLORS.beige100,
    borderWidth: 1.5,
    borderColor: COLORS.beige200,
  },
  guestBtnText: { color: COLORS.green600, fontWeight: '600', fontSize: 15 },
  guestNote: { ...TYPOGRAPHY.caption, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.sm },
//   flowerRow: { flexDirection: 'row', gap: 12, marginTop: SPACING.xxl },
  flowerEmoji: { fontSize: 26 },
});
