/**
 * 激活码验证服务器（SQLite 持久化）
 * 运行: cd server && npm start
 * 默认端口: 3001
 *
 * 数据库文件: server/data/activation.db
 * App 端 .env 配置 base URL: ACTIVATION_SERVER_URL=http://localhost:3001
 */
const path = require('path');
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

// 数据库路径
const DB_PATH = path.join(__dirname, 'data', 'activation.db');

// 初始化数据库
function initDatabase() {
  const fs = require('fs');
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // 检查是否为旧表结构（无 id 列），需要迁移
  const tableInfo = db.prepare("PRAGMA table_info(activation_codes)").all();
  const hasIdColumn = tableInfo.some((col) => col.name === "id");

  if (tableInfo.length > 0 && !hasIdColumn) {
    // 迁移：旧表 -> 新表（事务保证原子性）
    const migrate = db.transaction(() => {
      db.exec(`
        CREATE TABLE activation_codes_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          used INTEGER DEFAULT 0,
          used_at TEXT,
          used_ip TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);
      db.exec(`
        INSERT INTO activation_codes_new (code, used, used_at, created_at)
        SELECT code, used, used_at, created_at FROM activation_codes
      `);
      db.exec(`DROP TABLE activation_codes`);
      db.exec(`ALTER TABLE activation_codes_new RENAME TO activation_codes`);
    });
    migrate();
    console.log("已迁移激活码表结构（添加 id、used_ip 列）");
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS activation_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      used INTEGER DEFAULT 0,
      used_at TEXT,
      used_ip TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 若表为空，插入默认演示激活码
  const count = db.prepare("SELECT COUNT(*) as n FROM activation_codes").get();
  if (count.n === 0) {
    const insert = db.prepare(
      "INSERT INTO activation_codes (code) VALUES (?)",
    );
    const defaultCodes = [
      "TR-2026-DEMO-001",
      "TR-2026-DEMO-002",
      "TR-2026-DEMO-003",
    ];
    for (const code of defaultCodes) {
      insert.run(code);
    }
    console.log("已初始化默认激活码:", defaultCodes.join(", "));
  }

  return db;
}

const db = initDatabase();

app.post('/api/activate', (req, res) => {
  const { code } = req.body;
  const time = new Date().toLocaleString('zh-CN');
  const proto = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${process.env.PORT || 3001}`;
  const url = `${proto}://${host}${req.originalUrl || '/api/activate'}`;

  if (!code || typeof code !== 'string') {
    console.log(`[${time}] 激活请求 - URL: ${url} - 无效: 未提供激活码`);
    return res.status(400).json({
      success: false,
      message: '请提供有效的激活码',
    });
  }

  const trimmedCode = code.trim();
  console.log(`[${time}] 激活请求 - URL: ${url} - 激活码: ${trimmedCode}`);

  try {
    const row = db
      .prepare('SELECT code, used FROM activation_codes WHERE code = ?')
      .get(trimmedCode);

    if (!row) {
      console.log(`[${time}] 激活失败 - 激活码无效: ${trimmedCode}`);
      return res.status(400).json({
        success: false,
        message: '激活码无效',
      });
    }

    if (row.used === 1) {
      console.log(`[${time}] 激活失败 - 已被使用: ${trimmedCode}`);
      return res.status(400).json({
        success: false,
        message: "该激活码已被使用",
      });
    }

    // 获取客户端 IP（支持代理场景）
    const clientIp =
      req.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.get("x-real-ip") ||
      req.ip ||
      req.socket?.remoteAddress ||
      "";

    db.prepare(
      "UPDATE activation_codes SET used = 1, used_at = datetime('now'), used_ip = ? WHERE code = ?",
    ).run(clientIp, trimmedCode);

    console.log(`[${time}] 激活成功 ✓ ${trimmedCode} (IP: ${clientIp})`);
    return res.json({
      success: true,
      message: '激活成功',
    });
  } catch (err) {
    console.error(`[${time}] 激活验证异常:`, err);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`激活服务运行在 http://localhost:${PORT}`);
  console.log(`数据库: ${DB_PATH}`);
});
