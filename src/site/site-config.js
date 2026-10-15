// Temporary single-domain mode until bijoyism.cn hosting and HTTPS are ready.
export const siteConfig={origin:'https://bijoyism.cc',origins:{en:'https://bijoyism.cc',zh:'https://bijoyism.cc'},supportEmail:'support@bijoyism.cn',reviewedOn:'2026-10-14'};
export const localizedUrl=(lang,route='')=>`${siteConfig.origins[lang]}/${lang}/${route}${route?'/':''}`;
export const languageAlternates=route=>({en:localizedUrl('en',route),'zh-CN':localizedUrl('zh',route),'x-default':localizedUrl('en',route)});
export const hostLocale=host=>String(host||'').split(':')[0].toLowerCase().replace(/^www\./,'')==='bijoyism.cn'?'zh':'en';
export function languageUrl(lang,route='',search='',hash=''){
 const path=`/${lang}/${route}${route?'/':''}${search}${hash}`;
 // Keep previews and tests local; production language switches use canonical domains.
 return typeof window!=='undefined'&&/^((www\.)?bijoyism\.(cc|cn))$/.test(window.location.hostname)?`${siteConfig.origins[lang]}${path}`:path;
}
