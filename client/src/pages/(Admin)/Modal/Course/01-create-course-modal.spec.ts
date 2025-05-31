import { test, expect } from '@playwright/test';
test.describe('create course modals', () => {
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
        await page.getByRole('button', { name: /add new course/i }).click();
        await page.waitForTimeout(3000); // Đợi 3 giây

        // Chờ input ở dashboard xuất hiện rồi mới fill
        const dashboardTitleInput = page.locator('input[name="title"]');
        await expect(dashboardTitleInput).toBeVisible();
        await dashboardTitleInput.fill('English IPA');

        await page.waitForTimeout(3000); // Đợi 3 giây
        const dashboardDescriptionInput = page.locator('input[name="description"]');
        await expect(dashboardDescriptionInput).toBeVisible();
        await dashboardDescriptionInput.fill('Suspendisse ut ultrices nunc. Vivamus tempus magna nec ligula imperdiet accumsan. Praesent sollicitudin elit lorem, et blandit ex finibus at. Vestibulum accumsan turpis metus, nec suscipit est aliquam ut. Aenean luctus nunc lectus, nec lobortis elit rhoncus et. Quisque interdum magna ut turpis vehicula gravida. Suspendisse velit elit, dignissim vitae ornare nec, rutrum et lacus. Mauris sed arcu nec eros varius elementum at nec ipsum. Maecenas pretium vel ex eget vehicula. Etiam quis risus nibh. Etiam arcu augue, tempus eu neque a, rhoncus placerat eros. Praesent laoreet mauris eget ante convallis laoreet. Aliquam vel lacinia neque, sed dictum neque. Praesent nec justo euismod, sagittis nisi et, fermentum massa.');
        await page.waitForTimeout(3000); // Đợi 3 giây

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
        await page.waitForTimeout(3000); // Đợi 3 giây
        await page.getByRole('button', { name: /create/i }).click();

        // // Chờ trang chuyển về "Courses" (chọn selector cụ thể, ví dụ thẻ <p> có text "Courses")
        // await page.locator('p', { hasText: 'Courses' }).click();
    });

});