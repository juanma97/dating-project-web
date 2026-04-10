import React from 'react';
import { theme } from '../../../theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'blue' | 'pink';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style: styleProp,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary };
      case 'secondary':
        return {
          backgroundColor: `${theme.colors.primaryLight}30`,
          color: theme.colors.text.secondary,
        };
      case 'accent':
        return { backgroundColor: `${theme.colors.accent}15`, color: theme.colors.accent };
      case 'blue':
        return {
          backgroundColor: `${theme.colors.secondary.blue}20`,
          color: theme.colors.secondary.blue,
        };
      case 'pink':
        return {
          backgroundColor: `${theme.colors.secondary.pink}20`,
          color: theme.colors.secondary.pink,
        };
      default:
        return {};
    }
  };

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === 'sm' ? '2px 8px' : '4px 12px',
    borderRadius: theme.radius.full,
    fontSize: size === 'sm' ? theme.typography.sizes.xs : theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    ...getVariantStyles(),
    ...styleProp,
  };

  return (
    <span className={`zapyens-badge ${className}`} style={style}>
      {children}
    </span>
  );
};

export default Badge;
