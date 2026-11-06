# Test cases

Designed with risk-based testing: the checkout and payment come first because that is where a failure costs money.
Each case is one automated test with the same ID, and traces back to a requirement in [requirements/](requirements/).

| ID         | Req    | Title                                                                            | Technique                                 | Level | Priority |
| ---------- | ------ | -------------------------------------------------------------------------------- | ----------------------------------------- | ----- | -------- |
| TC-AUTH-01 | REQ-03 | Verify that a customer with valid credentials lands on My account                | Use case                                  | E2E   | High     |
| TC-AUTH-02 | REQ-03 | Validate that a wrong password shows an error and keeps the user signed out      | Negative                                  | E2E   | High     |
| TC-SRCH-01 | REQ-02 | Verify that a search only returns products that match the term                   | Equivalence partitioning                  | E2E   | Medium   |
| TC-SRCH-02 | REQ-02 | Validate that a search without matches shows the empty-state message             | Equivalence partitioning                  | E2E   | Low      |
| TC-CART-01 | REQ-01 | Verify that adding a product updates the cart badge and confirms it              | State transition                          | E2E   | High     |
| TC-CART-02 | REQ-01 | Verify that the line total equals unit price times quantity                      | Calculation                               | E2E   | High     |
| TC-CHK-01  | REQ-01 | Verify that paying by credit card places the order and returns an invoice number | Use case                                  | E2E   | Critical |
| TC-CHK-02  | REQ-01 | Verify that paying cash on delivery places the order                             | Equivalence partitioning (payment method) | E2E   | High     |
| TC-CHK-03  | REQ-01 | Validate that a malformed card number blocks the payment                         | Negative / input validation               | E2E   | Critical |
| TC-CHK-04  | REQ-01 | Verify that the payment step confirms success before the order is placed         | State transition                          | E2E   | High     |
| TC-API-01  | REQ-04 | Verify that the product list matches its contract                                | Contract                                  | API   | High     |
| TC-API-02  | REQ-04 | Verify that pages do not repeat products                                         | Pagination                                | API   | Medium   |
| TC-API-03  | REQ-02 | Verify that search only returns products that match the term                     | Equivalence partitioning                  | API   | Medium   |
| TC-API-04  | REQ-04 | Verify that a product can be read by id                                          | Contract                                  | API   | Medium   |
| TC-API-05  | REQ-04 | Validate that an unknown product id returns 404                                  | Negative                                  | API   | Low      |
| TC-API-06  | REQ-03 | Verify that valid credentials return a bearer token                              | Contract                                  | API   | High     |
| TC-API-07  | REQ-03 | Validate that a wrong password returns 401 and no token                          | Negative / security                       | API   | High     |
| TC-API-08  | REQ-03 | Validate that invoices are not readable without a token                          | Access control                            | API   | Critical |
| TC-API-09  | REQ-03 | Verify that the customer reads their own profile with a token                    | Access control                            | API   | High     |

## Performance

`perf/products-load.js` (k6): 5 virtual users for 30 s on the catalog API. Pass criteria: p95 under 1.5 s and less than
1% errors. The load is kept small on purpose, because the target is a free public demo.
