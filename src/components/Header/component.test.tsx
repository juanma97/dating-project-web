import { render, screen } from '@testing-library/react';
import Header from './component';

describe('Header Component', () => {
  test('renders default title', () => {
    render(<Header />);
    expect(screen.getByText(/Stop swiping\. Start meeting\./i)).toBeInTheDocument();
  });

  test('renders custom title', () => {
    render(<Header title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  test('renders as a header element', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('hero-header');
  });
});
