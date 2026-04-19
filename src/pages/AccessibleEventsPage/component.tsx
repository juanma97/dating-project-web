import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/component';
import InclusiveEventCard from '../../components/InclusiveEventCard/component';
import { Event } from '../../api/model/event';
import { accessibleEventsApi } from '../../api/supabase/accessibleEvents';
import {
  trackViewAccessibleEvents,
  trackAccessibleEventsLoaded,
  trackAccessibleEventsLoadError,
  trackAccessibleEventsEmptyWhatsappClick,
} from '../../utils/analytics';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../../hooks/useSEO';
import './component.css';

const AccessibleEventsPage: React.FC = () => {
  const { t } = useTranslation();

  useSEO({
    title: 'Zapyens — Speed Dating Accesible | Sin barreras',
    description:
      'Eventos de speed dating diseñados para personas con diversidad funcional. Accesibles, acogedores y sin barreras. Conecta con personas que comparten tu realidad.',
    canonical: 'https://zapyens.com/accessible-events',
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackViewAccessibleEvents();

    const fetchData = async () => {
      try {
        const data = await accessibleEventsApi.fetchEvents();
        setEvents(data);
        trackAccessibleEventsLoaded(data.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('accessible_events.error_loading'));
        trackAccessibleEventsLoadError();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="accessible-page">
      {/* Hero */}
      <div className="accessible-hero">
        <div className="accessible-hero-inner">
          <span className="accessible-hero-badge">{t('accessible_events.hero_badge')}</span>
          <h1 className="accessible-hero-title">{t('accessible_events.hero_title')}</h1>
          <p className="accessible-hero-subtitle">{t('accessible_events.hero_subtitle')}</p>
          <div className="accessible-commitment-banner">
            {t('accessible_events.commitment_banner')}
          </div>
        </div>
      </div>

      {/* Values strip */}
      <div className="accessible-values-strip">
        <div className="accessible-value">
          <span className="accessible-value-icon">♿</span>
          <span>{t('accessible_events.value_wheelchair')}</span>
        </div>
        <span className="accessible-value-divider">·</span>
        <div className="accessible-value">
          <span className="accessible-value-icon">❤️</span>
          <span>{t('accessible_events.value_welcome')}</span>
        </div>
        <span className="accessible-value-divider">·</span>
        <div className="accessible-value">
          <span className="accessible-value-icon">🤝</span>
          <span>{t('accessible_events.value_inclusive')}</span>
        </div>
      </div>

      {/* Events grid */}
      <div className="container">
        <section className="events-section">
          <h2 className="accessible-section-title">{t('accessible_events.events_title')}</h2>

          {loading && (
            <div className="accessible-loading">
              <div className="accessible-spinner" />
              <p>{t('accessible_events.loading')}</p>
            </div>
          )}
          {error && <p className="error-message">⚠️ {error}</p>}
          {!loading && !error && events.length === 0 && (
            <div className="accessible-empty">
              <span className="accessible-empty-icon">♿</span>
              <p>{t('accessible_events.empty')}</p>
              <a
                href={`https://wa.me/${import.meta.env.VITE_PHONE_NUMBER_CONTACT}?text=${encodeURIComponent(t('accessible_events.empty_whatsapp_message'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="accessible-empty-whatsapp-btn"
                onClick={trackAccessibleEventsEmptyWhatsappClick}
              >
                {t('accessible_events.empty_whatsapp_cta')}
              </a>
            </div>
          )}
          {!loading && !error && events.length > 0 && (
            <div className="accessible-events-grid">
              {events.map((event) => (
                <InclusiveEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AccessibleEventsPage;
