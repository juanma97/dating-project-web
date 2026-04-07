import React from 'react';
import { useTranslation } from 'react-i18next';
import './component.css';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-logo">Speed Dating Connect</span>
          <p className="footer-tagline">{t('footer.tagline')}</p>
        </div>
        <div className="footer-right">
            <div className="social-links">
              <a href="#" className="social-link">
                Instagram
              </a>
              <a href="#" className="social-link">
                Twitter
              </a>
            </div>
          <p className="copyright">&copy; 2026 Speed Dating Connect. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

