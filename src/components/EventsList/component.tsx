import React from 'react';
import { useTranslation } from 'react-i18next';
import { Event } from '../../api/model/event';
import EventCard from '../EventCard/component';
import PremiumPromoCard from '../PremiumPromoCard/component';
import './component.css';

const PROMO_INJECT_AFTER = 1; // 0-indexed: inject after the 2nd card

interface EventsListProps {
  events: Event[];
  onPremiumNotifyMe?: () => void;
}

const EventsList: React.FC<EventsListProps> = ({ events, onPremiumNotifyMe }) => {
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
      {events.map((event, index) => (
        <React.Fragment key={event.id}>
          <EventCard event={event} />
          {index === PROMO_INJECT_AFTER && (
            <PremiumPromoCard onNotifyMe={onPremiumNotifyMe} />
          )}
        </React.Fragment>
      ))}
      {/* If fewer than 2 events exist, inject promo at the end */}
      {events.length <= PROMO_INJECT_AFTER && (
        <PremiumPromoCard onNotifyMe={onPremiumNotifyMe} />
      )}
    </div>
  );
};

export default EventsList;
