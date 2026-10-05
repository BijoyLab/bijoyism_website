import { expect, test } from "@playwright/test";
import routeList from "../src/site/data/routes.json";

const representative = ["", "products", "shop/compare", "shop/find-your-fit", "products/td03-aqua-tones", "play-ideas", "play-ideas/adventure-trail", "schools", "about", "contact?topic=customization"];
for (const locale of ["en", "zh"] as const) {
  test(`${locale}: all major page layouts and assets`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of representative) {
      const [path, query] = route.split("?");
      const response = await page.goto(`/${locale}/${path}${path ? "/" : ""}${query ? `?${query}` : ""}`);
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(page.locator("header .brand img")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", locale === "zh" ? "zh-CN" : "en");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
      if (route === "") {
        const title = await page.locator(".hero h1").boundingBox();
        const photo = await page.locator(".hero-photo").boundingBox();
        expect(title && photo && title.y + title.height <= photo.y).toBe(true);
        await page.screenshot({ path: testInfo.outputPath(`${locale}-home-viewport.png`) });
      }
      if (route === "" || route === "play-ideas" || route === "schools" || route === "about") {
        await page.screenshot({ path: testInfo.outputPath(`${locale}-${route || "home"}.png`), fullPage: true });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("catalog, gallery, dimensions and mobile navigation", async ({ page }, testInfo) => {
  await page.goto("/en/products/");
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await page.selectOption('select[name="collection"]', "td03");
  await page.locator('.catalog-filters [type="submit"]').click();
  await expect(page.locator(".product")).toHaveCount(1);
  await expect(page).toHaveURL(/collection=td03/);
  await page.locator(".product-actions a").first().click();
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  const thumb = page.locator("[data-gallery-index]").nth(1);
  await thumb.click();
  await expect(thumb).toHaveAttribute("aria-pressed", "true");
  await page.locator('[data-unit="in"]').click();
  await expect(page.locator("[data-dimensions]")).not.toContainText("cm");
  await page.locator('[data-unit="dual"]').click();
  await expect(page.locator("[data-dimensions]")).toContainText("cm");
  if (testInfo.project.name !== "desktop") {
    await page.locator(".menu-toggle").click();
    await expect(page.locator("#navigation")).toHaveClass(/open/);
    await page.locator('#navigation a[href="/en/about/"]').click();
    await expect(page).toHaveURL(/\/en\/about\/$/);
  }
});

test("play filters, language, history, detail return and printing", async ({ page }) => {
  await page.goto("/en/play-ideas/");
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#play-results")).toContainText("14");
  await page.selectOption('[data-play-filters] select[name="age"]', "5-6");
  await page.selectOption('[data-play-filters] select[name="players"]', "2");
  await page.selectOption('[data-play-filters] select[name="setting"]', "reading");
  await expect(page).toHaveURL(/age=5-6.*players=2.*setting=reading/);
  await expect(page.locator(".play-library .play-card")).toHaveCount(5);
  await page.reload();
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator('[name="setting"]')).toHaveValue("reading");
  await page.selectOption("#language-select", "zh");
  await expect(page).toHaveURL(/\/zh\/play-ideas\/.*age=5-6/);
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator('[name="players"]')).toHaveValue("2");
  await page.locator(".play-library [data-play-link]").first().click();
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".play-step-list")).toBeVisible();
  await page.locator("[data-back-play]").last().click();
  await expect(page.locator('[name="setting"]')).toHaveValue("reading");
  await page.selectOption('[name="setting"]', "home");
  await page.goBack();
  await expect(page.locator('[name="setting"]')).toHaveValue("reading");
  await page.locator("[data-play-filter-link]").filter({ hasText: "清除全部" }).first().click();
  await expect(page.locator("#play-results")).toContainText("14");
  await page.goto("/zh/play-ideas/adventure-trail/");
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".play-product-links li")).toHaveCount(3);
  await page.locator(".play-variation summary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".play-variation").first()).toHaveAttribute("open", "");
  const openBefore = await page.locator(".play-variation[open]").count();
  await page.evaluate(() => dispatchEvent(new Event("beforeprint")));
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".play-print-card")).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => dispatchEvent(new Event("afterprint")));
  expect(await page.locator(".play-variation[open]").count()).toBe(openBefore);
});

test("FAQ language persistence and customization draft", async ({ page }) => {
  await page.goto("/en/faq/");
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await page.locator("details summary").first().click();
  await page.selectOption("#language-select", "zh");
  await expect(page.locator("#app")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.goto("/zh/contact/?topic=customization");
  await expect(page.locator("#delivery-notice")).toContainText("在线提交暂未启用");
  await expect(page.locator('#inquiry-form [type="submit"]')).toBeDisabled();
  await page.locator("#organization").fill("Example School");
  await page.selectOption("#inquiryType", "sample");
  await expect(page.locator("#quantity-field")).toBeHidden();
  await page.selectOption("#language-select", "en");
  await expect(page).toHaveURL(/\/en\/contact\/\?topic=customization/);
  await expect(page.locator("#organization")).toHaveValue("Example School");
  await expect(page.locator("#inquiryType")).toHaveValue("sample");
});

test("all 80 reference routes have server HTML and assets; legacy redirects", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The HTTP route inventory is independent of viewport.");
  const assets = new Set<string>();
  for (const locale of ["en", "zh"]) {
    for (const route of routeList) {
      const response = await request.get(`/${locale}/${route}${route ? "/" : ""}`);
      expect(response.status(), `${locale}/${route}`).toBe(200);
      const html = await response.text();
      expect(html).toContain('<header>');
      expect(html).toContain('<footer>');
      expect(html).toContain('name="robots" content="noindex, nofollow"');
      expect((html.match(/<h1[ >]/g) || []).length, route).toBe(1);
      for (const match of html.matchAll(/(?:src|srcSet|srcset)="(\/assets\/[^" ]+)"/g)) assets.add(match[1]);
    }
    for (const [oldId, target] of [["animal-story-trail", "story-steps"], ["calm-corner-path", "quiet-steps"]]) {
      const response = await request.get(`/${locale}/play-ideas/${oldId}/?age=5-6`, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers().location).toContain(`/${target}/?age=5-6`);
    }
    const info = await request.get(`/${locale}/our-products/care/?from=old`, { maxRedirects: 0 });
    expect(info.status()).toBe(301);
    expect(info.headers().location).toContain(`/products/?from=old#care`);
  }
  for (const asset of assets) expect((await request.get(asset)).status(), asset).toBe(200);
  const oldChinese = await request.get("/zh-cn/schools/?source=old", { maxRedirects: 0 });
  expect(oldChinese.headers().location).toContain("/zh/schools/?source=old");
  expect((await request.get("/en/missing-page/")).status()).toBe(404);
  expect(await (await request.get("/api/inquiries")).json()).toEqual({ available: false });
});
