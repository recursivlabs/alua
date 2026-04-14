import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', accent: '#C4956A', cream: '#F0EBE4',
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.eyebrow}>ADMIN</Text>
        <Text style={s.headline}>Dashboard</Text>
        <Text style={s.body}>Signed in as {user?.email}</Text>
      </View>
      <View style={s.section}>
        <Text style={s.body}>
          Manage retreats, experiences, studio content, bookings, FAQs, pricing, and email templates from here. Full admin panel coming in the next update.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  header: { paddingHorizontal: 32, marginBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 12 },
  headline: { fontSize: 32, fontWeight: '200', color: C.text, letterSpacing: -0.5, marginBottom: 6 },
  body: { fontSize: 16, lineHeight: 28, color: C.textLight },
  section: { paddingHorizontal: 32 },
});
