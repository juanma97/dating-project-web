import React from 'react';
import { Link } from 'react-router-dom';
import './component.css';

const AuthActions: React.FC = () => {
  return (
    <div className="auth-actions">
      <Link to="/login" className="auth-link login-btn">
        Login
      </Link>
      <Link to="/register" className="auth-link register-btn">
        Register
      </Link>
    </div>
  );
};

export default AuthActions;
