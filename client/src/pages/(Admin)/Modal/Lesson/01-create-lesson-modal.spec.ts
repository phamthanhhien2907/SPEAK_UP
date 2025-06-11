import { test, expect } from '@playwright/test';
test.describe('create lesson modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('renders lesson dashboard ', async ({ page }) => {
        // Đảm bảo đã login và chuyển trang
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'Admin123@');
        await page.getByTestId('toggle-password-icon').click();
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL('http://localhost:5173/');

        // Chờ phần tử xuất hiện
        await page.getByText(/lessons/i).click();
        await page.waitForTimeout(3000); // Đợi 3 giây
        await page.getByRole('button', { name: /add new lesson/i }).click();
        await page.waitForTimeout(3000); // Đợi 3 giây

        // Chờ input ở dashboard xuất hiện rồi mới fill
        // Click mở combobox
        await page.getByRole('combobox', { name: /Course Id/i }).click();
        const dropdownMenu = page.locator('div[role="listbox"]').first();
        await expect(dropdownMenu).toBeVisible({ timeout: 5000 });
        await dropdownMenu.locator('[role="option"]').first().click();

        const dashboardTitleInput = page.locator('input[name="title"]');
        await expect(dashboardTitleInput).toBeVisible({ timeout: 3000 });
        await dashboardTitleInput.fill('Ending Sounds');


        const dashboardContentInput = page.locator('input[name="content"]');
        await expect(dashboardContentInput).toBeVisible();
        await dashboardContentInput.fill('Practice ');
        // await page.waitForTimeout(3000); // Đợi 3 giây

        await page.getByRole('combobox', { name: /Type/i }).click();
        const dropdownMenu1 = page.locator('div[role="listbox"]');
        await expect(dropdownMenu1).toBeVisible();
        // Chọn "intermediate"
        await dropdownMenu1.getByText('speaking', { exact: true }).click();
        // await page.waitForTimeout(3000); // Đợi 3 giây


        await page.getByRole('button', { name: /create/i }).click();

        // await page.locator('p', { hasText: 'lessons' }).click();
        // await page.waitForTimeout(3000); // Đợi 3 giây
    });

});