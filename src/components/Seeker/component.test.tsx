import { render, screen } from '@testing-library/react';
import Seeker from './component';

describe('Seeker Component', () => {
  test('renders all filter fields', () => {
    render(<Seeker />);
    expect(screen.getByText(/Age range:/i)).toBeInTheDocument();
    expect(screen.getByText(/Dates/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
  });
});
