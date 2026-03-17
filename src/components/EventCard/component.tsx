import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { trackEventClick } from '../../utils/analytics';
import './component.css';

interface EventCardProps {
  event: Event;
}

const getOrientationIcon = (orientation: string) => {
  if (!orientation) return '';
  const o = orientation.toLowerCase();
  if (o.includes('straight')) return '👫';
  if (o.includes('gay')) return '👬';
  if (o.includes('lesbian')) return '👭';
  if (o.includes('bisexual')) return '🏳️‍🌈';
  if (o.includes('non-binary')) return '🏳️‍⚧️';
  return '✨';
};

const getOrientationAccent = (orientation: string | null): string => {
  if (!orientation) return '';
  const o = orientation.toLowerCase();
  if (o.includes('straight')) return 'accent-straight';
  if (o.includes('gay')) return 'accent-gay';
  if (o.includes('lesbian')) return 'accent-lesbian';
  if (o.includes('bisexual')) return 'accent-bisexual';
  if (o.includes('non-binary')) return 'accent-nonbinary';
  return '';
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleEventClick = () => {
    trackEventClick({
      id: event.id,
      title: event.title,
      source: 'Internal' as string, // the user is staying internal now
      city: event.city || 'Unknown',
      url: `/events/${event.id}`,
    });
    navigate(`/events/${event.id}`);
  };

  return (
    <div className={`event-card ${getOrientationAccent(event.sexual_orientation)}`}>
      {event.image && (
        <div className="event-image-banner">
          <img src={event.image} alt={event.title} loading="lazy" />
        </div>
      )}
      {event.sexual_orientation && (
        <div className="event-type-badge">
          <span className="event-type-icon">{getOrientationIcon(event.sexual_orientation)}</span>
          {event.sexual_orientation}
        </div>
      )}
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

          {(event.girls_price !== null || event.boys_price !== null) && (
            <span className="meta-chip price-chip">
              💶 {event.girls_price !== null && `Girls €${event.girls_price}`}
              {event.girls_price !== null && event.boys_price !== null && ' · '}
              {event.boys_price !== null && `Boys €${event.boys_price}`}
            </span>
          )}

          {(event.min_age || event.max_age) && (
            <span className="meta-chip">
              👥 {event.min_age || '18'}–{event.max_age || '99'} years
            </span>
          )}
        </div>

        <button className="view-btn" onClick={handleEventClick}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default EventCard;
