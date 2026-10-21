import {test,expect} from '@playwright/test';
import baseline from '../docs/invisible-seo-baseline-2026-10-21.json';

test('all canonical server responses expose complete SEO without JS or login',async({request},info)=>{
 test.skip(info.project.name!=='desktop');
 for(const row of baseline){
  const response=await request.get(new URL(row.url).pathname);
  expect(response.status(),row.url).toBe(200);
  expect(response.headers()['x-robots-tag']||'').not.toContain('noindex');
  const html=await response.text();
  expect(html.match(/<title>/g),row.url).toHaveLength(1);
  expect(html.match(/rel="canonical"/g),row.url).toHaveLength(1);
  expect(html).toContain(`rel="canonical" href="${row.url}"`);
  expect(html).not.toMatch(/<meta[^>]+content="[^"]*noindex/);
  expect(html).toContain('property="og:site_name" content="BIJOYISM"');
  expect(html).toContain('name="twitter:card" content="summary_large_image"');
  expect(html).toContain(`lang="${row.locale==='zh'?'zh-CN':'en'}"`);
  for(const url of Object.values(row.languages))expect(html).toContain(url);
  expect(html).toMatch(/<meta name="description" content="[^"]+"/);
  expect(html).toMatch(/property="og:image" content="https:\/\/bijoyism.cc\//);
  expect(html).toContain('<main');
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  const json=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)||[];
  expect(json).toHaveLength(1);
  const graph=JSON.parse(json[0]!.replace(/^<script[^>]*>|<\/script>$/g,''))['@graph'];
  expect(graph.some((n:Record<string,unknown>)=>n['@type']==='Organization')).toBe(true);
 }
});

test('crawler files, parameters, real 404 and redirect normalization',async({request},info)=>{
 test.skip(info.project.name!=='desktop');
 const robots=await request.get('/robots.txt');
 expect(robots.status()).toBe(200);
 expect(await robots.text()).toContain('User-Agent: Googlebot');
 expect(await robots.text()).toContain('User-Agent: OAI-SearchBot');
 const sitemap=await request.get('/sitemap.xml');
 expect(sitemap.status()).toBe(200);
 const xml=await sitemap.text();
 expect([...xml.matchAll(/<loc>/g)]).toHaveLength(baseline.length);
 expect(xml).not.toContain('https://bijoyism.cn');
 const missing=await request.get('/en/nonexistent-seo-audit-20261021/');
 expect(missing.status()).toBe(404);
 expect(await missing.text()).toContain('noindex');
 const filtered=await request.get('/en/products/?collection=td01&utm_source=audit');
 expect(await filtered.text()).toContain('rel="canonical" href="https://bijoyism.cc/en/products/"');
 const noSlash=await request.get('/en/about',{maxRedirects:0});
 expect(noSlash.status()).toBe(308);
 const www=await request.get('/en/about/',{headers:{host:'www.bijoyism.cc'},maxRedirects:0});
 expect(www.headers().location).toBe('https://bijoyism.cc/en/about/');
});
