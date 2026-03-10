import { render, screen } from '@testing-library/react';
import { Event } from '../../api/model/event';
import EventCard from './component';
import EventsList from '../EventsList/component';

const mockEvent: Event = {
  id: '1',
  title: 'Beach Speed Dating',
  description: 'A fun event by the beach',
  date: '2026-07-20',
  time: '18:00:00',
  city: 'Barcelona',
  place: 'Barceloneta Beach',
  source: 'Eventbrite',
  source_url: 'https://example.com',
  image: null,
  created_at: '2026-03-10T12:00:00Z',
  street_name: 'Passeig Marítim',
  street_number: 1,
  organizer: 'SpeedDatingBCN',
  min_age: 25,
  max_age: 35,
  girls_price: 15,
  boys_price: 20,
  sexual_orientation: 'Straight',
};

describe('Event Components', () => {
  test('EventCard renders event details', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/Beach Speed Dating/i)).toBeInTheDocument();
    expect(screen.getByText(/Barcelona/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View on Eventbrite/i })).toHaveAttribute(
      'href',
      mockEvent.source_url,
    );
  });

  test('EventsList renders a grid of events', () => {
    const events = [mockEvent, { ...mockEvent, id: '2', title: 'Coffee Connection' }];
    render(<EventsList events={events} />);
    expect(screen.getByText(/Beach Speed Dating/i)).toBeInTheDocument();
    expect(screen.getByText(/Coffee Connection/i)).toBeInTheDocument();
  });

  test('EventsList shows empty message when no events', () => {
    render(<EventsList events={[]} />);
    expect(screen.getByText(/No events found/i)).toBeInTheDocument();
  });
});
