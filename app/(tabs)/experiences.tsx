import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import { EXPERIENCE_INCLUDED } from '@/constants/content';
import { useState, useEffect } from 'react';
import type { Experience } from '@/hooks/useExperiences';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function ExperiencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const ctx = useRecursivSafe();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ctx?.sdk) return;
    setLoading(true);
    dbQuery<Experience>(ctx.sdk, `SELECT e.*, l.name as location_name FROM experiences e LEFT JOIN locations l ON e.location_id = l.id WHERE e.status = 'published' ORDER BY e.created_at DESC`)
      .then(setExperiences)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ctx?.sdk]);

  const hasDbData = experiences.length > 0;

  const STATIC = [
    { title: 'Breathe & Surf, Weligama', location: 'Sri Lanka', price: '$95' },
    { title: 'Breathe & Surf, Selong Belanak', location: 'Lombok, Indonesia', price: '$120' },
    { title: 'Breathe & Surf, Nosara', location: 'Costa Rica', price: '$165' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>EXPERIENCES</Text>
        <Text style={s.headline}>One day, one breath,{'\n'}one wave</Text>
        <Text style={s.body}>
          A single day woven together. Breathwork, surf, and a shared meal.
          The perfect introduction to the Alua practice.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={C.accent} />
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
                <TouchableOpacity style={s.viewBtn} onPress={() => router.push(`/experience/${e.id}`)}>
                  <Text style={s.viewBtnText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.bookBtn} onPress={() => router.push({ pathname: '/booking/checkout', params: { type: 'experience', id: e.id } })}>
                  <Text style={s.bookBtnText}>Book Now</Text>
                </TouchableOpacity>
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
            </View>
          ))}
          {!isAuthenticated && (
            <TouchableOpacity style={s.signupPrompt} onPress={() => router.push('/auth/sign-up')}>
              <Ionicons name="person-add-outline" size={16} color={C.accent} />
              <Text style={s.signupText}>Sign up to book experiences</Text>
            </TouchableOpacity>
          )}
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 32, paddingBottom: 60 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  headline: { fontSize: 36, fontWeight: '200', color: C.text, lineHeight: 46, letterSpacing: -0.5, marginBottom: 20 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, maxWidth: 520 },
  section: { paddingHorizontal: 32, paddingVertical: 48 },
  expItem: { paddingVertical: 24 },
  expTitle: { fontSize: 20, fontWeight: '300', color: C.text, letterSpacing: 0.3, marginBottom: 6 },
  expMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expLocation: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase' },
  expPrice: { fontSize: 16, fontWeight: '400', color: C.text, letterSpacing: 1 },
  signupPrompt: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 20, marginTop: 16, borderTopWidth: 1, borderTopColor: C.border },
  signupText: { fontSize: 14, color: C.accent, fontWeight: '400' },
  expActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  viewBtn: { borderWidth: 1, borderColor: C.border, paddingHorizontal: 20, paddingVertical: 10 },
  viewBtnText: { fontSize: 11, fontWeight: '500', letterSpacing: 2, color: C.text, textTransform: 'uppercase' },
  bookBtn: { backgroundColor: C.dark, paddingHorizontal: 20, paddingVertical: 10 },
  bookBtnText: { fontSize: 11, fontWeight: '500', letterSpacing: 2, color: C.white, textTransform: 'uppercase' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  featureText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },
});
