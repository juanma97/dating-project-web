import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import WizardFunnel, { WizardFilters } from '../../components/WizardFunnel/component';
import MatchGuaranteeModule from '../../components/MatchGuaranteeModule/component';
import NotifyMeModal, { NotifyMeSource } from '../../components/NotifyMeModal/component';
import EventsList from '../../components/EventsList/component';
import { EventCardSkeletonList } from '../../components/EventCardSkeleton/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { SeekerFilters } from '../../components/Seeker/component';
import { useSEO } from '../../hooks/useSEO';
import { useTranslation } from 'react-i18next';
import './component.css';

// ─── Seeker filter utils ──────────────────────────────────────────────────

const SEEKER_STORAGE_KEY = 'seekerFilters';

function readSeekerFilters(): SeekerFilters | null {
  try {
    const raw = sessionStorage.getItem(SEEKER_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(SEEKER_STORAGE_KEY); // consume once
    return JSON.parse(raw) as SeekerFilters;
  } catch {
    return null;
  }
}

function applyFilters(events: Event[], filters: SeekerFilters): Event[] {
  return events.filter((event) => {
    const eMin = event.min_age ?? 18;
    const eMax = event.max_age ?? 99;
    const matchesAge = eMin <= filters.ageMax && eMax >= filters.ageMin;

    const genderMatch =
      !filters.gender ||
      !event.sexual_orientation ||
      event.sexual_orientation.toLowerCase() === filters.gender.toLowerCase() ||
      event.sexual_orientation.toLowerCase() === 'all';

    let dateMatch = true;
    if (event.date && (filters.dateStart || filters.dateEnd)) {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      if (filters.dateStart && filters.dateEnd) {
        const start = new Date(filters.dateStart);
        const end = new Date(filters.dateEnd);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        dateMatch = eventDate >= start && eventDate <= end;
      } else if (filters.dateStart) {
        const start = new Date(filters.dateStart);
        start.setHours(0, 0, 0, 0);
        dateMatch = eventDate >= start;
      }
    }

    return matchesAge && genderMatch && dateMatch;
  });
}

// ─────────────────────────────────────────────────────────────────────────────

const FindEventPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useSEO({
    title: 'Encuentra tu evento — Zapyens',
    description:
      'Dinos tu edad y cuándo quieres ir — te mostramos los eventos de speed dating en Madrid que encajan contigo.',
    canonical: 'https://zapyens.com/encontrar',
  });

  // ── Seeker filters from sessionStorage (set by SeekerModal on landing) ──
  // Read synchronously on mount so there's no flash of "wrong mode"
  const [seekerFilters] = useState<SeekerFilters | null>(() => readSeekerFilters());

  // ── Event data ───────────────────────────────────────────────────────────
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifySource] = useState<NotifyMeSource>('premium-promo');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await eventsApi.fetchEvents();
        setAllEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('landing.error_fetch'));
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, []);

  // ── Filtered results (only when coming from SeekerModal) ─────────────────
  const filteredEvents = useMemo(
    () => (seekerFilters ? applyFilters(allEvents, seekerFilters) : allEvents),
    [allEvents, seekerFilters],
  );

  const handleWizardComplete = (_filters: WizardFilters, _matchCount: number) => {
    // Future: persist filters for back-navigation recovery
  };

  // ── Mode A: Seeker filters present → show results directly ───────────────
  // This is the path triggered by SeekerModal on the landing page.
  // The user has already filtered — skip the wizard and show matching events.
  if (seekerFilters) {
    return (
      <div className="find-event-page">
        {/* Header */}
        <div className="find-event-header">
          <button
            className="find-event-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Volver a la página anterior"
          >
            ← Volver
          </button>
          <div className="find-event-title-block">
            <h1 className="find-event-title">Resultados para ti</h1>
            <p className="find-event-subtitle">📍 Solo en Madrid</p>
          </div>
        </div>

        <div className="container">
          {/* Social proof */}
          <MatchGuaranteeModule />

          {/* Results */}
          <section className="fep-results-section" aria-label="Eventos filtrados">
            {loading && <EventCardSkeletonList count={3} />}
            {error && <p className="find-event-error">{error}</p>}

            {!loading && !error && (
              <>
                <p className="fep-results-count">
                  {filteredEvents.length > 0
                    ? `${filteredEvents.length} evento${filteredEvents.length !== 1 ? 's' : ''} disponible${filteredEvents.length !== 1 ? 's' : ''} para ti`
                    : 'No encontramos eventos para tus filtros'}
                </p>

                {filteredEvents.length > 0 ? (
                  <EventsList
                    events={filteredEvents}
                    onPremiumNotifyMe={() => setNotifyModalOpen(true)}
                  />
                ) : (
                  /* Empty state: let them run the wizard to broaden search */
                  <div className="fep-empty-state">
                    <p className="fep-empty-body">
                      No hay eventos que encajen exactamente con tus criterios ahora mismo.
                      Prueba el asistente para explorar más opciones.
                    </p>
                    <button
                      id="fep-use-wizard-btn"
                      className="fep-wizard-btn"
                      onClick={() => navigate('/encontrar', { replace: true })}
                    >
                      🔍 Usar el asistente
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <NotifyMeModal
          isOpen={notifyModalOpen}
          onClose={() => setNotifyModalOpen(false)}
          source={notifySource}
        />
      </div>
    );
  }

  // ── Mode B: No pre-filters → show wizard as before ───────────────────────
  return (
    <div className="find-event-page">
      {/* Page header */}
      <div className="find-event-header">
        <button
          className="find-event-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Volver a la página anterior"
        >
          ← Volver
        </button>
        <div className="find-event-title-block">
          <h1 className="find-event-title">Encuentra tu evento</h1>
          <p className="find-event-subtitle">📍 Solo en Madrid</p>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="container">
          <p className="find-event-error">{error}</p>
        </div>
      )}

      {/* Social proof — shown above wizard to prime confidence */}
      <div className="container">
        <MatchGuaranteeModule />
      </div>

      {/* Wizard */}
      <WizardFunnel
        allEvents={allEvents}
        loading={loading}
        onComplete={handleWizardComplete}
        onPremiumNotifyMe={() => setNotifyModalOpen(true)}
      />

      <NotifyMeModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        source={notifySource}
      />
    </div>
  );
};

export default FindEventPage;
