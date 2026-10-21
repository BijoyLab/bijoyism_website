# BIJOYISM Invisible SEO / GEO 技术优化报告

日期：2026-10-21（Asia/Shanghai）。项目：`技术/bijoyism_website`。本轮只完成本地实施与验证，未部署、未改 DNS、未改 Cloudflare 设置、未提交 GSC 请求。

## 修改前审计

- 框架：Next.js 16.3.8、React 19.2.8、next-intl 4；App Router，`[locale]/[[...slug]]`。生产构建标记页面为动态服务端渲染（SSR）；robots/sitemap 为静态元数据路由。存在 generateStaticParams 不代表这些页面最终为 SSG。
- 路由数据产生 43 条入口/语言，其中 9 条历史别名重定向，34 条规范页面/语言，共 68 个公开可索引目标。其完整 URL 见下表。锚点只用于页内导航，不是 hash routing。
- 已有：title、description、canonical、Open Graph、Twitter Card、JSON-LD、hreflang、HTML lang、图片 alt、favicon、robots 和 sitemap。采用统一 route-based seo.js 加 Next Metadata API，无第三方 SEO 插件。
- 无 Search Console HTML verification token；不推定未验证。用户已提供域名资源后台及英文首页已收录截图，域名 DNS 验证不需要 HTML token。本轮不编造 token、不要求重复注册资源。
- 未发现 manifest/PWA 或 llms.txt；不为本轮新增。没有独立 apple-touch-icon；现有 logo.png 是 600×128 横版，不冒充合适的方形 Apple 图标，也不重新设计品牌资源。
- 修改前 68 页均为单一 H1、无缺失 alt、无引用的图片文件缺失，metadata description 无重复；但英文 About、购买、隐私、指南及产品摘要过长，最长隐私摘要 1133 字符。标题部分偏口号，分享图选择分散于两个位置，缺 og:site_name 和 OG 语言字段。
- 已有 Product 为真实实体描述，无 Offer/Review/AggregateRating；Google 产品富结果必需字段缺失已由用户 GSC 截图证实。JSON 可解析不代表产品富结果资格。
- 历史修改基线已保存，单元测试原有 19 项通过。原有未提交的可见文案、proxy 308 和 revalidate=3600 均保留，不归入本轮修改。

## A. 修改摘要

| 文件 | 本轮变更 |
| --- | --- |
| src/site/seo-overrides.js（新增） | 路由级纯 metadata 标题/摘要；品牌名去重；英文核心页自然描述，中文首页与隐私摘要独立配置 |
| src/site/seo.js | 复用统一配置，title 与 Schema 名称一致；统一分享图；Organization/WebSite URL、语言与页面实体类型；Breadcrumb @id 及引用；sitemap 输入去重 |
| src/site/metadata.ts（新增） | 类型化 Next Metadata 适配器；canonical/robots/OG/Twitter/hreflang 单一输出；补 site_name、OG locale 和绝对图片 URL |
| src/app/[locale]/[[...slug]]/page.tsx | 删除重复图片/title 组合逻辑，调用同一 metadata 适配器；保留已有正文输出和 revalidate |
| src/app/robots.ts | 显式添加 Googlebot Allow；保留 OAI-SearchBot 和通配规则，未单独改变 GPTBot 训练许可 |
| tests/invisible-seo.test.mjs（新增） | 68 页正文 SHA-256 不变、metadata 唯一性、资源/alt/H1、实体无虚构评分、sitemap 去重 |
| tests/invisible-seo.spec.ts（新增） | 68 页生产 HTML、head 唯一性、语言、自指 canonical、JSON-LD、robots/sitemap、404、参数和重定向 |
| tests/geo.spec.ts | 将过时的 .cn 307 断言更新为用户已存在的 308 行为，未改重定向实现 |
| docs/invisible-seo-baseline-2026-10-21.json（新增） | 修改前逐页配置、图片及正文哈希基线 |
| docs/invisible-seo-map-2026-10-21.csv（新增） | 本轮完整 68 页机器可读 SEO Map |
| 本报告 | 审计、实现、验证和人工边界 |

