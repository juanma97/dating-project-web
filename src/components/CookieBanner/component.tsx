import React, { useState, useEffect } from 'react';
import { updateGAConsent } from '../../utils/analytics';
import './component.css';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'granted');
    updateGAConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'denied');
    updateGAConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <h3>Valoramos tu privacidad</h3>
          <p>
            Utilizamos cookies para mejorar tu experiencia, analizar el tráfico del sitio y personalizar el contenido. 
            Al hacer clic en "Aceptar", consientes el uso de cookies en nuestra web para análisis y métricas (incluyendo Google Analytics).
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn decline-btn" onClick={handleDecline}>
            Rechazar
          </button>
          <button className="cookie-btn accept-btn" onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
