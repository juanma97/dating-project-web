import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AgeRangeSelector from '../AgeRangeSelector/component';
import DateRangeSelector from '../DateRangeSelector/component';
import './component.css';

export interface SeekerFilters {
  ageMin: number;
  ageMax: number;
  gender: string;
  dateStart: Date | null;
  dateEnd: Date | null;
}

interface SeekerProps {
  onChange?: (filters: SeekerFilters) => void;
  resultsCount?: number;
  isFiltering?: boolean;
}

const Seeker: React.FC<SeekerProps> = ({ onChange, resultsCount = 0, isFiltering = false }) => {
  const { t } = useTranslation();

  const GENDERS = [
    { value: 'straight', label: t('seeker.straight'), flag: '👫' },
    { value: 'gay', label: t('seeker.gay'), flag: '👬' },
    { value: 'lesbian', label: t('seeker.lesbian'), flag: '👭' },
    { value: 'bisexual', label: t('seeker.bisexual'), flag: '🏳️‍🌈' },
    { value: 'non-binary', label: t('seeker.non_binary'), flag: '🏳️‍⚧️' },
  ];

  const [filters, setFilters] = useState<SeekerFilters>({
    ageMin: 25,
    ageMax: 40,
    gender: '',
    dateStart: null,
    dateEnd: null,
  });

  useEffect(() => {
    if (onChange) {
      onChange(filters);
    }
  }, [filters, onChange]);

  const handleAgeChange = (values: { minAge: number; maxAge: number }) => {
    setFilters((prev) => ({ ...prev, ageMin: values.minAge, ageMax: values.maxAge }));
  };

  const handleDateRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setFilters((prev) => ({ ...prev, dateStart: range.startDate, dateEnd: range.endDate }));
  };

  return (
    <section className="seeker">
      <div className="seeker-form">
        <div className="filter-group">
          <AgeRangeSelector
            min={18}
            max={65}
            initialValues={{ minAge: filters.ageMin, maxAge: filters.ageMax }}
            onChange={handleAgeChange}
          />
        </div>

        <div className="filter-group date-range-group">
          <label className={isFiltering ? 'is-filtering' : ''}>{t('seeker.dates')}</label>
          <DateRangeSelector
            initialStartDate={filters.dateStart}
            initialEndDate={filters.dateEnd}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="gender" className={isFiltering ? 'is-filtering' : ''}>
            {t('seeker.gender')}
          </label>
          <div className="custom-select-wrapper">
            <select
              name="gender"
              id="gender"
              value={filters.gender}
              onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
              className="gender-select"
            >
              <option value="">{t('seeker.select_gender')}</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.flag} {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Results Bar */}
      <div className={`mobile-results-bar ${resultsCount > 0 ? 'visible' : ''}`}>
        <div className="mobile-results-content">
          <span className="mobile-results-count">
            {isFiltering ? '...' : t('seeker.show_results', { count: resultsCount })}
          </span>
          <button
            className="mobile-scroll-button"
            onClick={() => {
              const element = document.getElementById('events');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            👇
          </button>
        </div>
      </div>
    </section>
  );
};

export default Seeker;
