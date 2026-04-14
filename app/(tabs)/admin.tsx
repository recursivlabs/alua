import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRecursivSafe } from '@/contexts/RecursivContext';
import { dbQuery } from '@/lib/database';
import { formatPrice } from '@/constants/pricing';
import { RETREAT_INCLUDED, DEFAULT_DAILY_SCHEDULE, DEFAULT_PACKING_LIST, DEFAULT_FAQS } from '@/constants/content';
import { CANCELLATION_POLICY } from '@/constants/pricing';

const C = {
  bg: '#FAF7F4', text: '#1A1A1A', textLight: '#6B6560', textMuted: '#A09890',
  accent: '#C4956A', dark: '#1A2F38', cream: '#F0EBE4', border: '#E8E0D8', white: '#FFF',
  success: '#4a9a6a', danger: '#C45A4A',
};

type Tab = 'overview' | 'retreats' | 'experiences' | 'studio' | 'faqs' | 'bookings';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const ctx = useRecursivSafe();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Data states
  const [retreats, setRetreats] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [studioContent, setStudioContent] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formCategory, setFormCategory] = useState('breathwork');
  const [formDuration, setFormDuration] = useState('');
  const [formExternalLink, setFormExternalLink] = useState('');
  const [formContentType, setFormContentType] = useState<'recorded' | 'live'>('recorded');
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formFaqCategory, setFormFaqCategory] = useState('general');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ctx?.sdk) { setLoading(false); return; }
    loadAll();
  }, [ctx?.sdk]);

  const loadAll = async () => {
    if (!ctx?.sdk) return;
    setLoading(true);
    try {
      const [s1, s2, s3, s4, s5, s6, locs, rets, exps, studio, faqData, bookingData] = await Promise.all([
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM retreats`),
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM experiences`),
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM bookings`),
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM guest_profiles`),
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM studio_subscriptions WHERE status = 'active'`),
        dbQuery<{ count: number }>(ctx.sdk, `SELECT COUNT(*)::int as count FROM mailing_list`),
        dbQuery(ctx.sdk, `SELECT * FROM locations ORDER BY season_start`),
        dbQuery(ctx.sdk, `SELECT r.*, l.name as location_name FROM retreats r LEFT JOIN locations l ON r.location_id = l.id ORDER BY r.start_date DESC`),
        dbQuery(ctx.sdk, `SELECT e.*, l.name as location_name FROM experiences e LEFT JOIN locations l ON e.location_id = l.id ORDER BY e.created_at DESC`),
        dbQuery(ctx.sdk, `SELECT * FROM studio_content ORDER BY sort_order ASC, created_at DESC`),
        dbQuery(ctx.sdk, `SELECT * FROM faqs ORDER BY sort_order ASC`),
        dbQuery(ctx.sdk, `SELECT b.*, COALESCE(r.title, e.title) as item_title FROM bookings b LEFT JOIN retreats r ON b.booking_type='retreat' AND b.item_id=r.id LEFT JOIN experiences e ON b.booking_type='experience' AND b.item_id=e.id ORDER BY b.booked_at DESC LIMIT 50`),
      ]);
      setStats({ retreats: s1[0]?.count||0, experiences: s2[0]?.count||0, bookings: s3[0]?.count||0, guests: s4[0]?.count||0, subscribers: s5[0]?.count||0, mailing: s6[0]?.count||0 });
      setLocations(locs);
      setRetreats(rets);
      setExperiences(exps);
      setStudioContent(studio);
      setFaqs(faqData);
      setBookings(bookingData);
    } catch (err) {
      console.error('[Admin]', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setFormTitle(''); setFormDesc(''); setFormLocation(''); setFormPrice('');
    setFormStartDate(''); setFormEndDate(''); setFormCategory('breathwork');
    setFormDuration(''); setFormExternalLink(''); setFormContentType('recorded');
    setFormQuestion(''); setFormAnswer(''); setFormFaqCategory('general');
  };

  const createRetreat = async () => {
    if (!ctx?.sdk || !formTitle || !formLocation || !formPrice || !formStartDate || !formEndDate) {
      Alert.alert('Missing fields', 'Title, location, price, start date, and end date are required.');
      return;
    }
    setSaving(true);
    try {
      await dbQuery(ctx.sdk, `
        INSERT INTO retreats (location_id, title, description, start_date, end_date, price_cents, status, included, daily_schedule, packing_list, cancellation_policy)
        VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, $8, $9, $10)
      `, [formLocation, formTitle, formDesc, formStartDate, formEndDate, Math.round(parseFloat(formPrice) * 100),
          JSON.stringify(RETREAT_INCLUDED), JSON.stringify(DEFAULT_DAILY_SCHEDULE), JSON.stringify(DEFAULT_PACKING_LIST), JSON.stringify(CANCELLATION_POLICY)]);
      resetForm();
      await loadAll();
      Alert.alert('Created', 'Retreat published successfully.');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const createExperience = async () => {
    if (!ctx?.sdk || !formTitle || !formLocation || !formPrice) {
      Alert.alert('Missing fields', 'Title, location, and price are required.');
      return;
    }
    setSaving(true);
    try {
      await dbQuery(ctx.sdk, `
        INSERT INTO experiences (location_id, title, description, price_cents, status, included)
        VALUES ($1, $2, $3, $4, 'published', $5)
      `, [formLocation, formTitle, formDesc, Math.round(parseFloat(formPrice) * 100),
          JSON.stringify(['60-minute breathwork session', '2-hour surf lesson with guide', 'Board and equipment rental', '1 shared meal'])]);
      resetForm();
      await loadAll();
      Alert.alert('Created', 'Experience published successfully.');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const createStudioContent = async () => {
    if (!ctx?.sdk || !formTitle) {
      Alert.alert('Missing fields', 'Title is required.');
      return;
    }
    setSaving(true);
    try {
      await dbQuery(ctx.sdk, `
        INSERT INTO studio_content (title, description, content_type, category, duration_minutes, external_link, published)
        VALUES ($1, $2, $3, $4, $5, $6, true)
      `, [formTitle, formDesc, formContentType, formCategory, formDuration ? parseInt(formDuration) : null, formExternalLink || null]);
      resetForm();
      await loadAll();
      Alert.alert('Created', 'Studio content published successfully.');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const createFaq = async () => {
    if (!ctx?.sdk || !formQuestion || !formAnswer) {
      Alert.alert('Missing fields', 'Question and answer are required.');
      return;
    }
    setSaving(true);
    try {
      const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f: any) => f.sort_order || 0)) + 1 : 0;
      await dbQuery(ctx.sdk, `INSERT INTO faqs (question, answer, category, sort_order) VALUES ($1, $2, $3, $4)`,
        [formQuestion, formAnswer, formFaqCategory, maxOrder]);
      resetForm();
      await loadAll();
      Alert.alert('Created', 'FAQ published successfully.');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSaving(false); }
  };

  const deleteItem = async (table: string, id: string, label: string) => {
    if (!ctx?.sdk) return;
    Alert.alert('Delete', `Delete "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await dbQuery(ctx.sdk, `DELETE FROM ${table} WHERE id = $1`, [id]);
        await loadAll();
      }},
    ]);
  };

  const toggleStatus = async (table: string, id: string, currentStatus: string) => {
    if (!ctx?.sdk) return;
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    await dbQuery(ctx.sdk, `UPDATE ${table} SET status = $2 WHERE id = $1`, [id, newStatus]);
    await loadAll();
  };

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'grid-outline' },
    { key: 'retreats', label: 'Retreats', icon: 'compass-outline' },
    { key: 'experiences', label: 'Experiences', icon: 'sunny-outline' },
    { key: 'studio', label: 'Studio', icon: 'play-circle-outline' },
    { key: 'faqs', label: 'FAQs', icon: 'help-circle-outline' },
    { key: 'bookings', label: 'Bookings', icon: 'receipt-outline' },
  ];

  if (loading) {
    return <View style={[s.center, { backgroundColor: C.bg }]}><ActivityIndicator color={C.accent} /></View>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 60 }} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <Text style={s.eyebrow}>ADMIN</Text>
        <Text style={s.headline}>Dashboard</Text>
      </View>

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t.key} style={[s.tabChip, tab === t.key && { backgroundColor: C.dark }]} onPress={() => { setTab(t.key); resetForm(); }}>
            <Ionicons name={t.icon as any} size={14} color={tab === t.key ? C.white : C.textLight} />
            <Text style={[s.tabText, { color: tab === t.key ? C.white : C.textLight }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Overview */}
      {tab === 'overview' && (
        <View style={s.section}>
          <View style={s.statsGrid}>
            {[
              { label: 'Retreats', value: stats.retreats, icon: 'compass-outline' },
              { label: 'Experiences', value: stats.experiences, icon: 'sunny-outline' },
              { label: 'Bookings', value: stats.bookings, icon: 'receipt-outline' },
              { label: 'Guests', value: stats.guests, icon: 'people-outline' },
              { label: 'Subscribers', value: stats.subscribers, icon: 'play-circle-outline' },
              { label: 'Mailing List', value: stats.mailing, icon: 'mail-outline' },
            ].map((st) => (
              <View key={st.label} style={s.statCard}>
                <View style={s.statHeader}>
                  <Ionicons name={st.icon as any} size={16} color={C.accent} />
                  <Text style={s.statValue}>{st.value ?? 0}</Text>
                </View>
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Retreats CRUD */}
      {tab === 'retreats' && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Retreats ({retreats.length})</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(!showForm)}>
              <Ionicons name={showForm ? 'close' : 'add'} size={18} color={C.white} />
              <Text style={s.addBtnText}>{showForm ? 'Cancel' : 'New Retreat'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={s.form}>
              <Text style={s.inputLabel}>Title</Text>
              <TextInput style={s.input} value={formTitle} onChangeText={setFormTitle} placeholder="e.g. Winter Healing" placeholderTextColor={C.textMuted} />
              <Text style={s.inputLabel}>Description</Text>
              <TextInput style={[s.input, { minHeight: 80 }]} value={formDesc} onChangeText={setFormDesc} placeholder="Retreat description" placeholderTextColor={C.textMuted} multiline />
              <Text style={s.inputLabel}>Location</Text>
              <View style={s.locationPicker}>
                {locations.map((l: any) => (
                  <TouchableOpacity key={l.id} style={[s.locChip, formLocation === l.id && { backgroundColor: C.dark }]} onPress={() => setFormLocation(l.id)}>
                    <Text style={[s.locChipText, { color: formLocation === l.id ? C.white : C.text }]}>{l.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={s.inputLabel}>Price (USD)</Text>
              <TextInput style={s.input} value={formPrice} onChangeText={setFormPrice} placeholder="1800" placeholderTextColor={C.textMuted} keyboardType="numeric" />
              <Text style={s.inputLabel}>Start Date (YYYY-MM-DD)</Text>
              <TextInput style={s.input} value={formStartDate} onChangeText={setFormStartDate} placeholder="2027-01-15" placeholderTextColor={C.textMuted} />
              <Text style={s.inputLabel}>End Date (YYYY-MM-DD)</Text>
              <TextInput style={s.input} value={formEndDate} onChangeText={setFormEndDate} placeholder="2027-01-20" placeholderTextColor={C.textMuted} />
              <TouchableOpacity style={[s.submitBtn, saving && { opacity: 0.6 }]} onPress={createRetreat} disabled={saving}>
                <Text style={s.submitBtnText}>{saving ? 'Creating...' : 'Create Retreat'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {retreats.map((r: any) => (
            <View key={r.id} style={s.listItem}>
              <View style={s.listItemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.listItemTitle}>{r.title}</Text>
                  <Text style={s.listItemMeta}>{r.location_name} · {formatPrice(r.price_cents)} · {r.status}</Text>
                </View>
                <View style={s.listItemActions}>
                  <TouchableOpacity onPress={() => toggleStatus('retreats', r.id, r.status)} style={s.actionBtn}>
                    <Ionicons name={r.status === 'published' ? 'eye-off-outline' : 'eye-outline'} size={16} color={C.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem('retreats', r.id, r.title)} style={s.actionBtn}>
                    <Ionicons name="trash-outline" size={16} color={C.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Experiences CRUD */}
      {tab === 'experiences' && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Experiences ({experiences.length})</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(!showForm)}>
              <Ionicons name={showForm ? 'close' : 'add'} size={18} color={C.white} />
              <Text style={s.addBtnText}>{showForm ? 'Cancel' : 'New Experience'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={s.form}>
              <Text style={s.inputLabel}>Title</Text>
              <TextInput style={s.input} value={formTitle} onChangeText={setFormTitle} placeholder="e.g. Breathe & Surf, Weligama" placeholderTextColor={C.textMuted} />
              <Text style={s.inputLabel}>Description</Text>
              <TextInput style={[s.input, { minHeight: 80 }]} value={formDesc} onChangeText={setFormDesc} placeholder="Experience description" placeholderTextColor={C.textMuted} multiline />
              <Text style={s.inputLabel}>Location</Text>
              <View style={s.locationPicker}>
                {locations.map((l: any) => (
                  <TouchableOpacity key={l.id} style={[s.locChip, formLocation === l.id && { backgroundColor: C.dark }]} onPress={() => setFormLocation(l.id)}>
                    <Text style={[s.locChipText, { color: formLocation === l.id ? C.white : C.text }]}>{l.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={s.inputLabel}>Price (USD)</Text>
              <TextInput style={s.input} value={formPrice} onChangeText={setFormPrice} placeholder="95" placeholderTextColor={C.textMuted} keyboardType="numeric" />
              <TouchableOpacity style={[s.submitBtn, saving && { opacity: 0.6 }]} onPress={createExperience} disabled={saving}>
                <Text style={s.submitBtnText}>{saving ? 'Creating...' : 'Create Experience'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {experiences.map((e: any) => (
            <View key={e.id} style={s.listItem}>
              <View style={s.listItemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.listItemTitle}>{e.title}</Text>
                  <Text style={s.listItemMeta}>{e.location_name} · {formatPrice(e.price_cents)} · {e.status}</Text>
                </View>
                <View style={s.listItemActions}>
                  <TouchableOpacity onPress={() => toggleStatus('experiences', e.id, e.status)} style={s.actionBtn}>
                    <Ionicons name={e.status === 'published' ? 'eye-off-outline' : 'eye-outline'} size={16} color={C.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteItem('experiences', e.id, e.title)} style={s.actionBtn}>
                    <Ionicons name="trash-outline" size={16} color={C.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Studio Content CRUD */}
      {tab === 'studio' && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Studio Content ({studioContent.length})</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(!showForm)}>
              <Ionicons name={showForm ? 'close' : 'add'} size={18} color={C.white} />
              <Text style={s.addBtnText}>{showForm ? 'Cancel' : 'Add Content'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={s.form}>
              <Text style={s.inputLabel}>Type</Text>
              <View style={s.locationPicker}>
                {(['recorded', 'live'] as const).map((t) => (
                  <TouchableOpacity key={t} style={[s.locChip, formContentType === t && { backgroundColor: C.dark }]} onPress={() => setFormContentType(t)}>
                    <Text style={[s.locChipText, { color: formContentType === t ? C.white : C.text }]}>{t === 'recorded' ? 'Recorded' : 'Live Session'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={s.inputLabel}>Title</Text>
              <TextInput style={s.input} value={formTitle} onChangeText={setFormTitle} placeholder="e.g. Foundation Breathwork" placeholderTextColor={C.textMuted} />
              <Text style={s.inputLabel}>Description</Text>
              <TextInput style={[s.input, { minHeight: 60 }]} value={formDesc} onChangeText={setFormDesc} placeholder="Description" placeholderTextColor={C.textMuted} multiline />
              <Text style={s.inputLabel}>Category</Text>
              <View style={s.locationPicker}>
                {['breathwork', 'meditation', 'movement', 'surf_performance'].map((c) => (
                  <TouchableOpacity key={c} style={[s.locChip, formCategory === c && { backgroundColor: C.dark }]} onPress={() => setFormCategory(c)}>
                    <Text style={[s.locChipText, { color: formCategory === c ? C.white : C.text }]}>{c.replace('_', ' ')}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={s.inputLabel}>Duration (minutes)</Text>
              <TextInput style={s.input} value={formDuration} onChangeText={setFormDuration} placeholder="20" placeholderTextColor={C.textMuted} keyboardType="numeric" />
              {formContentType === 'live' && (
                <>
                  <Text style={s.inputLabel}>Meeting Link (Zoom/Meet)</Text>
                  <TextInput style={s.input} value={formExternalLink} onChangeText={setFormExternalLink} placeholder="https://zoom.us/j/..." placeholderTextColor={C.textMuted} />
                </>
              )}
              <TouchableOpacity style={[s.submitBtn, saving && { opacity: 0.6 }]} onPress={createStudioContent} disabled={saving}>
                <Text style={s.submitBtnText}>{saving ? 'Creating...' : 'Add Content'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {studioContent.map((sc: any) => (
            <View key={sc.id} style={s.listItem}>
              <View style={s.listItemHeader}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {sc.content_type === 'live' && <View style={s.liveDot} />}
                    <Text style={s.listItemTitle}>{sc.title}</Text>
                  </View>
                  <Text style={s.listItemMeta}>{sc.category} · {sc.duration_minutes}min · {sc.content_type}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteItem('studio_content', sc.id, sc.title)} style={s.actionBtn}>
                  <Ionicons name="trash-outline" size={16} color={C.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* FAQs CRUD */}
      {tab === 'faqs' && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>FAQs ({faqs.length})</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setShowForm(!showForm)}>
              <Ionicons name={showForm ? 'close' : 'add'} size={18} color={C.white} />
              <Text style={s.addBtnText}>{showForm ? 'Cancel' : 'Add FAQ'}</Text>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={s.form}>
              <Text style={s.inputLabel}>Question</Text>
              <TextInput style={s.input} value={formQuestion} onChangeText={setFormQuestion} placeholder="What do guests commonly ask?" placeholderTextColor={C.textMuted} />
              <Text style={s.inputLabel}>Answer</Text>
              <TextInput style={[s.input, { minHeight: 80 }]} value={formAnswer} onChangeText={setFormAnswer} placeholder="The answer" placeholderTextColor={C.textMuted} multiline />
              <Text style={s.inputLabel}>Category</Text>
              <View style={s.locationPicker}>
                {['general', 'retreats', 'experiences', 'studio', 'booking', 'travel'].map((c) => (
                  <TouchableOpacity key={c} style={[s.locChip, formFaqCategory === c && { backgroundColor: C.dark }]} onPress={() => setFormFaqCategory(c)}>
                    <Text style={[s.locChipText, { color: formFaqCategory === c ? C.white : C.text }]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={[s.submitBtn, saving && { opacity: 0.6 }]} onPress={createFaq} disabled={saving}>
                <Text style={s.submitBtnText}>{saving ? 'Creating...' : 'Add FAQ'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {faqs.map((f: any) => (
            <View key={f.id} style={s.listItem}>
              <View style={s.listItemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.listItemTitle}>{f.question}</Text>
                  <Text style={s.listItemMeta} numberOfLines={2}>{f.answer}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteItem('faqs', f.id, f.question)} style={s.actionBtn}>
                  <Ionicons name="trash-outline" size={16} color={C.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Bookings list */}
      {tab === 'bookings' && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Recent Bookings ({bookings.length})</Text>
          {bookings.length === 0 ? (
            <Text style={s.emptyText}>No bookings yet.</Text>
          ) : bookings.map((b: any) => (
            <View key={b.id} style={s.listItem}>
              <View style={s.listItemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.listItemTitle}>{b.item_title || b.booking_type}</Text>
                  <Text style={s.listItemMeta}>{b.user_id.slice(0, 8)}... · {formatPrice(b.amount_cents)} · {b.status} · {b.payment_status}</Text>
                  <Text style={[s.listItemMeta, { fontSize: 11 }]}>{new Date(b.booked_at).toLocaleDateString()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 32, marginBottom: 16 },
  eyebrow: { fontSize: 11, fontWeight: '600', letterSpacing: 4, color: C.accent, textTransform: 'uppercase', marginBottom: 8 },
  headline: { fontSize: 28, fontWeight: '200', color: C.text, letterSpacing: -0.5 },

  tabRow: { paddingHorizontal: 32, gap: 6, marginBottom: 24 },
  tabChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  tabText: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },

  section: { paddingHorizontal: 32, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '300', color: C.text },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: { padding: 16, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, minWidth: 140, flex: 1 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: '200', color: C.text },
  statLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase' },

  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.dark, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, color: C.white, textTransform: 'uppercase' },

  form: { backgroundColor: C.cream, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  inputLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, color: C.textMuted, textTransform: 'uppercase', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: C.border, backgroundColor: C.white, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.text },
  locationPicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  locChip: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: C.border },
  locChipText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  submitBtn: { backgroundColor: C.dark, paddingVertical: 12, alignItems: 'center', marginTop: 16 },
  submitBtnText: { fontSize: 12, fontWeight: '500', letterSpacing: 2, color: C.white, textTransform: 'uppercase' },

  listItem: { borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 14 },
  listItemHeader: { flexDirection: 'row', alignItems: 'center' },
  listItemTitle: { fontSize: 15, fontWeight: '400', color: C.text, marginBottom: 2 },
  listItemMeta: { fontSize: 12, color: C.textMuted, lineHeight: 18 },
  listItemActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.danger },
  emptyText: { fontSize: 14, color: C.textMuted, marginTop: 12 },
});
