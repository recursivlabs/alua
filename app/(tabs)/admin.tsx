import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { useState, useEffect } from 'react';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { sdk } = useRecursiv();
  const [stats, setStats] = useState({ retreats: 0, experiences: 0, bookings: 0, subscribers: 0, mailingList: 0 });

  useEffect(() => {
    loadStats();
  }, [sdk]);

  const loadStats = async () => {
    try {
      const [retreats, experiences, bookings, subscribers, mailingList] = await Promise.all([
        dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM retreats`),
        dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM experiences`),
        dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM bookings`),
        dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM studio_subscriptions WHERE status = 'active'`),
        dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM mailing_list`),
      ]);
      setStats({
        retreats: retreats[0]?.count || 0,
        experiences: experiences[0]?.count || 0,
        bookings: bookings[0]?.count || 0,
        subscribers: subscribers[0]?.count || 0,
        mailingList: mailingList[0]?.count || 0,
      });
    } catch (err) {
      console.error('[Admin] stats error:', err);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: Brand.accent }]}>ADMIN</Text>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Signed in as {user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Retreats', value: stats.retreats },
          { label: 'Experiences', value: stats.experiences },
          { label: 'Bookings', value: stats.bookings },
          { label: 'Studio Subscribers', value: stats.subscribers },
          { label: 'Mailing List', value: stats.mailingList },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
          Full admin management (create retreats, manage bookings, edit content, update pricing) coming in the next update. All data is already stored and queryable from the Recursiv dashboard.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  label: { ...Typography.label, marginBottom: Spacing.sm },
  title: { ...Typography.h1, marginBottom: Spacing.xs },
  subtitle: { ...Typography.caption },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  statCard: { padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1, minWidth: '45%', flex: 1 },
  statValue: { ...Typography.h1, marginBottom: Spacing.xs },
  statLabel: { ...Typography.caption },

  section: { paddingHorizontal: Spacing.lg, marginTop: Spacing.xl },
  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  sectionBody: { ...Typography.body, lineHeight: 24 },
});
