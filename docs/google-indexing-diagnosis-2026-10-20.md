# Google 收录排查

检查日期：2026-10-20。只读检查生产响应和本地配置，没有修改或发布网站，没有操作 Search Console 或 DNS。

## 结论与证据边界

当前未发现 robots/noindex/canonical 指错域名这类持续性的索引阻断。历史上存在明确阻断，最近才修正；目前另有值得核查的抓取响应不稳定。用户尚不确定 Search Console 是否验证或提交，因此没有 Google 的最后抓取、索引状态、选定 canonical 或排除原因数据，无法断言唯一根因。

未设置 Search Console 本身不会阻止 Google 收录。它的作用是验证管理权限、提交 Sitemap、请求抓取并查看 Google 的实际处理状态。不能将“没有配置 Search Console”直接当成根因，也不能将公开搜索没有结果认定为 Google 索引为零。

## 已确认的事实

| 项目 | 本次观察 | 判断 |
| --- | --- | --- |
| robots | HTTP 200；通用 Allow: /；OAI-SearchBot 放行；声明 `.cc/sitemap.xml` | 没有继续禁止 Google 抓取 |
| 有效页面索引标记 | 中英文首页、中文 About、TD01 详情、检测页等读到 index, follow | 未复现旧 noindex |
| canonical | 首页和抽样内页均为自身 `.cc` 地址，不再指向 `.cn` | 已修复此前中文规范域名不可用问题 |
| 根地址 | 本次根地址 307 至 `.cc/zh/`，最终 200 | 不再跳向不可访问的 `.cn`；按地区变化的 307 不是本次已证明的索引阻断 |
| www | www 英文入口 308 至裸域名，最终 200 | 规范化正常 |
| 正文 | 完整返回的首页、About、产品/检测页有 HTML 正文，不只靠 JS 空壳 | 有效页面可被读取 |
| Sitemap | 初次请求 25 秒后截断；压缩 HTTP/1.1、HTTP/2 复测均完整返回 68 个 loc，XML 正常闭合 | 不是只有 4 页或稳定损坏；存在取回速度/稳定性疑点 |
| 不存在页面 | 随机无效路径返回真实 404 | 未观察到该路径被伪装成 200 |
| HTTP 入口 | 抽样 `http://bijoyism.cc/en/` 返回 200，未先跳 HTTPS；canonical 指向 HTTPS | 可改善规范化，但已有 HTTPS canonical，不能据此认定整站不收录 |
| 验证标记 | 页面未发现 google-site-verification meta | 不能据此认定未验证，DNS 或文件验证无需该标签 |
| 公开搜索 | 本次公开检索无站点结果 | 只能作线索，Google URL Inspection 才能核实单页状态 |

## 原因判断

### 已确认的历史原因

2026-10-13 的线上审查记录明确存在 `Disallow: /` 和 `noindex, nofollow`。2026-10-14 还发现中文 canonical 和部分根地址跳往当时外部访问失败的 `.cn`。这些都会削弱早期发现、抓取和规范化；当前抽样显示都已修正。

截至 2026-10-20，距确认放开索引约 6 天，单域名修正实际部署时间仍需按部署记录确认。不能把域名注册日或内容制作日视为 Google 已可抓取的起点。Google 官方说明重新抓取可需几天至几周，没有固定收录保证。

### 当前技术疑点：抓取响应存在波动

首轮请求出现多次 25 秒超时或 HTTP/2 framing 错误。有些请求收到 200 响应头但只收到部分正文，不能当成成功抓取。

复测使用压缩请求：

- 英文首页 HTTP/1.1：约 0.79 秒首字节、4.13 秒完成，正文完整。
- 英文首页 HTTP/2：约 1.17 秒首字节、7.22 秒完成，正文完整。
- 英文 About HTTP/1.1：约 1.02 秒完成，正文完整。
- Sitemap HTTP/2：约 12.06 秒首字节并完成，68 个 URL，完整。
- Sitemap HTTP/1.1：约 15.56 秒首字节并完成，68 个 URL，完整。
- Googlebot 简单 UA 的英文首页复测：HTTP 200，约 4.96 秒首字节，20 秒后超时、只收到 1360 字节的传输数据，未拿到完整 HTML。
- 首轮另一个移动 Googlebot UA 曾完整成功，因此没有证据认定全部 Googlebot 请求被拦截。

这些只是本检查网络至当次边缘节点的观察，不是 Googlebot 自身日志，不能证明 Google 实际遇到同样故障，也不能区分是本地链路、边缘传输、Worker/Next 输出还是防护策略。应以 Search Console 实时测试、抓取统计和 Cloudflare 请求/Worker 日志交叉验证，优先看真实抓取时间附近的 403/429/5xx、挑战和执行错误。

### 未确认：Google 是否已经发现与尝试索引

用户反馈不确定 Search Console 的配置情况。当前没有依据把页面归为“Google 尚未发现”“已发现尚未编入索引”或“已抓取尚未编入索引”。也没有证据确认手动措施、处罚、内容质量拒收、真实爬虫 IP 封禁或外链数量。

## 下一步，按顺序操作

1. 打开 `https://search.google.com/search-console/`，用管理网站的 Google 账号登录，先检查资源列表是否已有 bijoyism.cc。
2. 没有资源时添加“域名”资源，填 `bijoyism.cc`，不带 https、www 或路径。复制 Google 提供的真实 TXT 到该域名当前权威 DNS 平台。`.cn` 在腾讯云购买不代表 `.cc` 的 DNS 也在那里；无需转移域名或删除已有解析。
3. 验证后进入 Sitemaps，提交 `https://bijoyism.cc/sitemap.xml`，查看读取结果和发现页面数。
4. 在网址检查中输入 `https://bijoyism.cc/en/`，先保存当前索引结果，再点“测试实际网址”。记录“网页抓取”“允许编入索引”“上次抓取”“用户声明的规范网址”“Google 选择的规范网址”。测试可访问后可请求编入索引。
5. 再检查 `/zh/`、`/en/about/` 和一个产品详情；不要向 Google 提交重定向旧址作为主要索引目标。
6. 按具体状态处理：

| Google 状态 | 下一步 |
| --- | --- |
| Google 不知道此网址 | 提交正确 Sitemap、首页请求索引、核对可抓取内链和真实公开入口 |
| 已发现，尚未编入索引 | 检查抓取统计/服务器稳定性并观察后续抓取，不以批量重写代替诊断 |
| 已抓取，尚未编入索引 | 看最后抓取内容、规范化、重复情况和页面独立价值 |
| 被 noindex 或 robots 阻止 | 对照最后抓取日期与现在的线上内容，修复残留规则后请求重新抓取 |
| 抓取失败、服务器错误或被拒绝 | 按同一时刻查 Cloudflare/Worker 日志与防护；不要仅凭伪装 UA 修改 WAF |
| Google 选了其他规范网址 | 核查 HTTP/HTTPS、www/裸域名、旧域名、重定向及内部链接一致性 |
| 已编入索引 | 进一步区分收录与搜索排名/展示问题，不能继续按“零收录”处理 |

Search Console 验证和提交 Sitemap 不保证收录；重复请求同一 URL 不会加快抓取。当前不建议先增加大量 GEO 文章或安装收录插件。

## 官方依据

- 添加 Search Console 资源：https://support.google.com/webmasters/answer/34592
- URL Inspection：https://support.google.com/webmasters/answer/9012289
- 重新抓取与时间预期：https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- site 运算符限制：https://developers.google.com/search/docs/monitor-debug/search-operators/all-search-site
- 页面索引状态：https://support.google.com/webmasters/answer/7440203
