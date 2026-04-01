import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { trackClickPremiumEvent } from '../../utils/analytics';
import './component.css';

interface PremiumEventCardProps {
  event: Event;
}

const PremiumEventCard: React.FC<PremiumEventCardProps> = ({ event }) => {
  const navigate = useNavigate();

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

  return (
    <div className="event-card premium-event-card" onClick={handleClick}>
      {event.image && (
        <div className="event-image-banner">
          <img src={event.image} alt={event.title} loading="lazy" />
          <span className="nuevo-badge">🔥 Nuevo</span>
        </div>
      )}
      {!event.image && <div className="nuevo-badge nuevo-badge--no-image">🔥 Nuevo</div>}

      <div className="organizado-tag">✨ Organizado por nosotros</div>

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
              👥 Edad: <strong>{event.min_age || 18}–{event.max_age || 99}</strong>
            </span>
          )}

          {(event.girls_price !== null || event.boys_price !== null) && (
            <span className="meta-chip price-chip">
              💶{' '}
              {event.girls_price !== null && `Chicas: €${event.girls_price}`}
              {event.girls_price !== null && event.boys_price !== null && ' | '}
              {event.boys_price !== null && `Chicos: €${event.boys_price}`}
            </span>
          )}
        </div>

        <div className="scarcity-pill">⏳ Plazas limitadas</div>

        <button className="view-btn" onClick={handleClick}>
          Ver detalles
        </button>
      </div>
    </div>
  );
};

export default PremiumEventCard;
