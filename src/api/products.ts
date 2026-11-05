import type { APIRequestContext } from '@playwright/test';
import { env } from '../config/env';
import { ENDPOINTS, FIRST_PAGE, ProductPageSchema } from './schemas';

/**
 * Name of a product that can be bought right now. The demo store is shared and its stock runs out (our own checkouts
 * consume it), so tests pick a buyable product at run time instead of hard-coding one.
 */
export async function buyableProductName(request: APIRequestContext): Promise<string> {
  const response = await request.get(`${env.apiUrl}${ENDPOINTS.products}`, { params: { page: FIRST_PAGE } });
  if (!response.ok()) throw new Error(`Could not list products (HTTP ${response.status()})`);
  const product = ProductPageSchema.parse(await response.json()).data.find((p) => p.in_stock && !p.is_rental);
  if (!product) throw new Error('No product in stock on the first page of the catalog');
  return product.name;
}
