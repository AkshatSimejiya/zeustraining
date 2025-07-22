import { test, expect } from "@playwright/test";

test("Working with multiple tabs", async ({browser}) =>{
    
    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto("https://freelance-learn-automation.vercel.app/login");

    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        page.locator("(//a[contains(@href,'facebook')])[1]").click()
    ])

    await newPage.locator("(//input[@name='email'])[2]").type("Akshat@gmail.com", {delay:100})

    await newPage.close();
})