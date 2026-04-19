import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { accessibleEventsApi } from '../../api/supabase/accessibleEvents';
import {
  trackViewAccessibleEventDetail,
  trackAccessibleEventCtaClick,
} from '../../utils/analytics';
import { useTranslation } from 'react-i18next';
import '../EventDetailsPage/component.css'; // base layout styles
import './component.css';

const AccessibleEventDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedEvent = await accessibleEventsApi.getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          trackViewAccessibleEventDetail(id);
        } else {
          setError(t('accessible_event_details.error_not_found'));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t('accessible_event_details.error_loading'),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const handleCtaClick = () => {
    if (event) {
      trackAccessibleEventCtaClick(event.id);
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="accessible-detail-spinner" />
        <p>{t('accessible_event_details.loading')}</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>{t('accessible_event_details.oops')}</h2>
        <p>{error || t('accessible_event_details.not_found_desc')}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          {t('accessible_event_details.back')}
        </button>
      </div>
    );
  }

  const addressParts = [event.street_name, event.street_number, event.city].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(', '));
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const WHATSAPP_NUMBER = import.meta.env.VITE_PHONE_NUMBER_CONTACT;
  const WHATSAPP_MESSAGE = encodeURIComponent(t('accessible_event_details.whatsapp_message'));
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <div className="event-details-page">
      <div className="event-header-section">
        <button className="back-nav-btn" onClick={() => navigate(-1)}>
          {t('accessible_event_details.back_nav')}
        </button>
      </div>

      <div className="event-details-content">
        {/* Badges */}
        <div className="accessible-detail-badges-row">
          <span className="accessible-detail-badge accessible-detail-badge--main">
            {t('accessible_event_details.badge_accessible')}
          </span>
          <span className="accessible-detail-badge accessible-detail-badge--smoke">
            {t('accessible_event_details.badge_smoke_test')}
          </span>
        </div>

        <h1 className="event-details-title">{event.title}</h1>
        {event.organizer && (
          <p className="event-organizer">
            {t('accessible_event_details.by_organizer', { organizer: event.organizer })}
          </p>
        )}

        <div className="accessible-welcome-bar">
          {t('accessible_event_details.welcome_bar')}
        </div>

        {/* Meta chips */}
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
            <span className="meta-chip">
              {t('accessible_event_details.age')}{' '}
              <strong>
                {event.min_age || 18}–{event.max_age || 99}{' '}
                {t('accessible_event_details.years')}
              </strong>
            </span>
          )}

          {(event.girls_price !== null || event.boys_price !== null) && (
            <span className="meta-chip">
              💶{' '}
              {event.girls_price !== null &&
                `${t('accessible_event_details.participant')}: €${event.girls_price}`}
              {event.girls_price !== null && event.boys_price !== null && ' | '}
              {event.boys_price !== null && `€${event.boys_price}`}
            </span>
          )}
        </div>

        {/* Price block */}
        {(event.girls_price !== null || event.boys_price !== null) && (
          <div className="accessible-price-block">
            {event.girls_price !== null && (
              <div className="accessible-price-item">
                <span className="accessible-price-label">
                  {t('accessible_event_details.participant')}
                </span>
                <span className="accessible-price-value">€{event.girls_price}</span>
              </div>
            )}
            {event.boys_price !== null && (
              <div className="accessible-price-item">
                <span className="accessible-price-label">
                  {t('accessible_event_details.participant')}
                </span>
                <span className="accessible-price-value">€{event.boys_price}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="event-description-box">
            <h3>{t('accessible_event_details.about_event')}</h3>
            <p>{event.description}</p>
          </div>
        )}

        {/* Map */}
        {addressParts.length > 0 && (
          <div className="event-map-box">
            <h3>{t('accessible_event_details.location')}</h3>
            <p className="map-instruction">{t('accessible_event_details.map_instruction')}</p>
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

      {/* Sticky bottom bar — single WhatsApp CTA */}
      <div className="event-sticky-bottom-bar">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="accessible-whatsapp-full-btn"
          onClick={handleCtaClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.54 5.876L0 24l6.28-1.516A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.032-1.384l-.36-.214-3.733.901.939-3.625-.234-.373A9.79 9.79 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
          </svg>
          {t('accessible_event_details.reserve_spot')}
        </a>
      </div>
    </div>
  );
};

export default AccessibleEventDetailsPage;
