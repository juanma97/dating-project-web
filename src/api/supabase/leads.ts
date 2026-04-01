import { supabase } from './client';

export interface LeadData {
  event_id: string;
  city: string | null;
  min_age: number | null;
  max_age: number | null;
  girls_price: number | null;
  boys_price: number | null;
  user_age: number;
  user_gender: string;
  user_email: string;
  preferred_age_range?: string | null;
}

export async function submitLead(lead: LeadData): Promise<void> {
  const { error } = await supabase.from('leads').insert([
    {
      ...lead,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Error submitting lead:', error);
    throw new Error(error.message);
  }
}
