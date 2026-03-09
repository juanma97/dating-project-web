import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Toolbar from './component';

describe('Toolbar Component', () => {
  test('renders logo, navigation and auth actions', () => {
    render(
      <BrowserRouter>
        <Toolbar />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Speed Dating Connect/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
