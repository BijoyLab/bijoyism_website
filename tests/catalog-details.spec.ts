import {test,expect} from '@playwright/test';

for(const lang of ['en','zh'])test(`${lang}: simplified catalog details match the homepage layout`,async({page},info)=>{
 await page.goto(`/${lang}/products/`);
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 const block=page.locator('[data-catalog-details]');
 await expect(block).toHaveCount(1);
 await expect(block.locator('.detail-point')).toHaveCount(4);
 await expect(block.locator('.spec-list,.story-grid,.tip')).toHaveCount(0);
 const grid=await block.locator('.detail-points').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
 expect(grid).toBe(info.project.name==='mobile'?1:info.project.name==='tablet'?2:4);
 await expect(block.locator('img')).toHaveAttribute('src','/assets/home-care-scene-v02.webp');
 for(const selector of ['.catalog-specs','#product-facts','.catalog-guide-links']){
  await block.locator(selector).scrollIntoViewIfNeeded();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await expect.poll(()=>block.locator('img').evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 await expect(block.locator('a')).toHaveCount(3);
 await expect(page.locator('#main > section:last-child')).toHaveAttribute('data-review-wall','');
});
