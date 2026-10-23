import {test,expect} from '@playwright/test';

for(const lang of ['en','zh'])test(`${lang}: review wall uses existing tokens and auto-rotates without controls`,async({page},info)=>{
 await page.clock.install();
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`/${lang}/products/`);
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 const wall=page.locator('[data-review-wall]');
 await wall.scrollIntoViewIfNeeded();
 await page.mouse.move(0,0);
 await expect(wall).toHaveAttribute('data-enhanced','true');
 await expect(wall.locator('article')).toHaveCount(10);
 await expect(wall.locator('article:visible')).toHaveCount(info.project.name==='mobile'?2:info.project.name==='tablet'?4:6);
 await expect(wall.locator('button')).toHaveCount(0);
 const first=await wall.locator('article').first().getAttribute('data-review-id');
 // Allow the intersection observer to report visibility before advancing time.
 await expect.poll(()=>wall.evaluate(el=>el.getBoundingClientRect().top<innerHeight)).toBe(true);
 await page.waitForTimeout(100);
 await page.clock.fastForward(10500);
 await expect(wall.locator('article').first()).not.toHaveAttribute('data-review-id',first!);
 const styles=await wall.locator('article').first().evaluate(el=>({radius:getComputedStyle(el).borderRadius,expected:getComputedStyle(document.documentElement).getPropertyValue('--radius').trim(),font:getComputedStyle(el).fontFamily}));
 expect(styles.radius).toBe(styles.expected);
 expect(styles.font).toMatch(/Montserrat|FangYuan/);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(errors).toEqual([]);
});

test('reduced motion exposes every excerpt with no automatic changes',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.clock.install();
 await page.goto('/en/products/');
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 const wall=page.locator('[data-review-wall]');
 await wall.scrollIntoViewIfNeeded();
 await expect(wall.locator('article:visible')).toHaveCount(10);
 const first=await wall.locator('article').first().getAttribute('data-review-id');
 await page.clock.fastForward(21000);
 await expect(wall.locator('article').first()).toHaveAttribute('data-review-id',first!);
});

test('without JavaScript reviews remain readable in server HTML',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 const page=await context.newPage();
 await page.goto('/zh/products/');
 await expect(page.locator('[data-review-wall] article:visible')).toHaveCount(10);
 await context.close();
});

test('reading hover and leaving the viewport suspend rotation',async({page})=>{
 await page.clock.install();
 await page.goto('/en/products/');
 await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
 const wall=page.locator('[data-review-wall]');
 await wall.scrollIntoViewIfNeeded();
 await wall.locator('blockquote').first().hover();
 const first=await wall.locator('article').first().getAttribute('data-review-id');
 await page.clock.fastForward(11000);
 await expect(wall.locator('article').first()).toHaveAttribute('data-review-id',first!);
 await page.mouse.move(0,0);
 await page.clock.fastForward(10500);
 await expect(wall.locator('article').first()).not.toHaveAttribute('data-review-id',first!);
 const next=await wall.locator('article').first().getAttribute('data-review-id');
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await expect.poll(()=>wall.evaluate(el=>el.getBoundingClientRect().top>=innerHeight)).toBe(true);
 await page.waitForTimeout(100);
 await page.clock.fastForward(11000);
 await expect(wall.locator('article').first()).toHaveAttribute('data-review-id',next!);
});
