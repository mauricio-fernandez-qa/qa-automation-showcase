import type { Locator, Page } from '@playwright/test';
import { ENDPOINTS } from '../api/schemas';

/** Product catalog: search and product cards. */
export class HomePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchCaption: Locator;
  readonly productNames: Locator;
  readonly noResults: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.searchCaption = page.getByTestId('search-caption');
    this.productNames = page.getByTestId('product-name');
    this.noResults = page.getByTestId('no-results');
  }

  /** Waits for the first product grid: if it arrives after a search, it overwrites the search results. */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.productNames.first().waitFor();
  }

  /** Waits for the search response, so the grid never shows the previous results when the test reads it. */
  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    const [response] = await Promise.all([
      this.page.waitForResponse((r) => r.url().includes(ENDPOINTS.productSearch)),
      this.searchButton.click(),
    ]);
    if (!response.ok()) throw new Error(`Search failed: HTTP ${response.status()}`);
  }

  async openProduct(name: string): Promise<void> {
    await this.productNames.getByText(name, { exact: true }).click();
  }
}