未改样式文件、可见正文、H1 文案、布局、产品数据或图片。68 页完整 renderer HTML 哈希逐一与本轮起点一致，这比仅截图对照更严格。浏览器也验证了移动/平板/桌面布局、交互与无 pageerror；未做像素级前后截图差分。

## B. 页面 SEO Map

以下是本地构建配置与最终 HTML 已验证的规范目标，不是 Google 已收录清单。每行均自指 canonical。英文使用通用 en，中文 zh-CN；OG 使用 en_US/zh_CN，不虚构 /en-us 或 /zh-cn 页面。

| URL | Title | Description | Canonical | Schema | Indexable（本地技术） | Language |
| --- | --- | --- | --- | --- | --- | --- |
| https://bijoyism.cc/en/ | Sensory Floor Tiles for Kids \| BIJOYISM | Discover BIJOYISM sensory floor tiles for kids ages 3+. Explore liquid color movement, indoor play ideas, and collections for homes and classrooms. | https://bijoyism.cc/en/ | Organization, WebSite, WebPage | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/products/ | Liquid Sensory Floor Tiles for Kids \| BIJOYISM | Explore BIJOYISM Animal Discovery, Color Duos, and Aqua Tones liquid sensory floor tiles. Compare eight-piece sets, dimensions, materials, and play ideas. | https://bijoyism.cc/en/products/ | Organization, WebSite, CollectionPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/shop/compare/ | Animal Discovery vs Color Duos vs Aqua Tones \| BIJOYISM | Compare TD01, TD02, and TD03 by artwork, visible colors, and play ideas, alongside shared specifications, ages, use conditions, and testing records. | https://bijoyism.cc/en/shop/compare/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/shop/find-your-fit/ | Choose by your space and invitation. \| BIJOYISM | All three current collections are for ages 3+ and indoor use on a dry, level floor or carpet with adult supervision. | https://bijoyism.cc/en/shop/find-your-fit/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/ | Play Your Way \| BIJOYISM | Choose your collection, then find a game for your age, group, and indoor setting. | https://bijoyism.cc/en/play-ideas/ | Organization, WebSite, CollectionPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/families/ | More discoveries, together. \| BIJOYISM | Start with a color, a gentle press, or a path you build together. Leave room for your child’s curiosity and let play become part of your day. | https://bijoyism.cc/en/families/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/schools/ | Bring color and movement into your classroom. \| BIJOYISM | From noticing colors to taking turns and building routes, choose activities that fit your group, space, and classroom routine. | https://bijoyism.cc/en/schools/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/about/ | About BIJOYISM: Sensory Play for Kids | Learn about BIJOYISM, operated by Shenzhen Hengzhian Technology Co., Ltd., and its liquid sensory floor tiles for children ages 3 and up. | https://bijoyism.cc/en/about/ | Organization, WebSite, AboutPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/contact/ | Contact BIJOYISM | Contact BIJOYISM for product support, school and organization inquiries, and customization information. Email support@bijoyism.cn for assistance. | https://bijoyism.cc/en/contact/ | Organization, WebSite, ContactPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/faq/ | Sensory Floor Tile Questions and Answers \| BIJOYISM | Find answers about BIJOYISM liquid sensory floor tiles, including ages, indoor use, dimensions, care, testing information, and choosing a collection. | https://bijoyism.cc/en/faq/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/buying/ | Buying and After-Sales Support \| BIJOYISM | Find BIJOYISM purchase and after-sales information. Orders are completed on the selected platform, where prices, shipping, and return terms apply. | https://bijoyism.cc/en/buying/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/privacy/ | Privacy and Contact Information \| BIJOYISM | Read how BIJOYISM handles inquiries, contact information, language preferences, and third-party purchases. Contact support@bijoyism.cn with questions. | https://bijoyism.cc/en/privacy/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/guides/liquid-sensory-tiles/ | What Are Liquid Sensory Floor Tiles? \| BIJOYISM | Learn what liquid sensory floor tiles are and compare BIJOYISM collections, shared dimensions, materials, age guidance, and indoor play conditions. | https://bijoyism.cc/en/guides/liquid-sensory-tiles/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/guides/care/ | How to Clean and Store Liquid Sensory Tiles \| BIJOYISM | Learn how to clean, dry, inspect, and store BIJOYISM liquid sensory floor tiles, with guidance for indoor use and checking for damage before play. | https://bijoyism.cc/en/guides/care/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/guides/testing/ | Testing and CPC for TD01, TD02, and TD03 \| BIJOYISM | Read the shared testing and CPC information for BIJOYISM TD01, TD02, and TD03, including document numbers, applicable requirements, and scope limitations. | https://bijoyism.cc/en/guides/testing/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/products/td01-animal-discovery/ | Animal Liquid Sensory Tiles for Kids \| BIJOYISM | Explore BIJOYISM Animal Discovery liquid sensory tiles with colorful animal scenes for stepping, pressing, visual exploration, and creative indoor play. | https://bijoyism.cc/en/products/td01-animal-discovery/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/products/td02-color-duos/ | Color Liquid Floor Tiles for Sensory Play \| BIJOYISM | Discover BIJOYISM Color Duos liquid floor tiles with moving colors for stepping, pressing, and visual sensory play. An eight-piece set for kids ages 3+. | https://bijoyism.cc/en/products/td02-color-duos/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/products/td03-aqua-tones/ | Blue-Green Sensory Floor Tiles for Quiet Play \| BIJOYISM | Explore BIJOYISM Aqua Tones liquid sensory floor tiles: four blue and four green tiles for observation, quiet corners, classrooms, and indoor play. | https://bijoyism.cc/en/products/td03-aqua-tones/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/animal-safari/ | Animal Safari: Indoor Play for Ages 3–6 \| BIJOYISM | Find the named animal, step over to it, and describe what you notice. | https://bijoyism.cc/en/play-ideas/animal-safari/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/move-like-an-animal/ | Move Like an Animal: Indoor Play for Ages 3–7 \| BIJOYISM | Choose an animal, copy a simple movement, and let a friend guess. | https://bijoyism.cc/en/play-ideas/move-like-an-animal/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/story-steps/ | Story Steps: Indoor Play for Ages 4–7 \| BIJOYISM | Add one sentence at each animal stop to build a shared story. | https://bijoyism.cc/en/play-ideas/story-steps/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/color-command/ | Color Command: Indoor Play for Ages 3–6 \| BIJOYISM | Agree on color-to-action rules, then listen and try each movement. | https://bijoyism.cc/en/play-ideas/color-command/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/follow-my-path/ | Follow My Path: Indoor Play for Ages 4–7 \| BIJOYISM | Watch a short color route, repeat it, then swap the leader. | https://bijoyism.cc/en/play-ideas/follow-my-path/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/build-a-color-course/ | Build a Color Course: Indoor Play for Ages 4–8 \| BIJOYISM | Design a color route and decide what happens at each stop. | https://bijoyism.cc/en/play-ideas/build-a-color-course/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/quiet-steps/ | Quiet Steps: Indoor Play for Ages 3–7 \| BIJOYISM | Take gentle steps, pause to notice a pattern, and continue at your own pace. | https://bijoyism.cc/en/play-ideas/quiet-steps/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/balance-islands/ | Balance Islands: Indoor Play for Ages 4–8 \| BIJOYISM | Stand steadily on each island, pause, then walk to the next stop. | https://bijoyism.cc/en/play-ideas/balance-islands/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/slow-motion-trail/ | Slow Motion Trail: Indoor Play for Ages 4–7 \| BIJOYISM | Keep a slow step–pause rhythm along a short route. | https://bijoyism.cc/en/play-ideas/slow-motion-trail/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/adventure-trail/ | Adventure Trail: Indoor Play for Ages 4–8 \| BIJOYISM | Imagine at an animal stop, move at a color stop, and pause at an Aqua stop. | https://bijoyism.cc/en/play-ideas/adventure-trail/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/build-your-own-adventure/ | Build Your Own Adventure: Indoor Play for Ages 4–8 \| BIJOYISM | Choose story, movement and pause rules, then invite someone to try your adventure. | https://bijoyism.cc/en/play-ideas/build-your-own-adventure/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/treasure-quest/ | Treasure Quest: Indoor Play for Ages 4–8 \| BIJOYISM | Create animal, color and pause clues for a friend to find a paper treasure. | https://bijoyism.cc/en/play-ideas/treasure-quest/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/choose-a-color/ | Choose a Color, Choose a Step: Indoor Play for Ages 3–6 \| BIJOYISM | Choose the next color yourself, explore its pattern, then swap roles. | https://bijoyism.cc/en/play-ideas/choose-a-color/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/quiet-color-watch/ | Quiet Color Watch: Indoor Play for Ages 3–8 \| BIJOYISM | Look, press with a hand, then lift your hand and describe the changing pattern. | https://bijoyism.cc/en/play-ideas/quiet-color-watch/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/three-tile-layouts/ | Arrange, Combine & Create: Indoor Play for Ages 3–8 \| BIJOYISM | Choose any one collection and arrange the tiles into all kinds of shapes—from lines and grids to curves or a layout of your own. | https://bijoyism.cc/en/play-ideas/three-tile-layouts/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/en/play-ideas/preschool-turn-taking/ | Preschool Turn-Taking: Indoor Play for Ages 3–8 \| BIJOYISM | Organize chooser, explorer and observer roles for a shared classroom activity. | https://bijoyism.cc/en/play-ideas/preschool-turn-taking/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | en |
| https://bijoyism.cc/zh/ | 儿童液体感官地垫 \| BIJOYISM | 了解 BIJOYISM 动物探索、缤纷双色和水漾色彩液体感官地垫，查看适合 3 岁及以上儿童的室内玩法、产品规格、护理和检测信息。 | https://bijoyism.cc/zh/ | Organization, WebSite, WebPage | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/products/ | BIJOYISM 液体感官地垫：比较三个系列 | 比较动物探索、缤纷双色和水漾色彩。三个系列均为八片装、适合 3 岁及以上儿童；查看单片尺寸、材质、护理、共同检测依据与购买入口。 | https://bijoyism.cc/zh/products/ | Organization, WebSite, CollectionPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/shop/compare/ | 动物探索、缤纷双色与水漾色彩怎么选？ \| BIJOYISM | 按图案、可见配色和玩法比较 TD01、TD02、TD03，同时核对共同规格、年龄、使用条件与检测证书。 | https://bijoyism.cc/zh/shop/compare/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/shop/find-your-fit/ | 按空间和玩法，找到适合的系列。 \| BIJOYISM | 目前三个系列均适用于 3 岁及以上儿童，可在成人监护下于室内干燥、平整的地面或地毯上使用。 | https://bijoyism.cc/zh/shop/find-your-fit/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/ | 找到适合一起玩的方式 \| BIJOYISM | 选好产品系列，再按年龄、参与人数和使用场景，找到适合的玩法。 | https://bijoyism.cc/zh/play-ideas/ | Organization, WebSite, CollectionPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/families/ | 一起玩，让日常多一点发现。 \| BIJOYISM | 不必安排复杂的活动。从看看颜色、轻轻按一按，到一起排出路线，让孩子顺着自己的兴趣探索，也让陪伴自然发生。 | https://bijoyism.cc/zh/families/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/schools/ | 让色彩和动作，融入课堂活动。 \| BIJOYISM | 从观察颜色到轮流参与，再到一起设计路线，教师可以根据人数、空间和活动安排，选择适合班级的游戏方式。 | https://bijoyism.cc/zh/schools/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/about/ | 关于 BIJOYISM：公司与儿童感官玩具 | BIJOYISM 相信，孩子通过感官认识世界。我们将色彩、触感、运动与想象融入日常游戏，创造简单、开放、有趣的感官体验，让孩子自由探索、主动发现，并在每一次玩耍中找到新的可能。 | https://bijoyism.cc/zh/about/ | Organization, WebSite, AboutPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/contact/ | 找到合适的下一步。 \| BIJOYISM | 如有产品问题或学校、机构采购需求，欢迎通过电子邮箱联系我们。 | https://bijoyism.cc/zh/contact/ | Organization, WebSite, ContactPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/faq/ | 关于日常游戏的几个答案。 \| BIJOYISM | 动物探索是印刷动物画面与流动液体的结合；缤纷双色以变化的双色液体纹理为主；水漾色彩包含四片蓝色与四片绿色，无动物印刷画面。 | https://bijoyism.cc/zh/faq/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/buying/ | 购买与售后说明 \| BIJOYISM | 在产品页面选择 Amazon 购买，即可前往对应商品页面。价格、库存、付款、配送和退换规则以购买平台为准。如有产品或售后问题，请联系 support@bijoyism.cn。 | https://bijoyism.cc/zh/buying/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/privacy/ | 隐私说明 \| BIJOYISM | 了解 BIJOYISM 如何处理咨询、联系信息和语言偏好，以及第三方购买平台的隐私说明。如有问题，请联系 support@bijoyism.cn。 | https://bijoyism.cc/zh/privacy/ | Organization, WebSite, WebPage, BreadcrumbList | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/guides/liquid-sensory-tiles/ | 液体感官地垫是什么，三个系列怎么选？ \| BIJOYISM | BIJOYISM 液体感官地垫是适合 3 岁及以上儿童的独立硬质地垫。手掌按压或脚部踩踏时，彩色液体纹理会移动。当前动物探索、缤纷双色和水漾色彩三个系列均为八片装，适用于室内干燥、平整的地面或地毯，并需成人监护。 | https://bijoyism.cc/zh/guides/liquid-sensory-tiles/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/guides/care/ | 液体感官地垫如何清洁、检查和收纳？ \| BIJOYISM | BIJOYISM TD01、TD02、TD03 液体感官地垫表面防泼溅，可冲洗或用柔软湿布擦拭。请勿浸泡，也不要让地垫长时间接触水。清洁后擦干或在阴凉处晾干，再整齐叠放收纳。使用前检查是否损坏；发现损坏时停止使用。请在成人监护下，于室内干燥、平整的地面使用。 | https://bijoyism.cc/zh/guides/care/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/guides/testing/ | TD01、TD02、TD03 的检测与证书依据 \| BIJOYISM | 当前 TD01、TD02、TD03 三个系列均具备儿童产品证书（CPC），并完成适用的 ASTM F963-23 和 CPSIA 要求检测。文件适用范围以所列型号和检测项目为准。 | https://bijoyism.cc/zh/guides/testing/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/products/td01-animal-discovery/ | 动物探索液体感官地垫 · 8 片装 \| BIJOYISM | 动物探索是适合 3 岁及以上儿童的八片装液体感官地垫。印刷动物画面可以用于认动物和讲故事，按压或踩踏时可以观察彩色液体移动。请在成人监护下，于室内干燥、平整的地面或地毯上使用。 | https://bijoyism.cc/zh/products/td01-animal-discovery/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/products/td02-color-duos/ | 缤纷双色液体感官地垫 · 8 片装 \| BIJOYISM | 缤纷双色是适合 3 岁及以上儿童的八片装液体感官地垫。变化的双色液体纹理可以用于颜色选择、观察与轮流游戏。独立地垫可排成室内短路线或方阵，请在成人监护下于干燥、平整的地面或地毯上使用。 | https://bijoyism.cc/zh/products/td02-color-duos/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/products/td03-aqua-tones/ | 水漾色彩液体感官地垫 · 8 片装 \| BIJOYISM | 水漾色彩是一套八片的液体感官地垫，包含四片蓝色与四片绿色，无动物印刷图案。适合 3 岁及以上儿童在成人监护下，于室内干燥、平整的地面或地毯上观察色彩或玩短路线游戏。 | https://bijoyism.cc/zh/products/td03-aqua-tones/ | Organization, WebSite, WebPage, BreadcrumbList, Product | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/animal-safari/ | 动物探险：儿童室内游戏玩法 \| BIJOYISM | 找到被点名的动物，走过去，说说它的特征。 | https://bijoyism.cc/zh/play-ideas/animal-safari/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/move-like-an-animal/ | 动物模仿秀：儿童室内游戏玩法 \| BIJOYISM | 选一只动物，模仿简单动作，让同伴猜。 | https://bijoyism.cc/zh/play-ideas/move-like-an-animal/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/story-steps/ | 走一步，讲一句故事：儿童室内游戏玩法 \| BIJOYISM | 每到一个动物站点，接着讲一句，一起编故事。 | https://bijoyism.cc/zh/play-ideas/story-steps/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/color-command/ | 颜色指令：儿童室内游戏玩法 \| BIJOYISM | 先约定颜色对应的动作，再听指令完成。 | https://bijoyism.cc/zh/play-ideas/color-command/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/follow-my-path/ | 跟着我的路线：儿童室内游戏玩法 \| BIJOYISM | 看一段颜色路线，记住并复现，再交换领路人。 | https://bijoyism.cc/zh/play-ideas/follow-my-path/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/build-a-color-course/ | 设计彩色路线：儿童室内游戏玩法 \| BIJOYISM | 设计颜色路线，为每一站约定任务。 | https://bijoyism.cc/zh/play-ideas/build-a-color-course/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/quiet-steps/ | 安静脚步：儿童室内游戏玩法 \| BIJOYISM | 轻轻落脚，停下来看看颜色的变化，再按自己的节奏继续。 | https://bijoyism.cc/zh/play-ideas/quiet-steps/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/balance-islands/ | 平衡小岛：儿童室内游戏玩法 \| BIJOYISM | 在每座小岛上站稳停留，再走到下一站。 | https://bijoyism.cc/zh/play-ideas/balance-islands/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/slow-motion-trail/ | 慢动作挑战：儿童室内游戏玩法 \| BIJOYISM | 沿短路线保持慢步、停留的节奏。 | https://bijoyism.cc/zh/play-ideas/slow-motion-trail/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/adventure-trail/ | 冒险路线：儿童室内游戏玩法 \| BIJOYISM | 动物站想象，双色站行动，蓝绿站点停留。 | https://bijoyism.cc/zh/play-ideas/adventure-trail/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/build-your-own-adventure/ | 自己设计游戏路线：儿童室内游戏玩法 \| BIJOYISM | 自选故事、动作和停顿规则，再邀请同伴试玩。 | https://bijoyism.cc/zh/play-ideas/build-your-own-adventure/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/treasure-quest/ | 寻宝任务：儿童室内游戏玩法 \| BIJOYISM | 设计动物、颜色和停顿线索，让同伴找到纸质宝藏。 | https://bijoyism.cc/zh/play-ideas/treasure-quest/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/choose-a-color/ | 选一个颜色，走下一步：儿童室内游戏玩法 \| BIJOYISM | 自己选下一种颜色，探索纹理，再交换角色。 | https://bijoyism.cc/zh/play-ideas/choose-a-color/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/quiet-color-watch/ | 静静看蓝绿流动：儿童室内游戏玩法 \| BIJOYISM | 先看、用手按压、移开，再描述纹理变化。 | https://bijoyism.cc/zh/play-ideas/quiet-color-watch/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/three-tile-layouts/ | 排列组合，摆出各种形状：儿童室内游戏玩法 \| BIJOYISM | 任选一个系列的地垫，自由排列组合，摆成直线、方阵、弧线等形状，也可以试试自己的新布局。 | https://bijoyism.cc/zh/play-ideas/three-tile-layouts/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |
| https://bijoyism.cc/zh/play-ideas/preschool-turn-taking/ | 课堂轮流组织指南：儿童室内游戏玩法 \| BIJOYISM | 用选择者、探索者、观察者组织课堂活动。 | https://bijoyism.cc/zh/play-ideas/preschool-turn-taking/ | Organization, WebSite, WebPage, BreadcrumbList, Article | Yes；非 Google 收录结论 | zh-CN |

