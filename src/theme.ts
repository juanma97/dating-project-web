export const theme = {
  colors: {
    primary: '#3A7D6B',
    primaryLight: '#A8D5BA',
    accent: '#FF6B5C',

    background: '#F4EDE4',
    surface: '#FFFFFF',

    text: {
      primary: '#1F3D36',
      secondary: '#3A7D6B',
      muted: '#6B8F86',
      inverse: '#FFFFFF',
    },

    border: '#E3DCD2',

    secondary: {
      blue: '#7FD1C2',
      pink: '#F7A9A0',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },

  shadows: {
    soft: '0 4px 12px rgba(31, 61, 54, 0.08)',
    medium: '0 8px 24px rgba(31, 61, 54, 0.12)',
  },

  typography: {
    fontFamily: `'Inter', 'SF Pro Display', system-ui, sans-serif`,

    sizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '28px',
      xxl: '36px',
    },

    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
  },
};

export type ThemeType = typeof theme;
