import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ConfirmationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={[styles.title, { color: colors.text }]}>Booking Confirmed</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>
          Thank you for booking with Alua. You'll receive a confirmation email with all the details shortly.
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, marginTop: Spacing.md }]}>
          Make sure to complete your guest profile so we can accommodate your dietary needs and prepare for your arrival.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.primaryBtnText}>Complete Guest Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtn, { borderColor: colors.border }]} onPress={() => router.replace('/(tabs)')}>
          <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: 'space-between', alignItems: 'center' },
  content: { alignItems: 'center', maxWidth: 400 },
  checkmark: { fontSize: 64, color: Brand.success, marginBottom: Spacing.lg },
  title: { ...Typography.h1, marginBottom: Spacing.md, textAlign: 'center' },
  body: { ...Typography.body, textAlign: 'center', lineHeight: 26 },
  actions: { width: '100%', maxWidth: 400, gap: Spacing.md },
  primaryBtn: { backgroundColor: Brand.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  primaryBtnText: { color: '#fff', ...Typography.bodyMedium },
  secondaryBtn: { borderWidth: 1, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  secondaryBtnText: { ...Typography.bodyMedium },
});
