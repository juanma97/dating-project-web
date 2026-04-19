import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-8S6RD6Y128';

// Initialize the dataLayer globally to ensure gtag commands work
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initGA = () => {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

  window.gtag('js', new Date());

  const consent = localStorage.getItem('cookieConsent');
  // Opt-out approach: assumes granted UNLESS explicitly denied
  const isGranted = consent !== 'denied';

  // Set default GA4 consent mode based on user's previous choice
  // This MUST happen before ReactGA.initialize
  window.gtag('consent', 'default', {
    ad_storage: isGranted ? 'granted' : 'denied',
    ad_user_data: isGranted ? 'granted' : 'denied',
    ad_personalization: isGranted ? 'granted' : 'denied',
    analytics_storage: isGranted ? 'granted' : 'denied',
  });

  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const updateGAConsent = (granted: boolean) => {
  if (window.gtag) {
    window.gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
};

export const trackEventClick = (eventData: {
  id: string;
  title: string;
  source: string;
  city: string;
  url: string;
}) => {
  ReactGA.event('event_click', {
    event_id: eventData.id,
    event_title: eventData.title,
    event_source: eventData.source,
    event_city: eventData.city,
    event_url: eventData.url,
    // Note: GA4 automatically tracks device, country, etc.
  });
};

export const trackEventSourceClick = (eventId: string, title: string, source: string) => {
  ReactGA.event('event_source_click', {
    event_id: eventId,
    event_title: title,
    event_source: source,
  });
};

export const trackBuyTicketsIntent = (eventId: string, title: string) => {
  ReactGA.event('buy_tickets_intent', {
    event_id: eventId,
    event_title: title,
  });
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};

// ─── Premium Events Tracking ───────────────────────────────────────────────

export const trackViewPremiumEvents = () => {
  ReactGA.event('view_premium_events');
};

export const trackClickPremiumEvent = (eventData: {
  id: string;
  city: string | null;
  min_age: number | null;
  max_age: number | null;
  girls_price: number | null;
  boys_price: number | null;
}) => {
  ReactGA.event('click_premium_event', {
    event_id: eventData.id,
    city: eventData.city,
    min_age: eventData.min_age,
    max_age: eventData.max_age,
    girls_price: eventData.girls_price,
    boys_price: eventData.boys_price,
  });
};

export const trackViewPremiumEventDetail = (eventId: string) => {
  ReactGA.event('view_premium_event_detail', { event_id: eventId });
};

export const trackPremiumEventCtaClick = (eventId: string) => {
  ReactGA.event('premium_event_cta_click', { event_id: eventId });
};

export const trackPremiumEventLeadSubmit = (params: {
  event_id: string;
  city: string | null;
  user_age: number;
  user_gender: string;
  girls_price: number | null;
  boys_price: number | null;
}) => {
  ReactGA.event('premium_event_lead_submit', {
    event_id: params.event_id,
    city: params.city,
    user_age: params.user_age,
    user_gender: params.user_gender,
    girls_price: params.girls_price,
    boys_price: params.boys_price,
  });
};

// ─── Venue Partners Tracking ───────────────────────────────────────────────

export const trackVenuePartnerPageView = () => {
  ReactGA.event('view_venue_partners');
};

export const trackVenuePartnerCtaClick = () => {
  ReactGA.event('venue_partner_cta_click');
};

export const trackVenuePartnerFormSubmit = (params: {
  venue_type: string;
  city: string;
}) => {
  ReactGA.event('venue_partner_form_submit', {
    venue_type: params.venue_type,
    city: params.city,
  });
};

/**
 * Fires when the user interacts with the form for the first time.
 * Useful to measure engagement vs. bounce after seeing the hero.
 */
export const trackVenuePartnerFormStart = () => {
  ReactGA.event('venue_partner_form_start');
};

/**
 * Fires if the form submission fails (API / network error).
 * Helps detect backend reliability issues affecting conversion.
 */
export const trackVenuePartnerFormError = (reason: string) => {
  ReactGA.event('venue_partner_form_error', { reason });
};

// ─── Accessible Events Tracking ────────────────────────────────────────────

export const trackViewAccessibleEvents = () => {
  ReactGA.event('view_accessible_events');
};

/**
 * Fires after events are fetched, reporting how many are available.
 * Distinguishes "empty state" visits from visits with real events.
 */
export const trackAccessibleEventsLoaded = (count: number) => {
  ReactGA.event('accessible_events_loaded', { events_count: count });
};

/**
 * Fires when the accessible events API call fails.
 */
export const trackAccessibleEventsLoadError = () => {
  ReactGA.event('accessible_events_load_error');
};

/**
 * Fires when a user clicks the WhatsApp CTA shown in the empty state.
 * Key signal of demand even before real events are published.
 */
export const trackAccessibleEventsEmptyWhatsappClick = () => {
  ReactGA.event('accessible_events_empty_whatsapp_click');
};

export const trackClickAccessibleEvent = (eventData: {
  id: string;
  city: string | null;
  min_age: number | null;
  max_age: number | null;
}) => {
  ReactGA.event('click_accessible_event', {
    event_id: eventData.id,
    city: eventData.city,
    min_age: eventData.min_age,
    max_age: eventData.max_age,
  });
};

export const trackViewAccessibleEventDetail = (eventId: string) => {
  ReactGA.event('view_accessible_event_detail', { event_id: eventId });
};

export const trackAccessibleEventCtaClick = (eventId: string) => {
  ReactGA.event('accessible_event_cta_click', { event_id: eventId });
};

export const trackAccessibleEventLeadSubmit = (params: {
  event_id: string;
  city: string | null;
}) => {
  ReactGA.event('accessible_event_lead_submit', {
    event_id: params.event_id,
    city: params.city,
  });
};
