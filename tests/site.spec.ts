import { expect, test } from "@playwright/test";

for (const locale of ["en", "zh"] as const) {
  test(`${locale}: responsive navigation and locale switching`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(locale === "en" ? "Make room for a little more joy." : "让日常，多一点快乐。");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    if (testInfo.project.name === "mobile") {
      const menu = page.getByRole("button", { name: locale === "en" ? "Open menu" : "打开菜单" });
      await menu.click();
      await expect(page.locator("#mobile-navigation")).toBeVisible();
      await page.locator("#mobile-navigation").getByRole("link", { name: locale === "en" ? "About" : "关于我们", exact: true }).click();
      await expect(page.locator("#mobile-navigation")).toBeHidden();
    } else {
      await page.locator("header nav:visible").getByRole("link", { name: locale === "en" ? "About" : "关于我们", exact: true }).click();
    }
    await expect(page).toHaveURL(new RegExp(`/${locale}/about$`));
    await page.goto(`/${locale}/about?source=preview#main-content`);
    const otherLocale = locale === "en" ? "zh" : "en";
    await page.getByRole("combobox").selectOption(otherLocale);
    await expect(page).toHaveURL(new RegExp(`/${otherLocale}/about\\?source=preview#main-content$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(otherLocale === "en" ? "About BIJOYISM" : "关于 BIJOYISM");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("browser language detection and unknown routes", async ({ browser }) => {
  const context = await browser.newContext({ locale: "zh-CN" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/zh$/);
  const response = await page.goto("/en/does-not-exist");
  expect(response?.status()).toBe(404);
  const invalidLocale = await page.goto("/fr");
  expect(invalidLocale?.status()).toBe(404);
  await context.close();
});
