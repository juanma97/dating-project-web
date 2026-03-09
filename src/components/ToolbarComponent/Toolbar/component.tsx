import React from 'react';
import Logo from '../Logo/component';
import Navigation from '../Navigation/component';
import AuthActions from '../AuthActions/component';
import './component.css';

const Toolbar: React.FC = () => {
  return (
    <header className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-left">
          <Logo />
        </div>
        <div className="toolbar-right">
          <Navigation />
          <div className="divider" />
          <AuthActions />
        </div>
      </div>
    </header>
  );
};

export default Toolbar;
