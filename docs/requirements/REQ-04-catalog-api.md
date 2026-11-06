# REQ-04: Catalog API

**As a** client app **I want** a stable product API **so that** the catalog renders without breaking.

## Acceptance criteria

1. `GET /products` returns a page that matches the contract (fields and types).
2. Pages do not repeat products.
3. `GET /products/{id}` returns that product; an unknown id returns 404.
4. Under light load (5 users), p95 response time stays under 1.5 s with less than 1% errors.

## Risk

**High.** Every screen of the store depends on it.

## Test cases

TC-API-01, TC-API-02, TC-API-04, TC-API-05 and the k6 load test ([test-cases.md](../test-cases.md))
