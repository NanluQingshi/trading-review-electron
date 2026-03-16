# 📊 交易复盘统计系统 (TradingReview)

> 基于 Electron 的本地化交易复盘和数据统计平台，帮助您系统地记录和分析交易数据

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-40.x-blue.svg)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ 特性

- 🎯 **三大核心功能** - Method 库、交易复盘、数据统计
- 📊 **数据可视化** - 多种图表展示交易数据
- 💾 **本地存储** - 数据存储在本地 SQLite，支持自定义存储路径
- 🎨 **美观界面** - 基于 Ant Design 6 的专业 UI
- 🚀 **桌面应用** - 基于 Electron，支持 macOS / Windows
- 🎯 **精准统计** - 详细的交易数据统计和分析
- 🔐 **激活机制** - 激活码一次性激活，激活后可离线使用
- ⚙️ **灵活配置** - 设置页面支持数据路径迁移
- 📷 **截图功能** - 支持为交易添加截图（开发中）

---

## 🚀 快速开始

### 1. 环境准备

确保您的系统中已安装：

- **Node.js** (v18+)

### 2. 配置环境变量

```bash
# 复制环境变量模板（.env 含敏感配置，已加入 .gitignore，不会提交到 Git）
cp .env.example .env

# 编辑 .env，填入激活服务器地址等配置
```

### 3. 安装依赖

```bash
# 在项目根目录下安装依赖
npm install
```

### 4. 启动开发环境

```bash
# 在项目根目录下启动开发服务器
npm run start
```

### 5. 构建应用

```bash
# 在项目根目录下构建应用
npm run make
```

构建产物将生成在 `out` 或 `dist` 目录下。

### 6. 首次使用

应用首次启动需要输入激活码完成激活，激活成功后即可离线使用。激活服务器配置请参考 [server/docs/激活服务器配置说明.md](server/docs/激活服务器配置说明.md)。

---

## 📚 核心功能

### 1. Method 库管理 📚

管理您的交易方法库

- ✅ 创建、编辑、删除交易方法
- ✅ 记录详细的交易规则
- ✅ 追踪每个方法的胜率和盈亏
- ✅ 可视化展示方法表现

### 2. 交易复盘 📊

详细记录每笔交易

- ✅ 记录交易的所有细节（品种、方向、价格、时间等）
- ✅ 关联使用的交易方法
- ✅ 添加交易笔记和标签
- ✅ 分类管理（盈利/亏损/保本）
- ✅ 筛选和搜索交易记录
- ✅ 支持交易截图（开发中）

### 3. 我的统计 📈

多维度数据分析

- ✅ 核心指标展示（胜率、盈亏、盈亏因子等）
- ✅ 可视化图表（盈亏曲线、饼图、柱状图）
- ✅ 按货币对统计交易表现
- ✅ 按方法统计交易表现
- ✅ 方法对比分析

### 4. 设置 ⚙️

应用配置管理

- ✅ 自定义数据存储路径
- ✅ 数据迁移（更换存储位置时）
- ✅ 恢复默认存储位置

---

## 🛠️ 技术栈

### 主框架

- **Electron 40** - 桌面应用框架
- **React 19** - 现代化 UI 框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具

### UI 和可视化

- **Ant Design 6** - 企业级 UI 组件库
- **Ant Design Icons** - 图标库
- **Recharts** - 数据可视化图表库

### 路由和状态管理

- **React Router 7** - 路由管理
- **自定义 Hooks** - 状态管理

### 工具库

- **Dayjs** - 日期处理
- **Better-SQLite3** - 本地数据库
- **dotenv** - 环境变量配置

---

## 📁 项目结构

