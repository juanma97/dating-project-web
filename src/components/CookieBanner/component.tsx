import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateGAConsent } from '../../utils/analytics';
import './component.css';

const CookieBanner: React.FC = () => {
  const { t } = useTranslation();
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
          <h3>{t('cookie_banner.title')}</h3>
          <p>{t('cookie_banner.text')}</p>
        </div>
        <div className="cookie-banner-actions">
          <button className="cookie-btn decline-btn" onClick={handleDecline}>
            {t('cookie_banner.decline')}
          </button>
          <button className="cookie-btn accept-btn" onClick={handleAccept}>
            {t('cookie_banner.accept')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

