/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY_ITEMS = 'crm_inventory_items';
const STORAGE_KEY_TRANSFERS = 'crm_inventory_transfers';

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  stockLevel: number;
  minStockLevel: number;
  unitPrice: number;
  costPrice: number;
  supplierId: string;
  supplierName: string;
}

export interface StockTransfer {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destWarehouseId: string;
  destWarehouseName: string;
  quantity: number;
  status: 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';
  date: string;
}

const DEFAULT_ITEMS: InventoryItem[] = [
  {
    id: 'INV-1001',
    name: 'Premium Cloud Core Server V4',
    sku: 'SRV-CLOUD-V4',
    barcode: '8901234567890',
    category: 'Hardware',
    warehouseId: 'WH-01',
    warehouseName: 'Mumbai Central Hub',
    stockLevel: 14,
    minStockLevel: 5,
    unitPrice: 150000,
    costPrice: 95000,
    supplierId: 'SUP-01',
    supplierName: 'Tata Tele Infra Ltd'
  },
  {
    id: 'INV-1002',
    name: 'Enterprise AI Agent Module',
    sku: 'SW-AGNT-ENT',
    barcode: '8901234567891',
    category: 'Software License',
    warehouseId: 'WH-02',
    warehouseName: 'Bengaluru Cloud Node',
    stockLevel: 150,
    minStockLevel: 20,
    unitPrice: 85000,
    costPrice: 12000,
    supplierId: 'SUP-02',
    supplierName: 'Cognitive Solutions Pvt Ltd'
  },
  {
    id: 'INV-1003',
    name: 'FIPS 140-2 Encryption Shield',
    sku: 'SEC-FIPS-HSM',
    barcode: '8901234567892',
    category: 'Hardware Security',
    warehouseId: 'WH-01',
    warehouseName: 'Mumbai Central Hub',
    stockLevel: 3,
    minStockLevel: 10, // Stock Warning Trigger!
    unitPrice: 220000,
    costPrice: 140000,
    supplierId: 'SUP-01',
    supplierName: 'Tata Tele Infra Ltd'
  },
  {
    id: 'INV-1004',
    name: 'Unlimited Sync Endpoint Node',
    sku: 'NODE-SYNC-UNL',
    barcode: '8901234567893',
    category: 'Hardware Router',
    warehouseId: 'WH-03',
    warehouseName: 'Chennai Storage Vault',
    stockLevel: 45,
    minStockLevel: 15,
    unitPrice: 45000,
    costPrice: 25000,
    supplierId: 'SUP-03',
    supplierName: 'Vellore Tech Importers'
  },
  {
    id: 'INV-1005',
    name: 'Standard SLA Contract Document Token',
    sku: 'DOC-TOK-SLA',
    barcode: '8901234567894',
    category: 'Software License',
    warehouseId: 'WH-02',
    warehouseName: 'Bengaluru Cloud Node',
    stockLevel: 2,
    minStockLevel: 8, // Stock Warning Trigger!
    unitPrice: 15000,
    costPrice: 1500,
    supplierId: 'SUP-02',
    supplierName: 'Cognitive Solutions Pvt Ltd'
  }
];

const DEFAULT_TRANSFERS: StockTransfer[] = [
  {
    id: 'TRSF-501',
    itemId: 'INV-1001',
    itemName: 'Premium Cloud Core Server V4',
    sku: 'SRV-CLOUD-V4',
    sourceWarehouseId: 'WH-01',
    sourceWarehouseName: 'Mumbai Central Hub',
    destWarehouseId: 'WH-03',
    destWarehouseName: 'Chennai Storage Vault',
    quantity: 2,
    status: 'Completed',
    date: '2026-07-10'
  },
  {
    id: 'TRSF-502',
    itemId: 'INV-1003',
    itemName: 'FIPS 140-2 Encryption Shield',
    sku: 'SEC-FIPS-HSM',
    sourceWarehouseId: 'WH-03',
    sourceWarehouseName: 'Chennai Storage Vault',
    destWarehouseId: 'WH-01',
    destWarehouseName: 'Mumbai Central Hub',
    quantity: 5,
    status: 'In Transit',
    date: '2026-07-16'
  },
  {
    id: 'TRSF-503',
    itemId: 'INV-1004',
    itemName: 'Unlimited Sync Endpoint Node',
    sku: 'NODE-SYNC-UNL',
    sourceWarehouseId: 'WH-02',
    sourceWarehouseName: 'Bengaluru Cloud Node',
    destWarehouseId: 'WH-03',
    destWarehouseName: 'Chennai Storage Vault',
    quantity: 10,
    status: 'Pending',
    date: '2026-07-18'
  }
];

