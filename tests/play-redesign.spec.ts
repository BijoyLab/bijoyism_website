import {expect,test} from '@playwright/test';
for(const locale of ['zh','en']){
 test(`${locale}: independent games and setting pages`,async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`/${locale}/play-ideas/`);
  await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.play-library .play-card')).toHaveCount(14);
  await expect(page.locator('.library-guides .play-card')).toHaveCount(2);
  await expect(page.locator('.play-modes,.library-series')).toHaveCount(0);
  await page.selectOption('[name="collection"]','mix');
  await expect(page.locator('.play-library .play-card')).toHaveCount(3);
  await expect(page.locator('.play-library .play-card-requirements').first()).toContainText('2');
  await page.selectOption('[name="players"]','solo');
  await expect(page.locator('.play-library .play-card')).toHaveCount(2);
  const other=locale==='zh'?'en':'zh';
  await page.selectOption('#language-select',other);
  await expect(page).toHaveURL(new RegExp(`/${other}/play-ideas/.*collection=mix.*players=solo`));
  await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.play-library .play-card')).toHaveCount(2);
  await page.locator('.play-library [data-play-link]').first().click();
  await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
  await page.evaluate(()=>{(window as unknown as {printCalled:boolean}).printCalled=false;window.print=()=>{(window as unknown as {printCalled:boolean}).printCalled=true;};});
  await page.locator('[data-print]').click();
  expect(await page.evaluate(()=>(window as unknown as {printCalled:boolean}).printCalled)).toBe(true);
  await page.emulateMedia({media:'print'});
  await expect(page.locator('.play-print-card')).toBeVisible();
  await page.emulateMedia({media:'screen'});
  await page.locator('[data-back-play]').last().click();
  await expect(page.locator('[name="collection"]')).toHaveValue('mix');
  await expect(page.locator('[name="players"]')).toHaveValue('solo');
  for(const [route,setting] of [['families','home'],['schools','classroom']]){
   await page.goto(`/${locale}/${route}/`);
   await expect(page.locator('#app')).toHaveAttribute('data-ready','true');
   await expect(page.locator('.play-card')).toHaveCount(0);
   await expect(page.locator('.audience-values article')).toHaveCount(3);
   await page.locator('.audience-play-entry .button').click();
   await expect(page).toHaveURL(new RegExp(`setting=${setting}`));
   await expect(page.locator('[name="setting"]')).toHaveValue(setting);
   await expect(page.locator('[name="collection"]')).toHaveValue('all');
  }
  await page.goto(`/${locale}/products/td01-animal-discovery/`);
  await page.locator('a[href*="play-ideas/?collection=td01"]').click();
  await expect(page.locator('[name="collection"]')).toHaveValue('td01');
  await page.selectOption('[name="setting"]','reading');
  await expect(page.locator('.play-library .play-card')).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
 });
}
