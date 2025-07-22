const {test, expect} = require("@playwright/test")

const LoginPage = require('../pages/LoginPage')
const HomePage = require('../pages/HomePage')

test("Login, Logout test", async ({page})=>{
    await page.goto("https://freelance-learn-automation.vercel.app/login")

    const loginPage = new LoginPage(page);

    await loginPage.logintoApplication();

    const homePage = new HomePage(page);

    await homePage.verifyCart();

    await homePage.signOutApplication();

    await loginPage.verifyLogin();
})