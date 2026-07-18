import { inventoryService, Product } from './inventory.service';
export type { Product };

const STORAGE_KEY_PRODUCTS = 'crm_v3_products';

class ProductService {
  private getLocalProducts(): Product[] {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!saved) {
      // Trigger initialization from inventoryService
      return [] as Product[];
    }
    try {
      return JSON.parse(saved);
    } catch {
      return [] as Product[];
    }
  }

  private saveLocalProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  async getProducts(): Promise<Product[]> {
    let prods = this.getLocalProducts();
    if (prods.length === 0) {
      prods = await inventoryService.getInventory();
    }
    return prods;
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const prods = await this.getProducts();
    return prods.find(p => p.id === id);
  }

  async createProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Promise<Product> {
    const prods = await this.getProducts();
    const newProd: Product = {
      ...product,
      id: `PROD-00${prods.length + 1}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    prods.unshift(newProd);
    this.saveLocalProducts(prods);
    return newProd;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const prods = await this.getProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    prods[idx] = {
      ...prods[idx],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.saveLocalProducts(prods);
    return prods[idx];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const prods = await this.getProducts();
    const filtered = prods.filter(p => p.id !== id);
    this.saveLocalProducts(filtered);
    return true;
  }
}

export const productService = new ProductService();
export default productService;
