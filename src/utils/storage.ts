/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { storageService } from '../services/storage.service';

export const storageHelpers = {
  get: storageService.get,
  set: storageService.set,
  remove: storageService.remove,
};
