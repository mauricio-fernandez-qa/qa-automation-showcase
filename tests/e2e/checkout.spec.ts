import { env } from '../../src/config/env';
import {
  ADDRESS,
  INVALID_CARD_NUMBER,
  INVOICE_NUMBER,
  MESSAGES,
  PAYMENT_METHOD,
  PRODUCT,
  validCard,
} from '../../src/data/testData';
import { expect, test } from '../../src/fixtures';

test.describe('Checkout and payment', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ homePage, productPage, cartPage, checkoutPage, productName }) => {
    // Shared arrange: one product in the cart, customer signed in, billing address filled in
    await homePage.goto();
    await homePage.openProduct(productName);
    await productPage.addToCart();
    await expect(productPage.cartBadge).toHaveText(String(PRODUCT.defaultQuantity)); // guard
    await productPage.openCart();
    await cartPage.proceedButton.click();
    await checkoutPage.signInAndContinue(env.customerEmail, env.customerPassword);
    await checkoutPage.submitAddress(ADDRESS);
  });

  test('TC-CHK-01: Verify that paying by credit card places the order and returns an invoice number', async ({
    checkoutPage,
  }) => {
    // Arrange
    await checkoutPage.choosePaymentMethod(PAYMENT_METHOD.creditCard);
    await checkoutPage.fillCard(validCard());

    // Act
    await checkoutPage.pay();
    await checkoutPage.placeOrder();

    // Assert
    await expect(checkoutPage.orderConfirmation).toContainText(INVOICE_NUMBER);
  });

  test('TC-CHK-02: Verify that paying cash on delivery places the order', async ({ checkoutPage }) => {
    // Arrange
    await checkoutPage.choosePaymentMethod(PAYMENT_METHOD.cashOnDelivery);

    // Act
    await checkoutPage.pay();
    await checkoutPage.placeOrder();

    // Assert
    await expect(checkoutPage.orderConfirmation).toContainText(INVOICE_NUMBER);
  });

  test('TC-CHK-03: Validate that a malformed card number blocks the payment', async ({ checkoutPage }) => {
    // Arrange
    await checkoutPage.choosePaymentMethod(PAYMENT_METHOD.creditCard);

    // Act
    await checkoutPage.fillCard({ ...validCard(), number: INVALID_CARD_NUMBER });

    // Assert
    await expect(checkoutPage.cardNumberError).toBeVisible();
    await expect(checkoutPage.finishButton).toBeDisabled();
  });

  test('TC-CHK-04: Verify that the payment step confirms success before the order is placed', async ({
    checkoutPage,
  }) => {
    // Arrange
    await checkoutPage.choosePaymentMethod(PAYMENT_METHOD.creditCard);
    await checkoutPage.fillCard(validCard());

    // Act
    await checkoutPage.pay();

    // Assert
    await expect(checkoutPage.paymentSuccess).toHaveText(MESSAGES.paymentSuccess);
    await expect(checkoutPage.orderConfirmation).toBeHidden();
  });
});
