import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Logo from './component';

describe('Logo Component', () => {
  test('renders logo text and links to home', () => {
    render(
      <BrowserRouter>
        <Logo />
      </BrowserRouter>,
    );
    const logoElement = screen.getByText(/Speed Dating Connect/i);
    expect(logoElement).toBeInTheDocument();
    expect(logoElement.closest('a')).toHaveAttribute('href', '/');
  });
});
