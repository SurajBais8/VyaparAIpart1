/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const formatters = {
  uppercase: (str: string): string => {
    return str.toUpperCase();
  },

  maskAccountNumber: (accountNumber: string): string => {
    if (!accountNumber || accountNumber.length < 4) return '••••';
    return `•••• ${accountNumber.slice(-4)}`;
  },

  slugify: (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
};
