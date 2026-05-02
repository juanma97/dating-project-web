import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SeekerModal from '../../components/SeekerModal/component';
import { SeekerFilters } from '../../components/Seeker/component';
import HeroSection from '../../components/HeroSection/component';
import EventsList from '../../components/EventsList/component';
import { EventCardSkeletonList } from '../../components/EventCardSkeleton/component';
import NotifyMeModal, { NotifyMeSource } from '../../components/NotifyMeModal/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../../hooks/useSEO';
import { useScrollDepth } from '../../hooks/useScrollDepth';
import './component.css';

const DEFAULT_FILTERS: SeekerFilters = {
  ageMin: 25,
  ageMax: 45,
  gender: '',
  dateStart: null,
  dateEnd: null,
};

const EVENTS_PREVIEW_COUNT = 3;

interface LandingPageProps {
  filterModalOpen?: boolean;
  onFilterModalClose?: () => void;
  onFilteringChange?: (isFiltering: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  filterModalOpen = false,
  onFilterModalClose,
  onFilteringChange,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useSEO({
    title: 'Zapyens — Speed Dating en persona | Sin apps, sin swipes',
    description:
      'Eventos de speed dating en Madrid. Conoce 10 personas reales en citas de 5 minutos — sin apps, sin swipes. ¡Reserva tu plaza hoy!',
    canonical: 'https://zapyens.com/',
  });

  // ── Data ────────────────────────────────────────────────────────────────
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SeekerFilters>(DEFAULT_FILTERS);

  // ── NotifyMe ────────────────────────────────────────────────────────────
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifySource, setNotifySource] = useState<NotifyMeSource>('sticky-bar');

  // ── Sticky bar ──────────────────────────────────────────────────────────
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // ── FAQ accordion ───────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // CRO: scroll-based sticky bar trigger (replaces the 3s timer)
  useScrollDepth({
    stickyTriggerPct: 40,
    onStickyTrigger: () => {
      if (!stickyDismissed) setStickyVisible(true);
    },
  });

