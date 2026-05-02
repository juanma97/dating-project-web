import React from 'react';
import { useNavigate } from 'react-router-dom';
import { trackHeroCtaClick } from '../../utils/analytics';
import './component.css';

interface HeroSectionProps {
  /** Optional — kept for backwards compat, ignored in favour of navigate */
  onStartWizard?: () => void;
}

/**
 * CRO: The hero is the most critical conversion surface on the page.
 * The 3-second rule says users decide to stay or leave within 3 seconds.
 * Strategy:
 *  - Full-viewport animated gradient creates immediate visual impact (zero-cost, no video)
 *  - Headline leads with the pain ("Cansado de los matches que no llevan a nada")
 *    then immediately pivots to the outcome ("Conoce 10 personas reales esta semana")
 *  - Single, unambiguous CTA — no decision paralysis
 *  - "📍 Solo en Madrid" badge sets expectations upfront, reducing irrelevant traffic
 */
const HeroSection: React.FC<HeroSectionProps> = () => {
  const navigate = useNavigate();

  const handleCta = () => {
    trackHeroCtaClick();
    navigate('/encontrar');
  };

  return (
    <section className="hero-section" aria-label="Sección principal">
      {/* Animated gradient background — performant alternative to video */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* Floating orbs for depth — pure CSS, GPU-composited (transform/opacity only) */}
      <div className="hero-orb hero-orb--1" aria-hidden="true" />
      <div className="hero-orb hero-orb--2" aria-hidden="true" />
      <div className="hero-orb hero-orb--3" aria-hidden="true" />

      <div className="hero-content">
        {/* CRO: City badge sets geographic context immediately,
            eliminating confusion for users outside Madrid */}
        <div className="hero-location-badge">
          <span className="hero-location-dot" />
          Solo en Madrid
        </div>

        {/* CRO: Pain → Outcome headline structure.
            "Cansado" triggers recognition ("that's me").
            "10 personas reales esta semana" creates concrete, achievable desire. */}
        <h1 className="hero-headline">
          Deja de hacer{' '}
          <span className="hero-headline-accent">swipe.</span>
          <br />
          Conoce personas reales.
        </h1>

        <p className="hero-subheadline">
          Speed dating en persona — 10 citas de 5 minutos.<br />
          Sin apps. Sin algoritmos. Solo química real.
        </p>

        {/* CRO: Social proof directly under the headline — reduces risk perception
            before asking for the click. Numbers are specific = more credible. */}
        <div className="hero-social-proof">
          <span className="hero-proof-item">
            <strong>+500</strong> personas el mes pasado
          </span>
          <span className="hero-proof-divider" aria-hidden="true">·</span>
          <span className="hero-proof-item">
            <strong>82%</strong> consiguió un match
          </span>
        </div>

        {/* CRO: CTA text focuses on the benefit, not the action.
            "Encontrar mi evento" > "Ver eventos" — personalized intent signal. */}
        <button
          id="hero-cta-btn"
          className="hero-cta-btn"
          onClick={handleCta}
          aria-label="Encontrar mi evento de speed dating"
        >
          Encontrar mi evento ✨
        </button>

        {/* CRO: Microcopy below CTA eliminates the last objection (commitment fear) */}
        <p className="hero-cta-microcopy">
          Sin registro previo · 2 minutos
        </p>
      </div>

      {/* Scroll indicator — subtle affordance to explore below the fold */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="hero-scroll-dot" />
      </div>
    </section>
  );
};

export default HeroSection;
