import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './component.css';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav className="navigation navigation--desktop">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {t('nav.home')}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {t('nav.about')}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/premium-events"
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--premium active' : 'nav-link nav-link--premium'
              }
            >
              {t('nav.premium_events')}
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* ── Mobile: hamburger button (stays inside toolbar) ── */}
      <button
        className={`hamburger-btn${open ? ' is-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('nav.close_menu') : t('nav.open_menu')}
        aria-expanded={open}
      >
        <span className="ham-bar" />
        <span className="ham-bar" />
        <span className="ham-bar" />
      </button>

      {/* ── Portal: renders directly into <body> ── */}
      {createPortal(
        <>
          {/* Backdrop */}
          <div
            className={`nav-backdrop${open ? ' is-visible' : ''}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <nav
            className={`navigation--mobile${open ? ' is-open' : ''}`}
            aria-hidden={!open}
          >
            <ul className="nav-list--mobile">
              {/* Priority 1 — Eventos Premium */}
              <li>
                <NavLink
                  to="/premium-events"
                  className={({ isActive }) =>
                    isActive ? 'nav-link--premium-mobile active' : 'nav-link--premium-mobile'
                  }
                >
                  {t('nav.premium_events')}
                </NavLink>
              </li>
              {/* Priority 2 — Home / Eventos */}
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
                  }
                >
                  {t('nav.events')}
                </NavLink>
              </li>
              {/* Priority 3 — About */}
              <li className="nav-item--secondary">
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? 'nav-link-mobile active' : 'nav-link-mobile'
                  }
                >
                  {t('nav.about')}
                </NavLink>
              </li>
            </ul>
          </nav>
        </>,
        document.body,
      )}
    </>
  );
};

export default Navigation;

