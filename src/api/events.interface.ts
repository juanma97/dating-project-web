import { Event } from './model/event';

export interface EventsApi {
  /**
   * Fetches all events from the data source.
   * @returns A promise that resolves to an array of Event objects.
   */
  fetchEvents(): Promise<Event[]>;
}
