import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './component';

describe('AboutPage Component', () => {
    test('renders the main marketing titles and values', () => {
        // We wrap in BrowserRouter because Header/Footer usually contain Links
        render(
            <BrowserRouter>
                <AboutPage />
            </BrowserRouter>
        );

        // Assert main Hero title
        expect(
            screen.getByText(/Bridge the gap between digital discovery and physical interaction/i)
        ).toBeInTheDocument();

        // Assert Core Values exist
        expect(screen.getByText(/Minimalist Design/i)).toBeInTheDocument();
        expect(screen.getByText(/Excellent Experience/i)).toBeInTheDocument();
        expect(screen.getByText(/Real-World Connectivity/i)).toBeInTheDocument();

        // Assert audience targets exist
        expect(screen.getByText(/For Individuals/i)).toBeInTheDocument();
        expect(screen.getByText(/For Organizers/i)).toBeInTheDocument();

        // Assert CTA button is there
        expect(screen.getByRole('link', { name: /Find Events/i })).toHaveAttribute('href', '/');
    });
});
