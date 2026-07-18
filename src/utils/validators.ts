/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const validators = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPhone: (phone: string): boolean => {
    return /^\+?[1-9]\d{1,14}$/.test(phone);
  },

  isValidGST: (gst: string): boolean => {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst.toUpperCase());
  },

  isValidPAN: (pan: string): boolean => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  },

  isValidPincode: (pin: string): boolean => {
    return /^[1-9][0-9]{5}$/.test(pin); // Indian pincodes standard 6 digits
  }
};
