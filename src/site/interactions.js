import {renderSite} from './site-render.js';
import {bindPurchaseEvents} from './purchase-events.js';
import {languages} from './languages.js';
import {copy} from './copy.js';
import {renderPage,productPath} from './pages.js';
import {siteCopy} from './site-copy.js';
import {bindInquiryForm,saveInquiryDraft} from './inquiry-form.js';
import {bindPlayInteractions,restorePlayReturn} from './play-interactions.js';
import {pickIdeas,renderPlayCards} from './play-library.js';
import products from './data/products.json';
import channels from './data/purchase-channels.json';
import {playIdeas as ideas} from './play-content.js';

export function mountSite(app, {lang, route}) {
const controller = new AbortController();
const {signal} = controller;
const listen = (target, type, callback, options = {}) => target.addEventListener(type, callback, {...options, signal});
const pageUrl=path=>`/${lang}/${path}${path?'/':''}`;
let space='all', invitation='all', modalState=null;
const dialog=document.querySelector('#modal');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=()=>copy[lang];
function render(){
 app.innerHTML=renderSite({lang,route,products,channels,ideas,search:location.search,space,invitation});
 document.querySelector('.brand').href=pageUrl('');
 document.querySelectorAll('nav a').forEach((a,i)=>{const path=['products','play-ideas','families','schools','about'][i];a.href=pageUrl(path);if(route===path||route.startsWith(path+'/'))a.setAttribute('aria-current','page');});
 document.querySelector('.footer-links').innerHTML=[['play-ideas',siteCopy[lang].ideas],['about',siteCopy[lang].about],['contact',siteCopy[lang].contact],['products',siteCopy[lang].testing],['faq',siteCopy[lang].faq],['buying',siteCopy[lang].storeTerms],['privacy',siteCopy[lang].privacy]].map(([path,label])=>`<a href="${pageUrl(path)}">${label}</a>`).join('');
 if(route){const page=renderPage({lang,route,products,channels,ideas,search:location.search});document.title=page.title+' | BIJOYISM';document.querySelector('meta[name="description"]').content=page.description;}
 else {renderMatches();document.querySelector('#space').onchange=e=>{space=e.target.value;renderMatches();};document.querySelector('#invitation').onchange=e=>{invitation=e.target.value;renderMatches();};}
 try {const open=JSON.parse(sessionStorage.getItem('bijoyism-faq-'+route)||'[]');document.querySelectorAll('details').forEach((d,i)=>d.open=open.includes(i));}catch{}
 document.querySelectorAll('.hero .actions a').forEach((a,i)=>a.href=pageUrl(i?'play-ideas':'products'));
 bindInquiryForm(lang, signal);
 restorePlayReturn();
 if(modalState) showModal(modalState);
 app.dataset.ready='true';
}
function renderMatches(){const c=t();let found=products.filter(p=>(space==='all'||p.settings.includes(space))&&(invitation==='all'||p.activities.includes(invitation)));document.querySelector('#matches').innerHTML=`<p class="meta">${c.match} (${found.length})</p>${found.length?found.map(p=>`<button class="match" data-product="${p.id}"><img src="${p.image}" alt="" width="72" height="48"><span>${esc(p.name[lang])}<small>${esc(p.headline[lang])}</small></span></button>`).join(''):`<p>${lang==='en'?'No collection matches both choices. Try another invitation or space.':'暂时没有同时匹配的系列，请更换空间或玩法。'}</p><button class="text-button" data-reset>${lang==='en'?'Show all collections':'查看全部系列'}</button>`}`;const matchingIds=new Set(found.map(p=>p.id));const examples=pickIdeas(ideas,'home').filter(i=>i.mode!=='mix'&&i.productIds.some(id=>matchingIds.has(id)));document.querySelector('#matches').insertAdjacentHTML('beforeend',renderPlayCards(examples,lang));}
function showModal(state){modalState=state;const c=t();let body='';
 if(state.type==='product'){const p=products.find(p=>p.id===state.id);body=`<p class="eyebrow">${c.modalExplore}</p><h2 id="modal-title">${esc(p.name[lang])}</h2><img class="modal-image" src="${p.image}" alt="${esc(p.alt[lang])}"><p>${esc(p.description[lang])}</p><p class="meta">${c.specs}</p><p class="meta">${lang==='en'?'Per tile':'单片长 × 宽 × 厚'}: ${p.dimensions.lengthIn} in × ${p.dimensions.widthIn} in × ${p.dimensions.thicknessIn} in (30 cm × 30 cm × 0.6 cm)</p><h3>${c.buy}</h3><p>${c.buyIntro}</p><div class="channel-grid">${['amazon','taobao'].filter(k=>channels[p.id][k]?.status==='connected'&&channels[p.id][k]?.url).map(k=>{const ch=channels[p.id][k],name=k==='amazon'?'Amazon':'淘宝 / Taobao';return ch.status==='connected'&&ch.url&&/^https:\/\//.test(ch.url)?`<a class="channel" data-purchase-platform="${k}" data-purchase-product="${p.id}" href="${esc(ch.url)}" target="_blank" rel="noopener noreferrer">${name}</a>`:`<div class="channel pending">${name}<small>${c.pending}</small></div>`;}).join('')}</div><p class="meta">${c.channelNote}</p><p class="meta">${c.more}</p>`;}
 else if(state.type==='guide'){const i=state.id;body=`<p class="eyebrow">${c.guideTag}</p><h2 id="modal-title">${c.activities[i][0]}</h2><ol class="guide-steps">${c.guides[i].map(s=>`<li>${s}</li>`).join('')}</ol><p class="meta">${c.guideSafety}</p><button class="button primary" data-guide-products>${c.shop}</button>`;}
 else {const titles=[c.infoTitle,c.contactTitle,c.testTitle],bodies=[c.infoBody,c.contactBody,c.testBody];body=`<h2 id="modal-title">${titles[state.id]}</h2><p>${bodies[state.id]}</p>`;}
 document.querySelector('#modal-content').innerHTML=body;document.querySelector('.close').setAttribute('aria-label',c.close);if(!dialog.open)dialog.showModal();
}
listen(app,'change',e=>{
 if(e.target.id!=='language-select')return;
 const target=e.target.value;
 if(target===lang||!languages.some(l=>l.code===target))return;
 saveInquiryDraft();
 try{localStorage.setItem('bijoyism-language',target);sessionStorage.setItem('bijoyism-faq-'+route,JSON.stringify([...document.querySelectorAll('details')].map((d,i)=>d.open?i:-1).filter(i=>i>=0)));}catch{}
 // Full document navigation keeps legacy form drafts and independent DOM controllers scoped to one page.
 // eslint-disable-next-line @next/next/no-location-assign-relative-destination
 location.assign(`/${target}/${route}${route?'/':''}${location.search}${location.hash}`);
});
listen(app,'click',e=>{const el=e.target.closest('button,a');if(!el)return;

 if(el.dataset.galleryIndex!==undefined){const p=products.find(p=>productPath(p)===route);const selected=p?.gallery?.[Number(el.dataset.galleryIndex)];if(!selected)return;const img=document.querySelector('[data-gallery-main]');img.src=selected.image;img.alt=selected.alt[lang];document.querySelector('.gallery-caption').textContent=selected.label[lang];document.querySelectorAll('[data-gallery-index]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));return;}
 if(el.dataset.product){const p=products.find(p=>p.id===el.dataset.product);location.assign(pageUrl(productPath(p)));}
 if(el.dataset.guide!==undefined)location.assign(pageUrl('play-ideas/'+['animal-story-trail','three-tile-layouts','preschool-turn-taking'][Number(el.dataset.guide)]));
 if(el.hasAttribute('data-reset')){space=invitation='all';render();}
 if(el.dataset.unit){const p=products.find(p=>productPath(p)===route),d=p.dimensions,values=[d.lengthIn,d.widthIn,d.thicknessIn];document.querySelectorAll('[data-dimensions]').forEach(n=>n.textContent=values.map(n=>n+' in').join(' × ')+(el.dataset.unit==='dual'?` (${values.map(n=>Number((n*2.54).toFixed(1))+' cm').join(' × ')})`:''));document.querySelectorAll('[data-unit]').forEach(b=>b.setAttribute('aria-pressed',b===el));}
 if(el.hasAttribute('data-print'))window.print();
 if(el.hasAttribute('data-clear-language')){try{localStorage.removeItem('bijoyism-language');}catch{}document.querySelector('#privacy-status').textContent=siteCopy[lang].cleared;}
 if(el.classList.contains('menu-toggle')){const expanded=el.getAttribute('aria-expanded')==='true';el.setAttribute('aria-expanded',!expanded);document.querySelector('#navigation').classList.toggle('open',!expanded);}
});
dialog.querySelector('.close').onclick=()=>dialog.close();listen(dialog,'close',()=>modalState=null);listen(dialog,'click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}if(e.target.closest('[data-guide-products]')){dialog.close();location.hash='collections';}});
bindPurchaseEvents(signal);
bindPlayInteractions({app,render,signal});
render();
return () => { controller.abort(); dialog.querySelector('.close').onclick=null; };
}
