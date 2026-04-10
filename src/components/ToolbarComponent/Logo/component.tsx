import React from 'react';
import { Link } from 'react-router-dom';
import './component.css';

const Logo: React.FC = () => {
  return (
    <Link to="/" className="logo-container">
      <span className="logo-text">Zapyens</span>
    </Link>
  );
};

export default Logo;
