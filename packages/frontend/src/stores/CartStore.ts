import { makeAutoObservable } from 'mobx';
import { Product } from '../types/Product';

export class CartStore {
  cart: Product[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find((p) => p.id === product.id);
    if (existingProduct) {
      this.incrementQuantity(product.id);
    } else {
      product.quantity = 1;
      this.cart.push(product);
    }
  }

  removeFromCart(product: Product) {
    this.setCart(this.cart.filter((p) => p.id !== product.id));
  }

  incrementQuantity(productId: number | null) {
    const product = this.cart.find((p) => p.id === productId);
    if (product) {
      product.quantity += 1;
    }
  }

  decrementQuantity(productId: number | null) {
    const product = this.cart.find((p) => p.id === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
    } else if (product && product.quantity === 1) {
      this.removeFromCart(product);
    }
  }

  clearCart() {
    this.cart = [];
  }

  totalItems() {
    return this.cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }

  setCart(value: Product[]) {
    this.cart = value;
  }
}

const cartStore = new CartStore();

export default cartStore;
