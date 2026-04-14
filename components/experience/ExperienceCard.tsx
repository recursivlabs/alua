import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import { Brand, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatPrice } from '@/constants/pricing';

interface ExperienceCardProps {
  title: string;
  location: string;
  priceCents: number;
  duration: string;
  onPress: () => void;
}

export default function ExperienceCard({
  title,
  location,
  priceCents,
  duration,
  onPress,
}: ExperienceCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <Card onPress={onPress} style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View style={styles.meta}>
        <Text style={[styles.location, { color: colors.textSecondary }]}>
          {location}
        </Text>
        <Text style={[styles.dot, { color: colors.textMuted }]}>{'\u00B7'}</Text>
        <Text style={[styles.duration, { color: colors.textSecondary }]}>
          {duration}
        </Text>
      </View>

      <Text style={[styles.price, { color: Brand.primary }]}>
        {formatPrice(priceCents)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  location: {
    ...Typography.caption,
  },
  dot: {
    ...Typography.caption,
    marginHorizontal: Spacing.sm,
  },
  duration: {
    ...Typography.caption,
  },
  price: {
    ...Typography.h3,
  },
});
