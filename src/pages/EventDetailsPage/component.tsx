import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { trackEventSourceClick, trackBuyTicketsIntent, trackPageView } from '../../utils/analytics';
import './component.css';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(`/events/${id}`);

    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedEvent = await eventsApi.getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSourceClick = () => {
    if (event) {
      trackEventSourceClick(event.id, event.title, event.source || 'Unknown');
    }
  };

  const handleBuyTickets = () => {
    if (event) {
      trackBuyTicketsIntent(event.id, event.title);
      setToastMessage('Buying tickets will be available soon! We are measuring demand.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>Oops!</h2>
        <p>{error || 'Event could not be found.'}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Go Back
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

  // Google Maps address construction
  const addressParts = [event.street_name, event.street_number, event.city].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(', '));
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="event-details-page">
      <div className="event-header-section">
        <button className="back-nav-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="event-details-content">
        {event.sexual_orientation && (
          <div className="event-type-badge large-badge">
            <span className="event-type-icon">{getOrientationIcon(event.sexual_orientation)}</span>
            {event.sexual_orientation}
          </div>
        )}

        <h1 className="event-details-title">{event.title}</h1>
        {event.organizer && <p className="event-organizer">by {event.organizer}</p>}

        <div className="event-info-grid">
          <div className="info-item">
            <div className="info-icon">📅</div>
            <div className="info-content">
              <h4>Date & Time</h4>
              <p>
                <strong>{event.date}</strong> {event.time ? `• ${event.time.substring(0, 5)}` : ''}
              </p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">📍</div>
            <div className="info-content">
              <h4>Location</h4>
              <p>
                <strong>{event.place || event.city}</strong>
                {event.street_name && <br />}
                {event.street_name ? `${event.street_name} ${event.street_number || ''}` : ''}
              </p>
            </div>
          </div>

          {(event.girls_price !== null || event.boys_price !== null) && (
            <div className="info-item">
              <div className="info-icon">💶</div>
              <div className="info-content">
                <h4>Price</h4>
                <p>
                  {event.girls_price !== null && `Girls: €${event.girls_price}`}
                  {event.girls_price !== null && event.boys_price !== null && (
                    <span className="separator"> | </span>
                  )}
                  {event.boys_price !== null && `Boys: €${event.boys_price}`}
                </p>
              </div>
            </div>
          )}

          {(event.min_age || event.max_age) && (
            <div className="info-item">
              <div className="info-icon">👥</div>
              <div className="info-content">
                <h4>Ages</h4>
                <p>
                  <strong>
                    {event.min_age || '18'} - {event.max_age || '99'}
                  </strong>{' '}
                  years old
                </p>
              </div>
            </div>
          )}
        </div>

        {event.description && (
          <div className="event-description-box">
            <h3>About this event</h3>
            <p>{event.description}</p>
          </div>
        )}

        <div className="event-map-box">
          <h3>Location Map</h3>
          <p className="map-instruction">Click the map to open in Google Maps</p>
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

      {toastMessage && (
        <div className="toast-notification">
          <span className="toast-icon">ℹ️</span>
          {toastMessage}
        </div>
      )}

      {/* Spacer to prevent content from hiding behind the fixed bottom bar */}
      <div className="bottom-bar-spacer"></div>

      <div className="event-sticky-bottom-bar">
        {event.source_url && (
          <a
            href={event.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            onClick={handleSourceClick}
          >
            View on {event.source || "Organizer's Site"}
          </a>
        )}
        <button className="btn-primary buy-tickets-btn" onClick={handleBuyTickets}>
          Comprar entradas
        </button>
      </div>
    </div>
  );
};

export default EventDetailsPage;
