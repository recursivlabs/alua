import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  secureTextEntry = false,
}: InputProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? Brand.danger : colors.border,
          },
          multiline && styles.multiline,
        ]}
      />
      {error && (
        <Text style={[styles.error, { color: Brand.danger }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 4,
    minHeight: 48,
  },
  multiline: {
    minHeight: 120,
    paddingTop: Spacing.md - 4,
  },
  error: {
    ...Typography.small,
    marginTop: Spacing.xs,
  },
});
