import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './component';

describe('App Component', () => {
    test('renders the logo title', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const linkElement = screen.getByRole('heading', { name: /Speed Dating Connect/i, level: 1 });
        expect(linkElement).toBeInTheDocument();
    });

    test('renders the hero section text', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const heroText = screen.getByText(/Premium Connections, Real-World Magic/i);
        expect(heroText).toBeInTheDocument();
    });
});
