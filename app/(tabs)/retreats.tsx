import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { RETREAT_INCLUDED } from '@/constants/content';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function RetreatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>RETREATS</Text>
        <Text style={s.headline}>5 nights of{'\n'}transformation</Text>
        <Text style={s.body}>
          Daily breathwork. Daily surf. Nourishing meals and beachfront accommodations.
          A small group of 12 in the world's most beautiful coastlines.
        </Text>
      </View>

      {/* Sample retreats */}
      <View style={s.section}>
        {[
          { title: 'Winter Healing', location: 'Sri Lanka — South Coast', dates: 'Jan 15 – 20, 2027', price: '$1,800' },
          { title: 'Presence & Play', location: 'Lombok, Indonesia', dates: 'May 10 – 15, 2027', price: '$2,200' },
          { title: 'Ocean & Breath', location: 'Costa Rica — Pacific', dates: 'Feb 20 – 25, 2027', price: '$2,500' },
        ].map((r, i) => (
          <View key={i} style={[s.retreatItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}>
            <View style={s.retreatHeader}>
              <Text style={s.retreatTitle}>{r.title}</Text>
              <Text style={s.retreatPrice}>{r.price}</Text>
            </View>
            <Text style={s.retreatLocation}>{r.location}</Text>
            <Text style={s.retreatDates}>{r.dates}</Text>
          </View>
        ))}
      </View>

      {/* Included */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <Text style={s.eyebrow}>WHAT'S INCLUDED</Text>
        <View style={{ marginTop: 20 }}>
          {RETREAT_INCLUDED.map((item, i) => (
            <View key={i} style={s.includedRow}>
              <Text style={s.includedCheck}>—</Text>
              <Text style={s.includedText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={s.ctaSection}>
        <Text style={s.ctaText}>No surf experience needed.</Text>
        <TouchableOpacity
          style={s.ctaButton}
          onPress={() => isAuthenticated ? null : router.push('/auth/sign-up')}>
          <Text style={s.ctaButtonText}>{isAuthenticated ? 'Coming Soon' : 'Join Waitlist'}</Text>
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
  retreatItem: { paddingVertical: 28 },
  retreatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  retreatTitle: { fontSize: 22, fontWeight: '300', color: C.text, letterSpacing: 0.3 },
  retreatPrice: { fontSize: 16, fontWeight: '400', color: C.accent, letterSpacing: 1 },
  retreatLocation: { fontSize: 13, fontWeight: '500', letterSpacing: 2, color: C.accent, textTransform: 'uppercase', marginTop: 6 },
  retreatDates: { fontSize: 14, color: C.textLight, marginTop: 4 },

  includedRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  includedCheck: { fontSize: 14, color: C.accent, marginTop: 2 },
  includedText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  ctaSection: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  ctaText: { fontSize: 18, fontWeight: '300', color: C.textLight, marginBottom: 28, textAlign: 'center' },
  ctaButton: { borderWidth: 1, borderColor: C.text, paddingHorizontal: 36, paddingVertical: 14 },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.text, textTransform: 'uppercase' },
});
