import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { DEFAULT_FAQS } from '@/constants/content';
import type { FAQ } from '@/hooks/useFaqs';

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
  const ctx = useRecursivSafe();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (ctx?.sdk) {
      setLoading(true);
      dbQuery<FAQ>(ctx.sdk, `SELECT * FROM faqs WHERE published = true ORDER BY sort_order ASC`)
        .then(setFaqs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [ctx?.sdk]);

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
          Everything you need to know about Alua retreats, experiences, and the online studio. Can't find your answer? Chat with our AI Guide.
        </Text>
      </View>

      {/* Category filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryRow}>
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
        <ActivityIndicator style={{ marginTop: 40 }} color={C.accent} />
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
  hero: { paddingHorizontal: 32, paddingBottom: 32 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 16 },
  headline: { fontSize: 36, fontWeight: '200', color: C.text, lineHeight: 46, letterSpacing: -0.5, marginBottom: 20 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 28, color: C.textLight, maxWidth: 520 },

  categoryRow: { paddingHorizontal: 32, gap: 8, marginBottom: 24 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  categoryText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },

  faqList: { paddingHorizontal: 32 },
  faqItem: { borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 20 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  faqQuestion: { fontSize: 17, fontWeight: '400', color: C.text, flex: 1, lineHeight: 26 },
  faqAnswer: { fontSize: 15, fontWeight: '400', lineHeight: 26, color: C.textLight, marginTop: 12 },
});
