import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

test.describe('Dashboard Core Workflow', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // 1. Authenticate before dashboard tests (consider moving to global setup for faster tests)
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('test@example.com', 'ValidPassword123!');
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Initialize Dashboard POM
    dashboardPage = new DashboardPage(page);
  });

  test('should create a new item successfully', async ({ page }) => {
    const uniqueItemName = `Test Item ${Date.now()}`;
    
    await dashboardPage.createNewItem(uniqueItemName);
    
    // Assert success toast appears
    await expect(dashboardPage.successToast).toBeVisible();
    
    // Assert the new item is present in the list/table
    const itemCard = page.getByText(uniqueItemName);
    await expect(itemCard).toBeVisible();
  });
});
