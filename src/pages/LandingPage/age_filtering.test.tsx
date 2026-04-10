import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

// Mock Seeker to easily control filters
jest.mock('../../components/Seeker/component', () => ({
  __esModule: true,
  default: ({ onChange }: any) => (
    <div data-testid="mock-seeker">
      <button
        data-testid="filter-25-43"
        onClick={() =>
          onChange({
            ageMin: 25,
            ageMax: 43,
            gender: '',
            city: '',
            dateStart: null,
            dateEnd: null,
          })
        }
      >
        Set Filter 25-43
      </button>
    </div>
  ),
}));

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Match Event', // 30-40 (Inside 25-43)
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
    min_age: 30,
    max_age: 40,
    girls_price: null,
    boys_price: null,
    sexual_orientation: 'Straight',
  },
  {
    id: '2',
    title: 'Too Old Event', // 34-63 (Not working properly bug)
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
    min_age: 34,
    max_age: 63,
    girls_price: null,
    boys_price: null,
    sexual_orientation: 'Gay',
  },
  {
    id: '3',
    title: 'Too Young Event', // 18-24 (Outside 25-43)
    description: null,
    date: '2026-04-25',
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
    min_age: 18,
    max_age: 24,
    girls_price: null,
    boys_price: null,
    sexual_orientation: 'Straight',
  },
];

describe('LandingPage Age Filtering Regression', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (eventsApi.fetchEvents as jest.Mock).mockResolvedValue(mockEvents);
  });

  test('seeker filter 25-43 should only show events within that range', async () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );

    // Initial load shows all events (since filters are null initially)
    await waitFor(() => {
      expect(screen.getByText('Match Event')).toBeInTheDocument();
      expect(screen.getByText('Too Old Event')).toBeInTheDocument();
      expect(screen.getByText('Too Young Event')).toBeInTheDocument();
    });

    // Apply the filter
    const filterBtn = screen.getByTestId('filter-25-43');
    fireEvent.click(filterBtn);

    // Wait for the filtering to apply
    await waitFor(() => {
      // Should show
      expect(screen.getByText('Match Event')).toBeInTheDocument();

      // Should NOT show (BUG: current logic shows them because they overlap)
      expect(screen.queryByText('Too Old Event')).not.toBeInTheDocument();
      expect(screen.queryByText('Too Young Event')).not.toBeInTheDocument();
    });
  });
});
