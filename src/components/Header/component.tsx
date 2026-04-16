import React from 'react';
import { useTranslation } from 'react-i18next';
import './component.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t } = useTranslation();

  const displayTitle = title || t('landing.hero_title');

  return (
    <header className="hero-header">
      <div className="hero-bg-animation" aria-hidden="true">
        <span className="floating-shape shape-1">🌱</span>
        <span className="floating-shape shape-2">✨</span>
        <span className="floating-shape shape-3">🍃</span>
        <span className="floating-shape shape-4">🌿</span>
        <span className="floating-shape shape-5">🌸</span>
        <span className="floating-shape shape-6">✨</span>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{displayTitle}</h1>
        <p className="hero-subtitle">{t('landing.hero_subtitle')}</p>
      </div>
    </header>
  );
};

export default Header;
