# 网站素材管理

跨对话制作可调用 `$bijoyism-website-assets`。任务与尺寸在 `records/asset-requirements.json`，共享进度在 `records/asset-progress.json`／`asset-progress.md`；每次归档后由 Skill 的脚本核验文件并更新进度和追加历史。已归档、已核对、使用范围确认和已接入网页分别记录，不互相替代。新任务先更新需求表，不重置既有记录。

本目录保存网站所需高清原件、待审核素材与来源记录，随独立网站项目管理。网页实际加载的文件仍在 `../public/assets/`；本目录不会自动部署到网页。2026-10-03 已收到品牌 SVG 四份，从项目 `brand/logo/` 复制归档，保留原名和内容，哈希与来源见 `records/logo-import-2026-10-03.csv`。视觉用途尚待选定，不代表四份均已在网站展示。

## 放置位置

| 目录 | 放什么 |
|---|---|
| `inbox/` | 新收到、尚未分类或核对的素材；不确定放哪里时先放这里 |
| `originals/brand/logo/` | Logo 原件、SVG 与透明 PNG |
| `originals/products/td01/` | 动物系列整套、单片、斜视、互动、细节、背面、适用包装 |
| `originals/products/td02/` | 双色系列对应原图 |
| `originals/products/td03/` | 蓝绿系列对应原图 |
| `originals/scenes/home/` | 家庭／亲子场景，桌面与手机构图 |
| `originals/scenes/school/` | 幼儿园／机构场景 |
| `originals/scenes/reading/` | 阅读角、观察场景 |
| `originals/scenes/brand/` | 品牌主视觉、品牌工作过程等 |
| `originals/activities/` | 玩法与路径图；可按活动 ID 建子目录 |
| `originals/customization/` | 定制样品、效果稿与获准公开的案例；明确区分示意和实样 |
| `originals/documents/testing/` | 完整检测原件及资料；公开版单独命名，原件不直接上传网站 |
| `originals/documents/manuals/` | 产品说明、护理文件与编辑源文件 |
| `originals/documents/activity-cards/` | 活动下载卡及编辑源文件 |
| `originals/share-covers/` | 分享封面、中英版本和编辑源文件 |
| `records/` | 来源、审核、授权／使用范围、导出与哈希记录 |

后续新系列在 `originals/products/` 下新增稳定产品 ID 的文件夹，如 `td04/`，不随语言重复建立素材库。视频可在相应产品或场景目录下建 `video/`。

## 原件到网页的流程

1. 提供者先按上述类别存放；不确定时放 `inbox/`。只存文件不代表已确认可公开使用。
2. 选用时检查产品身份、构图、尺寸和使用范围，再记录状态为待核对／已选用／暂不使用。
3. 从母版生成网页 WebP、SVG 或公开 PDF，放入 `public/assets/`，更新 `docs/website-asset-manifest.json` 并接入页面。现有网页文件路径保持有效，不批量搬动。
4. 原件不覆盖；新版本递增序号。既有项目产品真相源仍保留在原资产库；网站只复制选用原件，记录源路径与 SHA-256，不迁移整套源图库。

保留已有原图命名。新的网站专用资产可命名 `bijoyism-{series或brand}-{用途}-{desktop或mobile}-v01.{格式}`；含文字再加 `en`／`zh-cn`。无字图片无需按语言复制。待处理文件暂保留原名，确认用途后再命名并保存对照记录。忽略 `._*` 与 `.DS_Store`。

制作尺寸、建议数量与优先级见 `../docs/website-materials-checklist-2026-10-03.md`。本目录不存账号密码、邮件密钥等秘密信息；涉及机构图稿或完整报告的资料保留在素材层，只将确认可公开的版本导出到网页目录。

## 2026-10-05 迁移后的入口

当前网站根为 `/Users/emiliachen/Projects/Bijoysim_amazon_share/技术/bijoyism_website`。现有母版、任务、进度与历史从旧项目复制并核验哈希；后续以本目录记录为准，旧项目不再作为新增资产的归档入口。当前文件路径已更新，原始来源与历史事件原样保留。位置配置见 `records/asset-workspace.json`。

网页资源使用 `public/assets/`，内容以 `src/site/data/products.json` 和 `src/site/play-content.js` 为准；`public/data/` 仅兼容快照，不编辑 `.next/` 或恢复旧版 dist。中文页面语言代码为 `zh`，既有含 `zh-cn` 文件名无需批量改名。

旧需求表保留任务 ID 与历史。旧玩法 animal-story-trail、calm-corner-path 已分别合并到 story-steps、quiet-steps；继续制作前核对最新页面实际用途，新玩法需登记新任务及变体，不把旧任务自动标成新玩法已完成。
