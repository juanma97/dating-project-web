import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/component';
import Footer from '../../components/Footer/component';
import PremiumEventCard from '../../components/PremiumEventCard/component';
import { Event } from '../../api/model/event';
import { premiumEventsApi } from '../../api/supabase/premiumEvents';
import { trackViewPremiumEvents, trackPageView } from '../../utils/analytics';
import './component.css';

const PremiumEventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView('/premium-events');
    trackViewPremiumEvents();

    const fetchData = async () => {
      try {
        const data = await premiumEventsApi.fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="premium-page">
      <Header />

      <div className="premium-hero">
        <div className="premium-hero-inner">
          <span className="premium-hero-badge">🔥 Nuevo</span>
          <h1 className="premium-hero-title">Eventos Premium</h1>
          <p className="premium-hero-subtitle">
            Speed dating organizado por nosotros — experiencias íntimas, curadas y con plazas
            limitadas.
          </p>
          <div className="premium-scarcity-banner">
            ⏳ Plazas limitadas — estamos validando demanda
          </div>
        </div>
      </div>

      <div className="container">
        <section className="events-section">
          {loading && (
            <div className="premium-loading">
              <div className="spinner" />
              <p>Cargando eventos...</p>
            </div>
          )}
          {error && <p className="error-message">⚠️ {error}</p>}
          {!loading && !error && events.length === 0 && (
            <div className="premium-empty">
              <p>Próximamente nuevos eventos. ¡Vuelve pronto!</p>
            </div>
          )}
          {!loading && !error && events.length > 0 && (
            <div className="events-grid">
              {events.map((event) => (
                <PremiumEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PremiumEventsPage;
