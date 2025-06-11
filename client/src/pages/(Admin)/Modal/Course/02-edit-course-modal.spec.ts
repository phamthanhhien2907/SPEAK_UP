import { test, expect } from '@playwright/test';
test.describe('edit course modals', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
    });

    test('renders course dashboard ', async ({ page }) => {
        // Đảm bảo đã login và chuyển trang
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', 'Admin123@');
        await page.getByTestId('toggle-password-icon').click();
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page).toHaveURL('http://localhost:5173/');

        // Chờ phần tử xuất hiện
        await page.getByText(/course/i).click();
        await page.waitForTimeout(3000); // Đợi 3 giây
        // Click nút edit của course "English IPA"
        await page.locator('button.bg-blue-600:has(svg.lucide-square-pen)').first().click();
        await page.waitForTimeout(2000);
        // Chờ input ở dashboard xuất hiện rồi mới fill
        const dashboardTitleInput = page.locator('input[name="title"]');
        await expect(dashboardTitleInput).toBeVisible();
        await dashboardTitleInput.fill('English Speak IPA');

        // Đợi 3 giây
        const dashboardDescriptionInput = page.locator('input[name="description"]');
        await expect(dashboardDescriptionInput).toBeVisible();
        await dashboardDescriptionInput.fill('Suspendisse ut ultrices nunc. Vivamus tempus magna nec ligula imperdiet accumsan. Praesent sollicitudin elit lorem, et blandit ex finibus at. Vestibulum accumsan turpis metus');
        await page.waitForTimeout(1000); // Đợi 3 giây

        // Click mở combobox (nên dùng selector đúng với button mở dropdown)
        await page.getByRole('combobox', { name: /level/i }).click();

        // Chờ dropdown menu xuất hiện (có thể phải điều chỉnh selector)
        const dropdownMenu = page.locator('div[role="listbox"]');
        await expect(dropdownMenu).toBeVisible();

        // Chọn "intermediate"
        await dropdownMenu.getByText('intermediate', { exact: true }).click();
        await page.waitForTimeout(3000); // Đợi 3 giây

        const dashboardThumbnailInput = page.locator('input[name="thumbnail"]');
        await expect(dashboardThumbnailInput).toBeVisible();
        await dashboardThumbnailInput.fill('https://dummyimage.com/600x400/000/fff');
        await page.waitForTimeout(1000); // Đợi 3 giây
        await page.getByRole('button', { name: /edit/i }).click();

        //     // Chờ trang chuyển về "Courses" (chọn selector cụ thể, ví dụ thẻ <p> có text "Courses")
        //     await page.locator('p', { hasText: 'Courses' }).click();
        //     // Reload lại trang để kiểm tra dữ liệu đã thay đổi
        //     await page.reload();

        //     // Kiểm tra dữ liệu đã thay đổi (ví dụ kiểm tra sự xuất hiện hoặc biến mất của một phần tử)
        //     await expect(page.getByText('English Speak IPA')).toBeVisible(); // hoặc toBeHidden(), not.toBeVisible(), ...
        //     // ...existing code...
    });

});