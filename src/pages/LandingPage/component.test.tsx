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
  test('renders hero title and upcoming events section', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Back to nature 🌱/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();

    // Wait for the mock API call to finish
    await waitFor(() => {
      expect(screen.getByText(/Gourmet Speed Dating/i)).toBeInTheDocument();
    });
  });

  test('renders mock events after loading', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    // Check loading state
    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();

    // Check final state
    await waitFor(() => {
      expect(screen.getByText(/Gourmet Speed Dating/i)).toBeInTheDocument();
      expect(screen.getByText(/LGBTQ\+ Mixer/i)).toBeInTheDocument();
    });
  });
});
