# Test info

- Name: Speech Page >> Login with valid credentials then go to Home page select ordering click on suggestion icon 
- Location: D:\DATN\client\src\pages\(User)\Speech\index.spec.ts:79:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)

Locator: locator(':root')
Expected string: "http://localhost:5173/"
Received string: "http://localhost:5173/auth"
Call log:
  - expect.toHaveURL with timeout 5000ms
  - waiting for locator(':root')
    9 × locator resolved to <html lang="en">…</html>
      - unexpected value "http://localhost:5173/auth"

    at D:\DATN\client\src\pages\(User)\Speech\index.spec.ts:84:28
```

# Page snapshot

```yaml
- img "login"
- heading "Login" [level=2]
- text: Welcome to Speak-Up!
- textbox "Email": tanquanga6k39@gmail.com
- textbox "Password": Quang@2003
- img
- button "Login"
- text: Forgot password? Don't have an account?Register
- img "facebook"
- img "google"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Speech Page', () => {
   4 |     test.beforeEach(async ({ page }) => {
   5 |         await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
   6 |     });
   7 |
   8 |     test('Login with valid credentials then go to Home page select ordering and press button repeat', async ({ page }) => {
   9 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  10 |         await page.fill('input[name="password"]', 'Quang@2003');
  11 |         await page.getByRole('button', { name: /login/i }).click();
  12 |         // Kiểm tra điều hướng hoặc thông báo thành công
  13 |         // await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
  14 |         await expect(page).toHaveURL('http://localhost:5173/');
  15 |         await page.goto('http://localhost:5173/');
  16 |
  17 |         // Kiểm tra xem ListCard có hiển thị không
  18 |         await page.getByText('Ordering a taxi', { exact: true }).click();
  19 |         await page.getByRole('button', { name: '🔁 Repeat' }).click();
  20 |         await page.waitForTimeout(20000); // Đợi 7 giây
  21 |     
  22 |     });
  23 |
  24 |     test('Login with valid credentials then go to Home page select ordering and press button translate ', async ({ page }) => {
  25 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  26 |         await page.fill('input[name="password"]', 'Quang@2003');
  27 |         await page.getByRole('button', { name: /login/i }).click();
  28 |         // Kiểm tra điều hướng hoặc thông báo thành công
  29 |         await expect(page).toHaveURL('http://localhost:5173/');
  30 |         await page.goto('http://localhost:5173/');
  31 |
  32 |         // Kiểm tra xem ListCard có hiển thị không
  33 |         await page.getByText('Ordering a taxi', { exact: true }).click();
  34 |         await page.getByRole('button', { name: '🌐 Translate' }).click();
  35 |         await page.waitForTimeout(20000); // Đợi 7 giây
  36 |     });
  37 |
  38 |
  39 |     
  40 |     test('Login with valid credentials then go to Home page select ordering click setting ', async ({ page }) => {
  41 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  42 |         await page.fill('input[name="password"]', 'Quang@2003');
  43 |         await page.getByRole('button', { name: /login/i }).click();
  44 |         // Kiểm tra điều hướng hoặc thông báo thành công
  45 |         await expect(page).toHaveURL('http://localhost:5173/');
  46 |         await page.goto('http://localhost:5173/');
  47 |
  48 |         // Kiểm tra xem ListCard có hiển thị không
  49 |         await page.getByText('Ordering a taxi', { exact: true }).click();
  50 |         await page.getByTestId('settings-button').locator('svg').click();
  51 |         await page.selectOption('select', { value: 'vi' });
  52 |         // await page.locator('button[aria-label="microphone"]').click();
  53 |         await page.waitForTimeout(20000); // Đợi 7 giây
  54 |         
  55 |
  56 |
  57 |     });
  58 |
  59 |     test('Login with valid credentials then go to Home page select ordering press chat ', async ({ page }) => {
  60 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  61 |         await page.fill('input[name="password"]', 'Quang@2003');
  62 |         await page.getByRole('button', { name: /login/i }).click();
  63 |         // Kiểm tra điều hướng hoặc thông báo thành công
  64 |         await expect(page).toHaveURL('http://localhost:5173/');
  65 |         await page.goto('http://localhost:5173/');
  66 |
  67 |         // Kiểm tra xem ListCard có hiển thị không
  68 |         await page.getByText('Ordering a taxi', { exact: true }).click();
  69 |         const chatInput = page.locator('input[placeholder="Aa"]');
  70 |         await expect(chatInput).toBeVisible();
  71 |         await chatInput.fill('Hello, I want to go to the airport');
  72 |         await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
  73 |         await page.waitForTimeout(20000); // Đợi 7 giây
  74 |     
  75 |
  76 |     });
  77 |
  78 |     
  79 |     test('Login with valid credentials then go to Home page select ordering click on suggestion icon ', async ({ page }) => {
  80 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  81 |         await page.fill('input[name="password"]', 'Quang@2003');
  82 |         await page.getByRole('button', { name: /login/i }).click();
  83 |         // Kiểm tra điều hướng hoặc thông báo thành công
> 84 |         await expect(page).toHaveURL('http://localhost:5173/');
     |                            ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  85 |         await page.goto('http://localhost:5173/');
  86 |
  87 |         // Kiểm tra xem ListCard có hiển thị không
  88 |         await page.getByText('Ordering a taxi', { exact: true }).click();
  89 |         const svgIcon = page.locator('svg[viewBox="0 0 352 512"]');
  90 |         await expect(svgIcon).toBeVisible();
  91 |         await svgIcon.click();
  92 |         await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
  93 |         await expect(page.getByText('Không thể gợi ý: Failed to fetch', { exact: true })).toBeVisible();
  94 |         await page.waitForTimeout(20000); // Đợi 7 giây
  95 |     
  96 |
  97 |     });
  98 | });
```