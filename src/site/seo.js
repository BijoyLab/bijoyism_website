import {siteConfig,localizedUrl,languageAlternates} from './site-config.js';
import {companyIdentity} from './company-facts.js';
import {guideRoutes} from './guides.js';
import {testingEvidence} from './evidence.js';
import {seoOverrides,brandedTitle} from './seo-overrides.js';

export const routeAliases={
 'shop':'products','shop/collections':'products',
 'our-products':'products','our-products/care':'guides/care',
 'our-products/testing':'guides/testing','our-products/liquid-sensory-tiles':'guides/liquid-sensory-tiles',
 'collections/animal-discovery':'products/td01-animal-discovery',
 'collections/color-duos':'products/td02-color-duos','collections/aqua-tones':'products/td03-aqua-tones'
};
export const canonicalRoute=route=>routeAliases[route]||route;
export function seoInfo(locale,route,page,products,ideas){
 const zh=locale==='zh',product=products.find(p=>route===`products/${p.id}-${p.slug}`),idea=ideas.find(i=>route===`play-ideas/${i.id}`);
 const labels={
  products:[zh?'BIJOYISM 液体感官地垫：比较三个系列':'BIJOYISM Liquid Sensory Floor Tiles: Compare 3 Collections',zh?'比较动物探索、缤纷双色和水漾色彩。三个系列均为八片装、适合 3 岁及以上儿童；查看单片尺寸、材质、护理、共同检测依据与购买入口。':'Compare Animal Discovery, Color Duos, and Aqua Tones: eight-tile sets for ages 3+. Explore dimensions, materials, care, shared testing records, and purchase options.'],
  about:[zh?'关于 BIJOYISM：公司与儿童感官玩具':'About BIJOYISM: Company and Sensory Play Products',page.description],
  'shop/compare':[zh?'动物探索、缤纷双色与水漾色彩怎么选？':'Animal Discovery vs Color Duos vs Aqua Tones',zh?'按图案、可见配色和玩法比较 TD01、TD02、TD03，同时核对共同规格、年龄、使用条件与检测证书。':'Compare TD01, TD02, and TD03 by artwork, visible colors, and play ideas, alongside shared specifications, ages, use conditions, and testing records.']
 };
 const relatedProduct=idea?.mode!=='mix'&&products.find(p=>p.id===idea?.productIds[0]);
 const image=product?.shareImages?.[locale]||product?.image||relatedProduct?.shareImages?.[locale]||relatedProduct?.image||'/assets/hero.webp';
 const title=labels[route]?.[0]||(idea?(zh?`${page.title}：儿童室内游戏玩法`:`${page.title}: Indoor Play for Ages ${idea.ageMin}–${idea.ageMax}`):page.title);
 const override=seoOverrides[locale]?.[canonicalRoute(route)];
 return {title:brandedTitle(override?.title||title),description:override?.description||labels[route]?.[1]||page.description,image,url:localizedUrl(locale,canonicalRoute(route)),languages:languageAlternates(canonicalRoute(route))};
}
export function structuredGraph(locale,route,page,products,ideas,channels){
 const info=seoInfo(locale,route,page,products,ideas),origin=siteConfig.origins[locale],identity=companyIdentity;
 const organization={
  '@type':'Organization','@id':`${siteConfig.origin}/#organization`,name:identity.brand,
  legalName:identity.legalName,alternateName:identity.chineseLegalName,foundingDate:identity.foundingDate,
  url:localizedUrl('en'),email:siteConfig.supportEmail,
  address:{'@type':'PostalAddress',streetAddress:identity.streetAddress,addressLocality:identity.addressLocality,addressRegion:identity.addressRegion,addressCountry:identity.addressCountry},areaServed:identity.markets,
  knowsAbout:["children's sensory toys",'liquid sensory floor tiles'],logo:`${siteConfig.origin}/assets/logo-red-v01.svg`
 };
 const pageType=route==='about'?'AboutPage':route==='contact'?'ContactPage':['products','play-ideas'].includes(route)?'CollectionPage':'WebPage';
 const webpage={'@type':pageType,'@id':`${info.url}#webpage`,url:info.url,name:info.title,description:info.description,inLanguage:locale==='zh'?'zh-CN':'en',isPartOf:{'@id':`${origin}/#website`},publisher:{'@id':organization['@id']}};
 const graph=[organization,{'@type':'WebSite','@id':`${origin}/#website`,name:identity.brand,url:localizedUrl('en'),inLanguage:['en','zh-CN'],publisher:{'@id':organization['@id']}},webpage];
 if(route){
  const parent=route.startsWith('products/')||route.startsWith('guides/')?'products':route.startsWith('play-ideas/')?'play-ideas':null;
  const items=[{'@type':'ListItem',position:1,name:locale==='zh'?'首页':'Home',item:localizedUrl(locale)}];
  if(parent)items.push({'@type':'ListItem',position:2,name:parent==='products'?(locale==='zh'?'产品':'Products'):(locale==='zh'?'玩法灵感':'Play Ideas'),item:localizedUrl(locale,parent)});
  items.push({'@type':'ListItem',position:items.length+1,name:info.title,item:info.url});
  graph.push({'@type':'BreadcrumbList','@id':`${info.url}#breadcrumb`,itemListElement:items});
  webpage.breadcrumb={'@id':`${info.url}#breadcrumb`};
 }
 const product=products.find(p=>route===`products/${p.id}-${p.slug}`);
 if(product){
  const asin=channels[product.id]?.amazon?.asin;
  const properties=[{'@type':'PropertyValue',name:'Tiles per set',value:product.pieceCount},{'@type':'PropertyValue',name:'Recommended age',value:`${product.ageMin}+`},{'@type':'PropertyValue',name:'Surface material',value:product.materials.surface},{'@type':'PropertyValue',name:'Backing material',value:product.materials.base},{'@type':'PropertyValue',name:'CPC document',value:testingEvidence.certificate}];
  // ASIN is an external marketplace identifier, never a GTIN or MPN.
  if(asin)properties.push({'@type':'PropertyValue',name:'Amazon US ASIN',value:asin});
  graph.push({'@type':'Product','@id':`${info.url}#product`,name:`BIJOYISM ${product.name[locale]}`,model:product.id.toUpperCase(),...(product.sku?{sku:product.sku}:{}),url:info.url,description:info.description,image:`${origin}${product.image}`,brand:{'@type':'Brand',name:'BIJOYISM'},material:`${product.materials.surface} / ${product.materials.base}`,width:{'@type':'QuantitativeValue',value:product.dimensions.widthIn,unitCode:'INH'},depth:{'@type':'QuantitativeValue',value:product.dimensions.lengthIn,unitCode:'INH'},height:{'@type':'QuantitativeValue',value:product.dimensions.thicknessIn,unitCode:'INH'},additionalProperty:properties,subjectOf:{'@id':`${localizedUrl(locale,'guides/testing')}#article`}});
  webpage.mainEntity={'@id':`${info.url}#product`};
 }
 if(route==='about')webpage.mainEntity={'@id':organization['@id']};
 const idea=ideas.find(i=>route===`play-ideas/${i.id}`);
 if(idea||guideRoutes.includes(route)){
  graph.push({'@type':'Article','@id':`${info.url}#article`,headline:info.title,description:info.description,author:{'@id':organization['@id']},publisher:{'@id':organization['@id']},mainEntityOfPage:{'@id':webpage['@id']},image:`${origin}${info.image}`,...(guideRoutes.includes(route)?{dateModified:siteConfig.reviewedOn}:{}),about:(idea?.productIds||testingEvidence.models.map(m=>m.toLowerCase())).map(id=>{const p=products.find(p=>p.id===id);return {'@id':`${localizedUrl(locale,`products/${p.id}-${p.slug}`)}#product`};})});
 }
 return graph;
}
export function sitemapEntries(locale,routes){
 return [...new Set(routes)].filter(route=>!routeAliases[route]).map(route=>({url:localizedUrl(locale,route),alternates:{languages:languageAlternates(route)},...(guideRoutes.includes(route)||['about','products','shop/compare'].includes(route)?{lastModified:siteConfig.reviewedOn}:{})}));
}
