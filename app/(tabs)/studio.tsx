import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useDbQuery } from '@/hooks/useDbQuery';
import type { StudioContent } from '@/hooks/useStudioContent';
import Cta from '@/components/common/Cta';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function StudioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { data: recordings, loading } = useDbQuery<StudioContent>(
    'studio:recorded',
    `SELECT * FROM studio_content WHERE published = true AND content_type = 'recorded' ORDER BY sort_order ASC`,
  );
  const { data: liveItems } = useDbQuery<StudioContent>(
    'studio:live',
    `SELECT * FROM studio_content WHERE published = true AND content_type = 'live' ORDER BY scheduled_at ASC`,
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>ONLINE STUDIO</Text>
        <Text style={s.headline}>Your practice,{'\n'}anywhere</Text>
        <Text style={s.body}>
          Live breathwork sessions and a library of guided practices.
          Keep the breath going between retreats, or start from home.
        </Text>
      </View>

      {/* Coming soon */}
      <View style={[s.section, { backgroundColor: C.dark, alignItems: 'center' }]}>
        <Text style={s.comingTag}>OPENING SOON</Text>
        <Text style={s.comingTitle}>Coming soon</Text>
        <Text style={s.comingSub}>
          Live breathwork sessions and a full library of guided practices are on the way.
          We will let you know the moment it opens.
        </Text>
        {!isAuthenticated && (
          <Cta
            title="Create an account"
            variant="secondary"
            onPress={() => router.push('/auth/sign-up')}
            style={{ alignSelf: 'center', marginTop: 24 }}
          />
        )}
      </View>

      {/* What you get */}
      <View style={s.section}>
        <Text style={s.eyebrow}>WHAT'S COMING</Text>
        <View style={{ marginTop: 20 }}>
          {[
            '2 live breathwork sessions per month',
            'Full library of recorded guided practices',
            'Breathwork for physical health and recovery',
            'Breathwork for mental clarity and presence',
            'Breathwork for surf performance',
            'New content added regularly',
            'Integration support between retreats',
          ].map((item, i) => (
            <View key={i} style={s.featureRow}>
              <Ionicons name="checkmark" size={16} color={C.accent} style={{ marginTop: 3 }} />
              <Text style={s.featureText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Live Schedule */}
      {liveItems.length > 0 && (
        <View style={[s.section, { backgroundColor: C.cream }]}>
          <Text style={s.eyebrow}>UPCOMING LIVE SESSIONS</Text>
          {liveItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.sessionItem}
              onPress={() => item.external_link ? Linking.openURL(item.external_link) : router.push(`/studio/${item.id}`)}>
              <View style={s.sessionHeader}>
                <View style={s.liveBadge}>
                  <Text style={s.liveBadgeText}>LIVE</Text>
                </View>
                <Text style={s.sessionDuration}>{item.duration_minutes} min</Text>
              </View>
              <Text style={s.sessionTitle}>{item.title}</Text>
              {item.scheduled_at && (
                <Text style={s.sessionTime}>
                  {new Date(item.scheduled_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Recorded Library */}
      {recordings.length > 0 && (
        <View style={s.section}>
          <Text style={s.eyebrow}>PRACTICE LIBRARY</Text>
          {recordings.map((item, i) => (
            <TouchableOpacity
              key={item.id}
              style={[s.libraryItem, i > 0 && { borderTopWidth: 1, borderTopColor: C.border }]}
              onPress={() => router.push(`/studio/${item.id}`)}>
              <View style={s.libraryHeader}>
                {item.category && <Text style={s.libraryCategory}>{item.category.toUpperCase()}</Text>}
                <Text style={s.libraryDuration}>{item.duration_minutes} min</Text>
              </View>
              <Text style={s.libraryTitle}>{item.title}</Text>
              {item.description && <Text style={s.libraryDesc}>{item.description}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {recordings.length === 0 && !loading && (
        <View style={s.section}>
          <Text style={s.eyebrow}>PRACTICE LIBRARY</Text>
          <Text style={[s.body, { marginTop: 12 }]}>
            Guided practices are being added. They will show up here once the studio opens.
          </Text>
        </View>
      )}

      {/* CTA */}
      <View style={s.ctaSection}>
        <Text style={s.ctaQuote}>
          "Consistency matters more than intensity.{'\n'}Even ten minutes a day adds up."
        </Text>
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

  comingTag: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 14 },
  comingTitle: { fontSize: 44, fontWeight: '200', color: C.white, letterSpacing: -1, marginBottom: 16, textAlign: 'center' },
  comingSub: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: '#94A3AA', textAlign: 'center', maxWidth: 460 },
  pricingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, paddingVertical: 20 },
  priceOption: { alignItems: 'center' },
  priceLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, color: '#94A3AA', textTransform: 'uppercase', marginBottom: 8 },
  priceAmount: { fontSize: 40, fontWeight: '200', color: C.white, letterSpacing: -1 },
  pricePer: { fontSize: 13, color: '#94A3AA', marginTop: 4, letterSpacing: 1 },
  priceDivider: { width: 1, height: 60, backgroundColor: '#2D4A55' },
  subscribeBtnDark: { alignSelf: 'center', borderWidth: 1, borderColor: C.white, paddingHorizontal: 36, paddingVertical: 14, marginTop: 24 },
  subscribeBtnText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.white, textTransform: 'uppercase' },

  heroCta: { backgroundColor: C.dark, paddingHorizontal: 32, paddingVertical: 14, marginTop: 24 },
  heroCtaText: { fontSize: 12, fontWeight: '500', letterSpacing: 3, color: C.white, textTransform: 'uppercase' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  featureText: { fontSize: 15, lineHeight: 24, color: C.textLight, flex: 1 },

  sessionItem: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  liveBadge: { backgroundColor: '#C45A4A', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 3 },
  liveBadgeText: { color: C.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  sessionDuration: { fontSize: 13, color: C.textMuted },
  sessionTitle: { fontSize: 18, fontWeight: '300', color: C.text, marginBottom: 4 },
  sessionTime: { fontSize: 14, color: C.textLight },

  libraryItem: { paddingVertical: 20 },
  libraryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  libraryCategory: { fontSize: 10, fontWeight: '600', letterSpacing: 2, color: C.accent },
  libraryDuration: { fontSize: 13, color: C.textMuted },
  libraryTitle: { fontSize: 18, fontWeight: '300', color: C.text, marginBottom: 4 },
  libraryDesc: { fontSize: 14, lineHeight: 22, color: C.textLight },

  ctaSection: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 32, width: '100%', maxWidth: 880, alignSelf: 'center' },
  ctaQuote: { fontSize: 20, fontWeight: '300', fontStyle: 'italic', color: C.textLight, textAlign: 'center', lineHeight: 32 },
});
