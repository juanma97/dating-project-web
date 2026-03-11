import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/component';
import Seeker, { SeekerFilters } from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import './component.css';

const LandingPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SeekerFilters | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await eventsApi.fetchEvents();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  useEffect(() => {
    if (!activeFilters) {
      setFilteredEvents(allEvents);
      return;
    }

    const result = allEvents.filter((event) => {
      // Age filtering - Only show events where user's age fits within min_age and max_age
      // Since Seeker has a range (ageMin to ageMax), we show events where the event's age limit
      // overlaps with the seeker's age limits.
      // E.g. If Seeker is 20-30, event must allow someone in that range.
      const overlapsAge =
        (!event.min_age || event.min_age <= activeFilters.ageMax) &&
        (!event.max_age || event.max_age >= activeFilters.ageMin);

      // Gender / Sexual Orientation filtering
      // If none selected, allow all. If selected, match event.sexual_orientation if it exists.
      const genderMatch =
        !activeFilters.gender ||
        !event.sexual_orientation ||
        event.sexual_orientation.toLowerCase() === activeFilters.gender.toLowerCase() ||
        event.sexual_orientation.toLowerCase() === 'all';

      // City filtering
      const cityMatch =
        !activeFilters.city ||
        (event.city && event.city.toLowerCase().includes(activeFilters.city.toLowerCase()));

      // Date filtering
      const eventDateStr = event.date; // format: "YYYY-MM-DD"
      let dateMatch = true;
      if (eventDateStr) {
        const eventDate = new Date(eventDateStr);
        eventDate.setHours(0, 0, 0, 0);

        if (activeFilters.dateStart && activeFilters.dateEnd) {
          const start = new Date(activeFilters.dateStart);
          start.setHours(0, 0, 0, 0);
          const end = new Date(activeFilters.dateEnd);
          end.setHours(0, 0, 0, 0);
          dateMatch = eventDate >= start && eventDate <= end;
        } else if (activeFilters.dateStart) {
          const start = new Date(activeFilters.dateStart);
          start.setHours(0, 0, 0, 0);
          dateMatch = eventDate >= start;
        }
      }

      return overlapsAge && genderMatch && cityMatch && dateMatch;
    });

    setFilteredEvents(result);
  }, [allEvents, activeFilters]);

  return (
    <div className="landing-page">
      <Header />

      <div className="container">
        <Seeker onChange={setActiveFilters} />
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          {loading && <p className="loading-message">Loading events...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && <EventsList events={filteredEvents} />}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
