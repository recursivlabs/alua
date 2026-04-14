import type { Recursiv } from '@recursiv/sdk';
import { PROJECT_ID } from './recursiv';

const DATABASE_NAME = 'alua_production';

export async function dbQuery<T = Record<string, unknown>>(
  sdk: Recursiv,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const response = await sdk.databases.query({
    project_id: PROJECT_ID,
    database_name: DATABASE_NAME,
    sql,
    params,
  });
  return (response.data?.rows ?? []) as T[];
}

export async function ensureDatabase(sdk: Recursiv): Promise<void> {
  await sdk.databases.ensure({
    project_id: PROJECT_ID,
    name: DATABASE_NAME,
  });

  const migrations = [
    `CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      description TEXT,
      image_urls JSONB DEFAULT '[]',
      season_start INT NOT NULL,
      season_end INT NOT NULL,
      timezone TEXT DEFAULT 'UTC',
      surf_details JSONB,
      travel_info JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS retreats (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      location_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      price_cents INT NOT NULL,
      currency TEXT DEFAULT 'USD',
      deposit_cents INT,
      max_capacity INT DEFAULT 12,
      current_bookings INT DEFAULT 0,
      status TEXT DEFAULT 'draft',
      included JSONB,
      daily_schedule JSONB,
      image_urls JSONB DEFAULT '[]',
      cancellation_policy JSONB,
      packing_list JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      location_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      price_cents INT NOT NULL,
      currency TEXT DEFAULT 'USD',
      max_capacity INT DEFAULT 8,
      duration_hours NUMERIC DEFAULT 4,
      available_dates JSONB,
      status TEXT DEFAULT 'draft',
      included JSONB,
      image_urls JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT NOT NULL,
      booking_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'unpaid',
      amount_cents INT NOT NULL,
      deposit_paid_cents INT DEFAULT 0,
      stripe_session_id TEXT,
      guest_info JSONB,
      notes TEXT,
      booked_at TIMESTAMPTZ DEFAULT now(),
      cancelled_at TIMESTAMPTZ
    )`,
    `CREATE TABLE IF NOT EXISTS guest_profiles (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT UNIQUE NOT NULL,
      full_name TEXT,
      phone TEXT,
      dietary JSONB,
      medical JSONB,
      emergency_contact JSONB,
      experience_level JSONB,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS studio_content (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      title TEXT NOT NULL,
      description TEXT,
      content_type TEXT NOT NULL,
      category TEXT,
      duration_minutes INT,
      video_url TEXT,
      thumbnail_url TEXT,
      external_link TEXT,
      scheduled_at TIMESTAMPTZ,
      published BOOLEAN DEFAULT false,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS studio_subscriptions (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      user_id TEXT UNIQUE NOT NULL,
      stripe_subscription_id TEXT,
      status TEXT DEFAULT 'active',
      plan TEXT DEFAULT 'monthly',
      started_at TIMESTAMPTZ DEFAULT now(),
      cancelled_at TIMESTAMPTZ
    )`,
    `CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      sort_order INT DEFAULT 0,
      published BOOLEAN DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS site_content (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      page TEXT NOT NULL,
      section TEXT NOT NULL,
      content JSONB NOT NULL,
      sort_order INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS email_templates (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      template_type TEXT UNIQUE NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      enabled BOOLEAN DEFAULT true
    )`,
    `CREATE TABLE IF NOT EXISTS mailing_list (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      source TEXT DEFAULT 'website',
      subscribed_at TIMESTAMPTZ DEFAULT now()
    )`,
  ];

  for (const sql of migrations) {
    try {
      await dbQuery(sdk, sql);
    } catch (err: any) {
      console.warn('[database] Migration warning:', err.message);
    }
  }

  console.log('[database] Migrations complete');
}

export { PROJECT_ID, DATABASE_NAME };
