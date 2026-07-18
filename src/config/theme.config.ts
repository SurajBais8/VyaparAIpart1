/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const THEME_CONFIG = {
  accentColors: ['indigo', 'violet', 'blue', 'emerald'] as const,
  borderRadiusOptions: [
    { label: 'Compact', value: 'rounded-md' },
    { label: 'Standard', value: 'rounded-xl' },
    { label: 'Generous', value: 'rounded-2xl' },
    { label: 'Pill', value: 'rounded-3xl' }
  ] as const,
  sidebarStyles: ['glass', 'solid', 'gradient'] as const
};
