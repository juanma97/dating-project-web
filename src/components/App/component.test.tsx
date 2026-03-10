import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './component';

describe('App Component', () => {
  test('renders the logo title', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Speed Dating Connect/i })).toBeInTheDocument();
    });
  });

  test('renders the hero section text', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(screen.getByText(/Connect in the Real World/i)).toBeInTheDocument();
    });
  });
});
