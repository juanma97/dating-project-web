import React, { useState, useEffect } from 'react';
import SeekerModal from '../../components/SeekerModal/component';
import { SeekerFilters } from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import { EventCardSkeletonList } from '../../components/EventCardSkeleton/component';
import NotifyMeModal, { NotifyMeSource } from '../../components/NotifyMeModal/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../../hooks/useSEO';
import './component.css';

const DEFAULT_FILTERS: SeekerFilters = {
  ageMin: 25,
  ageMax: 45,
  gender: '',
  dateStart: null,
  dateEnd: null,
};

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

  useSEO({
    title: 'Zapyens — Speed Dating en persona | Sin apps, sin swipes',
    description:
      'Eventos de speed dating en Madrid. Conoce 10 personas reales en citas de 5 minutos — sin apps, sin swipes. ¡Reserva tu plaza hoy!',
    canonical: 'https://zapyens.com/',
  });

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SeekerFilters>(DEFAULT_FILTERS);
  const [isFiltering, setIsFiltering] = useState(false);

  // NotifyMeModal state
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [notifySource, setNotifySource] = useState<NotifyMeSource>('sticky-bar');

  // Sticky bar state
  const [stickyVisible, setStickyVisible] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // Show sticky bar after 3 seconds
  useEffect(() => {
    if (stickyDismissed) return;
    const timer = setTimeout(() => setStickyVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [stickyDismissed]);

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

  useEffect(() => {
    setIsFiltering(true);
    onFilteringChange?.(true);

    const timer = setTimeout(() => {
      const result = allEvents.filter((event) => {
        const effectiveMin = event.min_age ?? 18;
        const effectiveMax = event.max_age ?? 99;
        const matchesAge =
          !activeFilters ||
          (effectiveMin >= activeFilters.ageMin && effectiveMax <= activeFilters.ageMax);

        if (!activeFilters) return true;

        const genderMatch =
          !activeFilters.gender ||
          !event.sexual_orientation ||
          event.sexual_orientation.toLowerCase() === activeFilters.gender.toLowerCase() ||
          event.sexual_orientation.toLowerCase() === 'all';

        const eventDateStr = event.date;
        let dateMatch = true;
        if (eventDateStr) {
          const eventDate = new Date(eventDateStr);
          eventDate.setHours(0, 0, 0, 0);
          if (activeFilters.dateStart && activeFilters.dateEnd) {
            const start = new Date(activeFilters.dateStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(activeFilters.dateEnd);
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

  const handleApplyFilters = (filters: SeekerFilters) => {
    setActiveFilters(filters);
  };

  /** Opens NotifyMe modal from the sticky bar */
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

  /** Opens NotifyMe modal from the Premium promo card */
  const handlePremiumNotifyMe = () => {
    setNotifySource('premium-promo');
    setNotifyModalOpen(true);
  };

  return (
    <div className="landing-page">

      {/* ── Compact value strip ───────────────────────────── */}
      <div className="value-strip">
        <p className="value-strip-headline">
          Deja de hacer swipe. Conoce personas reales.
        </p>
        <p className="value-strip-proof">
          +500 personas el mes pasado · 82% consiguió un match
        </p>
      </div>

      {/* ── Events section ───────────────────────────────── */}
      <div className="container">
        <section className="events-section" id="events">
          {loading && <EventCardSkeletonList count={3} />}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div className={`events-list-container ${isFiltering ? 'is-filtering' : ''}`}>
              <EventsList
                events={filteredEvents}
                onPremiumNotifyMe={handlePremiumNotifyMe}
              />
            </div>
          )}
        </section>
      </div>

      {/* ── Seeker Filter Modal ───────────────────────────── */}
      <SeekerModal
        isOpen={filterModalOpen}
        onClose={() => onFilterModalClose?.()}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
        resultsCount={filteredEvents.length}
        isFiltering={isFiltering}
      />

      {/* ── Notify Me Modal (shared: sticky + premium) ─────── */}
      <NotifyMeModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        source={notifySource}
      />

      {/* ── Sticky lead capture bar (mobile only) ────────── */}
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

export default LandingPage;
