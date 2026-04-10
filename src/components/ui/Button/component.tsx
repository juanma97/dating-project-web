import React from 'react';
import { theme } from '../../../theme';
import './component.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  style,
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.primary,
          color: theme.colors.text.inverse,
        };
      case 'accent':
        return {
          backgroundColor: theme.colors.accent,
          color: theme.colors.text.inverse,
          boxShadow: theme.shadows.soft,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.primaryLight,
          color: theme.colors.text.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          border: `2px solid ${theme.colors.primary}`,
          color: theme.colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: theme.colors.text.secondary,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          fontSize: theme.typography.sizes.sm,
        };
      case 'md':
        return {
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          fontSize: theme.typography.sizes.md,
        };
      case 'lg':
        return {
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          fontSize: theme.typography.sizes.lg,
        };
      case 'full':
        return { padding: `${theme.spacing.sm} ${theme.spacing.md}`, width: '100%' };
      default:
        return {};
    }
  };

  const combinedStyles: React.CSSProperties = {
    borderRadius: theme.radius.md,
    fontWeight: theme.typography.weights.medium,
    transition: theme.transitions.normal,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      className={`zapyens-button ${variant} ${size} ${className}`}
      style={combinedStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
};

export default Button;
