import React from 'react';
import './component.css';

export interface SpeedyEvent {
  id: string;
  title: string;
  date: string;
  city: string;
  organizerUrl: string;
  type: string;
}

interface EventCardProps {
  event: SpeedyEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="event-card">
      <div className="event-type-badge">{event.type}</div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-details">
          <span className="event-city">{event.city}</span> •{' '}
          <span className="event-date">{event.date}</span>
        </p>
        <a href={event.organizerUrl} target="_blank" rel="noopener noreferrer" className="view-btn">
          View on Organizer&apos;s Site
        </a>
      </div>
    </div>
  );
};

export default EventCard;
