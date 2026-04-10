import React from 'react';
import { useTranslation } from 'react-i18next';
import './component.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  const displayTitle = title || t('landing.hero_title');

  return (
    <header className="hero-header">
      <div className="hero-bg-animation" aria-hidden="true">
        <span className="floating-shape shape-1">💕</span>
        <span className="floating-shape shape-2">✨</span>
        <span className="floating-shape shape-3">💫</span>
        <span className="floating-shape shape-4">❤️</span>
        <span className="floating-shape shape-5">💕</span>
        <span className="floating-shape shape-6">✨</span>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{displayTitle}</h1>
      </div>
    </header>
  );
};

export default Header;
