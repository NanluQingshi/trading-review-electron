/*
 * @Author: 南路情诗
 * @Date: 2026-01-21
 * @Email: nanluqingshi@gmail.com
 * @版权声明：© 2026 南路情诗 保留所有权利
 */
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// 创建数据库目录
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.join(dbDir, 'trading.db');

// 打开数据库连接
const openDb = async () => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
};

// 初始化数据库连接
let db = null;

const initDb = async () => {
  if (!db) {
    db = await openDb();
    
    // 启用外键约束
    await db.exec('PRAGMA foreign_keys = ON');
    
    // 创建表结构
    await createTables();
  }
  return db;
};

// 创建表结构
const createTables = async () => {
  // 创建 methods 表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS methods (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      is_default INTEGER DEFAULT 0,
      usage_count INTEGER DEFAULT 0,
      win_rate REAL DEFAULT 0,
      total_pnl REAL DEFAULT 0
    )
  `);

  // 创建 trades 表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      direction TEXT CHECK (direction IN ('long', 'short')) NOT NULL,
      entryPrice REAL,
      exitPrice REAL,
      entryTime TEXT,
      exitTime TEXT,
      lots REAL,
      profit REAL,
      expectedProfit REAL DEFAULT NULL,
      methodId TEXT,
      methodName TEXT NOT NULL,
      notes TEXT,
      tags TEXT DEFAULT '[]',
      result TEXT CHECK (result IN ('win', 'loss', 'breakeven')),
      FOREIGN KEY (methodId) REFERENCES methods(id) ON DELETE SET NULL
    )
  `);
};

// 执行查询
const executeQuery = async (sql, params = []) => {
  const connection = await initDb();
  const stmt = await connection.prepare(sql);
  const result = await stmt.all(params);
  return [result];
};

// 执行插入，模拟 mysql2/promise 的接口
const executeInsert = async (sql, params = []) => {
  const connection = await initDb();
  const stmt = await connection.prepare(sql);
  const result = await stmt.run(params);
  return [{ insertId: result.lastID }];
};

// 执行更新
const executeUpdate = async (sql, params = []) => {
  const connection = await initDb();
  const stmt = await connection.prepare(sql);
  const result = await stmt.run(params);
  return [{ affectedRows: result.changes }];
};

// 执行删除
const executeDelete = async (sql, params = []) => {
  const connection = await initDb();
  const stmt = await connection.prepare(sql);
  const result = await stmt.run(params);
  return [{ affectedRows: result.changes }];
};

// 模拟 mysql2/promise 的 pool 接口
const pool = {
  query: async (sql, params = []) => {
    if (sql.trim().startsWith('INSERT')) {
      return executeInsert(sql, params);
    } else if (sql.trim().startsWith('UPDATE')) {
      return executeUpdate(sql, params);
    } else if (sql.trim().startsWith('DELETE')) {
      return executeDelete(sql, params);
    } else {
      return executeQuery(sql, params);
    }
  }
};

module.exports = pool;