import type { Locator, Page } from '@playwright/test';
import { PRODUCT } from '../data/testData';

/** Product detail: price, quantity and add to cart. */
export class ProductPage {
  readonly unitPrice: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;
  readonly notification: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.unitPrice = page.getByTestId('unit-price');
    this.quantity = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.notification = page.getByRole('alert');
    this.cartBadge = page.getByTestId('cart-quantity');
    this.cartLink = page.getByTestId('nav-cart');
  }

  async addToCart(quantity = PRODUCT.defaultQuantity): Promise<void> {
    await this.quantity.fill(String(quantity));
    await this.addToCartButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