## C. 技术 SEO 状态

### 完成（本地）

- 复用原生 metadata 架构，未增加依赖；每页单独 title/description/canonical/robots/OG/Twitter/language 和同源 JSON-LD。
- 核心英文摘要独立且 <=170 字符（多数约 120–160），不机械截断；无价格、疗效、批发范围等未经证实事实。TD03 使用 quiet play，而不是保证 calming 效果。
- 68 个规范页：HTTP 200、关键内容存在初始 HTML、不需 JS 交互、一个主 H1、一份 JSON-LD、一个 canonical、无 noindex/X-Robots-Tag 阻止；元数据和语言链接一致。
- 无效页本地 HTTP 404 并含 noindex；参数集合页 canonical 去参数；尾斜杠 308、www 308、历史路由 301、本地 .cn fallback 308 按已有实现验证；未发现已测路径的循环。
- sitemap 来自产品/玩法路由数据，68 URL，无别名、404、查询参数和 .cn 目标，未来数据新增沿用同一机制；保留已有资料审核日期，不捏造当日内容更新。
- 全站图片都有 alt；Logo 为 BIJOYISM。此次未重写 alt，未把关键词注入 aria-label。现有部分 About 图片 alt 是价值标题而非严格画面描述，需结合实际图片逐项人工复核，不能据无缺失推定全部语义完美。
- 已有 main/nav/footer/article/section 得以保留；68 页一个 H1。未做不必要标签重构、未新增隐藏文本/隐形链接。

