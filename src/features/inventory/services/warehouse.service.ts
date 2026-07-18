import warehousesMock from '../../../mock/warehouses.json';
import { productService, Product } from './product.service';

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  capacityLevel: number;
  maxCapacity: number;
  manager: string;
  status: 'Active' | 'Under Maintenance' | 'Full';
  employees: string[];
  stockValue: number;
  recentTransfers: string[];
}

const STORAGE_KEY_WAREHOUSES = 'crm_v3_warehouses';

class WarehouseService {
  private getLocalWarehouses(): Warehouse[] {
    const saved = localStorage.getItem(STORAGE_KEY_WAREHOUSES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_WAREHOUSES, JSON.stringify(warehousesMock));
      return warehousesMock as Warehouse[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return warehousesMock as Warehouse[];
    }
  }

  private saveLocalWarehouses(warehouses: Warehouse[]) {
    localStorage.setItem(STORAGE_KEY_WAREHOUSES, JSON.stringify(warehouses));
  }

  async getWarehouses(): Promise<Warehouse[]> {
    return this.getLocalWarehouses();
  }

  async getWarehouseById(id: string): Promise<Warehouse | undefined> {
    const whs = this.getLocalWarehouses();
    return whs.find(w => w.id === id);
  }

  async getWarehouseStock(warehouseId: string): Promise<Product[]> {
    const prods = await productService.getProducts();
    return prods.filter(p => p.warehouseId === warehouseId);
  }
}

export const warehouseService = new WarehouseService();
export default warehouseService;
