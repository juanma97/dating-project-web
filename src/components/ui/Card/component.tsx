import React from 'react';
import { theme } from '../../../theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof theme.spacing;
  shadow?: 'soft' | 'medium' | 'none';
  variant?: 'surface' | 'background' | 'primary';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = 'soft',
  variant = 'surface',
  className = '',
  onClick,
  style: styleProp,
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: (theme.colors[variant] as string) || theme.colors.surface,
    padding: theme.spacing[padding],
    boxShadow: shadow !== 'none' ? theme.shadows[shadow] : 'none',
    borderRadius: theme.radius.lg,
    transition: theme.transitions.normal,
    cursor: onClick ? 'pointer' : 'default',
    border: variant === 'surface' ? `1px solid ${theme.colors.border}` : 'none',
    overflow: 'hidden',
  };

  const hoverStyles = onClick
    ? {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows.medium,
      }
    : {};

  return (
    <div
      className={`zapyens-card ${className}`}
      style={{ ...baseStyles, ...hoverStyles, ...styleProp }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
