import { Routes, Route } from 'react-router-dom';
import Toolbar from '../ToolbarComponent/Toolbar/component';
import './component.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Toolbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>&copy; 2026 Speed Dating Connect. All rights reserved.</p>
      </footer>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <section className="home-hero">
      <h2>Premium Connections, Real-World Magic</h2>
      <p>Discover speed dating events near you and start connecting today.</p>
      <button className="cta-button">Explore Events</button>
    </section>
  );
};

export default App;
