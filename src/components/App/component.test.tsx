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
      expect(screen.getByRole('link', { name: /Zapyens/i })).toBeInTheDocument();
    });
  });

  test('renders the filter search button in the toolbar on the home route', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Abrir filtros de búsqueda/i })).toBeInTheDocument();
    });
  });
});
