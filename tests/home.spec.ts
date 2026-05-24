import {test,expect} from '@playwright/test'

test('first test',async({page}) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle('クイズ作成アプリ')
    await expect(page.getByText('クイズ作成画面へ')).toBeVisible()
})