import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/constants/pricing';
import { EXPERIENCE_INCLUDED } from '@/constants/content';
import { useDbQuery } from '@/hooks/useDbQuery';
import type { Experience } from '@/hooks/useExperiences';
import Cta from '@/components/common/Cta';
import { ListSkeleton } from '@/components/common/Skeleton';
import { showUnderConstruction } from '@/lib/toast';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

const STATIC = [
  { title: 'Breathe & Surf, Weligama', location: 'Sri Lanka', price: '$95' },
  { title: 'Breathe & Surf, Selong Belanak', location: 'Lombok, Indonesia', price: '$120' },
  { title: 'Breathe & Surf, Nosara', location: 'Costa Rica', price: '$165' },
];

export default function ExperiencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { data: experiences, loading } = useDbQuery<Experience>(
    'experiences:list',
    `SELECT e.*, l.name as location_name FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.status = 'published' ORDER BY e.created_at DESC`,
  );

  const hasDbData = experiences.length > 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>EXPERIENCES</Text>
        <Text style={s.headline}>One day, one breath,{'\n'}one wave</Text>
        <Text style={s.body}>
          A single day. Breathwork, a guided surf, and a shared meal.
          The easiest way to feel what this is.
        </Text>
      </View>

      {loading ? (
        <View style={s.section}><ListSkeleton rows={3} /></View>
      ) : (
        <View style={s.section}>
          {(hasDbData ? experiences : []).map((e, i) => (
            <View key={e.id} style={[s.expItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
              <Text style={s.expTitle}>{e.title}</Text>
              <View style={s.expMeta}>
                <Text style={s.expLocation}>{e.location_name}</Text>
                <Text style={s.expPrice}>{formatPrice(e.price_cents)}</Text>
              </View>
              <View style={s.expActions}>
                <Cta title="View Details" variant="secondary" onPress={() => showUnderConstruction()} style={{ marginTop: 0 }} />
                <Cta title="Book Now" onPress={() => showUnderConstruction()} style={{ marginTop: 0 }} />
              </View>
            </View>
          ))}
          {!hasDbData && STATIC.map((e, i) => (
            <View key={i} style={[s.expItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
              <Text style={s.expTitle}>{e.title}</Text>
              <View style={s.expMeta}>
                <Text style={s.expLocation}>{e.location}</Text>
                <Text style={s.expPrice}>{e.price}</Text>
              </View>
              <Cta
                title={isAuthenticated ? "Book This Experience" : "Sign Up to Book"}
                onPress={() => isAuthenticated ? showUnderConstruction() : router.push('/auth/sign-up')}
                style={{ marginTop: 20 }}
              />
            </View>
          ))}
        </View>
      )}

      <View style={[s.section, { backgroundColor: C.cream }]}>
        <Text style={s.eyebrow}>EVERY EXPERIENCE INCLUDES</Text>
        <View style={{ marginTop: 20 }}>
          {EXPERIENCE_INCLUDED.map((item, i) => (
            <View key={i} style={s.featureRow}>
              <Ionicons name="checkmark" size={16} color={C.accent} style={{ marginTop: 3 }} />
              <Text style={s.featureText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={s.bottomCta}>
        <Text style={s.bottomCtaText}>Available at each location during season.</Text>
        {!isAuthenticated && (
          <Cta title="Create Account to Book" onPress={() => router.push('/auth/sign-up')} />
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 32, paddingBottom: 60, width: '100%', maxWidth: 880, alignSelf: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  headline: { fontSize: 40, fontWeight: '200', color: C.text, lineHeight: 50, letterSpacing: -0.5, marginBottom: 20 },
  body: { fontSize: 17, fontWeight: '400', lineHeight: 29, color: C.textLight, maxWidth: 560 },
  section: { paddingHorizontal: 32, paddingVertical: 48, width: '100%', maxWidth: 880, alignSelf: 'center' },

  expItem: { paddingVertical: 24 },
  expTitle: { fontSize: 20, fontWeight: '300', color: C.text, letterSpacing: 0.3, marginBottom: 6 },
  expMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expLocation: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase' },
  expPrice: { fontSize: 16, fontWeight: '400', color: C.text, letterSpacing: 1 },
  expActions: { flexDirection: 'row', gap: 12, marginTop: 20 },

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  featureText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  bottomCta: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32, width: '100%', maxWidth: 880, alignSelf: 'center' },
  bottomCtaText: { fontSize: 16, fontWeight: '300', color: C.textLight, marginBottom: 8, textAlign: 'center' },
});
