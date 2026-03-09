import React, { useState } from 'react';
import './component.css';

interface SeekerFilters {
  ageRange: string;
  orientation: string;
  city: string;
}

const Seeker: React.FC = () => {
  const [filters, setFilters] = useState<SeekerFilters>({
    ageRange: '',
    orientation: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Filters applied:', filters);
  };

  return (
    <section className="seeker">
      <form className="seeker-form" onSubmit={handleSubmit}>
        <div className="filter-group">
          <label htmlFor="ageRange">Age Range</label>
          <select name="ageRange" id="ageRange" value={filters.ageRange} onChange={handleChange}>
            <option value="">All Ages</option>
            <option value="18-25">18 - 25</option>
            <option value="26-35">26 - 35</option>
            <option value="36-45">36 - 45</option>
            <option value="46+">46+</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="orientation">Event Type</label>
          <select
            name="orientation"
            id="orientation"
            value={filters.orientation}
            onChange={handleChange}
          >
            <option value="">All Types</option>
            <option value="straight">Straight</option>
            <option value="gay">Gay</option>
            <option value="lesbian">Lesbian</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            id="city"
            placeholder="Enter city..."
            value={filters.city}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="search-button">
          Find Events
        </button>
      </form>
    </section>
  );
};

export default Seeker;
