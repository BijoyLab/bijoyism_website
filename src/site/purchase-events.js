// Provider-neutral event hook. No network request, cookies or persistent storage.
// Connect an approved analytics provider later; a click is not a purchase.
export function bindPurchaseEvents(signal){
 document.addEventListener('click',event=>{
  const link=event.target.closest('a[data-purchase-platform]');
  if(!link)return;
  const detail={event:'purchase_click',platform:link.dataset.purchasePlatform,productId:link.dataset.purchaseProduct,language:document.documentElement.lang,page:location.pathname,position:link.closest('.purchase-bottom')?'bottom':link.closest('dialog')?'dialog':'product',destination:link.href};
  document.dispatchEvent(new CustomEvent('bijoyism:purchase-click',{detail}));
 },{signal});
}
