import stockTransfersMock from '../../../mock/stockTransfers.json';

export interface TransferTimelineItem {
  date: string;
  title: string;
  description: string;
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
  status: 'Pending' | 'In Transit' | 'Completed' | 'Cancelled' | 'Requested' | 'Shipped' | 'Received' | 'Rejected';
  date: string;
  timeline: TransferTimelineItem[];
}

const STORAGE_KEY_TRANSFERS = 'crm_v3_stock_transfers';

class StockTransferService {
  private getLocalTransfers(): StockTransfer[] {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSFERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(stockTransfersMock));
      return stockTransfersMock as any[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return stockTransfersMock as any[];
    }
  }

  private saveLocalTransfers(transfers: StockTransfer[]) {
    localStorage.setItem(STORAGE_KEY_TRANSFERS, JSON.stringify(transfers));
  }

  async getTransfers(): Promise<StockTransfer[]> {
    return this.getLocalTransfers();
  }

  async createTransfer(transfer: Omit<StockTransfer, 'id' | 'date' | 'timeline'>): Promise<StockTransfer> {
    const transfers = this.getLocalTransfers();
    const newTransfer: StockTransfer = {
      ...transfer,
      id: `TRSF-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split('T')[0],
      timeline: [
        {
          date: new Date().toISOString().split('T')[0],
          title: 'Relocation Created',
          description: `Transfer of ${transfer.quantity} items from ${transfer.sourceWarehouseName} to ${transfer.destWarehouseName} drafted.`
        }
      ]
    };
    transfers.unshift(newTransfer);
    this.saveLocalTransfers(transfers);
    return newTransfer;
  }

  async getTransferHistory(itemId: string): Promise<StockTransfer[]> {
    const transfers = this.getLocalTransfers();
    return transfers.filter(t => t.itemId === itemId);
  }

  async updateTransferStatus(id: string, status: StockTransfer['status']): Promise<StockTransfer> {
    const transfers = this.getLocalTransfers();
    const idx = transfers.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Transfer record not found');

    const tr = transfers[idx];
    tr.status = status;
    tr.timeline.push({
      date: new Date().toISOString().split('T')[0],
      title: `Status Set: ${status}`,
      description: `Transit state updated to ${status}`
    });

    this.saveLocalTransfers(transfers);
    return tr;
  }
}

export const stockTransferService = new StockTransferService();
export default stockTransferService;
