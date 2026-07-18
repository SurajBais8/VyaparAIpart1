/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageType } from '../types';
import { TRANSLATIONS } from '../constants/languages';

export const languageService = {
  getLanguage: (): LanguageType => {
    const saved = localStorage.getItem('saas-lang') as LanguageType;
    return saved || 'en';
  },

  setLanguage: (lang: LanguageType): void => {
    localStorage.setItem('saas-lang', lang);
  },

  getTranslation: (lang: LanguageType) => {
    return TRANSLATIONS[lang] || TRANSLATIONS.en;
  }
};
