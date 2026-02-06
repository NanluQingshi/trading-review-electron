# 📊 交易复盘统计系统

> 基于 Electron 的本地化交易复盘和数据统计平台，帮助您系统地记录和分析交易数据

[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-40.x-blue.svg)](https://www.electronjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ 特性

- 🎯 **三大核心功能** - Method 库、交易复盘、数据统计
- 📊 **数据可视化** - 多种图表展示交易数据
- 💾 **本地存储** - 数据存储在本地，无需外部数据库
- 🎨 **美观界面** - 基于 Ant Design 的专业 UI
- 🚀 **桌面应用** - 基于 Electron，跨平台运行
- 🎯 **精准统计** - 详细的交易数据统计和分析
- 📷 **截图功能** - 支持为交易添加截图（即将推出）

---

## 🚀 快速开始

### 1. 环境准备

确保您的系统中已安装：

- **Node.js** (v18+)

### 2. 安装依赖

```bash
# 在项目根目录下安装依赖
npm install
```

### 3. 启动开发环境

```bash
# 在项目根目录下启动开发服务器
npm run start
```

### 4. 构建应用

```bash
# 在项目根目录下构建应用
npm run make
```

构建产物将生成在 `dist/make` 目录下。

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
- ✅ 支持交易截图（即将推出）

### 3. 我的统计 📈

多维度数据分析

- ✅ 核心指标展示（胜率、盈亏、盈亏因子等）
- ✅ 可视化图表（盈亏曲线、饼图、柱状图）
- ✅ 按货币对统计交易表现
- ✅ 按方法统计交易表现
- ✅ 方法对比分析

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

- **Axios** - HTTP 客户端
- **Dayjs** - 日期处理
- **Better-SQLite3** - 本地数据库

---

## 📁 项目结构

```
trading-review-electron/
├── electron/             # Electron 主进程和预加载脚本
│   ├── db/              # 数据库相关
│   │   └── schema.sql   # 数据库表结构
│   ├── main.ts          # 主进程入口
│   └── preload.ts       # 预加载脚本
├── src/                 # React 应用源码
│   ├── components/      # 组件
│   │   ├── methods/     # 方法相关组件
│   │   ├── stats/       # 统计相关组件
│   │   └── trades/      # 交易相关组件
│   ├── hooks/           # 自定义 Hooks
│   ├── pages/           # 页面组件
│   ├── services/        # API 服务
│   ├── types/           # TypeScript 类型定义
│   └── App.tsx          # 应用主组件
├── styles/              # 全局样式
├── assets/              # 静态资源
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript 配置
├── vite.main.config.ts  # Vite 主进程配置
├── vite.preload.config.ts # Vite 预加载配置
├── vite.renderer.config.ts # Vite 渲染进程配置
├── forge.config.ts      # Electron Forge 配置
└── README.md            # 项目说明
```

---

## 🔧 常用命令

### 开发环境

```bash
# 在项目根目录下

# 安装依赖
npm install

# 启动开发服务器
npm run start

# 运行 ESLint 检查
npm run lint
```

### 构建和打包

```bash
# 在项目根目录下

# 构建应用
npm run make

# 仅打包应用
npm run package
```

---

## 📊 数据说明

### 当前版本 (v1.0.0)

- **本地存储**：数据存储在本地 SQLite 数据库中
- **API 支持**：可配置连接外部 API 服务
- **模块化设计**：可轻松扩展数据存储方式

### 数据库表结构

- **trades** - 交易记录表
- **methods** - 交易方法表

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

---

## 🎉 开始使用

```bash
npm install
npm run start
```

**祝您交易顺利！** 🚀📈💰