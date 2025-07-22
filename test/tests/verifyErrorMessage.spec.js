import { test, expect } from "@playwright/test";
test("Verify error message", async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");

    await page.getByPlaceholder("Username").pressSequentially("test");
    await page.getByPlaceholder("Password").pressSequentially("Admin");

    await page.locator("button[type='submit']").click()


    const errorMessage = await page.locator("div.oxd-alert-content--error").textContent();

    expect((errorMessage) ? errorMessage === "Invalid credentials" : false).toBeTruthy();
})