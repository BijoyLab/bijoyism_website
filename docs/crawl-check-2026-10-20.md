# BIJOYISM 线上抓取与索引配置检查

日期：2026-10-20。仅检测，未修改网站代码或生产配置。

## 范围与结果

- 读取线上 sitemap.xml，HTTP 200，XML 完整闭合，68 个网页网址。
- 扫描全部 68 页（英文 34、中文 34）；单次超时 20 秒，最多自动重试一次，并发 4。
- 批量检查 67 页成功取得完整 HTML；中文 `/zh/shop/find-your-fit/` 两次连接超时，随后单独复测恢复 HTTP 200，完整 HTML，耗时 13.11 秒，index/follow 与自指 canonical 正常。
- 因此本轮全部 68 页最终均取得成功响应，但不能描述为全部首次访问稳定。
- 批量成功的 67 页均有标题、H1、index/follow、自指 HTTPS .cc canonical，以及 en、zh-CN、x-default 语言链接。未发现阻止索引的 X-Robots-Tag。
- 67 页均检出 JSON-LD 且 JSON 语法可解析；这不是 Google 富结果资格或全部 Schema 语义验证。
- robots.txt 返回 200，通配爬虫及 OAI-SearchBot 均允许抓取，指向正确站点地图。

## 风险与边界

- 批量扫描中 16 页触发重试（首次请求报错、非 200 或 HTML 不完整任一条件）；15 页自动重试成功，剩余 1 页单独复测恢复。
- 自动脚本仅保留最后一次结果，不能还原每次初始失败的具体类型。不要把 16 页全部描述为连接超时。
- 当前测试网络的耗时、超时可能来自测试链路、边缘网络或服务器；不能单凭这些测试确定 Cloudflare 或源站故障，更不能等同于真实 Googlebot 抓取失败。建议结合 Cloudflare 请求/Worker 日志和 GSC 实际网址测试核验。
- 本轮没有登录 Google Search Console，不能确认其他 67 页是否已被 Google 收录。用户提供的 GSC 截图只确认英文首页已收录。
- 普通 curl 抓取不等于 Google live test；XML 可以下载也不代表 Google 的站点地图报告已解析成功。
- 本次未进行浏览器视觉验收、JS 交互、全部图片/内链、真实性逐条复审或全站性能专项测量。

## 后续优先级

1. 在 GSC 检查中文首页、三个英文产品详情页、英文公司介绍和检测依据页；对未收录但实际测试通过的核心网页各申请一次索引。
2. 查看站点地图状态和已发现网址数，确认 Google 已成功处理。
3. 若超时持续或 GSC live test 失败，再结合具体错误和边缘/Worker 日志定位访问稳定性；不盲目关闭防火墙。

原始批量记录见 `crawl-check-2026-10-20.json`，其中中文选购建议页保留失败记录；此文补记其随后单独复测恢复的结果。

Google URL Inspection 说明：https://support.google.com/webmasters/answer/9012289