### 需要人工配置 / 发布后核验

- **部署本地版本**：本轮 build 通过不等于 Cloudflare 已上线。
- **HTTP → HTTPS**：2026-10-21 外部 curl 检查 `http://bijoyism.cc/en/` 返回 HTTP 200，而非 HTTPS 重定向。须在 Cloudflare 确认相关域名可用证书后配置 Always Use HTTPS，或按主机选择性重定向；本轮不更改托管设置、不使用可能造成反代循环的盲目源站跳转。
- **WAF/AI crawler**：没有托管后台日志或规则访问，不能声称 Googlebot/OAI-SearchBot 在全球网络均未被拦截。以实际已验证爬虫与安全事件为依据核查，不能仅按可伪造 UA 放行，也不关闭全部防护。
- **GSC**：已完成域名资源与 sitemap 提交，首页英文已收录（用户此前截图）；仍需查看 sitemap 解析状态、三产品页 Google 索引结果，以及更新后实际测试。不要把 live test“可索引”写成“已收录”。
- apple-touch-icon 暂缺：本轮不生成/改造图片；后续提供获批方形图标再配置。无 PWA 不强加 manifest。

### 发现风险 / 不隐瞒

- **Product 富结果仍不合格**：保留真实 Product，无可见真实报价/官网评价来源，故不填 offers/review/aggregateRating。不能用 Amazon 汇总评分消红字。普通网页索引和富结果资格不同。
- 2026-10-20 线上批量抓取存在请求不稳定（16 页触发重试，最后均恢复）；不是本轮 68 页本地检查失败，也不能定位为 Googlebot 被拦截。仍需边缘/Worker 日志佐证。
- 搜索引擎仍可重写 title/摘要、选择不同 canonical；本轮技术正确不保证收录、排名或 AI 引用。
- 本轮起点已有护理正文中的“可冲洗/叠放收纳”等表达与当前 Product/03-truth 中的统一护理表达存在待核对差异。本轮用户明确禁止修改可见文案与产品事实，故保持现状，未扩大到 metadata 作为新护理承诺。后续应由用户确认后单独处理，不在本次偷偷改文案。

