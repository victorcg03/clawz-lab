import { test, expect } from '@playwright/test';

// Nota: Este test asume que existe un usuario autenticado automáticamente o que la página
// /measure muestra el formulario sin login (si no, quedará pendiente implementar helper de login).
// Lo dejamos inicialmente como skipped hasta definir estrategia de auth test.

test.describe('Measure - create profile', () => {
  test.skip(true, 'Pendiente: estrategia de autenticación en e2e');

  test('crea un perfil', async ({ page }) => {
    await page.goto('/measure');
    await page.getByLabel(/nombre/i).fill('Perfil E2E');
    await page.getByRole('button', { name: /guardar/i }).click();
    await expect(page.getByText(/perfil creado/i)).toBeVisible();
  });
});
