import React, { useEffect, useState } from 'react';
import './component.css';

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
  type?: 'info' | 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, duration = 5000, onClose, type = 'info' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast-message toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <span className="toast-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </span>
      {message}
    </div>
  );
};

export default Toast;
