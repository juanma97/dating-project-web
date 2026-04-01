import { supabase } from './client';
import { EventsApi } from '../events.interface';
import { Event } from '../model/event';

export class SupabasePremiumEventsApi implements EventsApi {
  async fetchEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events_smoke_test')
      .select('*')
      .eq('source', 'own')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching premium events from Supabase:', error);
      throw new Error(error.message);
    }

    return (data as Event[]) || [];
  }

  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events_smoke_test')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching premium event ${id} from Supabase:`, error);
      return null;
    }

    return (data as Event) || null;
  }
}

// Export a singleton instance
export const premiumEventsApi = new SupabasePremiumEventsApi();
