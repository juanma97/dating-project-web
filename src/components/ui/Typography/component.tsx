import React from 'react';
import { theme } from '../../../theme';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption';
  color?: keyof typeof theme.colors.text | string;
  weight?: keyof typeof theme.typography.weights;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'primary',
  weight,
  align = 'left',
  children,
  className = '',
  as,
  style: styleProp,
}) => {
  const Component = as || (variant.startsWith('h') ? (variant as React.ElementType) : 'p');

  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return theme.typography.sizes.xxl;
      case 'h2':
        return theme.typography.sizes.xl;
      case 'h3':
        return theme.typography.sizes.lg;
      case 'h4':
        return theme.typography.sizes.md;
      case 'body1':
        return theme.typography.sizes.md;
      case 'body2':
        return theme.typography.sizes.sm;
      case 'caption':
        return theme.typography.sizes.xs;
      default:
        return theme.typography.sizes.md;
    }
  };

  const getFontWeight = () => {
    if (weight) return theme.typography.weights[weight];
    if (variant.startsWith('h')) return theme.typography.weights.bold;
    return theme.typography.weights.regular;
  };

  const textColor = (theme.colors.text as any)[color] || color;

  const baseStyle: React.CSSProperties = {
    fontSize: getFontSize(),
    fontWeight: getFontWeight(),
    color: textColor,
    textAlign: align,
    margin: 0,
    fontFamily: theme.typography.fontFamily,
  };

  return (
    <Component className={className} style={{ ...baseStyle, ...styleProp }}>
      {children}
    </Component>
  );
};

export default Typography;
