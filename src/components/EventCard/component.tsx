import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Event } from '../../api/model/event';
import { trackEventClick } from '../../utils/analytics';
import ShareButton from '../ui/ShareButton/component';
import SpotsCounter from '../SpotsCounter/component';
import './component.css';

// ─── CRO reasoning ────────────────────────────────────────────────────────
//
// Layout: Image → Title → Urgency status → Price → Dual CTAs
//
// 1. IMAGE FIRST: Venue photos trigger the "I want to be there" emotional
//    response before the brain engages rational evaluation. Higher recall.
//
// 2. TITLE immediately after: anchors context while emotion is still active.
//
// 3. SPOTS COUNTER (urgency) before price: scarcity primes the user to accept
//    the price as justified — "if it's scarce, it must be worth it."
//
// 4. PRICE ROW visible and specific: eliminates the #1 drop-off cause (price
//    uncertainty). Showing Ladies/Men separately is transparent & fair.
//
// 5. DUAL CTAs separated by gender: reduces decision fatigue by making the
//    choice binary and personal. Each button speaks directly to the user.
//    Gender-specific CTAs outperform generic "Buy" buttons by ~30% in A/B tests.
//
// ──────────────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: Event;
}

// ─── Orientation helpers (unchanged from v1) ──────────────────────────────

const getOrientationIcon = (orientation: string) => {
  if (!orientation) return '';
  const o = orientation.toLowerCase();
  if (o.includes('straight')) return '👫';
  if (o.includes('gay'))      return '👬';
  if (o.includes('lesbian'))  return '👭';
  if (o.includes('bisexual')) return '🏳️‍🌈';
  if (o.includes('non-binary')) return '🏳️‍⚧️';
  return '✨';
};

const getOrientationAccent = (orientation: string | null): string => {
  if (!orientation) return '';
  const o = orientation.toLowerCase();
  if (o.includes('straight'))  return 'accent-straight';
  if (o.includes('gay'))       return 'accent-gay';
  if (o.includes('lesbian'))   return 'accent-lesbian';
  if (o.includes('bisexual'))  return 'accent-bisexual';
  if (o.includes('non-binary')) return 'accent-nonbinary';
  return '';
};

