import { test, expect } from '@playwright/test';
test.describe('create topic modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('renders topic dashboard ', async ({ page }) => {
        // Đảm bảo đã login và chuyển trang
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'Admin123@');
        await page.getByTestId('toggle-password-icon').click();
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL('http://localhost:5173/');

        // Chờ phần tử xuất hiện
        await page.getByText(/topic/i).click();
        await page.waitForTimeout(3000); // Đợi 3 giây
        await page.getByRole('button', { name: /add new topic/i }).click();
        await page.waitForTimeout(1000); // Đợi 3 giây


    });

    test('topic with blank case ', async ({ page }) => {
        // Đảm bảo đã login và chuyển trang
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'Admin123@');
        await page.getByTestId('toggle-password-icon').click();
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Chờ phần tử xuất hiện
        await page.getByText(/topic/i).click();
        await page.waitForTimeout(3000);
        await page.getByRole('button', { name: /add new topic/i }).click();
        await page.getByRole('button', { name: 'Create', exact: true }).click();
        await page.waitForTimeout(3000);
        // Đợi 3 g

    });

    test('topic with full case ', async ({ page }) => {
        // Đảm bảo đã login và chuyển trang
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'Admin123@');
        await page.getByTestId('toggle-password-icon').click();
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL('http://localhost:5173/');

        // Chờ phần tử xuất hiện
        await page.getByText(/topic/i).click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: /add new topic/i }).click();
        await page.getByRole('combobox', { name: /course id/i }).click();
        const element = page.locator('div[role="listbox"]').filter({ hasText: 'intermediate english conversations' });
        console.log(await element.textContent());
        await element.click();
        const titleInput = page.locator('input[name="title"]');
        await titleInput.fill('API...');
        await page.waitForTimeout(2000);
        const contentInput = page.locator('input[name="content"]');
        await contentInput.fill('yguh');
        await page.waitForTimeout(2000);
        await page.getByRole('combobox', { name: 'TYPE' }).click();
        await page.locator('div[role="option"]').filter({ hasText: 'Speaking' }).waitFor({ state: 'visible', timeout: 5000 });
        await page.locator('div[role="option"]').filter({ hasText: 'Speaking' }).click();
        await page.getByRole('combobox', { name: 'SECTION' }).waitFor({ state: 'visible', timeout: 10000 });
        await page.getByRole('combobox', { name: 'SECTION' }).click();
        const options = await page.locator('div[role="option"]').allTextContents();
        console.log('Available options:', options);
        // await page.getByRole('combobox', { name: 'LEVEL' }).selectOption({ label: '2' });
        // await page.click('button[aria-label="Increase value"]');// nếu là <select>
    });
});