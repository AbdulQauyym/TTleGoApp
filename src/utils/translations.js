import en from '../translations/en';
import fa from '../translations/fa';
import ps from '../translations/ps';

const translations = {
  en,
  fa,
  ps,
};

/**
 * Get translation for a given key
 * @param {string} language - Language code (en, fa, ps)
 * @param {string} key - Translation key (e.g., 'profile.guest')
 * @param {object} params - Optional parameters for interpolation
 * @returns {string} Translated text
 */
export const translate = (language, key, params = {}) => {
  const lang = translations[language] || translations.en;
  const keys = key.split('.');
  let value = lang;

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      // Fallback to English if key not found
      const enValue = translations.en;
      let fallback = enValue;
      for (const fallbackKey of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      return fallback || key;
    }
  }

  // Simple parameter interpolation
  if (typeof value === 'string' && params) {
    Object.keys(params).forEach((param) => {
      value = value.replace(`{{${param}}}`, params[param]);
    });
  }

  return value || key;
};

/**
 * Get all translations for a namespace
 * @param {string} language - Language code
 * @param {string} namespace - Namespace (e.g., 'profile')
 * @returns {object} Translations object
 */
export const getTranslations = (language, namespace) => {
  const lang = translations[language] || translations.en;
  return lang[namespace] || {};
};

export default translations;

