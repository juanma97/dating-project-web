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

// Mock SeekerModal to easily control filters (LandingPage now uses SeekerModal, not Seeker)
jest.mock('../../components/SeekerModal/component', () => ({
  __esModule: true,
  default: ({ onApply, isOpen }: any) =>
    isOpen ? (
      <div data-testid="mock-seeker-modal">
        <button
          data-testid="filter-25-43"
          onClick={() =>
            onApply({
              ageMin: 25,
              ageMax: 43,
              gender: '',
              dateStart: null,
              dateEnd: null,
            })
          }
        >
          Set Filter 25-43
        </button>
      </div>
    ) : null,
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

  test.skip('seeker filter 25-43 should only show events within that range', async () => {
    render(
      <BrowserRouter>
        <LandingPage filterModalOpen={true} onFilterModalClose={() => { }} />
      </BrowserRouter>,
    );

    // Wait for events to load — "Match Event" (30-40) is within DEFAULT_FILTERS (25-40), shows
    // "Too Old Event" (34-63) has max_age 63 > 40, filtered out by default filters
    // "Too Young Event" (18-24) has min_age 18 < 25, filtered out by default filters
    await waitFor(() => {
      expect(screen.getByText('Match Event')).toBeInTheDocument();
    });

    // The modal is open — click the filter button to apply 25-43 range
    const filterBtn = screen.getByTestId('filter-25-43');
    fireEvent.click(filterBtn);

    // Wait for the filtering to apply
    await waitFor(() => {
      // "Match Event" (30-40) should still show — it's within 25-43
      expect(screen.getByText('Match Event')).toBeInTheDocument();

      // "Too Old Event" (34-63) max_age 63 > 43 — should NOT show
      expect(screen.queryByText('Too Old Event')).not.toBeInTheDocument();
      // "Too Young Event" (18-24) min_age 18 < 25 — should NOT show
      expect(screen.queryByText('Too Young Event')).not.toBeInTheDocument();
    });
  });
});
