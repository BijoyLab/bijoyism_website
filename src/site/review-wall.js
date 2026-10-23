import reviews from './data/review-excerpts.json' with {type:'json'};
import {reviewAvatar} from './review-avatar.js';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// One community pool across product pages, not ratings for the current SKU.
// Keep provenance in the curated data; never turn this pool into aggregateRating.
export function renderReviewWall(lang){
 const zh=lang==='zh';
 return `<section class="review-wall page-band" data-review-wall aria-labelledby="review-wall-title"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">${zh?'用户体验':'COMMUNITY EXPERIENCES'}</p><h2 id="review-wall-title">${zh?'用户体验分享':'Little moments. Shared.'}</h2></div></div><div class="review-wall-grid" data-review-list>${reviews.map((r,index)=>`<article class="review-wall-card" data-review-id="${esc(r.sourceId)}"><div class="review-wall-card-top"><div class="review-wall-person"><span class="review-wall-avatar" aria-hidden="true">${reviewAvatar(index)}</span><span class="review-wall-username">${esc(r.username)}</span></div><span class="review-wall-stars" role="img" aria-label="${zh?`评分 ${r.stars} 分，满分 5 分`:`${r.stars} out of 5 stars`}">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</span></div><blockquote lang="${zh?'zh-CN':'en'}">${esc(r[lang])}</blockquote><div class="review-wall-card-bottom"><time datetime="${r.date}">${r.date.replaceAll('-',' / ')}</time>${r.freeProduct?`<span class="review-wall-disclosure">${zh?'亚马逊Vine客户点评':'Amazon Vine'}</span>`:''}</div></article>`).join('')}</div></div></section>`;
}

export function bindReviewWall(root){
 const wall=root.querySelector('[data-review-wall]');
 if(!wall)return ()=>{};
 const list=wall.querySelector('[data-review-list]');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const controller=new AbortController();
 const {signal}=controller;
 let timer,visible=false,hovered=false,focused=false;
 const schedule=()=>{
  clearTimeout(timer);
  if(visible&&!hovered&&!focused&&!motion.matches&&!document.hidden){
   timer=setTimeout(()=>{list.append(list.firstElementChild);schedule();},10000);
  }
 };
 const on=(target,event,callback)=>target.addEventListener(event,callback,{signal});
 wall.dataset.enhanced='true';
 on(wall,'pointerenter',e=>{if(e.pointerType!=='touch'){hovered=true;schedule();}});
 on(wall,'pointerleave',()=>{hovered=false;schedule();});
 on(wall,'focusin',()=>{focused=true;schedule();});
 on(wall,'focusout',e=>{if(!wall.contains(e.relatedTarget)){focused=false;schedule();}});
 on(document,'visibilitychange',schedule);
 on(motion,'change',schedule);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();});
 observer.observe(wall);
 return ()=>{clearTimeout(timer);observer.disconnect();controller.abort();delete wall.dataset.enhanced;};
}
