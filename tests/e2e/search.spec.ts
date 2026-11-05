import { MESSAGES, SEARCH } from '../../src/data/testData';
import { expect, test } from '../../src/fixtures';

test.describe('Product search', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('TC-SRCH-01: Verify that a search only returns products that match the term', async ({ homePage }) => {
    // Act
    await homePage.search(SEARCH.term);

    // Assert
    await expect(homePage.searchCaption).toContainText(SEARCH.term);
    await expect(homePage.productNames.first()).toBeVisible();
    await expect(homePage.productNames.filter({ hasNotText: new RegExp(SEARCH.term, 'i') })).toHaveCount(0);
  });

  test('TC-SRCH-02: Validate that a search without matches shows the empty-state message', async ({ homePage }) => {
    // Act
    await homePage.search(SEARCH.termWithoutResults);

    // Assert
    await expect(homePage.noResults).toHaveText(MESSAGES.noResults);
    await expect(homePage.productNames).toHaveCount(0);
  });
});
