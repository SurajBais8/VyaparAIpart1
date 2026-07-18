/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const helpers = {
  getDeviceDetails: (): { os: string; browser: string } => {
    const ua = navigator.userAgent;
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';

    if (ua.indexOf('Win') !== -1) os = 'Windows';
    if (ua.indexOf('Mac') !== -1) os = 'macOS';
    if (ua.indexOf('Linux') !== -1) os = 'Linux';
    if (ua.indexOf('Android') !== -1) os = 'Android';
    if (ua.indexOf('like Mac') !== -1) os = 'iOS';

    if (ua.indexOf('Chrome') !== -1) browser = 'Google Chrome';
    else if (ua.indexOf('Safari') !== -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Mozilla Firefox';
    else if (ua.indexOf('MSIE') !== -1 || !!(document as any).documentMode) browser = 'Internet Explorer';

    return { os, browser };
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  sleep: (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
