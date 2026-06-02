import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useDbQuery } from '@/hooks/useDbQuery';
import { DEFAULT_FAQS } from '@/constants/content';
import type { FAQ } from '@/hooks/useFaqs';
import { openChat } from '@/lib/chatBus';
import { Skeleton } from '@/components/common/Skeleton';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
};

const CATEGORIES = ['all', 'general', 'retreats', 'experiences', 'studio', 'booking', 'travel', 'safety'];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity style={s.faqItem} onPress={() => setOpen(!open)} activeOpacity={0.7}>
      <View style={s.faqHeader}>
        <Text style={s.faqQuestion}>{question}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={C.textMuted} />
      </View>
      {open && <Text style={s.faqAnswer}>{answer}</Text>}
    </TouchableOpacity>
  );
}

export default function FAQScreen() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: faqs, loading } = useDbQuery<FAQ>('faqs:list', `SELECT * FROM faqs WHERE published = true ORDER BY sort_order ASC`);

  // Use static FAQs as fallback
  const displayFaqs = faqs.length > 0
    ? faqs
    : DEFAULT_FAQS.map((f, i) => ({ id: String(i), ...f, sort_order: i, published: true }));

  const filtered = activeCategory === 'all'
    ? displayFaqs
    : displayFaqs.filter((f) => f.category === activeCategory);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={[s.hero, { paddingTop: insets.top + 60 }]}>
        <Text style={s.eyebrow}>FAQ</Text>
        <Text style={s.headline}>Common questions</Text>
        <Text style={s.body}>
          Everything worth knowing about the retreats, experiences, and the studio. If your question is not here, the AI Guide can help.
        </Text>
      </View>

      {/* Ask the Guide CTA */}
      <View style={s.askWrap}>
        <TouchableOpacity style={s.askCta} onPress={openChat} activeOpacity={0.85}>
          <View style={s.askIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={C.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.askTitle}>Ask the Alua Guide</Text>
            <Text style={s.askSub}>Get an answer to anything, right now.</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color={C.accent} />
        </TouchableOpacity>
      </View>

      {/* Category filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={isWeb ? { width: '100%', maxWidth: 760, alignSelf: 'center' } : undefined}
        contentContainerStyle={[s.categoryRow, isWeb && { flexGrow: 1, justifyContent: 'center' }]}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[s.categoryChip, activeCategory === cat && { backgroundColor: C.dark }]}
            onPress={() => setActiveCategory(cat)}>
            <Text style={[s.categoryText, { color: activeCategory === cat ? C.white : C.textLight }]}>
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={s.faqList}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} style={{ height: 20, marginVertical: 20, width: i % 2 ? '60%' : '75%' }} />
          ))}
        </View>
      ) : (
        <View style={s.faqList}>
          {filtered.map((faq, i) => (
            <FAQItem key={faq.id || i} question={faq.question} answer={faq.answer} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  hero: { paddingHorizontal: 32, paddingBottom: 32, width: '100%', maxWidth: 760, alignSelf: 'center' },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  headline: { fontSize: 40, fontWeight: '200', color: C.text, lineHeight: 50, letterSpacing: -0.5, marginBottom: 20 },
  body: { fontSize: 17, fontWeight: '400', lineHeight: 29, color: C.textLight, maxWidth: 560 },

  askWrap: { paddingHorizontal: 32, width: '100%', maxWidth: 760, alignSelf: 'center', marginBottom: 24 },
  askCta: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.dark, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : {}) },
  askIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  askTitle: { fontSize: 16, fontWeight: '500', color: C.white, letterSpacing: 0.2 },
  askSub: { fontSize: 13, color: '#94A3AA', marginTop: 2 },
  categoryRow: { paddingHorizontal: 32, gap: 8, marginBottom: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  categoryText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },

  faqList: { paddingHorizontal: 32, width: '100%', maxWidth: 760, alignSelf: 'center' },
  faqItem: { borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 20 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  faqQuestion: { fontSize: 17, fontWeight: '400', color: C.text, flex: 1, lineHeight: 26 },
  faqAnswer: { fontSize: 15, fontWeight: '400', lineHeight: 26, color: C.textLight, marginTop: 12 },
});
