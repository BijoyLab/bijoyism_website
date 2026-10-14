import { test, expect } from '@playwright/test';

test('production HTML exposes company facts, correct testing scope and linked product identities', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const locale of ['en', 'zh']) {
    const host = locale === 'zh' ? 'bijoyism.cn' : 'bijoyism.cc';
    const about = await (await request.get(`/${locale}/about/`)).text();
    expect(about).toContain('id="company-facts"');
    expect(about).toContain('2019');
    expect(about).toContain('support@bijoyism.cn');
    expect(about).toContain(`rel="canonical" href="https://${host}/${locale}/about/"`);
    expect(about).toContain('https://bijoyism.cn/zh/about/');
    expect(about).toContain('https://bijoyism.cc/en/about/');
    const evidence = await (await request.get(`/${locale}/guides/testing/`)).text();
    for (const value of ['TD01', 'TD02', 'TD03', 'CPCC202602050363E', 'C202602050363E']) expect(evidence).toContain(value);
    for (const [id, slug] of [['td01','animal-discovery'],['td02','color-duos'],['td03','aqua-tones']]) {
      const html = await (await request.get(`/${locale}/products/${id}-${slug}/`)).text();
      const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
      const graph = JSON.parse(json!)['@graph'] as Record<string, unknown>[];
      const product = graph.find(item => item['@type'] === 'Product');
      expect(product?.model).toBe(id.toUpperCase());
      expect(product?.sku).toBe(id === 'td01' ? 'BJS-ANIMAL-8' : undefined);
      expect(product?.subjectOf).toEqual({ '@id': `https://${host}/${locale}/guides/testing/#article` });
    }
  }
});

test('domain-aware discovery and redirects preserve query strings', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const host of ['bijoyism.cn', 'bijoyism.cc']) {
    const locale = host.endsWith('.cn') ? 'zh' : 'en';
    const headers = { host };
    const robots = await (await request.get('/robots.txt', { headers })).text();
    expect(robots).toContain('Allow: /');
    expect(robots).toContain(`https://${host}/sitemap.xml`);
    const sitemap = await (await request.get('/sitemap.xml', { headers })).text();
    expect(sitemap).toContain(`<loc>https://${host}/${locale}/guides/testing/</loc>`);
    expect(sitemap).not.toMatch(/<loc>[^<]*(our-products|\/collections\/|\/shop\/collections)/);
    const alias = await request.get(`/${locale}/our-products/testing/?source=old`, { headers, maxRedirects: 0 });
    expect(alias.status()).toBe(301);
    expect(alias.headers().location).toContain(`/guides/testing/?source=old`);
  }
  const china = await request.get('/?utm_source=test', { headers: { host: 'bijoyism.cc', 'cf-ipcountry': 'CN' }, maxRedirects: 0 });
  expect(china.headers().location).toBe('https://bijoyism.cn/zh/?utm_source=test');
});

test('purchase reporting is explicit about disabled collection', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop');
  const response = await request.get('/api/purchase-events/');
  const config = await response.json();
  expect(typeof config.enabled).toBe('boolean');
  const denied = await request.post('/api/purchase-events/', { headers: { origin: 'https://unrelated.example' }, data: { event: 'purchase_click' } });
  expect(denied.status()).toBe(config.enabled ? 403 : 503);
  const valid = await request.post('/api/purchase-events/', { headers: { origin: 'http://127.0.0.1:3100' }, data: { event: 'purchase_click', platform: 'amazon', productId: 'td01', language: 'en', page: '/en/products/td01-animal-discovery/', position: 'product', destination: 'https://www.amazon.com/dp/B0HCPQ373H', source: 'local-test', attributed: false } });
  expect(valid.status()).toBe(config.enabled ? 202 : 503);
  expect(await valid.json()).toEqual({ accepted: config.enabled });
});
