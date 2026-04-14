import type { Recursiv } from '@recursiv/sdk';
import { dbQuery } from './database';

interface TemplateVars {
  [key: string]: string;
}

/** Fetch an email template from DB and interpolate variables */
async function getTemplate(sdk: Recursiv, templateType: string, vars: TemplateVars): Promise<{ subject: string; body: string } | null> {
  const rows = await dbQuery<{ subject: string; body: string; enabled: boolean }>(
    sdk,
    `SELECT subject, body, enabled FROM email_templates WHERE template_type = $1`,
    [templateType]
  );
  const tmpl = rows[0];
  if (!tmpl || !tmpl.enabled) return null;

  let subject = tmpl.subject;
  let body = tmpl.body;

  for (const [key, value] of Object.entries(vars)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    subject = subject.replace(pattern, value);
    body = body.replace(pattern, value);
  }

  return { subject, body };
}

/** Send a transactional email via SDK */
async function sendEmail(sdk: Recursiv, to: string, subject: string, body: string): Promise<void> {
  try {
    await sdk.email.send({
      to,
      subject,
      body,
    });
    console.log(`[email] Sent "${subject}" to ${to}`);
  } catch (err: any) {
    console.error(`[email] Failed to send "${subject}" to ${to}:`, err.message);
  }
}

/** Send booking confirmation email */
export async function sendBookingConfirmation(
  sdk: Recursiv,
  guestEmail: string,
  guestName: string,
  bookingType: string,
  itemTitle: string,
  locationName: string,
  price: string,
  dates?: string
): Promise<void> {
  const details = [
    `Type: ${bookingType === 'retreat' ? 'Retreat' : 'Experience'}`,
    `${itemTitle}`,
    locationName ? `Location: ${locationName}` : '',
    dates ? `Dates: ${dates}` : '',
    `Total: ${price}`,
  ].filter(Boolean).join('\n');

  const tmpl = await getTemplate(sdk, 'booking_confirmation', {
    guest_name: guestName,
    booking_type: bookingType === 'retreat' ? 'retreat' : 'experience',
    booking_details: details,
  });

  if (tmpl) {
    await sendEmail(sdk, guestEmail, tmpl.subject, tmpl.body);
  }
}

/** Send studio welcome email */
export async function sendStudioWelcome(sdk: Recursiv, email: string, name: string): Promise<void> {
  const tmpl = await getTemplate(sdk, 'welcome_studio', { guest_name: name });
  if (tmpl) {
    await sendEmail(sdk, email, tmpl.subject, tmpl.body);
  }
}

/** Send pre-arrival email (30d, 7d, or 1d) */
export async function sendPreArrival(
  sdk: Recursiv,
  templateType: 'pre_arrival_30d' | 'pre_arrival_7d' | 'pre_arrival_1d',
  email: string,
  name: string,
  vars: TemplateVars
): Promise<void> {
  const tmpl = await getTemplate(sdk, templateType, { guest_name: name, ...vars });
  if (tmpl) {
    await sendEmail(sdk, email, tmpl.subject, tmpl.body);
  }
}

/** Send post-retreat follow-up */
export async function sendPostRetreat(sdk: Recursiv, email: string, name: string): Promise<void> {
  const tmpl = await getTemplate(sdk, 'post_retreat', { guest_name: name });
  if (tmpl) {
    await sendEmail(sdk, email, tmpl.subject, tmpl.body);
  }
}

/** Add email to mailing list */
export async function addToMailingList(sdk: Recursiv, email: string, name?: string, source = 'website'): Promise<void> {
  try {
    await dbQuery(sdk, `INSERT INTO mailing_list (email, name, source) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`, [email, name || null, source]);
  } catch (err: any) {
    console.error('[email] Failed to add to mailing list:', err.message);
  }
}
