import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createInquiryHandler,MAX_BODY_BYTES} from '../src/server/inquiries.mjs';
const env={RESEND_API_KEY:'test-only',INQUIRY_MAIL_ENABLED:'true',INQUIRY_ALLOWED_ORIGINS:'https://bijoyism.cc'};
const payload={inquiryType:'order',organization:'Example school',contactName:'Example contact',email:'customer@example.org',country:'US',collection:'td02',direction:'both',quantity:5,deliveryDate:'',description:'Example artwork request',sampleFirst:true,language:'en',attachments:[]};
function request(data=payload,headers={}){return new Request('https://bijoyism.cc/api/inquiries',{method:'POST',headers:{origin:'https://bijoyism.cc','Content-Type':'application/json','Idempotency-Key':'00000000-0000-4000-8000-000000000001',...headers},body:JSON.stringify(data)});}
function adapter(){let sent=[];const handle=createInquiryHandler({fetchEmail:async(url,options)=>{sent.push({url,...options});return Response.json({id:'mock-only-id'});}});return {handle,sent};}
test('fixed recipient, reply-to and real attachments; user cannot choose recipient',async()=>{
 const {handle,sent}=adapter();const content=Buffer.from('%PDF-1.4\nexample').toString('base64');
 const r=await handle(request({...payload,to:'other@example.org',attachments:[{filename:'reference.pdf',content}]}),env,'client');
 assert.equal(r.status,200);assert.deepEqual(await r.json(),{accepted:true});
 const mail=JSON.parse(sent[0].body);assert.deepEqual(mail.to,['support@bijoyism.cc']);assert.equal(mail.reply_to,payload.email);assert.equal(mail.attachments[0].content,content);assert.ok(mail.text.includes('Example artwork request'));
});
test('same retry has identical provider idempotency key; edited contents differ',async()=>{
 const {handle,sent}=adapter();await handle(request(),env,'client');await handle(request(),env,'client');await handle(request({...payload,description:'Changed'}),env,'client');
 assert.equal(sent[0].headers['Idempotency-Key'],sent[1].headers['Idempotency-Key']);assert.notEqual(sent[0].headers['Idempotency-Key'],sent[2].headers['Idempotency-Key']);
});
test('reject bad email, sub-MOQ, bad dates, unknown product, honeypot, fake attachment',async()=>{
 const {handle,sent}=adapter();let index=0;
 for(const patch of [{email:'bad\r\nBcc: other@example.org'},{quantity:4},{deliveryDate:'2026-02-31'},{collection:'fake'},{website:'spam'},{attachments:[{filename:'ref.pdf',content:Buffer.from('not a PDF').toString('base64')}]}])assert.equal((await handle(request({...payload,...patch}),env,'client'+index++)).status,400);
 assert.equal(sent.length,0);
});
test('sample does not require order quantity',async()=>{const {handle}=adapter();assert.equal((await handle(request({...payload,inquiryType:'sample',quantity:null}),env,'client')).status,200);});
test('disabled or missing mail config never sends; status exposes no credentials',async()=>{
 const {handle,sent}=adapter();assert.equal((await handle(request(),{...env,INQUIRY_MAIL_ENABLED:'false'})).status,503);
 assert.equal((await handle(request(),{...env,RESEND_API_KEY:''})).status,503);
 assert.deepEqual(await (await handle(new Request('https://bijoyism.cc/api/inquiries'),env)).json(),{available:true});assert.equal(sent.length,0);
});
test('cross-origin, oversized and rate-limited requests never reach provider',async()=>{
 const {handle,sent}=adapter();assert.equal((await handle(request(payload,{origin:'https://other.example'}),env)).status,403);
 assert.equal((await handle(request(payload,{'Content-Length':String(MAX_BODY_BYTES+1)}),env)).status,413);
 for(let i=0;i<5;i++)assert.equal((await handle(request(),env,'rate-client')).status,200);
 assert.equal((await handle(request(),env,'rate-client')).status,429);assert.equal(sent.length,5);
});
test('provider failures do not become success or leak provider details',async()=>{
 const handle=createInquiryHandler({fetchEmail:async()=>Response.json({message:'secret-provider-details'},{status:403})});
 const r=await handle(request(),env,'client');assert.equal(r.status,502);assert.deepEqual(await r.json(),{error:'send_failed'});
});
