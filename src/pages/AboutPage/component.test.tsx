import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './component';

describe('AboutPage Component', () => {
  test('renders the main marketing titles and values', () => {
    // We wrap in BrowserRouter because Header/Footer usually contain Links
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>,
    );

    // Assert main Hero title
    expect(
      screen.getByText(/Dating apps had their moment/i),
    ).toBeInTheDocument();

    // Assert Core Values exist
    expect(screen.getByText(/No friction/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality over quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-world connections/i)).toBeInTheDocument();

    // Assert audience targets exist
    expect(screen.getByText(/Tired of apps/i)).toBeInTheDocument();
    expect(screen.getByText(/Event organisers/i)).toBeInTheDocument();

    // Assert CTA button is there
    expect(screen.getByRole('link', { name: /Browse events/i })).toHaveAttribute('href', '/');
  });
});
