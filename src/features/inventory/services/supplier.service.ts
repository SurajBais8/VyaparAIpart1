import suppliersMock from '../../../mock/suppliers.json';

export interface SupplierPayment {
  id: string;
  date: string;
  amount: number;
  status: string;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'Preferred' | 'Active' | 'Reviewing';
  rating: number;
  notes: string;
  payments: SupplierPayment[];
  documents: string[];
  aiSummary: string;
}

const STORAGE_KEY_SUPPLIERS = 'crm_v3_suppliers';

class SupplierService {
  private getLocalSuppliers(): Supplier[] {
    const saved = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(suppliersMock));
      return suppliersMock as Supplier[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return suppliersMock as Supplier[];
    }
  }

  private saveLocalSuppliers(suppliers: Supplier[]) {
    localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(suppliers));
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.getLocalSuppliers();
  }

  async getSupplierProfile(id: string): Promise<Supplier | undefined> {
    const suppliers = this.getLocalSuppliers();
    return suppliers.find(s => s.id === id);
  }

  async getSupplierPayments(supplierId: string): Promise<SupplierPayment[]> {
    const supplier = await this.getSupplierProfile(supplierId);
    return supplier ? supplier.payments : [];
  }
}

export const supplierService = new SupplierService();
export default supplierService;