## D. Schema 清单

- Organization：BIJOYISM，已公开公司身份、地址、邮箱、Logo；不新编社媒 sameAs。移除把中文 About URL 当作外部 sameAs 的冗余做法，语言关系交给 hreflang。
- WebSite：稳定 @id、BIJOYISM、英文首页 URL、en/zh-CN、publisher。
- WebPage / AboutPage / ContactPage / CollectionPage：语义类型、语言、canonical URL、publisher、isPartOf。
- Product：三个真实系列，各自 model/真实 SKU（仅已有 TD01）/ASIN 外部标识/尺寸/材质/测试依据关联；不捏造 GTIN、报价、库存、评价或奖项。
- BreadcrumbList：每个非首页规范页 1 份，@id 和 WebPage.breadcrumb 相连，真实 Home→Products 或 Play Ideas→详情层级。
- Article：已有指南和玩法文章；作者/发布者引用 Organization，沿用已有日期来源，不虚构发布历史。
- 没有新增 FAQPage 星标捷径、Offer、Review 或 AggregateRating。未在线操作 Google Rich Results Test；仅本地解析/必要字段策略检查。产品缺少富结果字段是已知未消除限制。

## E. Crawler 状态

| 项目 | 结果 | 边界 |
| --- | --- | --- |
| Googlebot | robots 显式 Allow: / | 不证明 WAF 全球放行或全站收录 |
| OAI-SearchBot | robots 显式 Allow: / | 不证明已进入 ChatGPT Search |
| GPTBot | 无新增专属规则；保留原通配许可 | 未把训练许可与搜索可发现性混为一谈 |
| robots.txt | 本地 HTTP 200，正确 sitemap URL | 上线后复查生产 |
| sitemap.xml | 本地 HTTP 200，68 规范 URL，语言互链 | GSC 处理结果需后台确认 |
| 页面/图片 | 本地公开返回，图片文件均存在；原浏览器回归检查图片加载 | 无法代替外部所有地区可达性 |

