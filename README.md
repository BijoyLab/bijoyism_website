# BIJOYISM Website — Next.js

对照 `bijoyism-website` 迁入全部 40 个页面路径及中英文内容，运行时不依赖参考目录。
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
当前为内容预览：保留原项目的预览提示、`noindex, nofollow` 和 robots 禁止抓取，尚未正式发布。

## 页面覆盖

首页；产品总览；Shop、Collections、系列比较、Find Your Fit；三个系列集合与产品详情；玩法内容库、12 项代表玩法、2 项入门玩法、2 份指南；家庭、幼儿园与机构、关于、联系、FAQ、购买与售后、隐私；产品信息、护理、检测、品类介绍兼容入口。

中文规范路径为 `/zh/`，英文为 `/en/`。原 `/zh-cn/` 兼容跳转至 `/zh/`。两项合并玩法、四个产品信息旧入口继续使用 301 跳转，保留查询条件和目标锚点；旧页面路径都可访问或到达对应合并页面。

- 产品筛选：系列、已确认年龄、空间；匹配页另有玩法偏好。
- 产品：图库切换、英寸／双单位切换、各系列真实 Amazon 链接。
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
- `src/i18n/`：语言识别与路由；添加语言需同时补齐上述双语内容，不能只登记代码。
- `public/assets/`：原有 Logo、实拍与场景素材、图示、字体及许可；原文件按哈希完整复制。
- `src/site/*.css`：保留原版布局与字号；`src/app/globals.css` 接入 Tailwind CSS 与 daisyUI，统一主按钮组件。
- `src/app/api/inquiries/route.ts`、`src/server/inquiries.mjs`：Next.js 邮件咨询接口及校验。
- `docs/migration-manifest.json`：源模块与素材哈希、路由清单。

为保留现有视觉和规则，页面模板继续共享原有 HTML 渲染函数，由 Next.js 服务端输出完整正文，浏览器仅在页面容器内处理交互。无需 iframe，也不请求或嵌入原项目生成的 HTML。后续可以逐个将模板拆分为 React 组件；当前内容仅来自项目内受控数据，不应直接接入未经处理的用户 HTML。

`public/data/` 是迁入时保留的兼容数据快照；页面运行以 `src/site/data/` 和 `play-content.js` 为准。
新增产品或玩法会按数据生成对应路由。修改文案需运行检查；中文字体保留原有子集，新增字符需重新导出字体。

## 咨询邮件

复制 `.env.example` 到 `.env.local`，按实际服务配置服务端变量；默认 `INQUIRY_MAIL_ENABLED=false`，没有密钥时不发信，表单明确提示未启用并提供 `support@bijoyism.cc`。

后端保留固定收件人、表单校验、5 套起订、最多 3 个附件／每个 5 MB、文件签名校验、来源限制、限流、幂等和失败重试。文字草稿仅在当前标签页保存。当前部署代理的客户端 IP 信任规则尚未配置，默认共享一个受限请求桶；公开启用前应配置可信代理和入口限流。

测试使用模拟邮件适配器，不发送真实邮件。正式启用仍需确认发信域名、服务配置和公开部署条件。

## 验证与 GitHub

`tests/reference-content.json` 保存参考项目 80 个页面及两份定制表单的正文摘要，单元测试核对迁移文案、产品关联、规则与打印、咨询校验。浏览器测试覆盖所有路由及静态素材，并在三种设备宽度验证关键交互，截图保存在忽略的 `test-results/`。

远程：`git@github.com:BijoyLab/bijoyism_website.git`，主分支 `main`。CI 执行检查、单元测试、构建和浏览器测试。

本机 macOS 13 兼容配置：开发／构建使用 Webpack，`@swc/core` 固定 1.15.2，Playwright 固定 1.58.2。依赖通过锁定文件重现，不需要远程字体下载。
