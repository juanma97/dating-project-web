/**
 * analytics.ts
 *
 * All GA4 tracking uses the native window.gtag() function.
 * The gtag.js script is loaded statically in index.html — do NOT
 * call ReactGA.initialize() or load the script again here.
 *
 * TypeScript declaration for window.gtag is kept so all call sites
 * remain fully typed.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/** No-op kept for backward compatibility — initialization is now in index.html */
export const initGA = (): void => {
  // Script and consent defaults are set in index.html.
  // Nothing to do here.
};

/**
 * Updates the GA4 consent state after the user makes a choice
 * (e.g. accepts or rejects the cookie banner).
 */
export const updateGAConsent = (granted: boolean): void => {
  if (typeof window.gtag !== 'function') return;
  const state = granted ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
};

// ─── Page Views ────────────────────────────────────────────────────────────

export const trackPageView = (path: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', { page_path: path });
};

// ─── General Event Tracking ────────────────────────────────────────────────

export const trackEventClick = (eventData: {
  id: string;
  title: string;
  source: string;
  city: string;
  url: string;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'event_click', {
    event_id: eventData.id,
    event_title: eventData.title,
    event_source: eventData.source,
    event_city: eventData.city,
    event_url: eventData.url,
  });
};

export const trackEventSourceClick = (eventId: string, title: string, source: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'event_source_click', {
    event_id: eventId,
    event_title: title,
    event_source: source,
  });
};

export const trackBuyTicketsIntent = (eventId: string, title: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'buy_tickets_intent', {
    event_id: eventId,
    event_title: title,
  });
};

// ─── Premium Events Tracking ───────────────────────────────────────────────

export const trackViewPremiumEvents = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'view_premium_events');
};

export const trackClickPremiumEvent = (eventData: {
  id: string;
  city: string | null;
  min_age: number | null;
  max_age: number | null;
  girls_price: number | null;
  boys_price: number | null;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'click_premium_event', {
    event_id: eventData.id,
    city: eventData.city,
    min_age: eventData.min_age,
    max_age: eventData.max_age,
    girls_price: eventData.girls_price,
    boys_price: eventData.boys_price,
  });
};

export const trackViewPremiumEventDetail = (eventId: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'view_premium_event_detail', { event_id: eventId });
};

export const trackPremiumEventCtaClick = (eventId: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'premium_event_cta_click', { event_id: eventId });
};

export const trackPremiumEventLeadSubmit = (params: {
  event_id: string;
  city: string | null;
  user_age: number;
  user_gender: string;
  girls_price: number | null;
  boys_price: number | null;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'premium_event_lead_submit', {
    event_id: params.event_id,
    city: params.city,
    user_age: params.user_age,
    user_gender: params.user_gender,
    girls_price: params.girls_price,
    boys_price: params.boys_price,
  });
};

// ─── Venue Partners Tracking ───────────────────────────────────────────────

export const trackVenuePartnerPageView = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'view_venue_partners');
};

export const trackVenuePartnerCtaClick = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'venue_partner_cta_click');
};

export const trackVenuePartnerFormSubmit = (params: {
  venue_type: string;
  city: string;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'venue_partner_form_submit', {
    venue_type: params.venue_type,
    city: params.city,
  });
};

/**
 * Fires when the user interacts with the form for the first time.
 * Useful to measure engagement vs. bounce after seeing the hero.
 */
export const trackVenuePartnerFormStart = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'venue_partner_form_start');
};

/**
 * Fires if the form submission fails (API / network error).
 * Helps detect backend reliability issues affecting conversion.
 */
export const trackVenuePartnerFormError = (reason: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'venue_partner_form_error', { reason });
};

// ─── Accessible Events Tracking ────────────────────────────────────────────

export const trackViewAccessibleEvents = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'view_accessible_events');
};

/**
 * Fires after events are fetched, reporting how many are available.
 * Distinguishes "empty state" visits from visits with real events.
 */
export const trackAccessibleEventsLoaded = (count: number): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'accessible_events_loaded', { events_count: count });
};

/**
 * Fires when the accessible events API call fails.
 */
export const trackAccessibleEventsLoadError = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'accessible_events_load_error');
};

/**
 * Fires when a user clicks the WhatsApp CTA shown in the empty state.
 * Key signal of demand even before real events are published.
 */
export const trackAccessibleEventsEmptyWhatsappClick = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'accessible_events_empty_whatsapp_click');
};

export const trackClickAccessibleEvent = (eventData: {
  id: string;
  city: string | null;
  min_age: number | null;
  max_age: number | null;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'click_accessible_event', {
    event_id: eventData.id,
    city: eventData.city,
    min_age: eventData.min_age,
    max_age: eventData.max_age,
  });
};

