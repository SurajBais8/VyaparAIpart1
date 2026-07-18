import purchaseOrdersMock from '../../../mock/purchaseOrders.json';

export interface PurchaseItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  products: PurchaseItem[];
  quantity: number;
  amount: number;
  expectedDate: string;
  status: 'Pending Approval' | 'Approved' | 'Received' | 'Cancelled';
  createdDate: string;
  documents: string[];
  approvalHistory: Array<{
    step: string;
    by: string;
    date: string;
    status: string;
  }>;
  timeline: Array<{
    date: string;
    title: string;
    description: string;
  }>;
}

const STORAGE_KEY_PURCHASE = 'crm_v3_purchase_orders';

class PurchaseService {
  private getLocalPOs(): PurchaseOrder[] {
    const saved = localStorage.getItem(STORAGE_KEY_PURCHASE);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_PURCHASE, JSON.stringify(purchaseOrdersMock));
      return purchaseOrdersMock as any[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return purchaseOrdersMock as any[];
    }
  }

  private saveLocalPOs(pos: PurchaseOrder[]) {
    localStorage.setItem(STORAGE_KEY_PURCHASE, JSON.stringify(pos));
  }

  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.getLocalPOs();
  }

  async getPurchaseDetails(id: string): Promise<PurchaseOrder | undefined> {
    const pos = this.getLocalPOs();
    return pos.find(p => p.id === id);
  }

  async createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'createdDate' | 'timeline' | 'approvalHistory'>): Promise<PurchaseOrder> {
    const pos = this.getLocalPOs();
    const newPO: PurchaseOrder = {
      ...po,
      id: `PO-${Math.floor(Math.random() * 900 + 100)}`,
      createdDate: new Date().toISOString().split('T')[0],
      approvalHistory: [
        {
          step: 'Created PO Draft',
          by: 'Enterprise Platform Agent',
          date: new Date().toISOString(),
          status: 'Done'
        }
      ],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'PO Created',
          description: `Purchase order drafted for ${po.supplierName}`
        }
      ]
    };
    pos.unshift(newPO);
    this.saveLocalPOs(pos);
    return newPO;
  }

  async updatePOStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    const pos = this.getLocalPOs();
    const idx = pos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Purchase Order not found');

    const po = pos[idx];
    po.status = status;
    po.timeline.push({
      date: new Date().toISOString().split('T')[0],
      title: `Status Changed: ${status}`,
      description: `Status updated to ${status} by Administrator`
    });

    if (status === 'Received') {
      po.approvalHistory.push({
        step: 'Goods Received Verification',
        by: 'Receiving Team Coordinator',
        date: new Date().toISOString(),
        status: 'Done'
      });
    }

    this.saveLocalPOs(pos);
    return po;
  }
}

export const purchaseService = new PurchaseService();
export default purchaseService;
