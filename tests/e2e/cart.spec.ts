import { MESSAGES, PRODUCT } from '../../src/data/testData';
import { expect, test } from '../../src/fixtures';
import { parsePrice, toCents } from '../../src/helpers/price';

test.describe('Cart', () => {
  test.beforeEach(async ({ homePage, productName }) => {
    await homePage.goto();
    await homePage.openProduct(productName);
  });

  test('TC-CART-01: Verify that adding a product updates the cart badge and confirms it', async ({ productPage }) => {
    // Act
    await productPage.addToCart();

    // Assert
    await expect(productPage.notification).toHaveText(MESSAGES.addedToCart);
    await expect(productPage.cartBadge).toHaveText(String(PRODUCT.defaultQuantity));
  });

  test('TC-CART-02: Verify that the line total equals unit price times quantity', async ({
    productPage,
    cartPage,
    productName,
  }) => {
    // Arrange
    const unitPrice = parsePrice(await productPage.unitPrice.innerText());
    const expectedCents = toCents(unitPrice * PRODUCT.quantity);

    // Act
    await productPage.addToCart(PRODUCT.quantity);
    await expect(productPage.cartBadge).toHaveText(String(PRODUCT.quantity)); // guard: the cart has been updated
    await productPage.openCart();

    // Assert
    await expect(cartPage.productTitle).toHaveText(productName);
    await expect(cartPage.productQuantity).toHaveValue(String(PRODUCT.quantity));
    await expect.poll(async () => toCents(parsePrice(await cartPage.linePrice.innerText()))).toBe(expectedCents);
    await expect.poll(async () => toCents(parsePrice(await cartPage.total.innerText()))).toBe(expectedCents);
  });
});
