import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExperiences } from '@/hooks/useExperiences';
import { formatPrice } from '@/constants/pricing';
import { EXPERIENCE_INCLUDED } from '@/constants/content';
import { useAuth } from '@/contexts/AuthContext';

export default function ExperiencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { isAuthenticated } = useAuth();
  const { experiences, loading } = useExperiences();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Brand.accent }]}>EXPERIENCES</Text>
        <Text style={[styles.title, { color: colors.text }]}>One day, one breath, one wave</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          A single day of breathwork, surfing, and a shared meal. The perfect introduction to the Alua practice.
        </Text>
      </View>

      {/* What's included */}
      <View style={[styles.includedCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.includedTitle, { color: colors.text }]}>Every experience includes</Text>
        {EXPERIENCE_INCLUDED.map((item) => (
          <View key={item} style={styles.includedRow}>
            <Text style={[styles.check, { color: Brand.seafoam }]}>✓</Text>
            <Text style={[styles.includedText, { color: colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Brand.primary} />
      ) : experiences.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Experiences coming soon</Text>
          <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>
            Single-day experiences will be available at each of our locations during their season. Sign up to be the first to know.
          </Text>
          {!isAuthenticated && (
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.emptyBtnText}>Get Notified</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.list}>
          {experiences.map((exp) => (
            <TouchableOpacity key={exp.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => router.push(`/experience/${exp.id}`)}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{exp.title}</Text>
              <Text style={[styles.cardLocation, { color: Brand.seafoam }]}>{exp.location_name}</Text>
              <Text style={[styles.cardDuration, { color: colors.textSecondary }]}>{exp.duration_hours} hours</Text>
              <Text style={[styles.cardPrice, { color: colors.text }]}>{formatPrice(exp.price_cents)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  label: { ...Typography.label, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body, lineHeight: 26 },

  includedCard: { marginHorizontal: Spacing.lg, padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1, marginBottom: Spacing.xl },
  includedTitle: { ...Typography.h3, marginBottom: Spacing.md },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  check: { fontSize: 16, fontWeight: '700' },
  includedText: { ...Typography.body },

  list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  card: { padding: Spacing.lg, borderRadius: Radius.lg, borderWidth: 1 },
  cardTitle: { ...Typography.h3, marginBottom: Spacing.xs },
  cardLocation: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  cardDuration: { ...Typography.caption, marginBottom: Spacing.md },
  cardPrice: { ...Typography.h3 },

  emptyState: { alignItems: 'center', padding: Spacing.xl, marginTop: 20 },
  emptyTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  emptyBody: { ...Typography.body, textAlign: 'center', maxWidth: 400, lineHeight: 24 },
  emptyBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full, marginTop: Spacing.lg },
  emptyBtnText: { color: '#fff', ...Typography.bodyMedium },
});
