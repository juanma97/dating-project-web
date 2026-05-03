import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHeroVariant, HeroVariant } from '../../utils/abTest';
import {
  trackHeroCtaClick,
  trackHeroVideoLoaded,
  trackHeroVideoError,
} from '../../utils/analytics';
import './component.css';

// ─── Performance contract ─────────────────────────────────────────────────
//
// Variant A ('gradient') — control:
//   • No <video> element in the DOM → zero video bytes downloaded.
//   • Renders the existing animated CSS gradient (GPU-composited).
//
// Variant B ('video'):
//   • <video> element mounted with preload="none" → browser does NOT
//     prefetch anything until autoplay kicks in.
//   • The video is served from /public so it benefits from browser caching.
//   • prefers-reduced-motion → even variant B falls back to gradient.
//   • Until the video fires 'canplay', we show the gradient as a fallback
//     (seamless — no layout shift, no blank flash).
//   • filter:blur(3px) + dark overlay keep text perfectly readable.
//   • onError → gradient fallback, fires hero_video_error GA4 event.
//
// CRO A/B measurement:
//   Primary metric  → hero_cta_click rate (both variants send ab_variant param)
//   Secondary metrics → scroll_depth_50, wizard_complete rates per variant
//   Quality metric   → hero_video_loaded (tracks time-to-play for video group)
//
// ─────────────────────────────────────────────────────────────────────────

// Path relative to /public — Vite serves public/ at the root
const VIDEO_SRC = '/7339503-uhd_4096_2160_25fps.mp4';

interface HeroSectionProps {
  onStartWizard?: () => void; // kept for backwards compat
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const navigate = useNavigate();

  // Variant is assigned synchronously from localStorage — no flash of wrong variant
  const [variant] = useState<HeroVariant>(() => getHeroVariant());

  // Video state: null = loading, true = can play, false = error/unsupported
  const [videoReady, setVideoReady] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Respect OS-level reduced-motion preference — even variant B shows gradient
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const isVideoVariant = variant === 'video' && !prefersReducedMotion;

  // ── Video event handlers ──────────────────────────────────────────────

  const handleCanPlay = () => {
    setVideoReady(true);
    trackHeroVideoLoaded(variant);
  };

  const handleVideoError = () => {
    setVideoReady(false);
    trackHeroVideoError(variant);
    // Falls back to gradient automatically (videoReady === false)
  };

  // ── CTA handler ───────────────────────────────────────────────────────

  const handleCta = () => {
    // Pass variant so GA4 can segment CTA clicks by hero background type
    trackHeroCtaClick(variant);
    navigate('/encontrar');
  };

  return (
    <section className="hero-section" aria-label="Sección principal">

      {/* ── Background layer ─────────────────────────────────────────── */}
      {/* Always render gradient — it's the fallback AND the control variant */}
      <div className="hero-gradient" aria-hidden="true" />

      {/* Variant B: video overlaid on top of gradient.
          Shown only once videoReady === true to avoid blank-frame flash. */}
      {isVideoVariant && (
        <video
          ref={videoRef}
          className={`hero-video ${videoReady === true ? 'hero-video--visible' : ''}`}
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="none"        // ← key: no bytes downloaded until autoplay
          aria-hidden="true"
          onCanPlay={handleCanPlay}
          onError={handleVideoError}
        />
      )}

      {/* Dark overlay — ensures WCAG AA contrast on both gradient and video.
          Slightly darker for video variant to compensate for bright footage. */}
      <div
        className={`hero-overlay ${isVideoVariant ? 'hero-overlay--video' : ''}`}
        aria-hidden="true"
      />

      {/* Floating orbs — only rendered for gradient variant (CSS already has them).
          Video variant doesn't need them — video provides the depth. */}
      {!isVideoVariant && (
        <>
          <div className="hero-orb hero-orb--1" aria-hidden="true" />
          <div className="hero-orb hero-orb--2" aria-hidden="true" />
          <div className="hero-orb hero-orb--3" aria-hidden="true" />
        </>
      )}

      {/* ── Content (identical for both variants) ────────────────────── */}
      <div className="hero-content">
        <div className="hero-location-badge">
          <span className="hero-location-dot" />
          Solo en Madrid
        </div>

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

        <div className="hero-social-proof">
          <span className="hero-proof-item">
            <strong>+500</strong> personas el mes pasado
          </span>
          <span className="hero-proof-divider" aria-hidden="true">·</span>
          <span className="hero-proof-item">
            <strong>82%</strong> consiguió un match
          </span>
        </div>

        <button
          id="hero-cta-btn"
          className="hero-cta-btn"
          onClick={handleCta}
          aria-label="Encontrar mi evento de speed dating"
          // data-ab exposed for QA/browser DevTools inspection
          data-ab={variant}
        >
          Encontrar mi evento ✨
        </button>

        <p className="hero-cta-microcopy">
          Sin registro previo · 2 minutos
        </p>
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <div className="hero-scroll-dot" />
      </div>
    </section>
  );
};

export default HeroSection;
