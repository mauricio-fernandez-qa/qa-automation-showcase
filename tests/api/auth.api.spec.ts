import { expect, test } from '@playwright/test';
import { customerCredentials, customerToken, loginRequest } from '../../src/api/auth';
import { ENDPOINTS, HTTP, LoginResponseSchema, TOKEN_TYPE } from '../../src/api/schemas';
import { WRONG_PASSWORD } from '../../src/data/testData';

test.describe('Auth API', () => {
  test('TC-API-06: Verify that valid credentials return a bearer token', async ({ request }) => {
    // Act
    const response = await loginRequest(request, customerCredentials());

    // Assert
    expect(response.status()).toBe(HTTP.ok);
    expect(LoginResponseSchema.parse(await response.json()).token_type).toBe(TOKEN_TYPE);
  });

  test('TC-API-07: Validate that a wrong password returns 401 and no token', async ({ request }) => {
    // Act
    const response = await loginRequest(request, { ...customerCredentials(), password: WRONG_PASSWORD });

    // Assert
    expect(response.status()).toBe(HTTP.unauthorized);
    expect(await response.json()).not.toHaveProperty('access_token');
  });

  test('TC-API-08: Validate that invoices are not readable without a token', async ({ request }) => {
    // Act
    const response = await request.get(ENDPOINTS.invoices);

    // Assert
    expect(response.status()).toBe(HTTP.unauthorized);
  });

  test('TC-API-09: Verify that the customer reads their own profile with a token', async ({ request }) => {
    // Arrange
    const token = await customerToken(request);

    // Act
    const response = await request.get(ENDPOINTS.me, { headers: { Authorization: `Bearer ${token}` } });

    // Assert
    expect(response.status()).toBe(HTTP.ok);
    expect(await response.json()).toMatchObject({ email: customerCredentials().email });
  });
});
