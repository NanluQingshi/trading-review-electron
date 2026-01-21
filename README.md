# 📊 交易复盘统计系统

> 本地化的交易复盘和数据统计平台，帮助您系统地记录和分析交易数据

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Commercial-yellow.svg)](LICENSE)

---

## ✨ 特性

- 🎯 **三大核心功能** - Method 库、交易复盘、数据统计
- 📊 **数据可视化** - 多种图表展示交易数据
- 💾 **持久化存储** - 接入 MySQL 数据库，数据永久保存
- 🎨 **美观界面** - 基于 Ant Design 的专业 UI
- 🚀 **开箱即用** - 包含初始化脚本，快速迁移数据
- 📱 **响应式设计** - 适配不同屏幕尺寸

---

## 🚀 快速开始

### 1. 环境准备

确保您的系统中已安装：

- **Node.js** (v14+)
- **MySQL** (v8.0+)

### 2. 数据库配置

1. 进入 `server` 目录，根据 `.env.example`（或直接编辑 `.env`）配置您的数据库信息：

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=您的密码
   DB_NAME=trading-review-system
   DB_PORT=3306
   ```

2. 初始化数据库（创建表结构并导入初始数据）：

   ```bash
   cd server
   node init-db.js
   ```

### 3. 启动项目

```bash
# 在根目录下安装所有依赖
npm run install-all

# 启动开发服务器（前后端同时启动）
npm run dev
```

然后访问：http://localhost:3000

---

## 📚 核心功能

### 1. Method 库管理 📚

管理您的交易方法库

- ✅ 创建、编辑、删除交易方法
- ✅ 按分类组织（趋势、震荡、形态等）
- ✅ 记录详细的交易规则
- ✅ 追踪每个方法的胜率

### 2. 交易复盘 📊

详细记录每笔交易

- ✅ 记录交易的所有细节
- ✅ 关联使用的交易方法
- ✅ 添加交易笔记和标签
- ✅ 分类管理（盈利/亏损/保本）

### 3. 我的统计 📈

多维度数据分析

- ✅ 核心指标展示（胜率、盈亏、盈亏因子等）
- ✅ 可视化图表（曲线、饼图、柱状图）
- ✅ 按货币对统计
- ✅ 按方法统计

---

## 🛠️ 技术栈

### 前端

- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全
- **Ant Design** - 企业级 UI 组件库
- **Recharts** - 数据可视化
- **React Router** - 路由管理

### 后端

- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **MySQL 8.0** - 关系型数据库
- **mysql2** - 高性能 MySQL 驱动

---

## 📁 项目结构

```
trading-review-system/
├── client/                 # React 前端
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API 服务
│   │   └── types/         # TypeScript 类型
│   └── package.json
├── server/                # Node.js 后端
│   ├── db.js             # 数据库连接池配置
│   ├── init-db.js        # 数据库初始化脚本
│   ├── routes/           # API 路由
│   ├── .env              # 数据库环境变量
│   └── package.json
├── start.sh              # 快速启动脚本
├── test-api.sh          # API 测试脚本
└── README.md            # 项目说明
```

---

## 📊 数据说明

### 当前版本 (v1.1.0)

- **MySQL 持久化**：所有交易数据和方法库均存储在 MySQL 中。
- **数据安全**：支持通过环境变量配置敏感信息。
- **高性能统计**：利用 SQL 聚合查询优化统计报表生成。

---

## 🔧 常用命令

```bash
# 安装所有依赖
npm run install-all

# 初始化数据库
node server/init-db.js

# 启动开发服务器（前后端）
npm run dev

# 单独启动后端
npm run server

# 单独启动前端
npm run client
```

---

## 🌐 访问地址

- **前端界面**: http://localhost:3000
- **后端 API**: http://localhost:5050/api
- **健康检查**: http://localhost:5050/api/health

---

## 🤝 贡献

欢迎提出建议和反馈！

---

## ©️ 版权声明

- **作者**: 南路情诗
- **邮箱**: nanluqingshi@gmail.com
- **版权**: © 2026 南路情诗 保留所有权利
- **使用条款**: 未经授权，不得复制、修改、分发或用于商业目的

---

## 🙏 致谢

- 灵感来源：[PriceActionHub](https://pahubcn.com)
- UI 组件：[Ant Design](https://ant.design/)
- 图表库：[Recharts](https://recharts.org/)

---

## 🎉 开始使用

```bash
./start.sh
```

**祝您交易顺利！** 🚀📈💰
