# Test info

- Name: Lesson Page >> Login with valid credentials then go to lesson click on additional information
- Location: D:\DATN\client\src\pages\(User)\Lesson\index.spec.ts:24:2

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

    at D:\DATN\client\src\pages\(User)\Lesson\index.spec.ts:29:28
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
   3 | test.describe('Lesson Page', () => {
   4 |     test.beforeEach(async ({ page }) => {
   5 |         await page.goto('http://localhost:5173/auth'); // Đổi lại URL nếu khác
   6 |     });
   7 |
   8 |     test('login with valid credentials then make a lesson', async ({ page }) => {
   9 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  10 |         await page.fill('input[name="password"]', 'Quang@2003');
  11 |         await page.getByRole('button', { name: /login/i }).click();
  12 |         // Kiểm tra điều hướng hoặc thông báo thành công
  13 |         await expect(page).toHaveURL('http://localhost:5173/');
  14 |         await page.goto('http://localhost:5173/');
  15 |
  16 |         // Kiểm tra xem ListCard có hiển thị không
  17 |         await page.getByText(/lesson/i).click()
  18 |         await page.getByText(/ending sounds/i).click()
  19 |         await page.getByText(/lesson 1 - ending sound \/p\//i).click()
  20 |         await page.getByRole('button', { name: /nghe/i }).click();
  21 |     });
  22 |
  23 |
  24 |  test('Login with valid credentials then go to lesson click on additional information', async ({ page }) => {
  25 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  26 |         await page.fill('input[name="password"]', 'Quang@2003');
  27 |         await page.getByRole('button', { name: /login/i }).click();
  28 |         // Kiểm tra điều hướng hoặc thông báo thành công
> 29 |         await expect(page).toHaveURL('http://localhost:5173/');
     |                            ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  30 |         await page.goto('http://localhost:5173/');
  31 |
  32 |         // Kiểm tra xem ListCard có hiển thị không
  33 |         await page.getByText(/lesson/i).click()
  34 |         await page.getByText(/ending sounds/i).click()
  35 |         await page.getByText(/lesson 1 - ending sound \/p\//i).click()
  36 |         const infoButton = page.getByRole('button', { name: /thông tin bổ sung/i });
  37 |         await expect(infoButton).toBeVisible({ timeout: 10000 });
  38 |         await infoButton.click();
  39 |     });
  40 | });
```