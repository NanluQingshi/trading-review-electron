/**
 * 激活码验证服务器（SQLite 持久化）
 * 运行: cd server && npm start
 * 默认端口: 3001
 *
 * 数据库文件: server/data/activation.db
 * 使用前请在 .env 中设置:
 * ACTIVATION_SERVER_URL=http://localhost:3001/api/activate
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

  db.exec(`
    CREATE TABLE IF NOT EXISTS activation_codes (
      code TEXT PRIMARY KEY,
      used INTEGER DEFAULT 0,
      used_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 若表为空，插入默认演示激活码
  const count = db.prepare('SELECT COUNT(*) as n FROM activation_codes').get();
  if (count.n === 0) {
    const insert = db.prepare(
      'INSERT INTO activation_codes (code) VALUES (?)',
    );
    const defaultCodes = [
      'TR-2026-DEMO-001',
      'TR-2026-DEMO-002',
      'TR-2026-DEMO-003',
    ];
    for (const code of defaultCodes) {
      insert.run(code);
    }
    console.log('已初始化默认激活码:', defaultCodes.join(', '));
  }

  return db;
}

const db = initDatabase();

app.post('/api/activate', (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      message: '请提供有效的激活码',
    });
  }

  const trimmedCode = code.trim();

  try {
    const row = db
      .prepare('SELECT code, used FROM activation_codes WHERE code = ?')
      .get(trimmedCode);

    if (!row) {
      return res.status(400).json({
        success: false,
        message: '激活码无效',
      });
    }

    if (row.used === 1) {
      return res.status(400).json({
        success: false,
        message: '该激活码已被使用',
      });
    }

    db.prepare(
      'UPDATE activation_codes SET used = 1, used_at = datetime("now") WHERE code = ?',
    ).run(trimmedCode);

    return res.json({
      success: true,
      message: '激活成功',
    });
  } catch (err) {
    console.error('激活验证异常:', err);
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
