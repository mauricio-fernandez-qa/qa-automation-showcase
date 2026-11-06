# REQ-01: Checkout and payment

**As a** signed-in customer **I want to** pay for my cart and get an invoice **so that** my order is placed.

## Acceptance criteria

1. The cart shows each line as unit price × quantity, and the cart total adds up the lines.
2. Checkout has four steps: cart, sign in, billing address, payment.
3. Paying by credit card or cash on delivery places the order and shows an invoice number (`INV-…`).
4. A malformed card number shows a validation message and the payment cannot be submitted.
5. The order is placed only after the payment step confirms success.

## Risk

**Critical.** A failure here loses a sale or charges the customer wrongly.

## Test cases

TC-CART-01, TC-CART-02, TC-CHK-01, TC-CHK-02, TC-CHK-03, TC-CHK-04 ([test-cases.md](../test-cases.md))
