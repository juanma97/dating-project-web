import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthActions from './component';

describe('AuthActions Component', () => {
  test('renders login and register buttons', () => {
    render(
      <BrowserRouter>
        <AuthActions />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });
});
