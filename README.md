# BIJOYISM Website — Next.js

本项目为当前官网唯一工作目录，保留 40 个历史路径并新增 3 个 GEO 指南路径，含中英文内容；运行时不依赖旧 1.0 目录。
技术栈：Next.js 16 App Router、TypeScript、Tailwind CSS 4、daisyUI 5、next-intl。

## 启动与验证

需要 Node.js 24，版本见 `.nvmrc`。

```sh
npm ci
npm run dev
```

默认访问 http://localhost:3000 。本任务预览使用 http://127.0.0.1:3101/zh/ 。

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npx playwright install chromium
npm run test:e2e
```

构建后 `npm start` 运行生产服务。浏览器测试自动启动 3100 端口的构建结果。
当前页面已启用正式可抓取的 `index, follow`、XML sitemap 和 `OAI-SearchBot` 放行；咨询邮件仍默认关闭，正式发布前仍需完成域名、邮件和业务信息核验。

## 页面覆盖

首页；产品总览；Shop、Collections、系列比较、Find Your Fit；三个系列集合与产品详情；玩法内容库、12 项代表玩法、2 项入门玩法、2 份指南；家庭、幼儿园与机构、关于、联系、FAQ、购买与售后、隐私；产品信息、护理、检测、品类介绍兼容入口。

中文规范地址为 `https://bijoyism.cn/zh/`，英文为 `https://bijoyism.cc/en/`，显式语言页面仍可在两个域名访问，canonical 与 hreflang 指向对应语言规范域名。生产根路径根据可信 Cloudflare 国家信息选择默认市场，保留语言偏好；本地预览不跨域跳转。原 `/zh-cn/` 跳转至 `/zh/`。Shop、集合和产品信息兼容入口使用 301，保留查询参数；品类、护理和检测分别跳转到新的独立指南。

- 产品筛选：系列、已确认年龄、空间；匹配页另有玩法偏好。
- 产品：图库切换、英文英寸／中文厘米展示、各系列真实 Amazon 链接和可配置的 Attribution 入口。
- 玩法：年龄／人数／空间筛选、URL 与历史同步、刷新恢复、详情返回位置、四模式锚点、打印与展开状态恢复。
- 语言切换：保留当前页面、查询条件、锚点、展开 FAQ 和咨询文字草稿。
- 手机菜单、平板与电脑布局沿用参考项目，已在 390px、768px、1440px 下验证。

## 组织与维护

- `src/app/[locale]/[[...slug]]/page.tsx`：真实 Next.js 页面入口、路由验证、服务端正文、各页 metadata 和 JSON-LD。
- `src/site/pages.js`、`site-render.js`、`play-library.js`：从参考项目迁移的共享页面渲染模块。
- `src/components/website.tsx`：React 容器与浏览器交互生命周期。
- `src/site/interactions.js`、`play-interactions.js`、`inquiry-form.js`：图库、筛选、菜单、打印和咨询交互；全局监听随组件卸载清理。
- `src/site/copy.js`、`site-copy.js`、`knowledge.js`、`customization.js`：真实页面双语文案。
- `src/site/data/products.json`、`purchase-channels.json`：产品事实和渠道；`play-content.js` 为玩法真相源。
- `docs/company-facts.md`：BIJOYISM 公司事实源、品牌定位底稿及合规信息的公开边界。官网、GEO 和结构化数据改写前先核对此文件，并结合具体型号证据。
- `src/i18n/`：语言识别与路由；添加语言需同时补齐上述双语内容，不能只登记代码。
- `public/assets/`：原有 Logo、实拍与场景素材、图示、字体及许可；原文件按哈希完整复制。
- `src/site/*.css`：保留原版布局与字号；`src/app/globals.css` 接入 Tailwind CSS 与 daisyUI，统一主按钮组件。
- `src/app/api/inquiries/route.ts`、`src/server/inquiries.mjs`：Next.js 邮件咨询接口及校验。
- `docs/migration-manifest.json`：源模块与素材哈希、路由清单。

