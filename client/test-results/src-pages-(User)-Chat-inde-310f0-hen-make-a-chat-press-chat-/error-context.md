# Test info

- Name: Chat Page >> login with valid credentials then make a chat press chat 
- Location: D:\DATN\client\src\pages\(User)\Chat\index.spec.ts:114:5

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

    at D:\DATN\client\src\pages\(User)\Chat\index.spec.ts:119:28
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
   19 |         await page.waitForTimeout(7000); // Đợi 7 giây
   20 |         await page.fill('input[name="chat"]', 'I want to talk about the food topic');
   21 |         await page.getByTestId("send-chat").click();
   22 |         await page.waitForTimeout(7000); // Đợi 7 giây
   23 |
   24 |     });
   25 |
   26 |     test('login with valid credentials then make a chat with interesting topic', async ({ page }) => {
   27 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
   28 |         await page.fill('input[name="password"]', 'Quang@2003');
   29 |         await page.getByRole('button', { name: /login/i }).click();
   30 |         // Kiểm tra điều hướng hoặc thông báo thành công
   31 |         await expect(page).toHaveURL('http://localhost:5173/');
   32 |         await page.goto('http://localhost:5173/');
   33 |
   34 |         // Kiểm tra xem ListCard có hiển thị không
   35 |         await page.getByText('Chat', { exact: true }).click()
   36 |
   37 |         await page.getByRole('button', { name: /interesting/i }).click();
   38 |         await page.waitForTimeout(7000); // Đợi 7 giây
   39 |         await page.fill('input[name="chat"]', 'I want to talk about the food topic');
   40 |         await page.getByTestId("send-chat").click();
   41 |         await page.waitForTimeout(7000); // Đợi 7 giây
   42 |
   43 |     });
   44 |     test('login with valid credentials then make a chat with you decide topic', async ({ page }) => {
   45 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
   46 |         await page.fill('input[name="password"]', 'Quang@2003');
   47 |         await page.getByRole('button', { name: /login/i }).click();
   48 |         // Kiểm tra điều hướng hoặc thông báo thành công
   49 |         await expect(page).toHaveURL('http://localhost:5173/');
   50 |         await page.goto('http://localhost:5173/');
   51 |
   52 |         // Kiểm tra xem ListCard có hiển thị không
   53 |         await page.getByText('Chat', { exact: true }).click()
   54 |
   55 |         await page.getByRole('button', { name: /you decide/i }).click();
   56 |         await page.waitForTimeout(7000); // Đợi 7 giây
   57 |         await page.fill('input[name="chat"]', 'I want to talk about the food topic');
   58 |         await page.getByTestId("send-chat").click();
   59 |         await page.waitForTimeout(7000); // Đợi 7 giây
   60 |
   61 |     });
   62 |
   63 |     test('login with valid credentials then make a chat press button repeat', async ({ page }) => {
   64 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
   65 |         await page.fill('input[name="password"]', 'Quang@2003');
   66 |         await page.getByRole('button', { name: /login/i }).click();
   67 |         // Kiểm tra điều hướng hoặc thông báo thành công
   68 |         // await expect(page).toHaveURL('http://localhost:5173/', { timeout: 10000 });
   69 |         await expect(page).toHaveURL('http://localhost:5173/');
   70 |         await page.goto('http://localhost:5173/');
   71 |
   72 |         // Kiểm tra xem ListCard có hiển thị không
   73 |         await page.getByText('Chat', { exact: true }).click()
   74 |         await page.getByRole('button', { name: '🔁 Repeat' }).click();
   75 |         await page.waitForTimeout(20000); // Đợi 7 giây
   76 |     
   77 |     });
   78 |
   79 |     test('login with valid credentials then make a chat press button translate ', async ({ page }) => {
   80 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
   81 |         await page.fill('input[name="password"]', 'Quang@2003');
   82 |         await page.getByRole('button', { name: /login/i }).click();
   83 |         // Kiểm tra điều hướng hoặc thông báo thành công
   84 |         await expect(page).toHaveURL('http://localhost:5173/');
   85 |         await page.goto('http://localhost:5173/');
   86 |
   87 |         // Kiểm tra xem ListCard có hiển thị không
   88 |         await page.getByText('Chat', { exact: true }).click()
   89 |         await page.getByRole('button', { name: '🌐 Translate' }).click();
   90 |         await page.waitForTimeout(20000); // Đợi 7 giây
   91 |     });
   92 |
   93 |
   94 |     
   95 |     // test('login with valid credentials then make a chat button click setting ', async ({ page }) => {
   96 |     //     await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
   97 |     //     await page.fill('input[name="password"]', 'Quang@2003');
   98 |     //     await page.getByRole('button', { name: /login/i }).click();
   99 |     //     // Kiểm tra điều hướng hoặc thông báo thành công
  100 |     //     await expect(page).toHaveURL('http://localhost:5173/');
  101 |     //     await page.goto('http://localhost:5173/');
  102 |
  103 |     //     // Kiểm tra xem ListCard có hiển thị không
  104 |     //     await page.getByText('Chat', { exact: true }).click()
  105 |     //     await page.getByTestId('settings-button').locator('svg').click();
  106 |     //     await page.selectOption('select', { value: 'vi' });
  107 |     //     // await page.locator('button[aria-label="microphone"]').click();
  108 |     //     await page.waitForTimeout(20000); // Đợi 7 giây
  109 |         
  110 |
  111 |
  112 |     // });
  113 |
  114 |     test('login with valid credentials then make a chat press chat ', async ({ page }) => {
  115 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  116 |         await page.fill('input[name="password"]', 'Quang@2003');
  117 |         await page.getByRole('button', { name: /login/i }).click();
  118 |         // Kiểm tra điều hướng hoặc thông báo thành công
> 119 |         await expect(page).toHaveURL('http://localhost:5173/');
      |                            ^ Error: Timed out 5000ms waiting for expect(locator).toHaveURL(expected)
  120 |         await page.goto('http://localhost:5173/');
  121 |
  122 |         // Kiểm tra xem ListCard có hiển thị không
  123 |         await page.getByText('Chat', { exact: true }).click()
  124 |         const chatInput = page.locator('input[placeholder="Aa"]');
  125 |         await expect(chatInput).toBeVisible();
  126 |         await chatInput.fill('Hello, I want to go to the airport');
  127 |         await page.locator('button:has(svg:has(path[d^="M476 3.2L12.5 270.6"]))').click();
  128 |         await page.waitForTimeout(20000); // Đợi 7 giây
  129 |     
  130 |
  131 |     });
  132 |
  133 |     
  134 |     test('login with valid credentials then make a chat click on suggestion icon ', async ({ page }) => {
  135 |         await page.fill('input[name="email"]', 'tanquanga6k39@gmail.com');
  136 |         await page.fill('input[name="password"]', 'Quang@2003');
  137 |         await page.getByRole('button', { name: /login/i }).click();
  138 |         // Kiểm tra điều hướng hoặc thông báo thành công
  139 |         await expect(page).toHaveURL('http://localhost:5173/');
  140 |         await page.goto('http://localhost:5173/');
  141 |
  142 |         // Kiểm tra xem ListCard có hiển thị không
  143 |         await page.getByText('Chat', { exact: true }).click()
  144 |          const settingsBtn = page.getByTestId('settings-button').locator('svg');
  145 |         await expect(settingsBtn).toBeVisible({ timeout: 10000 });
  146 |         await settingsBtn.click();
  147 |         await page.waitForTimeout(20000); // Đợi 7 giây
  148 |     })    
  149 |
  150 | });
```