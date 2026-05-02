import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './component';
import { eventsApi } from '../../api/supabase/events';
import { Event } from '../../api/model/event';

// Mock the events API
jest.mock('../../api/supabase/events', () => ({
  eventsApi: {
    fetchEvents: jest.fn(),
  },
}));

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Gourmet Speed Dating',
    description: null,
    date: '2026-04-15',
    time: null,
    city: 'Madrid',
    place: null,
    source: null,
    source_url: null,
    image: null,
    created_at: null,
    street_name: null,
    street_number: null,
    organizer: null,
    min_age: 25,
    max_age: 35,
    girls_price: null,
    boys_price: null,
    sexual_orientation: 'Straight',
  },
  {
    id: '2',
    title: 'LGBTQ+ Mixer',
    description: null,
    date: '2026-04-22',
    time: null,
    city: 'Barcelona',
    place: null,
    source: null,
    source_url: null,
    image: null,
    created_at: null,
    street_name: null,
    street_number: null,
    organizer: null,
    min_age: 25,
    max_age: 40,
    girls_price: null,
    boys_price: null,
    sexual_orientation: 'Gay',
  },
];

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (eventsApi.fetchEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  test.skip('renders upcoming events section and loads events', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    // Wait for both the section header and the events to load
    await waitFor(() => {
      expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();
      expect(screen.getByText(/Gourmet Speed Dating/i)).toBeInTheDocument();
    });
  });

  // v2 funnel: events are only shown AFTER the wizard is completed.
  // The test below verifies the hero CTA is visible (new entry point),
  // and skips the raw event-list test which no longer applies to the main flow.
  test('renders the hero CTA button', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    // The landing now has two CTAs: hero + final section — both valid
    const ctaBtns = screen.getAllByRole('button', { name: /Encontrar mi evento/i });
    expect(ctaBtns.length).toBeGreaterThanOrEqual(1);
  });

  test.skip('renders mock events after loading (v1 flow — wizard replaces this)', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    // In v2, events are behind the wizard — this test is kept as documentation.
    await waitFor(() => {
      expect(screen.getByText(/Gourmet Speed Dating/i)).toBeInTheDocument();
      expect(screen.getByText(/LGBTQ\+ Mixer/i)).toBeInTheDocument();
    });
  });

  test.skip('renders results found badge with correct count', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/2 events found/i)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});

