# REQ-02: Product search

**As a** shopper **I want to** search the catalog by name **so that** I find the tool I need.

## Acceptance criteria

1. Searching a term lists only products whose name contains the term, in the UI and in the API.
2. A term with no matches shows "There are no products found." and an empty grid.

## Risk

**Medium.** A broken search sends shoppers away, but browsing still works.

## Test cases

TC-SRCH-01, TC-SRCH-02, TC-API-03 ([test-cases.md](../test-cases.md))
