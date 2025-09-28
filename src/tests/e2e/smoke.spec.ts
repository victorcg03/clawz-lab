import { test, expect } from '@playwright/test';

test('landing hero visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-title')).toHaveText(/clawz lab/i);
});
