import { supabase } from './client';

// ─── Enums & Types ──────────────────────────────────────────────────────────

export type Gender        = 'male' | 'female' | 'other';
export type PreferredPlan = 'afterwork' | 'dinner' | 'social';
export type PersonalityType = 'extrovert' | 'situational' | 'quiet';
export type ContactMethod = 'whatsapp' | 'email';

export interface ApplicationLeadData {
  gender:           Gender;

  // Step 1
  preferred_plan:   PreferredPlan;

  // Step 2
  personality_type: PersonalityType;

  // Step 3 — open-ended
  connection_goal:  string;

  // Step 4 — conditional contact
  contact_method:   ContactMethod;
  phone?:           string;  // required when contact_method = 'whatsapp'
  email?:           string;  // required when contact_method = 'email'

  // Vibe fields (optional, reserved for future scoring)
  vibe_energy?:     string;
  vibe_style?:      string;
  vibe_intention?:  string;

  // Source
  source:           string;  // 'landing_man' | 'landing_women'
  utm_source?:      string;
  utm_medium?:      string;
  utm_campaign?:    string;
}

// ─── Tag Generation ─────────────────────────────────────────────────────────

/**
 * Generates a CRM-compatible tag array for segmentation and prioritisation.
 *
 * Example output:
 *   ['Lead_Male', 'Plan_Dinner', 'Personality_Extrovert', 'Contact_WhatsApp', 'Source_LandingMan']
 *
 * Psychology: Tags generated at submit time = usable immediately in follow-up
 * sequences without manual labelling. WhatsApp leads get higher priority
 * (higher intent signal) than Email leads.
 */
function generateTags(data: ApplicationLeadData): string[] {
  const tags: string[] = [];

  // Identity
  const genderLabel = data.gender === 'male' ? 'Male' : data.gender === 'female' ? 'Female' : 'Other';
  tags.push(`Lead_${genderLabel}`);

  // Plan preference
  const planMap: Record<PreferredPlan, string> = {
    afterwork: 'Plan_Afterwork',
    dinner:    'Plan_Dinner',
    social:    'Plan_Social',
  };
  tags.push(planMap[data.preferred_plan]);

  // Personality
  const personalityMap: Record<PersonalityType, string> = {
    extrovert:   'Personality_Extrovert',
    situational: 'Personality_Situational',
    quiet:       'Personality_Quiet',
  };
  tags.push(personalityMap[data.personality_type]);

  // Contact method — WhatsApp = higher intent (real name, real number)
  tags.push(data.contact_method === 'whatsapp' ? 'Contact_WhatsApp' : 'Contact_Email');

  // Source
  tags.push(data.source === 'landing_man' ? 'Source_LandingMan' : 'Source_LandingWomen');

  return tags;
}

// ─── API ────────────────────────────────────────────────────────────────────

/**
 * Validates contact data integrity before sending to DB.
 * Mirrors the SQL CHECK constraints client-side to surface errors before the round-trip.
 */
function validateContactFields(data: ApplicationLeadData): void {
  if (data.contact_method === 'whatsapp' && !data.phone) {
    throw new Error('Phone number is required for WhatsApp leads.');
  }
  if (data.contact_method === 'email' && !data.email) {
    throw new Error('Email address is required for Email leads.');
  }
  if (data.phone && data.email) {
    throw new Error('Only one contact method should be set.');
  }
}

export async function submitApplicationLead(data: ApplicationLeadData): Promise<{ tags: string[] }> {
  // Client-side guard — matches DB constraints
  validateContactFields(data);

  const tags = generateTags(data);

  const { error } = await supabase.from('application_leads').insert([
    {
      // Spread only the DB-mapped fields — `tags` is NOT a column in this table.
      // Tags are generated in-memory for CRM segmentation and returned to the caller.
      gender:           data.gender,
      preferred_plan:   data.preferred_plan,
      personality_type: data.personality_type,
      connection_goal:  data.connection_goal,
      contact_method:   data.contact_method,
      phone:            data.phone ?? null,
      email:            data.email ?? null,
      vibe_energy:      data.vibe_energy ?? null,
      vibe_style:       data.vibe_style ?? null,
      vibe_intention:   data.vibe_intention ?? null,
      source:           data.source,
      utm_source:       data.utm_source ?? null,
      utm_medium:       data.utm_medium ?? null,
      utm_campaign:     data.utm_campaign ?? null,
      created_at:       new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Error submitting application lead:', error);
    throw new Error(error.message);
  }

  return { tags };
}
