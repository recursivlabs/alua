import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Brand, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatPrice } from '@/constants/pricing';

interface RetreatCardProps {
  title: string;
  location: string;
  startDate: Date;
  endDate: Date;
  priceCents: number;
  spotsRemaining: number;
  onPress: () => void;
}

function formatDateRange(start: Date, end: Date): string {
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
}

export default function RetreatCard({
  title,
  location,
  startDate,
  endDate,
  priceCents,
  spotsRemaining,
  onPress,
}: RetreatCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  const spotsColor =
    spotsRemaining <= 3 ? Brand.danger : Brand.seafoam;

  return (
    <Card onPress={onPress} style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <Text style={[styles.location, { color: colors.textSecondary }]}>
        {location}
      </Text>

      <Text style={[styles.dates, { color: colors.textMuted }]}>
        {formatDateRange(startDate, endDate)}
      </Text>

      <View style={styles.footer}>
        <Text style={[styles.price, { color: Brand.primary }]}>
          {formatPrice(priceCents)}
        </Text>
        <Badge
          label={`${spotsRemaining} spot${spotsRemaining !== 1 ? 's' : ''} left`}
          color={spotsColor}
        />
      </View>
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
  location: {
    ...Typography.bodyMedium,
    marginBottom: Spacing.xs,
  },
  dates: {
    ...Typography.caption,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...Typography.h3,
  },
});
