import { test, expect } from "@playwright/test";

const testData = JSON.parse(JSON.stringify(require('../testData.json')));

test.describe("Data driven test", ()=>{
    for(const data of testData){
        test.describe(`Login Test for user ${data.id}`, function(){
            test("Login to Application", async ({page})=> {
                await page.goto("https://freelance-learn-automation.vercel.app/login")
                await page.locator("//input[@id='email1']").fill(data.username)
                await page.locator("//input[@id='password1']").fill(data.password)
            })
        })
    }
})