import { test as base } from '@playwright/test';
import { buyableProductName } from './api/products';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProductPage } from './pages/ProductPage';

interface Fixtures {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  /** A product that is in stock right now (see buyableProductName). */
  productName: string;
}

/** Every test gets its page objects ready, so specs only describe behavior. */
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  productName: async ({ request }, use) => use(await buyableProductName(request)),
});

export { expect } from '@playwright/test';
