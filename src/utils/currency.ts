/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const currencyUtils = {
  format: (amount: number, currency: string = 'INR', locale: string = 'en-IN'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
};
