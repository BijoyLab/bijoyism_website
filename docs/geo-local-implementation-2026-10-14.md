# GEO 本地修改与发布交接

日期：2026-10-14。工作目录：`技术/bijoyism_website/`。此次修改代码与内容，尚未部署线上；2026-10-13 的线上诊断仍为历史观察。

## 已落实的本地修改

| 诊断事项 | 实现 |
| --- | --- |
| 公司身份 | About 首段与事实区块提供中英文公司主体、注册地址、2019 年 1 月成立、品类、市场和统一邮箱；Organization 使用同一身份对象 |
| 三系列检测 | `evidence.js` 记录 TD01/TD02/TD03 共同检测及同一 CPC，直接用于产品中心、详情、比较与检测指南；测试与核心事实库比对 |
| 表面与底面 | 修正首页和产品页残留防滑、防水表述；保留磨砂、纹理 TPE、零星水滴擦拭及不可浸泡边界 |
| 产品身份 | Product model 为 TD01/TD02/TD03；只有已确认的 TD01 写 SKU BJS-ANIMAL-8；ASIN 作为单独 marketplace identifier，未充当 GTIN |
| 产品结构化数据 | 数量、年龄、表面/底面材料、英寸尺寸 QuantitativeValue、CPC 文件及检测 Article 关联；未虚构 Offer 或评分 |
| 导航与证据入口 | 新增中英文品类指南、护理指南、检测依据；产品中心、产品页、比较页、About、玩法和页脚接入 |
| 标题和摘要 | 产品 title 增加品类与八片装；公司、产品中心、比较页、玩法 metadata 增加明确主题；客户端更新标题时使用同一规则 |
| 抓取 | index/follow、OAI-SearchBot Allow；无需特殊 MD 文件才能读取正文 |
| 双域名 | 英文 canonical 指向 bijoyism.cc/en，中文指向 bijoyism.cn/zh；HTML 和 Sitemap 使用互相对应的 hreflang；移除冲突的同域 HTTP Link 标记 |
| 默认访问 | 生产根路径根据可信 Cloudflare 国家信息选择市场；无国家信息时按域名选择默认市场；尊重 NEXT_LOCALE 语言偏好。显式语言页不强制地区跳转，预览保留本地语言切换 |
| 规范化 | www HTML 入口 308 至裸域名；Shop/Shop Collections 合并到产品中心，collection 入口合并到各产品详情；历史品类/护理/检测分别 301 至新指南，查询参数保留 |
| Sitemap | 根据请求 Host 输出该域名主语言的规范页面；排除已合并地址；只为本次实质更新页面填真实审核日期 |
| 日期与面包屑 | 新指南和公司/产品相关页有审核日期；指南 Article 有 dateModified，无未上线的虚构 datePublished；产品与指南面包屑含产品父级 |
| 归因配置 | purchase-channels 的 attributionUrls 按 home/catalog/product/bottom/dialog 配置；未提供真实归因链接时保留原 ASIN 链接 |
| 点击统计 | 购买链接带一致的系列与位置标记；无 Cookie 的同源上报；服务端校验事件、型号、目标 ASIN、来源与大小，输出结构化服务日志；隐私页说明用途 |
| 兼容回归 | 更新路线清单、旧址预期和历史文本冻结测试；保留真实路由、资产及文字声明验证；修正打印文本的 HTML 转义预期与平板图片溢出 |

## 公开页面

- `/en/guides/liquid-sensory-tiles/` 和 `/zh/guides/liquid-sensory-tiles/`
- `/en/guides/care/` 和 `/zh/guides/care/`
- `/en/guides/testing/` 和 `/zh/guides/testing/`
- 原有 `/en/about/`、`/zh/about/`、产品中心、三款详情与比较页保留。

页面事实来源为 `Product/03-truth/product-truth.md`、`Product/00-core/product-facts.compact.json` 及 `docs/company-facts.md`。同一证书覆盖来自 2026-10-13 用户确认，本次没有冒称重新检验原件。

## 统计启用与归因配置

1. 在托管后台为网站服务日志配置留存、导出与访问权限，避免把短期控制台输出当成持久统计数据库。
2. 设置服务端变量 `PURCHASE_ANALYTICS_ENABLED=true` 并部署。未设置时接口明确返回关闭，浏览器不发送点击数据。
3. 用实际卖家账户创建 Amazon Attribution 链接，填入 `src/site/data/purchase-channels.json` 对应系列/位置。内部命名建议 `geo_us_en_td01_home_bottom_202610`，它不是已创建的官方标签。
4. 验收事件的系列、语言、页面、来源网站/活动标签、位置、ASIN；验证账户报表能识别对应 Attribution 链接。
5. 日志事件是未经身份验证的用户提交，可被模拟，应配合托管入口限流、过滤异常和 Amazon 报表；不能把点击或日志条数当成销售。

事件不保存原始 IP、完整 referrer 或目标 URL 查询参数，也不设置分析 Cookie；尊重 Global Privacy Control。服务器、托管方的基础访问日志可能另有数据，后台留存须按实际政策管理。

## 仍需外部后台或实际线上状态完成的事项

- 部署此次本地构建并核验生产 HTML、robots、Sitemap 和响应头；线上不会因本地修改自动更新。
- 为 bijoyism.cn 核验 DNS、HTTPS 证书、托管域名绑定与中国实网可达性。这些不能通过页面代码修复。
- 生产反向代理须保留 Host，并由可信 Cloudflare 入口覆盖 CF-IPCountry；不要从未受控代理接受地区标记。
- 为两个域名配置 Search Console、提交各自 Sitemap、核验真实索引及爬虫访问。
- 提供账户生成的 Attribution 链接，配置日志持久化和报表；当前尚无归因销售结果。
- TD02 Amazon 变体选择和库存仍需美国站实际核验，本次未修改已确认 ASIN。
- 真实独立评测、创作者演示、搜索/AI 引用基线、Core Web Vitals 属于外部数据或运营工作，没有生成虚构结果。
- 报告原件暂不公开下载；检测页提供文档摘要及邮箱。之后有适合公开的原件时再接入下载。

## 运行验证

执行 `npm run lint`、`npm run typecheck`、`npm run test:unit`、`npm run build`、`npm run test:e2e`。浏览器测试核对公司主体、证书范围、Product JSON-LD、域名 Sitemap、重定向及手机/平板/电脑页面。

2026-10-14 实际结果：lint 无错误或警告、typecheck 通过、19 项单元测试全部通过、生产构建通过；浏览器测试 34 项通过，8 项与视口无关的检查在手机/平板跳过且已在电脑端执行。历史与新路由 HTTP/资产检查通过，平板横向溢出修正后回归通过。

另外临时启用本地 `PURCHASE_ANALYTICS_ENABLED=true`，购买点击上报成功及外部来源拒绝路径测试通过；预览 Host 与请求 URL 主机名不同的情况已处理。测试结束后未设置生产变量，也未开启线上统计。

历史 `reference-content.json` 保留旧版摘要作为迁移记录；不再用旧文案哈希阻止已授权的事实和 GEO 内容修正。新断言检查实际产品事实、适用型号、路由、HTML 与资产。
