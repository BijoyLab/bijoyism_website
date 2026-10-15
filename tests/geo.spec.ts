import { test, expect } from '@playwright/test';

test('production HTML exposes company facts, correct testing scope and linked product identities', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const locale of ['en', 'zh']) {
    const host = 'bijoyism.cc';
    const about = await (await request.get(`/${locale}/about/`)).text();
    expect(about).toContain('id="company-facts"');
    expect(about).toContain('2019');
    expect(about).toContain('support@bijoyism.cn');
    expect(about).toContain(`rel="canonical" href="https://${host}/${locale}/about/"`);
    expect(about).toContain('https://bijoyism.cc/zh/about/');
    expect(about).not.toContain('https://bijoyism.cn');
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

test('single-domain discovery and country defaults preserve query strings and preferences', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const host of ['bijoyism.cn', 'bijoyism.cc']) {
    const locale = host.endsWith('.cn') ? 'zh' : 'en';
    const headers = { host };
    const robots = await (await request.get('/robots.txt', { headers })).text();
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('https://bijoyism.cc/sitemap.xml');
    const sitemap = await (await request.get('/sitemap.xml', { headers })).text();
    expect(sitemap).toContain('<loc>https://bijoyism.cc/en/guides/testing/</loc>');
    expect(sitemap).toContain('<loc>https://bijoyism.cc/zh/guides/testing/</loc>');
    expect(sitemap).not.toContain('https://bijoyism.cn');
    expect(sitemap).not.toMatch(/<loc>[^<]*(our-products|\/collections\/|\/shop\/collections)/);
    const alias = await request.get(`/${locale}/our-products/testing/?source=old`, { headers: { host: 'bijoyism.cc' }, maxRedirects: 0 });
    expect(alias.status()).toBe(301);
    expect(alias.headers().location).toContain(`/guides/testing/?source=old`);
  }
  const china = await request.get('/?utm_source=test', { headers: { host: 'bijoyism.cc', 'cf-ipcountry': 'CN' }, maxRedirects: 0 });
  expect(china.headers().location).toBe('https://bijoyism.cc/zh/?utm_source=test');
  const overseas = await request.get('/?utm_source=test', { headers: { host: 'bijoyism.cc', 'cf-ipcountry': 'US' }, maxRedirects: 0 });
  expect(overseas.headers().location).toBe('https://bijoyism.cc/en/?utm_source=test');
  const preferred = await request.get('/', { headers: { host: 'bijoyism.cc', 'cf-ipcountry': 'CN', cookie: 'NEXT_LOCALE=en' }, maxRedirects: 0 });
  expect(preferred.headers().location).toBe('https://bijoyism.cc/en/');
  for (const host of ['bijoyism.cn', 'www.bijoyism.cn']) {
    const response = await request.get('/zh/about/?source=old', { headers: { host }, maxRedirects: 0 });
    expect(response.status()).toBe(307);
    expect(response.headers().location).toBe('https://bijoyism.cc/zh/about/?source=old');
  }
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
