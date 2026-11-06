import { env } from '../../src/config/env';
import { MESSAGES, WRONG_PASSWORD } from '../../src/data/testData';
import { expect, test } from '../../src/fixtures';

test.describe('Sign in', { tag: '@smoke' }, () => {
  // The demo site's Cloudflare shows a bot check on /account to GitHub runners, so CI skips it (runs locally). Sign-in
  // itself is still covered in CI: every checkout test signs in.
  test(
    'TC-AUTH-01: Verify that a customer with valid credentials lands on My account',
    { tag: '@blocked-in-ci' },
    async ({ page, loginPage }) => {
      // Arrange
      await loginPage.goto();

      // Act
      await loginPage.login(env.customerEmail, env.customerPassword);

      // Assert
      await expect(page).toHaveURL(/\/account$/);
      await expect(loginPage.pageTitle).toHaveText(MESSAGES.myAccount);
      await expect(loginPage.userMenu).toBeVisible();
    },
  );

  test('TC-AUTH-02: Validate that a wrong password shows an error and keeps the user signed out', async ({
    page,
    loginPage,
  }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login(env.customerEmail, WRONG_PASSWORD);

    // Assert
    await expect(loginPage.error).toHaveText(MESSAGES.invalidLogin);
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(loginPage.userMenu).toBeHidden();
  });
});
