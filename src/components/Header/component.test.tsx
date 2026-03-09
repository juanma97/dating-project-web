import { render, screen } from '@testing-library/react';
import Header from './component';

describe('Header Component', () => {
  test('renders default title and subtitle', () => {
    render(<Header />);
    expect(screen.getByText('Connect in the Real World')).toBeInTheDocument();
    expect(
      screen.getByText('Premium speed dating events for authentic interactions.'),
    ).toBeInTheDocument();
  });

  test('renders custom title and subtitle', () => {
    render(<Header title="Custom Title" subtitle="Custom Subtitle" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Subtitle')).toBeInTheDocument();
  });

  test('renders as a header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('hero-header');
  });
});
