import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import { RETREAT_INCLUDED } from '@/constants/content';
import { useState, useEffect } from 'react';
import type { Retreat } from '@/hooks/useRetreats';
import Cta from '@/components/common/Cta';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

const STATIC_RETREATS = [
  { title: 'Winter Healing', location: 'Sri Lanka, South Coast', dates: 'Jan 15 - 20, 2027', price: '$1,800' },
  { title: 'Presence & Play', location: 'Lombok, Indonesia', dates: 'May 10 - 15, 2027', price: '$2,200' },
  { title: 'Ocean & Breath', location: 'Costa Rica, Pacific Coast', dates: 'Feb 20 - 25, 2027', price: '$2,500' },
];

export default function RetreatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const ctx = useRecursivSafe();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ctx?.sdk) return;
    setLoading(true);
    dbQuery<Retreat>(ctx.sdk, `SELECT r.*, l.name as location_name, l.country as location_country FROM retreats r LEFT JOIN locations l ON r.location_id = l.id WHERE r.status = 'published' ORDER BY r.start_date ASC`)
      .then(setRetreats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ctx?.sdk]);

  const hasDbData = retreats.length > 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>RETREATS</Text>
        <Text style={s.headline}>5 nights of{'\n'}transformation</Text>
        <Text style={s.body}>
          Daily breathwork. Daily surf. Nourishing meals and beachfront accommodations.
          A small group of 12 in the world's most beautiful coastlines.
        </Text>
        {!isAuthenticated && (
          <Cta title="Sign Up to Book" onPress={() => router.push('/auth/sign-up')} style={{ marginTop: 32 }} />
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={C.accent} />
      ) : (
        <View style={s.section}>
          {(hasDbData ? retreats : []).map((r, i) => {
            const start = new Date(r.start_date);
            const end = new Date(r.end_date);
            const dateStr = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            const spotsLeft = r.max_capacity - r.current_bookings;
            return (
              <View key={r.id} style={[s.retreatItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
                <TouchableOpacity onPress={() => router.push(`/retreat/${r.id}`)}>
                  <View style={s.retreatHeader}>
                    <Text style={s.retreatTitle}>{r.title}</Text>
                    <Text style={s.retreatPrice}>{formatPrice(r.price_cents)}</Text>
                  </View>
                  <Text style={s.retreatLocation}>{r.location_name}</Text>
                  <Text style={s.retreatDates}>{dateStr}</Text>
                  {spotsLeft <= 3 && spotsLeft > 0 && (
                    <Text style={s.spotsWarning}>{spotsLeft} spots remaining</Text>
                  )}
                </TouchableOpacity>
                <View style={s.retreatActions}>
                  <Cta title="View Details" variant="secondary" onPress={() => router.push(`/retreat/${r.id}`)} style={{ flex: 1, marginTop: 0 }} />
                  <Cta title="Book Now" onPress={() => router.push({ pathname: '/booking/checkout', params: { type: 'retreat', id: r.id } })} style={{ flex: 1, marginTop: 0 }} />
                </View>
              </View>
            );
          })}

          {!hasDbData && STATIC_RETREATS.map((r, i) => (
            <View key={i} style={[s.retreatItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
              <View style={s.retreatHeader}>
                <Text style={s.retreatTitle}>{r.title}</Text>
                <Text style={s.retreatPrice}>{r.price}</Text>
              </View>
              <Text style={s.retreatLocation}>{r.location}</Text>
              <Text style={s.retreatDates}>{r.dates}</Text>
              {!isAuthenticated && (
                <Cta title="Book This Retreat" onPress={() => router.push('/auth/sign-up')} style={{ marginTop: 20 }} />
              )}
            </View>
          ))}
        </View>
      )}

      <View style={[s.section, { backgroundColor: C.cream }]}>
        <Text style={s.eyebrow}>WHAT'S INCLUDED</Text>
        <View style={{ marginTop: 20 }}>
          {RETREAT_INCLUDED.map((item, i) => (
            <View key={i} style={s.includedRow}>
              <Ionicons name="checkmark" size={16} color={C.accent} style={{ marginTop: 3 }} />
              <Text style={s.includedText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={s.bottomCta}>
        <Text style={s.bottomCtaText}>No surf experience needed. All levels welcome.</Text>
        {isAuthenticated ? (
          <Cta title="Browse Retreats Above" variant="secondary" onPress={() => {}} />
        ) : (
          <Cta title="Create Account to Book" onPress={() => router.push('/auth/sign-up')} />
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 32, paddingBottom: 60 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  headline: { fontSize: 36, fontWeight: '200', color: C.text, lineHeight: 46, letterSpacing: -0.5, marginBottom: 20 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, maxWidth: 520 },
  section: { paddingHorizontal: 32, paddingVertical: 48 },

  retreatItem: { paddingVertical: 28 },
  retreatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  retreatTitle: { fontSize: 22, fontWeight: '300', color: C.text, letterSpacing: 0.3, flex: 1 },
  retreatPrice: { fontSize: 16, fontWeight: '400', color: C.accent, letterSpacing: 1 },
  retreatLocation: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginTop: 6 },
  retreatDates: { fontSize: 14, color: C.textLight, marginTop: 4 },
  spotsWarning: { fontSize: 13, fontWeight: '500', color: '#C45A4A', marginTop: 6 },
  retreatActions: { flexDirection: 'row', gap: 12, marginTop: 20 },

  includedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  includedText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  bottomCta: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  bottomCtaText: { fontSize: 16, fontWeight: '300', color: C.textLight, marginBottom: 8, textAlign: 'center' },
});
