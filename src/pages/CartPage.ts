import type { Locator, Page } from '@playwright/test';

/** Step 1 of the checkout: the cart. */
export class CartPage {
  readonly productTitle: Locator;
  readonly productQuantity: Locator;
  readonly linePrice: Locator;
  readonly total: Locator;
  readonly proceedButton: Locator;

  constructor(page: Page) {
    this.productTitle = page.getByTestId('product-title');
    this.productQuantity = page.getByTestId('product-quantity');
    this.linePrice = page.getByTestId('line-price');
    this.total = page.getByTestId('cart-total');
    this.proceedButton = page.getByTestId('proceed-1');
  }
}
