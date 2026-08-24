import { expect, type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly createItemButton: Locator;
  readonly itemNameInput: Locator;
  readonly submitItemButton: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { level: 1 });
    this.createItemButton = page.getByRole('button', { name: /create new|add item/i });
    this.itemNameInput = page.getByLabel(/item name/i);
    this.submitItemButton = page.getByRole('button', { name: /save|submit/i });
    this.successToast = page.locator('.toast-success'); // Adjust locator based on your toast implementation
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async createNewItem(name: string) {
    await this.createItemButton.click();
    await this.itemNameInput.fill(name);
    await this.submitItemButton.click();
  }
}
