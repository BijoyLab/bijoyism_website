export function purchaseDestination(channel,position='product'){
 if(channel?.status!=='connected')return '';
 const tracked=channel.attributionUrls?.[position]||channel.attributionUrls?.default;
 const candidate=tracked||channel.url;
 try{
  const url=new URL(candidate);
  if(url.protocol!=='https:')return '';
  if(channel.market==='US'){
   if(!['amazon.com','www.amazon.com','amzn.to'].includes(url.hostname))return '';
   // Full Amazon links must preserve the owner-provided product identity.
   if(url.hostname!=='amzn.to'&&channel.asin&&!url.pathname.includes(`/dp/${channel.asin}`))return channel.url;
  }
  return url.href;
 }catch{return '';}
}
