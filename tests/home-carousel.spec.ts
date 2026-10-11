import {expect,test} from '@playwright/test';
for(const lang of ['zh','en']) {
 test(`${lang}: compact homepage carousel and removed entry points`,async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${lang}/`);
  await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
  for(const selector of ['.discovery-links','.photo-note','.shared-play-scene','.hero-carousel-controls'])await expect(page.locator(selector)).toHaveCount(0);
  const slides=page.locator('[data-hero-slide]');
  await expect(slides).toHaveCount(3);
  await expect(slides.nth(0)).toBeVisible();
  await page.locator('[data-carousel-next]').click();
  await expect(slides.nth(1)).toBeVisible();
  await page.locator('[data-carousel-previous]').click();
  await expect(slides.nth(0)).toBeVisible();
  await page.locator('[data-carousel-previous]').click();
  await expect(slides.nth(2)).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(slides.nth(0)).toBeVisible();
  await expect(page.locator('[data-carousel-pause]')).toHaveCount(0);
  const dots=page.locator('[data-carousel-dot]');
  await expect(dots).toHaveCount(3);
  await dots.nth(2).click();
  await expect(slides.nth(2)).toBeVisible();
  await expect(dots.nth(2)).toHaveAttribute('aria-current','true');
  await dots.nth(0).click();
  for(let i=0;i<3;i++){
   if(i)await page.locator('[data-carousel-next]').click();
   await expect.poll(()=>slides.nth(i).locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
  }
  const gallery=await page.locator('.hero-carousel').boundingBox();
  const image=await slides.nth(2).locator('img').boundingBox();
  expect(image!.width).toBeCloseTo(gallery!.width,0);
  const arrow=await page.locator('[data-carousel-next]').boundingBox();
  expect(arrow!.y+arrow!.height).toBeLessThan(gallery!.y+gallery!.height);
  expect(gallery!.height).toBeLessThan(530);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}
test('carousel auto rotates, resets after selection, and honors reduced motion',async({page})=>{
 await page.clock.install();
 await page.goto('/en/');
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 await page.clock.fastForward(5100);
 await expect(page.locator('[data-hero-slide]').nth(1)).toBeVisible();
 await expect(page.locator('[data-carousel-dot]').nth(1)).toHaveAttribute('aria-current','true');
 await page.locator('[data-carousel-dot]').nth(2).click();
 await page.clock.fastForward(5100);
 await expect(page.locator('[data-hero-slide]').nth(0)).toBeVisible();
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload();
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 await page.clock.fastForward(12000);
 await expect(page.locator('[data-hero-slide]').nth(0)).toBeVisible();
 await page.locator('[data-carousel-dot]').nth(2).click();
 await expect(page.locator('[data-hero-slide]').nth(2)).toBeVisible();
});
