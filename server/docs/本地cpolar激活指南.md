# 本地电脑 + cpolar 激活指南

用你自己的电脑作为激活服务器，通过 cpolar 暴露到公网，让其他人用你发放的激活码激活 App。cpolar 为国内服务，相比 ngrok 在国内网络下更稳定。

---

## 一、前置准备

- 已安装 Node.js（v18+）
- 已安装 cpolar（[官网](https://www.cpolar.com) 注册后按指引安装）
- 你的电脑能联网

---

## 二、操作步骤

### 步骤 1：启动激活服务器

在项目根目录打开终端：

```bash
cd server
npm install
npm start
```

看到 `Server running on port 3001` 即成功。**保持此终端窗口不要关闭。**

---

### 步骤 2：启动 cpolar

**新开一个终端窗口**，执行：

```bash
cpolar http 3001
```

终端会显示类似：

```
Forwarding   http://xxxx-xx-xx.cpolar.top -> http://localhost:3001
```

**复制这个 `http://xxxx....cpolar.top` 地址**（不要带末尾斜杠）。cpolar 免费版可能使用 `http` 或 `https`，以实际显示为准。

---

### 步骤 3：配置 App 的激活地址

在项目根目录找到 `.env` 文件（没有则复制 `.env.example` 为 `.env`），配置**服务器 base URL**（不含接口路径，`/api/activate` 在代码中）：

```env
ACTIVATION_SERVER_URL=http://你的cpolar地址.cpolar.top
```

例如：

```env
ACTIVATION_SERVER_URL=http://2ac15c44.r28.cpolar.top
```

---

### 步骤 3.5：本机测试（推荐在打包前执行）

在打包发给对方之前，先验证 cpolar 地址和激活码是否可用。

**方式一：用 curl 测试 API**

将 `你的cpolar地址` 替换为实际地址，执行：

```bash
# 激活接口路径 /api/activate 在服务端定义
curl -X POST http://你的cpolar地址.cpolar.top/api/activate \
  -H "Content-Type: application/json" \
  -d '{"code":"TR-2026-DEMO-001"}'
```

- **成功**：返回 `{"success":true,"message":"激活成功"}` → 说明 cpolar 和激活服务都正常
- **失败**：返回 `{"success":false,"message":"激活码无效"}` 或 `"该激活码已被使用"` → 检查激活码是否在 `server/data/activation.db` 中且未使用
- **连接失败**：检查激活服务器和 cpolar 是否都在运行

**方式二：用 App 端到端测试**

1. 确保 `.env` 中已配置 cpolar 地址（步骤 3 已完成）
2. 在项目根目录执行 `npm start` 启动开发版 App
3. 在激活页面输入 `TR-2026-DEMO-001`，点击激活
4. 若提示「激活成功」，说明整套流程正常，可以放心打包发给对方

> 注意：用 curl 测试会消耗一个激活码（一次生效），若需保留该码给他人，可先在数据库中插入新的测试码，或用 `TR-2026-DEMO-002`、`TR-2026-DEMO-003` 测试。

---

### 步骤 4：打包 App

**打包前确认** `.env` 中已配置 cpolar 地址（步骤 3），该值会写入打包产物。

在项目根目录执行：

```bash
npm run make
```

打包完成后，在 `out/` 或 `dist/` 目录找到对应平台的安装包（.dmg / .exe / .zip 等）。

---

### 步骤 5：发给对方

将安装包发给对方，并告知对方激活码（默认预置：`TR-2026-DEMO-001`、`TR-2026-DEMO-002`、`TR-2026-DEMO-003`）。

---

### 步骤 6：对方激活

对方安装 App 后，在激活页面输入激活码，点击激活即可。App 会通过 cpolar 请求你电脑上的激活服务完成验证。

---

## 三、注意事项

| 事项 | 说明 |
|------|------|
| **保持运行** | 激活时，你的「激活服务器」和「cpolar」必须同时运行，否则对方无法激活 |
| **URL 变化** | 免费版 URL 为随机临时地址，重启后**可能**不变（会保持一段时间），超过一定周期（如 24 小时）后可能重新分配 |
| **URL 变了怎么办** | 若 URL 变化，重新执行步骤 2～4 获取新 URL、更新 `.env`、重新打包，再发给对方 |
| **新增激活码** | 在 `server/data/activation.db` 的 `activation_codes` 表中插入新 `code` 即可 |

---

## 四、快速检查

| 检查项 | 命令 |
|--------|------|
| 激活服务是否运行 | `curl http://localhost:3001/api/activate` 应返回 400（正常） |
| cpolar 是否正常 | 浏览器访问 `http://你的cpolar地址.cpolar.top/api/activate`，应返回 400 或错误信息（说明能连通） |

---

## 五、常见问题

**Q：对方说「网络连接失败」？**  
A：1）确认激活服务器和 cpolar 都在运行，且 cpolar 的 URL 与 `.env` 中一致；2）检查防火墙或网络。

**Q：激活码无效？**  
A：检查 `server/data/activation.db` 中 `activation_codes` 表是否有该 code，且 `used=0`。

**Q：cpolar 免费版够用吗？**  
A：够用。URL 重启后可能保持不变，超过一定周期后才会重新分配，平时一直开着即可。