export const trackViewAccessibleEventDetail = (eventId: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'view_accessible_event_detail', { event_id: eventId });
};

export const trackAccessibleEventCtaClick = (eventId: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'accessible_event_cta_click', { event_id: eventId });
};

export const trackAccessibleEventLeadSubmit = (params: {
  event_id: string;
  city: string | null;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'accessible_event_lead_submit', {
    event_id: params.event_id,
    city: params.city,
  });
};

// ─── v2 Funnel Tracking ────────────────────────────────────────────────────

/**
 * Fires when the user clicks the Hero CTA that opens the wizard.
 * Includes ab_variant so GA4 can segment hero_cta_click rates by variant.
 * This is the PRIMARY conversion metric for the hero A/B test.
 */
export const trackHeroCtaClick = (abVariant?: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'hero_cta_click', {
    cta_text: 'Encontrar mi evento',
    ...(abVariant ? { ab_variant: abVariant } : {}),
  });
};

/**
 * Fires when the user sees (enters viewport) the MatchGuaranteeModule.
 * Measures how deep users scroll into the funnel before dropping.
 */

// ─── A/B Test Tracking ────────────────────────────────────────────────────

/**
 * Fires once per browser session when a user is assigned to an A/B variant.
 * is_new_assignment=true: first ever assignment.
 * is_new_assignment=false: returning user with existing assignment.
 * Use GA4 → Explore → Funnel to compare hero_cta_click rates by ab_variant.
 */
export const trackAbTestAssigned = (params: {
  test_name: string;
  variant: string;
  is_new_assignment: boolean;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'ab_test_assigned', {
    test_name: params.test_name,
    ab_variant: params.variant,
    is_new_assignment: params.is_new_assignment,
  });
};

/**
 * Fires when the hero video has buffered enough to start playback (canplay).
 * CRO: if time-to-play is high, it may be hurting conversion for the video group.
 * Compare avg time-on-page between users who saw this event vs those who didn't.
 */
export const trackHeroVideoLoaded = (variant: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'hero_video_loaded', { ab_variant: variant });
};

/**
 * Fires if the video element errors out (network, codec, etc.).
 * These users receive the gradient fallback — important for data quality:
 * if error rate is high, the video group is artificially contaminated.
 */
export const trackHeroVideoError = (variant: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'hero_video_error', { ab_variant: variant });
};

/**
 * Fires when the user sees (enters viewport) the MatchGuaranteeModule.
 * Measures how deep users scroll into the funnel before dropping.
 */
export const trackMatchGuaranteeView = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'match_guarantee_view');
};

/**
 * Fires each time the user advances a wizard step.
 * Tracks funnel drop-off per step to identify friction points.
 */
export const trackWizardStep = (params: {
  step_number: 1 | 2 | 3;
  value: string; // e.g. "25-35", "este-mes"
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'wizard_step_complete', {
    step_number: params.step_number,
    step_value: params.value,
  });
};

/**
 * Fires when the wizard is fully complete (step 3 reached = events shown).
 * Core conversion event of the v2 funnel — user is now "qualified".
 */
export const trackWizardComplete = (params: {
  age_range: string;   // e.g. "25-35"
  date_preset: string; // e.g. "este-mes"
  results_count: number;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'wizard_complete', {
    age_range: params.age_range,
    date_preset: params.date_preset,
    results_count: params.results_count,
  });
};

/**
 * Fires at scroll depth milestones (25%, 50%, 75%, 100%).
 * Also used to trigger the StickyBar at the 40% threshold.
 */
export const trackScrollDepth = (depthPct: 25 | 50 | 75 | 100): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'scroll_depth', { depth_pct: depthPct });
};

/**
 * Fires when SpotsCounter shows a low-availability warning (< 5 spots).
 * Measures urgency effectiveness — did urgency lead to a subsequent click?
 */
export const trackSpotsUrgencyShown = (params: {
  event_id: string;
  spots_count: number;
}): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'spots_urgency_shown', {
    event_id: params.event_id,
    spots_count: params.spots_count,
  });
};

// ─── Landing Page Conversion Tracking ─────────────────────────────────────

/** Fires when a user submits email via the sticky bottom lead-capture bar. */
export const trackStickyBarLeadSubmit = (email: string): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'generate_lead', {
    source: 'sticky-bar',
    method: 'email',
    // Never log PII — just a boolean presence flag
    has_email: Boolean(email),
  });
};

/** Fires when a user taps "Avísame cuando haya plazas" on the Premium promo card. */
export const trackPremiumPromoNotifyClick = (): void => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'premium_promo_notify_click', {
    source: 'landing-promo-card',
  });
};
