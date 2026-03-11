import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './component';

describe('Navigation Component', () => {
  test('renders all navigation links', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });
});
