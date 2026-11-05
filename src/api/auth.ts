import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../config/env';
import { ENDPOINTS, LoginResponseSchema } from './schemas';

export interface Credentials {
  email: string;
  password: string;
}

/** POST /users/login with the given credentials. */
export function loginRequest(request: APIRequestContext, credentials: Credentials): Promise<APIResponse> {
  return request.post(ENDPOINTS.login, { data: credentials });
}

/** The demo customer's credentials, from the environment. */
export function customerCredentials(): Credentials {
  return { email: env.customerEmail, password: env.customerPassword };
}

/** Logs the demo customer in through the API and returns the bearer token. */
export async function customerToken(request: APIRequestContext): Promise<string> {
  const response = await loginRequest(request, customerCredentials());
  if (!response.ok()) throw new Error(`Login failed (HTTP ${response.status()})`);
  return LoginResponseSchema.parse(await response.json()).access_token;
}
