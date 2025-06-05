import { test, expect } from '@playwright/test';
test.describe('delete course modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });
   
    test('renders cours dashboard ', async ({ page }) => {
    // Đảm bảo đã login và chuyển trang
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'Admin123@');
    await page.getByTestId('toggle-password-icon').click();
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('http://localhost:5173/');

    // Chờ phần tử xuất hiện
    await page.getByText(/course/i).click();
    await page.waitForTimeout(3000); // Đợi 3 giây
    await page.locator('button.bg-red-500').nth(4).click();
    await page.waitForTimeout(3000); // Đợi 3 giây

   await page.getByRole('button', { name: /yes, i'm sure/i }).click();
});

});