```
trading-review-electron/
├── electron/             # Electron 主进程
│   ├── db/              # 数据库相关
│   │   ├── instance.ts  # 数据库实例
│   │   └── schema.sql   # 数据库表结构
│   ├── handlers/        # IPC 处理器
│   │   ├── tradeHandlers.ts
│   │   ├── methodHandlers.ts
│   │   ├── statsHandlers.ts
│   │   └── activationHandler.ts
│   ├── config.ts        # 配置（数据路径等）
│   ├── main.ts          # 主进程入口
│   └── preload.ts       # 预加载脚本
├── src/                 # React 应用源码
│   ├── components/      # 组件
│   │   ├── methods/     # 方法相关组件
│   │   ├── stats/       # 统计相关组件
│   │   └── trades/      # 交易相关组件
│   ├── hooks/           # 自定义 Hooks
│   ├── pages/           # 页面组件
│   │   ├── ActivationPage.tsx  # 激活页面
│   │   ├── SettingsPage.tsx    # 设置页面
│   │   └── ...
│   ├── services/        # API 服务
│   ├── types/           # TypeScript 类型定义
│   └── App.tsx          # 应用主组件
├── server/              # 激活服务器（可选部署）
│   ├── activation-server.js
│   └── docs/            # 服务器部署文档
├── docs/                # 使用说明
│   ├── macOS使用说明.txt
│   └── Windows使用说明.txt
├── script/              # 辅助脚本
│   └── fix-tradingreview.command  # macOS 权限修复工具
├── styles/              # 全局样式
├── assets/              # 静态资源
├── .github/workflows/   # CI/CD 构建配置
├── package.json        # 项目配置
├── forge.config.ts     # Electron Forge 配置
└── README.md           # 项目说明
```

---

## 🔧 常用命令

### 开发环境

```bash
# 在项目根目录下

# 安装依赖
npm install

# 重新编译原生模块（better-sqlite3）
npm run rebuild

# 启动开发服务器
npm run start

# 运行 ESLint 检查
npm run lint
```

### 构建和打包

```bash
# 在项目根目录下

# 构建应用（生成安装包）
npm run make

# 仅打包应用（不生成安装包）
npm run package
```

---

## 📊 数据说明

### 当前版本 (v1.0.0)

- **本地存储**：数据存储在本地 SQLite 数据库中
- **自定义路径**：可在设置中指定数据存储位置
- **激活机制**：首次使用需联网激活，激活后可离线使用
- **模块化设计**：可轻松扩展数据存储方式

### 数据库表结构

- **trades** - 交易记录表（含 screenshot 字段，截图功能开发中）
- **methods** - 交易方法表

### 激活服务器

如需自建激活服务，请参考：

- [激活服务器配置说明](server/docs/激活服务器配置说明.md) - 接口规范与配置
- [本地 cpolar 激活指南](server/docs/本地cpolar激活指南.md) - 用本机 + cpolar 快速搭建（推荐小规模使用，国内网络更稳定）
- [云服务器部署指南](server/docs/云服务器部署指南.md) - 部署到阿里云/腾讯云等

---

## 📦 安装包使用说明

