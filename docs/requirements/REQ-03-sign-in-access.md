# REQ-03: Sign in and access control

**As a** customer **I want to** sign in with my email and password **so that** only I can see my account and invoices.

## Acceptance criteria

1. Valid credentials sign the customer in and land on "My account".
2. A wrong password shows "Invalid email or password" and the user stays signed out.
3. The API returns a bearer token for valid credentials and 401 (no token) for a wrong password.
4. Invoices are not readable without a token; with a token the customer reads their own profile.

## Risk

**High.** A failure either locks customers out or exposes their data.

## Test cases

TC-AUTH-01, TC-AUTH-02, TC-API-06, TC-API-07, TC-API-08, TC-API-09 ([test-cases.md](../test-cases.md))
