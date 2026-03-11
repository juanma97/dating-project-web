import { render, screen, fireEvent } from '@testing-library/react';
import DateRangeSelector from './component';

describe('DateRangeSelector Component', () => {
  beforeAll(() => {
    // Mock system time to have a consistent start date for tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-10T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders with default placeholders', () => {
    const mockOnChange = jest.fn();
    render(<DateRangeSelector onChange={mockOnChange} />);

    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
  });

  test('opens calendar on click', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<DateRangeSelector onChange={mockOnChange} />);

    // Calendar is closed initially
    expect(container.querySelector('.calendar-dropdown')).not.toBeInTheDocument();

    // Click wrapper to open
    const wrapper = container.querySelector('.date-input-wrapper');
    fireEvent.click(wrapper!);

    // Calendar should be open
    expect(container.querySelector('.calendar-dropdown')).toBeInTheDocument();
    // Month name ('March 2026' because of mocked time)
    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });

  test('selects start and end date', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<DateRangeSelector onChange={mockOnChange} />);

    // Open calendar
    const wrapper = container.querySelector('.date-input-wrapper');
    fireEvent.click(wrapper!);

    // Click day 15 (Start Date)
    const day15 = screen.getByText('15');
    fireEvent.click(day15);

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date(2026, 2, 15), // Month is 0-indexed (2 = March)
      endDate: null,
    });

    // Click day 20 (End Date)
    const day20 = screen.getByText('20');
    fireEvent.click(day20);

    expect(mockOnChange).toHaveBeenCalledWith({
      startDate: new Date(2026, 2, 15),
      endDate: new Date(2026, 2, 20),
    });

    // Check if dates are rendered in the wrapper
    // Using simple format checking, the actual formatting depends on locale, but it should be present.
    // formatDate uses toLocaleDateString which might vary depending on node env, but usually includes '15' and '20'
    const inputs = container.querySelectorAll('.date-input');
    expect(inputs[0].textContent).toContain('15');
    expect(inputs[1].textContent).toContain('20');
  });

  test('renders initial dates correctly', () => {
    const mockOnChange = jest.fn();
    const startDate = new Date(2026, 2, 10);
    const endDate = new Date(2026, 2, 18);

    const { container } = render(
      <DateRangeSelector
        initialStartDate={startDate}
        initialEndDate={endDate}
        onChange={mockOnChange}
      />,
    );

    const inputs = container.querySelectorAll('.date-input');
    expect(inputs[0].textContent).toContain('10');
    expect(inputs[1].textContent).toContain('18');
  });
});
