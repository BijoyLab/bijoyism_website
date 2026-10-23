import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderSite} from '../src/site/site-render.js';
import {getRoutes,renderPage} from '../src/site/pages.js';
import {playIdeas as ideas} from '../src/site/play-content.js';
import {companyFacts} from '../src/site/company-facts.js';
import {structuredGraph} from '../src/site/seo.js';
import {siteConfig} from '../src/site/site-config.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');

test('all page renderers omit internal review dates and company-source notes',()=>{
 for(const lang of ['en','zh'])for(const route of getRoutes(products,ideas)){
  const html=renderSite({lang,route,products,channels,ideas});
  const visible=html.replace(/<[^>]+>/g,' ');
  assert.doesNotMatch(visible,/资料审核|已审核|审核日期|Reviewed\s*:/i,`${lang}/${route}`);
  assert.ok(!html.includes(companyFacts[lang].sourceNote),`${lang}/${route}`);
  assert.ok(!visible.includes(siteConfig.reviewedOn),`${lang}/${route}`);
 }
});

test('removing editorial notes preserves company facts, evidence and structured dates',()=>{
 for(const lang of ['en','zh']){
  const about=renderSite({lang,route:'about',products,channels,ideas});
  assert.ok(about.includes(lang==='zh'?'深圳恒之安科技有限公司':'Shenzhen Hengzhian Technology Co., Ltd.'));
  const page=renderPage({lang,route:'guides/testing',products,channels,ideas});
  assert.ok(page.body.includes('CPCC202602050363E'));
  assert.ok(page.body.includes('2026-04-02'));
  assert.ok(page.body.includes('TD01 / TD02 / TD03'));
  const graph=structuredGraph(lang,'guides/testing',page,products,ideas,channels);
  assert.equal(graph.find(n=>n['@type']==='Article').dateModified,siteConfig.reviewedOn);
 }
});
