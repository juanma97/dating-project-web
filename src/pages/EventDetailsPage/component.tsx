import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { trackEventSourceClick, trackBuyTicketsIntent } from '../../utils/analytics';
import ShareButton from '../../components/ui/ShareButton/component';
import Toast from '../../components/ui/Toast/component';
import { useTranslation } from 'react-i18next';
import './component.css';

const EventDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedEvent = await eventsApi.getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          setError(t('event_details.not_found'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('event_details.load_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, t]);

  const handleSourceClick = () => {
    if (event) {
      trackEventSourceClick(event.id, event.title, event.source || 'Unknown');
    }
  };

  const handleBuyTickets = () => {
    if (event) {
      trackBuyTicketsIntent(event.id, event.title);
      setToast({ message: t('event_details.toast_buying'), type: 'info' });
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="spinner"></div>
        <p>{t('event_details.loading')}</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>{t('event_details.oops')}</h2>
        <p>{error || t('event_details.could_not_be_found')}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          {t('event_details.go_back')}
        </button>
      </div>
    );
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

  const translateOrientation = (orientation: string) => {
    const o = orientation.toLowerCase();
    if (o.includes('straight')) return t('seeker.straight');
    if (o.includes('gay')) return t('seeker.gay');
    if (o.includes('lesbian')) return t('seeker.lesbian');
    if (o.includes('bisexual')) return t('seeker.bisexual');
    if (o.includes('non-binary')) return t('seeker.non_binary');
    return orientation;
  };

  const addressParts = [event.street_name, event.street_number, event.city].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(', '));
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <div className="event-details-page">
        <div className="event-header-section">
          <button className="back-nav-btn" onClick={() => navigate(-1)}>
            {t('event_details.back_nav')}
          </button>
        </div>

        <div className="event-details-content">
          {event.sexual_orientation && (
            <div className="event-type-badge large-badge">
              <span className="event-type-icon">
                {getOrientationIcon(event.sexual_orientation)}
              </span>
              {translateOrientation(event.sexual_orientation)}
            </div>
          )}

          <h1 className="event-details-title">{event.title}</h1>
          {event.organizer && (
            <p className="event-organizer">
              {t('event_details.by_organizer', { organizer: event.organizer })}
            </p>
          )}

          <div className="event-meta-chips">
            <span className="meta-chip">
              📅 <strong>{event.date}</strong>
              {event.time ? ` · ${event.time.substring(0, 5)}` : ''}
            </span>

            <span className="meta-chip">
              📍 <strong>{event.place || event.city}</strong>
              {event.street_name ? ` · ${event.street_name} ${event.street_number || ''}` : ''}
            </span>

            {(event.girls_price !== null || event.boys_price !== null) && (
              <span className="meta-chip">
                💶{' '}
                {event.girls_price !== null && `${t('event_details.girls')} €${event.girls_price}`}
                {event.girls_price !== null && event.boys_price !== null && ' · '}
                {event.boys_price !== null && `${t('event_details.boys')} €${event.boys_price}`}
              </span>
            )}

            {(event.min_age || event.max_age) && (
              <span className="meta-chip">
                👥 {event.min_age || '18'}–{event.max_age || '99'} {t('event_details.years')}
              </span>
            )}
          </div>

          {event.description && (
            <div className="event-description-box">
              <h3>{t('event_details.about_this')}</h3>
              <p>{event.description}</p>
            </div>
          )}

          <div className="event-map-box">
            <h3>{t('event_details.location_map')}</h3>
            <p className="map-instruction">{t('event_details.map_instruction')}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${addressQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="map-wrapper-link"
            >
              <div className="map-container">
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="250"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </a>
          </div>
        </div>

        <div className="bottom-bar-spacer"></div>

        <div className="event-sticky-bottom-bar">
          <ShareButton
            title={event.title}
            eventId={event.id}
            isPremium={false}
            variant="outline"
            className="share-sticky-btn"
          />
          {event.source_url && (
            <a
              href={event.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              onClick={handleSourceClick}
            >
              {t('event_details.view_on', {
                source: event.source || t('event_details.organizers_site'),
              })}
            </a>
          )}
          <button className="btn-primary buy-tickets-btn" onClick={handleBuyTickets}>
            {t('event_details.buy_tickets')}
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};

export default EventDetailsPage;
