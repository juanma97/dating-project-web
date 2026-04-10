import { render, screen } from '@testing-library/react';
import Footer from './component';

describe('Footer Component', () => {
  test('renders logo and copyright notice', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Zapyens/i, { selector: '.footer-logo' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  test('renders social links', () => {
    render(<Footer />);
    expect(screen.getByText(/Instagram/i)).toBeInTheDocument();
    expect(screen.getByText(/Twitter/i)).toBeInTheDocument();
  });
});
