import React, { useState } from 'react';
import AgeRangeSelector from '../AgeRangeSelector/component';
import './component.css';

interface SeekerFilters {
  ageMin: number;
  ageMax: number;
  gender: string;
  city: string;
}

const GENDERS = [
  { value: 'straight', label: 'Straight', flag: '👫' },
  { value: 'gay', label: 'Gay', flag: '👬' },
  { value: 'lesbian', label: 'Lesbian', flag: '👭' },
  { value: 'bisexual', label: 'Bisexual', flag: '🏳️‍🌈' },
  { value: 'non-binary', label: 'Non-Binary', flag: '🏳️‍⚧️' },
];

const CITIES = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'];

const Seeker: React.FC = () => {
  const [filters, setFilters] = useState<SeekerFilters>({
    ageMin: 25,
    ageMax: 40,
    gender: '',
    city: '',
  });

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAgeChange = (values: { minAge: number; maxAge: number }) => {
    setFilters((prev) => ({ ...prev, ageMin: values.minAge, ageMax: values.maxAge }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Filters applied:', filters);
  };

  return (
    <section className="seeker">
      <form className="seeker-form" onSubmit={handleSubmit}>
        <div className="filter-group">
          <AgeRangeSelector
            min={18}
            max={65}
            initialValues={{ minAge: filters.ageMin, maxAge: filters.ageMax }}
            onChange={handleAgeChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="gender">Gender</label>
          <div className="custom-select-wrapper">
            <select
              name="gender"
              id="gender"
              value={filters.gender}
              onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
              className="gender-select"
            >
              <option value="">Select Gender</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.flag} {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-group city-autocomplete">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Search city..."
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

        <button type="submit" className="search-button">
          Find Events
        </button>
      </form>
    </section>
  );
};

export default Seeker;
