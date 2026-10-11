import {renderHomeSchools} from './home-schools.js';
import {renderHeroCarousel} from './hero-carousel.js';
import {valueIcon} from './value-icons.js';
import {languages} from './languages.js';
import {copy} from './copy.js';
import {siteCopy} from './site-copy.js';
import {renderPage,productPath} from './pages.js';
import {renderPlayCards,pickIdeas,playText} from './play-library.js';
export function renderSite({lang,route='',products,channels,ideas,search=''}){
 const c=copy[lang],t=()=>c,pageUrl=path=>`/${lang}/${path}${path?'/':''}`;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const summaries={
 td01:{zh:'在动物与流动色彩中，发现故事灵感。',en:'Explore animals, moving colors, and story ideas.'},
 td02:{zh:'按一按，踩一踩，观察双色流动。',en:'Press, step, and explore two moving colors.'},
 td03:{zh:'探索蓝绿流动，享受安静的游戏时光。',en:'Explore blue and green through quiet play.'}
};
function card(p){
 const amazon=channels?.[p.id]?.amazon;
 const connected=amazon?.status==='connected'&&/^https:\/\//.test(amazon.url||'');
 return `<article class="product"><div class="product-image"><img src="${p.image}" alt="${esc(p.alt[lang])}" loading="lazy" width="1200" height="800"></div><div class="product-content"><h3>${esc(p.name[lang])}</h3><p class="product-summary">${esc(summaries[p.id]?.[lang]||p.headline[lang])}</p><div class="meta">${t().pieces} <span>·</span> ${t().ages}</div><div class="product-actions"><a class="button primary" href="${pageUrl(productPath(p))}">${lang==='en'?'View Details':'产品详情'}</a>${connected?`<a class="button product-amazon" href="${esc(amazon.url)}" data-purchase-platform="amazon" data-purchase-product="${esc(p.id)}" target="_blank" rel="noopener noreferrer">${lang==='en'?'Shop on Amazon':'在 Amazon 购买'} <span aria-hidden="true">↗</span><span class="carousel-status">${lang==='en'?' (opens in a new tab)':'（在新标签页打开）'}</span></a>`:''}</div></div></article>`;
}
 let html=`<header><a class="brand" href="#" aria-label="BIJOYISM home"><img src="/assets/logo-red-v01.svg" alt="BIJOYISM" width="180" height="39"></a><nav id="navigation" aria-label="${c.menu}">${c.nav.map((n,i)=>`<a href="#${['collections','play','details','families','families'][i]}">${n}</a>`).join('')}</nav><div class="header-actions"><div class="languages"><select id="language-select" aria-label="${esc(languages.find(l=>l.code===lang).selectorLabel)}">${languages.map(l=>`<option value="${esc(l.code)}" lang="${esc(l.code)}"${l.code===lang?' selected':''}>${esc(l.label)}</option>`).join('')}</select></div><button class="menu-toggle" aria-controls="navigation" aria-expanded="false">${c.menu}<span>☰</span></button></div></header>
 <main id="main"><section class="hero"><div class="hero-intro wrap"><div><p class="eyebrow">${c.eyebrow}</p><h1>${c.hero}</h1></div><div class="hero-support"><p>${c.intro}</p><div class="actions"><a class="button primary" href="#collections">${c.shop}</a><a class="text-button" href="#play">${c.play}</a></div></div></div>${renderHeroCarousel(lang)}<ul class="ribbon" aria-label="${c.valuesLabel}">${c.ribbon.map((x,i)=>`<li class="value-item value-${i}"><div class="value-icon">${valueIcon(i)}</div><span class="value-title">${x[0]}</span><span class="value-subtitle">${x[1]}</span></li>`).join('')}</ul></section>
 <section id="collections" class="section wrap"><div class="section-heading"><div><p class="eyebrow">${c.collectionTag}</p><h2>${c.collectionTitle}</h2></div><p>${c.collectionIntro}</p></div><div class="products">${products.filter(p=>p.featured && p.status==='live').map(card).join('')}</div></section>
 <section id="play" class="play-section"><div class="wrap play-heading"><p class="eyebrow">${playText[lang].homeEyebrow}</p><h2>${playText[lang].homeTitle}</h2><p>${playText[lang].homeIntro.replace('{count}',String(ideas.filter(i=>i.contentType!=='guide').length))}</p></div><div class="wrap">${renderPlayCards(pickIdeas(ideas,'home'),lang,products)}<div class="page-links"><a class="button primary" href="${pageUrl('play-ideas')}">${playText[lang].more}</a></div></div></section>
 <section id="details" class="details-section"><div class="wrap"><div class="details-heading"><p class="eyebrow">${c.detailTag}</p><h2>${c.detailTitle}</h2><p>${c.detailIntro}</p></div><div class="details-gallery"><figure class="details-scene"><picture><source media="(max-width: 640px)" srcset="/assets/home-care-scene-v02-mobile.webp"><img src="/assets/home-care-scene-v02.webp" alt="${c.detailAlt}" width="1920" height="787" loading="lazy"></picture></figure></div><div class="detail-points">${c.details.map(d=>`<article class="detail-point"><h3>${d[0]}</h3><p>${d[1]}</p></article>`).join('')}</div></div></section>
 ${renderHomeSchools(lang)}
 <section class="faq-section wrap"><h2>${c.faqTitle}</h2><div>${c.faqs.map(f=>`<details><summary>${f[0]}<span>+</span></summary><p>${f[1]}</p></details>`).join('')}</div></section></main>
 <footer><div class="wrap footer-top"><div><img src="/assets/logo-white-v01.svg" alt="BIJOYISM" width="200" height="44"><p>${c.footer}</p></div><div class="footer-links">${c.footerLinks.map((n,i)=>`<button data-info="${i}">${n}</button>`).join('')}</div></div><div class="wrap footer-bottom"><span>${c.copyright}</span></div></footer>`;
 html=html.replace('href="#" aria-label="BIJOYISM home"',`href="${pageUrl('')}" aria-label="BIJOYISM home"`);
 const nav=['products','play-ideas','families','schools','about'];
 html=html.replace(/<nav[\s\S]*?<\/nav>/,`<nav id="navigation" aria-label="${c.menu}">${c.nav.map((n,i)=>`<a href="${pageUrl(nav[i])}"${route===nav[i]||route.startsWith(nav[i]+'/')||nav[i]==='shop'&&route.startsWith('products/')?' aria-current="page"':''}>${n}</a>`).join('')}</nav>`);
 html=html.replace(/<div class="footer-links">[\s\S]*?<\/div>/,`<div class="footer-links">${[['play-ideas',siteCopy[lang].ideas],['about',siteCopy[lang].about],['contact',siteCopy[lang].contact],['products',siteCopy[lang].testing],['faq',siteCopy[lang].faq],['buying',siteCopy[lang].storeTerms],['privacy',siteCopy[lang].privacy]].map(([p,l])=>`<a href="${pageUrl(p)}">${l}</a>`).join('')}</div>`);
 if(!route)html=html.replace(/<ul class="ribbon"[\s\S]*?<\/ul><\/section>/,'</section>');
 if(route){html=html.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main">${renderPage({lang,route,products,channels,ideas,search}).body}</main>`);}
 else{
  html=html.replace('href="#collections"',`href="${pageUrl('products')}"`).replaceAll('href="#play"',`href="${pageUrl('play-ideas')}"`);
  html=html.replace(/<button class="text-button" data-guide="(\d)">([^<]*)<\/button>/g,(_,i,label)=>`<a class="text-button" href="${pageUrl('play-ideas/'+['animal-story-trail','three-tile-layouts','preschool-turn-taking'][i])}">${label}</a>`);
 }
 return html.replaceAll('class="button primary"','class="button primary btn btn-primary"');
}
