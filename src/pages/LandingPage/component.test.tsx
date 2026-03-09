import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './component';

describe('LandingPage', () => {
  test('renders hero title and upcoming events section', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Connect in the Real World/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();
  });

  test('renders mock events', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Gourmet Speed Dating/i)).toBeInTheDocument();
    expect(screen.getByText(/LGBTQ\+ Mixer/i)).toBeInTheDocument();
  });
});
