import { Event } from './model/event';

export interface EventsApi {
  /**
   * Fetches all events from the data source.
   * @returns A promise that resolves to an array of Event objects.
   */
  fetchEvents(): Promise<Event[]>;

  /**
   * Fetches a single event by its ID.
   * @param id The ID of the event to fetch.
   * @returns A promise that resolves to the Event object, or null if not found.
   */
  getEventById(id: string): Promise<Event | null>;
}
