import { test, expect } from '@playwright/test';

test.describe('Lesson Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('login with valid credentials then make a lesson', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText(/lesson/i).click()
        await page.getByText(/ending sounds/i).click()
        await page.getByText(/lesson 1 - ending sound \/p\//i).click()
        await page.getByRole('button', { name: /nghe/i }).click();
    });


 test('Login with valid credentials then go to lesson click on additional information', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText(/lesson/i).click()
        await page.getByText(/ending sounds/i).click()
        await page.getByText(/lesson 1 - ending sound \/p\//i).click()
        const infoButton = page.getByRole('button', { name: /thông tin bổ sung/i });
        await expect(infoButton).toBeVisible({ timeout: 10000 });
        await infoButton.click();
    });
});