# BIJOYISM Website

Next.js App Router + TypeScript + Tailwind CSS 4 + daisyUI 5 + next-intl。
这是官网开发框架，首页和关于页中的文字为待替换示例，尚未接入正式产品素材、商城、表单或后端。

## 本地运行

需要 Node.js 24（见 `.nvmrc`）和 npm。

```sh
npm ci
npm run dev
```

打开 http://localhost:3000 。根路径会根据语言 Cookie／浏览器语言跳转到 `/en` 或 `/zh`，无匹配时默认英文。

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## 多语言

- `src/i18n/routing.ts`：语言列表、默认语言、显示名称。
- `messages/en.json`、`messages/zh.json`：英文与简体中文文案。
- `src/i18n/request.ts`：服务端加载对应语言消息。
- `src/i18n/navigation.ts`：项目统一使用这里的 Link / router，自动保留语言前缀。
- `src/proxy.ts`：语言识别与路由。
- `src/app/[locale]/`：所有需要翻译的页面放在这里。

新增语言时修改 routing 中的 locales 与 localeNames，并增加同结构 JSON。页面需验证 locale 并调用 setRequestLocale，以支持静态生成。语言选择器保留当前路径、查询参数和锚点。

## 响应式与组件

默认手机优先；`sm` ≥ 640px、`md` ≥ 768px、`lg` ≥ 1024px。手机显示折叠菜单，平板和电脑显示完整导航；首页卡片从一列到两列再到三列。

- `src/components/`：公共导航、语言选择器、页脚。
- `src/app/globals.css`：Tailwind CSS、daisyUI 和品牌主题变量。
- `public/`：正式静态素材存放位置。

示例页面包含 daisyUI 的 navbar、menu、select、btn、card、badge。字体使用系统字体，构建无需下载远程字体。主题色仅作框架默认值，可按正式品牌规范调整。

## 浏览器检查

```sh
npx playwright install chromium
npm run test:e2e
```

检查手机（390px）、平板（768px）、电脑（1440px）下的中英文页面、语言切换、移动菜单、导航、无横向溢出和无效页面 404。

## GitHub

远程仓库：`git@github.com:BijoyLab/bijoyism_website.git`，主分支为 `main`。
`.github/workflows/ci.yml` 会执行代码检查、类型检查、生产构建和浏览器检查。需要本机 GitHub SSH 密钥拥有仓库写权限。

环境变量按需复制 `.env.example` 到 `.env.local`，敏感值不要提交。当前框架无需任何密钥即可启动。`.env.example` 是可提交的变量模板。

## 本机兼容配置

默认开发与生产构建使用 Next.js 支持的 Webpack 模式。`@swc/core` 固定为 1.15.2，Playwright 固定为 1.58.2，以兼容 macOS 13。升级系统后可按需评估升级，避免直接移除锁定配置。
