import { test, expect } from '@playwright/test';

test.describe('Speech Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('Login with valid credentials then go to Home page select ordering and press button repeat', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        // await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        await page.getByRole('button', { name: '🔁 Repeat' }).click();
        await page.waitForTimeout(20000); // Đợi 7 giây
    
    });

    test('Login with valid credentials then go to Home page select ordering and press button translate ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        await page.getByRole('button', { name: '🌐 Translate' }).click();
        await page.waitForTimeout(20000); // Đợi 7 giây
    });


    
    test('Login with valid credentials then go to Home page select ordering click setting ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        await page.getByTestId('settings-button').locator('svg').click();
        await page.selectOption('select', { value: 'vi' });
        // await page.locator('button[aria-label="microphone"]').click();
        await page.waitForTimeout(20000); // Đợi 7 giây
        


    });

    test('Login with valid credentials then go to Home page select ordering press chat ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        const chatInput = page.locator('input[placeholder="Aa"]');
        await expect(chatInput).toBeVisible();
        await chatInput.fill('Hello, I want to go to the airport');
        await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
        await page.waitForTimeout(20000); // Đợi 7 giây
    

    });

    
    test('Login with valid credentials then go to Home page select ordering click on suggestion icon ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Ordering a taxi', { exact: true }).click();
        const svgIcon = page.locator('svg[viewBox="0 0 352 512"]');
        await expect(svgIcon).toBeVisible();
        await svgIcon.click();
        await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
        await expect(page.getByText('Không thể gợi ý: Failed to fetch', { exact: true })).toBeVisible();
        await page.waitForTimeout(20000); // Đợi 7 giây
    

    });
});