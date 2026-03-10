import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './component';

describe('App Component', () => {
  test('renders the logo title', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    const logoLink = screen.getByRole('link', { name: /Speed Dating Connect/i });
    expect(logoLink).toBeInTheDocument();
  });

  test('renders the hero section text', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    const heroText = screen.getByText(/Connect in the Real World/i);
    expect(heroText).toBeInTheDocument();
  });
});
