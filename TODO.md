# TradingReview 项目 TODO

> 本文档记录待完善功能、已知问题及可改进项，按优先级排序。完成一项后将 `[ ]` 改为 `[x]`。

---

## 一、高优先级（Bug / 必备修复）

- [x] **1.1 数据迁移源路径错误** - `electron/main.ts`。修复：使用 `getDataPath() || app.getPath("userData")` 作为实际数据源路径。
- [x] **1.2 useTrades 响应处理** - `src/hooks/useTrades.ts`。修复：增加 `response.success` 判断，失败时 `setTrades([])`。
- [x] **1.3 App 启动时 window.electron 未就绪** - `src/App.tsx`。修复：增加 `window.electron` 存在性检查，未就绪时延迟重试。
- [x] **1.4 SQLite 外键未启用** - `electron/db/instance.ts`。修复：在 `createTables` 后执行 `db.pragma('foreign_keys = ON')`。

---

## 二、中优先级（功能补全）

- [ ] **2.1 截图功能未实现** - `trades` 表有 `screenshot` 字段，但无上传、预览、展示逻辑。在 TradeForm / TradeModal 中实现截图上传、存储与展示。
- [x] **2.2 交易筛选缺少日期范围** - 后端支持 `startDate` / `endDate`，前端 `TradesFilter` 已增加日期范围选择器并传给 `fetchTrades`。
- [x] **2.3 设置页版本号硬编码** - `src/pages/SettingsPage.tsx` 已改为通过 `window.electron.getAppVersion()` 动态获取。
- [x] **2.4 cleanupDirtyMethods 未实现** - `electron/handlers/methodHandlers.ts` 已实现重新计算所有方法的 `usage_count` / `win_rate` / `total_pnl` 的清理逻辑。

---

## 三、可改进项（代码质量 / UX）

### 3.1 代码质量

- [x] `any` 类型 - `electron/db/instance.ts` 已增加最小 `BetterSqliteDatabase` 类型封装（preload 的 any 保留作为 IPC 边界）。
- [x] 废弃 API - `methodHandlers.ts` 中 `substr` 已改为 `slice`。
- [ ] 重复 initDatabase - 各 handler 模块，可考虑统一初始化入口（暂未改动，仅保留为后续优化项）。

### 3.2 用户体验

- [x] 激活失败重试 - 网络失败时在激活页提供「重试」按钮
- [x] 离线提示 - 仅在激活页提示「激活需要联网」，主应用保持本地体验
- [x] 批量删除确认 - 交易批量删除前在表头通过 Popconfirm 增加确认弹窗
- [x] 键盘快捷键 - 交易/方法编辑弹窗支持 Esc 取消、Ctrl/⌘+Enter 保存
- [x] 加载骨架屏 - 交易表在初次加载时使用 Skeleton 占位
- [x] 空状态引导 - 无交易记录时展示 Empty，引导用户「新增交易」

### 3.3 错误处理

- [x] 错误信息 - 创建/更新/删除交易和方法时，会优先展示后端返回的 `message`，否则退回通用提示
- [x] API 错误形态 - hooks 中统一按 `response.success` 判断，`success: false` 时抛出带 message 的错误
- [ ] 数据库初始化失败 - 当前仅打印日志，可增加用户提示或降级策略（暂未改动）

### 3.4 性能

- [x] useStats 串行请求 - 已改为 `Promise.all` 并行获取统计数据
- [ ] 交易列表分页 - 后端一次性加载全部，数据量大时考虑分页

---

## 四、可新增功能

- [ ] 数据导出 - 导出交易记录 / 统计到 CSV 或 Excel
- [ ] 数据导入 - 从 CSV 导入交易记录
- [ ] 数据备份 - 手动或定时备份数据库
- [ ] 深色模式 - 主题切换
- [ ] 更多图表 - 按品种、时间等维度的图表
- [ ] 全局搜索 - 跨交易、策略的搜索
- [ ] 标签 / 备注 - 富文本备注、标签自动补全
- [ ] 策略对比 - 多策略并排对比
- [ ] 交易模板 - 常用交易快速录入模板

---

## 五、安全与健壮性

- [x] 输入校验 - 对 trade / method 的关键字段做基础校验（品种、方向、方法代码、名称）
- [x] tags JSON 解析 - `JSON.parse(row.tags)` 已用 try-catch 包裹，解析失败回退空数组并记录 warning
- [ ] 时区处理 - `entryTime` / `exitTime` 存储与展示的时区策略（暂未改动）

---

## 六、文档与工程

### 6.1 文档

- [x] IPC API 文档 - README 中新增主要 IPC 通道与 `window.electron` 映射的简要说明
- [x] 开发者排错 - README 中增加「开发排错小贴士」章节
- [x] CHANGELOG - README 中增加关键变更概览（完整记录仍查看 Git 历史）
- [x] 环境变量 - `.env.example` 中补充 `ACTIVATION_SERVER_URL` 的使用说明

### 6.2 CI/CD

- [x] 重复构建步骤 - `.github/workflows/build.yaml` 中 Rebuild 与 Make 已精简为各执行一次
- [x] 输出目录 - 仅保留 `out/**` 作为构建产物上传目标
- [ ] Windows 图标 - `MakerSquirrel` 的 `icon.ico` 在 macOS 构建时可能缺失（保留为后续检查项）

---

## 七、测试

- [ ] 单元测试 - 引入 Vitest，为 handlers、hooks、API 层编写基础测试
- [ ] 集成测试 - 未配置
- [ ] E2E 测试 - 未配置

---

## 八、国际化与无障碍

- [ ] i18n - 当前全中文，如需多语言可引入 react-i18next
- [ ] ARIA / 键盘导航 - 关键流程增加无障碍支持
- [ ] 屏幕阅读器支持 - 未实现

---

## 九、日志

- [ ] 结构化日志 - 使用 electron-log 等，支持按级别输出
- [ ] 日志级别 - 未实现
- [ ] 用户可查看日志 - 可选日志查看界面

---

## 优先级速查

| 优先级 | 项目 |
|--------|------|
| P0 | 数据迁移源路径、useTrades 响应、window.electron 检查、SQLite 外键 |
| P1 | 截图功能、日期筛选、设置页版本、cleanupDirtyMethods |
| P2 | 错误提示、批量删除确认、激活重试、性能优化 |
| P3 | 数据导出/导入、深色模式、测试、文档 |
