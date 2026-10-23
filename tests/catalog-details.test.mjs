import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderCatalogDetails} from '../src/site/catalog-details.js';
import {renderPage} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');

test('catalog details reuse the homepage scene and four distinct detail cards',()=>{
 for(const lang of ['en','zh']){
  const html=renderCatalogDetails(lang,products);
  assert.equal((html.match(/class="detail-point"/g)||[]).length,4);
  assert.equal((html.match(/<h2>/g)||[]).length,1);
  assert.equal((html.match(/<img /g)||[]).length,1);
  assert.ok(html.includes('/assets/home-care-scene-v02-mobile.webp'));
  assert.ok(html.includes('/assets/home-care-scene-v02.webp'));
  assert.ok(!html.includes('spec-list')&&!html.includes('story-grid')&&!html.includes('class="tip"'));
  assert.ok(!html.includes('Know the tiles before you play.'));
  for(const path of ['liquid-sensory-tiles','care','testing'])assert.ok(html.includes(`href="/${lang}/guides/${path}/"`));
  if(lang==='zh'){
   assert.equal((html.match(/表面防泼溅，可湿布擦拭/g)||[]).length,1);
   assert.ok(!html.includes('冲洗'));
   assert.ok(html.includes('30 cm × 30 cm × 0.6 cm'));
  }else assert.ok(html.includes('11.8 in × 11.8 in × 0.24 in'));
 }
});

test('catalog order keeps specs, details, guides and community reviews together',()=>{
 for(const lang of ['en','zh']){
  const html=renderPage({lang,route:'products',products,channels,ideas:playIdeas}).body;
  const positions=['class="products"','class="wrap catalog-specs"','id="product-facts"','id="care"','data-review-wall'].map(s=>html.indexOf(s));
  assert.ok(positions.every(n=>n>=0));
  assert.deepEqual(positions,[...positions].sort((a,b)=>a-b));
 }
});