class InventoryService {
  private getItems(): InventoryItem[] {
    const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(DEFAULT_ITEMS));
      return DEFAULT_ITEMS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_ITEMS;
    }
  }

  private saveItems(items: InventoryItem[]) {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }

  async getInventoryItems(): Promise<InventoryItem[]> {
    return this.getItems();
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const items = this.getItems();
    const newItem: InventoryItem = {
      ...item,
      id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`
    };
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  }

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const items = this.getItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Inventory item not found');
    
    items[idx] = { ...items[idx], ...updates };
    this.saveItems(items);
    return items[idx];
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    const items = this.getItems();
    const filtered = items.filter(i => i.id !== id);
    this.saveItems(filtered);
    return true;
  }

  async getInventoryAlerts(): Promise<InventoryItem[]> {
    const items = this.getItems();
    return items.filter(item => item.stockLevel <= item.minStockLevel);
  }

  // Stock Transfers
  private getTransfers(): StockTransfer[] {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSFERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(DEFAULT_TRANSFERS));
      return DEFAULT_TRANSFERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_TRANSFERS;
    }
  }

  private saveTransfers(transfers: StockTransfer[]) {
    localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(transfers));
  }

  async getStockTransfers(): Promise<StockTransfer[]> {
    return this.getTransfers();
  }

  async createStockTransfer(transfer: Omit<StockTransfer, 'id' | 'date'>): Promise<StockTransfer> {
    const transfers = this.getTransfers();
    const newTransfer: StockTransfer = {
      ...transfer,
      id: `TRSF-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split('T')[0]
    };

    // If completed immediately, adjust stock values
    if (newTransfer.status === 'Completed') {
      await this.executeStockAdjustment(newTransfer.itemId, newTransfer.quantity, newTransfer.sourceWarehouseId, newTransfer.destWarehouseId);
    }

    transfers.unshift(newTransfer);
    this.saveTransfers(transfers);
    return newTransfer;
  }

  async updateTransferStatus(id: string, status: StockTransfer['status']): Promise<StockTransfer> {
    const transfers = this.getTransfers();
    const idx = transfers.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transfer record not found');
    
    const prevStatus = transfers[idx].status;
    transfers[idx].status = status;

    if (status === 'Completed' && prevStatus !== 'Completed') {
      await this.executeStockAdjustment(
        transfers[idx].itemId, 
        transfers[idx].quantity, 
        transfers[idx].sourceWarehouseId, 
        transfers[idx].destWarehouseId
      );
    }

    this.saveTransfers(transfers);
    return transfers[idx];
  }

  private async executeStockAdjustment(itemId: string, qty: number, sourceWH: string, destWH: string) {
    const items = this.getItems();
    
    // Decrease from source warehouse if valid
    const sourceIdx = items.findIndex(i => i.id === itemId && i.warehouseId === sourceWH);
    if (sourceIdx !== -1) {
      items[sourceIdx].stockLevel = Math.max(0, items[sourceIdx].stockLevel - qty);
    }

    // Increase in dest warehouse
    const destIdx = items.findIndex(i => i.id === itemId && i.warehouseId === destWH);
    if (destIdx !== -1) {
      items[destIdx].stockLevel += qty;
    } else {
      // If item does not exist in destination, create/clone it there
      const baseItem = items.find(i => i.id === itemId);
      if (baseItem) {
        items.push({
          ...baseItem,
          id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
          warehouseId: destWH,
          warehouseName: destWH === 'WH-01' ? 'Mumbai Central Hub' : destWH === 'WH-02' ? 'Bengaluru Cloud Node' : 'Chennai Storage Vault',
          stockLevel: qty
        });
      }
    }
    this.saveItems(items);
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
