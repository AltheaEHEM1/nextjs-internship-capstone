import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="identifier"], input[type="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    this.continueButton = page.getByRole('button', { name: /continue/i }).first();
    this.signInButton = page.getByRole('button', { name: /sign in/i }).first();
    // Target Clerk's error message container, avoid Next.js route announcer
    this.errorMessage = page.locator('div[role="alert"]:not(#__next-route-announcer__)');
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    // Ensure the Continue button is visible before clicking
    await this.continueButton.waitFor({ state: 'visible' });
    await this.continueButton.click();
    // Wait for password field to appear (Clerk may render it after email step)
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
    // Ensure Sign In button is visible before clicking
    await this.signInButton.waitFor({ state: 'visible' });
    await this.signInButton.click();
    // Wait for navigation to dashboard (or any URL change)
    await this.page.waitForURL(/.*dashboard/, { timeout: 15000 });
  }
}
