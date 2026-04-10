import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { premiumEventsApi } from '../../api/supabase/premiumEvents';
import LeadCaptureModal from '../../components/LeadCaptureModal/component';
import {
  trackViewPremiumEventDetail,
  trackPremiumEventCtaClick,
  trackPageView,
} from '../../utils/analytics';
import ShareButton from '../../components/ui/ShareButton/component';
import Toast from '../../components/ui/Toast/component';
import { useTranslation } from 'react-i18next';
import '../EventDetailsPage/component.css'; // base layout styles
import './component.css';

const PremiumEventDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(`/premium-events/${id}`);

    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedEvent = await premiumEventsApi.getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          trackViewPremiumEventDetail(id);
        } else {
          setError(t('premium_event_details.error_not_found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('premium_event_details.error_loading'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const handleApuntarme = () => {
    if (event) {
      trackPremiumEventCtaClick(event.id);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="pd-spinner" />
        <p>{t('premium_event_details.loading')}</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>{t('premium_event_details.oops')}</h2>
        <p>{error || t('premium_event_details.not_found_desc')}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          {t('premium_event_details.back')}
        </button>
      </div>
    );
  }

  const addressParts = [event.street_name, event.street_number, event.city].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(', '));
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const WHATSAPP_NUMBER = import.meta.env.VITE_PHONE_NUMBER_CONTACT;
  const WHATSAPP_MESSAGE = encodeURIComponent(t('premium_event_details.whatsapp_message'));
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <>
      <div className="event-details-page">
        <div className="event-header-section">
          <button className="back-nav-btn" onClick={() => navigate(-1)}>
            {t('premium_event_details.back_nav')}
          </button>
        </div>

        <div className="event-details-content">
          <div className="pd-badges-row">
            <span className="pd-badge pd-badge--premium">
              {t('premium_event_details.badge_premium')}
            </span>
            <span className="pd-badge pd-badge--nuevo">{t('premium_event_details.badge_new')}</span>
          </div>

          <h1 className="event-details-title">{event.title}</h1>
          {event.organizer && (
            <p className="event-organizer">
              {t('premium_event_details.by_organizer', { organizer: event.organizer })}
            </p>
          )}

          <div className="pd-scarcity-bar">{t('premium_event_details.scarcity')}</div>

          <div className="event-meta-chips">
            <span className="meta-chip">
              📅 <strong>{event.date}</strong>
              {event.time ? ` · ${event.time.substring(0, 5)}` : ''}
            </span>

            <span className="meta-chip">
              📍 <strong>{event.place || event.city}</strong>
              {event.street_name ? ` · ${event.street_name} ${event.street_number || ''}` : ''}
            </span>

            {(event.min_age || event.max_age) && (
              <span className="meta-chip age-highlight-chip">
                {t('premium_event_details.age')}{' '}
                <strong>
                  {event.min_age || 18}–{event.max_age || 99} {t('premium_event_details.years')}
                </strong>
              </span>
            )}

            {(event.girls_price !== null || event.boys_price !== null) && (
              <span className="meta-chip price-highlight-chip">
                💶{' '}
                {event.girls_price !== null &&
                  `${t('premium_event_details.girls')}: €${event.girls_price}`}
                {event.girls_price !== null && event.boys_price !== null && ' | '}
                {event.boys_price !== null &&
                  `${t('premium_event_details.boys')}: €${event.boys_price}`}
              </span>
            )}
          </div>

          {(event.girls_price !== null || event.boys_price !== null) && (
            <div className="pd-price-block">
              {event.girls_price !== null && (
                <div className="pd-price-item">
                  <span className="pd-price-label">{t('premium_event_details.girls')}</span>
                  <span className="pd-price-value">€{event.girls_price}</span>
                </div>
              )}
              {event.boys_price !== null && (
                <div className="pd-price-item">
                  <span className="pd-price-label">{t('premium_event_details.boys')}</span>
                  <span className="pd-price-value">€{event.boys_price}</span>
                </div>
              )}
            </div>
          )}

          {event.description && (
            <div className="event-description-box">
              <h3>{t('premium_event_details.about_event')}</h3>
              <p>{event.description}</p>
            </div>
          )}

          {addressParts.length > 0 && (
            <div className="event-map-box">
              <h3>{t('premium_event_details.location')}</h3>
              <p className="map-instruction">{t('premium_event_details.map_instruction')}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-wrapper-link"
              >
                <div className="map-container">
                  <iframe
                    src={mapsEmbedUrl}
                    width="100%"
                    height="250"
                    style={{ border: 0, pointerEvents: 'none' }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps"
                  />
                </div>
              </a>
            </div>
          )}
        </div>

        <div className="bottom-bar-spacer" />

        <div className="event-sticky-bottom-bar">
          <ShareButton
            title={event.title}
            eventId={event.id}
            isPremium={true}
            variant="outline"
            className="share-sticky-btn"
          />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            {t('premium_event_details.more_info')}
          </a>
          <button className="btn-primary buy-tickets-btn" onClick={handleApuntarme}>
            {t('premium_event_details.buy_tickets')}
          </button>
        </div>
      </div>

      {showModal && event && <LeadCaptureModal event={event} onClose={() => setShowModal(false)} />}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default PremiumEventDetailsPage;
