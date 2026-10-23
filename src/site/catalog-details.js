import {copy} from './copy.js';

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Only used by the catalog. Reuse the homepage layout without changing its copy.
export function renderCatalogDetails(lang,products){
 const zh=lang==='zh',h=copy[lang],p=products[0];
 const d=p.dimensions;
 const size=[d.lengthIn,d.widthIn,d.thicknessIn].map(n=>zh?`${Number((n*2.54).toFixed(1))} cm`:`${n} in`).join(' × ');
 const specs=zh?[`每套 ${p.pieceCount} 片`,`${p.ageMin} 岁及以上`,`单片尺寸 ${size}`]:[`${p.pieceCount} tiles per set`,`Ages ${p.ageMin}+`,`Per tile: ${size}`];
 const points=zh?[
  ['圆润边缘','地垫外周采用圆润边缘设计。'],
  ['细密磨砂表面','透明 PVC 表面呈细密磨砂质感。'],
  ['TPE 底面','使用时将带纹理的 TPE 底面朝下摆放。'],
  ['清洁与收纳','表面防泼溅，可湿布擦拭。干燥后平放收纳。']
 ]:[
  ['Smooth, Rounded Edges','The tile perimeter has smooth, rounded edges.'],
  ['Fine Matte Surface','The transparent PVC surface has a fine matte finish.'],
  ['Textured TPE Backing','Place the textured TPE side down during use.'],
  ['Easy Care & Storage','The surface is splash-resistant. Wipe with a damp cloth, let dry, and store flat.']
 ];
 const links=[['guides/liquid-sensory-tiles',zh?'产品指南':'Product guide'],['guides/care',zh?'护理指南':'Care guide'],['guides/testing',zh?'检测依据':'Testing evidence']];
 return `<div data-catalog-details><section class="wrap catalog-specs" aria-label="${zh?'当前三个系列共用规格':'Specifications shared by the three current collections'}"><ul>${specs.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></section><section id="product-facts" class="details-section"><div class="wrap"><div class="details-heading"><p class="eyebrow">${h.detailTag}</p><h2>${h.detailTitle}</h2><p>${zh?'从圆润边缘、磨砂表面到 TPE 底面，看看日常使用中的细节。':'A closer look at rounded edges, a matte surface, and textured TPE backing for everyday play.'}</p></div><div class="details-gallery"><figure class="details-scene"><picture><source media="(max-width: 640px)" srcset="/assets/home-care-scene-v02-mobile.webp"><img src="/assets/home-care-scene-v02.webp" alt="${esc(h.detailAlt)}" width="1920" height="787" loading="lazy"></picture></figure></div><div class="detail-points">${points.map(([title,body])=>`<article class="detail-point"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></div></section><section id="care" class="wrap catalog-guide-links"><p class="meta">${zh?`${p.ageMin} 岁及以上 · 室内平坦地面 · 成人监护`:`Ages ${p.ageMin}+ · Flat indoor floor · Adult supervision`}</p><div class="page-links" role="group" aria-label="${zh?'进一步了解产品':'Explore product information'}">${links.map(([path,label])=>`<a${path==='guides/testing'?' id="testing"':''} class="text-button" href="/${lang}/${path}/">${label}</a>`).join('')}</div></section></div>`;
}
