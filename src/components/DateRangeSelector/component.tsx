import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './component.css';

interface DateRangeSelectorProps {
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  initialStartDate = null,
  initialEndDate = null,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const day = new Date(year, month, 1).getDay();
    // Adjust to make Monday the first day of the week
    return day === 0 ? 6 : day - 1;
  }, [currentMonth]);

  const monthName = currentMonth.toLocaleString(i18n.language, { month: 'long', year: 'numeric' });

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      onChange({ startDate: clickedDate, endDate: null });
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
        onChange({ startDate: clickedDate, endDate: null });
      } else {
        setEndDate(clickedDate);
        onChange({ startDate, endDate: clickedDate });
        // Optionally close calendar after complete selection
        setTimeout(() => setIsCalendarOpen(false), 300);
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderDays = () => {
    const days = [];
    // Empty slots before first day
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

      let className = 'calendar-day';
      if (isSameDay(date, startDate)) className += ' selected start-date';
      if (isSameDay(date, endDate)) className += ' selected end-date';

      const isPastStartDate = startDate && !endDate && date > startDate;
      const isBeforeHoverDate = hoverDate && date <= hoverDate;
      const isInHoverRange = isPastStartDate && isBeforeHoverDate;

      if (startDate && endDate && date > startDate && date < endDate) {
        className += ' in-range';
      } else if (isInHoverRange) {
        className += ' in-hover-range';
      }

      const today = new Date();
      if (isSameDay(date, today)) className += ' today';

      days.push(
        <button
          type="button"
          key={`day-${day}`}
          className={className}
          onClick={() => handleDayClick(day)}
          onMouseEnter={() => setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
        >
          {day}
        </button>,
      );
    }
    return days;
  };

  return (
    <div className="date-range-selector">
      <div className="date-input-wrapper" onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
        <div className="date-input">
          {startDate ? formatDate(startDate) : t('date_range.start_date')}
        </div>
        <span className="date-separator">—</span>
        <div className="date-input">{endDate ? formatDate(endDate) : t('date_range.end_date')}</div>
      </div>

      {isCalendarOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button type="button" className="calendar-nav" onClick={handlePrevMonth}>
              &lt;
            </button>
            <span className="calendar-month-year">{monthName}</span>
            <button type="button" className="calendar-nav" onClick={handleNextMonth}>
              &gt;
            </button>
          </div>

          <div className="calendar-weekdays">
            <span>{t('date_range.mon')}</span>
            <span>{t('date_range.tue')}</span>
            <span>{t('date_range.wed')}</span>
            <span>{t('date_range.thu')}</span>
            <span>{t('date_range.fri')}</span>
            <span>{t('date_range.sat')}</span>
            <span>{t('date_range.sun')}</span>
          </div>

          <div className="calendar-days-grid">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
