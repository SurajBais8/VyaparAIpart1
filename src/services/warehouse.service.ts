/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY_WAREHOUSES = 'crm_inventory_warehouses';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  capacityLevel: number; // in units
  maxCapacity: number;   // in units
  manager: string;
  status: 'Active' | 'Under Maintenance' | 'Full';
}

const DEFAULT_WAREHOUSES: Warehouse[] = [
  {
    id: 'WH-01',
    name: 'Mumbai Central Hub',
    code: 'MUM-HUB-01',
    location: 'Bandra Kurla Complex, Mumbai',
    capacityLevel: 450,
    maxCapacity: 1000,
    manager: 'Rajesh Nair',
    status: 'Active'
  },
  {
    id: 'WH-02',
    name: 'Bengaluru Cloud Node',
    code: 'BLR-NODE-02',
    location: 'Whitefield Industrial Area, Bengaluru',
    capacityLevel: 820,
    maxCapacity: 900,
    manager: 'Ananya Rao',
    status: 'Active'
  },
  {
    id: 'WH-03',
    name: 'Chennai Storage Vault',
    code: 'CHN-VAULT-03',
    location: 'Guindy Highway, Chennai',
    capacityLevel: 150,
    maxCapacity: 800,
    manager: 'Karthik Raja',
    status: 'Active'
  }
];

class WarehouseService {
  private getWHs(): Warehouse[] {
    const saved = localStorage.getItem(STORAGE_KEY_WAREHOUSES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_WAREHOUSES, JSON.stringify(DEFAULT_WAREHOUSES));
      return DEFAULT_WAREHOUSES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_WAREHOUSES;
    }
  }

  private saveWHs(whs: Warehouse[]) {
    localStorage.setItem(STORAGE_KEY_WAREHOUSES, JSON.stringify(whs));
  }

  async getWarehouses(): Promise<Warehouse[]> {
    return this.getWHs();
  }

  async createWarehouse(wh: Omit<Warehouse, 'id'>): Promise<Warehouse> {
    const whs = this.getWHs();
    const newWH: Warehouse = {
      ...wh,
      id: `WH-${Math.floor(Math.random() * 90 + 10)}`
    };
    whs.push(newWH);
    this.saveWHs(whs);
    return newWH;
  }

  async updateWarehouse(id: string, updates: Partial<Warehouse>): Promise<Warehouse> {
    const whs = this.getWHs();
    const idx = whs.findIndex(w => w.id === id);
    if (idx === -1) throw new Error('Warehouse not found');

    whs[idx] = { ...whs[idx], ...updates };
    this.saveWHs(whs);
    return whs[idx];
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    const whs = this.getWHs();
    const filtered = whs.filter(w => w.id !== id);
    this.saveWHs(filtered);
    return true;
  }
}

export const warehouseService = new WarehouseService();
export default warehouseService;
