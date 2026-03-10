import { render, screen } from '@testing-library/react';
import EventCard from './component';
import EventsList from '../EventsList/component';

const mockEvent = {
  id: '1',
  title: 'Beach Speed Dating',
  date: '2026-07-20',
  city: 'Barcelona',
  organizerUrl: 'https://example.com',
  type: 'Straight',
};

describe('Event Components', () => {
  test('EventCard renders event details', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText(/Beach Speed Dating/i)).toBeInTheDocument();
    expect(screen.getByText(/Barcelona/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View on Organizer's Site/i })).toHaveAttribute(
      'href',
      mockEvent.organizerUrl,
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
