import { test, expect } from '@playwright/test';

test('navegar desde home a /measure', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /ir a mediciones/i }).click();
  await expect(page).toHaveURL(/.*measure/);
  await expect(
    page.getByRole('heading', { name: /guía de medidas|ring size guide/i }),
  ).toBeVisible();
});
