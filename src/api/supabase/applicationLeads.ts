import { supabase } from './client';

// ─── Types ─────────────────────────────────────────────────────────────────

export type Gender = 'male' | 'female' | 'other';
export type Intent = 'relationship' | 'social' | 'explore';
export type Timeline = 'this_month' | 'next_month' | 'exploring';
export type KeyPreference = 'safety' | 'small_group' | 'age_match' | 'shared_interests';

export interface ApplicationLeadData {
  gender: Gender;
  age: number;
  city?: string;

  // Step 1
  intent: Intent;

  // Step 3 (gender-branched)
  preferred_age_range?: string;  // e.g. '25-35' — male segment
  key_preference?: KeyPreference; // female segment

  // Step 4
  first_name: string;
  email: string;
  timeline: Timeline;

  // Source
  source: string; // 'landing_man' | 'landing_women'
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

// ─── Tag Generation ─────────────────────────────────────────────────────────

/**
 * Generates a CRM-compatible tag array for segmentation and lead scoring.
 *
 * Psychology: Tags are generated at submission time (not stored as free text)
 * so they can be used immediately for automated follow-up sequences.
 *
 * Example output: ['Lead_Male_28', 'Intent_Relationship', 'Pref_AgeRange_25-35', 'Timeline_Hot']
 */
function generateTags(data: ApplicationLeadData): string[] {
  const tags: string[] = [];

  // Identity tag
  const genderLabel = data.gender === 'male' ? 'Male' : data.gender === 'female' ? 'Female' : 'Other';
  tags.push(`Lead_${genderLabel}_${data.age}`);

  // Intent tag
  const intentMap: Record<Intent, string> = {
    relationship: 'Intent_Relationship',
    social:       'Intent_Social',
    explore:      'Intent_Explore',
  };
  tags.push(intentMap[data.intent]);

  // Preference tag (gender-branched)
  if (data.preferred_age_range) {
    tags.push(`Pref_AgeRange_${data.preferred_age_range}`);
  }
  if (data.key_preference) {
    const prefMap: Record<KeyPreference, string> = {
      safety:            'Pref_Safety',
      small_group:       'Pref_SmallGroup',
      age_match:         'Pref_AgeMatch',
      shared_interests:  'Pref_SharedInterests',
    };
    tags.push(prefMap[data.key_preference]);
  }

  // Timeline tag (heat score for follow-up prioritisation)
  const timelineMap: Record<Timeline, string> = {
    this_month: 'Timeline_Hot',
    next_month: 'Timeline_Warm',
    exploring:  'Timeline_Cold',
  };
  tags.push(timelineMap[data.timeline]);

  return tags;
}

// ─── API ───────────────────────────────────────────────────────────────────

/**
 * Submits a full application lead to Supabase.
 * Tags are auto-generated from the lead data before insert.
 */
export async function submitApplicationLead(data: ApplicationLeadData): Promise<{ tags: string[] }> {
  const tags = generateTags(data);

  const { error } = await supabase.from('application_leads').insert([
    {
      ...data,
      tags,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Error submitting application lead:', error);
    throw new Error(error.message);
  }

  return { tags };
}
