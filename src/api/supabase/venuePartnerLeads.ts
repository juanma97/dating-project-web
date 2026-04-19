import { supabase } from './client';

export interface VenuePartnerLeadData {
  venue_name: string;
  venue_type: string;
  city: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  capacity?: number | null;
}

export async function submitVenuePartnerLead(lead: VenuePartnerLeadData): Promise<void> {
  const { error } = await supabase.from('venue_partner_leads').insert([
    {
      ...lead,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error('Error submitting venue partner lead:', error);
    throw new Error(error.message);
  }
}
