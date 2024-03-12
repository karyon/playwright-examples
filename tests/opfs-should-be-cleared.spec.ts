import { test, expect, Page } from '@playwright/test';

async function createWorker(page) {
  let worker;
  await page.evaluate(() => {
      new Worker('');
  });
  await expect.poll(() => (worker = page.workers()[0])).toBeDefined();
  return worker;
}


test.describe('opfs should be cleared', () => {

  test('opfs', async ({ page }) => {
    await page.goto('https://example.com/');
    const worker = await createWorker(page);
    const created = await worker.evaluate(async () => {
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
