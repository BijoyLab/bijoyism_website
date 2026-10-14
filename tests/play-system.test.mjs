import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {playIdeas} from '../src/site/play-content.js';
import {filterGames,games,pickIdeas,renderLibrary,renderPlayDetail} from '../src/site/play-library.js';
import {getRoutes} from '../src/site/pages.js';
import {cardAction,stepAction} from '../src/site/play-actions.js';
const products=JSON.parse(fs.readFileSync(new URL('../src/site/data/products.json',import.meta.url)));
const escapeHtml=value=>value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('approved action drawings and complete print content share the same localized source',()=>{
 const sprite=fs.readFileSync(new URL('../public/assets/play-actions.svg',import.meta.url),'utf8');
 for(const idea of playIdeas){
  for(const icon of [cardAction(idea),...idea.ruleSteps.map((_,n)=>stepAction(idea,n))])assert.ok(sprite.includes('id="'+icon+'"'));
  for(const lang of ['en','zh']){
   const html=renderPlayDetail(idea,lang,products,playIdeas),print=html.split('<section class="page-intro')[0];
   assert.ok(print.includes('/assets/logo-red-v01.svg'));
   for(const field of ['title','summary','setup','easier','variation'])assert.ok(print.includes(escapeHtml(idea[field][lang])));
   for(const s of idea.ruleSteps)assert.ok(print.includes(escapeHtml(s.text[lang])));
   assert.ok(!html.includes('<h1')||html.match(/<h1/g).length===1);
  }
 }
});
test('12 Signature, 2 Starter and 2 guides; all rule text comes from one source',()=>{
 assert.equal(playIdeas.filter(i=>i.contentType==='signature').length,12);
 assert.equal(playIdeas.filter(i=>i.contentType==='starter').length,2);
 assert.equal(games(playIdeas).length,14);
 assert.equal(playIdeas.filter(i=>i.contentType==='guide').length,2);
 for(const i of playIdeas){for(const lang of ['en','zh'])assert.deepEqual(i.steps[lang],i.ruleSteps.map(s=>s.text[lang]));assert.ok(i.requirements.products.every(p=>i.productIds.includes(p.productId)));assert.ok(i.ageMin>=3);}
 assert.equal(playIdeas.filter(i=>i.mode==='mix').length,3);
 assert.ok(playIdeas.filter(i=>i.mode==='mix').every(i=>i.requirements.selection==='all'&&i.productIds.length===3));
 assert.equal(playIdeas.find(i=>i.id==='three-tile-layouts').requirements.selection,'any');
});
test('age ranges overlap, people use ranges, and conditions combine with AND',()=>{
 assert.ok(filterGames(playIdeas,'?age=3-4').some(i=>i.id==='follow-my-path'));
 assert.ok(!filterGames(playIdeas,'?age=7-8').some(i=>i.id==='animal-safari'));
 assert.ok(!filterGames(playIdeas,'?players=solo').some(i=>i.id==='follow-my-path'));
 assert.ok(filterGames(playIdeas,'?players=2').some(i=>i.id==='choose-a-color'));
 assert.ok(filterGames(playIdeas,'?players=group').some(i=>i.id==='quiet-steps'));
 assert.equal(filterGames(playIdeas,'?age=3').length,14);
 assert.equal(filterGames(playIdeas,'?age=3-4&players=group&setting=reading').length,5);
 assert.ok(filterGames(playIdeas,'?setting=reading').every(i=>i.settings.includes('reading')));
 const boundary=[{contentType:'signature',ageMin:7,ageMax:8,playersMin:4,playersMax:6,settings:['classroom']}];
 assert.equal(filterGames(boundary,'?age=3-4&players=solo&setting=home').length,0);
});
test('curated recommendations survive reordered content; guides never enter the library',()=>{
 assert.deepEqual(pickIdeas(playIdeas,'td03').map(i=>i.id),pickIdeas([...playIdeas].reverse(),'td03').map(i=>i.id));
 for(const lang of ['en','zh']){
  const html=renderLibrary(lang,products,playIdeas);assert.equal((html.match(/<select name=/g)||[]).length,4);
  assert.ok(!html.includes('name="mode"')&&!html.includes('name="mood"')&&!html.includes('name="difficulty"'));
  assert.equal(getRoutes(products,playIdeas).length,43);
  const detail=renderPlayDetail(playIdeas.find(i=>i.id==='adventure-trail'),lang,products,playIdeas);
  assert.ok(detail.includes('station-td01')&&detail.includes('station-td02')&&detail.includes('station-td03'));
 }
});
test('independent library keeps all games and guides without collection grouping',()=>{
 for(const lang of ['en','zh']){
  const html=renderLibrary(lang,products,playIdeas);
  assert.equal((html.match(/class="play-card mode-/g)||[]).length,16);
  assert.ok(!html.includes('library-series')&&!html.includes('library-mode-section'));
  assert.ok(html.includes('name="collection"'));
  assert.ok(!html.includes('type="submit"'));
  const filtered=renderLibrary(lang,products,playIdeas,'?age=5-6&players=2&setting=reading');
  assert.equal((filtered.match(/class="play-card mode-/g)||[]).length,7);
 }
});
test('collection filtering separates required combinations from single-collection games',()=>{
 for(const product of products){
  const found=filterGames(playIdeas,'?collection='+product.id);
  assert.ok(found.length>0);
  assert.ok(found.every(i=>i.requirements.selection==='any'&&i.productIds.includes(product.id)));
 }
 const mixed=filterGames(playIdeas,'?collection=mix');
 assert.equal(mixed.length,3);
 assert.ok(mixed.every(i=>i.requirements.selection==='all'));
 assert.equal(filterGames(playIdeas,'?collection=td01&setting=reading').length,1);
 assert.equal(filterGames(playIdeas,'?collection=mix&players=solo&age=3-4').length,2);
});

test('future collection IDs filter without hardcoded SKU names',()=>{
 const future={...playIdeas[0],productIds:['nature-series'],requirements:{...playIdeas[0].requirements,products:[{productId:'nature-series',tiles:'3'}]}};
 assert.deepEqual(filterGames([future],'?collection=nature-series'),[future]);
 const html=renderLibrary('zh',[{id:'nature-series',name:{zh:'自然系列',en:'Nature'}}],[future]);
 assert.ok(html.includes('自然系列'));
 assert.ok(!html.includes('动物探索'));
});
