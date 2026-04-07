import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/component';
import PremiumEventCard from '../../components/PremiumEventCard/component';
import { Event } from '../../api/model/event';
import { premiumEventsApi } from '../../api/supabase/premiumEvents';
import { trackViewPremiumEvents, trackPageView } from '../../utils/analytics';
import { useTranslation } from 'react-i18next';
import './component.css';

const PremiumEventsPage: React.FC = () => {
  const { t } = useTranslation();
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
        setError(err instanceof Error ? err.message : t('premium_events.error_loading'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="premium-page">
      <div className="premium-hero">
        <div className="premium-hero-inner">
          <span className="premium-hero-badge">{t('premium_events.hero_badge')}</span>
          <h1 className="premium-hero-title">{t('premium_events.hero_title')}</h1>
          <p className="premium-hero-subtitle">
            {t('premium_events.hero_subtitle')}
          </p>
          <div className="premium-scarcity-banner">
            {t('premium_events.scarcity_banner')}
          </div>
        </div>
      </div>

      <div className="container">
        <section className="events-section">
          {loading && (
            <div className="premium-loading">
              <div className="spinner" />
              <p>{t('premium_events.loading')}</p>
            </div>
          )}
          {error && <p className="error-message">⚠️ {error}</p>}
          {!loading && !error && events.length === 0 && (
            <div className="premium-empty">
              <p>{t('premium_events.empty')}</p>
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
