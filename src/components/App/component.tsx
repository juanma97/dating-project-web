import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Toolbar from '../ToolbarComponent/Toolbar/component';
import LandingPage from '../../pages/LandingPage/component';
import FindEventPage from '../../pages/FindEventPage/component';
import AboutPage from '../../pages/AboutPage/component';
import EventDetailsPage from '../../pages/EventDetailsPage/component';
import PremiumEventsPage from '../../pages/PremiumEventsPage/component';
import PremiumEventDetailsPage from '../../pages/PremiumEventDetailsPage/component';
import VenuePartnersPage from '../../pages/VenuePartnersPage/component';
import AccessibleEventsPage from '../../pages/AccessibleEventsPage/component';
import AccessibleEventDetailsPage from '../../pages/AccessibleEventDetailsPage/component';
import DesignShowcase from '../../pages/DesignShowcase/component';
import LandingManPage from '../../pages/LandingManPage/component';
import LandingWomenPage from '../../pages/LandingWomenPage/component';
import AnalyticsTracker from '../AnalyticsTracker/component';
import './component.css';

const AppInner: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  // Standalone landing pages have their own minimal header — suppress the global Toolbar
  const isStandalonePage = ['/man', '/women'].includes(location.pathname);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  return (
    <div className="app-container">
      <AnalyticsTracker />
      {!isStandalonePage && (
        <Toolbar
          onFilterClick={isLanding ? () => setFilterModalOpen(true) : undefined}
          isFiltering={isFiltering}
        />
      )}
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                filterModalOpen={filterModalOpen}
                onFilterModalClose={() => setFilterModalOpen(false)}
                onFilteringChange={setIsFiltering}
              />
            }
          />
          <Route path="/encontrar" element={<FindEventPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/premium-events" element={<PremiumEventsPage />} />
          <Route path="/premium-events/:id" element={<PremiumEventDetailsPage />} />
          <Route path="/venues" element={<VenuePartnersPage />} />
          <Route path="/accessible-events" element={<AccessibleEventsPage />} />
          <Route path="/accessible-events/:id" element={<AccessibleEventDetailsPage />} />
          <Route path="/design-system" element={<DesignShowcase />} />
          {/* Curated Dating Events MVP — standalone landing pages */}
          <Route path="/man" element={<LandingManPage />} />
          <Route path="/women" element={<LandingWomenPage />} />
        </Routes>
      </main>
      {/*<CookieBanner />*/}
    </div>
  );
};

const App: React.FC = () => <AppInner />;

export default App;

