import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AgeRangeSelector from '../AgeRangeSelector/component';
import DateRangeSelector from '../DateRangeSelector/component';
import './component.css';

export interface SeekerFilters {
  ageMin: number;
  ageMax: number;
  gender: string;
  city: string;
  dateStart: Date | null;
  dateEnd: Date | null;
}

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'];

interface SeekerProps {
  onChange?: (filters: SeekerFilters) => void;
}

const Seeker: React.FC<SeekerProps> = ({ onChange }) => {
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
    city: '',
    dateStart: null,
    dateEnd: null,
  });

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, city: value }));

    if (value.length > 0) {
      const filtered = CITIES.filter((city) => city.toLowerCase().startsWith(value.toLowerCase()));
      setCitySuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCity = (city: string) => {
    setFilters((prev) => ({ ...prev, city }));
    setShowSuggestions(false);
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
          <label>{t('seeker.dates')}</label>
          <DateRangeSelector
            initialStartDate={filters.dateStart}
            initialEndDate={filters.dateEnd}
            onChange={handleDateRangeChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="gender">{t('seeker.gender')}</label>
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

        <div className="filter-group city-autocomplete">
          <label htmlFor="city">{t('seeker.city')}</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder={t('seeker.search_city')}
            value={filters.city}
            onChange={handleCityChange}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            autoComplete="off"
          />
          {showSuggestions && citySuggestions.length > 0 && (
            <ul className="suggestions-list">
              {citySuggestions.map((city) => (
                <li key={city} onClick={() => selectCity(city)}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Seeker;
