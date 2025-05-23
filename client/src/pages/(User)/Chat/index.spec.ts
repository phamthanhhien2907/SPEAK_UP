import { test, expect } from '@playwright/test';

test.describe('Chat Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('login with valid credentials then make a chat with fun topic', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText(/chat/i).click();
        await page.getByRole('button', { name: /fun/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        await page.getByTestId("send-chat").click();
        await page.waitForTimeout(7000); // Đợi 7 giây

    });

    test('login with valid credentials then make a chat with interesting topic', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText(/chat/i).click();
        await page.getByRole('button', { name: /interesting/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        await page.getByTestId("send-chat").click();
        await page.waitForTimeout(7000); // Đợi 7 giây

    });
    test('login with valid credentials then make a chat with you decide topic', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText(/chat/i).click();
        await page.getByRole('button', { name: /you decide/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        await page.getByTestId("send-chat").click();
        await page.waitForTimeout(7000); // Đợi 7 giây

    });
});