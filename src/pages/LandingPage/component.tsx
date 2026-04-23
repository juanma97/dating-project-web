import React, { useState, useEffect } from 'react';
import SeekerModal from '../../components/SeekerModal/component';
import { SeekerFilters } from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { useTranslation } from 'react-i18next';
import { useSEO } from '../../hooks/useSEO';
import './component.css';

const DEFAULT_FILTERS: SeekerFilters = {
  ageMin: 25,
  ageMax: 40,
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
      'Eventos de speed dating en tu ciudad. Conoce 10 personas reales en citas de 5 minutos — sin apps, sin swipes. ¡Reserva tu plaza hoy!',
    canonical: 'https://zapyens.com/',
  });

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SeekerFilters>(DEFAULT_FILTERS);
  const [isFiltering, setIsFiltering] = useState(false);

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
        // Age filtering
        const effectiveMin = event.min_age ?? 18;
        const effectiveMax = event.max_age ?? 99;
        const matchesAge =
          !activeFilters ||
          (effectiveMin >= activeFilters.ageMin && effectiveMax <= activeFilters.ageMax);

        if (!activeFilters) return true;

        // Gender / Sexual Orientation filtering
        const genderMatch =
          !activeFilters.gender ||
          !event.sexual_orientation ||
          event.sexual_orientation.toLowerCase() === activeFilters.gender.toLowerCase() ||
          event.sexual_orientation.toLowerCase() === 'all';

        // Date filtering
        const eventDateStr = event.date; // format: "YYYY-MM-DD"
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
    }, 300); // Small delay for visual feedback

    return () => clearTimeout(timer);
  }, [allEvents, activeFilters]);

  const handleApplyFilters = (filters: SeekerFilters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="landing-page">
      {/*<Header />*/}

      {/* Social Proof Strip */}
      {/*<div className="social-proof-strip">
        <span className="social-proof-stat">{t('landing.social_proof_stat1')}</span>
        <span className="social-proof-divider">·</span>
        <span className="social-proof-stat">{t('landing.social_proof_stat2')}</span>
        <span className="social-proof-divider">·</span>
        <span className="social-proof-stat">{t('landing.social_proof_stat3')}</span>
      </div>*/}

      {/* How It Works */}
      {/*<div className="container">
        <section className="how-it-works-section">
          <h2 className="how-it-works-title">{t('landing.how_it_works_title')}</h2>
          <div className="how-it-works-steps">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={i} className="hiw-step">
                <div className="hiw-step-icon">{t(`landing.${step.icon}`)}</div>
                <div className="hiw-step-number">{i + 1}</div>
                <h3 className="hiw-step-title">{t(`landing.${step.title}`)}</h3>
                <p className="hiw-step-desc">{t(`landing.${step.desc}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>*/}

      <div className="container">
        <section className="events-section" id="events">
          <div className="section-header">
            {/*<h2 className="section-title">{t('landing.upcoming_events')}</h2>*/}
            {/*{!loading && !error && (
              <span className={`results-badge ${isFiltering ? 'is-filtering' : ''}`}>
                {filteredEvents.length === 1
                  ? t('landing.results_found_one')
                  : t('landing.results_found', { count: filteredEvents.length })}
              </span>
            )}*/}
          </div>
          {loading && <p className="loading-message">{t('landing.loading_events')}</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div className={`events-list-container ${isFiltering ? 'is-filtering' : ''}`}>
              <EventsList events={filteredEvents} />
            </div>
          )}
        </section>
      </div>

      {/* Seeker Filter Modal */}
      <SeekerModal
        isOpen={filterModalOpen}
        onClose={() => onFilterModalClose?.()}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
        resultsCount={filteredEvents.length}
        isFiltering={isFiltering}
      />

      <Footer />
    </div>
  );
};

export default LandingPage;

