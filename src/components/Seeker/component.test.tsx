import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Seeker from './component';

describe('Seeker Component', () => {
  test('renders all filter fields', () => {
    render(<Seeker />);
    expect(screen.getByLabelText(/Age Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  });

  test('updates filter values on change', () => {
    render(<Seeker />);
    const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
    fireEvent.change(cityInput, { target: { value: 'Barcelona', name: 'city' } });
    expect(cityInput.value).toBe('Barcelona');
  });
});
