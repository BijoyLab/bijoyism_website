import {test,expect} from '@playwright/test';

test('production HTTP requests redirect permanently, without losing paths or parameters',async({request},info)=>{
 test.skip(info.project.name!=='desktop');
 for(const path of ['/en/products/','/zh/play-ideas/?setting=classroom&utm_source=gsc','/sitemap.xml','/robots.txt','/assets/logo-red-v01.svg','/api/purchase-events/']){
  const response=await request.get(path,{headers:{host:'bijoyism.cc','x-forwarded-proto':'http'},maxRedirects:0});
  expect(response.status(),path).toBe(308);
  expect(response.headers().location,path).toBe('https://bijoyism.cc'+path);
 }
 const httpRoot=await request.get('/?utm_source=gsc',{headers:{host:'bijoyism.cc','x-forwarded-proto':'http'},maxRedirects:0});
 expect(httpRoot.status()).toBe(308);
 expect(httpRoot.headers().location).toBe('https://bijoyism.cc/?utm_source=gsc');
 // Only the secure root chooses a language; that decision must not be cached permanently.
 const secureRoot=await request.get('/?utm_source=gsc',{headers:{host:'bijoyism.cc','x-forwarded-proto':'https','cf-ipcountry':'CN'},maxRedirects:0});
 expect(secureRoot.status()).toBe(307);
 expect(secureRoot.headers().location).toBe('https://bijoyism.cc/zh/?utm_source=gsc');
});

test('HTTPS behind a proxy and local HTTP previews are not redirected',async({request},info)=>{
 test.skip(info.project.name!=='desktop');
 for(const path of ['/en/products/','/sitemap.xml','/robots.txt','/assets/logo-red-v01.svg','/api/purchase-events/']){
  const response=await request.get(path,{headers:{host:'bijoyism.cc','x-forwarded-proto':'https'},maxRedirects:0});
  expect(response.status(),path).toBe(200);
  expect(response.headers().location,path).toBeUndefined();
 }
 const preview=await request.get('/en/products/',{maxRedirects:0});
 expect(preview.status()).toBe(200);
 const filtered=await request.get('/zh/play-ideas/?setting=classroom',{headers:{host:'bijoyism.cc','x-forwarded-proto':'https'},maxRedirects:0});
 expect(filtered.status()).toBe(200);
 expect(await filtered.text()).toContain('rel="canonical" href="https://bijoyism.cc/zh/play-ideas/"');
});

test('404 responses contain only noindex, while real pages remain indexable',async({request},info)=>{
 test.skip(info.project.name!=='desktop');
 for(const locale of ['en','zh']){
  for(const path of ['404','missing-transport-regression']){
   const response=await request.get(`/${locale}/${path}/`);
   expect(response.status()).toBe(404);
   const tags=(await response.text()).match(/<meta[^>]*name="robots"[^>]*>/g)||[];
   expect(tags).toHaveLength(1);
   expect(tags[0]).toContain('content="noindex"');
  }
  const response=await request.get(`/${locale}/products/`);
  const tags=(await response.text()).match(/<meta[^>]*name="robots"[^>]*>/g)||[];
  expect(tags).toHaveLength(1);
  expect(tags[0]).toContain('content="index, follow"');
 }
});