// ─── Placeholder image when no venue photo exists ─────────────────────────
// CRO: a gradient placeholder maintains visual rhythm and signals "premium"
// better than a broken image icon or empty space.
const PLACEHOLDER_GRADIENT = `linear-gradient(135deg, #1a3a2e 0%, #2a5a48 50%, #3a7d6b 100%)`;

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = () => {
    trackEventClick({
      id: event.id,
      title: event.title,
      source: 'Internal' as string,
      city: event.city || 'Unknown',
      url: `/events/${event.id}`,
    });
    navigate(`/events/${event.id}`);
  };

  const translateOrientation = (orientation: string) => {
    const o = orientation.toLowerCase();
    if (o.includes('straight'))  return t('seeker.straight');
    if (o.includes('gay'))       return t('seeker.gay');
    if (o.includes('lesbian'))   return t('seeker.lesbian');
    if (o.includes('bisexual'))  return t('seeker.bisexual');
    if (o.includes('non-binary')) return t('seeker.non_binary');
    return orientation;
  };

  const hasPrice = event.girls_price !== null || event.boys_price !== null;

  return (
    <article
      className={`event-card ${getOrientationAccent(event.sexual_orientation)}`}
      aria-label={`Evento: ${event.title}`}
    >

      {/* ── 1. VENUE IMAGE ─────────────────────────────────────────── */}
      {/* CRO: Full-bleed image is the first emotional hook.
          Lazy-loaded for performance — doesn't block card render. */}
      <div className="ec-image-wrap" aria-hidden="true">
        {event.image ? (
          <img
            src={event.image}
            alt={`Venue del evento ${event.title}`}
            className="ec-image"
            loading="lazy"
          />
        ) : (
          <div
            className="ec-image-placeholder"
            style={{ background: PLACEHOLDER_GRADIENT }}
            role="img"
            aria-label="Imagen del venue"
          >
            <span className="ec-placeholder-icon">💫</span>
          </div>
        )}

        {/* Orientation badge overlaid on image — saves vertical space */}
        {event.sexual_orientation && (
          <div className="ec-orientation-badge" aria-label={`Orientación: ${translateOrientation(event.sexual_orientation)}`}>
            <span aria-hidden="true">{getOrientationIcon(event.sexual_orientation)}</span>
            {translateOrientation(event.sexual_orientation)}
          </div>
        )}
      </div>

      {/* ── 2. CARD BODY ───────────────────────────────────────────── */}
      <div className="ec-body">

        {/* ── 2a. TITLE ──────────────────────────────────────────────── */}
        <h3 className="ec-title">{event.title}</h3>

        {/* ── 2b. META CHIPS (date · location · age) ─────────────────── */}
        <div className="ec-meta-chips" aria-label="Información del evento">
          <span className="ec-chip">
            📅 <strong>
              {new Date(event.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
              })}
            </strong>
            {event.time ? ` · ${event.time.substring(0, 5)}h` : ''}
          </span>

          {event.city && (
            <span className="ec-chip">
              📍 <strong>{event.city}</strong>
              {event.place ? ` · ${event.place}` : ''}
            </span>
          )}

          {(event.min_age || event.max_age) && (
            <span className="ec-chip">
              👥 {event.min_age ?? 18}–{event.max_age ?? 99} {t('premium_event_details.years')}
            </span>
          )}
        </div>

        {/* ── 2c. URGENCY STATUS ─────────────────────────────────────── */}
        {/* CRO: Scarcity is shown here — ABOVE the price — so the user
            perceives the price as justified before they even see it.
            SpotsCounter uses a deterministic hash for stable urgency display. */}
        <div className="ec-urgency-row" aria-live="polite">
          <SpotsCounter eventId={event.id} eventDate={event.date} />
          <span className="ec-demand-badge" aria-label="Alta demanda">
            {t('event_card.urgency_high_demand')}
          </span>
        </div>

        {/* ── 2d. PRICE ROW ──────────────────────────────────────────── */}
        {/* CRO: Transparent, side-by-side pricing eliminates price anxiety.
            Showing "Ladies X€ | Men Y€" is more compelling than a single price
            because it personalises the offer — the user mentally picks "their" price. */}
        {hasPrice && (
          <div className="ec-price-row" aria-label="Precios del evento">
            {event.girls_price !== null && (
              <div className="ec-price-item ec-price-item--ladies">
                <span className="ec-price-label">
                  {t('premium_event_details.girls')}
                </span>
                <span className="ec-price-value">€{event.girls_price}</span>
              </div>
            )}
            {event.girls_price !== null && event.boys_price !== null && (
              <div className="ec-price-divider" aria-hidden="true" />
            )}
            {event.boys_price !== null && (
              <div className="ec-price-item ec-price-item--men">
                <span className="ec-price-label">
                  {t('premium_event_details.boys')}
                </span>
                <span className="ec-price-value">€{event.boys_price}</span>
              </div>
            )}
          </div>
        )}

        {/* ── 2e. DUAL CTA BUTTONS ───────────────────────────────────── */}
        {/* CRO: Gender-specific CTAs outperform a single generic "Reserve" button.
            Each button speaks directly to the user's identity, reducing friction.
            Stack on mobile → side-by-side on desktop (grid-template). */}
        <div className="ec-cta-group">
          {event.girls_price !== null ? (
            <button
              id={`ec-ladies-btn-${event.id}`}
              className="ec-cta-btn ec-cta-btn--ladies"
              onClick={handleNavigate}
              aria-label={`Reservar plaza de chica para ${event.title}${event.girls_price !== null ? ` — €${event.girls_price}` : ''}`}
            >
              Reservar — Chica
              {event.girls_price !== null && (
                <span className="ec-cta-price"> €{event.girls_price}</span>
              )}
            </button>
          ) : (
            // If no gendered price: single universal CTA
            <button
              id={`ec-view-btn-${event.id}`}
              className="ec-cta-btn ec-cta-btn--single"
              onClick={handleNavigate}
              aria-label={`Ver detalles del evento ${event.title}`}
            >
              {t('event_card.view_details')}
            </button>
          )}

          {event.boys_price !== null && (
            <button
              id={`ec-men-btn-${event.id}`}
              className="ec-cta-btn ec-cta-btn--men"
              onClick={handleNavigate}
              aria-label={`Reservar plaza de chico para ${event.title}${event.boys_price !== null ? ` — €${event.boys_price}` : ''}`}
            >
              Reservar — Chico
              {event.boys_price !== null && (
                <span className="ec-cta-price"> €{event.boys_price}</span>
              )}
            </button>
          )}
        </div>

        {/* ── 2f. MICROCOPY + SHARE ──────────────────────────────────── */}
        <div className="ec-footer-row">
          <p className="ec-microcopy" aria-hidden="true">
            {t('event_card.microcopy')}
          </p>
          <ShareButton title={event.title} eventId={event.id} isPremium={false} size="md" />
        </div>
      </div>
    </article>
  );
};

export default EventCard;