  // ── Fetch events ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await eventsApi.fetchEvents();
        setAllEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('landing.error_fetch'));
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, []);

  // ── SeekerModal filtering (fix: restore debounced filter logic) ──────────
  useEffect(() => {
    setIsFiltering(true);
    onFilteringChange?.(true);

    const timer = setTimeout(() => {
      const result = allEvents.filter((event) => {
        const eMin = event.min_age ?? 18;
        const eMax = event.max_age ?? 99;
        const matchesAge = eMin <= activeFilters.ageMax && eMax >= activeFilters.ageMin;

        const genderMatch =
          !activeFilters.gender ||
          !event.sexual_orientation ||
          event.sexual_orientation.toLowerCase() === activeFilters.gender.toLowerCase() ||
          event.sexual_orientation.toLowerCase() === 'all';

        let dateMatch = true;
        if (event.date && (activeFilters.dateStart || activeFilters.dateEnd)) {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          if (activeFilters.dateStart && activeFilters.dateEnd) {
            const start = new Date(activeFilters.dateStart);
            const end = new Date(activeFilters.dateEnd);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            dateMatch = eventDate >= start && eventDate <= end;
          } else if (activeFilters.dateStart) {
            const start = new Date(activeFilters.dateStart);
            start.setHours(0, 0, 0, 0);
            dateMatch = eventDate >= start;
          }
        }

        return matchesAge && genderMatch && dateMatch;
      });

      setFilteredEvents(result);
      setIsFiltering(false);
      onFilteringChange?.(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [allEvents, activeFilters]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleApplyFilters = useCallback((filters: SeekerFilters) => {
    setActiveFilters(filters);
  }, []);

  const handleStickyAvísame = () => {
    setStickyDismissed(true);
    setStickyVisible(false);
    setNotifySource('sticky-bar');
    setNotifyModalOpen(true);
  };

  const handleDismissSticky = () => {
    setStickyDismissed(true);
    setStickyVisible(false);
  };

  const handlePremiumNotifyMe = () => {
    setNotifySource('premium-promo');
    setNotifyModalOpen(true);
  };

  // Preview: first N events from filtered set
  const eventsPreview = filteredEvents.slice(0, EVENTS_PREVIEW_COUNT);
  const hasMoreEvents = filteredEvents.length > EVENTS_PREVIEW_COUNT;

  return (
    <div className="landing-page">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. EVENTS PREVIEW ───────────────────────────────────────── */}
      {/* CRO: Show real events immediately after hero to validate the product promise */}
      <section className="lp-section lp-events-section" id="eventos" aria-labelledby="events-section-title">
        <div className="container">
          <div className="lp-section-header">
            <h2 className="lp-section-title" id="events-section-title">
              Próximos eventos
            </h2>
            <span className="lp-badge">📍 Madrid</span>
          </div>

          {loading && <EventCardSkeletonList count={3} />}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <>
              <div className={`lp-events-list ${isFiltering ? 'is-filtering' : ''}`}>
                {eventsPreview.length > 0 ? (
                  <EventsList
                    events={eventsPreview}
                    onPremiumNotifyMe={handlePremiumNotifyMe}
                  />
                ) : (
                  <p className="lp-no-events">
                    {t('landing.no_events')}
                  </p>
                )}
              </div>

              {/* CRO: "Ver todos" CTA drives traffic to the wizard → higher intent qualification */}
              <div className="lp-events-cta-row">
                {hasMoreEvents && (
                  <span className="lp-more-label">
                    +{filteredEvents.length - EVENTS_PREVIEW_COUNT} eventos más disponibles
                  </span>
                )}
                <button
                  id="lp-find-event-btn"
                  className="lp-find-event-btn"
                  onClick={() => navigate('/encontrar')}
                >
                  Encontrar mi evento ✨
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── 3. PREMIUM TEASER ───────────────────────────────────────── */}
      {/* CRO: Introduces the Premium tier as an aspirational upsell before the "how it works" */}
      <section className="lp-section lp-premium-section" aria-labelledby="premium-section-title">
        <div className="container">
          <div className="lp-premium-card">
            <div className="lp-premium-badge">✨ Premium</div>
            <h2 className="lp-premium-title" id="premium-section-title">
              ¿Buscas algo más íntimo y exclusivo?
            </h2>
            <p className="lp-premium-body">
              Nuestros eventos Premium son organizados directamente por Zapyens — locales
              cuidados, ratios equilibrados de género, experiencia completa de principio a fin.
            </p>
            <div className="lp-premium-perks">
              <span className="lp-perk">🏛️ Locales exclusivos</span>
              <span className="lp-perk">⚖️ Ratio equilibrado</span>
              <span className="lp-perk">🎯 Matching garantizado</span>
              <span className="lp-perk">🍷 Bebida incluida</span>
            </div>
            <button
              id="lp-premium-cta-btn"
              className="lp-premium-cta-btn"
              onClick={() => navigate('/premium-events')}
            >
              Ver Eventos Premium →
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="lp-section lp-hiw-section" aria-labelledby="hiw-title">
        <div className="container">
          <h2 className="lp-section-title" id="hiw-title">¿Cómo funciona?</h2>
          <div className="lp-hiw-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="lp-hiw-step">
                <div className="lp-hiw-number">{i + 1}</div>
                <span className="lp-hiw-icon">{step.icon}</span>
                <h3 className="lp-hiw-step-title">{step.title}</h3>
                <p className="lp-hiw-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ABOUT / TRUST ────────────────────────────────────────── */}
      <section className="lp-section lp-about-section" aria-labelledby="about-title">
        <div className="container">
          <div className="lp-about-inner">
            <div className="lp-about-text">
              <h2 className="lp-section-title" id="about-title">
                Speed dating, redefinido.
              </h2>
              <p className="lp-about-body">
                Zapyens nació con una idea simple: las mejores conexiones ocurren en persona.
                Nos hartamos de los matches sin respuesta y las conversaciones que no van a ningún lado.
              </p>
              <p className="lp-about-body">
                Cada evento está diseñado para que conozcas a <strong>10 personas reales</strong> en una
                sola noche, en un ambiente relajado y sin presión. Sin algoritmos. Solo química.
              </p>
              <div className="lp-about-stats">
                <div className="lp-about-stat">
                  <span className="lp-about-stat-number">+500</span>
                  <span className="lp-about-stat-label">asistentes el último mes</span>
                </div>
                <div className="lp-about-stat">
                  <span className="lp-about-stat-number">82%</span>
                  <span className="lp-about-stat-label">de match rate</span>
                </div>
                <div className="lp-about-stat">
                  <span className="lp-about-stat-number">10</span>
                  <span className="lp-about-stat-label">citas por noche</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────── */}
      {/* CRO: FAQ removes last-mile objections right before the final CTA */}
      <section className="lp-section lp-faq-section" aria-labelledby="faq-title">
        <div className="container">
          <h2 className="lp-section-title" id="faq-title">Preguntas frecuentes</h2>
          <div className="lp-faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className={`lp-faq-item ${openFaq === i ? 'is-open' : ''}`}>
                <button
                  id={`faq-btn-${i}`}
                  className="lp-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {item.q}
                  <span className="lp-faq-icon" aria-hidden="true">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="lp-faq-answer"
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FINAL LEAD CAPTURE CTA ───────────────────────────────── */}
      {/* CRO: Repeated CTA at the bottom captures users who scrolled the whole page */}
      <section className="lp-section lp-final-cta-section" aria-labelledby="final-cta-title">
        <div className="container">
          <div className="lp-final-cta-card">
            <h2 className="lp-final-cta-title" id="final-cta-title">
              ¿Listo para conocer a alguien de verdad?
            </h2>
            <p className="lp-final-cta-body">
              Elige tu evento y reserva tu plaza en menos de 2 minutos.
              Las plazas se agotan rápido.
            </p>
            <button
              id="lp-final-cta-btn"
              className="lp-final-cta-btn"
              onClick={() => navigate('/encontrar')}
            >
              Encontrar mi evento ✨
            </button>
            <p className="lp-final-cta-microcopy">Sin registro · Pago seguro</p>
          </div>
        </div>
      </section>

      {/* ── SeekerModal (secondary — Toolbar filter icon) ───────────── */}
      <SeekerModal
        isOpen={filterModalOpen}
        onClose={() => onFilterModalClose?.()}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
        resultsCount={filteredEvents.length}
        isFiltering={isFiltering}
      />

      {/* ── NotifyMe Modal ───────────────────────────────────────────── */}
      <NotifyMeModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        source={notifySource}
      />

      {/* ── Sticky lead capture bar (scroll-triggered) ───────────────── */}
      {stickyVisible && !stickyDismissed && (
        <div className="sticky-bar" role="complementary" aria-label="Notificación de eventos">
          <div className="sticky-bar-content">
            <p className="sticky-bar-label">¿No ves nada que te convenza?</p>
            <button
              id="sticky-bar-avísame-btn"
              className="sticky-bar-btn"
              onClick={handleStickyAvísame}
            >
              Avísame del próximo 🔔
            </button>
          </div>
          <button
            className="sticky-bar-dismiss"
            onClick={handleDismissSticky}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

// ── Static content ────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: '🎯',
    title: 'Elige tu evento',
    desc: 'Filtra por edad, fecha y orientación. Encuentra el que encaja contigo.',
  },
  {
    icon: '🎟️',
    title: 'Reserva tu plaza',
    desc: 'Pago rápido y seguro. Recibes confirmación por email al instante.',
  },
  {
    icon: '💬',
    title: '10 citas de 5 min',
    desc: 'Conoce a 10 personas en una sola noche, en un ambiente relajado.',
  },
  {
    icon: '💌',
    title: 'Intercambia contactos',
    desc: 'Al finalizar, decides con quién quieres seguir hablando.',
  },
];

const FAQ_ITEMS = [
  {
    q: '¿Necesito registrarme en ninguna app?',
    a: 'No. Solo reservas tu plaza en el evento, te presentas en el lugar indicado y listo. Sin descargas ni perfiles.',
  },
  {
    q: '¿Qué pasa si voy solo/a?',
    a: 'La mayoría de asistentes van solos. De hecho, es la forma más cómoda de conocer gente nueva — todo el mundo está en la misma situación.',
  },
  {
    q: '¿Cómo funciona el sistema de match?',
    a: 'Después de cada cita de 5 minutos, ambas personas deciden en privado si quieren seguir en contacto. Solo se comparten los datos si los dos dijeron "sí".',
  },
  {
    q: '¿Puedo cancelar mi reserva?',
    a: 'Sí. Puedes cancelar hasta 48h antes del evento con reembolso completo. Después de ese plazo, ofrecemos crédito para un próximo evento.',
  },
  {
    q: '¿Para qué edades son los eventos?',
    a: 'Tenemos eventos para rangos de 18-25, 25-35, 30-40, 35-45 y 40-55 años. Así te aseguras de conocer a personas en tu misma etapa vital.',
  },
];

export default LandingPage;
