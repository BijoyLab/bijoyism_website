const text=(value,max=120)=>typeof value==='string'?value.slice(0,max).replace(/[\r\n\u0000-\u001f]/g,''):'';
export function validatePurchaseEvent(value,products,channels){
 if(!value||value.event!=='purchase_click'||!['amazon','taobao'].includes(value.platform))return null;
 const product=products.find(p=>p.id===value.productId);
 if(!product||!['en','zh','zh-CN'].includes(value.language))return null;
 if(!['home','catalog','product','bottom','dialog'].includes(value.position))return null;
 if(typeof value.page!=='string'||!/^\/(en|zh)\//.test(value.page)||/[?#]/.test(value.page))return null;
 let destination;
 try{destination=new URL(value.destination);}catch{return null;}
 if(destination.protocol!=='https:')return null;
 const channel=channels[product.id]?.[value.platform];
 if(channel?.status!=='connected')return null;
 if(value.platform==='amazon'&&(!['amazon.com','www.amazon.com','amzn.to'].includes(destination.hostname)||(destination.hostname!=='amzn.to'&&!destination.pathname.includes(`/dp/${channel.asin}`))))return null;
 if(value.platform==='taobao'&&destination.hostname!==new URL(channel.url).hostname)return null;
 return {event:'purchase_click',productFamily:product.id.toUpperCase(),platform:value.platform,asin:channel.asin||null,language:value.language,page:text(value.page,240),position:value.position,destination:destination.origin+destination.pathname,source:text(value.source),medium:text(value.medium),campaign:text(value.campaign),attributed:value.attributed===true};
}
