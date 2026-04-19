import React from 'react';
import { useTranslation } from 'react-i18next';
import { Event } from '../../api/model/event';
import { trackClickAccessibleEvent } from '../../utils/analytics';
import './component.css';

interface InclusiveEventCardProps {
  event: Event;
}

const InclusiveEventCard: React.FC<InclusiveEventCardProps> = ({ event }) => {
  const { t } = useTranslation();

  const WHATSAPP_NUMBER = import.meta.env.VITE_PHONE_NUMBER_CONTACT;
  const WHATSAPP_MESSAGE = encodeURIComponent(
    t('accessible_event_details.whatsapp_message'),
  );
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackClickAccessibleEvent({
      id: event.id,
      city: event.city,
      min_age: event.min_age,
      max_age: event.max_age,
    });
  };

  return (
    <div className="event-card inclusive-event-card">
      {event.image && (
        <div className="event-image-banner">
          <img src={event.image} alt={event.title} loading="lazy" />
          <span className="inclusive-badge inclusive-badge--overlay">
            {t('accessible_events.badge_accessible')}
          </span>
        </div>
      )}
      {!event.image && (
        <div className="inclusive-badge inclusive-badge--no-image">
          {t('accessible_events.badge_accessible')}
        </div>
      )}

      <div className="inclusive-organizado-tag">{t('accessible_events.badge_event')}</div>

      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>

        <div className="event-meta-chips">
          <span className="meta-chip">
            📅 <strong>{event.date}</strong>
            {event.time ? ` · ${event.time.substring(0, 5)}` : ''}
          </span>

          <span className="meta-chip">
            📍 <strong>{event.city}</strong>
            {event.place ? ` · ${event.place}` : ''}
          </span>

          {(event.min_age || event.max_age) && (
            <span className="meta-chip age-chip">
              {t('accessible_events.age')}{' '}
              <strong>
                {event.min_age || 18}–{event.max_age || 99}
              </strong>
            </span>
          )}

          {(event.girls_price !== null || event.boys_price !== null) && (
            <span className="meta-chip price-chip">
              💶{' '}
              {event.girls_price !== null &&
                `${t('accessible_events.entry')}: €${event.girls_price}`}
              {event.girls_price !== null && event.boys_price !== null && ' | '}
              {event.boys_price !== null && `€${event.boys_price}`}
            </span>
          )}
        </div>

        <div className="inclusive-card-actions">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inclusive-whatsapp-btn"
            onClick={handleWhatsApp}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.54 5.876L0 24l6.28-1.516A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.032-1.384l-.36-.214-3.733.901.939-3.625-.234-.373A9.79 9.79 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z" />
            </svg>
            {t('accessible_events.whatsapp_cta')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default InclusiveEventCard;
