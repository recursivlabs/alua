import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';

const C = {
  dark: '#1A2F38',
  accent: '#C4956A',
  white: '#FFFFFF',
  border: '#E8E0D8',
  text: '#1A1A1A',
};

type Variant = 'primary' | 'secondary' | 'accent';

interface CtaProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
}

export default function Cta({ title, onPress, variant = 'primary', style }: CtaProps) {
  const bg = variant === 'primary' ? C.dark : variant === 'accent' ? C.accent : 'transparent';
  const textColor = variant === 'secondary' ? C.text : C.white;
  const border = variant === 'secondary' ? C.border : bg;

  return (
    <TouchableOpacity
      style={[s.btn, { backgroundColor: bg, borderColor: border }, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[s.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
});
