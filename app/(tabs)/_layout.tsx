import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Hop as Home, ShoppingBag, Package, User } from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS } from '@/constants/theme';

type TabBarIconProps = {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
};

function TabIcon({ icon, label, focused }: TabBarIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      {icon}
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Home size={22} color={focused ? COLORS.green500 : COLORS.textLight} strokeWidth={focused ? 2.5 : 2} />}
              label="Garden"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<ShoppingBag size={22} color={focused ? COLORS.green500 : COLORS.textLight} strokeWidth={focused ? 2.5 : 2} />}
              label="Shop"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Package size={22} color={focused ? COLORS.green500 : COLORS.textLight} strokeWidth={focused ? 2.5 : 2} />}
              label="Items"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<User size={22} color={focused ? COLORS.green500 : COLORS.textLight} strokeWidth={focused ? 2.5 : 2} />}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 0,
    ...SHADOWS.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    paddingBottom: 0,
    paddingTop: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.xl,
    gap: 2,
    minWidth: 64,
  },
  tabItemActive: {
    backgroundColor: COLORS.green50,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textLight,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: COLORS.green500,
  },
});
