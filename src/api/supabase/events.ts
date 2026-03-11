import { supabase } from './client';
import { EventsApi } from '../events.interface';
import { Event } from '../model/event';

export class SupabaseEventsApi implements EventsApi {
  async fetchEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events from Supabase:', error);
      throw new Error(error.message);
    }

    return (data as Event[]) || [];
  }
}

// Export a singleton instance
export const eventsApi = new SupabaseEventsApi();
