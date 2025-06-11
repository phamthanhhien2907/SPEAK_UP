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
        await page.getByText('Chat', { exact: true }).click()
        await page.getByRole('button', { name: /fun/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        const sendButton = page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))');
        await sendButton.click();
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
        await page.getByText('Chat', { exact: true }).click()

        await page.getByRole('button', { name: /interesting/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        const sendButton = page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))');
        await sendButton.click();
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
        await page.getByText('Chat', { exact: true }).click()

        await page.getByRole('button', { name: /you decide/i }).click();
        await page.waitForTimeout(7000); // Đợi 7 giây
        await page.fill('input[name="chat"]', 'I want to talk about the food topic');
        const sendButton = page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))');
        await sendButton.click();
        await page.waitForTimeout(7000); // Đợi 7 giây

    });

    test('login with valid credentials then make a chat press button repeat', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        // await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Chat', { exact: true }).click()
        await page.getByRole('button', { name: '🔁 Repeat' }).click();
        await page.waitForTimeout(20000); // Đợi 7 giây

    });

    test('login with valid credentials then make a chat press button translate ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Chat', { exact: true }).click()
        await page.getByRole('button', { name: '🌐 Translate' }).click();
        await page.waitForTimeout(20000); // Đợi 7 giây
    });



    // test('login with valid credentials then make a chat button click setting ', async ({ page }) => {
    //     await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
    //     await page.fill('input[name="password"]', 'Quang@2003');
    //     await page.getByRole('button', { name: /login/i }).click();
    //     // Kiểm tra điều hướng hoặc thông báo thành công
    //     await expect(page).toHaveURL('http://localhost:5173/');
    //     await page.goto('http://localhost:5173/');

    //     // Kiểm tra xem ListCard có hiển thị không
    //     await page.getByText('Chat', { exact: true }).click()
    //     await page.getByTestId('settings-button').locator('svg').click();
    //     await page.selectOption('select', { value: 'vi' });
    //     // await page.locator('button[aria-label="microphone"]').click();
    //     await page.waitForTimeout(20000); // Đợi 7 giây



    // });

    test('login with valid credentials then make a chat press chat ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Chat', { exact: true }).click()
        const chatInput = page.locator('input[placeholder="Aa"]');
        await expect(chatInput).toBeVisible();
        await chatInput.fill('Hello, I want to go to the airport');
        await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
        await page.waitForTimeout(20000); // Đợi 7 giây


    });


    test('login with valid credentials then make a chat click on suggestion icon ', async ({ page }) => {
        await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
        await page.fill('input[name="password"]', 'Quang@2003');
        await page.getByRole('button', { name: /login/i }).click();
        // Kiểm tra điều hướng hoặc thông báo thành công
        await expect(page).toHaveURL('http://localhost:5173/');
        await page.goto('http://localhost:5173/');

        // Kiểm tra xem ListCard có hiển thị không
        await page.getByText('Chat', { exact: true }).click()
        const settingsBtn = page.getByTestId('settings-button').locator('svg');
        await expect(settingsBtn).toBeVisible({ timeout: 10000 });
        await settingsBtn.click();
        await page.waitForTimeout(20000); // Đợi 7 giây
    })

});