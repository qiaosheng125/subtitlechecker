# Subtitle Checker 复盘记录

## 当前状态

- 日期：2026-05-29
- 域名：`subtitlechecker.com`
- 本地项目：`03_网站项目/003_subtitle-checker`
- 阶段：L0 已上线，进入 7 天观察期。
- 本地预览：`http://localhost:3002`
- 生产地址：`https://www.subtitlechecker.com`
- GA4 measurement ID：`G-0XTDXKZMF1`
- Microsoft Clarity project ID：`wybseg8ymr`

## 决策依据

第三站不是从随机关键词出发，而是从具体痛点出发：

字幕制作者和剪辑人员在发布 SRT 前，需要快速知道字幕是否有行长、CPS、时间重叠、编号和可读性问题。

## MVP 功能

第一版检查：

- CPL：每行字符数。
- CPS：每秒字符数。
- 超过两行的字幕。
- 时间重叠。
- 时间格式非法。
- 空字幕。
- 字幕编号问题。
- 显示时间过短。

同时提供：

- SRT 粘贴输入。
- SRT 文件上传。
- 平台风格预设。
- 问题报告。
- AI 修复 prompt 复制按钮。
- 浏览器本地处理。

## 边界

- 不是完整字幕编辑器。
- 不是 AI 翻译工具。
- 不上传视频。
- 不保证一定符合 Netflix、BBC、YouTube 或客户的官方验收标准。
- 目标是把明显字幕质量问题解释清楚，并帮助用户快速修复。

## 上线状态

- GitHub：`https://github.com/qiaosheng125/subtitlechecker`
- Vercel：已部署。
- 生产地址：`https://www.subtitlechecker.com`
- 根域跳转：`https://subtitlechecker.com` 308 跳转到 `https://www.subtitlechecker.com/`
- GSC：sitemap 已提交，首页已请求索引。
- Bing Webmaster Tools：已从 GSC 导入，sitemap 已提交。
- GA4：已安装并在线上 bundle 中检测到。
- Clarity：已安装并在线上 bundle 中检测到。
- Next SEO Checker：13 passed，0 warning，0 critical。

## 本站经验

- 首屏必须直接露出真实工具，不能只做介绍页。
- 首页不能只有一个薄输入框，需要配套 guide 和 FAQ 支撑收录。
- About、Contact、Privacy、robots、sitemap、canonical、OG image 要从一开始就做。
- 统计脚本通过环境变量注入，避免硬编码。
- 加入 AI 修复 prompt 是有效方向，因为用户希望工具能和 AI 助手配合使用。
- smoke 测试要在部署前加好，不能把基础检查留给用户。

## 问题与修正

- 本地 dev server 容易混乱，因为旧项目还占用 3000 / 3002 等端口。修正：预览前明确检查端口和页面标题。
- GA4 和 Clarity 曾分两次部署。修正：以后先收齐两个 ID，再一次 redeploy。
- GSC sitemap 曾显示 unable to fetch，但实际文件可访问。修正：先做 HTTP 验证，不要重复提交。
- 用户要求加强自测。修正：长期规则要求 build、HTTP、sitemap、robots、metadata、smoke 都过再交付用户 review。

## 7 / 14 / 30 天复盘

复盘模板：`01_项目模板/7_14_30天复盘模板.md`

| 阶段 | 日期 | 必查项 | 输出 |
|---|---|---|---|
| Day 7 | 2026-06-05 | 域名、HTTPS、GSC、Bing、GA4、Clarity、sitemap、robots、canonical、核心工具、移动端溢出 | 修 fatal 问题或继续观察 |
| Day 14 | 2026-06-12 | GSC impressions、长尾词、CTR、标题/描述/H1、Clarity 阻塞、CTA、示例、FAQ | 小改标题、首屏、内容或 UX |
| Day 30 | 2026-06-28 | 收录、曝光、点击、使用、反馈、是否需要外链、是否值得继续投入 | 继续 / 改关键词 / 加页面 / 做外链 / 小额广告测试 / 暂停 / 放弃 |

Day 30 决策必须包含证据、反对意见、对反对意见的回应、下一 7 天任务、下一复盘日期和知识库更新。
