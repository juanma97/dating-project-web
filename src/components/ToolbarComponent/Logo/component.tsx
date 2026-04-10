import React from 'react';
import { Link } from 'react-router-dom';
import './component.css';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="logo-container">
      <img src="/favicon.png" alt="Zapyens Logo" className="logo-icon" />
      <span className="logo-text">Zapyens</span>
    </Link>
  );
};

export default Logo;
