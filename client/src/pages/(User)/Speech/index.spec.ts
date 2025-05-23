import { test, expect } from '@playwright/test';

test.describe('Speech Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    // test('login with valid credentials then make a Home', async ({ page }) => {
    //     await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
    //     await page.fill('input[name="password"]', 'Quang@2003');
    //     await page.getByRole('button', { name: /login/i }).click();
    //     // Kiểm tra điều hướng hoặc thông báo thành công
    //     await expect(page).toHaveURL('http://localhost:5173/');
    //     await page.goto('http://localhost:5173/');

    //     // Kiểm tra xem ListCard có hiển thị không
    //     await page.getByText('Ordering a taxi', { exact: true }).click();
    //     await page.getByRole('button', { name: /skip/i }).click();
    //     await page.waitForTimeout(25000); // Đợi 7 giây
    //     await page.getByRole('button', { name: /translate/i }).click();
    //     await page.waitForTimeout(7000); // Đợi 7 giây

    // });

    test('login with valid credentials then make a Home with vietnamese language ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        await page.getByTestId("settings-button").click();
        await page.selectOption('select', { value: 'vi' });
        await page.getByRole('button', { name: /skip/i }).click();
        await page.waitForTimeout(25000); // Đợi 7 giây
        await page.getByRole('button', { name: /translate/i }).first().click();


    });
});