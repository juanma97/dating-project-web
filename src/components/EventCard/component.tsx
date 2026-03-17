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
    <div className="event-card">
      {event.sexual_orientation && (
        <div className="event-type-badge">
          <span className="event-type-icon">{getOrientationIcon(event.sexual_orientation)}</span>
          {event.sexual_orientation}
        </div>
      )}
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>

        <div className="event-details-highlight">
          <div className="highlight-item date-time">
            <span className="icon">📅</span>
            <span className="text">
              <strong>{event.date}</strong> {event.time && `• ${event.time.substring(0, 5)}`}
            </span>
          </div>

          <div className="highlight-item location">
            <span className="icon">📍</span>
            <span className="text">
              <strong>{event.city}</strong>
              {event.place ? ` - ${event.place}` : ''}
              {event.street_name ? ` (${event.street_name} ${event.street_number || ''})` : ''}
            </span>
          </div>

          {(event.girls_price !== null || event.boys_price !== null) && (
            <div className="highlight-item price">
              <span className="icon">💶</span>
              <span className="text">
                {event.girls_price !== null && `Girls: €${event.girls_price}`}
                {event.girls_price !== null && event.boys_price !== null && (
                  <span className="separator">|</span>
                )}
                {event.boys_price !== null && `Boys: €${event.boys_price}`}
              </span>
            </div>
          )}

          {(event.min_age || event.max_age) && (
            <div className="highlight-item ages">
              <span className="icon">👥</span>
              <span className="text">
                Ages:{' '}
                <strong>
                  {event.min_age || '18'} - {event.max_age || '99'}
                </strong>
              </span>
            </div>
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
