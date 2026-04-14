import type { Recursiv } from '@recursiv/sdk';
import { dbQuery } from './database';
import { DEFAULT_LOCATIONS } from '@/constants/locations';
import { DEFAULT_FAQS, DEFAULT_EMAIL_TEMPLATES, RETREAT_INCLUDED, DEFAULT_DAILY_SCHEDULE, DEFAULT_PACKING_LIST } from '@/constants/content';
import { RETREAT_PRICING, EXPERIENCE_PRICING, CANCELLATION_POLICY } from '@/constants/pricing';

export async function seedDatabase(sdk: Recursiv): Promise<void> {
  // Check if already seeded (use FAQs as the marker since they're seeded last)
  const existing = await dbQuery<{ count: number }>(sdk, `SELECT COUNT(*)::int as count FROM faqs`);
  if ((existing[0]?.count || 0) > 0) {
    console.log('[seed] Database already seeded');
    return;
  }

  console.log('[seed] Seeding database...');

  // Seed locations
  for (const loc of DEFAULT_LOCATIONS) {
    await dbQuery(sdk, `
      INSERT INTO locations (id, name, country, description, season_start, season_end, timezone, surf_details, travel_info)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO NOTHING
    `, [loc.id, loc.name, loc.country, loc.description, loc.seasonStart, loc.seasonEnd, loc.timezone, JSON.stringify(loc.surfDetails), JSON.stringify(loc.travelInfo)]);
  }

  // Seed sample retreats
  const sampleRetreats = [
    {
      locationId: 'sri-lanka',
      title: 'Winter Healing,Sri Lanka',
      description: 'Begin the new year with 6 days of breathwork, surfing, and deep rest on Sri Lanka\'s beautiful south coast. Warm water, clean swells, and the space to slow down and reconnect.',
      startDate: '2027-01-15',
      endDate: '2027-01-20',
      priceCents: RETREAT_PRICING['sri-lanka'],
    },
    {
      locationId: 'lombok',
      title: 'Presence & Play,Lombok',
      description: 'Lombok\'s uncrowded beaches and pristine waters create the perfect container for cultivating presence through breathwork and surfing. Small group, big transformation.',
      startDate: '2027-05-10',
      endDate: '2027-05-15',
      priceCents: RETREAT_PRICING['lombok'],
    },
    {
      locationId: 'costa-rica',
      title: 'Ocean & Breath,Costa Rica',
      description: 'Costa Rica\'s Pacific coast during dry season. Offshore winds, overhead swells, and the warmth of a community gathering to breathe, surf, and grow together.',
      startDate: '2027-02-20',
      endDate: '2027-02-25',
      priceCents: RETREAT_PRICING['costa-rica'],
    },
  ];

  for (const r of sampleRetreats) {
    await dbQuery(sdk, `
      INSERT INTO retreats (location_id, title, description, start_date, end_date, price_cents, status, included, daily_schedule, packing_list, cancellation_policy)
      VALUES ($1, $2, $3, $4, $5, $6, 'published', $7, $8, $9, $10)
    `, [r.locationId, r.title, r.description, r.startDate, r.endDate, r.priceCents, JSON.stringify(RETREAT_INCLUDED), JSON.stringify(DEFAULT_DAILY_SCHEDULE), JSON.stringify(DEFAULT_PACKING_LIST), JSON.stringify(CANCELLATION_POLICY)]);
  }

  // Seed sample experiences
  const sampleExperiences = [
    {
      locationId: 'sri-lanka',
      title: 'Breathe & Surf,Weligama',
      description: 'A half-day immersion into Alua\'s core practice. Start with a grounding breathwork session, then take to the warm waters of Weligama Bay for a guided surf lesson. End with a shared meal and reflection.',
      priceCents: EXPERIENCE_PRICING['sri-lanka'],
    },
    {
      locationId: 'lombok',
      title: 'Breathe & Surf,Selong Belanak',
      description: 'Experience Lombok\'s most beginner-friendly beach with breathwork and surfing woven together. The crescent bay of Selong Belanak offers gentle waves and stunning natural beauty.',
      priceCents: EXPERIENCE_PRICING['lombok'],
    },
    {
      locationId: 'costa-rica',
      title: 'Breathe & Surf,Nosara',
      description: 'Join us in Nosara for a day of breathwork and surfing on the beautiful Playa Guiones. Consistent waves, warm water, and the vibrant energy of Costa Rica\'s wellness coast.',
      priceCents: EXPERIENCE_PRICING['costa-rica'],
    },
  ];

  for (const e of sampleExperiences) {
    await dbQuery(sdk, `
      INSERT INTO experiences (location_id, title, description, price_cents, status, included)
      VALUES ($1, $2, $3, $4, 'published', $5)
    `, [e.locationId, e.title, e.description, e.priceCents, JSON.stringify(['60-minute breathwork session', '2-hour surf lesson with guide', 'Board and equipment rental', '1 shared meal'])]);
  }

  // Seed FAQs
  for (let i = 0; i < DEFAULT_FAQS.length; i++) {
    const faq = DEFAULT_FAQS[i];
    await dbQuery(sdk, `
      INSERT INTO faqs (question, answer, category, sort_order)
      VALUES ($1, $2, $3, $4)
    `, [faq.question, faq.answer, faq.category, i]);
  }

  // Seed email templates
  for (const tmpl of DEFAULT_EMAIL_TEMPLATES) {
    await dbQuery(sdk, `
      INSERT INTO email_templates (template_type, subject, body)
      VALUES ($1, $2, $3)
      ON CONFLICT (template_type) DO NOTHING
    `, [tmpl.template_type, tmpl.subject, tmpl.body]);
  }

  console.log('[seed] Seeding complete');
}
