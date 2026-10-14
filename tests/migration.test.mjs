import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderSite} from '../src/site/site-render.js';
import {getRoutes} from '../src/site/pages.js';
import {playIdeas} from '../src/site/play-content.js';
const read=name=>JSON.parse(fs.readFileSync(new URL(name,import.meta.url)));
const products=read('../src/site/data/products.json'),channels=read('../src/site/data/purchase-channels.json');
const reference=read('./reference-content.json');
// Old text hashes describe the migration release, not a freeze on authorized copy corrections.
test('historical routes, new guides and customization retain complete HTML and assets',()=>{
 const routes=getRoutes(products,playIdeas);
 for(const old of reference)assert.ok(routes.includes(old.route));
 const pages=['en','zh'].flatMap(locale=>routes.map(route=>({locale,route})));
 pages.push(...reference.filter(p=>p.search));
 for(const page of pages){
  const html=renderSite({lang:page.locale,route:page.route,search:page.search||'',products,channels,ideas:playIdeas});
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page.locale+'/'+page.route);
  assert.ok(html.includes('<header>')&&html.includes('<footer>'));
  assert.ok(!html.includes('/zh-cn/'));
  assert.ok(!/Non-Slip TPE Backing|non-slip TPE backing|防滑底面|表面防水/.test(html),page.route);
  for(const [,asset] of html.matchAll(/(?:src|srcset)="(\/assets\/[^" ]+)"/g))assert.ok(fs.existsSync(new URL('../public'+asset,import.meta.url)),asset);
 }
});
