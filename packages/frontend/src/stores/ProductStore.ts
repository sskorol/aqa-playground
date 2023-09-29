import { makeAutoObservable } from 'mobx';
import api from '../api';
import { Product } from '../types/Product';

class ProductStore {
  products: Product[] = [];
  isLoading = true;
  error: string | null = null;
  isCreated = false;

  constructor() {
    makeAutoObservable(this);
  }

  async getProducts() {
    this.setIsLoading(true);
    try {
      const response = await api.get('/products');
      this.setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      this.setIsLoading(false);
    }
  }

  async addProduct(product: Product) {
    try {
      await api.post('/products', product);
      this.setIsCreated(true);
    } catch (error) {
      this.setIsCreated(false);
      this.setError('Unable to add a new product');
      console.error('Failed to create a new product', error);
    }
  }

  clearError() {
    this.setError(null);
  }

  setError(value: string | null) {
    this.error = value;
  }

  setIsCreated(value: boolean) {
    this.isCreated = value;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  setProducts(value: Product[]) {
    this.products = value;
  }
}

const productStore = new ProductStore();

export default productStore;
