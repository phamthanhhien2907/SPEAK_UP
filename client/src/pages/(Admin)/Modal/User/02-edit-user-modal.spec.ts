import { test, expect } from '@playwright/test';
export async function editUser(page) {
    test.describe('edit users modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });
   
    test('renders users dashboard ', async ({ page }) => {
    // Đảm bảo đã login và chuyển trang
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'Admin123@');
    await page.getByTestId('toggle-password-icon').click();
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('http://localhost:5173/');

    // Chờ phần tử xuất hiện
    await page.getByText(/users/i).click();
    await page.waitForTimeout(3000); // Đợi 3 giây
    await page.locator('button.bg-blue-600').nth(4).click();
    await page.waitForTimeout(3000); // Đợi 3 giây

     // Chờ input ở dashboard xuất hiện rồi mới fill
    const dashboardEmailInput = page.locator('input[name="email"]');
    await expect(dashboardEmailInput).toBeVisible();
    await dashboardEmailInput.fill('hp036493@gmail.com');

    // Click mở combobox (nên dùng selector đúng với button mở dropdown)
    await page.getByRole('combobox', { name: /role/i }).click();

    // Chờ dropdown menu xuất hiện (có thể phải điều chỉnh selector)
    const dropdownMenu = page.locator('div[role="listbox"]');
    await expect(dropdownMenu).toBeVisible();

    // Chọn "intermediate"
    await dropdownMenu.getByText('teacher', { exact: true }).click();
    await page.waitForTimeout(3000); // Đợi 3 giây

    const dashboardFirstNameInput = page.locator('input[name="firstname"]');
await expect(dashboardFirstNameInput).toBeVisible({ timeout: 3000 });
await dashboardFirstNameInput.fill('Pham');

    
    const dashboardLastNamelInput = page.locator('input[name="lastname"]');
    await expect(dashboardLastNamelInput).toBeVisible();
    await dashboardLastNamelInput.fill('Hien');
    await page.waitForTimeout(3000); // Đợi 3 giây

    await page.getByRole('button', { name: /edit/i }).click();
});

});
}
