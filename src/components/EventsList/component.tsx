import React from 'react';
import { useTranslation } from 'react-i18next';
import { Event } from '../../api/model/event';
import EventCard from '../EventCard/component';
import './component.css';

interface EventsListProps {
  events: Event[];
}

const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const { t } = useTranslation();

  if (events.length === 0) {
    return (
      <div className="empty-events">
        <p>{t('landing.no_events')}</p>
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

