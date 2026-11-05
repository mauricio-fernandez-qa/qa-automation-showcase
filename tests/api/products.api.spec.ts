import { expect, test } from '@playwright/test';
import { ENDPOINTS, FIRST_PAGE, HTTP, ProductPageSchema, ProductSchema } from '../../src/api/schemas';
import { SEARCH } from '../../src/data/testData';

const SECOND_PAGE = 2;

test.describe('Products API', () => {
  test('TC-API-01: Verify that the product list matches its contract', async ({ request }) => {
    // Act
    const response = await request.get(ENDPOINTS.products, { params: { page: FIRST_PAGE } });

    // Assert
    expect(response.status()).toBe(HTTP.ok);
    const page = ProductPageSchema.parse(await response.json());
    expect(page.data.length).toBeGreaterThan(0);
    expect(page.data.length).toBeLessThanOrEqual(page.per_page);
  });

  test('TC-API-02: Verify that pages do not repeat products', async ({ request }) => {
    // Act
    const [first, second] = await Promise.all([
      request.get(ENDPOINTS.products, { params: { page: FIRST_PAGE } }),
      request.get(ENDPOINTS.products, { params: { page: SECOND_PAGE } }),
    ]);

    // Assert
    expect(first.status()).toBe(HTTP.ok);
    expect(second.status()).toBe(HTTP.ok);
    const firstPage = ProductPageSchema.parse(await first.json());
    const secondPage = ProductPageSchema.parse(await second.json());
    expect(firstPage.data.length).toBeGreaterThan(0);
    expect(secondPage.current_page).toBe(SECOND_PAGE);
    expect(secondPage.data.length).toBeGreaterThan(0);
    const firstIds = firstPage.data.map((p) => p.id);
    expect(secondPage.data.filter((p) => firstIds.includes(p.id))).toEqual([]);
  });

  test('TC-API-03: Verify that search only returns products that match the term', async ({ request }) => {
    // Act
    const response = await request.get(ENDPOINTS.productSearch, { params: { q: SEARCH.term } });

    // Assert
    expect(response.status()).toBe(HTTP.ok);
    const result = ProductPageSchema.parse(await response.json());
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.map((p) => p.name).filter((name) => !name.toLowerCase().includes(SEARCH.term))).toEqual([]);
  });

  test('TC-API-04: Verify that a product can be read by id', async ({ request }) => {
    // Arrange
    const list = await request.get(ENDPOINTS.products, { params: { page: FIRST_PAGE } });
    expect(list.status()).toBe(HTTP.ok); // guard
    const [first] = ProductPageSchema.parse(await list.json()).data;

    // Act
    const response = await request.get(ENDPOINTS.product(first.id));

    // Assert
    expect(response.status()).toBe(HTTP.ok);
    expect(ProductSchema.parse(await response.json())).toMatchObject({ id: first.id, name: first.name });
  });

  test('TC-API-05: Validate that an unknown product id returns 404', async ({ request }) => {
    // Act
    const response = await request.get(ENDPOINTS.product('does-not-exist'));

    // Assert
    expect(response.status()).toBe(HTTP.notFound);
  });
});
