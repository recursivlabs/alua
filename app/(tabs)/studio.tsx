import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function StudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>ONLINE STUDIO</Text>
        <Text style={s.headline}>Your practice,{'\n'}anywhere</Text>
        <Text style={s.body}>
          Live breathwork sessions, guided practices, and integration support.
          Continue your journey between retreats — or start one from home.
        </Text>
      </View>

      {/* Pricing */}
      <View style={[s.section, { backgroundColor: C.dark }]}>
        <View style={s.pricingRow}>
          <View style={s.priceOption}>
            <Text style={s.priceLabel}>Monthly</Text>
            <Text style={s.priceAmount}>$22</Text>
            <Text style={s.pricePer}>/ month</Text>
          </View>
          <View style={s.priceDivider} />
          <View style={s.priceOption}>
            <Text style={[s.priceLabel, { color: C.accent }]}>Annual — Save 32%</Text>
            <Text style={s.priceAmount}>$179</Text>
            <Text style={s.pricePer}>/ year</Text>
          </View>
        </View>
      </View>

      {/* What you get */}
      <View style={s.section}>
        <Text style={s.eyebrow}>WHAT'S INCLUDED</Text>
        <View style={{ marginTop: 20 }}>
          {[
            '2 live breathwork sessions per month',
            'Full library of recorded guided practices',
            'Breathwork for physical health & recovery',
            'Breathwork for mental clarity & presence',
            'Breathwork for surf performance',
            'New content added regularly',
            'Integration support between retreats',
          ].map((item, i) => (
            <View key={i} style={s.featureRow}>
              <Text style={s.featureDash}>—</Text>
              <Text style={s.featureText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={s.ctaSection}>
        <Text style={s.ctaQuote}>
          "Consistency matters more than intensity.{'\n'}Even 10 minutes a day transforms."
        </Text>
        <TouchableOpacity
          style={s.ctaButton}
          onPress={() => isAuthenticated ? null : router.push('/auth/sign-up')}>
          <Text style={s.ctaButtonText}>Start Your Practice</Text>
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

  pricingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, paddingVertical: 20 },
  priceOption: { alignItems: 'center' },
  priceLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#94A3AA', textTransform: 'uppercase', marginBottom: 8 },
  priceAmount: { fontSize: 40, fontWeight: '200', color: C.white, letterSpacing: -1 },
  pricePer: { fontSize: 13, color: '#94A3AA', marginTop: 4, letterSpacing: 1 },
  priceDivider: { width: 1, height: 60, backgroundColor: '#2D4A55' },

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  featureDash: { fontSize: 14, color: C.accent, marginTop: 2 },
  featureText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  ctaSection: { alignItems: 'center', paddingVertical: 80, paddingHorizontal: 32 },
  ctaQuote: { fontSize: 20, fontWeight: '300', fontStyle: 'italic', color: C.textLight, textAlign: 'center', lineHeight: 32, marginBottom: 36 },
  ctaButton: { backgroundColor: C.dark, paddingHorizontal: 48, paddingVertical: 16 },
  ctaButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 4, color: C.white, textTransform: 'uppercase' },
});
