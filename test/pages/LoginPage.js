const {expect} = require('@playwright/test')

class LoginPage {
    constructor(page){
        this.page = page
        this.userName = "//input[@id='email1']"
        this.password = "//input[@id='password1']"
        this.signinButton = "//button[normalize-space()='Sign in']"
    }

    async logintoApplication(){
        await this.page.fill(this.userName, "admin@gmail.com")
        await this.page.fill(this.password, "admin123")
        await this.page.click(this.signinButton);
    }

    async verifyLogin(){
        await expect(this.page.locator(this.signinButton)).toBeVisible();
    }
}

module.exports=LoginPage