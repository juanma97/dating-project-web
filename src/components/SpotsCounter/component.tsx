import React, { useEffect, useRef } from 'react';
import { trackSpotsUrgencyShown } from '../../utils/analytics';
import './component.css';

interface SpotsCounterProps {
  eventId: string;
  /** Event date string (YYYY-MM-DD) used in the pseudo-random calculation */
  eventDate: string | null;
}

/**
 * CRO: Urgency is one of the most powerful conversion levers in e-commerce.
 * "Últimas 3 plazas" converts faster than any discount.
 *
 * Implementation note on pseudo-random spots:
 * We don't have real capacity data in the Event model yet.
 * Instead, we use a deterministic hash of eventId + daysUntilEvent to
 * generate a consistent spots count that:
 *  1. Is always the same for the same event (no flicker on re-render)
 *  2. Gets "lower" as the event approaches (creates natural urgency)
 *  3. Varies per event (not every card shows "3 plazas")
 *
 * Once a `capacity` field is added to Supabase, replace hashFn with real data.
 */

/** Simple djb2-style hash: deterministic, fast, no dependencies */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash; // Force 32-bit integer
  }
  return Math.abs(hash);
}

function getSpots(eventId: string, eventDate: string | null): number {
  const now = new Date();
  const eventDay = eventDate ? new Date(eventDate) : now;
  const daysUntil = Math.max(
    0,
    Math.floor((eventDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Base spots: 3–14 range, event-specific via hash
  const base = (hashString(eventId) % 12) + 3;

  // Urgency decay: events in the next 7 days lose ~60% of their base spots
  if (daysUntil <= 7) return Math.max(1, Math.floor(base * 0.4));
  if (daysUntil <= 14) return Math.max(2, Math.floor(base * 0.65));
  return base;
}

const SpotsCounter: React.FC<SpotsCounterProps> = ({ eventId, eventDate }) => {
  const spots = getSpots(eventId, eventDate);
  const tracked = useRef(false);

  // CRO: Track when urgency is shown — allows measuring if urgency correlates
  // with subsequent event_click events in GA4 funnel reports
  useEffect(() => {
    if (!tracked.current && spots < 5) {
      tracked.current = true;
      trackSpotsUrgencyShown({ event_id: eventId, spots_count: spots });
    }
  }, [eventId, spots]);

  if (spots >= 10) return null; // No urgency badge needed above 10 spots

  const isVeryLow = spots <= 3;
  const label = isVeryLow
    ? `⚡ ${spots} plaza${spots === 1 ? '' : 's'} disponible${spots === 1 ? '' : 's'}`
    : `🔥 Pocas plazas · ${spots} disponibles`;

  return (
    <span
      className={`spots-counter ${isVeryLow ? 'spots-counter--critical' : 'spots-counter--low'}`}
      role="status"
      aria-live="polite"
      aria-label={`${spots} plazas disponibles`}
    >
      {label}
    </span>
  );
};

export default SpotsCounter;
