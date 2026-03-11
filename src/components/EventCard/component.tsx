import React from 'react';
import { Event } from '../../api/model/event';
import './component.css';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="event-card">
      {event.sexual_orientation && (
        <div className="event-type-badge">{event.sexual_orientation}</div>
      )}
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>

        <div className="event-meta-grid">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>
              {event.date} {event.time && `• ${event.time.substring(0, 5)}`}
            </span>
          </div>

          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>
              {event.place ? `${event.place}, ` : ''}
              {event.street_name ? `${event.street_name} ${event.street_number || ''}, ` : ''}
              {event.city}
            </span>
          </div>

          {(event.min_age || event.max_age) && (
            <div className="meta-item">
              <span className="meta-icon">👥</span>
              <span>
                Ages: {event.min_age || '18'} - {event.max_age || '99'}
              </span>
            </div>
          )}

          {(event.girls_price !== null || event.boys_price !== null) && (
            <div className="meta-item">
              <span className="meta-icon">💶</span>
              <span>
                {event.girls_price !== null && `Girls: €${event.girls_price}`}
                {event.girls_price !== null && event.boys_price !== null && ' | '}
                {event.boys_price !== null && `Boys: €${event.boys_price}`}
              </span>
            </div>
          )}
        </div>

        {event.description && <p className="event-description">{event.description}</p>}

        {event.source_url && (
          <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="view-btn">
            View on {event.source || "Organizer's Site"}
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
