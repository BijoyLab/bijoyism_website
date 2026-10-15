import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderPage,getRoutes} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
import {structuredGraph,sitemapEntries,routeAliases} from '../src/site/seo.js';
import {testingEvidence} from '../src/site/evidence.js';
import {purchaseDestination} from '../src/site/purchase-links.js';
import {validatePurchaseEvent} from '../src/server/purchase-events.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');
// Use live project truth locally and a reviewed public-field snapshot in standalone CI.
const truthUrl=new URL('../../../Product/00-core/product-facts.compact.json',import.meta.url);
const snapshot=read('./fixtures/product-compliance.json');
const truth=fs.existsSync(truthUrl)?JSON.parse(fs.readFileSync(truthUrl,'utf8')):snapshot;
test('public testing scope stays aligned with current owner-confirmed product truth',()=>{
 assert.deepEqual(snapshot.compliance,{covered_models:truth.compliance.covered_models,test_report:truth.compliance.test_report,cpc:truth.compliance.cpc});
 assert.deepEqual(testingEvidence.models,truth.compliance.covered_models);
 assert.equal(testingEvidence.report,truth.compliance.test_report);
 assert.equal(testingEvidence.certificate,truth.compliance.cpc);
 for(const lang of ['en','zh']){
  const page=renderPage({lang,route:'guides/testing',products,channels,ideas:playIdeas});
  for(const id of truth.compliance.covered_models)assert.ok(page.body.includes(id));
  assert.ok(page.body.includes(truth.compliance.cpc));
 }
});
test('product schema separates real SKU, model and ASIN with exact dimensions',()=>{
 for(const lang of ['en','zh'])for(const p of products){
  const route=`products/${p.id}-${p.slug}`,page=renderPage({lang,route,products,channels,ideas:playIdeas});
  const graph=structuredGraph(lang,route,page,products,playIdeas,channels);
  const product=graph.find(x=>x['@type']==='Product');
  assert.equal(product.model,p.id.toUpperCase());
  assert.equal(product.width.value,p.dimensions.widthIn);
  assert.equal(product.height.value,p.dimensions.thicknessIn);
  assert.equal(product.width.unitCode,'INH');
  assert.equal(product.sku,p.id==='td01'?'BJS-ANIMAL-8':undefined);
  assert.ok(product.additionalProperty.some(x=>x.name==='Amazon US ASIN'&&x.value===channels[p.id].amazon.asin));
  assert.ok(!product.gtin&&!product.aggregateRating&&!product.offers);
  assert.ok(product.subjectOf['@id'].endsWith('/guides/testing/#article'));
  assert.equal(graph.find(x=>x['@type']==='BreadcrumbList').itemListElement.length,3);
 }
});
test('temporary single-domain sitemaps contain both languages and no unavailable cn targets',()=>{
 const routes=getRoutes(products,playIdeas);
 for(const lang of ['en','zh']){
  const entries=sitemapEntries(lang,routes),host='bijoyism.cc';
  assert.equal(new Set(entries.map(x=>x.url)).size,entries.length);
  for(const entry of entries){
   assert.equal(new URL(entry.url).hostname,host);
   const path=new URL(entry.url).pathname.split('/').slice(2).filter(Boolean).join('/');
   assert.ok(!routeAliases[path]);
   assert.equal(new URL(entry.alternates.languages.en).hostname,'bijoyism.cc');
   assert.equal(new URL(entry.alternates.languages['zh-CN']).hostname,'bijoyism.cc');
   assert.ok(entry.alternates.languages['zh-CN'].includes('/zh/'));
  }
 }
 const entries=['en','zh'].flatMap(lang=>sitemapEntries(lang,routes));
 assert.equal(new Set(entries.map(x=>x.url)).size,entries.length);
 for(const lang of ['en','zh'])for(const route of routes){
  const page=renderPage({lang,route,products,channels,ideas:playIdeas});
  assert.ok(!JSON.stringify(structuredGraph(lang,route,page,products,playIdeas,channels)).includes('https://bijoyism.cn'));
 }
});
test('tracking preserves ASIN and rejects malformed or unrelated events',()=>{
 const channel=channels.td01.amazon;
 assert.equal(purchaseDestination(channel),channel.url);
 assert.ok(purchaseDestination({...channel,attributionUrls:{bottom:channel.url+'&maas=example'}},'bottom').includes('maas=example'));
 assert.equal(purchaseDestination({...channel,attributionUrls:{default:'https://evil.example/dp/'+channel.asin}}),'');
 assert.equal(purchaseDestination({...channel,attributionUrls:{default:channels.td02.amazon.url}}),channel.url);
 const event={event:'purchase_click',platform:'amazon',productId:'td01',language:'en',page:'/en/products/td01-animal-discovery/',position:'product',destination:channel.url,source:'test',campaign:'test\nline',attributed:false};
 const accepted=validatePurchaseEvent(event,products,channels);
 assert.equal(accepted.asin,channel.asin);
 assert.ok(!accepted.destination.includes('?')&&!accepted.campaign.includes('\n'));
 assert.equal(validatePurchaseEvent({...event,productId:'fake'},products,channels),null);
 assert.equal(validatePurchaseEvent({...event,destination:channels.td02.amazon.url},products,channels),null);
 assert.equal(validatePurchaseEvent({...event,page:event.page+'?email=private'},products,channels),null);
});
