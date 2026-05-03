import React from 'react';
import Logo from '../Logo/component';
import Navigation from '../Navigation/component';
import './component.css';

interface ToolbarProps {
  onFilterClick?: () => void;
  isFiltering?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onFilterClick, isFiltering = false }) => {
  return (
    <header className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <Logo />
        </div>
        {/*<div className="toolbar-right">
          {onFilterClick && (
            <button
              className={`toolbar-filter-btn${isFiltering ? ' is-filtering' : ''}`}
              onClick={onFilterClick}
              aria-label="Abrir filtros de búsqueda"
              id="toolbar-filter-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="toolbar-filter-icon"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          )}
          <div className="divider" />*/}
        <Navigation />
      </div>
    </header>
  );
};

export default Toolbar;
