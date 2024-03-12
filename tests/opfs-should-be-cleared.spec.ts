import { test, expect, Page } from '@playwright/test';

test.describe('opfs should be cleared', () => {

  test('opfs', async ({ page }) => {
    await page.goto('https://example.com/');
    const created = await page.evaluate(async () => {
      const root = await navigator.storage.getDirectory();
      try {
        await root.getDirectoryHandle('someDirectoryName');
        return false;
      }
      catch (e) {}
      await root.getDirectoryHandle('someDirectoryName', { create: true });
      return true;
    });
    expect(created).toBe(true);
  });

  test('localstorage', async ({page }) => {
    await page.goto('https://example.com/');
    const created = await page.evaluate(async () => {
      if (localStorage.getItem('someKey')) {
        return false;
      }
      localStorage.setItem('someKey', 'someValue');
      return true;
    });
    expect(created).toBe(true);
  });

});
