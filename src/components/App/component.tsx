import { Routes, Route } from 'react-router-dom';
import Toolbar from '../ToolbarComponent/Toolbar/component';
import LandingPage from '../../pages/LandingPage/component';
import AboutPage from '../../pages/AboutPage/component';
import EventDetailsPage from '../../pages/EventDetailsPage/component';
import PremiumEventsPage from '../../pages/PremiumEventsPage/component';
import PremiumEventDetailsPage from '../../pages/PremiumEventDetailsPage/component';
import './component.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Toolbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/premium-events" element={<PremiumEventsPage />} />
          <Route path="/premium-events/:id" element={<PremiumEventDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
