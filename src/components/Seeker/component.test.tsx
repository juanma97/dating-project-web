import { render, screen, fireEvent } from '@testing-library/react';
import Seeker from './component';

describe('Seeker Component', () => {
  test('renders all filter fields', () => {
    render(<Seeker />);
    expect(screen.getByText(/Age range:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dates/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
  });

  test('updates city value on change', () => {
    render(<Seeker />);
    const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
    fireEvent.change(cityInput, { target: { value: 'Mad', name: 'city' } });
    expect(cityInput.value).toBe('Mad');
    expect(screen.getByText('Madrid')).toBeInTheDocument();
  });

  test('selects city from suggestions', () => {
    render(<Seeker />);
    const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
    fireEvent.change(cityInput, { target: { value: 'Bar', name: 'city' } });
    const suggestion = screen.getByText('Barcelona');
    fireEvent.click(suggestion);
    expect(cityInput.value).toBe('Barcelona');
  });
});
