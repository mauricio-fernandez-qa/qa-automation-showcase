# Conventions

The rules a reviewer (human or agent) checks. The ones marked **(auto)** are enforced by ESLint or
`scripts/check-conventions.mjs`, so they cannot be forgotten.

## Structure

- Page objects in `src/pages/` (shared parts in `src/pages/components/`), test data in `src/data/`, small utilities in
  `src/helpers/`, API contracts and helpers in `src/api/`, specs in `tests/`.
- Specs get their page objects from `src/fixtures.ts`; they never build them by hand.

## Tests

- **One test = one test case**, titled `TC-AREA-NN: Verify|Validate <expected behavior>` **(auto)**.
  "Verify" for the happy path, "Validate" for rules and negative cases.
- **Arrange → Act → Assert**, marked with comments. No more actions after the assertions start.
  A guard `expect` inside Arrange or Act is fine when it stops the test early because a precondition failed.
- Tests are independent: any test runs alone and in any order.
- No `test.only` **(auto)**, no conditionals in tests **(auto)**.

## Locators and waits

- By role, label, text or `data-test` id. Never CSS classes or XPath **(auto)**.
- Web-first assertions (`toBeVisible`, `toHaveText`) instead of reading values and comparing **(auto)**.
- No `waitForTimeout` **(auto)**: wait for a state, an element or a response.

## Page objects

- Locators and actions only. No assertions **(auto)**.
- One method per user intention (`signIn`, `fillAddress`), not per click.

## Data

- Shared values live in `src/data/testData.ts`. Never copy a constant into a spec.
- URLs and credentials come from the environment (`.env`, see `.env.example`). Never hard-coded.
- No magic numbers: name them.
