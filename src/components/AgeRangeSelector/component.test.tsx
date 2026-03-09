import { render, screen } from '@testing-library/react';
import AgeRangeSelector from './component';

describe('AgeRangeSelector Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders with initial values', () => {
    render(
      <AgeRangeSelector
        min={18}
        max={65}
        initialValues={{ minAge: 25, maxAge: 40 }}
        onChange={mockOnChange}
      />,
    );
    expect(screen.getByText(/Age range:/i)).toBeInTheDocument();
    expect(screen.getByText(/25 – 40/)).toBeInTheDocument();
  });

  test('renders two slider handles', () => {
    render(
      <AgeRangeSelector
        min={18}
        max={65}
        initialValues={{ minAge: 25, maxAge: 40 }}
        onChange={mockOnChange}
      />,
    );
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-label', 'Minimum age');
    expect(sliders[1]).toHaveAttribute('aria-label', 'Maximum age');
  });

  test('renders min handle with correct aria attributes', () => {
    render(
      <AgeRangeSelector
        min={18}
        max={65}
        initialValues={{ minAge: 30, maxAge: 50 }}
        onChange={mockOnChange}
      />,
    );
    const minSlider = screen.getByLabelText('Minimum age');
    expect(minSlider).toHaveAttribute('aria-valuenow', '30');
    expect(minSlider).toHaveAttribute('aria-valuemin', '18');
    expect(minSlider).toHaveAttribute('aria-valuemax', '65');
  });

  test('renders max handle with correct aria attributes', () => {
    render(
      <AgeRangeSelector
        min={18}
        max={65}
        initialValues={{ minAge: 30, maxAge: 50 }}
        onChange={mockOnChange}
      />,
    );
    const maxSlider = screen.getByLabelText('Maximum age');
    expect(maxSlider).toHaveAttribute('aria-valuenow', '50');
  });

  test('calls onChange on mount with initial values', () => {
    render(
      <AgeRangeSelector
        min={18}
        max={65}
        initialValues={{ minAge: 25, maxAge: 40 }}
        onChange={mockOnChange}
      />,
    );
    expect(mockOnChange).toHaveBeenCalledWith({ minAge: 25, maxAge: 40 });
  });
});
