// Keep URL filters, browser history, language switching and return position in sync.
export function bindPlayInteractions({app,render,signal}){
 const listen=(target,type,callback,options={})=>target.addEventListener(type,callback,{...options,signal});
 const inLibrary=()=>/^\/(en|zh)\/play-ideas\/?$/.test(location.pathname);
 const persist=()=>{if(!inLibrary())return;try{sessionStorage.setItem('bijoyism-play-return',JSON.stringify({search:location.search,hash:location.hash,scroll:scrollY}));}catch{}};
 const update=(search,hash='#play-results')=>{history.pushState(null,'',location.pathname+search+hash);render();persist();};
 listen(app,'change',e=>{if(e.target.matches('[data-play-filters] select')){const name=e.target.name;const params=new URLSearchParams(new FormData(e.target.closest('form')));for(const [key,value] of [...params])if(value==='all')params.delete(key);update(params.size?'?'+params.toString():'');document.querySelector('[data-play-filters] select[name="'+name+'"]').focus({preventScroll:true});}});
 listen(app,'submit',e=>{if(!e.target.matches('[data-play-filters]'))return;e.preventDefault();const params=new URLSearchParams(new FormData(e.target));for(const [key,value] of [...params])if(value==='all')params.delete(key);update(params.size?'?'+params.toString():'');document.querySelector('#play-results')?.focus();});
 listen(app,'click',e=>{const a=e.target.closest('a');if(!a)return;
  if(a.hasAttribute('data-play-filter-link')){if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();const u=new URL(a.href);update(u.search,u.hash);return;}
  if(a.hasAttribute('data-play-link'))persist();
 });
 listen(window,'scroll',persist,{passive:true});
 listen(window,'popstate',()=>{if(inLibrary()){render();restorePlayReturn();}});
 listen(window,'pageshow',()=>{if(inLibrary())restorePlayReturn();});
 let printClosed=[],printing=false;
 listen(window,'beforeprint',()=>{if(printing)return;printing=true;printClosed=[...document.querySelectorAll('.play-variation:not([open])')];printClosed.forEach(d=>d.open=true);});
 listen(window,'afterprint',()=>{printClosed.forEach(d=>d.open=false);printClosed=[];printing=false;});
}
export function restorePlayReturn(){
 let saved;try{saved=JSON.parse(sessionStorage.getItem('bijoyism-play-return')||'null');}catch{}
 document.querySelectorAll('[data-back-play]').forEach(a=>{const base=a.getAttribute('href').split(/[?#]/)[0];if(saved)a.href=base+(saved.search||'')+(saved.hash||'');});
 if(/^\/(en|zh)\/play-ideas\/?$/.test(location.pathname)&&saved&&saved.search===location.search){requestAnimationFrame(()=>scrollTo({top:saved.scroll||0,behavior:'instant'}));}
}
