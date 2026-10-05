import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {playIdeas} from '../src/site/play-content.js';
import {filterGames,games,pickIdeas,renderLibrary,renderPlayDetail} from '../src/site/play-library.js';
import {getRoutes} from '../src/site/pages.js';
import {cardAction,stepAction} from '../src/site/play-actions.js';
const products=JSON.parse(fs.readFileSync(new URL('../src/site/data/products.json',import.meta.url)));
test('approved action drawings and complete print content share the same localized source',()=>{
 const sprite=fs.readFileSync(new URL('../public/assets/play-actions.svg',import.meta.url),'utf8');
 for(const idea of playIdeas){
  for(const icon of [cardAction(idea),...idea.ruleSteps.map((_,n)=>stepAction(idea,n))])assert.ok(sprite.includes('id="'+icon+'"'));
  for(const lang of ['en','zh']){
   const html=renderPlayDetail(idea,lang,products,playIdeas),print=html.split('<section class="page-intro')[0];
   assert.ok(print.includes('/assets/logo-red-v01.svg'));
   for(const field of ['title','summary','setup','easier','variation'])assert.ok(print.includes(idea[field][lang]));
   for(const s of idea.ruleSteps)assert.ok(print.includes(s.text[lang]));
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
  const html=renderLibrary(lang,products,playIdeas);assert.equal((html.match(/<select name=/g)||[]).length,3);
  assert.ok(!html.includes('name="mode"')&&!html.includes('name="mood"')&&!html.includes('name="difficulty"'));
  assert.equal(getRoutes(products,playIdeas).length,40);
  const detail=renderPlayDetail(playIdeas.find(i=>i.id==='adventure-trail'),lang,products,playIdeas);
  assert.ok(detail.includes('station-td01')&&detail.includes('station-td02')&&detail.includes('station-td03'));
 }
});
test('wireframe library preserves four mode anchors, all games, starters and shopping path',()=>{
 for(const lang of ['en','zh']){
  const html=renderLibrary(lang,products,playIdeas);
  for(const mode of ['explore','move','reset','mix'])assert.ok(html.includes('id="games-'+mode+'"'));
  assert.equal((html.match(/class="play-card mode-/g)||[]).length,16);
  assert.equal((html.match(/class="library-starters"/g)||[]).length,2);
  assert.ok(html.includes('/'+lang+'/shop/collections/'));
  assert.ok(html.includes('class="library-hero-visual"'));
  const filtered=renderLibrary(lang,products,playIdeas,'?age=5-6&players=2&setting=reading');
  assert.equal((filtered.match(/class="play-card mode-/g)||[]).length,7);
  assert.ok(!filtered.includes('name="mood"'));
 }
});
