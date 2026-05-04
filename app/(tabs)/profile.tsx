import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Volume2, Music, Bell, Moon, Sun, Leaf } from 'lucide-react-native';
import { RelativePathString, router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useGame } from '@/context/GameContext';
import { COLORS, SPACING, RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';

const THEMES = [
  { id: 'spring', label: 'Spring', emoji: '🌸', colors: ['#EAF5E6', '#D0EBD6'] as const },
  { id: 'summer', label: 'Summer', emoji: '☀️', colors: ['#FFF8D6', '#FFEDB0'] as const },
  { id: 'autumn', label: 'Autumn', emoji: '🍂', colors: ['#F5EBD6', '#E8D5B0'] as const },
  { id: 'winter', label: 'Winter', emoji: '❄️', colors: ['#E8F0F8', '#D0E4F0'] as const },
];

export default function ProfileScreen() {
  const { state } = useGame();
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState('spring');

  const handleSignOut = async () => {
    if (state.isGuest) {
      router.replace('/auth' as RelativePathString);
      return;
    }
    await supabase.auth.signOut();
    router.replace('/auth' as RelativePathString);
  };

  const xpToNextLevel = 50;
  const currentXp = state.experience % xpToNextLevel;
  const xpProgress = currentXp / xpToNextLevel;

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#E8F0F8', '#D8EBF0', '#CCEAD8']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Profile card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>🧑‍🌾</Text>
            </View>
            <Text style={styles.username}>
              {state.isGuest ? 'Guest Gardener' : 'Gardener'}
            </Text>
            {state.isGuest && (
              <TouchableOpacity style={styles.signInPrompt} onPress={() => router.push('/auth' as RelativePathString)}>
                <Text style={styles.signInPromptText}>Sign in to save progress →</Text>
              </TouchableOpacity>
            )}

            <View style={styles.levelRow}>
              <Text style={styles.levelLabel}>Level {state.level}</Text>
              <Text style={styles.xpLabel}>{currentXp}/{xpToNextLevel} XP</Text>
            </View>
            <View style={styles.xpBarBg}>
              <View style={[styles.xpBarFill, { width: `${xpProgress * 100}%` as any }]} />
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🪙</Text>
                <Text style={styles.statValue}>{state.coins}</Text>
                <Text style={styles.statLabel}>Coins</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>💎</Text>
                <Text style={styles.statValue}>{state.gems}</Text>
                <Text style={styles.statLabel}>Gems</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🌾</Text>
                <Text style={styles.statValue}>{state.plots.reduce((s, p) => s + p.harvestedCount, 0)}</Text>
                <Text style={styles.statLabel}>Harvests</Text>
              </View>
            </View>
          </View>

          {/* Garden theme */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Garden Theme</Text>
            <View style={styles.themeGrid}>
              {THEMES.map((theme) => (
                <TouchableOpacity
                  key={theme.id}
                  style={[styles.themeCard, activeTheme === theme.id && styles.themeCardActive]}
                  onPress={() => setActiveTheme(theme.id)}
                >
                  <LinearGradient colors={theme.colors} style={styles.themeGrad}>
                    <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                    <Text style={[styles.themeLabel, activeTheme === theme.id && styles.themeLabelActive]}>
                      {theme.label}
                    </Text>
                  </LinearGradient>
                  {activeTheme === theme.id && (
                    <View style={styles.themeCheck}>
                      <Text style={styles.themeCheckMark}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings toggles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              <SettingRow
                icon={<Volume2 size={20} color={COLORS.green500} />}
                label="Sound Effects"
                value={soundOn}
                onToggle={setSoundOn}
              />
              <View style={styles.settingDivider} />
              <SettingRow
                icon={<Music size={20} color={COLORS.green500} />}
                label="Background Music"
                value={musicOn}
                onToggle={setMusicOn}
              />
              <View style={styles.settingDivider} />
              <SettingRow
                icon={<Bell size={20} color={COLORS.green500} />}
                label="Notifications"
                value={notifOn}
                onToggle={setNotifOn}
              />
              <View style={styles.settingDivider} />
              <SettingRow
                icon={<Moon size={20} color={COLORS.green500} />}
                label="Dark Mode"
                value={darkMode}
                onToggle={setDarkMode}
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.aboutCard}>
              <View style={styles.aboutRow}>
                <Leaf size={16} color={COLORS.green500} />
                <Text style={styles.aboutText}>Cozy Garden Life v1.0</Text>
              </View>
              <Text style={styles.aboutDesc}>
                A relaxing garden simulation game. Grow, harvest, and decorate your peaceful garden.
              </Text>
            </View>
          </View>

          {/* Sign out */}
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <LogOut size={18} color={COLORS.error} />
            <Text style={styles.signOutText}>{state.isGuest ? 'Exit Guest Mode' : 'Sign Out'}</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingRow({ icon, label, value, onToggle }: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconBox}>{icon}</View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.beige200, true: COLORS.green300 }}
        thumbColor={value ? COLORS.green500 : COLORS.white}
        ios_backgroundColor={COLORS.beige200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingTop: SPACING.md },
  profileCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.md,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.green100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 3,
    borderColor: COLORS.green200,
  },
  avatarEmoji: { fontSize: 38 },
  username: { ...TYPOGRAPHY.subheading, color: COLORS.text, marginBottom: 4 },
  signInPrompt: {
    backgroundColor: COLORS.green100,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.sm,
  },
  signInPromptText: { ...TYPOGRAPHY.caption, color: COLORS.green600, fontWeight: '600' },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  levelLabel: { ...TYPOGRAPHY.label, color: COLORS.green600, fontWeight: '700' },
  xpLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  xpBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.beige200,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.base,
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: COLORS.green400,
    borderRadius: RADIUS.full,
  },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statDivider: { width: 1, backgroundColor: COLORS.beige200 },
  statItem: { alignItems: 'center', gap: 4, flex: 1 },
  statEmoji: { fontSize: 22 },
  statValue: { ...TYPOGRAPHY.subheading, color: COLORS.text },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  section: { marginHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.label, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  themeGrid: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  themeCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.beige200,
    ...SHADOWS.sm,
    position: 'relative',
  },
  themeCardActive: { borderColor: COLORS.green400, borderWidth: 2.5 },
  themeGrad: { padding: SPACING.md, alignItems: 'center', gap: 4 },
  themeEmoji: { fontSize: 26 },
  themeLabel: { ...TYPOGRAPHY.label, color: COLORS.textSecondary },
  themeLabelActive: { color: COLORS.green600 },
  themeCheck: {
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
  themeCheckMark: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  settingsCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
  },
  settingDivider: { height: 1, backgroundColor: COLORS.beige100, marginHorizontal: SPACING.base },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  settingIconBox: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { ...TYPOGRAPHY.body, color: COLORS.text },
  aboutCard: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  aboutText: { ...TYPOGRAPHY.label, color: COLORS.text, fontWeight: '600' },
  aboutDesc: { ...TYPOGRAPHY.body, color: COLORS.textSecondary },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.xl,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.xl,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFD0D0',
    ...SHADOWS.sm,
  },
  signOutText: { ...TYPOGRAPHY.label, color: COLORS.error, fontWeight: '700' },
});
