import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'クイズ作成画面へ' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('tmp@ishi22da09.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('.lo9>LO)');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: '大カテゴリ' }).click();
  await page.getByRole('textbox', { name: '大カテゴリ' }).fill('テスト');
  await page.getByRole('textbox', { name: '小カテゴリ' }).click()
  await page.getByRole('textbox', { name: '小カテゴリ' }).fill('playwright');
  await page.getByRole('textbox', { name: '問題文' }).fill('playwrightでテストコードをGUIから生成するため実行するコマンドは\n次のうちどれでしょうか？');
  await page.locator('[id="_r_f_"]').fill('npx playwright codegen <url>');
  await page.locator('[id="_r_h_"]').fill('npx playwright install');
  await page.locator('[id="_r_j_"]').fill('npx playwright test --host=<ip:port>');
  await page.locator('[id="_r_l_"]').fill('npx playwright test');
  await page.getByRole('button', { name: '送信' }).click();
  await page.getByRole('link', { name: 'http://localhost:3000/solve/' }).click();
  await page.getByRole('checkbox', { name: 'npx playwright codegen <url>' }).check();
  await page.getByRole('button', { name: '回答する' }).click();
  await expect(page.getByText('正解！おめでとうございます！')).toBeVisible()
  await page.getByRole('link', { name: 'http://localhost:3000/myquizzes' }).click();
//   await page.getByRole('button', { name: '削除' }).nth(1).click();
//   await page.getByRole('button', { name: 'OK' }).click();
  await page.getByRole('link', { name: 'クイズ作成アプリ' }).click();
//   await page.getByRole('button', { name: 'クイズカテゴリ一覧へ' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page.getByRole('tab', { name: 'Sign In' })).toBeVisible();
});