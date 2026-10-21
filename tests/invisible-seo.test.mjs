import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {renderSite} from '../src/site/site-render.js';
import {renderPage,getRoutes} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
import {seoInfo,structuredGraph,sitemapEntries,routeAliases} from '../src/site/seo.js';
import {copy} from '../src/site/copy.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const baseline=read('../docs/invisible-seo-baseline-2026-10-21.json');
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');
const pageFor=(locale,route)=>route?renderPage({lang:locale,route,products,channels,ideas:playIdeas}):{title:`BIJOYISM — ${copy[locale].footer}`,description:copy[locale].intro};

test('invisible optimization preserves the exact rendered body for all 68 canonical pages',()=>{
 for(const row of baseline){
  const html=renderSite({lang:row.locale,route:row.route,products,channels,ideas:playIdeas});
  assert.equal(createHash('sha256').update(html).digest('hex'),row.bodyHash,row.url);
 }
});
test('all canonical pages have unique metadata, one H1 and existing image assets with alt',()=>{
 for(const locale of ['en','zh']){
  const titles=new Set(),descriptions=new Set();
  for(const route of getRoutes(products,playIdeas).filter(r=>!routeAliases[r])){
   const info=seoInfo(locale,route,pageFor(locale,route),products,playIdeas);
   assert.ok(info.title&&info.description);
   assert.equal(info.title.match(/BIJOYISM/g)?.length,1);
   assert.ok(!titles.has(info.title),info.url);titles.add(info.title);
   assert.ok(!descriptions.has(info.description),info.url);descriptions.add(info.description);
   assert.equal(info.url,`https://bijoyism.cc/${locale}/${route}${route?'/':''}`);
   assert.equal(info.languages[locale==='zh'?'zh-CN':'en'],info.url);
   assert.ok(fs.existsSync(new URL('../public'+info.image,import.meta.url)));
   const html=renderSite({lang:locale,route,products,channels,ideas:playIdeas});
   assert.equal([...html.matchAll(/<h1\b/g)].length,1);
   for(const [img] of html.matchAll(/<img\b[^>]*>/g))assert.match(img,/\balt="[^"]*"/);
   const graph=structuredGraph(locale,route,pageFor(locale,route),products,playIdeas,channels);
   const ids=graph.map(n=>n['@id']).filter(Boolean);
   assert.equal(ids.length,new Set(ids).size);
   assert.ok(!graph.some(n=>n['@type']==='Offer'||n.review||n.aggregateRating));
   if(locale==='en'&&['','products','about','contact','faq','buying','privacy',...products.map(p=>`products/${p.id}-${p.slug}`),'guides/care','guides/testing','guides/liquid-sensory-tiles'].includes(route))assert.ok(info.description.length<=170);
  }
 }
});
test('sitemap remains data driven and excludes aliases and duplicate input',()=>{
 const routes=getRoutes(products,playIdeas);
 for(const lang of ['en','zh'])assert.deepEqual(sitemapEntries(lang,[...routes,...routes]),sitemapEntries(lang,routes));
});
