import React from 'react';
import { Event } from '../../api/model/event';
import EventCard from '../EventCard/component';
import './component.css';

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="empty-events">
        <p>No events found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsList;
