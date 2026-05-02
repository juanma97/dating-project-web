import React, { useEffect, useRef } from 'react';
import { trackMatchGuaranteeView } from '../../utils/analytics';
import './component.css';

/**
 * CRO: The MatchGuaranteeModule is the primary objection-elimination surface.
 *
 * Placement strategy: directly above the event list.
 * This is the moment of highest purchase intent — the user has already
 * qualified themselves via the wizard and is looking at real events.
 * Social proof at this exact moment ("82% consiguió un match") converts
 * hesitation into action better than any headline or price anchor.
 *
 * Tracking: fires once when the module enters the viewport (IntersectionObserver).
 */
const MatchGuaranteeModule: React.FC = () => {
  const moduleRef = useRef<HTMLDivElement>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = moduleRef.current;
    if (!el) return;

    // CRO: Fire GA4 match_guarantee_view only when actually visible on screen
    // (not on mount — could be below the fold)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackMatchGuaranteeView();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="match-guarantee" ref={moduleRef} aria-label="Módulo de garantía de match">

      {/* ── Top stat strip ── */}
      <div className="match-stats">
        <div className="match-stat">
          <span className="match-stat-number">82%</span>
          <span className="match-stat-label">consiguió un match</span>
        </div>
        <div className="match-stat-divider" aria-hidden="true" />
        <div className="match-stat">
          <span className="match-stat-number">+500</span>
          <span className="match-stat-label">personas el último mes</span>
        </div>
        <div className="match-stat-divider" aria-hidden="true" />
        <div className="match-stat">
          <span className="match-stat-number">10</span>
          <span className="match-stat-label">citas en una noche</span>
        </div>
      </div>

      {/* ── Guarantee badge ── */}
      {/* CRO: "Garantía de Match" reframes speed dating as a reliable product,
          not a social gamble. Removes the biggest objection: "¿y si no conecto con nadie?" */}
      <div className="match-guarantee-badge">
        <span className="match-guarantee-icon" aria-hidden="true">🤝</span>
        <div className="match-guarantee-text">
          <strong>Garantía de Match</strong>
          <span>
            Si no conectas con nadie, te regalamos tu próximo evento.
          </span>
        </div>
      </div>

      {/* ── Avatar row (social proof: real people attended) ── */}
      {/* CRO: Faces are the most attention-grabbing UI element on a page.
          Even fictional avatars activate the "others are doing it" heuristic. */}
      <div className="match-avatars" aria-label="Personas que asistieron recientemente">
        {AVATAR_COLORS.map((color, i) => (
          <div
            key={i}
            className="match-avatar"
            style={{ background: color }}
            aria-hidden="true"
          >
            {AVATAR_INITIALS[i]}
          </div>
        ))}
        <span className="match-avatar-more">+493</span>
        <span className="match-avatars-label">el mes pasado</span>
      </div>
    </div>
  );
};

// Pseudo-avatars — diverse initials + harmonious palette
const AVATAR_INITIALS = ['A', 'M', 'C', 'J', 'L', 'S'];
const AVATAR_COLORS = [
  '#3a7d6b',
  '#f7a9a0',
  '#7fd1c2',
  '#ff6b5c',
  '#a8d5ba',
  '#6b8f86',
];

export default MatchGuaranteeModule;
