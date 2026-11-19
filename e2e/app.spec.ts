import { expect, test } from '@playwright/test';

test('visits the CalorieSnap home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('ion-content')).toContainText('Foto Makanan,');
  await expect(page.locator('ion-content')).toContainText('Ambil Foto');
  await expect(page.locator('ion-content')).toContainText('Pilih dari Galeri');
});
