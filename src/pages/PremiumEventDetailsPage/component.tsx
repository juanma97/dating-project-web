import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event } from '../../api/model/event';
import { premiumEventsApi } from '../../api/supabase/premiumEvents';
import LeadCaptureModal from '../../components/LeadCaptureModal/component';
import {
  trackViewPremiumEventDetail,
  trackPremiumEventCtaClick,
  trackPageView,
} from '../../utils/analytics';
import '../EventDetailsPage/component.css'; // base layout styles
import './component.css';


// Replace with your real WhatsApp number (international format, no + or spaces)
const WHATSAPP_NUMBER = import.meta.env.VITE_PHONE_NUMBER_CONTACT;
const WHATSAPP_MESSAGE = encodeURIComponent(
  '¡Hola! Quiero más información sobre el evento de speed dating premium 😊',
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const PremiumEventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(`/premium-events/${id}`);

    const fetchEvent = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const fetchedEvent = await premiumEventsApi.getEventById(id);
        if (fetchedEvent) {
          setEvent(fetchedEvent);
          trackViewPremiumEventDetail(id);
        } else {
          setError('Evento no encontrado');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error cargando el evento');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleApuntarme = () => {
    if (event) {
      trackPremiumEventCtaClick(event.id);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="pd-spinner" />
        <p>Cargando evento...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-details-error">
        <h2>Oops!</h2>
        <p>{error || 'No se encontró el evento.'}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  // Google Maps
  const addressParts = [event.street_name, event.street_number, event.city].filter(Boolean);
  const addressQuery = encodeURIComponent(addressParts.join(', '));
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <div className="event-details-page">
        {/* Back nav */}
        <div className="event-header-section">
          <button className="back-nav-btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>

        <div className="event-details-content">
          {/* Premium badges */}
          <div className="pd-badges-row">
            <span className="pd-badge pd-badge--premium">✨ Organizado por nosotros</span>
            <span className="pd-badge pd-badge--nuevo">🔥 Nuevo</span>
          </div>

          <h1 className="event-details-title">{event.title}</h1>
          {event.organizer && <p className="event-organizer">por {event.organizer}</p>}

          {/* Scarcity */}
          <div className="pd-scarcity-bar">
            ⏳ Plazas limitadas — estamos validando demanda
          </div>

          {/* Meta chips */}
          <div className="event-meta-chips">
            <span className="meta-chip">
              📅 <strong>{event.date}</strong>
              {event.time ? ` · ${event.time.substring(0, 5)}` : ''}
            </span>

            <span className="meta-chip">
              📍 <strong>{event.place || event.city}</strong>
              {event.street_name ? ` · ${event.street_name} ${event.street_number || ''}` : ''}
            </span>

            {(event.min_age || event.max_age) && (
              <span className="meta-chip age-highlight-chip">
                👥 Edad: <strong>{event.min_age || 18}–{event.max_age || 99} años</strong>
              </span>
            )}

            {(event.girls_price !== null || event.boys_price !== null) && (
              <span className="meta-chip price-highlight-chip">
                💶{' '}
                {event.girls_price !== null && `Chicas: €${event.girls_price}`}
                {event.girls_price !== null && event.boys_price !== null && ' | '}
                {event.boys_price !== null && `Chicos: €${event.boys_price}`}
              </span>
            )}
          </div>

          {/* Highlighted price block */}
          {(event.girls_price !== null || event.boys_price !== null) && (
            <div className="pd-price-block">
              {event.girls_price !== null && (
                <div className="pd-price-item">
                  <span className="pd-price-label">Chicas</span>
                  <span className="pd-price-value">€{event.girls_price}</span>
                </div>
              )}
              {event.boys_price !== null && (
                <div className="pd-price-item">
                  <span className="pd-price-label">Chicos</span>
                  <span className="pd-price-value">€{event.boys_price}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="event-description-box">
              <h3>Sobre el evento</h3>
              <p>{event.description}</p>
            </div>
          )}

          {/* Map */}
          {addressParts.length > 0 && (
            <div className="event-map-box">
              <h3>Localización</h3>
              <p className="map-instruction">Haz clic en el mapa para abrir en Google Maps</p>
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
                    title="Google Maps"
                  />
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Spacer for sticky bar */}
        <div className="bottom-bar-spacer" />

        {/* Sticky CTA bar */}
        <div className="event-sticky-bottom-bar">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            💬 Más información
          </a>
          <button className="btn-primary buy-tickets-btn" onClick={handleApuntarme}>
            👉 Apuntarme (Plazas limitadas)
          </button>
        </div>
      </div>

      {/* Lead capture modal */}
      {showModal && event && (
        <LeadCaptureModal event={event} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default PremiumEventDetailsPage;
