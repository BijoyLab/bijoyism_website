// HTTP-only mail adapter, usable from Node or an edge/serverless request handler.
// Credentials stay in server environment variables, never in dist/.
export const RECIPIENT='support@bijoyism.cc';
export const MAX_BODY_BYTES=22*1024*1024;
const reply=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
const email=/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const collections={td01:'Animal Discovery',td02:'Color Duos',td03:'Aqua Tones'};
export function validateInquiry(d){
 if(!d||typeof d!=='object'||Array.isArray(d))throw Error('invalid');
 const clean={};
 for(const [key,max] of Object.entries({organization:120,contactName:100,email:254,country:100,description:3000})){
  if(typeof d[key]!=='string'||!d[key].trim()||d[key].length>max)throw Error('invalid');
  clean[key]=d[key].trim();
 }
 if(!email.test(clean.email)||!['order','sample'].includes(d.inquiryType)||!collections[d.collection]||!['artwork','colors','both'].includes(d.direction))throw Error('invalid');
 clean.inquiryType=d.inquiryType;clean.collection=d.collection;clean.direction=d.direction;
 if(d.inquiryType==='order'&&(!Number.isSafeInteger(d.quantity)||d.quantity<5||d.quantity>100000))throw Error('invalid');
 clean.quantity=d.inquiryType==='order'?d.quantity:null;
 if(d.deliveryDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.deliveryDate)||new Date(d.deliveryDate).toISOString().slice(0,10)!==d.deliveryDate))throw Error('invalid');
 clean.deliveryDate=d.deliveryDate||'';clean.sampleFirst=d.sampleFirst===true;clean.language=d.language==='zh'?'zh':'en';
 const files=d.attachments||[];if(!Array.isArray(files)||files.length>3)throw Error('invalid');
 clean.attachments=files.map(file=>{
  if(!file||typeof file.filename!=='string'||file.filename.length>180||/[\r\n\/\\]/.test(file.filename)||typeof file.content!=='string'||file.content.length>7*1024*1024||! /^[A-Za-z0-9+/]*={0,2}$/.test(file.content))throw Error('invalid');
  let decoded;try{decoded=atob(file.content);}catch{throw Error('invalid');}
  if(!decoded.length||decoded.length>5*1024*1024)throw Error('invalid');
  const pdf=/\.pdf$/i.test(file.filename)&&decoded.startsWith('%PDF-');
  const png=/\.png$/i.test(file.filename)&&decoded.slice(0,8)==='\x89PNG\r\n\x1a\n';
  const jpg=/\.jpe?g$/i.test(file.filename)&&decoded.charCodeAt(0)===255&&decoded.charCodeAt(1)===216&&decoded.charCodeAt(2)===255;
  if(!pdf&&!png&&!jpg)throw Error('invalid');
  return {filename:file.filename,content:file.content};
 });
 return clean;
}
export function buildEmail(d,from){
 const rows=[['Inquiry type',d.inquiryType],['Organization',d.organization],['Contact',d.contactName],['Reply email',d.email],['Country / region',d.country],['Collection',`${d.collection.toUpperCase()} / ${collections[d.collection]}`],['Customization',d.direction],['Quantity (sets)',d.quantity??'Sample inquiry'],['Desired delivery date',d.deliveryDate||'Not specified'],['Sample first',d.sampleFirst||d.inquiryType==='sample'?'Yes':'No'],['Language',d.language],['Description',d.description]];
 return {from,to:[RECIPIENT],reply_to:d.email,subject:`BIJOYISM ${d.inquiryType==='sample'?'sample':'custom order'} inquiry · ${d.collection.toUpperCase()}`,text:rows.map(([label,value])=>`${label}: ${value}`).join('\n\n'),...(d.attachments.length?{attachments:d.attachments}:{})};
}
export function createInquiryHandler({fetchEmail=fetch,now=()=>Date.now()}={}){
 // Bounded per-process limiter. Public deployment must also apply gateway limits.
 const attempts=new Map();
 return async function handle(request,env={},clientKey='unknown'){
  const configured=!!env.RESEND_API_KEY&&env.INQUIRY_MAIL_ENABLED==='true';
  if(request.method==='GET')return reply(200,{available:configured});
  if(request.method!=='POST')return reply(405,{error:'method_not_allowed'});
  const allowed=new Set((env.INQUIRY_ALLOWED_ORIGINS||'https://bijoyism.cc').split(',').map(s=>s.trim()));
  if(!allowed.has(request.headers.get('origin')))return reply(403,{error:'origin_not_allowed'});
  if(!configured)return reply(503,{error:'not_configured'});
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'invalid_content_type'});
  const declared=Number(request.headers.get('content-length'));if(declared>MAX_BODY_BYTES)return reply(413,{error:'too_large'});
  const timestamp=now();
  for(const [key,value] of attempts)if(value.until<=timestamp)attempts.delete(key);
  const bucket=attempts.get(clientKey)||{count:0,until:timestamp+3600000};
  if(bucket.count>=5||attempts.size>=10000&&!attempts.has(clientKey))return reply(429,{error:'rate_limited'});
  bucket.count++;attempts.set(clientKey,bucket);
  let raw='';try{
   const reader=request.body?.getReader();if(!reader)return reply(400,{error:'invalid'});
   const decoder=new TextDecoder();let bytes=0;
   while(true){const chunk=await reader.read();if(chunk.done)break;bytes+=chunk.value.byteLength;if(bytes>MAX_BODY_BYTES){await reader.cancel();return reply(413,{error:'too_large'});}raw+=decoder.decode(chunk.value,{stream:true});}raw+=decoder.decode();
  }catch{return reply(400,{error:'invalid'});}
  let data;try{const parsed=JSON.parse(raw);if(parsed.website)return reply(400,{error:'invalid'});data=validateInquiry(parsed);}catch{return reply(400,{error:'invalid'});}
  const token=request.headers.get('idempotency-key');
  if(!token||! /^[a-f0-9-]{36}$/i.test(token))return reply(400,{error:'invalid'});
  // Bind retries to exact validated contents so edits do not reuse a provider key.
  const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(data)));
  const digest=Array.from(new Uint8Array(hash),x=>x.toString(16).padStart(2,'0')).join('');
  try{
   const response=await fetchEmail('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`inquiry/${token}/${digest}`},body:JSON.stringify(buildEmail(data,env.INQUIRY_MAIL_FROM||'BIJOYISM <support@bijoyism.cc>')),signal:AbortSignal.timeout(20000)});
   if(!response.ok)return reply(502,{error:'send_failed'});
   const result=await response.json();if(typeof result.id!=='string'||!result.id)return reply(502,{error:'send_failed'});
   return reply(200,{accepted:true});
  }catch{return reply(502,{error:'send_failed'});}
 };
}
