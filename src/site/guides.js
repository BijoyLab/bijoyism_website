import {knowledge} from './knowledge.js';
import {testingEvidence,testingSummary} from './evidence.js';
import {siteConfig} from './site-config.js';

export const guideRoutes=['guides/liquid-sensory-tiles','guides/care','guides/testing'];
export function guideContent(lang,route){
 const zh=lang==='zh',k=knowledge[lang];
 if(route==='guides/liquid-sensory-tiles')return {
  title:zh?'液体感官地垫是什么，三个系列怎么选？':'What Are Liquid Sensory Floor Tiles?',
  intro:k.categoryIntro,
  sections:[...k.categorySections,
   [zh?'三个系列有哪些共同规格？':'What specifications do the collections share?',zh?'TD01、TD02、TD03 均为八片装，单片尺寸为 11.8 in × 11.8 in × 0.24 in (30 cm × 30 cm × 0.6 cm)，采用透明 PVC 表面和 TPE 底面。单片尺寸不等于摆放后的整套占地。':'Each TD01, TD02, and TD03 set contains eight tiles. Each tile measures 11.8 in × 11.8 in × 0.24 in (30 cm × 30 cm × 0.6 cm), with a transparent PVC surface and TPE backing. Individual tile dimensions are not the footprint of a laid-out set.'],
   [zh?'可以把它当作治疗产品吗？':'Is this a therapeutic product?',zh?'产品用于教育游戏和感官探索，不用于疾病诊断或康复治疗，也不承诺特定成长、发育或健康结果。':'The tiles are for play and sensory exploration, not disease diagnosis or rehabilitation treatment. No specific developmental or health outcome is promised.']],
  links:[['shop/compare',zh?'比较三个系列':'Compare the three collections'],['guides/care',zh?'查看清洁与收纳':'Read care and storage guidance'],['guides/testing',zh?'查看检测依据':'Read testing information']]
 };
 if(route==='guides/care')return {
  title:zh?'液体感官地垫如何清洁、检查和收纳？':'How to Clean and Store Liquid Sensory Tiles',
  intro:zh?'BIJOYISM TD01、TD02、TD03 液体感官地垫表面防泼溅，可冲洗或用柔软湿布擦拭。请勿浸泡，也不要让地垫长时间接触水。清洁后擦干或在阴凉处晾干，再整齐叠放收纳。使用前检查是否损坏；发现损坏时停止使用。请在成人监护下，于室内干燥、平整的地面使用。':'BIJOYISM TD01, TD02, and TD03 liquid sensory tiles have splash-resistant surfaces that can be rinsed or wiped with a soft, damp cloth. Do not submerge the tiles or leave them in prolonged contact with water. Wipe them dry or air-dry them in a cool place, then stack them neatly for storage. Check before play and stop using a damaged tile. Use indoors on a dry, level floor with adult supervision.',
  steps:zh?['请孩子离开游戏区域，再检查每片地垫是否损坏。','表面防泼溅，可冲洗或用柔软湿布擦拭；不要浸泡地垫。','擦干或放在阴凉处晾干，干燥后整齐叠放收纳。','下次游戏前重新检查，纹理面朝下，单层平放、彼此不叠压。']:['Ask children to leave the play area, then check each tile for damage.','Rinse the splash-resistant surface briefly or wipe it with a soft, damp cloth; do not submerge the tile.','Wipe dry or air-dry in a cool place, then stack the tiles neatly once dry.','Check again before play. Place the textured side down in a single layer without overlaps.'],
  sections:[...k.careFaq],
  links:[['products',zh?'查看产品规格':'View product specifications'],['guides/testing',zh?'查看检测依据':'Read testing information'],['contact',zh?'联系产品支持':'Contact product support']]
 };
 return {
  title:zh?'TD01、TD02、TD03 的检测与证书依据':'Testing and CPC for TD01, TD02, and TD03',intro:testingSummary[lang],
  table:{caption:zh?'三个当前型号的共同检测记录':'Shared testing records for the three current models',rows:[
   [zh?'列明型号':'Listed models',testingEvidence.models.join(' / ')],
   [zh?'第三方测试报告编号':'Third-party test report',testingEvidence.report],
   [zh?'儿童产品证书编号':'Children’s Product Certificate',testingEvidence.certificate],
   [zh?'签发日期':'Issue date',testingEvidence.issuedOn],
   [zh?'标准与要求':'Standards and requirements',testingEvidence.standards.join(' / ')],
   [zh?'CPC 所列美国进口商':'US importer listed on the CPC',testingEvidence.importer]]},
  sections:[
   [zh?'报告包括哪些项目？':'Which test items are recorded?',zh?'报告列明 ASTM F963-23 的物理与机械性能、阻燃、总铅、可迁移金属、邻苯二甲酸盐，以及相关 CPSIA/CPSC 项目；文件适用项目记录为 PASS。':'The report records applicable ASTM F963-23 physical and mechanical, flammability, total lead, soluble metals and phthalates items, together with related CPSIA/CPSC requirements. Applicable items are recorded as PASS.'],
   [zh?'如何了解适用资料？':'How can I request the applicable information?',zh?`请提供系列或型号名称，并联系 ${siteConfig.supportEmail}。本页提供文件摘要，未提供公开原件下载。`:`Contact ${siteConfig.supportEmail} with the collection or model name. This page provides a document summary; original files are not publicly downloadable here.`],
   [zh?'这份说明的适用范围是什么？':'What is the scope of this information?',zh?'此记录适用于所列三个当前型号及文件列明项目，不自动覆盖未来型号、变更后的产品或其他性能。CPC 不代表 ASTM 签发认证；本页也不声明防滑等级、承重数值或治疗效果。':'This record covers the three listed current models and applicable document items, not automatically future models, modified products, or other performance. A CPC is not certification issued by ASTM. No slip-resistance rating, load limit, or therapeutic effect is claimed here.']],
  links:[['products',zh?'查看三系列规格':'View collection specifications'],['guides/care',zh?'查看使用与护理':'Read use and care guidance'],['about',zh?'了解 BIJOYISM 公司':'About the company']]
 };
}
export function renderGuide(lang,route){
 const data=guideContent(lang,route),zh=lang==='zh';
 const url=p=>`/${lang}/${p}/`;
 const table=data.table?`<div class="table-scroll"><table><caption>${data.table.caption}</caption><tbody>${data.table.rows.map(([a,b])=>`<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table></div>`:'';
 const body=`<section class="page-intro wrap"><p class="breadcrumbs"><a href="/${lang}/">${zh?'首页':'Home'}</a> / <a href="${url('products')}">${zh?'产品':'Products'}</a></p><p class="eyebrow">BIJOYISM</p><h1>${data.title}</h1><p class="page-lead">${data.intro}</p></section><article class="wrap page-section narrow">${table}${data.steps?`<h2>${zh?'日常护理步骤':'Everyday care steps'}</h2><ol class="care-list">${data.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`:''}${data.sections.map(([q,a])=>`<section><h2>${q}</h2><p>${a}</p></section>`).join('')}<p class="meta">${zh?'资料审核':'Reviewed'}: <time datetime="${siteConfig.reviewedOn}">${siteConfig.reviewedOn}</time> · BIJOYISM</p><div class="page-links">${data.links.map(([p,label])=>`<a class="text-button" href="${url(p)}">${label}</a>`).join('')}</div></article>`;
 return {title:data.title,description:data.intro,body};
}
