import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const ctx = useRecursivSafe();
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ctx?.sdk) { setLoading(false); return; }
    Promise.all([
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM retreats`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM experiences`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM bookings`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM guest_profiles`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM studio_subscriptions WHERE status = 'active'`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM mailing_list`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM faqs WHERE published = true`),
      dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM locations`),
    ]).then(([retreats, experiences, bookings, guests, subscribers, mailing, faqs, locations]) => {
      setStats({
        retreats: retreats[0]?.count || 0,
        experiences: experiences[0]?.count || 0,
        bookings: bookings[0]?.count || 0,
        guests: guests[0]?.count || 0,
        subscribers: subscribers[0]?.count || 0,
        mailing: mailing[0]?.count || 0,
        faqs: faqs[0]?.count || 0,
        locations: locations[0]?.count || 0,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [ctx?.sdk]);

  const statItems = [
    { label: 'Locations', value: stats.locations, icon: 'earth-outline' as const },
    { label: 'Retreats', value: stats.retreats, icon: 'compass-outline' as const },
    { label: 'Experiences', value: stats.experiences, icon: 'sunny-outline' as const },
    { label: 'Bookings', value: stats.bookings, icon: 'receipt-outline' as const },
    { label: 'Guest Profiles', value: stats.guests, icon: 'people-outline' as const },
    { label: 'Studio Subscribers', value: stats.subscribers, icon: 'play-circle-outline' as const },
    { label: 'Mailing List', value: stats.mailing, icon: 'mail-outline' as const },
    { label: 'FAQs Published', value: stats.faqs, icon: 'help-circle-outline' as const },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.eyebrow}>ADMIN</Text>
        <Text style={s.headline}>Dashboard</Text>
        <Text style={s.body}>Signed in as {user?.email}</Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={C.accent} />
      ) : (
        <View style={s.statsGrid}>
          {statItems.map((item) => (
            <View key={item.label} style={s.statCard}>
              <View style={s.statHeader}>
                <Ionicons name={item.icon} size={18} color={C.accent} />
                <Text style={s.statValue}>{item.value ?? 0}</Text>
              </View>
              <Text style={s.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={s.section}>
        <Text style={s.sectionTitle}>Management</Text>
        <Text style={s.body}>
          Full CRUD for retreats, experiences, studio content, bookings, FAQs, pricing, and email templates is available through the Recursiv dashboard. In-app admin management coming in the next update.
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
  section: { paddingHorizontal: 32, marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '300', color: C.text, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 8 },
  statCard: { padding: 16, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, minWidth: 150, flex: 1 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '200', color: C.text },
  statLabel: { fontSize: 12, fontWeight: '500', letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase' },
});
