import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { EXPERIENCE_INCLUDED } from '@/constants/content';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function ExperiencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>EXPERIENCES</Text>
        <Text style={s.headline}>One day, one breath,{'\n'}one wave</Text>
        <Text style={s.body}>
          A single day woven together — breathwork, surf, and a shared meal.
          The perfect introduction to the Alua practice.
        </Text>
      </View>

      {/* Locations */}
      <View style={s.section}>
        {[
          { title: 'Breathe & Surf — Weligama', location: 'Sri Lanka', price: '$95' },
          { title: 'Breathe & Surf — Selong Belanak', location: 'Lombok, Indonesia', price: '$120' },
          { title: 'Breathe & Surf — Nosara', location: 'Costa Rica', price: '$165' },
        ].map((e, i) => (
          <View key={i} style={[s.expItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
            <Text style={s.expTitle}>{e.title}</Text>
            <View style={s.expMeta}>
              <Text style={s.expLocation}>{e.location}</Text>
              <Text style={s.expPrice}>{e.price}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Included */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <Text style={s.eyebrow}>EVERY EXPERIENCE INCLUDES</Text>
        <View style={{ marginTop: 20 }}>
          {EXPERIENCE_INCLUDED.map((item, i) => (
            <View key={i} style={s.featureRow}>
              <Text style={s.featureDash}>—</Text>
              <Text style={s.featureText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={s.ctaSection}>
        <Text style={s.ctaSub}>Available at each location during season.</Text>
        <TouchableOpacity
          style={s.ctaButton}
          onPress={() => isAuthenticated ? null : router.push('/auth/sign-up')}>
          <Text style={s.ctaButtonText}>{isAuthenticated ? 'Coming Soon' : 'Get Notified'}</Text>
        </TouchableOpacity>
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

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  featureDash: { fontSize: 14, color: C.accent, marginTop: 2 },
  featureText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  ctaSection: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  ctaSub: { fontSize: 16, fontWeight: '300', color: C.textLight, marginBottom: 28, textAlign: 'center' },
  ctaButton: { borderWidth: 1, borderColor: C.text, paddingHorizontal: 36, paddingVertical: 14 },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.text, textTransform: 'uppercase' },
});
