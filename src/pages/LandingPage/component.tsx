import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/component';
import Seeker from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import './component.css';


const LandingPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await eventsApi.fetchEvents();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  return (
    <div className="landing-page">
      <Header />

      <div className="container">
        <Seeker />
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          {loading && <p className="loading-message">Loading events...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && <EventsList events={events} />}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
