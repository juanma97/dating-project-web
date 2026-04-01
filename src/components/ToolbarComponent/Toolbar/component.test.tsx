import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Toolbar from './component';

describe('Toolbar Component', () => {
  test('renders logo and navigation', () => {
    render(
      <BrowserRouter>
        <Toolbar />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Speed Dating Connect/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Speed Dating Connect/i })).toBeInTheDocument();
    // Using getAllByText since Navigation has desktop and mobile links
    expect(screen.getAllByText(/Home|Eventos/i).length).toBeGreaterThan(0);
  });
});

