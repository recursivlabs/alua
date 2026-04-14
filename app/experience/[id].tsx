import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExperience } from '@/hooks/useExperiences';
import { formatPrice } from '@/constants/pricing';
import { EXPERIENCE_INCLUDED } from '@/constants/content';
import { useAuth } from '@/contexts/AuthContext';

export default function ExperienceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { experience, loading } = useExperience(id);
  const { isAuthenticated } = useAuth();

  if (loading) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={Brand.primary} /></View>;
  }

  if (!experience) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Experience not found</Text></View>;
  }

  const included = experience.included?.length ? experience.included : EXPERIENCE_INCLUDED;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
      <View style={styles.hero}>
        <Text style={[styles.location, { color: Brand.seafoam }]}>{experience.location_name}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{experience.title}</Text>
        <Text style={[styles.duration, { color: colors.textSecondary }]}>{experience.duration_hours} hours</Text>
        <Text style={[styles.price, { color: colors.text }]}>{formatPrice(experience.price_cents)}</Text>
      </View>

      {experience.description && (
        <View style={styles.section}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>{experience.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>What's Included</Text>
        {included.map((item: string, i: number) => (
          <View key={i} style={styles.listRow}>
            <Text style={[styles.check, { color: Brand.seafoam }]}>✓</Text>
            <Text style={[styles.listText, { color: colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.bookBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
        <Text style={[styles.bookPrice, { color: colors.text }]}>{formatPrice(experience.price_cents)}</Text>
        <TouchableOpacity style={styles.bookBtn} onPress={() => {
          if (!isAuthenticated) {
            router.push('/auth/sign-up');
          } else {
            router.push({ pathname: '/booking/checkout', params: { type: 'experience', id: experience.id } });
          }
        }}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xl },
  location: { ...Typography.bodyMedium, marginBottom: Spacing.xs },
  title: { ...Typography.hero, marginBottom: Spacing.sm },
  duration: { ...Typography.body, marginBottom: Spacing.md },
  price: { ...Typography.h1 },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.md },
  body: { ...Typography.body, lineHeight: 26 },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  check: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  listText: { ...Typography.body, flex: 1 },
  bookBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, borderTopWidth: 1 },
  bookPrice: { ...Typography.h3 },
  bookBtn: { backgroundColor: Brand.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: Radius.full },
  bookBtnText: { color: '#fff', ...Typography.bodyMedium },
});
