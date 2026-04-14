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
            Alua exists to create containers for collective and individual healing, growth, and transformation through surf, breathwork, movement, and connection to nature and the ocean.
          </Text>
        </View>
      </View>

      {/* Story */}
      <View style={[s.section, { backgroundColor: C.cream }]}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>THE STORY</Text>
          <Text style={s.heading}>Why Alua exists now</Text>
          <Text style={s.body}>
            Technology continues to expand and permeate our modern culture at an unprecedented rate. There is a direct correlation in the rise of disconnection, loneliness, and separation in society.
          </Text>
          <Text style={s.body}>
            Never before have we been so disconnected from ourselves, each other, and the natural world. Alua is a response to this. A place to slow down, ground, be present, and reconnect through the ocean, the breath, and community.
          </Text>
          <Text style={s.body}>
            We are not another surf school focused on technique. We are not a performative wellness brand. We are a container for genuine transformation, rooted in ancient practices and adapted for modern lives.
          </Text>
        </View>
      </View>

      {/* Approach */}
      <View style={s.section}>
        <View style={[s.block, isWide && s.blockWide]}>
          <Text style={s.eyebrow}>THE APPROACH</Text>
          <Text style={s.heading}>Breath and ocean as one practice</Text>
          <Text style={s.body}>
            At Alua, breathwork and surfing are not separate activities. They are integrated modalities for cultivating presence, awareness, and connection.
          </Text>
          <Text style={s.body}>
            The breath teaches us to regulate, to feel, to let go. The ocean teaches us to be present, to surrender control, to find joy in the unknown. Together, they create something neither can alone.
          </Text>

          <View style={[s.approachGrid, isWide && s.approachGridWide]}>
            {[
              { icon: 'pulse-outline' as const, title: 'Breathwork', desc: 'Rooted in pranayama tradition. Our 3-part active breathing technique is the cornerstone. Physical health, mental clarity, emotional release, and surf performance.' },
              { icon: 'water-outline' as const, title: 'Surfing', desc: 'More than technique. We use the ocean as a medium for healing, presence, and play. All levels welcome. The wave does the work.' },
              { icon: 'body-outline' as const, title: 'Movement', desc: 'Recovery, strength, and regulation. Complementary practices that support your body through the intensity of daily breath and surf.' },
              { icon: 'nutrition-outline' as const, title: 'Nourishment', desc: 'Gourmet, healthy meals made with fresh, local ingredients. Every meal is designed to support the body and deepen connection to the land.' },
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
            You are successful at what you do but something is missing. You struggle with regulation, with slowing down, with feeling truly present. You are tired of wellness that over-promises and under-delivers.
          </Text>
          <Text style={[s.body, { color: '#94A3AA' }]}>
            You are hungry for an experience that nourishes you more deeply than a vacation. You want to shift your internal state, heal patterns that keep you stuck, and feel more alive. You are ready.
          </Text>
          <Text style={[s.body, { color: '#94A3AA' }]}>
            No surf experience needed. No flexibility required. Most guests come solo. Ages 25-45, though we welcome anyone who resonates with what we do.
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
              {['Tired, overwhelmed, overstimulated', 'Burnt out, dysregulated', 'Carrying grief or heartbreak', 'Disconnected from your body', 'Scared yet knowing this is what you need'].map((t) => (
                <Text key={t} style={s.transformItem}>{t}</Text>
              ))}
            </View>
            <View style={[s.transformDivider, isWide && s.transformDividerWide]} />
            <View style={s.transformCol}>
              <Text style={[s.transformLabel, { color: C.accent }]}>YOU LEAVE</Text>
              {['Grounded, present, connected', 'Calm, regulated, open', 'Light, nourished, peaceful', 'Embodied and alive', 'Joyful with a practice to sustain it'].map((t) => (
                <Text key={t} style={[s.transformItem, { color: C.text }]}>{t}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Footer quote */}
      <View style={[s.section, { paddingVertical: 100, alignItems: 'center' }]}>
        <Text style={s.footerQuote}>
          "Alua is simply a vehicle to experience the world in a unique, specific way. Through surf, breath, movement, food, travel, and community. It is profoundly simple."
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
