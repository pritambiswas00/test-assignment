import { expect, type Locator, type Page } from '@playwright/test'

export class ProductList {
	readonly heading: Locator
	readonly productLinks: Locator
	readonly productTitles: Locator

	constructor(private page: Page) {
		this.heading = this.page.getByRole('heading', { name: 'Products' })
		this.productLinks = this.page.locator('a[href^="/products/"]')
		this.productTitles = this.page.locator('[data-slot="card-title"]')
	}

	async goto() {
		await this.page.goto('/')
	}

	async waitForLoaded() {
		await expect(this.heading).toBeVisible()
		await expect(this.productLinks.first()).toBeVisible()
	}

	async clickFirstProduct() {
		await this.productLinks.first().click()
	}

	async getFirstProductTitle() {
		return (await this.productTitles.first().innerText()).trim()
	}

	async getProductTitle(index: number) {
		return (await this.productTitles.nth(index).innerText()).trim()
	}
}
