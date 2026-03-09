import React from 'react';
import Seeker from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import Footer from '../../components/Footer/component';
import { SpeedyEvent } from '../../components/EventCard/component';
import './component.css';

const MOCK_EVENTS: SpeedyEvent[] = [
  {
    id: '1',
    title: 'Gourmet Speed Dating',
    date: '2026-04-15',
    city: 'Madrid',
    organizerUrl: '#',
    type: 'Straight',
  },
  {
    id: '2',
    title: 'LGBTQ+ Mixer',
    date: '2026-04-22',
    city: 'Barcelona',
    organizerUrl: '#',
    type: 'Gay',
  },
  {
    id: '3',
    title: 'Rooftop Sunset Dating',
    date: '2026-05-01',
    city: 'Valencia',
    organizerUrl: '#',
    type: 'Lesbian',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1>Connect in the Real World</h1>
        <p>Premium speed dating events for authentic interactions.</p>
      </header>

      <div className="container">
        <Seeker />
        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          <EventsList events={MOCK_EVENTS} />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;
