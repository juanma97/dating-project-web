import React from 'react';
import './component.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-logo">Speed Dating Connect</span>
          <p className="footer-tagline">Real connections in a digital world.</p>
        </div>
        <div className="footer-right">
          <div className="social-links">
            <a href="#" className="social-link">
              Instagram
            </a>
            <a href="#" className="social-link">
              Twitter
            </a>
            <a href="#" className="social-link">
              Facebook
            </a>
          </div>
          <p className="copyright">&copy; 2026 Speed Dating Connect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
