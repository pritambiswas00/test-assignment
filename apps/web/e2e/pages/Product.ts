import { expect, type Locator, type Page } from "@playwright/test";

export class Product {
  readonly addToCartButton: Locator;
  readonly cartButton: Locator;
  readonly cartSheetTitle: Locator;
  readonly cartCountBadge: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly category: Locator;
  readonly updatedAt: Locator;
  readonly image: Locator;

  constructor(private page: Page) {
    this.title = this.page.locator('[data-slot="card-title"]').first();
    this.description = this.page.locator('[data-slot="card-description"]').first();
    this.price = this.page.locator('[data-slot="card-content"] p').first();
    this.category = this.page.getByText(/^Category:/);
    this.updatedAt = this.page.getByText(/^Updated:/);
    this.image = this.page.getByRole("img").first();
    this.addToCartButton = this.page.getByRole("button", { name: /add to cart/i, exact: true });
    this.cartButton = this.page.getByRole("button", { name: /^Cart(\s+\d+)?$/ });
    this.cartSheetTitle = this.page.getByText("Your cart");
    this.cartCountBadge = this.cartButton.locator('[data-slot="badge"]');
  }

  async waitForLoaded(expectedTitle?: string) {
    await expect(this.title).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();

    if (expectedTitle) {
      await expect(this.title).toContainText(expectedTitle);
    }
  }

  async clickAddToCart() {
    await this.addToCartButton.click();
  }

  async openCart() {
    await this.cartButton.click();
    await expect(this.cartSheetTitle).toBeVisible();
  }

  async getTitleText() {
    return (await this.title.textContent())?.trim() ?? "";
  }

  async getPriceText() {
    return (await this.price.first().textContent())?.trim() ?? "";
  }

  async getCategoryText() {
    return (await this.category.textContent())?.trim() ?? "";
  }

  async getCartCountText() {
    return (await this.cartCountBadge.textContent())?.trim() ?? "";
  }
}