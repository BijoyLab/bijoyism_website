import {siteConfig} from './site-config.js';

const publicHosts=new Set(['bijoyism.cc','www.bijoyism.cc','bijoyism.cn','www.bijoyism.cn']);

// The hosting edge must overwrite X-Forwarded-Proto with the visitor protocol.
// An HTTPS visitor may reach the Node server over HTTP: do not redirect again.
export function httpsRedirectUrl(url,headers){
 const host=(headers.get('host')||url.hostname).split(':')[0].toLowerCase();
 if(!publicHosts.has(host))return null;
 const forwarded=headers.get('x-forwarded-proto')?.split(',')[0].trim().toLowerCase();
 const protocol=forwarded||url.protocol.replace(':','');
 if(protocol!=='http')return null;
 const destination=new URL(siteConfig.origin);
 destination.pathname=host.endsWith('bijoyism.cn')&&url.pathname==='/'?'/zh/':url.pathname;
 destination.search=url.search;
 return destination;
}
