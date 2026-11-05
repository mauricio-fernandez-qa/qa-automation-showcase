import type { Locator, Page } from '@playwright/test';
import { ENDPOINTS } from '../api/schemas';
import { MESSAGES, type Address, type Card } from '../data/testData';
import { SignInForm } from './components/SignInForm';

/** Steps 2 to 4 of the checkout: sign in, billing address and payment. */
export class CheckoutPage {
  readonly signInForm: SignInForm;
  readonly proceedSignedIn: Locator;
  readonly country: Locator;
  readonly postalCode: Locator;
  readonly houseNumber: Locator;
  readonly street: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly proceedToPayment: Locator;
  readonly paymentMethod: Locator;
  readonly cardNumber: Locator;
  readonly expiration: Locator;
  readonly cvv: Locator;
  readonly cardHolder: Locator;
  readonly cardNumberError: Locator;
  readonly finishButton: Locator;
  readonly paymentSuccess: Locator;
  readonly orderConfirmation: Locator;

  constructor(private readonly page: Page) {
    this.signInForm = new SignInForm(page);
    this.proceedSignedIn = page.getByTestId('proceed-2');
    this.country = page.getByLabel('Country');
    this.postalCode = page.getByLabel('Postal code');
    this.houseNumber = page.getByLabel('House number');
    this.street = page.getByLabel('Street');
    this.city = page.getByLabel('City');
    this.state = page.getByLabel('State');
    this.proceedToPayment = page.getByTestId('proceed-3');
    this.paymentMethod = page.getByLabel('Payment Method');
    this.cardNumber = page.getByLabel('Credit Card Number');
    this.expiration = page.getByLabel('Expiration Date');
    this.cvv = page.getByLabel('CVV');
    this.cardHolder = page.getByLabel('Card Holder Name');
    this.cardNumberError = page.getByText(MESSAGES.invalidCardFormat);
    this.finishButton = page.getByTestId('finish');
    this.paymentSuccess = page.getByTestId('payment-success-message');
    this.orderConfirmation = page.getByText(MESSAGES.orderThanks);
  }

  /** Signs in on step 2 and moves on to the billing address. */
  async signInAndContinue(email: string, password: string): Promise<void> {
    await this.signInForm.signIn(email, password);
    await this.proceedSignedIn.click();
  }

  /**
   * Fills in the billing address and moves on to the payment step. Two async updates can overwrite what the test
   * types (and the invoice then fails with 422):
   * 1. the form is pre-filled from the customer profile, so it waits for that first;
   * 2. country + postal code + house number trigger a postcode lookup that rewrites street, city and state,
   *    so it waits for that lookup before typing them.
   */
  async submitAddress(address: Address): Promise<void> {
    const street = await this.street.elementHandle();
    await this.page.waitForFunction((input) => (input as HTMLInputElement).value !== '', street);
    await this.country.selectOption({ label: address.country });
    await this.postalCode.fill(address.postalCode);
    await Promise.all([
      this.page.waitForResponse((r) => r.url().includes('/postcode-lookup')),
      this.houseNumber.fill(address.houseNumber),
    ]);
    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
    await this.proceedToPayment.click();
  }

  async choosePaymentMethod(label: string): Promise<void> {
    await this.paymentMethod.selectOption({ label });
  }

  async fillCard(card: Card): Promise<void> {
    await this.cardNumber.fill(card.number);
    await this.expiration.fill(card.expiration);
    await this.cvv.fill(card.cvv);
    await this.cardHolder.fill(card.holder);
  }

  /** First click pays; once the payment is accepted, the same button places the order. */
  async pay(): Promise<void> {
    await this.finishButton.click();
  }

  /** Places the order and waits for the invoice to be created, so the confirmation is never read too early. */
  async placeOrder(): Promise<void> {
    await this.paymentSuccess.waitFor();
    const [invoice] = await Promise.all([
      this.page.waitForResponse((r) => r.url().endsWith(ENDPOINTS.invoices) && r.request().method() === 'POST'),
      this.finishButton.click(),
    ]);
    if (!invoice.ok()) throw new Error(`Invoice not created: HTTP ${invoice.status()} ${await invoice.text()}`);
  }
}
