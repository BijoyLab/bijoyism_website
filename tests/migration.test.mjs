import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {renderSite} from '../src/site/site-render.js';
import {getRoutes} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url)));
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');
const reference=read('./reference-content.json');
const hash=html=>crypto.createHash('sha256').update(html.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim()).digest('hex');

test('all 80 pages and both customization forms preserve reference text',()=>{
 assert.equal(getRoutes(products,playIdeas).length,40);
 for(const page of reference){
  const html=renderSite({lang:page.locale,route:page.route,search:page.search||'',products,channels,ideas:playIdeas});
  assert.equal(hash(html),page.textHash,page.locale+'/'+page.route);
  assert.ok(!html.includes('/zh-cn/'));
  for(const [,asset] of html.matchAll(/(?:src|srcset)="(\/assets\/[^" ]+)"/g))assert.ok(fs.existsSync(new URL('../public'+asset,import.meta.url)),asset);
 }
});
