import '@testing-library/jest-dom';
// @ts-ignore
import translationEN from './locales/en/translation.json';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Logic to return EN translations in tests
      const parts = key.split('.');
      let result: any = translationEN;

      for (const part of parts) {
        if (result && typeof result === 'object' && part in result) {
          result = result[part];
        } else {
          result = key;
          break;
        }
      }

      // Interpolation logic if options exist (basic)
      if (options && typeof result === 'string') {
        Object.keys(options).forEach((k) => {
          result = result.replace(new RegExp(`{{${k}}}`, 'g'), options[k]);
        });
      }

      return result;
    },
    i18n: {
      changeLanguage: () => Promise.resolve(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({ children }: any) => children,
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  })),
}));
