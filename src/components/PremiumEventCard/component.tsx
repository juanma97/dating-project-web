import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Event } from '../../api/model/event';
import { trackClickPremiumEvent } from '../../utils/analytics';
import ShareButton from '../ui/ShareButton/component';
import SpotsCounter from '../SpotsCounter/component';
import './component.css';

// ─── CRO: same layout funnel as EventCard ────────────────────────────────
// Image → Title → Meta → Urgency/scarcity → Price → Dual CTAs
// Premium gets an extra "✨ Premium" badge and the colour palette
// is gold-tinted to signal exclusivity vs the green of standard events.

interface PremiumEventCardProps {
  event: Event;
}

const PLACEHOLDER_GRADIENT = `linear-gradient(135deg, #1a1a2e 0%, #3d2c4e 50%, #5a3d6b 100%)`;

const PremiumEventCard: React.FC<PremiumEventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    trackClickPremiumEvent({
      id: event.id,
      city: event.city,
      min_age: event.min_age,
      max_age: event.max_age,
      girls_price: event.girls_price,
      boys_price: event.boys_price,
    });
    navigate(`/premium-events/${event.id}`);
  };

  const hasPrice = event.girls_price !== null || event.boys_price !== null;

  return (
    <article
      className="pec-card"
      aria-label={`Evento Premium: ${event.title}`}
    >

      {/* ── 1. VENUE IMAGE ─────────────────────────────────────────── */}
      <div className="pec-image-wrap" aria-hidden="true">
        {event.image ? (
          <img
            src={event.image}
            alt={`Venue del evento premium ${event.title}`}
            className="pec-image"
            loading="lazy"
          />
        ) : (
          <div
            className="pec-image-placeholder"
            style={{ background: PLACEHOLDER_GRADIENT }}
            role="img"
            aria-label="Imagen del venue premium"
          >
            <span className="pec-placeholder-icon">✨</span>
          </div>
        )}

        {/* Premium badge — overlaid top-right of image */}
        <div className="pec-premium-badge" aria-label="Evento Premium">
          ✨ {t('premium_event_details.badge_premium')}
        </div>

        {/* "Nuevo" badge — bottom-left, same pattern as orientation in EventCard */}
        <div className="pec-new-badge" aria-label="Evento nuevo">
          {t('premium_event_details.badge_new')}
        </div>
      </div>

      {/* ── 2. CARD BODY ───────────────────────────────────────────── */}
      <div className="pec-body">

        {/* ── 2a. TITLE ──────────────────────────────────────────────── */}
        <h3 className="pec-title">{event.title}</h3>

        {/* ── 2b. META CHIPS ─────────────────────────────────────────── */}
        <div className="pec-meta-chips" aria-label="Información del evento">
          <span className="pec-chip">
            📅 <strong>
              {new Date(event.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
            </strong>
            {event.time ? ` · ${event.time.substring(0, 5)}h` : ''}
          </span>

          {event.city && (
            <span className="pec-chip">
              📍 <strong>{event.city}</strong>
              {event.place ? ` · ${event.place}` : ''}
            </span>
          )}

          {(event.min_age || event.max_age) && (
            <span className="pec-chip">
              👥 {event.min_age ?? 18}–{event.max_age ?? 99}{' '}
              {t('premium_event_details.years')}
            </span>
          )}
        </div>

        {/* ── 2c. URGENCY / SCARCITY ─────────────────────────────────── */}
        {/* CRO: Premium events have naturally lower supply → scarcity is more
            credible and should be shown prominently, before the price. */}
        <div className="pec-urgency-row" aria-live="polite">
          <SpotsCounter eventId={event.id} eventDate={event.date} />
          <span className="pec-scarcity-badge">
            {t('lead_capture.limited_spots')}
          </span>
        </div>

        {/* ── 2d. PRICE ROW ──────────────────────────────────────────── */}
        {hasPrice && (
          <div className="pec-price-row" aria-label="Precios del evento premium">
            {event.girls_price !== null && (
              <div className="pec-price-item">
                <span className="pec-price-label">
                  {t('premium_event_details.girls')}
                </span>
                <span className="pec-price-value">€{event.girls_price}</span>
              </div>
            )}
            {event.girls_price !== null && event.boys_price !== null && (
              <div className="pec-price-divider" aria-hidden="true" />
            )}
            {event.boys_price !== null && (
              <div className="pec-price-item">
                <span className="pec-price-label">
                  {t('premium_event_details.boys')}
                </span>
                <span className="pec-price-value">€{event.boys_price}</span>
              </div>
            )}
          </div>
        )}

        {/* ── 2e. DUAL CTA BUTTONS ───────────────────────────────────── */}
        <div className="pec-cta-group">
          {event.girls_price !== null ? (
            <button
              id={`pec-ladies-btn-${event.id}`}
              className="pec-cta-btn pec-cta-btn--ladies"
              onClick={handleClick}
              aria-label={`Reservar plaza de chica para ${event.title}${event.girls_price !== null ? ` — €${event.girls_price}` : ''}`}
            >
              Reservar — Chica
              {event.girls_price !== null && (
                <span className="pec-cta-price"> €{event.girls_price}</span>
              )}
            </button>
          ) : (
            <button
              id={`pec-view-btn-${event.id}`}
              className="pec-cta-btn pec-cta-btn--single"
              onClick={handleClick}
              aria-label={`Ver detalles del evento premium ${event.title}`}
            >
              {t('premium_events.view_details')}
            </button>
          )}

          {event.boys_price !== null && (
            <button
              id={`pec-men-btn-${event.id}`}
              className="pec-cta-btn pec-cta-btn--men"
              onClick={handleClick}
              aria-label={`Reservar plaza de chico para ${event.title}${event.boys_price !== null ? ` — €${event.boys_price}` : ''}`}
            >
              Reservar — Chico
              {event.boys_price !== null && (
                <span className="pec-cta-price"> €{event.boys_price}</span>
              )}
            </button>
          )}
        </div>

        {/* ── 2f. SHARE ──────────────────────────────────────────────── */}
        <div className="pec-footer-row">
          <p className="pec-microcopy" aria-hidden="true">
            {t('event_card.microcopy')}
          </p>
          <ShareButton
            title={event.title}
            eventId={event.id}
            isPremium={true}
            size="md"
          />
        </div>
      </div>
    </article>
  );
};

export default PremiumEventCard;
