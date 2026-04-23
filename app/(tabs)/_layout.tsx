import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { SideNav, MenuButton, useSidebarState } from '@/components/SideNav';

const C = {
  bg: '#FAF7F4', accent: '#C4956A', textMuted: '#A09890', border: '#E8E0D8',
};

const ADMIN_EMAILS = ['jack+alua@minds.com', 'jack@recursiv.io', 'tmkrause16@gmail.com'];

export default function TabLayout() {
  const { user } = useAuth();
  const isAdmin = ADMIN_EMAILS.includes(user?.email?.toLowerCase() || '');
  const isWeb = Platform.OS === 'web';
  const sidebar = useSidebarState();

  if (isWeb) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: C.bg }}>
        {/* Always-visible sidebar on wide desktop */}
        {sidebar.showSidebar && !sidebar.isOverlay && (
          <SideNav isOverlay={false} onClose={sidebar.close} />
        )}

        <View style={{ flex: 1 }}>
          {/* Menu button on mobile/narrow web */}
          {!sidebar.showSidebar && (
            <MenuButton onPress={sidebar.toggle} />
          )}

          {/* Overlay sidebar */}
          {sidebar.showSidebar && sidebar.isOverlay && (
            <SideNav isOverlay={true} onClose={sidebar.close} />
          )}

          <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
            <Tabs.Screen name="index" />
            <Tabs.Screen name="retreats" />
            <Tabs.Screen name="experiences" />
            <Tabs.Screen name="studio" />
            <Tabs.Screen name="about" />
            <Tabs.Screen name="faq" />
            <Tabs.Screen name="profile" />
            <Tabs.Screen name="admin" options={{ href: isAdmin ? undefined : null }} />
          </Tabs>
        </View>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.bg,
          borderTopColor: C.border,
          borderTopWidth: 0.5,
          height: 56,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '400', letterSpacing: 0.5 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Ionicons name="water-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="retreats" options={{ title: 'Retreats', tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="experiences" options={{ title: 'Experiences', tabBarIcon: ({ color }) => <Ionicons name="sunny-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="studio" options={{ title: 'Studio', tabBarIcon: ({ color }) => <Ionicons name="play-circle-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="faq" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} /> }} />
      <Tabs.Screen name="admin" options={{ href: isAdmin ? undefined : null, title: 'Admin', tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={22} color={color} /> }} />
    </Tabs>
  );
}
