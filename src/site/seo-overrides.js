// Metadata only: do not import these strings into the visible page renderer.
// Canonical and language URLs remain owned by site-config.js.
export const seoOverrides = {
 en: {
  '': {title:'Sensory Floor Tiles for Kids',description:'Discover BIJOYISM sensory floor tiles for kids ages 3+. Explore liquid color movement, indoor play ideas, and collections for homes and classrooms.'},
  products:{title:'Liquid Sensory Floor Tiles for Kids',description:'Explore BIJOYISM Animal Discovery, Color Duos, and Aqua Tones liquid sensory floor tiles. Compare eight-piece sets, dimensions, materials, and play ideas.'},
  'products/td01-animal-discovery':{title:'Animal Liquid Sensory Tiles for Kids',description:'Explore BIJOYISM Animal Discovery liquid sensory tiles with colorful animal scenes for stepping, pressing, visual exploration, and creative indoor play.'},
  'products/td02-color-duos':{title:'Color Liquid Floor Tiles for Sensory Play',description:'Discover BIJOYISM Color Duos liquid floor tiles with moving colors for stepping, pressing, and visual sensory play. An eight-piece set for kids ages 3+.'},
  'products/td03-aqua-tones':{title:'Blue-Green Sensory Floor Tiles for Quiet Play',description:'Explore BIJOYISM Aqua Tones liquid sensory floor tiles: four blue and four green tiles for observation, quiet corners, classrooms, and indoor play.'},
  about:{title:'About BIJOYISM: Sensory Play for Kids',description:'Learn about BIJOYISM, operated by Shenzhen Hengzhian Technology Co., Ltd., and its liquid sensory floor tiles for children ages 3 and up.'},
  contact:{title:'Contact BIJOYISM',description:'Contact BIJOYISM for product support, school and organization inquiries, and customization information. Email support@bijoyism.cn for assistance.'},
  faq:{title:'Sensory Floor Tile Questions and Answers',description:'Find answers about BIJOYISM liquid sensory floor tiles, including ages, indoor use, dimensions, care, testing information, and choosing a collection.'},
  buying:{title:'Buying and After-Sales Support',description:'Find BIJOYISM purchase and after-sales information. Orders are completed on the selected platform, where prices, shipping, and return terms apply.'},
  privacy:{title:'Privacy and Contact Information',description:'Read how BIJOYISM handles inquiries, contact information, language preferences, and third-party purchases. Contact support@bijoyism.cn with questions.'},
  'guides/liquid-sensory-tiles':{description:'Learn what liquid sensory floor tiles are and compare BIJOYISM collections, shared dimensions, materials, age guidance, and indoor play conditions.'},
  'guides/care':{description:'Learn how to clean, dry, inspect, and store BIJOYISM liquid sensory floor tiles, with guidance for indoor use and checking for damage before play.'},
  'guides/testing':{description:'Read the shared testing and CPC information for BIJOYISM TD01, TD02, and TD03, including document numbers, applicable requirements, and scope limitations.'},
 },
 zh: {
  '':{title:'儿童液体感官地垫',description:'了解 BIJOYISM 动物探索、缤纷双色和水漾色彩液体感官地垫，查看适合 3 岁及以上儿童的室内玩法、产品规格、护理和检测信息。'},
  privacy:{description:'了解 BIJOYISM 如何处理咨询、联系信息和语言偏好，以及第三方购买平台的隐私说明。如有问题，请联系 support@bijoyism.cn。'},
 }
};

export function brandedTitle(title) {
 return title.includes('BIJOYISM') ? title : `${title} | BIJOYISM`;
}
