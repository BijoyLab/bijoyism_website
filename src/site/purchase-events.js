// First-party, cookie-free click reporting. Purchases require Amazon Attribution.
export function bindPurchaseEvents(signal){
 let enabled=false;
 fetch('/api/purchase-events/',{signal}).then(r=>r.ok?r.json():null).then(value=>{enabled=value?.enabled===true;}).catch(()=>{});
 document.addEventListener('click',event=>{
  const link=event.target instanceof Element?event.target.closest('a[data-purchase-platform]'):null;
  if(!link)return;
  const params=new URLSearchParams(location.search);
  const destination=new URL(link.href);
  let referralHost='';try{referralHost=new URL(document.referrer).hostname;}catch{}
  const detail={event:'purchase_click',platform:link.dataset.purchasePlatform,productId:link.dataset.purchaseProduct,language:document.documentElement.lang,page:location.pathname,position:link.dataset.purchasePosition||(link.closest('.purchase-bottom')?'bottom':link.closest('dialog')?'dialog':'product'),destination:destination.origin+destination.pathname,source:params.get('utm_source')||referralHost||'direct',medium:params.get('utm_medium')||'',campaign:params.get('utm_campaign')||'',attributed:destination.searchParams.has('maas')||destination.searchParams.has('ascsubtag')};
  document.dispatchEvent(new CustomEvent('bijoyism:purchase-click',{detail}));
  if(enabled&&!navigator.globalPrivacyControl){
   const body=JSON.stringify(detail);
   const sent=navigator.sendBeacon?.('/api/purchase-events/',new Blob([body],{type:'application/json'}));
   if(!sent)fetch('/api/purchase-events/',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});
  }
 },{signal});
}
