import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-8S6RD6Y128';

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackEventClick = (eventData: {
  id: string;
  title: string;
  source: string;
  city: string;
}) => {
  ReactGA.event('event_click', {
    event_id: eventData.id,
    event_title: eventData.title,
    event_source: eventData.source,
    event_city: eventData.city,
    // Note: GA4 automatically tracks device, country, etc.
  });
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
