import React from 'react';
import { theme } from '../../../theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = true,
  style,
  className = '',
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    width: fullWidth ? '100%' : 'auto',
    marginBottom: theme.spacing.md,
  };

  const inputStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,
    border: `2px solid ${error ? theme.colors.accent : theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text.primary,
    transition: theme.transitions.fast,
    outline: 'none',
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label
          style={{
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.text.secondary,
            paddingLeft: theme.spacing.xs,
          }}
        >
          {label}
        </label>
      )}
      <input
        style={inputStyle}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = theme.colors.primary;
          e.currentTarget.style.boxShadow = theme.shadows.soft;
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: theme.typography.sizes.xs,
            color: theme.colors.accent,
            paddingLeft: theme.spacing.xs,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
