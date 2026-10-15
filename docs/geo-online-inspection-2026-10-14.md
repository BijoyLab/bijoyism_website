# BIJOYISM 线上更新巡检

日期：2026-10-14（北京时间）。此次为只读生产巡检，没有修改或发布网站，没有提交咨询、点击购买或发送统计事件。原始摘要证据见同目录 `geo-online-inspection-2026-10-14.json`。

## 结论

海外站已部署本次 GEO 更新，抓取与内容问题已实质改善。双域名暂不能整体放行：中国域名在本次外部请求中仍 HTTPS 握手失败，而中文 canonical、hreflang、语言切换与部分根地址跳转已指向该域名。先解决中国域名可达性，再确认全部入口与规范 URL 正常。

## 实际检查范围

- `bijoyism.cc/sitemap.xml` 的 34 个英文规范页面。
- 在 `.cc` 上逐一检查对应的 34 个中文页面，共 68 页；这不代表 `.cn` 上的页面已通过。
- robots、Sitemap、www、根地址、代表性旧地址、购买统计 GET 接口。
- 三产品的 JSON-LD、公司页、共同检测说明、标题和核心声明。
- 页面提取的 25 个去重图片/Logo 资源，均检查 HTTP 状态。
- 390px 和 768px 浏览器下的英文首页、About、检测页，共 6 次加载。
- 中国域名及其 www、robots、Sitemap 的外部请求。

## 已通过

| 检查项 | 线上证据 |
| --- | --- |
| 页面可达 | `.cc` 的 68 个检查页面均 HTTP 200 |
| 索引标记 | 68 页均 `index, follow`，未发现 X-Robots-Tag 索引限制 |
| 搜索爬虫规则 | robots 为 `Allow: /`；OAI-SearchBot 单独放行，提供 Sitemap 地址 |
| Sitemap 清理 | `.cc` Sitemap 为 34 个英文规范 URL；历史合并入口不在规范清单 |
| 公司事实 | 法定主体、英文公司名、注册地址、2019-01、市场与 support@bijoyism.cn 已进入 About HTML 和 Organization |
| 三系列检测 | TD01、TD02、TD03 共同检测及同一 CPC 的说明已上线；报告 C202602050363E、证书 CPCC202602050363E、2026-04-02 可读 |
| 产品结构化 | 三型号 model 独立；TD01 SKU 为 BJS-ANIMAL-8，TD02/TD03 未捏造 SKU；11.8 × 11.8 × 0.24 in 以 QuantitativeValue 标注，ASIN 单列 |
| JSON-LD | 检查页面可解析，产品关联检测 Article；未发现虚构 Offer、AggregateRating |
| 声明修正 | 定向扫描未发现旧 Non-Slip TPE Backing、全系列泛化测试标题、中文防滑底面/表面防水原句；不可浸泡及使用条件保留 |
| 新指南 | 中英文品类、护理、检测三类页面均在 `.cc` 返回 200，并可读取正文 |
| 旧地址 | 检测旧址 301 至独立检测指南并保留 source 查询参数；Shop、系列集合跳转到相应规范产品入口 |
| www | `www.bijoyism.cc/en/` 308 至裸域名英文首页 |
| 图片 | 提取的 25 个图片/Logo URL 均返回 200 |
| 手机与平板 | 6 次浏览器加载均 200、交互初始化完成、无页面脚本错误、无文档横向溢出，未发现已加载图片损坏 |

robots 放行不证明真实搜索爬虫已成功抓取；index/follow 不证明已经收录或获得 AI 引用。图片检查也不替代视觉真实性或全部静态资源的核验。

## 待处理项

### P0：`.cn` HTTPS 可达性与入口跳转

`https://bijoyism.cn/zh/`、`.cn/robots.txt`、`.cn/sitemap.xml` 及 `https://www.bijoyism.cn/zh/` 本次均报 TLS handshake failure。此结果仅代表外部检查环境，尚不能断言中国所有用户无法访问，也不能直接断定是证书、域名绑定还是 TLS 配置。

影响已经存在：

- `.cc/zh/` 的 34 个页面虽返回 200，但 canonical 指向 `.cn/zh/`。
- 英文页 hreflang、公司 sameAs 及语言切换关联到 `.cn`。
- 本次请求 `https://bijoyism.cc/` 收到 307 到 `https://bijoyism.cn/zh/`。根地址跳转按访问地区变化，本次结果不代表海外用户都会跳中国站。

建议核验 DNS、托管域名绑定、边缘 SSL 证书与中国实网访问；在 `.cn` 可用前，避免让受影响访客经根地址或语言切换进入失败地址。若需要临时回退跳转/canonical，另行实施，不在只读巡检中改动。

验收：两个域名 HTTPS 正常；`.cn/zh/`、robots、Sitemap 可访问；中国/海外根地址与人工切换均到可达页面；canonical 和 hreflang 的目标实际返回 200。

### P1：点击统计仍关闭

`https://bijoyism.cc/api/purchase-events/` 返回 `{"enabled":false}`。本地接口已上线，但服务器日志点击采集未启用。先配置日志留存、导出和访问权限，再启用 `PURCHASE_ANALYTICS_ENABLED=true`。本次只读 GET，没有向生产写入测试事件。

### P1：尚未接入 Amazon Attribution

线上购买链接仍是三条原始 ASIN 链接，未见实际归因参数：

- TD01：B0HCPQ373H
- TD02：B0HCPFBKS3
- TD03：B0HCPR7VQM

商品身份与本地配置一致，不能据此证明 Amazon 的最终选中变体、库存或配送正确。提供后台生成的实际归因链接后再接入，并核验对应商品落地与归因报表。

### P2：About 首段与公司事实区块重复

英文 About 的完整公司介绍在首段和 Who is BIJOYISM 区块重复出现。事实正确，建议保留首段直接介绍，下方以事实表补充，减少重复。不是抓取或索引阻断项。

## 尚未验证

- Search Console 收录、Sitemap 提交、Google AI 展示和真实爬虫日志。
- ChatGPT/Perplexity 实際引用、提及率或事实准确率。
- 真实点击持久化、Amazon 归因与销售。
- Core Web Vitals、国内多网络可达性、完整视觉/资源审查。
- `.cn` 的第二种浏览器/TLS 实现交叉验证：补充命令被自动审批系统用量限制拦截，未执行；该拦截不是安全判定。已完成的浏览器抽查仅针对 `.cc`。

优先顺序：`.cn` HTTPS 与可达入口 → 统计启用/归因链接 → Search Console 与 AI 引用基线。当前无需重新大规模改写官网内容。
