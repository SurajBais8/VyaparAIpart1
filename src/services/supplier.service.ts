/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const STORAGE_KEY_SUPPLIERS = 'crm_inventory_suppliers';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  mobile: string;
  address: string;
  category: string;
  reliabilityScore: number; // 0 to 100
  outstandingBalance: number;
  status: 'Active' | 'Blacklisted' | 'Inactive';
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-01',
    name: 'Tata Tele Infra Ltd',
    contactPerson: 'Sanjay Dutt',
    email: 'infra@tata.com',
    mobile: '9822334455',
    address: 'Sion Fort Road, Mumbai',
    category: 'Hardware Systems',
    reliabilityScore: 98,
    outstandingBalance: 150000,
    status: 'Active'
  },
  {
    id: 'SUP-02',
    name: 'Cognitive Solutions Pvt Ltd',
    contactPerson: 'Aditi Deshmukh',
    email: 'sales@cognitive.in',
    mobile: '9144556677',
    address: 'Electronics City, Bengaluru',
    category: 'Software Systems',
    reliabilityScore: 95,
    outstandingBalance: 80000,
    status: 'Active'
  },
  {
    id: 'SUP-03',
    name: 'Vellore Tech Importers',
    contactPerson: 'Prabhu Swamy',
    email: 'imports@velloretech.com',
    mobile: '9344558899',
    address: 'SIPCOT Complex, Vellore',
    category: 'Hardware Routers',
    reliabilityScore: 88,
    outstandingBalance: 450000,
    status: 'Active'
  }
];

class SupplierService {
  private getSups(): Supplier[] {
    const saved = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(DEFAULT_SUPPLIERS));
      return DEFAULT_SUPPLIERS;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_SUPPLIERS;
    }
  }

  private saveSups(sups: Supplier[]) {
    localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(sups));
  }

  async getSuppliers(): Promise<Supplier[]> {
    return this.getSups();
  }

  async createSupplier(sup: Omit<Supplier, 'id'>): Promise<Supplier> {
    const sups = this.getSups();
    const newSup: Supplier = {
      ...sup,
      id: `SUP-0${sups.length + 1}`
    };
    sups.push(newSup);
    this.saveSups(sups);
    return newSup;
  }

  async updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier> {
    const sups = this.getSups();
    const idx = sups.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Supplier not found');

    sups[idx] = { ...sups[idx], ...updates };
    this.saveSups(sups);
    return sups[idx];
  }

  async deleteSupplier(id: string): Promise<boolean> {
    const sups = this.getSups();
    const filtered = sups.filter(s => s.id !== id);
    this.saveSups(filtered);
    return true;
  }
}

export const supplierService = new SupplierService();
export default supplierService;
