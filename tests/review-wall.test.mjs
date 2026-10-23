import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderReviewWall} from '../src/site/review-wall.js';
import {renderPage,productPath} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const reviews=read('../src/site/data/review-excerpts.json');
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');

test('ten localized excerpts preserve source IDs, individual stars and disclosure',()=>{
 assert.equal(reviews.length,10);
 assert.equal(new Set(reviews.map(r=>r.sourceId)).size,10);
 for(const lang of ['en','zh']){
  const html=renderReviewWall(lang);
  assert.equal((html.match(/<article /g)||[]).length,10);
  assert.equal((html.match(/<blockquote /g)||[]).length,10);
  assert.equal((html.match(/<time /g)||[]).length,10);
  assert.equal((html.match(new RegExp(lang==='zh'?'亚马逊Vine客户点评':'Amazon Vine','g'))||[]).length,10);
  assert.equal((html.match(/class="review-wall-username"/g)||[]).length,10);
  assert.equal((html.match(/<svg /g)||[]).length,10);
  assert.ok(!html.includes('获赠产品'));
  assert.ok(!html.includes('review-wall-note'));
  assert.ok(!html.includes('<button'));
  assert.ok(!html.includes('Reviewer 01'));
 }
 assert.ok(reviews.some(r=>r.stars===4));
});

test('every English excerpt remains traceable to the internal original when available',t=>{
 const url=new URL('../../../Product/04-feedback/_internal/reviews.jsonl',import.meta.url);
 if(!fs.existsSync(url)){t.skip('Internal review archive is not included in the standalone site checkout');return;}
 const sources=fs.readFileSync(url,'utf8').trim().split('\n').map(JSON.parse);
 for(const r of reviews){
  const source=sources.find(s=>s.review_id===r.sourceId);
  assert.ok(source,r.sourceId);
  assert.equal(r.stars,source.stars);
  assert.equal(r.date,source.date_as_shown);
  assert.equal(r.series,source.series);
  assert.equal(r.freeProduct,source.free_product_disclosed);
  assert.equal(r.username,source.author_display_name);
  for(const part of r.en.replace(/^…/,'').split(' […] '))assert.ok(source.body_original.includes(part),r.sourceId);
 }
});

test('only the two product catalogs end with the review wall, not product details',()=>{
 for(const lang of ['en','zh']){
  const html=renderPage({lang,route:'products',products,channels,ideas:playIdeas}).body;
  assert.equal((html.match(/data-review-wall /g)||[]).length,1);
  assert.ok(html.includes(renderReviewWall(lang)));
  assert.ok(html.endsWith(renderReviewWall(lang)));
  for(const route of ['about','faq',...products.map(productPath)])assert.ok(!renderPage({lang,route,products,channels,ideas:playIdeas}).body.includes('data-review-wall'));
 }
});
