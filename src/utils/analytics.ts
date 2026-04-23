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
