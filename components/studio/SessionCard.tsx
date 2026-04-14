import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Brand, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface SessionCardProps {
  title: string;
  category: string;
  duration: string;
  scheduledAt?: Date | null;
  onPress?: () => void;
}

export default function SessionCard({
  title,
  category,
  duration,
  scheduledAt,
  onPress,
}: SessionCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const isLive = !!scheduledAt;

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.badges}>
        <Badge label={category} color={Brand.accent} />
        {isLive && <Badge label="LIVE" color={Brand.coral} />}
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.footer}>
        <Text style={[styles.duration, { color: colors.textMuted }]}>
          {duration}
        </Text>
        {isLive && scheduledAt && (
          <Text style={[styles.schedule, { color: colors.textSecondary }]}>
            {scheduledAt.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    ...Typography.caption,
  },
  schedule: {
    ...Typography.caption,
  },
});
