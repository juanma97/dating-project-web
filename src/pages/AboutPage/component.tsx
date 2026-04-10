import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer/component';
import './component.css';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1 className="about-title">{t('about.hero_title')}</h1>
            <p className="about-subtitle">{t('about.hero_subtitle')}</p>
          </div>
        </section>

        {/* Mission & Values Section */}
        <section className="about-values">
          <h2 className="section-heading">{t('about.values_title')}</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3 className="value-title">{t('about.value_minimalist_title')}</h3>
              <p className="value-text">{t('about.value_minimalist_text')}</p>
            </div>

            <div className="value-card">
              <div className="value-icon">💎</div>
              <h3 className="value-title">{t('about.value_experience_title')}</h3>
              <p className="value-text">{t('about.value_experience_text')}</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">{t('about.value_connectivity_title')}</h3>
              <p className="value-text">{t('about.value_connectivity_text')}</p>
            </div>
          </div>
        </section>

        {/* Audience / Platform Section */}
        <section className="about-platform">
          <div className="platform-content">
            <h2 className="section-heading">{t('about.who_we_are_for')}</h2>
            <div className="audience-blocks">
              <div className="audience-block">
                <h3>{t('about.for_individuals_title')}</h3>
                <p>{t('about.for_individuals_text')}</p>
              </div>
              <div className="audience-block">
                <h3>{t('about.for_organizers_title')}</h3>
                <p>{t('about.for_organizers_text')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="about-cta">
          <h2>{t('about.cta_title')}</h2>
          <p>{t('about.cta_subtitle')}</p>
          <a href="/" className="cta-button">
            {t('about.cta_button')}
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
