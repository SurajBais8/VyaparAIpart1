/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY_PURCHASES = 'crm_inventory_purchases';

export interface PurchaseOrderItem {
  itemId: string;
  name: string;
  sku: string;
  quantity: number;
  costPrice: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  items: PurchaseOrderItem[];
  taxRate: number; // percentage
  shippingCost: number;
  totalCost: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  notes: string;
}

const DEFAULT_PURCHASES: PurchaseOrder[] = [
  {
    id: 'PO-8001',
    orderNumber: 'PO-2026-001',
    supplierId: 'SUP-01',
    supplierName: 'Tata Tele Infra Ltd',
    orderDate: '2026-07-01',
    deliveryDate: '2026-07-15',
    items: [
      { itemId: 'INV-1001', name: 'Premium Cloud Core Server V4', sku: 'SRV-CLOUD-V4', quantity: 5, costPrice: 95000 },
      { itemId: 'INV-1003', name: 'FIPS 140-2 Encryption Shield', sku: 'SEC-FIPS-HSM', quantity: 2, costPrice: 140000 }
    ],
    taxRate: 18,
    shippingCost: 15000,
    totalCost: 905700, // (475000 + 280000) * 1.18 + 15000
    status: 'Delivered',
    paymentStatus: 'Paid',
    notes: 'SLA priority hosting node deployments.'
  },
  {
    id: 'PO-8002',
    orderNumber: 'PO-2026-002',
    supplierId: 'SUP-02',
    supplierName: 'Cognitive Solutions Pvt Ltd',
    orderDate: '2026-07-10',
    deliveryDate: '2026-07-22',
    items: [
      { itemId: 'INV-1002', name: 'Enterprise AI Agent Module', sku: 'SW-AGNT-ENT', quantity: 20, costPrice: 12000 }
    ],
    taxRate: 18,
    shippingCost: 5000,
    totalCost: 288200, // 240000 * 1.18 + 5000
    status: 'Approved',
    paymentStatus: 'Partially Paid',
    notes: 'Urgent AI cluster upgrades.'
  },
  {
    id: 'PO-8003',
    orderNumber: 'PO-2026-003',
    supplierId: 'SUP-03',
    supplierName: 'Vellore Tech Importers',
    orderDate: '2026-07-17',
    deliveryDate: '2026-07-30',
    items: [
      { itemId: 'INV-1004', name: 'Unlimited Sync Endpoint Node', sku: 'NODE-SYNC-UNL', quantity: 15, costPrice: 25000 }
    ],
    taxRate: 18,
    shippingCost: 8500,
    totalCost: 451000,
    status: 'Pending Approval',
    paymentStatus: 'Unpaid',
    notes: 'Backup routers stock replenishment.'
  }
];

class PurchaseService {
  private getPOs(): PurchaseOrder[] {
    const saved = localStorage.getItem(STORAGE_KEY_PURCHASES);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(DEFAULT_PURCHASES));
      return DEFAULT_PURCHASES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_PURCHASES;
    }
  }

  private savePOs(pos: PurchaseOrder[]) {
    localStorage.setItem(STORAGE_KEY_PURCHASES, JSON.stringify(pos));
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.getPOs();
  }

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'totalCost'>): Promise<PurchaseOrder> {
    const pos = this.getPOs();
    const itemsCost = po.items.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0);
    const totalCost = Math.round(itemsCost * (1 + po.taxRate / 100) + po.shippingCost);

    const newPO: PurchaseOrder = {
      ...po,
      id: `PO-${Math.floor(Math.random() * 9000 + 1000)}`,
      orderNumber: `PO-2026-0${pos.length + 1}`,
      totalCost
    };

    pos.unshift(newPO);
    this.savePOs(pos);
    return newPO;
  }

  async updatePurchaseOrderStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    const pos = this.getPOs();
    const idx = pos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Purchase order not found');

    pos[idx].status = status;
    this.savePOs(pos);
    return pos[idx];
  }

  async updatePurchaseOrderPayment(id: string, payment: PurchaseOrder['paymentStatus']): Promise<PurchaseOrder> {
    const pos = this.getPOs();
    const idx = pos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Purchase order not found');

    pos[idx].paymentStatus = payment;
    this.savePOs(pos);
    return pos[idx];
  }

  async deletePurchaseOrder(id: string): Promise<boolean> {
    const pos = this.getPOs();
    const filtered = pos.filter(p => p.id !== id);
    this.savePOs(filtered);
    return true;
  }
}

export const purchaseService = new PurchaseService();
export default purchaseService;
