/** Test data shared by the suites. Synthetic values only; the account comes from the environment (src/config/env.ts). */

export const SEARCH = {
  term: 'pliers',
  termWithoutResults: 'zzz-no-such-tool',
};

export const PRODUCT = {
  defaultQuantity: 1,
  quantity: 3,
};

export const WRONG_PASSWORD = 'not-the-password';

export interface Address {
  country: string;
  postalCode: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
}

/**
 * Country, postal code and house number drive the postcode lookup; street, city and state are only a fallback for
 * when the lookup is unavailable (`CheckoutPage.submitAddress` keeps whatever the lookup fills in).
 */
export const ADDRESS: Address = {
  country: 'Austria',
  postalCode: '1010',
  houseNumber: '98',
  street: 'Test street',
  city: 'Vienna',
  state: 'Vienna',
};

export interface Card {
  number: string;
  expiration: string;
  cvv: string;
  holder: string;
}

const YEARS_AHEAD = 2;

/** A card that the demo gateway accepts. The expiration is always in the future, so the data never goes stale. */
export function validCard(): Card {
  return {
    number: '1111-1111-1111-1111',
    expiration: `12/${new Date().getFullYear() + YEARS_AHEAD}`,
    cvv: '123',
    holder: 'Jane Doe',
  };
}

export const INVALID_CARD_NUMBER = '1111';

export const PAYMENT_METHOD = {
  creditCard: 'Credit Card',
  cashOnDelivery: 'Cash on Delivery',
};

export const MESSAGES = {
  invalidLogin: 'Invalid email or password',
  noResults: 'There are no products found.',
  addedToCart: 'Product added to shopping cart.',
  paymentSuccess: 'Payment was successful',
  invalidCardFormat: 'Invalid card number format.',
  myAccount: 'My account',
  orderThanks: 'Thanks for your order!',
};

export const INVOICE_NUMBER = /INV-\d+/;