## 验证记录

- `npm run test:unit`：22/22 通过，包括全部 68 页正文哈希与 metadata 检查。
- `npm run lint`：通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，生产优化编译及类型校验成功。
- `npm run test:e2e -- --workers=2`：36 通过、12 按配置跳过（与屏幕无关的请求检查仅 desktop 执行），0 失败。包含所有 68 canonical 页面生产 HTML 检查和原有交互测试。
- `git diff --check`：通过。
- 初次 sandbox 启动本地端口被 EPERM 阻止，获准在沙箱外运行后验证成功；不是网站故障。首次新增测试 TS 空值错误已修正并重新构建通过。
- 本地移动端主页截图已查看，内容和布局保持原样；原浏览器布局测试覆盖 mobile/tablet/desktop。

## F. 尚未执行内容

- 不改 H1、首页可见品类定位、FAQ、指南/对比正文、内链锚文本、护理文案或产品事实。
- 不新增可见评价/报价模块，不转载 Amazon 评价，不创建隐藏 SEO 文本。
- 不新增图片、不设计 Logo/社交图/Apple 图标，不引入 PWA/llms.txt/SEO 依赖。
- 不部署、不访问或更改 DNS/Cloudflare 控制台，不宣称完成 WAF 设置、真实 Googlebot 日志审计或 GSC 批量索引。

## G. 下一阶段最高优先级 5 项

1. 发布本次版本并复查线上核心页面的 metadata、robots 和完整 sitemap 响应。
2. 在 Cloudflare 配置并验证 HTTP→HTTPS，保留路径与参数，避免重定向链及循环。
3. 在 GSC 确认 sitemap 成功解析、三产品页及中文首页的实际 Google 索引状态；必要时各申请一次索引。
4. 结合已验证爬虫请求与 Worker/安全事件日志，定位生产偶发超时和误拦截，不无差别放行伪造 UA。
5. 单独确认现有护理表述与事实源的一致性，再规划真实可维护的官网评价/报价来源；来源与页面展示未就绪前不追求产品富结果消红字。

## 依据

- [Google 产品摘要结构化数据要求](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Cloudflare Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)
- 项目内 Next.js 16 文档、当前产品事实源与公司事实、2026-10-20 GSC 用户截图和抓取记录。
