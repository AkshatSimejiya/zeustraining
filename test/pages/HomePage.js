const { expect } = require("allure-playwright")

class HomePage {
    constructor(page){
        this.page = page
        this.menuButton = "//img[@alt='menu']"
        this.signOut = "//button[normalize-space()='Sign out']"
        this.cart = "//button[normalize-space()='Cart']"
    }

    async signOutApplication(){
        await this.page.locator(this.menuButton).click()
        await this.page.locator(this.signOut).click()
    }

    async verifyCart(){
        await expect(this.page.locator(this.cart)).toBeVisible();
    }
}

module.exports=HomePage