为保留现有视觉和规则，页面模板继续共享原有 HTML 渲染函数，由 Next.js 服务端输出完整正文，浏览器仅在页面容器内处理交互。无需 iframe，也不请求或嵌入原项目生成的 HTML。后续可以逐个将模板拆分为 React 组件；当前内容仅来自项目内受控数据，不应直接接入未经处理的用户 HTML。

`public/data/` 是迁入时保留的兼容数据快照；页面运行以 `src/site/data/` 和 `play-content.js` 为准。
新增产品或玩法会按数据生成对应路由。修改文案需运行检查；中文字体保留原有子集，新增字符需重新导出字体。

## 咨询邮件

复制 `.env.example` 到 `.env.local`，按实际服务配置服务端变量；默认 `INQUIRY_MAIL_ENABLED=false`，没有密钥时不发信，表单明确提示未启用并提供 `support@bijoyism.cn`。

后端保留固定收件人、表单校验、5 套起订、最多 3 个附件／每个 5 MB、文件签名校验、来源限制、限流、幂等和失败重试。文字草稿仅在当前标签页保存。当前部署代理的客户端 IP 信任规则尚未配置，默认共享一个受限请求桶；公开启用前应配置可信代理和入口限流。

测试使用模拟邮件适配器，不发送真实邮件。正式启用仍需确认发信域名、服务配置和公开部署条件。

## 验证与 GitHub

`tests/reference-content.json` 保留历史迁移正文摘要，后续授权内容修改不再要求复现旧版文字哈希。测试核验历史路由覆盖、正文与资产、产品标识、检测范围与核心事实库一致性、规范域名、规则与打印、咨询和统计校验。浏览器测试覆盖所有路由及静态素材，并在三种设备宽度验证关键交互，截图保存在忽略的 `test-results/`。

## GEO 与上线交接（2026-10-14）

实现与外部待办见 `docs/geo-local-implementation-2026-10-14.md`。公开品类指南为 `/en/guides/liquid-sensory-tiles/`，护理为 `/en/guides/care/`，检测为 `/en/guides/testing/`；中文使用对应 `/zh/` 路径。

`src/site/evidence.js` 记录 TD01、TD02、TD03 共同检测及同一 CPC 的已确认范围，单元测试对照 `Product/00-core/product-facts.compact.json`。当前三个系列不是仅 TD01 被覆盖；不自动推导到未来型号或其他性能。

购买点击接口为 `/api/purchase-events/`。在部署配置 `PURCHASE_ANALYTICS_ENABLED=true` 后，以结构化服务日志记录点击；日志持久化、留存、导出在托管后台配置。默认关闭，不声称已有销售统计。`purchase-channels.json` 的 `attributionUrls` 接受卖家后台生成的实际链接；空值回退原 ASIN 链接。网站不会自行生成 Amazon 官方归因标签。

远程：`git@github.com:BijoyLab/bijoyism_website.git`，主分支 `main`。CI 执行检查、单元测试、构建和浏览器测试。

本机 macOS 13 兼容配置：开发／构建使用 Webpack，`@swc/core` 固定 1.15.2，Playwright 固定 1.58.2。依赖通过锁定文件重现，不需要远程字体下载。

## 网站素材管理（2026-10-05）

后续素材制作使用 `$bijoyism-website-assets`，默认工作区已更新为本项目。母版与候选保存到 `materials/`，共享需求和进度位于 `materials/records/`；路径配置见 `materials/records/asset-workspace.json`，尺寸清单见 `docs/website-materials-checklist-2026-10-03.md`。旧项目的现有母版、60 个任务、26 条素材记录与历史已复制并核验哈希；后续只更新本项目的共享记录。网页导出文件位于 `public/assets/`，导出索引为 `docs/website-asset-manifest.json`，归档母版不自动修改页面或发布。

GitHub 独立检查使用 `tests/fixtures/product-compliance.json` 中已核验的公开检测字段快照；项目核心事实文件可用时，本地测试仍直接核对核心事实。快照不包含检测原件。
