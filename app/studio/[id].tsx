import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRecursiv } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import type { StudioContent } from '@/hooks/useStudioContent';

export default function StudioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { sdk } = useRecursiv();
  const [item, setItem] = useState<StudioContent | null>(null);

  useEffect(() => {
    if (id) {
      dbQuery<StudioContent>(sdk, `SELECT * FROM studio_content WHERE id = $1`, [id])
        .then((rows) => setItem(rows[0] || null))
        .catch(console.error);
    }
  }, [sdk, id]);

  if (!item) {
    return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Loading...</Text></View>;
  }

  const isLive = item.content_type === 'live';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom + 40 }]}>
      <View style={styles.content}>
        {isLive && (
          <View style={[styles.liveBadge, { backgroundColor: Brand.coral }]}>
            <Text style={styles.liveBadgeText}>LIVE SESSION</Text>
          </View>
        )}

        {item.category && (
          <View style={[styles.categoryBadge, { backgroundColor: Brand.primary + '15' }]}>
            <Text style={[styles.categoryText, { color: Brand.primary }]}>{item.category}</Text>
          </View>
        )}

        <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>

        {item.duration_minutes && (
          <Text style={[styles.duration, { color: colors.textSecondary }]}>{item.duration_minutes} minutes</Text>
        )}

        {item.scheduled_at && (
          <Text style={[styles.scheduled, { color: colors.textSecondary }]}>
            {new Date(item.scheduled_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </Text>
        )}

        {item.description && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
        )}

        {/* Video placeholder for recorded content */}
        {!isLive && item.video_url && (
          <View style={[styles.videoPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.videoText, { color: colors.textMuted }]}>Video player will appear here</Text>
          </View>
        )}
      </View>

      {/* Join button for live sessions */}
      {isLive && item.external_link && (
        <TouchableOpacity style={styles.joinBtn} onPress={() => Linking.openURL(item.external_link!)}>
          <Text style={styles.joinBtnText}>Join Live Session</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1 },
  liveBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.md },
  liveBadgeText: { color: '#fff', ...Typography.label },
  categoryBadge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.md },
  categoryText: { ...Typography.label },
  title: { ...Typography.hero, marginBottom: Spacing.sm },
  duration: { ...Typography.body, marginBottom: Spacing.xs },
  scheduled: { ...Typography.bodyMedium, marginBottom: Spacing.lg },
  description: { ...Typography.body, lineHeight: 26, marginBottom: Spacing.xl },
  videoPlaceholder: { height: 200, borderRadius: Radius.lg, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  videoText: { ...Typography.body },
  joinBtn: { backgroundColor: Brand.primary, paddingVertical: 16, borderRadius: Radius.full, alignItems: 'center' },
  joinBtnText: { color: '#fff', ...Typography.bodyMedium },
});
