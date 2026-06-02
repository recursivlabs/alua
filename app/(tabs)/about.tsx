import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width > 900;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[s.section, { paddingTop: insets.top + 60, paddingBottom: 80 }]}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>ABOUT</Text>
          <Text style={[s.heroText, isWide && { fontSize: 36, lineHeight: 52 }]}>
            Alua is a container for men to heal, grow, and come back to themselves, through surf, breath, movement, and time in the ocean.
          </Text>
        </View>
      </View>

      {/* Story */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>THE STORY</Text>
          <Text style={s.heading}>Why Alua exists now</Text>
          <Text style={s.body}>
            Most of us are more connected to our phones than to anyone in the room. Men feel it the hardest and say it the least.
          </Text>
          <Text style={s.body}>
            Alua is a place to put the phone down and get back in your body. To slow down, breathe, surf, and be around other men doing the same.
          </Text>
          <Text style={s.body}>
            We keep it simple. Old practices, the ocean, real food, and a small group of men. That is enough.
          </Text>
        </View>
      </View>

      {/* Approach */}
      <View style={s.section}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>THE APPROACH</Text>
          <Text style={s.heading}>Breath and ocean as one practice</Text>
          <Text style={s.body}>
            Breathwork and surfing are not two things here. They are one practice. Both pull you out of your head and into your body.
          </Text>
          <Text style={s.body}>
            The breath teaches you to feel and to let go. The ocean teaches you to stay present and give up control. Put them together and something opens up that neither does on its own.
          </Text>

          <View style={[s.approachGrid, isWide && s.approachGridWide]}>
            {[
              { icon: 'pulse-outline' as const, title: 'Breathwork', desc: 'A 3-part active breathing practice rooted in pranayama. It clears the head, moves what you are holding, and carries straight into the surf.' },
              { icon: 'water-outline' as const, title: 'Surfing', desc: 'Not about technique. The ocean is where you practice presence and play. All levels welcome, and the ocean does the teaching.' },
              { icon: 'body-outline' as const, title: 'Movement', desc: 'Recovery and strength. Simple movement to keep your body good through a week of daily breath and surf.' },
              { icon: 'nutrition-outline' as const, title: 'Nourishment', desc: 'Simple, good food made with fresh local ingredients. Meals that fuel the body and slow you down.' },
            ].map((a) => (
              <View key={a.title} style={s.approachItem}>
                <View style={s.approachIcon}>
                  <Ionicons name={a.icon} size={22} color={C.accent} />
                </View>
                <Text style={s.approachTitle}>{a.title}</Text>
                <Text style={s.approachDesc}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Who it's for */}
      <View style={[s.section, { backgroundColor: C.dark }]}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={[s.eyebrow, { color: C.accent }]}>WHO IT'S FOR</Text>
          <Text style={[s.heading, { color: C.white }]}>You already know if this is for you</Text>
          <Text style={[s.body, { color: '#94A3AA' }]}>
            You are doing well on paper, but something is off. You are wired, you cannot slow down, and you are rarely all the way here. You have tried the wellness stuff and it left you flat.
          </Text>
          <Text style={[s.body, { color: '#94A3AA' }]}>
            You want more than a vacation. You want to feel something shift, move past the patterns you keep repeating, and come home more alive. You are ready.
          </Text>
          <Text style={[s.body, { color: '#94A3AA' }]}>
            No surf experience needed. No fitness test. Most men come on their own. Mostly 25 to 45, though what matters is that this lands for you.
          </Text>
        </View>
      </View>

      {/* The transformation */}
      <View style={s.section}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>THE TRANSFORMATION</Text>
          <View style={[s.transformGrid, isWide && s.transformGridWide]}>
            <View style={s.transformCol}>
              <Text style={[s.transformLabel, { color: C.textMuted }]}>YOU ARRIVE</Text>
              {['Tired, wired, overstimulated', 'Burnt out and running on empty', 'Carrying grief or heartbreak', 'Out of touch with your body', 'A little scared, and pretty sure you need this'].map((t) => (
                <Text key={t} style={s.transformItem}>{t}</Text>
              ))}
            </View>
            <View style={[s.transformDivider, isWide && s.transformDividerWide]} />
            <View style={s.transformCol}>
              <Text style={[s.transformLabel, { color: C.accent }]}>YOU LEAVE</Text>
              {['Grounded, present, connected', 'Calm, steady, open', 'Lighter and more at ease', 'Back in your body and alive', 'Carrying a practice you can keep'].map((t) => (
                <Text key={t} style={[s.transformItem, { color: C.text }]}>{t}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Footer quote */}
      <View style={[s.section, { paddingVertical: 100, alignItems: 'center' }]}>
        <Text style={s.footerQuote}>
          "Alua is just a way to meet the world differently. Through surf, breath, movement, food, and the right people. It is simple, and it is enough."
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  section: { paddingVertical: 64, paddingHorizontal: 32 },
  block: { maxWidth: 720, alignSelf: 'center', width: '100%' },
  blockWide: { maxWidth: 960 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  heroText: { fontSize: 28, fontWeight: '300', lineHeight: 42, color: C.text, letterSpacing: -0.3 },
  heading: { fontSize: 28, fontWeight: '300', color: C.text, letterSpacing: -0.3, marginBottom: 20, lineHeight: 38 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, marginBottom: 16 },

  approachGrid: { marginTop: 32, gap: 24 },
  approachGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  approachItem: { flex: 1, minWidth: 200, paddingVertical: 8 },
  approachIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.cream, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  approachTitle: { fontSize: 17, fontWeight: '400', color: C.text, marginBottom: 8, letterSpacing: 0.3 },
  approachDesc: { fontSize: 14, lineHeight: 23, color: C.textLight },

  transformGrid: { marginTop: 16 },
  transformGridWide: { flexDirection: 'row', gap: 48 },
  transformCol: { flex: 1, paddingVertical: 16 },
  transformLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 },
  transformItem: { fontSize: 15, lineHeight: 28, color: C.textLight },
  transformDivider: { height: 1, backgroundColor: C.border, marginVertical: 16 },
  transformDividerWide: { width: 1, height: 'auto', marginVertical: 0 },

  footerQuote: { fontSize: 20, fontWeight: '300', fontStyle: 'italic', color: C.textLight, textAlign: 'center', lineHeight: 34, maxWidth: 600 },
});
