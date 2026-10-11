const labels = {
 en: {title:'Sensory play in everyday spaces',previous:'Previous image',next:'Next image',image:'Image',of:'of'},
 zh: {title:'不同空间里的感官游戏',previous:'上一张',next:'下一张',image:'图片',of:' / '}
};
const scenes = [
 {desktop:'homepage-carousel-school-desktop-v01.webp',mobile:'hero-mobile.webp',alt:{en:'Children following a sensory-tile path together in a bright indoor playroom.',zh:'孩子们在明亮室内空间一起探索感官地砖路径。'}},
 {desktop:'hero.webp',mobile:'hero-mobile.webp',alt:{en:'Children pressing and stepping on Animal Discovery tiles at home.',zh:'孩子们在家中按压和踩踏动物探索系列地垫。'}},
 {desktop:'homepage-carousel-td02-rearrange-v01.webp',mobile:'homepage-carousel-td02-rearrange-v01.webp',contain:true,width:1200,height:900,alt:{en:'A parent and child rearranging eight Color Duos sensory tiles into a playful path at home.',zh:'家长与孩子在家中将八片 Color Duos 感官地砖重排成活泼路径。'}}
];
export function renderHeroCarousel(lang) {
 const c=labels[lang];
 return `<div class="hero-photo hero-carousel" data-hero-carousel role="region" aria-roledescription="${lang==='en'?'carousel':'轮播图'}" aria-label="${c.title}">
 <div class="hero-carousel-stage">${scenes.map((s,i)=>`<div class="hero-slide${s.contain?' hero-slide-contain':''}" data-hero-slide role="group" aria-roledescription="${lang==='en'?'slide':'幻灯片'}" aria-label="${i+1} / ${scenes.length}"${i?' hidden':''}><picture><source media="(max-width: 640px)" srcset="/assets/${s.mobile}"><img src="/assets/${s.desktop}" alt="${s.alt[lang]}" width="${s.width||1800}" height="${s.height||738}" ${i?'loading="lazy"':'fetchpriority="high"'}></picture></div>`).join('')}</div>
 <div class="hero-carousel-overlay" data-carousel-controls hidden>
 <button type="button" class="hero-carousel-arrow hero-carousel-previous" data-carousel-previous aria-label="${c.previous}">‹</button>
 <button type="button" class="hero-carousel-arrow hero-carousel-next" data-carousel-next aria-label="${c.next}">›</button>
 <div class="hero-carousel-dots" role="group" aria-label="${lang==='en'?'Choose image':'选择轮播图片'}">${scenes.map((_,i)=>`<button type="button" class="hero-carousel-dot" data-carousel-dot="${i}" aria-label="${lang==='en'?`Show image ${i+1} of ${scenes.length}`:`查看第 ${i+1} 张，共 ${scenes.length} 张`}" aria-current="${i===0?'true':'false'}"><span></span></button>`).join('')}</div>
 </div><span class="carousel-status" data-carousel-status aria-live="polite" aria-atomic="true"></span></div>`;
}
export function bindHeroCarousel(app,lang) {
 const root=app.querySelector('[data-hero-carousel]');
 if(!root)return ()=>{};
 const c=labels[lang], slides=[...root.querySelectorAll('[data-hero-slide]')];
 const controller=new AbortController(),{signal}=controller, motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const listen=(target,event,handler)=>target.addEventListener(event,handler,{signal});
 let index=0,timer;
 const dots=[...root.querySelectorAll('[data-carousel-dot]')];
 const schedule=()=>{
  window.clearTimeout(timer);
  if(!motion.matches&&!document.hidden)timer=window.setTimeout(()=>show(index+1),5000);
 };
 const show=(next,announce=false)=>{
  index=(next+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.hidden=i!==index);
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
  if(announce)root.querySelector('[data-carousel-status]').textContent=`${c.image} ${index+1} ${c.of} ${slides.length}`;
  schedule();
 };
 listen(root,'click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-carousel-dot'))show(Number(button.dataset.carouselDot),true);
  else if(button.hasAttribute('data-carousel-next'))show(index+1,true);
  else if(button.hasAttribute('data-carousel-previous'))show(index-1,true);
 });
 listen(root,'keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1),true);
 });
 let touchStart;
 listen(root,'touchstart',event=>{const touch=event.touches[0];touchStart={x:touch.clientX,y:touch.clientY};});
 listen(root,'touchend',event=>{if(!touchStart)return;const touch=event.changedTouches[0],dx=touch.clientX-touchStart.x,dy=touch.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1),true);});
 listen(document,'visibilitychange',schedule);
 listen(motion,'change',schedule);
 root.querySelector('[data-carousel-controls]').hidden=false;
 schedule();
 return ()=>{controller.abort();window.clearTimeout(timer);};
}
