const content = {
 zh: {
  eyebrow: '幼儿园与机构',
  title: '从课堂到活动角，探索更多游戏可能',
  intro: '根据空间、人数和活动主题灵活组合，让地垫融入幼儿园和机构的日常活动。',
  scenes: [
   ['课堂主题活动', '围绕动物、颜色与故事，开展观察、表达和轮流参与的活动。', '老师与三名儿童围桌观察动物探索系列地垫并交流'],
   ['室内活动游戏', '排小路、拼方阵，或一起设计路线，根据空间与人数调整玩法。', '儿童在老师陪伴下沿感知地垫组成的路线进行室内游戏'],
   ['阅读角与探索区', '观察色彩流动，分享自己的发现，让孩子按自己的节奏参与。', '老师坐在阅读角与儿童交流，八片蓝绿感知地垫平铺在前方']
  ],
  custom: '支持图案、配色及机构 Logo 定制，欢迎咨询定制服务。',
  play: '查看课堂玩法',
  inquiry: '咨询定制',
  safety: ''
 },
 en: {
  eyebrow: 'FOR PRESCHOOLS & ORGANIZATIONS',
  title: 'More ways to play, in every space.',
  intro: 'Adapt the tiles to your space, group, and activity theme—from classroom activities to everyday play corners.',
  scenes: [
   ['Classroom Activities', 'Explore animals, colors, and stories through observation, conversation, and taking turns.', 'A teacher and three children discuss animal sensory tiles around a classroom table'],
   ['Indoor Movement Games', 'Make a path, a grid, or a route of your own. Adjust the layout to suit your space and group.', 'Children follow a sensory tile route indoors with a teacher nearby'],
   ['Reading & Discovery Corners', 'Watch the colors move and share discoveries, with room for each child to explore at their own pace.', 'A seated teacher and children explore a reading corner with eight blue and green sensory tiles']
  ],
  custom: 'Custom artwork, colors, and organization logos are available. Contact us to discuss customization.',
  play: 'Explore Classroom Play',
  inquiry: 'Ask About Customization',
  safety: ''
 }
};
const images = [
 ['td01-classroom-table-v01.webp', 1200, 900],
 ['homepage-carousel-school-desktop-v01.webp', 1800, 738],
 ['td03-reading-institutions-v02.webp', 1200, 900]
];
export function renderHomeSchools(lang) {
 const c = content[lang];
 return `<section id="families" class="institution-section wrap" aria-labelledby="institution-title"><div class="institution-heading"><p class="eyebrow">${c.eyebrow}</p><h2 id="institution-title">${c.title}</h2><p>${c.intro}</p></div><div class="institution-scenes">${c.scenes.map(([title,body,alt],i)=>`<article class="institution-scene"><img src="/assets/${images[i][0]}" width="${images[i][1]}" height="${images[i][2]}" alt="${alt}" loading="lazy"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div><div class="institution-footer"><p class="institution-custom">${c.custom}</p><div class="institution-actions"><a class="button primary" href="/${lang}/play-ideas/?setting=classroom#play-results">${c.play}</a><a class="button institution-secondary" href="/${lang}/contact/?topic=customization#customization-inquiry">${c.inquiry}</a></div>${c.safety ? `<p class="institution-safety">${c.safety}</p>` : ''}</div></section>`;
}