从 [Releases](https://github.com/NanluQingshi/trading-review-electron/releases) 下载安装包后：

- **macOS**：请参考 [docs/macOS使用说明.txt](docs/macOS使用说明.txt)，首次安装需运行 `fix-tradingreview.command` 修复权限
- **Windows**：请参考 [docs/Windows使用说明.txt](docs/Windows使用说明.txt)

---

## 🔌 IPC 通信说明（简要）

主进程通过 `ipcMain.handle` 暴露以下通道，预加载脚本 `preload.ts` 通过 `window.electron` 封装为前端可调用的 API：

- `app:version` → `window.electron.getAppVersion()`
- 交易：
  - `trades:list` → `window.electron.trades.list(filters?)`
  - `trades:detail` → `window.electron.trades.detail(id)`
  - `trades:create` → `window.electron.trades.create(trade)`
  - `trades:update` → `window.electron.trades.update(id, trade)`
  - `trades:delete` → `window.electron.trades.delete(id)`
  - `trades:delete-batch` → `window.electron.trades.deleteBatch(ids)`
- 方法：
  - `methods:list` / `methods:detail` / `methods:create` / `methods:update` / `methods:delete` / `methods:delete-batch`
  - `methods:default` / `methods:set-default`
- 统计：
  - `stats:overall` / `stats:methods` / `stats:symbols` / `stats:time-period` / `stats:profit-curve`
- 激活：
  - `activation:getStatus` / `activation:verify`
- 设置：
  - `settings:get-data-path` / `settings:set-data-path` / `settings:clear-data-path` / `settings:select-data-path` / `settings:migrate-data`

更详细的入参/出参可参考对应的 `electron/handlers/*.ts` 文件。

---

## 🧩 开发排错小贴士

常见问题及排查步骤：

1. **App 无法启动 / 白屏**
   - 在终端运行 `npm start`，查看主进程错误日志。
   - 确认 `better-sqlite3` 已在当前系统上重新编译（`npm run rebuild`）。
2. **交易/方法页面无数据**
   - 确认数据库文件存在：
     - macOS：`~/Library/Application Support/TradingReview/trading.db`
     - Windows：`%APPDATA%/TradingReview/trading.db`
   - 终端查看是否有「数据库初始化失败」或 SQL 报错。
3. **激活失败**
   - 本地测试：`curl -X POST http://localhost:3001/api/activate ...`
   - 云服务器：确认安全组放行 3001 端口，`ACTIVATION_SERVER_URL` 指向正确地址。
4. **CI 构建失败**
   - 检查 GitHub Actions 日志中 `npm ci` / `npm run rebuild` 步骤。
   - 确认仓库 Secrets 中已配置 `ACTIVATION_SERVER_URL`。

---

## 📝 变更记录（简要）

完整变更记录请查看 Git 提交历史，以下为关键演进点概览：

- v1.0.0：初始版本，包含方法库、交易记录、统计分析、激活功能。
- 之后版本：
  - 增加云激活服务器及本地/云部署文档。
  - 引入激活服务器地址的 `.env` / GitHub Secrets 配置。
  - 补充交易筛选（日期范围）、错误信息优化、基础输入校验等。

后续如有重大特性变更，可考虑单独维护 `CHANGELOG.md`。

---

## 🖥️ 应用架构

### 主进程 (Main Process)

- 负责创建和管理 BrowserWindow 实例
- 处理系统级事件
- 提供 API 给渲染进程
- 管理本地数据库

### 渲染进程 (Renderer Process)

- React 应用运行的地方
- 负责 UI 渲染和用户交互
- 通过预加载脚本与主进程通信

### 预加载脚本 (Preload Script)

- 在渲染进程加载前执行
- 安全地暴露 API 给渲染进程
- 提供主进程和渲染进程之间的通信桥梁

---

## 📁 路径别名配置

项目配置了以下路径别名，方便开发：

- `@/` - 对应 `./src/`
- `@electron/` - 对应 `./electron/`
- `@styles/` - 对应 `./styles/`

---

## 🤝 贡献

欢迎提出建议和反馈！

---

## ©️ 版权声明

- **作者**: NanluQingshi
- **邮箱**: nanluqingshi@gmail.com
- **版权**: © 2026 NanluQingshi 保留所有权利
- **使用条款**: MIT 许可证

---

## 🙏 致谢

- UI 组件：[Ant Design](https://ant.design/)
- 图表库：[Recharts](https://recharts.org/)
- 开发框架：[Electron](https://www.electronjs.org/)
- 前端框架：[React](https://reactjs.org/)
- 构建工具：[Vite](https://vitejs.dev/)
- 打包工具：[Electron Forge](https://www.electronforge.io/)

---

## 🎉 开始使用

**开发者：**

```bash
npm install
npm run start
```

**普通用户：** 从 [Releases](https://github.com/NanluQingshi/trading-review-electron/releases) 下载对应平台的安装包，按 `docs/` 目录下的使用说明安装即可。

**祝您交易顺利！** 🚀📈💰