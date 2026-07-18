import productsMock from '../../../mock/products.json';
import inventoryMock from '../../../mock/inventory.json';

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitPrice: number;
  sellingPrice: number;
  purchasePrice: number;
  status: string;
  lastUpdated: string;
  description: string;
  supplierId?: string;
  supplierName?: string;
}

export interface InventorySummary {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  inventoryValue: number;
  lowStock: number;
  outOfStock: number;
  pendingPurchaseOrders: number;
  pendingTransfers: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const STORAGE_KEY_PRODUCTS = 'crm_v3_products';
const STORAGE_KEY_SUMMARY = 'crm_v3_inventory_summary';

class InventoryService {
  private getLocalProducts(): Product[] {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(productsMock));
      return productsMock as Product[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return productsMock as Product[];
    }
  }

  private saveLocalProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  async getInventory(): Promise<Product[]> {
    return this.getLocalProducts();
  }

  async getInventorySummary(): Promise<InventorySummary> {
    const products = this.getLocalProducts();
    const lowStockCount = products.filter(p => p.quantity < 10).length;
    const outOfStockCount = products.filter(p => p.quantity === 0).length;
    const totalValue = products.reduce((acc, p) => acc + p.quantity * p.purchasePrice, 0);

    const savedSummary = localStorage.getItem(STORAGE_KEY_SUMMARY);
    let summaryBase = inventoryMock as InventorySummary;
    if (savedSummary) {
      try {
        summaryBase = JSON.parse(savedSummary);
      } catch {
        // ignore
      }
    }

    const updatedSummary: InventorySummary = {
      ...summaryBase,
      totalProducts: products.length,
      inventoryValue: totalValue,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount
    };

    localStorage.setItem(STORAGE_KEY_SUMMARY, JSON.stringify(updatedSummary));
    return updatedSummary;
  }

  async getStockHistory(productId: string): Promise<Array<{ date: string; change: number; type: string; balance: number; notes: string }>> {
    // Generate mock stock history movements for a product
    return [
      { date: '2026-07-18', change: 10, type: 'Inbound', balance: 45, notes: 'Received goods via PO-903' },
      { date: '2026-07-15', change: -5, type: 'Reserved', balance: 35, notes: 'Reserved for Order #ORD-1102' },
      { date: '2026-07-12', change: 20, type: 'Adjustment', balance: 40, notes: 'Audited stock level adjustment' },
      { date: '2026-07-10', change: -2, type: 'Outbound', balance: 20, notes: 'Transferred via TRSF-501' }
    ];
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
