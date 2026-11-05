import type { Locator, Page } from '@playwright/test';
import { SignInForm } from './components/SignInForm';

/** Sign-in page and the account page it leads to. */
export class LoginPage {
  readonly form: SignInForm;
  readonly error: Locator;
  readonly pageTitle: Locator;
  readonly userMenu: Locator;

  constructor(private readonly page: Page) {
    this.form = new SignInForm(page);
    this.error = page.getByTestId('login-error');
    this.pageTitle = page.getByTestId('page-title');
    this.userMenu = page.getByTestId('nav-menu');
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string): Promise<void> {
    await this.form.signIn(email, password);
  }
}
