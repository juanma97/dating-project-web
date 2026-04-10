import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/component';
import Seeker, { SeekerFilters } from '../../components/Seeker/component';
import EventsList from '../../components/EventsList/component';
import Footer from '../../components/Footer/component';
import { Event } from '../../api/model/event';
import { eventsApi } from '../../api/supabase/events';
import { useTranslation } from 'react-i18next';
import './component.css';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SeekerFilters | null>(null);
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

        // City filtering
        const cityMatch =
          !activeFilters.city ||
          (event.city && event.city.toLowerCase().includes(activeFilters.city.toLowerCase()));

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

        return matchesAge && genderMatch && cityMatch && dateMatch;
      });

      setFilteredEvents(result);
      setIsFiltering(false);
    }, 300); // Small delay for visual feedback

    return () => clearTimeout(timer);
  }, [allEvents, activeFilters]);

  return (
    <div className="landing-page">
      <Header />

      <div className="container">
        <Seeker
          onChange={setActiveFilters}
          resultsCount={filteredEvents.length}
          isFiltering={isFiltering}
        />
        <section className="events-section" id="events">
          <div className="section-header">
            <h2 className="section-title">{t('landing.upcoming_events')}</h2>
            {!loading && !error && (
              <span className={`results-badge ${isFiltering ? 'is-filtering' : ''}`}>
                {filteredEvents.length === 1
                  ? t('landing.results_found_one')
                  : t('landing.results_found', { count: filteredEvents.length })}
              </span>
            )}
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

      <Footer />
    </div>
  );
};

export default LandingPage;
